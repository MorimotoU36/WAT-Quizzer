/**
 * 全ファイルの平均行数を記録するバッチ
 */

import { prisma } from 'quizzer-lib'

// 引数チェック
if (process.argv.length !== 4) {
  console.error(
    `Error: Usage: npx ts-node ${__filename} (全ファイルの行数合計) (全ファイル数)`
  )
  process.exit(1)
} else if (isNaN(Number(process.argv[2]))) {
  console.error(`Error: ${process.argv[2]} は数字ではありません。`)
  process.exit(1)
} else if (isNaN(Number(process.argv[3]))) {
  console.error(`Error: ${process.argv[3]} は数字ではありません。`)
  process.exit(1)
}

const total_lines = Number(process.argv[2])
const total_files = Number(process.argv[3])

// 平均行数データ追加
;(async () => {
  await prisma.avg_lines_log.create({
    data: {
      avg_line: total_lines / total_files,
      total_lines,
      total_files
    }
  })
  console.log(`avg_lines Registered!: ${total_lines / total_files}`)
})()
