import { ApiResult } from 'quizzer-lib';
import * as mockAPI from './mock-api';

// モックモードかどうかを判定する関数
export const isMockMode = (): boolean => {
  return process.env.NEXT_PUBLIC_MOCK_MODE === 'true';
};

// API関数のラッパー関数群
export const getQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    // ※モック時ではカテゴリ、正解率による出題は実装していない。 (TODO 直す？)
    console.log('getQuizAPI'); // TODO これ消すとlocalhost時のIntegrateでブラウザが壊れる？
    return mockAPI.mockGetQuizAPI(params);
  }

  // 本番環境では元のAPIを呼び出す
  const { getQuizAPI: originalGetQuizAPI } = await import('quizzer-lib');
  return originalGetQuizAPI(params);
};

export const searchQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockSearchQuizAPI(params);
  }

  const { searchQuizAPI: originalSearchQuizAPI } = await import('quizzer-lib');
  return originalSearchQuizAPI(params);
};

export const getQuizFileListAPI = async (): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetQuizFileListAPI();
  }

  const { getQuizFileListAPI: originalGetQuizFileListAPI } = await import('quizzer-lib');
  return originalGetQuizFileListAPI();
};

export const getQuizFormatListAPI = async (): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetQuizFormatListAPI();
  }

  const { getQuizFormatListAPI: originalGetQuizFormatListAPI } = await import('quizzer-lib');
  return originalGetQuizFormatListAPI();
};

export const getCategoryListAPI = async (p0: { getCategoryListData: { file_num: string } }): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetCategoryListAPI(p0.getCategoryListData.file_num);
  }

  const { getCategoryListAPI: originalGetCategoryListAPI } = await import('quizzer-lib');
  return originalGetCategoryListAPI({ getCategoryListData: { file_num: p0.getCategoryListData.file_num } });
};

export const searchWordAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockSearchWordAPI(params);
  }

  const { searchWordAPI: originalSearchWordAPI } = await import('quizzer-lib');
  return originalSearchWordAPI(params);
};

export const getWordDetailAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetWordDetailAPI(params);
  }

  const { getWordDetailAPI: originalGetWordDetailAPI } = await import('quizzer-lib');
  return originalGetWordDetailAPI(params);
};

export const getPartOfSpeechListAPI = async (): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetPartOfSpeechListAPI();
  }

  const { getPartOfSpeechListAPI: originalGetPartOfSpeechListAPI } = await import('quizzer-lib');
  return originalGetPartOfSpeechListAPI();
};

export const getSourceListAPI = async (): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetSourceListAPI();
  }

  const { getSourceListAPI: originalGetSourceListAPI } = await import('quizzer-lib');
  return originalGetSourceListAPI();
};

export const searchSayingAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockSearchSayingAPI(params);
  }

  const { searchSayingAPI: originalSearchSayingAPI } = await import('quizzer-lib');
  return originalSearchSayingAPI(params);
};

export const loginAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockLoginAPI(params);
  }

  const { authSigninAPI: originalLoginAPI } = await import('quizzer-lib');
  return originalLoginAPI(params);
};

// export const logoutAPI = async (): Promise<ApiResult> => {
//   if (isMockMode()) {
//     return mockAPI.mockLogoutAPI();
//   }

//   const { logoutAPI: originalLogoutAPI } = await import('quizzer-lib');
//   return originalLogoutAPI();
// };

export const addQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockAddQuizAPI(params);
  }

  const { addQuizAPI: originalAddQuizAPI } = await import('quizzer-lib');
  return originalAddQuizAPI(params);
};

export const editQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockEditQuizAPI(params);
  }

  const { editQuizAPI: originalEditQuizAPI } = await import('quizzer-lib');
  return originalEditQuizAPI(params);
};

export const deleteQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockDeleteQuizAPI(params);
  }

  const { deleteQuiz: originalDeleteQuizAPI } = await import('quizzer-lib');
  return originalDeleteQuizAPI(params);
};

