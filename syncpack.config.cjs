// syncpack.config.cjs
module.exports = {
  // ^ に揃えるとか
  semverRange: '^',
  // バージョン揃えの対象パッケージ（よく共通化したいもの）
  packages: [
    'package.json',
    'frontend-next/package.json',
    'backend-nest/package.json',
    'quizzer-lib/package.json',
    'batch/package.json'
  ]
}
