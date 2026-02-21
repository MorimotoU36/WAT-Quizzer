// EnglishBot用のモックデータ

import {
  GetRandomWordAPIResponse,
  PartofSpeechApiResponse,
  SearchExampleAPIResponseDto,
  SourceApiResponse,
  GetWordDetailAPIResponseDto
} from '../../api/english'

export const englishWordsMockData: GetRandomWordAPIResponse[] = [
  {
    id: 1,
    name: 'algorithm',
    pronounce: '/ˈælɡərɪðəm/',
    mean: [
      {
        meaning: 'アルゴリズム',
        partsofspeech: {
          name: '名詞'
        }
      }
    ],
    word_source: [
      {
        source: {
          name: '単語集A'
        }
      }
    ]
  },
  {
    id: 2,
    name: 'framework',
    pronounce: '/ˈfreɪmwɜːrk/',
    mean: [
      {
        meaning: 'フレームワーク',
        partsofspeech: {
          name: '名詞'
        }
      }
    ],
    word_source: [
      {
        source: {
          name: '単語集A'
        }
      }
    ]
  },
  {
    id: 3,
    name: 'deployment',
    pronounce: '/dɪˈplɔɪmənt/',
    mean: [
      {
        meaning: 'デプロイメント',
        partsofspeech: {
          name: '名詞'
        }
      }
    ],
    word_source: [
      {
        source: {
          name: '単語集A'
        }
      }
    ]
  },
  {
    id: 4,
    name: 'infrastructure',
    pronounce: '/ˈɪnfrəstrʌktʃər/',
    mean: [
      {
        meaning: 'インフラストラクチャ',
        partsofspeech: {
          name: '名詞'
        }
      }
    ],
    word_source: [
      {
        source: {
          name: '単語集A'
        }
      }
    ]
  },
  {
    id: 5,
    name: 'optimization',
    pronounce: '/ˌɒptɪmaɪˈzeɪʃən/',
    mean: [
      {
        meaning: '最適化',
        partsofspeech: {
          name: '名詞'
        }
      }
    ],
    word_source: [
      {
        source: {
          name: '単語集A'
        }
      }
    ]
  }
]

export const englishWordDetailMockData: GetWordDetailAPIResponseDto = {
  id: 1,
  name: 'algorithm',
  pronounce: '/ˈælɡərɪðəm/',
  checked: false,
  mean: [
    {
      id: 1,
      wordmean_id: 1,
      meaning: 'アルゴリズム',
      partsofspeech: {
        id: 1,
        name: '名詞'
      }
    }
  ],
  word_source: [
    {
      source: {
        id: 1,
        name: '単語集A'
      }
    }
  ],
  word_subsource: [],
  synonym_original: [],
  synonym_word: [],
  antonym_original: [],
  antonym_word: [],
  derivative: {
    derivative_group_id: -1,
    derivative_group: {
      derivative: []
    }
  },
  word_etymology: []
}

export const partOfSpeechListMockData: PartofSpeechApiResponse[] = [
  {
    id: 1,
    name: '動詞',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    deleted_at: undefined
  },
  {
    id: 2,
    name: '形容詞',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    deleted_at: undefined
  },
  {
    id: 3,
    name: '名詞',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    deleted_at: undefined
  },
  {
    id: 4,
    name: '熟語',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    deleted_at: undefined
  }
]

export const sourceListMockData: SourceApiResponse[] = [
  {
    id: 1,
    name: '単語集A',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    deleted_at: undefined
  },
  {
    id: 2,
    name: 'TARGET B',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    deleted_at: undefined
  },
  {
    id: 3,
    name: 'FOREST',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    deleted_at: undefined
  },
  {
    id: 4,
    name: 'AMERICAN WORDS',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    deleted_at: undefined
  },
  {
    id: 5,
    name: 'BRITISH HILLS',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    deleted_at: undefined
  }
]

export const englishExamplesMockData: SearchExampleAPIResponseDto[] = [
  {
    id: 1,
    en_example_sentense:
      'The sorting algorithm efficiently organizes the data.',
    ja_example_sentense: 'そのソートアルゴリズムはデータを効率的に整理します。'
  },
  {
    id: 2,
    en_example_sentense: 'React is a popular JavaScript framework.',
    ja_example_sentense: 'Reactは人気のあるJavaScriptフレームワークです。'
  },
  {
    id: 3,
    en_example_sentense: 'The deployment process was automated.',
    ja_example_sentense: 'デプロイメントプロセスは自動化されました。'
  }
]

// 後方互換性のため、JSON形式と同じ構造のオブジェクトも提供
export const englishDataMock = {
  words: englishWordsMockData,
  wordDetail: englishWordDetailMockData,
  partOfSpeechList: partOfSpeechListMockData,
  sourceList: sourceListMockData,
  examples: englishExamplesMockData
}
