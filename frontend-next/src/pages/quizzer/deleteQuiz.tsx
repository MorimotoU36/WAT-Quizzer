import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import {
  DeleteQuizInfoState,
  IntegrateToQuizInfoState,
  MessageState,
  PullDownOptionState,
  QueryOfDeleteQuizState,
  QueryOfIntegrateToQuizState
} from '../../../interfaces/state';
import { getFileList } from '@/common/response';
import { DeleteQuizForm } from '@/components/ui-forms/quizzer/deleteQuiz/deleteQuizForm/DeleteQuizForm';
import { IntegrateToQuizForm } from '@/components/ui-forms/quizzer/deleteQuiz/integrateToQuizForm/IntegrateToQuizForm';

export default function DeleteQuizPage() {
  const [queryOfDeleteQuizState, setQueryOfDeleteQuizState] = useState<QueryOfDeleteQuizState>({
    fileNum: -1,
    quizNum: -1,
    format: 'basic'
  });
  const [queryOfIntegrateToQuizState, setQueryOfIntegrateToQuizState] = useState<QueryOfIntegrateToQuizState>({
    fileNum: -1,
    quizNum: -1,
    format: 'basic'
  });
  const [deleteQuizInfoState, setDeleteQuizInfoState] = useState<DeleteQuizInfoState>({});
  const [integrateToQuizInfoState, setIntegrateToQuizInfoState] = useState<IntegrateToQuizInfoState>({});
  const [message, setMessage] = useState<MessageState>({
    message: '　',
    messageColor: 'common.black',
    isDisplay: false
  });
  const [filelistoption, setFilelistoption] = useState<PullDownOptionState[]>([]);

  useEffect(() => {
    getFileList(setMessage, setFilelistoption);
  }, []);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>
        <DeleteQuizForm
          queryOfDeleteQuizState={queryOfDeleteQuizState}
          queryOfIntegrateToQuizState={queryOfIntegrateToQuizState}
          deleteQuizInfoState={deleteQuizInfoState}
          filelistoption={filelistoption}
          setMessage={setMessage}
          setQueryOfDeleteQuizState={setQueryOfDeleteQuizState}
          setDeleteQuizInfoState={setDeleteQuizInfoState}
          setQueryOfIntegrateToQuizState={setQueryOfIntegrateToQuizState}
        />
        <IntegrateToQuizForm
          queryOfDeleteQuizState={queryOfDeleteQuizState}
          queryOfIntegrateToQuizState={queryOfIntegrateToQuizState}
          integrateToQuizInfoState={integrateToQuizInfoState}
          setMessage={setMessage}
          setQueryOfDeleteQuizState={setQueryOfDeleteQuizState}
          setQueryOfIntegrateToQuizState={setQueryOfIntegrateToQuizState}
          setDeleteQuizInfoState={setDeleteQuizInfoState}
          setIntegrateToQuizInfoState={setIntegrateToQuizInfoState}
        />
      </Container>
    );
  };

  return (
    <>
      <Layout
        mode="quizzer"
        contents={contents()}
        title={'問題削除'}
        messageState={message}
        setMessageStater={setMessage}
      />
    </>
  );
}
