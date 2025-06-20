import React, { useState } from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { DeleteQuizForm } from '@/components/ui-forms/quizzer/deleteQuiz/deleteQuizForm/DeleteQuizForm';
import { IntegrateToQuizForm } from '@/components/ui-forms/quizzer/deleteQuiz/integrateToQuizForm/IntegrateToQuizForm';
import { GetQuizApiResponseDto, initGetQuizResponseData } from 'quizzer-lib';
import { useQuizFormatList } from '@/hooks/useQuizFormatList';

type Props = {
  isMock?: boolean;
};

export default function DeleteQuizPage({ isMock }: Props) {
  const [deleteQuizInfo, setDeleteQuizInfo] = useState<GetQuizApiResponseDto>(initGetQuizResponseData);
  const { quizFormatListoption } = useQuizFormatList();

  const contents = () => {
    return (
      <Container>
        <DeleteQuizForm
          deleteQuizInfo={deleteQuizInfo}
          quizFormatListoption={quizFormatListoption}
          setDeleteQuizInfo={setDeleteQuizInfo}
        />
        <IntegrateToQuizForm
          deleteQuizInfo={deleteQuizInfo}
          quizFormatListoption={quizFormatListoption}
          setDeleteQuizInfo={setDeleteQuizInfo}
        />
      </Container>
    );
  };

  return <Layout mode="quizzer" contents={contents()} title={'問題削除'} />;
}
