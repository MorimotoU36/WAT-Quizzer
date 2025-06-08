import { errorMessage, MESSAGES, successMessage } from '../../../..'
import { ApiResult, post, ProcessingApiReponse } from '../..'
import { AuthSigninRequestDto } from './dto'

interface AuthSigninAPIProps {
  authSigninRequestData: AuthSigninRequestDto
}

export const authSigninAPI = async ({
  authSigninRequestData
}: AuthSigninAPIProps): Promise<ApiResult> => {
  const result = await post(
    '/auth/signin',
    authSigninRequestData,
    (data: ProcessingApiReponse) => {
      // TODO 型定義
      const result = data.body
      if (data.status === 200) {
        return {
          result,
          message: successMessage(MESSAGES.SUCCESS.MSG00020)
        }
      } else {
        return { result, message: errorMessage(MESSAGES.ERROR.MSG00016) }
      }
    },
    false
  )
  return result
}

export const authNewPasswordSigninAPI = async ({
  authSigninRequestData
}: AuthSigninAPIProps): Promise<ApiResult> => {
  const result = await post(
    '/auth/newpassword',
    authSigninRequestData,
    (data: ProcessingApiReponse) => {
      // TODO 型定義
      const result = data.body
      if (data.status === 200) {
        return {
          result,
          message: successMessage(MESSAGES.SUCCESS.MSG00020)
        }
      } else {
        return { result, message: errorMessage(MESSAGES.ERROR.MSG00016) }
      }
    }
  )
  return result
}
