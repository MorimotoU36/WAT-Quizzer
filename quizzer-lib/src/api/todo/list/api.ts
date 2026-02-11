import { ApiResult, get, ProcessingApiReponse } from '../..'
import { GetTodoListApiResponseDto } from './dto'
import { errorMessage, MESSAGES, successMessage } from '../../../..'

interface GetTodoListAPIProps {
  getTodoListRequestData?: {}
}

export const getTodoListAPI = async ({
  getTodoListRequestData = {}
}: GetTodoListAPIProps): Promise<ApiResult> => {
  const result = await get(
    '/todo',
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: GetTodoListApiResponseDto[] = data.body as GetTodoListApiResponseDto[]
        return {
          message: successMessage(MESSAGES.SUCCESS.MSG00019),
          result
        }
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    }
  )
  return result
}
