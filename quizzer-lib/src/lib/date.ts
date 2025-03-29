// prisma用　昨日内のデータを取りたい時の条件
export const getPrismaYesterdayRange = () => {
  const nowDate = new Date()
  const yesterday = new Date(
    nowDate.getFullYear(),
    nowDate.getMonth(),
    nowDate.getDate() - 1,
    0,
    0,
    0
  )
  const today = new Date(
    nowDate.getFullYear(),
    nowDate.getMonth(),
    nowDate.getDate(),
    0,
    0,
    0
  )
  return {
    gte: yesterday,
    lt: today
  }
}

// prisma用　今日から数えてn日前内のデータを取りたい時の条件
export const getPrismaPastDayRange = (n: number) => {
  const nowDate = new Date()
  const pastDay = new Date(
    nowDate.getFullYear(),
    nowDate.getMonth(),
    nowDate.getDate() - n,
    0,
    0,
    0
  )
  const pastDayTommorow = new Date(
    nowDate.getFullYear(),
    nowDate.getMonth(),
    nowDate.getDate() - n + 1,
    0,
    0,
    0
  )
  return {
    gte: pastDay,
    lt: pastDayTommorow
  }
}

// Date型 n日前の日付形式を(文字列形式で)取得
export const getPastDate = (n: number) => {
  const nowDate = new Date()
  const pastDay = new Date(
    nowDate.getFullYear(),
    nowDate.getMonth(),
    nowDate.getDate() - n,
    0,
    0,
    0
  )
  return pastDay
    .toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    .replaceAll('/', '-')
}

// TODO date_unitの型をどこかに定義する dtoファイルの方も
// TODO エラーメッセージを定義する
// (回答数統計データ取得APIで利用)始値を計算して取得する
export const getStartDateForStatistics = (
  inputDate: Date,
  date_unit: 'day' | 'week' | 'month'
) => {
  switch (date_unit) {
    case 'day':
      // 入力した日付の00:00:00のデータを返す
      const resetDate = new Date(inputDate)
      resetDate.setHours(0, 0, 0, 0)
      return resetDate
    case 'week':
      // 入力した日付の週始めの日のデータを返す
      // 週の始まり（月曜日）を計算
      const startOfWeek = new Date(inputDate)
      const day = inputDate.getDay() // 0 (日曜) ～ 6 (土曜)

      // 月曜日にリセットする
      const diffToMonday = (day === 0 ? -6 : 1) - day // 月曜までの日数差
      startOfWeek.setDate(inputDate.getDate() + diffToMonday)

      // 時間を 00:00:00 にリセット
      startOfWeek.setHours(0, 0, 0, 0)
      return startOfWeek
    case 'month':
      // 入力した日付の月初めの日のデータを返す
      // 月の始まり（1日）を計算
      const startOfMonth = new Date(inputDate)
      startOfMonth.setDate(1) // 1日に設定

      // 時間を 00:00:00 にリセット
      startOfMonth.setHours(0, 0, 0, 0)
      return startOfMonth
    default:
      throw new Error('日付形式が不正です')
  }
}
