import * as fs from 'fs'
import * as path from 'path'
import 'dotenv/config'
import { authSigninAPI } from 'quizzer-lib'
export const baseURL: string = process.env.NEXT_PUBLIC_API_SERVER || ''

// 引数チェック
if (process.argv.length !== 3) {
  console.error(
    'Error: Usage: npx ts-node src/quiz.uploader.ts (Input file name)'
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

// アップロード
;(async () => {
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

  // アップロード処理
  const file = fs.readFileSync(path.resolve(__dirname, inputFilePath))
  const formData = new FormData()
  formData.append('file', new Blob([file]))
  await fetch(baseURL + '/quiz/upload', {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${data.accessToken}`
    }
  })
  console.log('Success!!')
  return true
})()
