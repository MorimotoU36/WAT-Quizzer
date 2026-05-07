import * as fs from 'fs'
import * as path from 'path'
import 'dotenv/config'
import { signInForBatch } from './tools/signin'
import { SignInSuccessResult } from 'quizzer-lib'
export const baseURL: string = process.env.NEXT_PUBLIC_API_SERVER || ''

/**
 * 入力した出典(ID)を入力した英単語（複数）へ一挙に登録するバッチ
 * 入力ファイルを読み込みAPIへ送信
 * （入力ファイルは１行目に出典ID、２行目以降に登録する単語名）
 */

// 引数チェック
const SAFE_MODE_OPTION = '--source-only'
if (process.argv.length < 3 || process.argv.length > 4) {
  console.error(
    `Error: Usage: npx ts-node src/englishword.source.register.ts (Input file name) [${SAFE_MODE_OPTION}]`
  )
  process.exit(1)
}
if (process.argv.length === 4 && process.argv[3] !== SAFE_MODE_OPTION) {
  console.error(
    `Error: Unknown option "${process.argv[3]}". Available option: ${SAFE_MODE_OPTION}`
  )
  process.exit(1)
}
const isSourceOnly = process.argv[3] === SAFE_MODE_OPTION

//  ファイル存在チェック
const inputFilePath = '../' + process.argv[2]
try {
  fs.statSync(path.resolve(__dirname, inputFilePath))
} catch (err) {
  if (err.code === 'ENOENT') {
    console.error(`Error: Input file "${inputFilePath}" is not found.`)
  } else {
    console.error(
      `Error: An error occured in checking "${inputFilePath}" file.`
    )
  }
  throw err
}

// 登録
;(async () => {
  fs.readFile(
    path.resolve(__dirname, inputFilePath),
    'utf8',
    async (err, data) => {
      if (err) {
        console.error('ファイルの読み込みに失敗しました:', err)
        return
      }

      // ファイルの内容を1行ごとに分割
      const lines = data.split(/\r?\n/).filter((line) => line.trim() !== '') // 空行を除外
      const sourceId = lines[0]
      const words = lines.slice(1)

      console.log(`読み込んだ行数: ${lines.length} 行`)
      // 送信
      try {
        // サインイン
        const res = await signInForBatch()
        const data = res.result as SignInSuccessResult

        const response = await fetch(baseURL + `/english/source/words`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.accessToken}`
          },
          body: JSON.stringify({
            sourceId,
            words
          })
        })

        const json = await response.json()

        if (isSourceOnly) {
          // --source-only 時: 各単語の結果を表示
          const registeredSet: string[] = json.registerWord ?? []
          const alreadySet: string[] = json.alreadyRegisteredWord ?? []
          const unregisteredSet: string[] = json.unregisteredWord ?? []

          console.log('\n--- 各単語の処理結果 ---')
          for (const word of words) {
            if (alreadySet.includes(word)) {
              console.log(`  [スキップ] ${word} … すでに出典に登録済み`)
            } else if (registeredSet.includes(word)) {
              console.log(`  [追加]     ${word} … 出典に追加しました`)
            } else if (unregisteredSet.includes(word)) {
              console.log(`  [スキップ] ${word} … 単語テーブルに未登録`)
            } else {
              console.log(`  [不明]     ${word}`)
            }
          }

          console.log('\n--- 集計 ---')
          console.log(`  出典に追加:       ${registeredSet.length} 件`)
          console.log(`  既に登録済み:     ${alreadySet.length} 件`)
          console.log(`  単語テーブル未登録: ${unregisteredSet.length} 件`)
        } else {
          console.log(`送信成功:`, json)
        }
      } catch (error) {
        console.error(`送信失敗: `, error.response?.data || error.message)
      }

      console.log('\n全データの送信が完了しました。')
    }
  )
  return true
})()
