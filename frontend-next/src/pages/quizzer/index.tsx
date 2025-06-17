import { messageState } from '@/atoms/Message';
import { Layout } from '@/components/templates/layout/Layout';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { FileStatisticsCard } from '@/components/ui-forms/quizzer/top/fileStatisticsCard/FileStatisticsCard';
import { QuizAnswerLogStatisticsCard } from '@/components/ui-forms/quizzer/top/quizAnswerLogStatisticsCard/QuizAnswerLogStatisticsCard';
import { Container } from '@mui/material';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import styles from '../../components/Chart.module.css';
import { AccuracyRateHistgramCard } from '@/components/ui-forms/quizzer/top/accuracyRateHistgramCard/AccuracyRateHistgramCard';
import { useQuizFileList } from '@/hooks/useQuizFileList';

export default function QuizzerTopPage() {
  const { filelistoption } = useQuizFileList();
  const [selectedFileNum, setSelectedFileNum] = useState<number>(-1);
  const setMessage = useSetRecoilState(messageState);

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
