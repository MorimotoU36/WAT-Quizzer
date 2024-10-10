import { ApiResponse } from '../../api'

export interface GetQuizAPIRequestDto {
  file_num: number
  quiz_num?: number
  format_id?: number
  min_rate?: number
  max_rate?: number
  category?: string
  checked?: string //booleanにしたい
}

// 問題取得APIのレスポンス（基礎応用込み）、フォーマット込み
export interface GetQuizApiResponseDto extends ApiResponse {
  format_id?: number

  id: number
  file_num: number
  quiz_num: number
  quiz_sentense: string
  answer: string
  img_file?: string
  checked?: boolean
  quiz_statistics_view?: {
    clear_count: number
    fail_count: number
    accuracy_rate: number
  }
  quiz_category?: {
    category: string
    deleted_at?: string
  }[]
  quiz_dummy_choice?: {
    dummy_choice_sentense: string // TODO テーブルごとの型なので本当は望ましくない getQuiz専用のAPI返り値型を作るべき
  }[]
  quiz_basis_linkage?: {
    basis_quiz_id: number
  }[]
  quiz_advanced_linkage?: {
    advanced_quiz_id: number
  }[]
  quiz_explanation?: {
    explanation: string
  }
  quiz_basis_advanced_linkage?: {
    basis_quiz_id: number
  }[]
}
