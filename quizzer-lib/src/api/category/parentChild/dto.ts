export interface GetCategoryParentChildListAPIRequestDto {
  file_num: number
}

export interface CategoryParentChildAPIResponseDto {
  id: number
  parent_category_id: number
  parent_category_name: string
  child_category_id: number
  child_category_name: string
}

export interface AddCategoryParentChildAPIRequestDto {
  file_num: number
  parent_category: string
  child_category: string
}

export interface DeleteCategoryParentChildAPIRequestDto {
  id: number
}
