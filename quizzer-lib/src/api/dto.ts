// APIから受け取ったデータを変換しフロント側で処理する型

import { Message } from '../..'

// TODO  名前変えたい ApiSingleResponseとか
export interface ProcessingApiReponse {
  status: number
  body: ApiResponse[]
}

export interface ProcessingAddApiReponse {
  status: number
  body: ApiResponse
}

export interface ProcessingApiSingleReponse {
  status: number
  body: ApiResponse
}

// APIから得られるデータ(抽象クラス)
export interface ApiResponse {}

// このquizzer-libのAPIが返すデータ型（Messageを付加する）
export interface ApiResult {
  message: Message
  result?: ApiResponse | ApiResponse[]
}
