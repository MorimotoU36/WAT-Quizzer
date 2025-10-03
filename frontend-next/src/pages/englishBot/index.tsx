import { Layout } from '@/components/templates/layout/Layout';
import { Container } from '@mui/material';
import React from 'react';
import { EnglishBotDashboard } from '@/components/ui-forms/englishbot/top/englishBotDashBoard/EnglishBotDashBoard';

type Props = {};

export default function EnglishBotTopPage({}: Props) {
  const contents = () => {
    return (
      <Container>
        <EnglishBotDashboard />
      </Container>
    );
  };
  return <Layout mode="englishBot" contents={contents()} title={'Top'} />;
}
