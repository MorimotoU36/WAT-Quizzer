import { GetQuizAPIRequestDto, GetQuizApiResponseDto } from '.'
import { errorMessage, MESSAGES, successMessage } from '../../../..'
import { ApiResult, get, ProcessingApiReponse } from '../..'

interface GetQuizAPIProps {
  getQuizRequestData: GetQuizAPIRequestDto
  getQuizMethod?: 'random' | 'worstRate' | 'leastClear' | 'LRU' | 'review'
}

export const getQuizAPI = async ({
  getQuizRequestData,
  getQuizMethod
}: GetQuizAPIProps): Promise<ApiResult> => {
  if (getQuizRequestData.file_num === -1) {
    return { message: errorMessage(MESSAGES.ERROR.MSG00001) }
  } else if (
    !getQuizMethod &&
    (!getQuizRequestData.quiz_num || getQuizRequestData.quiz_num === -1)
  ) {
    return { message: errorMessage(MESSAGES.ERROR.MSG00002) }
  }
  if (getQuizRequestData.category === '-1') {
    delete getQuizRequestData.category
  }
  const format_id = getQuizRequestData.format_id
    ? Object.entries(getQuizRequestData.format_id)
        .filter((x) => x[1])
        .map((x) => x[0])
        .join(',')
    : ''

  const path =
    getQuizMethod === 'random'
      ? '/quiz/random'
      : getQuizMethod === 'worstRate'
      ? '/quiz/worst'
      : getQuizMethod === 'leastClear'
      ? '/quiz/minimum'
      : getQuizMethod === 'LRU'
      ? '/quiz/lru'
      : getQuizMethod === 'review'
      ? '/quiz/review'
      : getQuizMethod === 'todayNotAnswered'
      ? '/quiz/remaining'
      : '/quiz'
  const result = await get(
    path,
    (data: ProcessingApiReponse) => {
      if (data.status === 404) {
        return { message: errorMessage(MESSAGES.ERROR.MSG00003) }
      } else if (data.status === 200) {
        const result: GetQuizApiResponseDto = data.body as GetQuizApiResponseDto
        return {
          message: successMessage(MESSAGES.SUCCESS.MSG00001),
          result
        }
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    },
    { ...getQuizRequestData, format_id }
  )
  return result
}
