// 0~入力した整数未満 の範囲内の整数をランダムで取得
export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max)
}

// 入力した範囲内の整数をランダムで取得
export const getRandomIntWithRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
