import {
  ApiResult,
  errorMessage,
  getRandomIntWithRange,
  MESSAGES,
  quizCategoryMockData,
  quizFileMockData,
  quizFormatMockData,
  quizMockData,
  sayingMockData,
  successMessage
} from 'quizzer-lib';
import englishData from '../data/mock/sample-english-data.json';

// モック用のAPI関数群
export const mockGetQuizAPI = async (params: any): Promise<ApiResult> => {
  // 問題を返す（通常取得以外はランダム） TODO チェック済とか問題種別とかカテゴリに対応する？
  const quizList = quizMockData.filter((quiz) => quiz.file_num === params.getQuizRequestData.file_num);
  const quiz = params.getQuizMethod
    ? quizList[Math.floor(Math.random() * quizMockData.length)]
    : quizList.find((quiz) => quiz.quiz_num === params.getQuizRequestData.quiz_num);

  return quiz
    ? {
        message: successMessage(MESSAGES.SUCCESS.MSG00001),
        result: quiz
      }
    : { message: errorMessage(MESSAGES.ERROR.MSG00004) };
};

export const mockSearchQuizAPI = async (params: any): Promise<ApiResult> => {
  // 検索結果として複数の問題を返す
  const searchResults = quizMockData;

  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00015.replace('{0}', String(searchResults.length)),
      messageColor: 'success.light',
      isDisplay: true
    },
    result: searchResults
  };
};

export const mockGetQuizFileListAPI = async (): Promise<ApiResult> => {
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00019,
      messageColor: 'success.light',
      isDisplay: true
    },
    result: quizFileMockData
  };
};

export const mockGetQuizFormatListAPI = async (): Promise<ApiResult> => {
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00019,
      messageColor: 'success.light',
      isDisplay: false
    },
    result: quizFormatMockData
  };
};

export const mockGetCategoryListAPI = async (file_num: string): Promise<ApiResult> => {
  const quizIdList = quizMockData.filter((quiz) => quiz.file_num === +file_num).map((quiz) => quiz.id);
  const categoryList = quizCategoryMockData.filter((category) => quizIdList.includes(category.quiz_id));
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00019,
      messageColor: 'success.light',
      isDisplay: true
    },
    result: categoryList
  };
};

export const mockSearchWordAPI = async (params: any): Promise<ApiResult> => {
  // 検索結果として複数の単語を返す
  const searchResults = englishData.words.slice(0, 3);

  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00019,
      messageColor: 'success.light',
      isDisplay: true
    },
    result: searchResults
  };
};

export const mockGetWordDetailAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00019,
      messageColor: 'success.light',
      isDisplay: true
    },
    result: englishData.wordDetail
  };
};

export const mockGetPartOfSpeechListAPI = async (): Promise<ApiResult> => {
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00019,
      messageColor: 'success.light',
      isDisplay: true
    },
    result: englishData.partOfSpeechList
  };
};

export const mockGetSourceListAPI = async (): Promise<ApiResult> => {
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00019,
      messageColor: 'success.light',
      isDisplay: true
    },
    result: englishData.sourceList
  };
};

export const mockSearchSayingAPI = async (params: any): Promise<ApiResult> => {
  // 検索結果として複数の格言を返す
  const searchResults = sayingMockData.slice(0, 3);

  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00019,
      messageColor: 'success.light',
      isDisplay: true
    },
    result: searchResults
  };
};

// 認証関連のモック関数（常に成功を返す）
export const mockLoginAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00023,
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
      message: MESSAGES.SUCCESS.MSG00024,
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
      message: MESSAGES.SUCCESS.MSG00002,
      messageColor: 'success.light',
      isDisplay: true
    },
    result: {
      log: 'Added!! [1-999]:test,test',
      file_num: 1,
      quiz_num: 1,
      quiz_sentense: 'test',
      answer: 'test'
    }
  };
};

export const mockEditQuizAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00018,
      messageColor: 'success.light',
      isDisplay: true
    },
    result: { result: 'Edited!' }
  };
};

