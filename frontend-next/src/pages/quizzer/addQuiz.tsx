import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { PullDownOptionState, QueryOfPutQuizState } from '../../../interfaces/state';
import { AddQuizLogSection } from '@/components/ui-forms/quizzer/addQuiz/addQuizLogSection/AddQuizLogSection';
import { Title } from '@/components/ui-elements/title/Title';
import { AddQuizForm } from '@/components/ui-forms/quizzer/addQuiz/addQuizForm/AddQuizForm';
import { Button } from '@/components/ui-elements/button/Button';
import { messageState } from '@/atoms/Message';
import { useRecoilState } from 'recoil';
import { addQuizAPI } from '@/api/quiz/addQuizAPI';
import { getQuizFileListAPI } from '@/api/quiz/getQuizFileListAPI';

type Props = {
  isMock?: boolean;
};

export default function AddQuizPage({ isMock }: Props) {
  const [queryOfAddQuiz, setQueryOfAddQuiz] = useState<QueryOfPutQuizState>({
    fileNum: -1,
    quizNum: -1
  });
  const [message, setMessage] = useRecoilState(messageState);
  const [addLog, setAddLog] = useState<string>('');
  const [filelistoption, setFilelistoption] = useState<PullDownOptionState[]>([]);
  const [value, setValue] = React.useState(0);

  // 問題ファイルリスト取得
  useEffect(() => {
    !isMock && getQuizFileListAPI(setMessage, setFilelistoption);
  }, [isMock, setMessage]);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>

        <AddQuizForm
          filelistoption={filelistoption}
          value={value}
          queryOfPutQuizState={queryOfAddQuiz}
          setValue={setValue}
          setQueryofPutQuizStater={setQueryOfAddQuiz}
        />

        <Button
          label="問題登録"
          attr={'button-array'}
          variant="contained"
          color="primary"
          onClick={(e) =>
            addQuizAPI({
              value,
              queryOfAddQuizState: queryOfAddQuiz,
              setAddLog,
              setMessageStater: setMessage,
              setQueryofAddQuizStater: setQueryOfAddQuiz
            })
          }
        />

        <AddQuizLogSection log={addLog} />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'問題追加'} />
    </>
  );
}
