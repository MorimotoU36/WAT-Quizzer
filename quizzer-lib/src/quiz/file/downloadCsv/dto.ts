import { ApiResponse } from '../../../api'

export interface DownloadQuizCsvApiRequest extends ApiResponse {
  file_num: number
}

export interface DownloadQuizCsvApiResponseDto extends ApiResponse {}
