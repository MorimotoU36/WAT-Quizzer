import { ApiResponse } from '../../..'

export interface RegisterWordsToSourceDto extends ApiResponse {
  sourceId: string
  words: string[]
}
