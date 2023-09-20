import { CategoryService } from './category.service';
import * as Dao from '../../lib/db/dao';
jest.mock('../../lib/db/dao');

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
    jest.spyOn(Dao, 'execQuery').mockResolvedValueOnce(testResult);
    expect(await categoryService.getCategoryList(0)).toBe(testResult);
  });

  // カテゴリリスト取得 異常系
  it('getCategoryList - NG', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(categoryService.getCategoryList(0)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // // カテゴリ総入れ替え 正常系
  // it('replaceAllCategory - OK', async () => {
  //   // テストデータ 正常時の返り値
  //   const testCategoryResult = [
  //     {
  //       result: 'OK',
  //     },
  //   ];
  //   jest
  //     .spyOn(categoryService, 'replaceAllCategory')
  //     .mockResolvedValueOnce(testCategoryResult);
  //   expect(
  //     await categoryService.replaceAllCategory({
  //       file_num: 0,
  //     }),
  //   ).toBe(testCategoryResult);
  // });
});
