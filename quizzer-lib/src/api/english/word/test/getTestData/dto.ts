// 英単語テストデータ取得APIリクエスト型
export interface GetEnglishWordTestDataAPIRequestDto {
  format: 'random' | 'lru'
  source?: string
  checked?: boolean
  startDate?: string
  endDate?: string
  min_rate?: number
  max_rate?: number
}

//API側で受け取った時のDTO（Pipeで上に変換する）
export interface GetEnglishWordTestDataAPIRequestReceivedDto {
  format: 'random' | 'lru'
  source?: string
  checked?: string
  startDate?: string
  endDate?: string
  min_rate?: string
  max_rate?: string
}

// 英単語テストデータ取得APIレスポンス型
export interface GetEnglishWordTestDataAPIResponseDto extends FourChoiceData {
  word?: {
    id: number
    name: string
    checked: boolean
    mean: EnglishWordTestMeanData[]
    word_source: {
      source: {
        id: number
        name: string
      }
    }[]
    word_statistics_view: {
      accuracy_rate: string
    }
  }
  testType?: string
}

export interface EnglishWordTestMeanData {
  id: number
  word_id: number
  wordmean_id: number
  meaning: string
  created_at: Date
  updated_at: Date
  deleted_at: Date
  partsofspeech: {
    id: number
    name: string
  }
}

export interface FourChoiceData {
  correct?: {
    mean: string
  }
  dummy?: {
    mean: string
  }[]
}
