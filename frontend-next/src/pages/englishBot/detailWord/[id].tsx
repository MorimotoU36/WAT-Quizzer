import { CircularProgress, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { MeaningStack } from '@/components/ui-forms/englishbot/detailWord/meaningStack/MeaningStack';
import { SourceStack } from '@/components/ui-forms/englishbot/detailWord/sourceStack/SourceStack';
import { SubSourceStack } from '@/components/ui-forms/englishbot/detailWord/subSourceStack/SubSourceStack';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import {
  GetWordNumResponseDto,
  GetWordDetailAPIResponseDto,
  getWordDetailAPI,
  PullDownOptionDto,
  getPartOfSpeechListAPI,
  apiResponsePullDownAdapter,
  PartofSpeechApiResponse,
  getSourceListAPI,
  SourceApiResponse,
  initWordDetailResponseData,
  toggleWordCheckAPI,
  getWordNumAPI
} from 'quizzer-lib';
import { SynonymStack } from '@/components/ui-forms/englishbot/detailWord/synonymStack/SynonymStack';
import { AntonymStack } from '@/components/ui-forms/englishbot/detailWord/antonymStack/AntonymStack';
import { DerivativeStack } from '@/components/ui-forms/englishbot/detailWord/derivativeStack/DerivativeStack';
import { EtymologyStack } from '@/components/ui-forms/englishbot/detailWord/etymologyStack/EtymologyStack';
import { Button } from '@/components/ui-elements/button/Button';
import React from 'react';

type EachWordPageProps = {
  id: string;
  isMock?: boolean;
};
// TODO dynamic routingだとファイル数膨大・単語追加のたびにデプロイ必要になるので不向き、Next.jsで何か別の使える機能ないか
export default function EnglishBotEachWordPage({ id, isMock }: EachWordPageProps) {
  const [wordDetail, setWordDetail] = useState<GetWordDetailAPIResponseDto>(initWordDetailResponseData);
  const [posList, setPosList] = useState<PullDownOptionDto[]>([]);
  const [sourcelistoption, setSourcelistoption] = useState<PullDownOptionDto[]>([]);
  const setMessage = useSetRecoilState(messageState);

  useEffect(() => {
    if (!isMock) {
      Promise.all([
        (async () => {
          const result = await getPartOfSpeechListAPI();
          result.result && setPosList(apiResponsePullDownAdapter(result.result as PartofSpeechApiResponse[]));
        })(),
        (async () => {
          const result = await getSourceListAPI();
          result.result && setSourcelistoption(apiResponsePullDownAdapter(result.result as SourceApiResponse[]));
        })()
      ]);
      (async () => {
        const result = (await getWordDetailAPI({ id })).result as GetWordDetailAPIResponseDto;
        setWordDetail(result);
      })();
    }
  }, [id, isMock, setMessage]);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer - englishBot"></Title>

        {wordDetail.id === -1 ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="h1" component="h1" color={'common.black'}>
              {wordDetail.name}
              <Typography variant="h4" component="span">
                {wordDetail.checked ? '✅' : ''}
              </Typography>
            </Typography>
            <Button
              label={'チェック反転'}
              attr={'button-array'}
              variant="contained"
              color="warning"
              disabled={wordDetail.id === -1}
              onClick={async (e) => {
                setMessage({
                  message: '通信中...',
                  messageColor: '#d3d3d3',
                  isDisplay: true
                });
                const result = await toggleWordCheckAPI({
                  toggleCheckData: {
                    wordId: wordDetail.id
                  }
                });
                setMessage(result.message);
                if (result.message.messageColor === 'success.light') {
                  const newWordDetail = (await getWordDetailAPI({ id: String(wordDetail.id) }))
                    .result as GetWordDetailAPIResponseDto;
                  setWordDetail && setWordDetail(newWordDetail);
                }
              }}
            />
          </>
        )}

        {/* TODO スタックは共通化できる？ */}
        <MeaningStack posList={posList} wordDetail={wordDetail} setMessage={setMessage} setWordDetail={setWordDetail} />
        <SourceStack
          sourceList={sourcelistoption}
          wordDetail={wordDetail}
          setMessage={setMessage}
          setWordDetail={setWordDetail}
        />
        <SubSourceStack wordDetail={wordDetail} setMessage={setMessage} setWordDetail={setWordDetail} />
        <SynonymStack wordDetail={wordDetail} setMessage={setMessage} setWordDetail={setWordDetail} />
        <AntonymStack wordDetail={wordDetail} setMessage={setMessage} setWordDetail={setWordDetail} />
        <DerivativeStack wordDetail={wordDetail} setMessage={setMessage} setWordDetail={setWordDetail} />
        <EtymologyStack wordDetail={wordDetail} setMessage={setMessage} setWordDetail={setWordDetail} />
      </Container>
    );
  };

  return <Layout mode="englishBot" contents={contents()} title={'各単語詳細'} />;
}

// getStaticPathsの返り値、各文書のファイルパス(dynamic routing([id])のためstring)
type Params = {
  params: {
    id: string;
  };
};

export async function getStaticProps({ params }: Params) {
  return {
    props: {
      id: params.id
    }
  };
}

// 一番最初に実行される関数
export async function getStaticPaths() {
  let words: GetWordNumResponseDto;
  words = (await getWordNumAPI({})).result as GetWordNumResponseDto;
  console.log('words:', JSON.stringify(words));
  return {
    paths: new Array(words!._max.id + 30)
      .fill(0)
      .map((_, i) => i)
      .map((d) => {
        return {
          params: {
            id: String(d + 1)
          }
        };
      }),
    fallback: false
  };
}
