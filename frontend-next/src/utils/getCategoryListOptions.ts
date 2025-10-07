import {
  getCategoryListAPI,
  getCategoryListAPIResponseToPullDownAdapter,
  GetCategoryAPIResponseDto
} from 'quizzer-lib';

// カテゴリリスト取得
export async function getCategoryListOptions(file_num: string) {
  const result = await getCategoryListAPI({ getCategoryListData: { file_num } });
  const pullDownOption = result.result
    ? getCategoryListAPIResponseToPullDownAdapter(result.result as GetCategoryAPIResponseDto[])
    : [];
  return { pullDownOption, message: result.message };
}