export const mockDeleteQuizAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: successMessage(
      MESSAGES.SUCCESS.MSG00009,
      String(params.deleteQuizAPIRequestData.file_num),
      String(params.deleteQuizAPIRequestData.quiz_num)
    )
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
  const randomSaying = sayingMockData[Math.floor(Math.random() * sayingMockData.length)];

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
      message: MESSAGES.SUCCESS.MSG00008.replace('{0}', String(params.getQuizResponseData.quiz_num)),
      messageColor: 'success.light',
      isDisplay: true
    }
  };
};

export const mockFailQuizAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00011.replace('{0}', String(params.getQuizResponseData.quiz_num)),
      messageColor: 'success.light',
      isDisplay: true
    }
  };
};

export const mockReverseCheckQuizAPI = async (params: any): Promise<ApiResult> => {
  return {
    message: {
      message: MESSAGES.SUCCESS.MSG00006.replace('{0}', String(params.getQuizResponseData.quiz_num)),
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
      file_nickname: quizFileMockData.find((file) => file.file_num === params.file_num)?.file_nickname || '全総合',
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
  return {
    message: {
      message: '回答ログ統計データを取得しました',
      messageColor: 'success.light',
      isDisplay: true
    },
    result:
      params.getAnswerLogStatisticsData.date_unit === 'week'
        ? [
            { date: '2023-11-26', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) },
            { date: '2023-12-03', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) },
            { date: '2023-12-10', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) },
            { date: '2023-12-17', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) },
            { date: '2023-12-24', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) },
            { date: '2023-12-31', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) },
            { date: '2024-01-07', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) }
          ]
        : params.getAnswerLogStatisticsData.date_unit === 'month'
          ? [
              {
                date: '2023-07-01',
                count: getRandomIntWithRange(0, 100),
                accuracy_rate: getRandomIntWithRange(0, 100)
              },
              {
                date: '2023-08-01',
                count: getRandomIntWithRange(0, 100),
                accuracy_rate: getRandomIntWithRange(0, 100)
              },
              {
                date: '2023-09-01',
                count: getRandomIntWithRange(0, 100),
                accuracy_rate: getRandomIntWithRange(0, 100)
              },
              {
                date: '2023-10-01',
                count: getRandomIntWithRange(0, 100),
                accuracy_rate: getRandomIntWithRange(0, 100)
              },
              {
                date: '2023-11-01',
                count: getRandomIntWithRange(0, 100),
                accuracy_rate: getRandomIntWithRange(0, 100)
              },
              {
                date: '2023-12-01',
                count: getRandomIntWithRange(0, 100),
                accuracy_rate: getRandomIntWithRange(0, 100)
              },
              { date: '2024-01-01', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) }
            ]
          : [
              {
                date: '2024-01-01',
                count: getRandomIntWithRange(0, 100),
                accuracy_rate: getRandomIntWithRange(0, 100)
              },
              {
                date: '2024-01-02',
                count: getRandomIntWithRange(0, 100),
                accuracy_rate: getRandomIntWithRange(0, 100)
              },
              {
                date: '2024-01-03',
                count: getRandomIntWithRange(0, 100),
                accuracy_rate: getRandomIntWithRange(0, 100)
              },
              {
                date: '2024-01-04',
                count: getRandomIntWithRange(0, 100),
                accuracy_rate: getRandomIntWithRange(0, 100)
              },
              {
                date: '2024-01-05',
                count: getRandomIntWithRange(0, 100),
                accuracy_rate: getRandomIntWithRange(0, 100)
              },
              {
                date: '2024-01-07',
                count: getRandomIntWithRange(0, 100),
                accuracy_rate: getRandomIntWithRange(0, 100)
              },
              { date: '2024-01-07', count: getRandomIntWithRange(0, 100), accuracy_rate: getRandomIntWithRange(0, 100) }
            ]
  };
};

