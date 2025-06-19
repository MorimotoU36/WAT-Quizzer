import { Layout } from '@/components/templates/layout/Layout';
import { Container } from '@mui/material';
import React, { useState } from 'react';
import { QuizFilePullDown } from '@/components/ui-elements/pullDown/quizFilePullDown/QuizFilePullDown';
import { QuizzerDashboard } from '../../components/ui-forms/quizzer/top/dashboard/QuizzerDashBoard';

export default function QuizzerTopPage() {
  const [selectedFileNum, setSelectedFileNum] = useState<number>(-1);

  const contents = () => {
    return (
      <Container>
        <QuizFilePullDown onFileChange={(e) => setSelectedFileNum(+e.target.value)} />
        <QuizzerDashboard selectedFileNum={selectedFileNum} />
      </Container>
    );
  };

  return <Layout mode="quizzer" contents={contents()} title={'Top'} />;
}
