import {
  errorMessage,
  GetQuizApiResponseDto,
  MESSAGES,
  successMessage
} from '../../..'
import { SearchQuizAPIRequestDto } from './dto'
import { ApiResult, get, ProcessingApiReponse } from '../../api'

interface SearchQuizButtonProps {
  searchQuizRequestData: SearchQuizAPIRequestDto
}

export const searchQuizAPI = async ({
  searchQuizRequestData
}: SearchQuizButtonProps): Promise<ApiResult> => {
  console.log('searchQuizRequestData', searchQuizRequestData)
  if (searchQuizRequestData.file_num === -1) {
    return { message: errorMessage(MESSAGES.ERROR.MSG00001) }
  }

  if (searchQuizRequestData.category === '-1') {
    delete searchQuizRequestData.category
  }
  const format_id = searchQuizRequestData.format_id
    ? Object.entries(searchQuizRequestData.format_id)
        .filter((x) => x[1])
        .map((x) => x[0])
        .join(',')
    : ''

  const result = await get(
    '/quiz/search',
    (data: ProcessingApiReponse) => {
      if (
        (String(data.status)[0] === '2' || String(data.status)[0] === '3') &&
        data.body
      ) {
        const result: GetQuizApiResponseDto[] =
          data.body as GetQuizApiResponseDto[]
        return {
          message: successMessage(
            MESSAGES.SUCCESS.MSG00015,
            String(result.length)
          ),
          result
        }
      } else if (data.status === 404 || data.body) {
        return { message: errorMessage(MESSAGES.ERROR.MSG00003) }
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    },
    {
      ...searchQuizRequestData,
      format_id
    }
  )
  return result
}
