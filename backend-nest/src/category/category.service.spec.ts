import { CategoryService } from './category.service';
import { prisma } from 'quizzer-lib';

jest.mock('quizzer-lib', () => {
  // prismaモックを作る
  const mockPrisma = {
    $transaction: jest.fn(),
    category_view: {
      findMany: jest.fn(),
    },
    quiz_view: {
      groupBy: jest.fn(),
    },
  };
  return {
    prisma: mockPrisma,
  };
});

describe('CategoryService', () => {
  let categoryService: CategoryService;

  beforeEach(() => {
    categoryService = new CategoryService();
  });

  // カテゴリリスト取得 正常系
  it('getCategoryList - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = {
      file_num: 0,
      category: 'categorytest',
      created_at: '2000-01-01 00:00:00',
      updated_at: '2000-01-01 00:00:00',
      deleted_at: null,
    };
    (prisma.category_view.findMany as jest.Mock).mockResolvedValue(testResult);
    expect(await categoryService.getCategoryList(0)).toBe(testResult);
  });

  // カテゴリリスト取得 異常系
  it('getCategoryList - NG', async () => {
    (prisma.category_view.findMany as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(categoryService.getCategoryList(0)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // カテゴリ正解率取得 正常系
  it('getAccuracyRateByCategory - OK', async () => {
    (prisma.category_view.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.quiz_view.groupBy as jest.Mock).mockResolvedValue([]);
    expect(await categoryService.getAccuracyRateByCategory(0)).toEqual({
      all_result: [],
      checked_result: [],
      result: [],
    });
  });

  // カテゴリ正解率取得 異常系
  it('getAccuracyRateByCategory - NG', async () => {
    (prisma.category_view.findMany as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(
      categoryService.getAccuracyRateByCategory(0),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });
});
