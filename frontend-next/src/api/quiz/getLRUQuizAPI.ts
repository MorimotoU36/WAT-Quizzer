import { get } from '@/common/API';
import { DisplayQuizState, MessageState, QueryOfQuizState } from '../../../interfaces/state';
import { generateQuizSentense, GetQuizApiResponseDto, ProcessingApiReponse } from 'quizzer-lib';

interface GetLRUQuizButtonProps {
  queryOfQuizState: QueryOfQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
  setQueryofQuizStater?: React.Dispatch<React.SetStateAction<QueryOfQuizState>>;
}

export const getLRUQuizAPI = async ({
  queryOfQuizState,
  setMessageStater,
  setDisplayQuizStater,
  setQueryofQuizStater
}: GetLRUQuizButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setDisplayQuizStater || !setQueryofQuizStater) {
    return;
  }
  if (queryOfQuizState.fileNum === -1) {
    setMessageStater({
      message: 'エラー:問題ファイルを選択して下さい',
      messageColor: 'error',
      isDisplay: true
    });
    return;
  }

  // 送信データ作成
  const sendData: { [key: string]: string } = {
    file_num: String(queryOfQuizState.fileNum),
    format: queryOfQuizState.format
  };
  if (queryOfQuizState.minRate) {
    sendData.min_rate = String(queryOfQuizState.minRate);
  }
  if (queryOfQuizState.maxRate) {
    sendData.max_rate = String(queryOfQuizState.maxRate);
  }
  if (queryOfQuizState.category) {
    sendData.category = String(queryOfQuizState.category);
  }
  if (queryOfQuizState.checked) {
    sendData.checked = String(queryOfQuizState.checked);
  }

  setMessageStater({
    message: '通信中...',
    messageColor: '#d3d3d3',
    isDisplay: true
  });
  await get(
    '/quiz/lru',
    (data: ProcessingApiReponse) => {
      if (data.status === 200 && data.body?.length > 0) {
        const res: GetQuizApiResponseDto[] = data.body as GetQuizApiResponseDto[];
        setQueryofQuizStater({
          ...queryOfQuizState,
          quizNum: res[0].quiz_num
        });
        setDisplayQuizStater({
          fileNum: res[0].file_num,
          quizNum: res[0].quiz_num,
          checked: res[0].checked || false,
          expanded: false,
          ...generateQuizSentense(sendData.format, res)
        });
        setMessageStater({
          message: '　',
          messageColor: 'common.black',
          isDisplay: false
        });
      } else if (data.status === 404 || data.body?.length === 0) {
        setMessageStater({
          message: 'エラー:条件に合致するデータはありません',
          messageColor: 'error',
          isDisplay: true
        });
      } else {
        setMessageStater({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error',
          isDisplay: true
        });
      }
    },
    sendData
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
};