export const addWordAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockAddWordAPI(params);
  }

  const { addWordAPI: originalAddWordAPI } = await import('quizzer-lib');
  return originalAddWordAPI(params);
};

export const addExampleAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockAddExampleAPI(params);
  }

  const { submitExampleSentenseAPI: originalAddExampleAPI } = await import('quizzer-lib');
  return originalAddExampleAPI(params);
};

export const getImageOfQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetImageOfQuizAPI(params);
  }

  const { getImageOfQuizAPI: originalGetImageOfQuizAPI } = await import('quizzer-lib');
  return originalGetImageOfQuizAPI(params);
};

export const getSayingAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetSayingAPI(params);
  }

  const { getSayingAPI: originalGetSayingAPI } = await import('quizzer-lib');
  return originalGetSayingAPI(params);
};

export const clearQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockClearQuizAPI(params);
  }

  const { clearQuizAPI: originalClearQuizAPI } = await import('quizzer-lib');
  return originalClearQuizAPI(params);
};

export const failQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockFailQuizAPI(params);
  }

  const { failQuizAPI: originalFailQuizAPI } = await import('quizzer-lib');
  return originalFailQuizAPI(params);
};

export const reverseCheckQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockReverseCheckQuizAPI(params);
  }

  const { reverseCheckQuizAPI: originalReverseCheckQuizAPI } = await import('quizzer-lib');
  return originalReverseCheckQuizAPI(params);
};

export const getWordSummaryDataAPI = async (): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetWordSummaryDataAPI();
  }

  const { getWordSummaryDataAPI: originalGetWordSummaryDataAPI } = await import('quizzer-lib');
  return originalGetWordSummaryDataAPI();
};

export const getRandomWordAPI = async (): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetRandomWordAPI();
  }

  const { getRandomWordAPI: originalGetRandomWordAPI } = await import('quizzer-lib');
  return originalGetRandomWordAPI();
};

export const getWordTestStatisticsWeekDataAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetWordTestStatisticsWeekDataAPI(params);
  }

  const { getWordTestStatisticsWeekDataAPI: originalGetWordTestStatisticsWeekDataAPI } = await import('quizzer-lib');
  return originalGetWordTestStatisticsWeekDataAPI(params);
};

export const editSayingAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockEditSayingAPI(params);
  }

  const { editSayingAPI: originalEditSayingAPI } = await import('quizzer-lib');
  return originalEditSayingAPI(params);
};

export const addBookAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockAddBookAPI(params);
  }

  const { addBookAPI: originalAddBookAPI } = await import('quizzer-lib');
  return originalAddBookAPI(params);
};

export const listBookAPI = async (): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockListBookAPI();
  }

  const { listBook: originalListBookAPI } = await import('quizzer-lib');
  return originalListBookAPI();
};

export const getQuizFileStatisticsDataAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetQuizFileStatisticsDataAPI(params);
  }

  const { getQuizFileStatisticsDataAPI: originalGetQuizFileStatisticsDataAPI } = await import('quizzer-lib');
  return originalGetQuizFileStatisticsDataAPI(params);
};

export const getAccuracyRateHistgramDataAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetAccuracyRateHistgramDataAPI(params);
  }

  const { getAccuracyRateHistgramDataAPI: originalGetAccuracyRateHistgramDataAPI } = await import('quizzer-lib');
  return originalGetAccuracyRateHistgramDataAPI(params);
};

export const getAnswerLogStatisticsDataAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetAnswerLogStatisticsDataAPI(params);
  }

  const { getAnswerLogStatisticsDataAPI: originalGetAnswerLogStatisticsDataAPI } = await import('quizzer-lib');
  return originalGetAnswerLogStatisticsDataAPI(params);
};

