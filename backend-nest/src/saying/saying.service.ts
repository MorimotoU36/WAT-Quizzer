import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { parse, ParseResult } from 'papaparse';
import {
  AddBookAPIRequestDto,
  AddSayingAPIRequestDto,
  EditSayingAPIRequestDto,
  getRandomElementFromArray,
  prisma,
} from 'quizzer-lib';
import { Readable } from 'stream';

@Injectable()
export class SayingService {
  // 格言ランダム取得
  async getRandomSaying(book_id?: number) {
    try {
      if (book_id) {
        return getRandomElementFromArray(
          await prisma.saying.findMany({
            select: {
              id: true,
              saying: true,
              explanation: true,
              selfhelp_book: {
                select: {
                  name: true,
                },
              },
            },
            where: {
              deleted_at: null,
              selfhelp_book: {
                id: book_id,
                deleted_at: null,
              },
            },
          }),
        );
      } else {
        return getRandomElementFromArray(
          await prisma.saying.findMany({
            select: {
              id: true,
              saying: true,
              explanation: true,
              selfhelp_book: {
                select: {
                  name: true,
                },
              },
            },
            where: {
              deleted_at: null,
              selfhelp_book: {
                deleted_at: null,
              },
            },
          }),
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 啓発本追加
  async addBookService(req: AddBookAPIRequestDto) {
    const { book_name } = req;
    try {
      return await prisma.selfhelp_book.create({
        data: {
          name: book_name,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 啓発本リスト取得
  async getBookListService() {
    try {
      return await prisma.selfhelp_book.findMany({
        select: {
          id: true,
          name: true,
        },
        where: {
          deleted_at: null,
        },
        orderBy: {
          id: 'asc',
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 格言追加
  async addSayingService(req: AddSayingAPIRequestDto) {
    const { book_id, saying, explanation } = req;
    try {
      // 格言の新規ID計算
      const result = await prisma.saying.groupBy({
        by: ['book_id'],
        where: {
          book_id,
        },
        _max: {
          book_saying_id: true,
        },
      });
      const sayingWillId =
        result.length > 0 ? +result[0]._max.book_saying_id + 1 : 1;
      // 格言追加
      return await prisma.saying.create({
        data: {
          book_id,
          book_saying_id: sayingWillId,
          saying,
          explanation,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 格言検索
  async searchSayingService(saying: string) {
    try {
      return await prisma.saying.findMany({
        select: {
          id: true,
          saying: true,
          explanation: true,
          selfhelp_book: {
            select: {
              name: true,
            },
          },
        },
        where: {
          saying: {
            contains: saying,
          },
          deleted_at: null,
          selfhelp_book: {
            deleted_at: null,
          },
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 格言取得(ID指定)
  async getSayingByIdService(id: number) {
    try {
      return await prisma.saying.findUnique({
        select: {
          id: true,
          saying: true,
          explanation: true,
          selfhelp_book: {
            select: {
              name: true,
            },
          },
        },
        where: {
          id,
          deleted_at: null,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 格言編集
  async editSayingService(req: EditSayingAPIRequestDto) {
    try {
      const { id, saying, explanation } = req;
      return await prisma.saying.update({
        data: {
          saying,
          explanation,
        },
        where: {
          id,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // TODO 共通関数化できるか確認 quiz.uploadの方でも同じものを使っている
  parseCsv = async <T>(file: Express.Multer.File): Promise<ParseResult<T>> => {
    const stream = Readable.from(file.buffer);
    return new Promise((resolve, reject) => {
      parse(stream, {
        header: false,
        skipEmptyLines: true,
        transform: (value: string): string => {
          return value.trim();
        },
        complete: (results: ParseResult<T>) => {
          return resolve(results);
        },
        error: (error: Error) => {
          return reject(error);
        },
      });
    });
  };

  // アップロードされた格言CSVを登録
  // TODO csvのバリデーション処理 quiz.service.tsでも同じ問題あり
  async uploadFile(file: Express.Multer.File) {
    try {
      const csvData = await this.parseCsv<string>(file);
      // トランザクション
      await prisma.$transaction(
        async (prisma) => {
          // csv先頭行（出典ID）だけ取得し準備
          const book_id = +csvData.data.shift();
          const maxSayingId = (
            await prisma.saying.findFirst({
              where: {
                book_id,
              },
              orderBy: {
                book_saying_id: 'desc',
              },
            })
          ).book_saying_id;
          // バリデーション
          if (isNaN(maxSayingId)) {
            throw new HttpException(
              `入力した本IDに対する最大格言番号が取得できませんでした(${book_id})`,
              HttpStatus.BAD_REQUEST,
            );
          }
          // csvデータ１行ずつ読み込み
          let book_saying_id = maxSayingId + 1;
          for (const row of csvData.data) {
            // (格言,解説) でない場合終了
            if (row.length !== 2) {
              throw new HttpException(
                `CSVの形式が正しくありません(${row})`,
                HttpStatus.BAD_REQUEST,
              );
            }
            const [saying, explanation] = row;
            // 問題データ登録
            // 新問題番号を取得しINSERT
            await prisma.saying.create({
              data: {
                book_id,
                book_saying_id,
                saying,
                explanation,
              },
            });
            book_saying_id++;
            console.log(`OK: ${row[0]}`);
          }
        },
        {
          maxWait: 5000, // default: 2000
          timeout: 10000, // default: 5000
        },
      );
      return { result: 'All Registered!!' };
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
