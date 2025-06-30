import { QuizService } from './quiz.service';
import {
  prisma,
  getRandomElementFromArray,
  getPrismaYesterdayRange,
  xor,
} from 'quizzer-lib';
import { emptyResult } from '../../test/constants';

jest.mock('quizzer-lib', () => {
  // prismaモックを作る
  const mockPrisma = {
    $transaction: jest.fn(),
    quiz: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    answer_log: {
      create: jest.fn(),
      updateMany: jest.fn(),
    },
    quiz_basis_advanced_linkage: {
      updateMany: jest.fn(),
      upsert: jest.fn(),
    },
    quiz_dummy_choice: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    quiz_category: {
      updateMany: jest.fn(),
      upsert: jest.fn(),
    },
  };
  return {
    prisma: mockPrisma,
    getRandomElementFromArray: jest.fn(),
    getPrismaYesterdayRange: jest.fn(),
    xor: jest.fn(),
  };
});

describe('QuizService', () => {
  let quizService: QuizService;

  const getQuizResultTest = [
    {
      id: 0,
      file_num: 0,
      quiz_num: 0,
      quiz_sentense: '品詞テスト',
      quiz_category: [
        {
          category: 'カテゴリ',
        },
      ],
      quiz_statistics_view: {
        clear_count: 1,
        fail_count: 1,
        accuracy_rate: 50,
      },
      answer: '品詞テスト',
      img_file: 'img',
      checked: 0,
      clear_count: 0,
      fail_count: 0,
      created_at: '2000-01-01 00:00:00',
      updated_at: '2000-01-01 00:00:00',
      deleted_at: null,
    },
  ];

  beforeEach(() => {
    quizService = new QuizService();
  });

  // 問題取得 正常系
  it('getQuiz - OK', async () => {
    (prisma.quiz.findMany as jest.Mock).mockResolvedValueOnce(
      getQuizResultTest,
    );
    expect(await quizService.getQuiz({ file_num: 1, quiz_num: 1 })).toEqual({
      ...getQuizResultTest[0],
      count: 1,
      quiz_statistics_view: {
        clear_count: '1',
        fail_count: '1',
        accuracy_rate: '50',
      },
    });
  });

  // 問題取得 異常系
  it('getQuiz - NG', async () => {
    (prisma.quiz.findMany as jest.Mock).mockResolvedValueOnce([]);
    await expect(
      quizService.getQuiz({ file_num: 1, quiz_num: 1 }),
    ).rejects.toMatchObject({
      message: '条件に合致するデータはありません',
    });
  });

  // 問題ランダム取得 正常系
  it('getRandomQuiz - OK', async () => {
    (prisma.quiz.findMany as jest.Mock).mockResolvedValueOnce(
      getQuizResultTest,
    );
    (getRandomElementFromArray as jest.Mock).mockReturnValueOnce(
      getQuizResultTest[0],
    );
    expect(
      await quizService.getQuiz({ file_num: 1, quiz_num: 1 }, 'random'),
    ).toEqual({
      ...getQuizResultTest[0],
      count: 1,
      quiz_statistics_view: {
        clear_count: '1',
        fail_count: '1',
        accuracy_rate: '50',
      },
    });
  });

  // 最低正解率問題取得 正常系
  it('getWorstRateQuiz - OK', async () => {
    (prisma.quiz.findMany as jest.Mock).mockResolvedValueOnce(
      getQuizResultTest,
    );
    expect(
      await quizService.getQuiz({ file_num: 1, quiz_num: 1 }, 'worstRate'),
    ).toEqual({
      ...getQuizResultTest[0],
      count: 1,
      quiz_statistics_view: {
        clear_count: '1',
        fail_count: '1',
        accuracy_rate: '50',
      },
    });
  });

  // 最小正解数問題取得 正常系
  it('getMinimumAnsweredQuiz - OK', async () => {
    (prisma.quiz.findMany as jest.Mock).mockResolvedValueOnce(
      getQuizResultTest,
    );
    expect(
      await quizService.getQuiz({ file_num: 1, quiz_num: 1 }, 'leastClear'),
    ).toEqual({
      ...getQuizResultTest[0],
      count: 1,
      quiz_statistics_view: {
        clear_count: '1',
        fail_count: '1',
        accuracy_rate: '50',
      },
    });
  });

  // 最後に回答してから最も長い時間が経っている問題を取得 正常系
  it('getLRUQuiz - OK', async () => {
    (prisma.quiz.findMany as jest.Mock).mockResolvedValueOnce(
      getQuizResultTest,
    );
    expect(
      await quizService.getQuiz({ file_num: 1, quiz_num: 1 }, 'LRU'),
    ).toEqual({
      ...getQuizResultTest[0],
      count: 1,
      quiz_statistics_view: {
        clear_count: '1',
        fail_count: '1',
        accuracy_rate: '50',
      },
    });
  });

  // 昨日間違えた問題を取得 正常系
  it('getReviewQuiz - OK', async () => {
    (prisma.quiz.findMany as jest.Mock).mockResolvedValueOnce(
      getQuizResultTest,
    );
    (getPrismaYesterdayRange as jest.Mock).mockResolvedValueOnce({});
    (getRandomElementFromArray as jest.Mock).mockReturnValueOnce(
      getQuizResultTest[0],
    );
    expect(
      await quizService.getQuiz({ file_num: 1, quiz_num: 1 }, 'review'),
    ).toEqual({
      ...getQuizResultTest[0],
      count: 1,
      quiz_statistics_view: {
        clear_count: '1',
        fail_count: '1',
        accuracy_rate: '50',
      },
    });
  });

  // 正解登録 正常系
  it('cleared - OK', async () => {
    // テストデータ
    // TODO dtoの方にもあったがquiz_idしか使ってないので他はいらない 見直したい
    const req = {
      quiz_id: 22,
      format_id: 0,
      file_num: 0,
      quiz_num: 0,
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        result: 'OK',
      },
    ];
    (prisma.answer_log.create as jest.Mock).mockResolvedValueOnce(testResult);
    expect(await quizService.cleared(req)).toEqual(testResult);
  });

  // 不正解登録 正常系
  it('failed - OK', async () => {
    // テストデータ
    // TODO こっちも 正解登録と同じ
    const req = {
      quiz_id: 22,
      format_id: 0,
      file_num: 0,
      quiz_num: 0,
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        result: 'OK',
      },
    ];
    (prisma.answer_log.create as jest.Mock).mockResolvedValueOnce(testResult);
    expect(await quizService.failed(req)).toEqual(testResult);
  });

  // 問題を１問追加 正常系
  it('add - OK', async () => {
    // テストデータ
    const req = {
      file_num: 1,
      question: '問題文',
      answer: '答え',
      format_id: 2,
      category: 'カテゴリ',
      img_file: '画像ファイル',
      matched_basic_quiz_id: '1,2,3',
      dummy1: 'ダミー選択肢１', //四択問題のダミー選択肢１
      dummy2: 'ダミー選択肢２', //四択問題のダミー選択肢２
      dummy3: 'ダミー選択肢３', //四択問題のダミー選択肢３
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        quiz_num: 1,
      },
    ];
    // 正解データ
    const correctData = [
      {
        result: `Added!! [0-2]:問題文,答え`,
      },
    ];
    (prisma.quiz.findFirst as jest.Mock).mockResolvedValue(testResult);
    (prisma.quiz.create as jest.Mock).mockResolvedValue(correctData);
    expect(await quizService.add(req)).toEqual(correctData);
  });

  // 問題編集 正常系1
  it('edit - OK', async () => {
    // テストデータ
    const req = {
      quiz_id: 22,
      format_id: 1,
      file_num: 0,
      quiz_num: 0,
      question: '問題文',
      answer: '答え',
      category: 'カテゴリ',
      img_file: '画像ファイル',
      matched_basic_quiz_id: '1,2,3',
      dummy1: 'ダミー選択肢１', //四択問題のダミー選択肢１
      dummy2: 'ダミー選択肢２', //四択問題のダミー選択肢２
      dummy3: 'ダミー選択肢３', //四択問題のダミー選択肢３
      explanation: '説明',
    };
    // テストデータ 正常時の返り値
    const testResult = { result: 'Edited!' };
    (prisma.$transaction as jest.Mock).mockResolvedValue(emptyResult);
    expect(await quizService.edit(req)).toEqual(testResult);
  });

  // 問題編集 異常系１
  it('edit - NG1', async () => {
    // テストデータ
    const req = {
      quiz_id: 22,
      format: 'basic',
      file_num: 0,
      quiz_num: 0,
      question: '問題文',
      answer: '答え',
      category: 'カテゴリ',
      img_file: '画像ファイル',
      matched_basic_quiz_id: '1,2,3',
      dummy1: 'ダミー選択肢１', //四択問題のダミー選択肢１
      dummy2: 'ダミー選択肢２', //四択問題のダミー選択肢２
      dummy3: 'ダミー選択肢３', //四択問題のダミー選択肢３
      explanation: '説明',
    };
    (prisma.$transaction as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(quizService.edit(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題検索 正常系1
  it('search - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        result: 'OK',
      },
    ];
    (prisma.quiz.findMany as jest.Mock).mockResolvedValue(testResult);
    (xor as jest.Mock).mockResolvedValue({});
    expect(
      await quizService.search({
        min_rate: 0,
        max_rate: 100,
        format_id: { '1': true },
        category: 'カテゴリ',
        checked: true,
        query: 'クエリ',
        searchInOnlySentense: true,
        searchInOnlyAnswer: true,
        file_num: 1,
      }),
    ).toEqual(testResult);
  });

  // 問題検索 異常系1
  it('search - NG1', async () => {
    (prisma.quiz.findMany as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    (xor as jest.Mock).mockResolvedValue({});
    await expect(
      quizService.search({
        min_rate: 0,
        max_rate: 100,
        format_id: { '1': true },
        category: 'カテゴリ',
        checked: true,
        query: 'クエリ',
        searchInOnlySentense: true,
        searchInOnlyAnswer: true,
        file_num: 1,
      }),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題削除 正常系1
  it('delete - OK', async () => {
    // テストデータ
    const req = {
      format: 'basic',
      file_num: 0,
      quiz_num: 0,
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        result: 'OK',
      },
    ];
    (prisma.quiz.update as jest.Mock).mockResolvedValue(testResult);
    expect(await quizService.delete(req)).toEqual(testResult);
  });

  // 問題削除 異常系1
  it('delete - NG1', async () => {
    // テストデータ
    const req = {
      format: 'basic',
      file_num: 0,
      quiz_num: 0,
    };
    (prisma.quiz.update as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(quizService.delete(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題統合 正常系1
  it('integrate - OK', async () => {
    // テストデータ
    const req = {
      fromQuizId: 0,
      toQuizId: 1,
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        category: 'カテゴリ',
      },
    ];
    (prisma.quiz.findUnique as jest.Mock).mockResolvedValue({
      format_id: 1,
    });
    (prisma.$transaction as jest.Mock).mockResolvedValue({
      result: 'OK!',
    });
    expect(await quizService.integrate(req)).toEqual({
      result: 'OK!',
    });
  });

  // 問題統合 異常系1
  it('integrate - NG1', async () => {
    // テストデータ
    const req = {
      fromQuizId: 0,
      toQuizId: 1,
    };
    (prisma.quiz.findUnique as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(quizService.integrate(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題にカテゴリ追加 正常系1
  it('addCategoryToQuiz - OK', async () => {
    // テストデータ
    const req = {
      quiz_id: '0',
      category: 'カテゴリ1',
    };
    (prisma.$transaction as jest.Mock).mockResolvedValue({
      result: 'OK!',
    });
    expect(await quizService.addCategoryToQuiz(req)).toEqual({
      result: 'OK!',
    });
  });

  // 問題にカテゴリ追加 異常系1
  it('addCategoryToQuiz - NG1', async () => {
    // テストデータ
    const req = {
      quiz_id: '0',
      category: 'カテゴリ1',
    };
    (prisma.$transaction as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(quizService.addCategoryToQuiz(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題からカテゴリ削除 正常系1
  it('removeCategoryFromQuiz - OK', async () => {
    // テストデータ
    const req = {
      quiz_id: '0',
      category: 'カテゴリ1',
    };
    (prisma.$transaction as jest.Mock).mockResolvedValue({});
    expect(await quizService.removeCategoryFromQuiz(req)).toEqual({
      result: 'OK!',
    });
  });

  // 問題からカテゴリ削除 異常系1
  it('removeCategoryFromQuiz - NG1', async () => {
    // テストデータ
    const req = {
      quiz_id: '0',
      category: 'カテゴリ1',
    };
    (prisma.$transaction as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(quizService.removeCategoryFromQuiz(req)).rejects.toMatchObject(
      {
        message: 'error test by jest.',
      },
    );
  });

  // 問題にチェック追加 正常系1
  it('check - OK', async () => {
    // テストデータ
    const req = {
      quiz_id: '0',
    };
    (prisma.$transaction as jest.Mock).mockResolvedValue({});
    expect(await quizService.check(req)).toEqual({
      result: 'OK!',
    });
  });

  // 問題にチェック追加 異常系1
  it('check - NG1', async () => {
    // テストデータ
    const req = {
      quiz_id: '0',
    };
    (prisma.$transaction as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(quizService.check(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題にチェック外す 正常系1
  it('uncheck - OK', async () => {
    // テストデータ
    const req = {
      quiz_id: '0',
    };
    (prisma.$transaction as jest.Mock).mockResolvedValue({});
    expect(await quizService.uncheck(req)).toEqual({
      result: 'OK!',
    });
  });

  // 問題にチェック外す 異常系1
  it('uncheck - NG1', async () => {
    // テストデータ
    const req = {
      quiz_id: '0',
    };
    (prisma.$transaction as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(quizService.uncheck(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題のチェック反転 正常系1
  it('reverseCheck - OK', async () => {
    // テストデータ
    const req = {
      quiz_id: '0',
    };
    const testResult = {
      result: 'OK!',
    };
    (prisma.quiz.findUnique as jest.Mock).mockResolvedValue({ checked: true });
    (prisma.quiz.update as jest.Mock).mockResolvedValue(testResult);
    expect(await quizService.reverseCheck(req)).toEqual(testResult);
  });

  // 問題のチェック反転 異常系1
  it('reverseCheck - NG1', async () => {
    // テストデータ
    const req = {
      quiz_id: '0',
    };
    (prisma.quiz.findUnique as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(quizService.reverseCheck(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 回答ログ削除 正常系1
  it('deleteAnswerLogByFile - OK', async () => {
    // テストデータ
    const req = {
      file_id: 0,
    };
    (prisma.answer_log.updateMany as jest.Mock).mockResolvedValue({});
    expect(await quizService.deleteAnswerLogByFile(req)).toEqual({
      result: 'Deleted!',
    });
  });

  // 回答ログ削除 異常系1
  it('deleteAnswerLogByFile - NG1', async () => {
    // テストデータ
    const req = {
      file_id: 0,
    };
    (prisma.answer_log.updateMany as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(quizService.deleteAnswerLogByFile(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });
});
