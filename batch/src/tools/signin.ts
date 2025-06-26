import { authSigninAPI } from 'quizzer-lib'

// 各バッチ用のサインイン関数
export const signInForBatch = async () =>
  await authSigninAPI({
    authSigninRequestData: {
      username: process.env.USERNAME,
      password: process.env.PASSWORD
    }
  })
