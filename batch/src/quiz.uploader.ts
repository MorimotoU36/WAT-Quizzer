import * as fs from 'fs'
import * as path from 'path'
import 'dotenv/config'
export const baseURL: string = process.env.NEXT_PUBLIC_API_SERVER || ''
export const fileUploadPath: string =
  process.env.BATCH_QUIZ_FILE_UPLOAD_PATH || ''

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
  const file = fs.readFileSync(path.resolve(__dirname, inputFilePath))
  const formData = new FormData()
  formData.append('file', new Blob([file]))
  // TODO tokenなど実装してない！
  await fetch(baseURL + fileUploadPath, {
    method: 'POST',
    body: formData
  })
  console.log('Success!!')
  return true
})()
