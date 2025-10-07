import { ApiResult } from 'quizzer-lib';
import quizData from '../data/mock/sample-quiz-data.json';
import englishData from '../data/mock/sample-english-data.json';
import sayingData from '../data/mock/sample-saying-data.json';

// モック用のAPI関数群
export const mockGetQuizAPI = async (params: any): Promise<ApiResult> => {
  // ランダムな問題を返す
  const randomQuiz = quizData.quizList[Math.floor(Math.random() * quizData.quizList.length)];

  return {
    message: {
      message: 'Success!! 1問の問題を取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: randomQuiz
  };
};

export const mockSearchQuizAPI = async (params: any): Promise<ApiResult> => {
  // 検索結果として複数の問題を返す
  const searchResults = quizData.quizList.slice(0, 3);

  return {
    message: {
      message: 'Success!! 3問の問題を取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: searchResults
  };
};

export const mockGetQuizFileListAPI = async (): Promise<ApiResult> => {
  return {
    message: {
      message: 'Success!! ファイル一覧を取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: quizData.quizFiles
  };
};

export const mockGetQuizFormatListAPI = async (): Promise<ApiResult> => {
  return {
    message: {
      message: 'Success!! 問題形式一覧を取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: quizData.quizFormats
  };
};

export const mockGetCategoryListAPI = async (): Promise<ApiResult> => {
  return {
    message: {
      message: 'Success!! カテゴリ一覧を取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: quizData.categories
  };
};

export const mockSearchWordAPI = async (params: any): Promise<ApiResult> => {
  // 検索結果として複数の単語を返す
  const searchResults = englishData.words.slice(0, 3);

  return {
    message: {
      message: 'Success!! 3件の単語を取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: searchResults
  };
};

export const mockGetWordDetailAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: 'Success!! 単語詳細を取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: englishData.wordDetail
  };
};

export const mockGetPartOfSpeechListAPI = async (): Promise<ApiResult> => {
  return {
    message: {
      message: 'Success!! 品詞一覧を取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: englishData.partOfSpeechList
  };
};

export const mockGetSourceListAPI = async (): Promise<ApiResult> => {
  return {
    message: {
      message: 'Success!! ソース一覧を取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: englishData.sourceList
  };
};

export const mockSearchSayingAPI = async (params: any): Promise<ApiResult> => {
  // 検索結果として複数の格言を返す
  const searchResults = sayingData.sayings.slice(0, 3);

  return {
    message: {
      message: 'Success!! 3件の格言を取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: searchResults
  };
};

export const mockGetSayingCategoryListAPI = async (): Promise<ApiResult> => {
  return {
    message: {
      message: 'Success!! 格言カテゴリ一覧を取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: sayingData.categories
  };
};

// 認証関連のモック関数（常に成功を返す）
export const mockLoginAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: 'ログインに成功しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    }
  };
};

export const mockLogoutAPI = async (): Promise<ApiResult> => {
  return {
    message: {
      message: 'ログアウトしました',
      messageColor: 'success.light',
      isDisplay: true
    }
    //result: null
  };
};

// その他のAPI関数も必要に応じて追加
export const mockAddQuizAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: '問題を追加しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: { id: 999 }
  };
};

export const mockEditQuizAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: '問題を編集しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: { id: params.id }
  };
};

export const mockDeleteQuizAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: '問題を削除しました',
      messageColor: 'success.light',
      isDisplay: true
    }
    //result: null
  };
};

export const mockAddWordAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: '単語を追加しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: { id: 999 }
  };
};

export const mockAddExampleAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: '例文を追加しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: { id: 999 }
  };
};

export const mockGetImageOfQuizAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: '画像を取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: {
      imageUrl: 'https://via.placeholder.com/400x300/cccccc/666666?text=Sample+Quiz+Image'
    }
  };
};
