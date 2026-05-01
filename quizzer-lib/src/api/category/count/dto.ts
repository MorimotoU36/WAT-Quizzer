export interface GetCategoryQuizCountAPIRequestDto {
  file_num: number
}

export interface CategoryQuizCountDto {
  id: number
  name: string
  count: number
}
