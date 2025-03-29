import { QuizStatisticsApiResponse } from '.'
import { defaultMessage, errorMessage, MESSAGES } from '../../..'
import { get, ProcessingApiReponse } from '../../api'

interface GetQuizStatisticsAPIProps {}

export const getQuizStatisticsDataAPI =
  async ({}: GetQuizStatisticsAPIProps) => {
    const result = await get(
      '/quiz/statistics',
      (data: ProcessingApiReponse) => {
        if (data.status === 404) {
          return { message: errorMessage(MESSAGES.ERROR.MSG00003) }
        } else if (data.status === 200) {
          const result: QuizStatisticsApiResponse[] =
            data.body as QuizStatisticsApiResponse[]
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
  }
