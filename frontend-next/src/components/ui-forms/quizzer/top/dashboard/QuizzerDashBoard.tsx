import React from 'react';
import styles from '../../../../Chart.module.css';
import { FileStatisticsCard } from '@/components/ui-forms/quizzer/top/charts/fileStatisticsCard/FileStatisticsCard';
import { QuizAnswerLogStatisticsCard } from '@/components/ui-forms/quizzer/top/charts/quizAnswerLogStatisticsCard/QuizAnswerLogStatisticsCard';
import { AccuracyRateHistgramCard } from '@/components/ui-forms/quizzer/top/charts/accuracyRateHistgramCard/AccuracyRateHistgramCard';

interface QuizzerDashboardProps {
  selectedFileNum: number;
}

export const QuizzerDashboard: React.FC<QuizzerDashboardProps> = ({ selectedFileNum }) => {
  return (
    <div className={styles.chartGridContainer}>
      <FileStatisticsCard file_num={selectedFileNum} />
      <QuizAnswerLogStatisticsCard file_num={selectedFileNum} />
      <AccuracyRateHistgramCard file_num={selectedFileNum} />
    </div>
  );
};
