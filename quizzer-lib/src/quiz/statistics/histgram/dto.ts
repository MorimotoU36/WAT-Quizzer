import { ApiResponse } from '../../../api'

export interface GetAccuracyRateHistgramAPIRequestDto {
  file_num?: number
}

export interface AccuracyRateHistgramApiResponse extends ApiResponse {
  result: number[]
}
