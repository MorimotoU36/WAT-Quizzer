import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AccuracyRateByCategorySqlResultDto,
  FUTURE_DAY,
  PAST_DAY,
  prisma,
} from 'quizzer-lib';

@Injectable()
export class CategoryService {
  // カテゴリリスト(ファイルごと)取得
  async getCategoryList(file_num: number) {
    try {
      return await prisma.category_view.findMany({
        where: {
          file_num,
        },
        select: {
          category: true,
        },
        orderBy: {
          category: 'asc',
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

  // カテゴリ正解率取得
  async getAccuracyRateByCategory(
    file_num: number,
    startDate?: Date,
    endDate?: Date,
  ) {
    try {
      const result = {};

      // カテゴリビューから指定ファイルのカテゴリ毎の正解率取得
      const categorylogs = await prisma.answer_log.findMany({
        where: {
          quiz: {
            file_num,
          },
          created_at: {
            gte: startDate || PAST_DAY,
            lte: endDate || FUTURE_DAY,
          },
        },
        include: {
          quiz: {
            select: {
              file_num: true,
              quiz_category: {
                select: {
                  category: true,
                },
              },
            },
          },
        },
      });

      const allCategories = await prisma.category_view.findMany({
        select: {
          category: true,
        },
        where: {
          file_num,
        },
      });

      //Prismaではリレーションをまたいだ groupBy はできないため、データを取得後JSで集計する
      const categoryResultMap = new Map<
        string,
        { file_num: number; total: number; correct: number }
      >();
      for (const category of allCategories) {
        const key = `${String(file_num)}+${category.category}`;
        categoryResultMap.set(key, { file_num, total: 0, correct: 0 });
      }
      for (const log of categorylogs) {
        const file_num = log.quiz.file_num;
        const categories = log.quiz.quiz_category.map(
          (c) => c.category ?? '未分類',
        );

        for (const category of categories) {
          const key = `${file_num}+${category}`;
          if (!categoryResultMap.has(key)) {
            categoryResultMap.set(key, { file_num, total: 0, correct: 0 });
          }
          const entry = categoryResultMap.get(key)!;
          entry.total += 1;
          if (log.is_corrected === true) {
            entry.correct += 1;
          }
        }
      }

      // map から出力形式に変換
      const categoryResult: AccuracyRateByCategorySqlResultDto[] = [];
      for (const [
        key,
        { file_num, total, correct },
      ] of categoryResultMap.entries()) {
        const [, category] = key.split('+');
        categoryResult.push({
          file_num,
          category,
          count: total,
          accuracy_rate: total > 0 ? 100 * (correct / total) : 0,
        });
      }
      result['result'] = categoryResult;

      // チェック済・全問題の正解率取得
      const checkedLogs = await prisma.answer_log.findMany({
        where: {
          quiz: {
            file_num,
          },
          created_at: {
            gte: startDate || PAST_DAY,
            lte: endDate || FUTURE_DAY,
          },
        },
        include: {
          quiz: {
            select: {
              checked: true,
              file_num: true,
            },
          },
        },
      });

      let total = 0;
      let correct = 0;

      let checkedOnlyTotal = 0;
      let checkedOnlyCorrect = 0;

      for (const log of checkedLogs) {
        const isCorrect = log.is_corrected === true;
        const isChecked = log.quiz.checked === true;

        // 全体の集計
        total += 1;
        if (isCorrect) correct += 1;

        // checked === true のみ
        if (isChecked) {
          checkedOnlyTotal += 1;
          if (isCorrect) checkedOnlyCorrect += 1;
        }
      }

      result['checked_result'] = [
        {
          checked: true,
          count: checkedOnlyTotal,
          sum_clear: checkedOnlyCorrect,
          sum_fail: checkedOnlyTotal - checkedOnlyCorrect,
          accuracy_rate:
            100 *
            (checkedOnlyTotal > 0 ? checkedOnlyCorrect / checkedOnlyTotal : 0),
        },
      ];
      result['all_result'] = [
        {
          count: total,
          sum_clear: correct,
          sum_fail: total - correct,
          accuracy_rate: 100 * (total > 0 ? correct / total : 0),
        },
      ];

      return result;
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
