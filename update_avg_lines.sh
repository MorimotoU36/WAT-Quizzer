#!/bin/bash

#########################################################
## 全ファイルの行数平均値を取得し記録するシェル
## push前に自動で走るように.git/hooks/pre-pushに書き込むのが良い
#########################################################

echo "全ファイル平均行数計算 開始"

# 記録するファイル名
OUTPUT_FILE="average_lines.md"

# 無視するディレクトリ
IGNORE_DIRS=("node_modules/" "dist/" "/." "public/" ".log" "d.ts" "/out/" "/storybook-static" "/database-old" "/file" "/yaml" "cdk.out" ".json" ".md")

# 全ファイルの行数をカウントする関数
count_lines() {
    local file="$1"
    wc -l <"$file" | tr -d ' ' # 行数を取得
}

# 指定したディレクトリ以下のすべてのファイルを取得（無視リスト適用）
get_all_files() {
    find . -type f | while read -r file; do
        # 無視リストに含まれるディレクトリがパスにあればスキップ
        for ignore in "${IGNORE_DIRS[@]}"; do
            if [[ "$file" == *"$ignore"* ]]; then
                continue 2 # 次のファイルへ
            fi
        done
        echo "$file"
    done
}

# すべてのファイルの行数を計算
total_lines=0
file_count=0

while read -r file; do
    if [[ "$file" != "./$OUTPUT_FILE" ]]; then # average_lines.md 自身は除外
        lines=$(count_lines "$file")
        total_lines=$((total_lines + lines))
        file_count=$((file_count + 1))
    fi
done < <(get_all_files)

# 平均行数を計算
if [[ $file_count -eq 0 ]]; then
    average_lines=0
else
    average_lines=$((total_lines / file_count))
fi

# 平均行数をファイルに保存
echo "$(date "+%Y-%m-%d %H:%M:%S") 平均行数: ${average_lines} 行" >>"$OUTPUT_FILE"
echo "✅ $OUTPUT_FILE に平均行数を保存しました。"

# Git に追加 & コミット & プッシュ
git add "$OUTPUT_FILE"
git commit -m "Update average lines count"

echo "🚀 コミットしました。"
