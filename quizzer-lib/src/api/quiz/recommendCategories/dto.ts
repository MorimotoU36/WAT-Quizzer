export interface RecommendedCategoryDto {
  category_name: string
  // 推奨理由: 未解答 / 最近解いていない / 最近の正解率が低い
  reason: 'neverAnswered' | 'notRecent' | 'lowAccuracy'
  // 最後に解いてからの日数（未解答の場合はnull）
  days_since_last_answered: number | null
  // 直近30日の正解率（直近に解答なしの場合はnull）
  recent_accuracy_rate: number | null
}
