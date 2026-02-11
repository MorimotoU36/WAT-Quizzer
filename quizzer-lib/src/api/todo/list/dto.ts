import { ApiResponse } from '../..'

export interface GetTodoListApiResponseDto extends ApiResponse {
  id: number
  todo: string
}
