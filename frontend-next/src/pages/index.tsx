import Head from 'next/head';
import { Inter } from 'next/font/google';
import { Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { GetSayingResponse, getSayingAPI, initSayingResponseData } from 'quizzer-lib';
import { Title } from '@/components/ui-elements/title/Title';
import { TopButtonGroup } from '@/components/ui-forms/top/topButtonGroup/TopButtonGroup';
import { SayingCard } from '@/components/ui-forms/top/sayingCard/SayingCard';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

type Props = {
  isMock?: boolean;
};

export default function Top({ isMock }: Props) {
  const [saying, setSaying] = useState<GetSayingResponse>(initSayingResponseData);

  useEffect(() => {
    !isMock &&
      Promise.all([
        (async () => {
          const result = await getSayingAPI({ getSayingRequestData: {} });
          result.result && setSaying(result.result as GetSayingResponse);
        })()
      ]);
  }, [isMock]);

  return (
    <>
      <Head>
        <title>WAT Quizzer</title>
      </Head>
      <Container>
        <Title label="WAT Quizzer"></Title>
        <TopButtonGroup />
        <SayingCard sayingResponse={saying} setSaying={setSaying} />
      </Container>
    </>
  );
}
