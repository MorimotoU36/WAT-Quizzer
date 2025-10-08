import { ApiResult, getRandomIntWithRange } from 'quizzer-lib';
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

export const mockGetSayingAPI = async (params: any): Promise<ApiResult> => {
  // ランダムな格言を返す
  const randomSaying = sayingData.sayings[Math.floor(Math.random() * sayingData.sayings.length)];

  return {
    message: {
      message: '格言を取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: randomSaying
  };
};

export const mockClearQuizAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: 'クイズをクリアしました',
      messageColor: 'success.light',
      isDisplay: true
    }
  };
};

export const mockFailQuizAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: 'クイズを失敗として記録しました',
      messageColor: 'success.light',
      isDisplay: true
    }
  };
};

export const mockReverseCheckQuizAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: 'チェックを反転しました',
      messageColor: 'success.light',
      isDisplay: true
    }
  };
};

export const mockGetWordSummaryDataAPI = async (): Promise<ApiResult> => {
  return {
    message: {
      message: '単語サマリーデータを取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: [
      { source: 'TOEIC', count: 150 },
      { source: '英検1級', count: 200 },
      { source: 'その他', count: 50 }
    ]
  };
};

export const mockGetRandomWordAPI = async (): Promise<ApiResult> => {
  const randomWord = englishData.words[Math.floor(Math.random() * englishData.words.length)];
  return {
    message: {
      message: 'ランダム単語を取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: {
      id: randomWord.id,
      name: randomWord.word_name,
      mean: randomWord.meaning,
      word_source: randomWord.source
    }
  };
};

export const mockGetWordTestStatisticsWeekDataAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: '週間テスト統計データを取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: [
      { date: '2024-01-01', correct_count: 5, total_count: 10 },
      { date: '2024-01-02', correct_count: 7, total_count: 10 },
      { date: '2024-01-03', correct_count: 6, total_count: 10 },
      { date: '2024-01-04', correct_count: 8, total_count: 10 },
      { date: '2024-01-05', correct_count: 9, total_count: 10 },
      { date: '2024-01-06', correct_count: 7, total_count: 10 },
      { date: '2024-01-07', correct_count: 8, total_count: 10 }
    ]
  };
};

export const mockEditSayingAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: '格言を更新しました',
      messageColor: 'success.light',
      isDisplay: true
    }
  };
};

export const mockAddBookAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: '啓発本を追加しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: { id: 999, name: params.addBookAPIRequest.book_name }
  };
};

export const mockListBookAPI = async (): Promise<ApiResult> => {
  return {
    message: {
      message: '啓発本リストを取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: [
      { id: 1, name: '7つの習慣' },
      { id: 2, name: '人を動かす' },
      { id: 3, name: '思考は現実化する' }
    ]
  };
};

export const mockGetQuizFileStatisticsDataAPI = async (params: any): Promise<ApiResult> => {
  const clearCount = getRandomIntWithRange(0, 50);
  const failCount = getRandomIntWithRange(0, 50);
  return {
    message: {
      message: '問題ファイル統計データを取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: {
      file_num: params.file_num,
      file_nickname: 'サンプルファイル',
      count: 100,
      clear: clearCount,
      fail: failCount,
      not_answered: 100 - clearCount - failCount,
      process_rate: (clearCount / 100) * 100
    }
  };
};

export const mockGetAccuracyRateHistgramDataAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: '正解率ヒストグラムデータを取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result: {
      result: [
        getRandomIntWithRange(0, 100),
        getRandomIntWithRange(0, 100),
        getRandomIntWithRange(0, 100),
        getRandomIntWithRange(0, 100),
        getRandomIntWithRange(0, 100),
        getRandomIntWithRange(0, 100),
        getRandomIntWithRange(0, 100),
        getRandomIntWithRange(0, 100),
        getRandomIntWithRange(0, 100),
        getRandomIntWithRange(0, 100)
      ] // 0-90%の分布
    }
  };
};

export const mockGetAnswerLogStatisticsDataAPI = async (params: any): Promise<ApiResult> => {
  console.log('params', params);
  return {
    message: {
      message: '回答ログ統計データを取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result:
      params.getAnswerLogStatisticsData.data_unit === 'week'
        ? [
            { date: '2023-11-26', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) },
            { date: '2023-12-03', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) },
            { date: '2023-12-10', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) },
            { date: '2023-12-17', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) },
            { date: '2023-12-24', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) },
            { date: '2023-12-31', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) },
            { date: '2024-01-07', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) }
          ]
        : params.getAnswerLogStatisticsData.data_unit === 'month'
        ? []
        : [
            { date: '2023-07-01', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) },
            { date: '2023-08-01', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) },
            { date: '2023-09-01', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) },
            { date: '2023-10-01', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) },
            { date: '2023-11-01', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) },
            { date: '2023-12-01', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) },
            { date: '2024-01-01', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) }
          ]
  };
};
