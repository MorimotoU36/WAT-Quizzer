import React, { useState } from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { AddQuizLogSection } from '@/components/ui-forms/quizzer/addQuiz/addQuizLogSection/AddQuizLogSection';
import { AddQuizForm } from '@/components/ui-forms/quizzer/addQuiz/addQuizForm/AddQuizForm';

export default function AddQuizPage() {
  const [log, setLog] = useState<string>('');
  const contents = () => {
    return (
      <Container>
        <AddQuizForm setAddLog={setLog} />
        <AddQuizLogSection log={log} />
      </Container>
    );
  };

  return <Layout mode="quizzer" contents={contents()} title={'問題追加'} />;
}
