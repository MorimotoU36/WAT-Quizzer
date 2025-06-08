import { defaultMessage, errorMessage, MESSAGES } from '../../../../..'
import { get, ApiResult, ProcessingApiReponse } from '../../..'
import { GetQuizFormatApiResponseDto } from './dto'

// quizzer各画面用 問題形式リストをapi通信して取ってくる
export const getQuizFormatListAPI = async (): Promise<ApiResult> => {
  const storageKey = 'quizFormatList'
  const savedFormatList = sessionStorage.getItem(storageKey)
  if (!savedFormatList) {
    const result = get(
      '/quiz/format',
      (data: ProcessingApiReponse) => {
        if (data.status === 200) {
          const result: GetQuizFormatApiResponseDto[] =
            data.body as GetQuizFormatApiResponseDto[]
          // session storageに保存
          sessionStorage.setItem(storageKey, JSON.stringify(result))
          return {
            message: defaultMessage(MESSAGES.DEFAULT.MSG00001),
            result
          }
        } else {
          return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
        }
      },
      {}
    )
    return result
  } else {
    // 既にsession storageに値が入っている場合はそれを利用する
    return {
      message: defaultMessage(MESSAGES.DEFAULT.MSG00001),
      result: JSON.parse(savedFormatList) as GetQuizFormatApiResponseDto[]
    }
  }
}