export const addCategoryToQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockAddCategoryToQuizAPI(params);
  }

  const { addCategoryToQuizAPI: originalAddCategoryToQuizAPI } = await import('quizzer-lib');
  return originalAddCategoryToQuizAPI(params);
};

export const deleteCategoryOfQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockDeleteCategoryOfQuizAPI(params);
  }

  const { deleteCategoryOfQuizAPI: originalDeleteCategoryOfQuizAPI } = await import('quizzer-lib');
  return originalDeleteCategoryOfQuizAPI(params);
};

export const checkOnQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockCheckOnQuizAPI(params);
  }

  const { checkOnQuizAPI: originalCheckOnQuizAPI } = await import('quizzer-lib');
  return originalCheckOnQuizAPI(params);
};

export const checkOffQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockCheckOffQuizAPI(params);
  }

  const { checkOffQuizAPI: originalCheckOffQuizAPI } = await import('quizzer-lib');
  return originalCheckOffQuizAPI(params);
};

export const integrateQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockIntegrateQuizAPI(params);
  }

  const { integrateQuizAPI: originalIntegrateQuizAPI } = await import('quizzer-lib');
  return originalIntegrateQuizAPI(params);
};

export const getAccuracyRateByCategoryAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockGetAccuracyRateByCategoryAPI(params);
  }

  const { getAccuracyRateByCategoryAPI: originalGetAccuracyRateByCategoryAPI } = await import('quizzer-lib');
  return originalGetAccuracyRateByCategoryAPI(params);
};

export const addQuizFileAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockAddQuizFileAPI(params);
  }

  const { addQuizFileAPI: originalAddQuizFileAPI } = await import('quizzer-lib');
  return originalAddQuizFileAPI(params);
};

export const deleteQuizFileAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockDeleteQuizFileAPI(params);
  }

  const { deleteQuizFileAPI: originalDeleteQuizFileAPI } = await import('quizzer-lib');
  return originalDeleteQuizFileAPI(params);
};

export const deleteAnswerLogOfQuizFileAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockDeleteAnswerLogOfQuizFileAPI(params);
  }

  const { deleteAnswerLogOfQuizFileAPI: originalDeleteAnswerLogOfQuizFileAPI } = await import('quizzer-lib');
  return originalDeleteAnswerLogOfQuizFileAPI(params);
};

export const downloadQuizCsvAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    return mockAPI.mockDownloadQuizCsvAPI(params);
  }

  const { downloadQuizCsvAPI: originalDownloadQuizCsvAPI } = await import('quizzer-lib');
  return originalDownloadQuizCsvAPI(params);
};

export const addTodoAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    // TODO: モック実装が必要な場合は追加
    return { message: { message: 'Mock mode: Todo追加', messageColor: 'success.light', isDisplay: true } };
  }

  const { addTodoAPI: originalAddTodoAPI } = await import('quizzer-lib');
  return originalAddTodoAPI(params);
};

export const deleteTodoAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    // TODO: モック実装が必要な場合は追加
    return { message: { message: 'Mock mode: Todo削除', messageColor: 'success.light', isDisplay: true } };
  }

  const { deleteTodoAPI: originalDeleteTodoAPI } = await import('quizzer-lib');
  return originalDeleteTodoAPI(params);
};

export const getTodoListAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    // TODO: モック実装が必要な場合は追加
    return {
      message: { message: 'Mock mode: Todoリスト取得', messageColor: 'success.light', isDisplay: true },
      result: []
    };
  }

  const { getTodoListAPI: originalGetTodoListAPI } = await import('quizzer-lib');
  return originalGetTodoListAPI(params);
};

export const addTodoDiaryAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
    // TODO: モック実装が必要な場合は追加
    return { message: { message: 'Mock mode: Todo日記追加', messageColor: 'success.light', isDisplay: true } };
  }

  const { addTodoDiaryAPI: originalAddTodoDiaryAPI } = await import('quizzer-lib');
  return originalAddTodoDiaryAPI(params);
};