export const mockAddCategoryToQuizAPI = async (params: any): Promise<ApiResult> => {
  const { addCategoryToQuizRequestData } = params;

  if (!addCategoryToQuizRequestData.quiz_id || addCategoryToQuizRequestData.quiz_id === '') {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00001)
    };
  }

  return {
    message: successMessage(MESSAGES.SUCCESS.MSG00004),
    result: { id: 999 }
  };
};

export const mockDeleteCategoryOfQuizAPI = async (params: any): Promise<ApiResult> => {
  const { deleteCategoryToQuizRequestData } = params;

  if (!deleteCategoryToQuizRequestData.quiz_id || deleteCategoryToQuizRequestData.quiz_id === '') {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00001)
    };
  }

  return {
    message: successMessage(MESSAGES.SUCCESS.MSG00004),
    result: { id: 999 }
  };
};

export const mockCheckOnQuizAPI = async (params: any): Promise<ApiResult> => {
  const { checkQuizRequestData } = params;

  if (!checkQuizRequestData.quiz_id || checkQuizRequestData.quiz_id === '') {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00007)
    };
  }

  return {
    message: successMessage(MESSAGES.SUCCESS.MSG00005),
    result: { id: 999 }
  };
};

export const mockCheckOffQuizAPI = async (params: any): Promise<ApiResult> => {
  const { checkQuizRequestData } = params;

  if (!checkQuizRequestData.quiz_id || checkQuizRequestData.quiz_id === '') {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00007)
    };
  }

  return {
    message: successMessage(MESSAGES.SUCCESS.MSG00005),
    result: { id: 999 }
  };
};

export const mockIntegrateQuizAPI = async (params: any): Promise<ApiResult> => {
  const { integrateToQuizAPIRequestData } = params;

  if (!integrateToQuizAPIRequestData.fromQuizId || !integrateToQuizAPIRequestData.toQuizId) {
    return {
      message: errorMessage(MESSAGES.ERROR.MSG00010)
    };
  }

  return {
    message: successMessage(
      MESSAGES.SUCCESS.MSG00014,
      'ID',
      String(integrateToQuizAPIRequestData.fromQuizId),
      String(integrateToQuizAPIRequestData.toQuizId)
    ),
    result: { id: 999 }
  };
};

export const mockGetAccuracyRateByCategoryAPI = async (params: any): Promise<ApiResult> => {
  const { getCategoryRateData } = params;

  if (getCategoryRateData.file_num === -1) {
    return {
      message: {
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    };
  }

  // 指定されたファイルのカテゴリを取得
  const quizIdList = quizMockData.filter((quiz) => quiz.file_num === getCategoryRateData.file_num).map((quiz) => quiz.id);
  const categories = quizCategoryMockData.filter((category) => quizIdList.includes(category.quiz_id));
  
  // カテゴリごとの正解率データを生成
  const result = categories.map((category) => ({
    file_num: getCategoryRateData.file_num,
    category: category.category || '',
    count: getRandomIntWithRange(10, 100),
    accuracy_rate: getRandomIntWithRange(0, 100)
  }));

  // チェック済み問題の正解率データ
  const checked_result = [
    {
      checked: true,
      count: BigInt(getRandomIntWithRange(5, 50)),
      sum_clear: getRandomIntWithRange(0, 30),
      sum_fail: getRandomIntWithRange(0, 20),
      accuracy_rate: getRandomIntWithRange(0, 100)
    }
  ];

  // 全問題の正解率データ
  const all_result = [
    {
      count: BigInt(getRandomIntWithRange(50, 200)),
      sum_clear: getRandomIntWithRange(20, 100),
      sum_fail: getRandomIntWithRange(10, 80),
      accuracy_rate: getRandomIntWithRange(0, 100)
    }
  ];

  return {
    message: {
      message: '　',
      messageColor: 'common.black',
      isDisplay: false
    },
    result: {
      result,
      checked_result,
      all_result
    }
  };
};
