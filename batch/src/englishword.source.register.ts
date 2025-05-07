import * as fs from 'fs'
import * as path from 'path'
import 'dotenv/config'
import { authSigninAPI } from 'quizzer-lib'
export const baseURL: string = process.env.NEXT_PUBLIC_API_SERVER || ''

/**
 * 入力した出典(ID)を入力した英単語（複数）へ一挙に登録するバッチ
 * 入力ファイルを読み込みAPIへ送信
 * （入力ファイルは１行目に出典ID、２行目以降に登録する単語名）
 */

// 引数チェック
if (process.argv.length !== 3) {
  console.error(
    'Error: Usage: npx ts-node src/englishword.source.register.ts (Input file name)'
  )
  process.exit(1)
}

//  ファイル存在チェック
const inputFilePath = '../' + process.argv[2]
try {
  // TODO csvファイルパス指定　もっとわかりやすい方法、、
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
      // TODO tokenなど実装してない
      try {
        // サインイン
        // TODO この処理も別関数に置き換えたい 多分他バッチも同じ処理になるから
        const res = await authSigninAPI({
          authSigninRequestData: {
            username: process.env.USERNAME,
            password: process.env.PASSWORD
          }
        })
        // TODO 型定義する
        const data = res.result as any

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
        console.log(`✅ 送信成功:`, await response.json())
      } catch (error) {
        console.error(`❌ 送信失敗: `, error.response?.data || error.message)
      }

      console.log('📤 すべてのデータを送信しました。')
    }
  )
  return true
})()
