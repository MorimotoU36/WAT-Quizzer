import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AddExampleAPIRequestDto,
  SubmitAssociationExampleAPIRequestDto,
  prisma,
} from 'quizzer-lib';

@Injectable()
export class EnglishService {
  // 品詞取得
  async getPartsofSpeechService() {
    try {
      const data = await prisma.partsofspeech.findMany({
        where: {
          deleted_at: null,
        },
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          id: 'asc',
        },
      });
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 出典取得
  async getSourceService() {
    try {
      const data = await prisma.source.findMany({
        where: {
          deleted_at: null,
        },
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          id: 'asc',
        },
      });
      return data;
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

  // 例文追加
  async addExampleService(req: AddExampleAPIRequestDto) {
    const { exampleEn, exampleJa, explanation, wordName } = req;

    // 入力単語存在チェック
    const wordData =
      wordName && wordName !== ''
        ? await prisma.word.findUnique({
            where: {
              name: wordName,
            },
            select: {
              id: true,
            },
          })
        : undefined;
    if (wordName && wordName !== '' && !wordData) {
      throw new HttpException(
        `エラー：入力した単語名「${wordName}は存在しません」`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      //トランザクション実行
      await prisma.$transaction(async (prisma) => {
        //例文追加
        const createdExampleData = await prisma.example.create({
          data: {
            en_example_sentense: exampleEn,
            ja_example_sentense: exampleJa,
            example_explanation: {
              create: [
                {
                  explanation,
                },
              ],
            },
          },
        });

        //  word_exampleにデータ追加(単語入力ある場合のみ)
        if (wordData) {
          await prisma.word_example.create({
            data: {
              example_sentense_id: createdExampleData.id,
              word_id: wordData.id,
            },
          });
        }
      });
      return {
        result: 'Added!',
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 例文検索
  async searchExampleService(query: string, isLinked: boolean) {
    try {
      // TODO pipeでboolean対応
      const data = isLinked
        ? await prisma.example.findMany({
            where: {
              word_example: {
                every: {
                  word: {
                    name: query,
                  },
                  deleted_at: null,
                },
              },
              deleted_at: null,
            },
            select: {
              id: true,
              en_example_sentense: true,
              ja_example_sentense: true,
            },
            orderBy: {
              id: 'asc',
            },
          })
        : isLinked === false
        ? await prisma.example.findMany({
            where: {
              en_example_sentense: {
                contains: query,
              },
              deleted_at: null,
            },
            select: {
              id: true,
              en_example_sentense: true,
              ja_example_sentense: true,
            },
            orderBy: {
              id: 'asc',
            },
          })
        : undefined;
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 例文紐付け更新
  async changeAssociationOfExampleService(
    req: SubmitAssociationExampleAPIRequestDto,
  ) {
    const { wordName, checkedId, isAssociation } = req;

    // 入力単語存在チェック
    const wordData = await prisma.word.findUnique({
      where: {
        name: wordName,
        deleted_at: null,
      },
      select: {
        id: true,
      },
    });
    if (!wordData) {
      throw new HttpException(
        `エラー：入力した単語名「${wordName}は存在しません」`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      // isAssociation:true->紐付け false->解除
      const data = isAssociation
        ? await prisma.word_example.upsert({
            create: {
              example_sentense_id: checkedId,
              word_id: wordData.id,
            },
            update: {
              deleted_at: null,
            },
            where: {
              example_sentense_id_word_id: {
                example_sentense_id: checkedId,
                word_id: wordData.id,
              },
            },
          })
        : await prisma.word_example.update({
            where: {
              example_sentense_id_word_id: {
                example_sentense_id: checkedId,
                word_id: wordData.id,
              },
            },
            data: {
              deleted_at: new Date(),
            },
          });
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 例文テスト取得
  async getExampleTestService() {
    try {
      const data = await prisma.example.findMany({
        where: {
          example_explanation: {
            none: {},
          },
        },
      });
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 出典に単語リスト一挙登録（バッチ用）
  async registerWordsToSource(sourceId: number, words: string[]) {
    try {
      const unregisteredWord = [];
      const alreadyRegisteredWord = [];
      const registerWord = [];
      //トランザクション実行
      await prisma.$transaction(async (prisma) => {
        for (const wordName of words) {
          // 入力単語が実在するかチェック
          const wordData = await prisma.word.findFirst({
            where: {
              name: wordName,
            },
          });

          // ない場合はスルー
          if (!wordData) {
            unregisteredWord.push(wordName);
            continue;
          }

          // 出典・単語の組み合わせが既に登録されているかチェック
          const wordSourceData = await prisma.word_source.findUnique({
            where: {
              word_id_source_id: {
                word_id: wordData.id,
                source_id: sourceId,
              },
            },
          });

          // 既にある場合はスルー
          if (wordSourceData) {
            alreadyRegisteredWord.push(wordName);
            continue;
          }

          // 登録
          await prisma.word_source.create({
            data: {
              word_id: +wordData.id,
              source_id: sourceId,
            },
          });

          registerWord.push(wordName);
        }
      });
      return {
        result: `${registerWord.length} Registered!`,
        registerWord,
        unregisteredWord,
        alreadyRegisteredWord,
      };
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
