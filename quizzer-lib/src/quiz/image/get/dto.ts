import { ApiResponse } from '../../../api'

export interface GetImageOfQuizAPIRequestDto {
  fileName: string
}

export interface GetImageOfQuizAPIResponseDto extends ApiResponse {
  imageUrl: string
}
