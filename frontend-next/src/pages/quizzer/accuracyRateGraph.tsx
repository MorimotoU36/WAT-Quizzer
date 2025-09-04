import React from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { GetAccuracyGraphForm } from '@/components/ui-forms/quizzer/accuracyRateGraph/getAccuracyGraphForm/GetAccuracyGraphForm';

export default function AccuracyRateGraphPage() {
  const contents = () => {
    return (
      <Container>
        <GetAccuracyGraphForm />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'カテゴリ別正解率表示'} />
    </>
  );
}
