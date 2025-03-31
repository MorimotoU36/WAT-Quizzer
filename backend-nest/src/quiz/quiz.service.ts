import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ClearQuizAPIRequestDto,
  FailQuizAPIRequestDto,
  AddQuizAPIRequestDto,
  EditQuizAPIRequestDto,
  DeleteQuizAPIRequestDto,
  CheckQuizAPIRequestDto,
  DeleteAnswerLogOfFileApiRequestDto,
  getPrismaYesterdayRange,
  getRandomElementFromArray,
  AddCategoryToQuizAPIRequestDto,
  IntegrateToQuizAPIRequestDto,
  GetQuizAPIRequestDto,
  SearchQuizAPIRequestDto,
  xor,
  prisma,
  GetAnswerLogStatisticsAPIRequestDto,
  getStartDateForStatistics,
} from 'quizzer-lib';
import { Readable } from 'stream';
import { parse, ParseResult } from 'papaparse';

export interface QueryType {
  query: string;
  value: (string | number)[];
}

@Injectable()
export class QuizService {
  // 問題取得
  async getQuiz(
    req: GetQuizAPIRequestDto,
    method?: 'random' | 'worstRate' | 'leastClear' | 'LRU' | 'review',
  ) {
    try {
      const {
        file_num,
        quiz_num,
        min_rate,
        max_rate,
        category,
        checked,
        format_id,
      } = req;
      // 取得条件
      const where =
        // methodがある時は条件指定
        method
          ? {
              file_num,
              // TODO 問題取得 format_idチェックボックス化による条件対応、、画面・pipe含めなんかやり方ややこしいのよな・・　もっと効率いいやり方模索したい
              ...(format_id && {
                format_id: {
                  in: Object.entries(format_id)
                    .filter((x) => x[1])
                    .map((x) => +x[0]),
                },
              }),
              deleted_at: null,
              quiz_statistics_view: {
                accuracy_rate: {
                  gte: min_rate || 0,
                  lte: max_rate || 100,
                },
                ...(method === 'review' && {
                  last_failed_answer_log: getPrismaYesterdayRange(),
                }),
              },
              ...(category && {
                quiz_category: {
                  some: {
                    category: {
                      contains: category,
                    },
                  },
                },
              }),
              ...(checked
                ? {
                    checked: true,
                  }
                : {}),
            }
          : {
              file_num,
              quiz_num,
              ...(format_id && {
                format_id: {
                  in: Object.entries(format_id)
                    .filter((x) => x[1])
                    .map((x) => +x[0]),
                },
              }),
              deleted_at: null,
            };
      const orderBy =
        method === 'worstRate'
          ? {
              quiz_statistics_view: {
                accuracy_rate: 'asc' as const,
              },
            }
          : method === 'leastClear'
            ? [
                {
                  quiz_statistics_view: {
                    answer_count: 'asc' as const,
                  },
                },
                {
                  quiz_statistics_view: {
                    fail_count: 'desc' as const,
                  },
                },
              ]
            : method === 'LRU'
              ? {
                  quiz_statistics_view: {
                    last_answer_log: {
                      sort: 'asc' as const,
                      nulls: 'first' as const,
                    },
                  },
                }
              : {};
      // データ取得
      const results = await prisma.quiz.findMany({
        select: {
          id: true,
          file_num: true,
          quiz_num: true,
          format_id: true,
          quiz_sentense: true,
          answer: true,
          img_file: true,
          checked: true,
          quiz_category: {
            select: {
              category: true,
              deleted_at: true,
            },
          },
          quiz_statistics_view: {
            select: {
              clear_count: true,
              fail_count: true,
              accuracy_rate: true,
            },
          },
          quiz_explanation: {
            select: {
              explanation: true,
            },
          },
          quiz_dummy_choice: {
            select: {
              dummy_choice_sentense: true,
              is_corrected: true,
            },
          },
          quiz_basis_linkage: {
            select: {
              basis_quiz_id: true,
              advanced_quiz_id: true,
            },
          },
          quiz_advanced_linkage: {
            select: {
              basis_quiz_id: true,
              advanced_quiz_id: true,
            },
          },
        },
        where,
        orderBy,
      });
      if (results.length === 0) {
        throw new HttpException(
          `条件に合致するデータはありません`,
          HttpStatus.NOT_FOUND,
        );
      }
      const result =
        method === 'random' || method === 'review'
          ? getRandomElementFromArray(results)
          : results[0];
      return {
        ...result,
        ...(result.quiz_category && {
          quiz_category: result.quiz_category
            .filter((x) => {
              return !x.deleted_at;
            })
            .map((x) => {
              return {
                category: x.category,
              };
            }),
        }),
        ...(result.quiz_statistics_view && {
          quiz_statistics_view: {
            clear_count: result.quiz_statistics_view.clear_count.toString(),
            fail_count: result.quiz_statistics_view.fail_count.toString(),
            accuracy_rate: result.quiz_statistics_view.accuracy_rate.toString(),
          },
        }),
        count: results.length,
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        // 404系はそのまま返す
        throw error;
      } else if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 正解登録
  async cleared(req: ClearQuizAPIRequestDto) {
    try {
      const { quiz_id } = req;
      return prisma.answer_log.create({
        data: {
          quiz_id,
          is_corrected: true,
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

  // 不正解登録
  async failed(req: FailQuizAPIRequestDto) {
    try {
      const { quiz_id } = req;
      return prisma.answer_log.create({
        data: {
          quiz_id,
          is_corrected: false,
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

  // 問題を１問追加
  async add(req: AddQuizAPIRequestDto) {
    try {
      const {
        file_num,
        question,
        answer,
        category,
        img_file,
        format_id,
        matched_basic_quiz_id,
        dummyChoice,
        explanation,
      } = req;
      if (!file_num || !question || !answer || !format_id) {
        throw new HttpException(
          `ファイル番号または問題文または答えが入力されていません。`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // 関連する基礎問題番号リストのバリデーション・取得
      const matched_basic_quiz_id_list: number[] = [];
      if (matched_basic_quiz_id) {
        const id_list = matched_basic_quiz_id.split(',');
        for (let i = 0; i < id_list.length; i++) {
          if (isNaN(+id_list[i])) {
            throw new HttpException(
              `入力した関連基礎問題番号でエラーが発生しました；("${id_list[i]}"は数値ではありません)`,
              HttpStatus.BAD_REQUEST,
            );
          } else {
            matched_basic_quiz_id_list.push(+id_list[i]);
          }
        }
      }

      // 四択問題の場合　ダミー選択肢全部ない場合エラー
      if (
        format_id === 3 &&
        dummyChoice &&
        dummyChoice.length < 3 &&
        dummyChoice.reduce((accummulate, currentValue) => {
          return accummulate || currentValue.sentense === '';
        }, false)
      ) {
        throw new HttpException(
          // TODO これもエラーメッセージの設定ファイルに入れるべきでは
          `ダミー選択肢が3つ以上入力されていません。`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // 新問題番号を取得しINSERT
      const res = await prisma.quiz.findFirst({
        select: {
          quiz_num: true,
        },
        where: {
          file_num,
        },
        orderBy: {
          quiz_num: 'desc',
        },
        take: 1,
      });
      const new_quiz_num: number = res && res.quiz_num ? res.quiz_num + 1 : 1;
      return await prisma.quiz.create({
        data: {
          format_id,
          file_num,
          quiz_num: new_quiz_num,
          quiz_sentense: question,
          answer,
          img_file,
          checked: false,
          quiz_category: {
            ...(category && {
              create: category.split(',').map((x) => {
                return {
                  category: x,
                };
              }),
            }),
          },
          quiz_explanation: {
            ...(explanation && {
              create: {
                explanation,
              },
            }),
          },
          quiz_advanced_linkage: {
            createMany: {
              data:
                matched_basic_quiz_id && format_id === 1
                  ? matched_basic_quiz_id_list.map((x) => {
                      return { basis_quiz_id: x };
                    })
                  : [],
            },
          },
          quiz_dummy_choice: {
            createMany: {
              data:
                format_id === 3
                  ? dummyChoice.map((x) => {
                      return {
                        dummy_choice_sentense: x.sentense,
                        is_corrected: x.isCorrect,
                      };
                    })
                  : [],
            },
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

  // 問題編集
  async edit(req: EditQuizAPIRequestDto) {
    try {
      const {
        quiz_id,
        format_id,
        file_num,
        quiz_num,
        question,
        answer,
        category,
        img_file,
        matched_basic_quiz_id,
        dummyChoice,
        explanation,
      } = req;

      //編集画面で入力した関連基礎問題番号取得・バリデーション
      const matched_basic_quiz_id_list: number[] = [];
      let id_list: string[] = [];
      if (matched_basic_quiz_id) {
        id_list = matched_basic_quiz_id.split(',');
        for (let i = 0; i < id_list.length; i++) {
          if (isNaN(+id_list[i])) {
            throw new HttpException(
              `入力した関連基礎問題番号でエラーが発生しました；("${id_list[i]}"は数値ではありません)`,
              HttpStatus.BAD_REQUEST,
            );
          } else {
            matched_basic_quiz_id_list.push(+id_list[i]);
          }
        }
      }

      // クエリ用意
      await prisma.$transaction(async (prisma) => {
        // 更新
        const updatedQuiz = await prisma.quiz.update({
          data: {
            quiz_sentense: question,
            answer,
            img_file,
            ...(explanation && {
              quiz_explanation: {
                upsert: {
                  create: {
                    explanation,
                  },
                  update: {
                    explanation,
                  },
                  where: {
                    quiz_id,
                  },
                },
              },
            }),
          },
          where: {
            file_num_quiz_num: {
              file_num,
              quiz_num,
            },
            format_id,
          },
        });
        // 関連問題更新
        if (
          matched_basic_quiz_id &&
          matched_basic_quiz_id_list.length > 0 &&
          format_id > 1 // 応用問題
        ) {
          // 一度削除
          await prisma.quiz_basis_advanced_linkage.updateMany({
            data: {
              deleted_at: new Date(),
            },
            where: {
              advanced_quiz_id: updatedQuiz.id,
            },
          });
          // 削除後追加
          for (let i = 0; i < matched_basic_quiz_id_list.length; i++) {
            await prisma.quiz_basis_advanced_linkage.upsert({
              update: {
                deleted_at: null,
              },
              create: {
                basis_quiz_id: matched_basic_quiz_id_list[i],
                advanced_quiz_id: updatedQuiz.id,
              },
              where: {
                basis_quiz_id_advanced_quiz_id: {
                  basis_quiz_id: matched_basic_quiz_id_list[i],
                  advanced_quiz_id: updatedQuiz.id,
                },
              },
            });
          }
        }
        // ダミー選択肢更新
        // TODO もっと効率いい方法ないか..
        if (dummyChoice) {
          for (let i = 0; i < dummyChoice.length; i++) {
            // ダミー選択肢のID取得
            const dummyChoiceId = await prisma.quiz_dummy_choice.findFirst({
              select: {
                id: true,
              },
              where: {
                quiz_id: updatedQuiz.id,
              },
              orderBy: {
                id: 'asc',
              },
              skip: i,
              take: 1,
            });
            // ダミー選択肢更新
            await prisma.quiz_dummy_choice.update({
              data: {
                dummy_choice_sentense: dummyChoice[i].sentense,
                is_corrected: dummyChoice[i].isCorrect,
              },
              where: {
                id: dummyChoiceId.id,
              },
            });
          }
        }
        // カテゴリ更新
        await prisma.quiz_category.updateMany({
          where: {
            quiz_id,
          },
          data: {
            deleted_at: new Date(),
          },
        });
        const categories = category.split(',');
        for (const c of categories) {
          await prisma.quiz_category.upsert({
            where: {
              quiz_id_category: {
                quiz_id,
                category: c,
              },
            },
            update: {
              deleted_at: null,
            },
            create: {
              quiz_id,
              category: c,
            },
          });
        }
        // ログ削除
        await prisma.answer_log.updateMany({
          data: {
            deleted_at: new Date(),
          },
          where: {
            quiz_id,
          },
        });
      });
      return { result: 'Edited!' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 問題検索
  async search(req: SearchQuizAPIRequestDto) {
    try {
      const {
        query,
        file_num,
        format_id,
        min_rate,
        max_rate,
        category,
        checked,
        searchInOnlySentense,
        searchInOnlyAnswer,
      } = req;
      return await prisma.quiz.findMany({
        select: {
          id: true,
          file_num: true,
          quiz_num: true,
          quiz_sentense: true,
          answer: true,
          quiz_category: {
            select: {
              category: true,
              deleted_at: true,
            },
          },
          quiz_format: {
            select: {
              name: true,
            },
          },
          img_file: true,
          checked: true,
        },
        where: {
          // TODO 問題取得 format_idチェックボックス化による条件対応、、画面・pipe含めなんかやり方ややこしいのよな・・　もっと効率いいやり方模索したい
          ...(format_id && {
            format_id: {
              in: Object.entries(format_id)
                .filter((x) => x[1])
                .map((x) => +x[0]),
            },
          }),
          file_num,
          deleted_at: null,
          quiz_statistics_view: {
            accuracy_rate: {
              gte: min_rate || 0,
              lte: max_rate || 100,
            },
          },
          ...(category && {
            quiz_category: {
              some: {
                category: {
                  contains: category,
                },
              },
            },
          }),
          ...(checked
            ? {
                checked: true,
              }
            : {}),
          ...(xor(searchInOnlySentense, searchInOnlyAnswer) &&
          searchInOnlySentense
            ? {
                quiz_sentense: {
                  contains: query,
                },
              }
            : {
                answer: {
                  contains: query,
                },
              }),
        },
        orderBy: {
          quiz_num: 'asc',
        },
      });
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

  // 問題削除
  async delete(req: DeleteQuizAPIRequestDto) {
    try {
      const { format_id, file_num, quiz_num } = req;
      return await prisma.quiz.update({
        data: {
          deleted_at: new Date(),
        },
        where: {
          file_num_quiz_num: {
            file_num,
            quiz_num,
          },
          format_id,
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

  // 問題統合（とりあえず基礎問題のみ）
  async integrate(req: IntegrateToQuizAPIRequestDto) {
    try {
      // TODO ここがfile_num,quiz_numなので　quiz_idを送る形式に変更したい
      const { fromQuizId, toQuizId } = req;

      // 統合前の問題取得
      const pre_data = await prisma.quiz.findUnique({
        select: {
          id: true,
          file_num: true,
          quiz_num: true,
          format_id: true,
          quiz_sentense: true,
          answer: true,
          quiz_category: {
            select: {
              category: true,
              deleted_at: true,
            },
          },
          img_file: true,
          checked: true,
          quiz_statistics_view: {
            select: {
              clear_count: true,
              fail_count: true,
              accuracy_rate: true,
            },
          },
        },
        where: {
          id: fromQuizId,
          deleted_at: null,
        },
      });

      // 統合後の問題取得
      const post_data = await prisma.quiz.findUnique({
        select: {
          id: true,
          file_num: true,
          quiz_num: true,
          format_id: true,
          quiz_sentense: true,
          answer: true,
          quiz_category: {
            select: {
              category: true,
              deleted_at: true,
            },
          },
          img_file: true,
          checked: true,
          quiz_statistics_view: {
            select: {
              clear_count: true,
              fail_count: true,
              accuracy_rate: true,
            },
          },
        },
        where: {
          id: toQuizId,
          deleted_at: null,
        },
      });

      // 問題形式違う場合は統合させない
      if (pre_data.format_id !== post_data.format_id) {
        throw new HttpException(
          `入力した問題は違う形式同士のため統合できません`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // 統合データ作成
      const pre_category = new Set(
        pre_data.quiz_category
          ? pre_data.quiz_category
              .filter((x) => {
                return !x.deleted_at;
              })
              .map((x) => {
                return x.category;
              })
          : [],
      );
      const post_category = new Set(
        post_data.quiz_category
          ? post_data.quiz_category
              .filter((x) => {
                return !x.deleted_at;
              })
              .map((x) => {
                return x.category;
              })
          : [],
      );
      const new_category = Array.from(
        new Set([...pre_category, ...post_category]),
      );

      // トランザクション
      await prisma.$transaction(async (prisma) => {
        // 問題統合(カテゴリのみ)
        //// 元問題のカテゴリ削除
        await prisma.quiz_category.updateMany({
          where: {
            quiz_id: fromQuizId,
          },
          data: {
            deleted_at: new Date(),
          },
        });
        await prisma.quiz_category.updateMany({
          where: {
            quiz_id: toQuizId,
          },
          data: {
            deleted_at: new Date(),
          },
        });
        //// 統合後問題にカテゴリ更新
        for (const c of new_category) {
          await prisma.quiz_category.upsert({
            where: {
              quiz_id_category: {
                quiz_id: toQuizId,
                category: c,
              },
            },
            update: {
              deleted_at: null,
            },
            create: {
              quiz_id: toQuizId,
              category: c,
            },
          });
        }

        // 統合元データは削除、それまでの解答ログデータも削除
        await prisma.quiz.update({
          data: {
            deleted_at: new Date(),
          },
          where: {
            id: fromQuizId,
          },
        });
        await prisma.answer_log.updateMany({
          data: {
            deleted_at: new Date(),
          },
          where: {
            quiz_id: fromQuizId,
          },
        });
      });

      return {
        result: 'OK!',
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

  // 問題にカテゴリ追加
  async addCategoryToQuiz(req: AddCategoryToQuizAPIRequestDto) {
    try {
      const { quiz_id, category } = req;
      const quiz_ids = quiz_id.split(',').map((x) => {
        if (isNaN(+x)) {
          throw new HttpException(
            `問題番号が不正です(${x})`,
            HttpStatus.BAD_REQUEST,
          );
        }
        return +x;
      });
      const categories = category.split(',');
      // トランザクション
      await prisma.$transaction(async (prisma) => {
        for (const quiz_id of quiz_ids) {
          // 更新
          for (const c of categories) {
            await prisma.quiz_category.upsert({
              where: {
                quiz_id_category: {
                  quiz_id,
                  category: c,
                },
              },
              update: {
                deleted_at: null,
              },
              create: {
                quiz_id,
                category: c,
              },
            });
          }
        }
      });
      // TODO 問題追加系の返り値の扱い　なんか違う方がいい
      return {
        result: 'OK!',
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

  // 問題からカテゴリ削除
  async removeCategoryFromQuiz(body: AddCategoryToQuizAPIRequestDto) {
    try {
      const { quiz_id, category } = body;
      const quiz_ids = quiz_id.split(',').map((x) => {
        if (isNaN(+x)) {
          throw new HttpException(
            `問題番号が不正です(${x})`,
            HttpStatus.BAD_REQUEST,
          );
        }
        return +x;
      });
      const categories = category.split(',');
      // トランザクション
      await prisma.$transaction(async (prisma) => {
        // 更新
        for (const quiz_id of quiz_ids) {
          // 現在のカテゴリ取得
          const nowCategory = (
            await prisma.quiz_category.findMany({
              select: {
                category: true,
              },
              where: {
                quiz_id,
                deleted_at: null,
              },
            })
          ).map((x) => {
            return x.category;
          });

          for (const c of categories) {
            if (!nowCategory.includes(c)) {
              continue;
            }

            await prisma.quiz_category.update({
              data: {
                deleted_at: new Date(),
              },
              where: {
                quiz_id_category: {
                  quiz_id,
                  category: c,
                },
              },
            });
          }
        }
      });
      return {
        result: 'OK!',
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

  // 問題にチェック追加
  async check(req: CheckQuizAPIRequestDto) {
    try {
      const { quiz_id } = req;
      const quiz_ids = quiz_id.split(',').map((x) => {
        if (isNaN(+x)) {
          throw new HttpException(
            `問題番号が不正です(${x})`,
            HttpStatus.BAD_REQUEST,
          );
        }
        return +x;
      });
      // トランザクション
      await prisma.$transaction(async (prisma) => {
        // 更新
        for (const quiz_id of quiz_ids) {
          await prisma.quiz.update({
            data: {
              checked: true,
            },
            where: {
              id: quiz_id,
            },
          });
        }
      });
      return {
        result: 'OK!',
      };
    } catch (error) {
      throw error;
    }
  }

  // 問題にチェック外す
  async uncheck(req: CheckQuizAPIRequestDto) {
    try {
      const { quiz_id } = req;
      const quiz_ids = quiz_id.split(',').map((x) => {
        if (isNaN(+x)) {
          throw new HttpException(
            `問題番号が不正です(${x})`,
            HttpStatus.BAD_REQUEST,
          );
        }
        return +x;
      });
      // トランザクション
      await prisma.$transaction(async (prisma) => {
        // 更新
        for (const quiz_id of quiz_ids) {
          await prisma.quiz.update({
            data: {
              checked: false,
            },
            where: {
              id: quiz_id,
            },
          });
        }
      });
      return {
        result: 'OK!',
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

  // 問題のチェック反転
  async reverseCheck(req: CheckQuizAPIRequestDto) {
    try {
      const { quiz_id } = req;
      if (isNaN(+quiz_id)) {
        throw new HttpException(
          `問題番号が不正です(${quiz_id})`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const checked = (
        await prisma.quiz.findUnique({
          select: {
            checked: true,
          },
          where: {
            id: +quiz_id,
          },
        })
      ).checked;
      return await prisma.quiz.update({
        data: {
          checked: !checked,
        },
        where: {
          id: +quiz_id,
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

  // 回答ログ削除(ファイル指定)
  async deleteAnswerLogByFile(req: DeleteAnswerLogOfFileApiRequestDto) {
    try {
      const { file_id } = req;
      // 指定ファイルの回答ログ削除
      await prisma.answer_log.updateMany({
        data: {
          deleted_at: new Date(),
        },
        where: {
          quiz: {
            file_num: file_id,
          },
          deleted_at: null,
        },
      });
      return {
        result: 'Deleted!',
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

  // 過去のデータから回答数統計データ取得
  async getAnswerLogStatistics(req: GetAnswerLogStatisticsAPIRequestDto) {
    try {
      const { file_num, date_unit } = req;
      //実行時の日付
      const nowDate = new Date();
      //実行時の次の日の日付
      const tomorrowDate = new Date(nowDate);
      tomorrowDate.setDate(nowDate.getDate() + 1);
      tomorrowDate.setHours(0, 0, 0, 0);

      // DB検索で使用する始値と終値
      let startDate = getStartDateForStatistics(nowDate, date_unit);
      let endDate = tomorrowDate;
      const result = [];
      for (let i = 0; i < 10; i++) {
        result.push({
          date: startDate
            .toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
            .replace(/\//g, '-'),
          count: await prisma.answer_log.count({
            where: {
              ...(file_num !== -1 && {
                quiz: {
                  file_num,
                },
              }),
              created_at: {
                gte: startDate,
                lt: endDate,
              },
            },
          }),
        });

        // 始値の1日前の日付を取得
        const oneDayAgo = new Date(startDate);
        oneDayAgo.setDate(startDate.getDate() - 1);

        endDate = startDate;
        startDate = getStartDateForStatistics(oneDayAgo, date_unit);
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 問題形式リスト取得
  async getQuizFormatList() {
    return await prisma.quiz_format.findMany({
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
  }

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

  // アップロードされた問題CSVを登録
  // TODO csvのバリデーション処理
  async uploadFile(file: Express.Multer.File) {
    try {
      const csvData = await this.parseCsv<string>(file);
      // トランザクション
      await prisma.$transaction(
        async (prisma) => {
          // csvデータ１行ずつ読み込み
          for (const row of csvData.data) {
            // (問題ファイル番号,問題文,答え文,ダミー選択肢1,ダミー選択肢2,ダミー選択肢3,解説) でない場合終了
            if (row.length !== 7) {
              throw new HttpException(
                `CSVの形式が正しくありません(${row})`,
                HttpStatus.BAD_REQUEST,
              );
            }
            const [
              file_num,
              question,
              answer,
              dummy1,
              dummy2,
              dummy3,
              explanation,
            ] = row;
            // バリデーション
            if (isNaN(+file_num)) {
              throw new HttpException(
                `CSVの形式が正しくありません(${row})`,
                HttpStatus.BAD_REQUEST,
              );
            }
            // 問題データ登録
            // 新問題番号を取得しINSERT
            const res = await prisma.quiz.findFirst({
              select: {
                quiz_num: true,
              },
              where: {
                file_num: +file_num,
              },
              orderBy: {
                quiz_num: 'desc',
              },
              take: 1,
            });
            const new_quiz_num: number =
              res && res.quiz_num ? res.quiz_num + 1 : 1;
            await prisma.quiz.create({
              data: {
                format_id: 3, // 四択問題
                file_num: +file_num,
                quiz_num: new_quiz_num,
                quiz_sentense: question,
                answer,
                // img_file,
                checked: false,
                // カテゴリはとりあえず今はなしで
                quiz_explanation: {
                  ...(explanation && {
                    create: {
                      explanation,
                    },
                  }),
                },
                //  関連問題設定もとりあえず今は無しで
                quiz_dummy_choice: {
                  createMany: {
                    data: [
                      { dummy_choice_sentense: dummy1 },
                      { dummy_choice_sentense: dummy2 },
                      { dummy_choice_sentense: dummy3 },
                    ],
                  },
                },
              },
            });
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
