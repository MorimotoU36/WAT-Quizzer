import { SayingService } from './saying.service';
import { prisma, getRandomElementFromArray } from 'quizzer-lib';

jest.mock('quizzer-lib', () => {
  // prismaモックを作る
  const mockPrisma = {
    selfhelp_book: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    saying: {
      findMany: jest.fn(),
      groupBy: jest.fn(),
      create: jest.fn(),
    },
  };
  return { prisma: mockPrisma, getRandomElementFromArray: jest.fn() };
});

describe('SayingService', () => {
  let sayingService: SayingService;

  beforeEach(() => {
    sayingService = new SayingService();
  });

  // 格言ランダム取得 正常系
  it('getRandomSaying - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        saying: '格言テスト',
      },
    ];
    (getRandomElementFromArray as jest.Mock).mockReturnValue(testResult);
    (prisma.saying.findMany as jest.Mock).mockResolvedValueOnce(testResult);
    expect(await sayingService.getRandomSaying()).toEqual(testResult);
  });

  // 格言ランダム取得 異常系
  it('getRandomSaying - NG', async () => {
    (prisma.saying.findMany as jest.Mock).mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(sayingService.getRandomSaying()).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 啓発本追加 正常系
  it('addBookService - OK', async () => {
    // テストデータ
    const req = {
      book_name: '本の名前',
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        saying: '格言テスト',
      },
    ];
    (prisma.selfhelp_book.create as jest.Mock).mockResolvedValueOnce(
      testResult,
    );
    expect(await sayingService.addBookService(req)).toEqual(testResult);
  });

  // 啓発本追加 異常系
  it('addBookService - NG', async () => {
    // テストデータ
    const req = {
      book_name: '本の名前',
    };
    (prisma.selfhelp_book.create as jest.Mock).mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(sayingService.addBookService(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 啓発本リスト取得 正常系
  it('getBookListService - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        saying: '格言テスト',
      },
    ];
    (prisma.selfhelp_book.findMany as jest.Mock).mockResolvedValueOnce(
      testResult,
    );
    expect(await sayingService.getBookListService()).toEqual(testResult);
  });

  // 啓発本リスト取得 異常系
  it('getBookListService - NG', async () => {
    (prisma.selfhelp_book.findMany as jest.Mock).mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(sayingService.getBookListService()).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 格言追加 正常系
  it('addSayingService - OK', async () => {
    // テストデータ
    const req = {
      book_id: 0,
      saying: '格言',
      explanation: '説明',
    };
    // テストデータ groupBy
    const groupbyTest = [
      {
        _max: {
          book_saying_id: 1,
        },
      },
    ];
    // テストデータ 正常時の返り値
    const testResult = [
      {
        book_saying_id: 0,
        saying: '格言テスト',
      },
    ];
    (prisma.saying.groupBy as jest.Mock).mockResolvedValue(groupbyTest);
    (prisma.saying.create as jest.Mock).mockResolvedValue(testResult);
    expect(await sayingService.addSayingService(req)).toEqual(testResult);
  });

  // 格言追加 異常系。
  it('addSayingService - NG', async () => {
    // テストデータ
    const req = {
      book_id: 0,
      saying: '格言',
      explanation: '説明',
    };
    (prisma.saying.groupBy as jest.Mock).mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(sayingService.addSayingService(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });
});
