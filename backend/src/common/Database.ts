import dotenv from 'dotenv'
import path from 'path'
import mysql from 'mysql2'

const env = dotenv.config({ path: path.join(__dirname, '../../config/.env') })

// DB接続子を返す
const dbinfo = {
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DBNAME
}

// (english用)DB接続子を返す
const english_dbinfo = {
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_ENGLISHDBNAME
}

// SQLを実行する
export const execQuery = async (query: string, value: (string | number)[]) => {
  try {
    // DB接続
    const connection = mysql.createConnection(dbinfo)

    // クエリ実行
    const result = await new Promise((resolve, reject) => {
      connection.query(query, value, (error, result) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })

    // 接続終了
    await connection.end()
    return result
  } catch (error) {
    throw error
  }
}

// (英語DBへ)SQLを実行する
export const execQueryForEnglish = async (
  query: string,
  value: (string | number)[]
) => {
  try {
    // DB接続
    const connection = mysql.createConnection(english_dbinfo)

    // クエリ実行
    const result = await new Promise((resolve, reject) => {
      connection.query(query, value, (error, result) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })

    // 接続終了
    await connection.end()
    return result
  } catch (error) {
    throw error
  }
}