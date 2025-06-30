export interface AuthSigninRequestDto {
  username: string
  password: string
}

// 返り値の型を定義
export type SignInSuccessResult = {
  status: 'SUCCESS'
  idToken: string
  accessToken: string
}

export type SignInNewPasswordRequiredResult = {
  status: 'NEW_PASSWORD_REQUIRED'
  session: string | null
  username: string
}

export type SignInResult = SignInSuccessResult | SignInNewPasswordRequiredResult
