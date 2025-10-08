import { ApiResult } from 'quizzer-lib';
import * as mockAPI from './mock-api';

// モックモードかどうかを判定する関数
export const isMockMode = (): boolean => {
  return process.env.NEXT_PUBLIC_MOCK_MODE === 'true';
};

// API関数のラッパー関数群
export const getQuizAPI = async (params: any): Promise<ApiResult> => {
  if (isMockMode()) {
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
    return mockAPI.mockGetCategoryListAPI();
  }

  const { getCategoryListAPI: originalGetCategoryListAPI } = await import('quizzer-lib');
  return originalGetCategoryListAPI({ getCategoryListData: { file_num: '0' } });
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
