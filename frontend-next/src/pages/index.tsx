import Head from 'next/head';
import { Inter } from 'next/font/google';
import { Button, Card, CardContent, Container, Typography } from '@mui/material';
import { topButtonStyle } from '../styles/Pages';
import { useEffect, useState } from 'react';
import { get } from '@/common/API';
import { GetRandomSayingResponse, ProcessingApiReponse } from '../../interfaces/api/response';
import { Title } from '@/components/ui-elements/title/Title';
import { dbHealthCheck } from '@/common/health';

const inter = Inter({ subsets: ['latin'] });

export default function Top() {
  const [saying, setSaying] = useState({
    saying: '(取得中...)',
    color: 'grey.200'
  });
  const [dbHealth, setDbHealth] = useState({
    status: '(取得中...)',
    color: 'grey.200'
  });

  useEffect(() => {
    Promise.all([
      get('/saying', (data: ProcessingApiReponse) => {
        if (data.status === 200) {
          const result: GetRandomSayingResponse[] = data.body as GetRandomSayingResponse[];
          setSaying({
            saying: result[0].saying,
            color: 'common.black'
          });
        }
      }),
      executeDbHealthCheck()
    ]);
  }, []);

  // DB ヘルスチェック
  const executeDbHealthCheck = async () => {
    const result = await dbHealthCheck();
    setDbHealth(result);
  };

  return (
    <>
      <Head>
        <title>WAT Quizzer</title>
        {/* <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Container>
        <Title label="WAT Quizzer"></Title>
        <div>
          <Button
            style={topButtonStyle}
            variant="contained"
            size="large"
            color="primary"
            href={'/quizzer' + process.env.NEXT_PUBLIC_URL_END}
          >
            Quizzer
          </Button>
          <Button
            style={topButtonStyle}
            variant="contained"
            size="large"
            color="secondary"
            href={'/englishBot' + process.env.NEXT_PUBLIC_URL_END}
          >
            English Quiz Bot
          </Button>
          <Button
            style={topButtonStyle}
            variant="contained"
            size="large"
            color="info"
            href={'/settings' + process.env.NEXT_PUBLIC_URL_END}
          >
            設定
          </Button>
        </div>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" component="h6" color="grey.700">
              今回の格言
            </Typography>
            <Typography variant="h2" component="p" color={saying.color}>
              {saying.saying}
            </Typography>
            <Typography variant="subtitle1" component="p" color="grey.500">
              出典
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" component="span" color="common.black">
              DB接続状況：
            </Typography>
            <Typography variant="h6" component="span" color={dbHealth.color}>
              {dbHealth.status}
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
