import { EnglishService } from './english.service';
import { prisma } from 'quizzer-lib';

jest.mock('quizzer-lib', () => {
  // prismaモックを作る
  const mockPrisma = {
    $transaction: jest.fn(),
    partsofspeech: {
      findMany: jest.fn(),
    },
    source: {
      findMany: jest.fn(),
    },
    word: {
      findUnique: jest.fn(),
    },
  };
  return {
    prisma: mockPrisma,
  };
});

describe('EnglishService', () => {
  let englishService: EnglishService;

  beforeEach(() => {
    englishService = new EnglishService();
  });

  // 品詞リスト取得 正常系
  it('getPartsofSpeechService - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        id: 0,
        name: '品詞テスト',
        created_at: '2000-01-01 00:00:00',
        updated_at: '2000-01-01 00:00:00',
        deleted_at: null,
      },
    ];
    (prisma.partsofspeech.findMany as jest.Mock).mockResolvedValueOnce(
      testResult,
    );
    expect(await englishService.getPartsofSpeechService()).toEqual(testResult);
  });

  // 品詞リスト取得 異常系
  it('getPartsofSpeechService - NG', async () => {
    (prisma.partsofspeech.findMany as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(
      englishService.getPartsofSpeechService(),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 出典リスト取得 正常系
  it('getSourceService - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        id: 0,
        name: '出典テスト',
        created_at: '2000-01-01 00:00:00',
        updated_at: '2000-01-01 00:00:00',
        deleted_at: null,
      },
    ];
    (prisma.source.findMany as jest.Mock).mockResolvedValueOnce(testResult);
    expect(await englishService.getSourceService()).toEqual(testResult);
  });

  // 出典リスト取得 異常系
  it('getSourceService - NG', async () => {
    (prisma.source.findMany as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(englishService.getSourceService()).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 例文追加 正常系
  it('addExampleService - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = {
      result: 'Added!',
    };
    (prisma.word.findUnique as jest.Mock).mockResolvedValueOnce(testResult);
    expect(
      await englishService.addExampleService({
        exampleEn: 'Example',
        exampleJa: '例文',
        wordName: 'test',
      }),
    ).toEqual(testResult);
  });

  // 例文追加 異常系
  it('addExampleService - NG', async () => {
    (prisma.word.findUnique as jest.Mock).mockRejectedValue(
      new Error('error test by jest.'),
    );
    await expect(
      englishService.addExampleService({
        exampleEn: 'Example',
        exampleJa: '例文',
        wordName: 'test',
      }),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });
});
