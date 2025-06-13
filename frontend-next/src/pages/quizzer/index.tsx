import { messageState } from '@/atoms/Message';
import { Layout } from '@/components/templates/layout/Layout';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { FileStatisticsCard } from '@/components/ui-forms/quizzer/top/fileStatisticsCard/FileStatisticsCard';
import { QuizAnswerLogStatisticsCard } from '@/components/ui-forms/quizzer/top/quizAnswerLogStatisticsCard/QuizAnswerLogStatisticsCard';
import { Container } from '@mui/material';
import {
  GetQuizFileApiResponseDto,
  getQuizFileListAPI,
  PullDownOptionDto,
  quizFileListAPIResponseToPullDownAdapter
} from 'quizzer-lib';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import styles from '../../components/Chart.module.css';
import { AccuracyRateHistgramCard } from '@/components/ui-forms/quizzer/top/accuracyRateHistgramCard/AccuracyRateHistgramCard';

type Props = {
  isMock?: boolean;
};

export default function QuizzerTopPage({ isMock }: Props) {
  const [filelistoption, setFilelistoption] = useState<PullDownOptionDto[]>([]);
  const [selectedFileNum, setSelectedFileNum] = useState<number>(-1);
  const setMessage = useSetRecoilState(messageState);

  useEffect(() => {
    (async () => {
      // 問題ファイルプルダウン ファイル統計リスト取得から作成
      // TODO 問題ファイルプルダウンは割とどこでも使うから　このuseEffectの動作含めて別のコンポーネントに切り分けた方が良い気した
      const result = await getQuizFileListAPI();
      setMessage(result.message);
      const pullDownOption = result.result
        ? quizFileListAPIResponseToPullDownAdapter(result.result as GetQuizFileApiResponseDto[])
        : [];
      setFilelistoption(pullDownOption);
    })();
  }, [setMessage]);

  const contents = () => {
    return (
      <Container>
        {/*TODO quizzer形式のプルダウン結構使うから　あらかじめquizzerのファイル値が入った状態のプルダウンをコンポーネントとして用意したほうがいい気した */}
        <PullDown
          label={'問題ファイル'}
          optionList={filelistoption}
          onChange={(e) => setSelectedFileNum(+e.target.value)}
        />
        {/* TODO divではなくコンポーネント化したい */}
        <div className={styles.chartGridContainer}>
          <FileStatisticsCard file_num={selectedFileNum} />
          <QuizAnswerLogStatisticsCard file_num={selectedFileNum} />
          <AccuracyRateHistgramCard file_num={selectedFileNum} />
        </div>
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'Top'} />
    </>
  );
}
