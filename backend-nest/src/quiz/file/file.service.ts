import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AddQuizFileApiRequest,
  DeleteQuizFileApiRequest,
  prisma,
  QuizFileStatisticsApiResponse,
} from 'quizzer-lib';

export interface QueryType {
  query: string;
  value: (string | number)[];
}

export type FormatType = 'basic' | 'applied';

@Injectable()
export class QuizFileService {
  // ファイル名リスト取得
  async getFileList() {
    return await prisma.quiz_file.findMany({
      select: {
        file_num: true,
        file_name: true,
        file_nickname: true,
      },
      where: {
        deleted_at: null,
      },
      orderBy: {
        file_num: 'asc',
      },
    });
  }

  // ファイル統計ビューデータ取得
  async getFileStatisticsData(): Promise<QuizFileStatisticsApiResponse[]> {
    const result = await prisma.quiz_file_view.findMany({
      select: {
        file_num: true,
        file_name: true,
        file_nickname: true,
        count: true,
        clear: true,
        fail: true,
        not_answered: true,
        accuracy_rate: true,
        process_rate: true,
      },
      orderBy: {
        file_num: 'asc',
      },
    });

    return result.map((x) => {
      return {
        ...x,
        count: Number(x.count),
        clear: Number(x.clear),
        fail: Number(x.fail),
        not_answered: Number(x.not_answered),
        accuracy_rate: Number(x.accuracy_rate),
        process_rate: Number(x.process_rate),
      };
    });
  }

  // ファイル追加
  async addFile(req: AddQuizFileApiRequest) {
    try {
      const { file_name, file_nickname } = req;
      // ファイル追加
      return await prisma.quiz_file.create({
        data: {
          file_name,
          file_nickname,
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

  // ファイル削除（とりあえず基礎問題のみ）
  async deleteFile(req: DeleteQuizFileApiRequest) {
    try {
      const { file_id } = req;

      //トランザクション実行
      await prisma.$transaction(async (prisma) => {
        // 指定ファイルの問題全削除
        await prisma.quiz.updateMany({
          data: {
            deleted_at: new Date(),
          },
          where: {
            file_num: file_id,
          },
        });

        // 指定ファイルの回答ログ全削除
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

        // 指定ファイル削除
        await prisma.quiz_file.update({
          data: {
            deleted_at: new Date(),
          },
          where: {
            file_num: file_id,
          },
        });
      });
      return { result: 'Deleted.' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
