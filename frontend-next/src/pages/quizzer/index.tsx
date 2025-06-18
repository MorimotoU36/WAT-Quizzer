import { Layout } from '@/components/templates/layout/Layout';
import { FileStatisticsCard } from '@/components/ui-forms/quizzer/top/fileStatisticsCard/FileStatisticsCard';
import { QuizAnswerLogStatisticsCard } from '@/components/ui-forms/quizzer/top/quizAnswerLogStatisticsCard/QuizAnswerLogStatisticsCard';
import { Container } from '@mui/material';
import React, { useState } from 'react';
import styles from '../../components/Chart.module.css';
import { AccuracyRateHistgramCard } from '@/components/ui-forms/quizzer/top/accuracyRateHistgramCard/AccuracyRateHistgramCard';
import { QuizFilePullDown } from '@/components/ui-elements/pullDown/quizFilePullDown/QuizFilePullDown';

export default function QuizzerTopPage() {
  const [selectedFileNum, setSelectedFileNum] = useState<number>(-1);

  const contents = () => {
    return (
      <Container>
        <QuizFilePullDown onFileChange={(e) => setSelectedFileNum(+e.target.value)} />
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
