"""
英単語派生語取得 Lambda

GET /derivatives?word={word}

処理フロー:
  1. Wiktionary API で "Derived terms" セクションを取得・パース
  2. Free Dictionary API で各派生語の品詞を判定
  3. 品詞ごとにグループ化して返却

使用API（いずれも無料・APIキー不要）:
  - English Wiktionary MediaWiki API  : 環境変数 WIKTIONARY_API_URL
  - Free Dictionary API               : 環境変数 FREE_DICTIONARY_API_URL
"""

import json
import os
import re
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

# ── 定数 ──────────────────────────────────────────────────────────────────────

MAX_DERIVED_TERMS = 20   # 取得する派生語の上限
HTTP_TIMEOUT = 8         # 外部API呼び出しタイムアウト（秒）
POS_WORKERS = 5          # 品詞取得の並行数

# 外部APIのエンドポイント（環境変数から取得）
WIKTIONARY_API_URL = os.environ["WIKTIONARY_API_URL"]
FREE_DICTIONARY_API_URL = os.environ["FREE_DICTIONARY_API_URL"]

CORS_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
}

# 返却対象とする品詞（それ以外は "other" に分類）
TARGET_POS = {"noun", "verb", "adjective", "adverb"}


# ── HTTP ユーティリティ ────────────────────────────────────────────────────────

def fetch_json(url: str):
    """URLをGETしてJSONをパースして返す。失敗時はNone。"""
    try:
        req = urllib.request.Request(
            url,
        )
        with urllib.request.urlopen(req, timeout=HTTP_TIMEOUT) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"[fetch_json] {url} => {e}")
        return None


# ── Wiktionary: 派生語取得 ────────────────────────────────────────────────────

def get_derived_terms(word: str) -> list:
    """
    English Wiktionary の "Derived terms" セクションをパースして
    派生語リスト（小文字・英字のみ）を返す。
    """
    encoded = urllib.parse.quote(word)

    # 1. セクション一覧を取得して "Derived terms" のインデックスを収集
    sections_data = fetch_json(
        f"{WIKTIONARY_API_URL}"
        f"?action=parse&page={encoded}&prop=sections&format=json"
    )
    if not sections_data or "parse" not in sections_data:
        return []

    section_indices = [
        s["index"]
        for s in sections_data["parse"].get("sections", [])
        if "Derived terms" in s.get("line", "")
    ]
    if not section_indices:
        return []

    # 2. 各 "Derived terms" セクションの wikitext をパース
    terms: list = []
    seen: set = {word.lower()}

    for idx in section_indices[:3]:  # 最大3セクション（品詞別に分かれている場合に対応）
        wikitext_data = fetch_json(
            f"{WIKTIONARY_API_URL}"
            f"?action=parse&page={encoded}&section={idx}"
            f"&prop=wikitext&format=json"
        )
        if not wikitext_data or "parse" not in wikitext_data:
            continue

        wikitext = wikitext_data["parse"].get("wikitext", {}).get("*", "")

        # [[word]] 形式をパース
        for m in re.finditer(r"\[\[([^\]|#\n]+?)(?:\|[^\]]+)?\]\]", wikitext):
            _add_term(m.group(1), terms, seen)

        # {{l|en|word}} 形式をパース
        for m in re.finditer(r"\{\{l\|en\|([^}|\n]+?)(?:\|[^}]+)?\}\}", wikitext):
            _add_term(m.group(1), terms, seen)

        if len(terms) >= MAX_DERIVED_TERMS:
            break

    return terms[:MAX_DERIVED_TERMS]


def _add_term(raw: str, terms: list, seen: set) -> None:
    """正規化・バリデーションして terms に追加する。"""
    term = raw.strip().lower()
    if (
        term not in seen
        and re.match(r"^[a-z]+$", term)   # 英字のみ（ハイフン・スペース・数字を除外）
        and len(term) >= 2
    ):
        terms.append(term)
        seen.add(term)


# ── Free Dictionary API: 品詞判定 ─────────────────────────────────────────────

def get_pos(word: str) -> str:
    """
    Free Dictionary API で単語の品詞を取得する。
    noun / verb / adjective / adverb のいずれかを返し、
    該当しない場合は "other" を返す。
    """
    data = fetch_json(
        f"{FREE_DICTIONARY_API_URL}/{urllib.parse.quote(word)}"
    )
    if not data or not isinstance(data, list):
        return "other"

    for entry in data:
        for meaning in entry.get("meanings", []):
            pos = meaning.get("partOfSpeech", "").lower()
            if pos in TARGET_POS:
                return pos

    return "other"


def group_by_pos(terms: list) -> dict:
    """
    品詞ごとにグループ化する。
    Free Dictionary API を並行して呼び出すことで時間を短縮する。
    """
    pos_map: dict = {}

    with ThreadPoolExecutor(max_workers=POS_WORKERS) as executor:
        futures = {executor.submit(get_pos, t): t for t in terms}
        for future in as_completed(futures):
            term = futures[future]
            try:
                pos = future.result()
            except Exception:
                pos = "other"
            pos_map.setdefault(pos, []).append(term)

    # 各品詞内をアルファベット順にソート
    return {k: sorted(v) for k, v in sorted(pos_map.items())}


# ── Lambda ハンドラー ──────────────────────────────────────────────────────────

def handler(event, context):
    # CORS プリフライト
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    # クエリパラメータから word を取得
    params = event.get("queryStringParameters") or {}
    word = (params.get("word") or "").strip().lower()

    # バリデーション
    if not word:
        return _error(400, "word parameter is required")
    if not re.match(r"^[a-z]+$", word):
        return _error(400, "word must contain only English letters (a-z)")

    # 派生語を取得
    derived_terms = get_derived_terms(word)

    if not derived_terms:
        return _ok({
            "word": word,
            "derivatives": {},
            "message": "No derived terms found in Wiktionary",
        })

    # 品詞ごとにグループ化
    derivatives_by_pos = group_by_pos(derived_terms)

    return _ok({"word": word, "derivatives": derivatives_by_pos})


# ── レスポンスヘルパー ─────────────────────────────────────────────────────────

def _ok(body: dict) -> dict:
    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps(body, ensure_ascii=False),
    }


def _error(status: int, message: str) -> dict:
    return {
        "statusCode": status,
        "headers": CORS_HEADERS,
        "body": json.dumps({"error": message}),
    }
