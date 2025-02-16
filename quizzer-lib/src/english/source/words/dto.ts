import { ApiResponse } from '../../../api'

export interface RegisterWordsToSourceDto extends ApiResponse {
  sourceId: string
  words: string[]
}
