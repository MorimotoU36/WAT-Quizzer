import { ApiResponse } from '../../api'

export interface GetAnswerLogStatisticsAPIRequestDto {
  file_num?: number
  date_unit?: 'day' | 'week' | 'month' // TODO これは型作った方がいいか
}

//API側で受け取った時のDTO（Pipeで上に変換する）
export interface GetAnswerLogStatisticsAPIRequestReceivedDto {
  file_num: string
  date_unit: 'day' | 'week' | 'month'
}

// quiz/statisticsからの取得結果
export interface AnswerLogStatisticsApiResponse extends ApiResponse {
  date: string
  count: number
  accuracy_rate: number
}
