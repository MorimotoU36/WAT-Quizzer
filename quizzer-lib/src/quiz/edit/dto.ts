import { ApiResponse } from '../../api'

export interface EditQuizAPIRequestDto {
  quiz_id: number
  file_num: number
  quiz_num: number
  format_id?: number
  question?: string
  answer?: string
  category?: string
  img_file?: string
  matched_basic_quiz_id?: string
  dummy1?: string //四択問題のダミー選択肢１
  dummy2?: string //四択問題のダミー選択肢２
  dummy3?: string //四択問題のダミー選択肢３
  explanation?: string // 解説
}

// 問題編集APIのレスポンス（ログだけ）
export interface EditQuizApiResponseDto extends ApiResponse {
  file_num: number
  quiz_num: number
  quiz_sentense: string
  answer: string
}
