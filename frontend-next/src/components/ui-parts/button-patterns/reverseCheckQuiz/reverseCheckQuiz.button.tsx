import React from 'react';
import { Button } from '@/components/ui-elements/button/Button';
import { CheckQuizApiResponse, ProcessingApiReponse } from '../../../../../interfaces/api/response';
import { post } from '@/common/API';
import { DisplayQuizState, MessageState, QueryOfQuizState } from '../../../../../interfaces/state';

interface ReverseCheckQuizButtonProps {
  queryOfQuizState: QueryOfQuizState;
  displayQuizState: DisplayQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
}

const reverseCheckQuizAPI = ({
  queryOfQuizState,
  displayQuizState,
  setMessageStater,
  setDisplayQuizStater
}: ReverseCheckQuizButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setDisplayQuizStater) {
    return;
  }

  if (queryOfQuizState.fileNum === -1) {
    setMessageStater({
      message: 'エラー:問題ファイルを選択して下さい',
      messageColor: 'error'
    });
    return;
  } else if (!queryOfQuizState.quizNum) {
    setMessageStater({
      message: 'エラー:問題番号を入力して下さい',
      messageColor: 'error'
    });
    return;
  } else if (!displayQuizState.quizSentense || !displayQuizState.quizAnswer) {
    setMessageStater({
      message: 'エラー:問題を出題してから登録して下さい',
      messageColor: 'error'
    });
    return;
  }

  setMessageStater({
    message: '通信中...',
    messageColor: '#d3d3d3'
  });
  post(
    '/quiz/check',
    {
      format: queryOfQuizState.format,
      file_num: queryOfQuizState.fileNum,
      quiz_num: queryOfQuizState.quizNum
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const res: CheckQuizApiResponse[] = data.body as CheckQuizApiResponse[];
        setDisplayQuizStater({
          ...displayQuizState,
          checked: res[0].result
        });
        setMessageStater({
          message: `問題[${queryOfQuizState.quizNum}] にチェック${res[0].result ? 'をつけ' : 'を外し'}ました`,
          messageColor: 'success.light'
        });
      } else {
        setMessageStater({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error'
        });
      }
    }
  );
};

export const ReverseCheckQuizButton = ({
  queryOfQuizState,
  displayQuizState,
  setMessageStater,
  setDisplayQuizStater
}: ReverseCheckQuizButtonProps) => {
  return (
    <>
      <Button
        label={'チェックつける/外す'}
        variant="contained"
        color="warning"
        onClick={(e) =>
          reverseCheckQuizAPI({
            queryOfQuizState,
            displayQuizState,
            setMessageStater,
            setDisplayQuizStater
          })
        }
      />
    </>
  );
};