import { Readable } from 'stream'
import { parse, ParseResult } from 'papaparse'
import { Multer } from 'multer'

export const parseCsv = async <T>(
  file: Express.Multer.File
): Promise<ParseResult<T>> => {
  const stream = Readable.from(file.buffer)
  return new Promise((resolve, reject) => {
    parse(stream, {
      header: false,
      skipEmptyLines: true,
      transform: (value: string): string => {
        return value.trim()
      },
      complete: (results: ParseResult<T>) => {
        return resolve(results)
      },
      error: (error: Error) => {
        return reject(error)
      }
    })
  })
}
