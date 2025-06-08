import { GetAccuracyRateByCategoryAPIResponseDto } from 'quizzer-lib';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import styles from './AccuracyChart.module.css';

interface AccuracyChartProps {
  accuracyData: GetAccuracyRateByCategoryAPIResponseDto;
}
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const AccuracyChart = ({ accuracyData }: AccuracyChartProps) => {
  // データがない場合は何もしない
  if (accuracyData.result.length === 0 && accuracyData.checked_result.length === 0) {
    return <></>;
  }

  const data = {
    labels: [
      ...accuracyData.checked_result.map((x) => '(チェック済問題)'),
      ...accuracyData.result.map((x) => x.category),
      ...accuracyData.all_result.map((x) => '(全問題)')
    ],
    datasets: [
      {
        data: [
          ...accuracyData.checked_result.map((x) => +x.accuracy_rate),
          ...accuracyData.result.map((x) => +x.accuracy_rate),
          ...accuracyData.all_result.map((x) => +x.accuracy_rate)
        ],
        backgroundColor: [
          ...accuracyData.checked_result.map((x) => 'lime'),
          ...accuracyData.result.map((x) => 'royalblue'),
          ...accuracyData.all_result.map((x) => 'mediumblue')
        ],
        categoryPercentage: 1, // **カテゴリごとの間隔**
        barPercentage: 0.5 // **棒の太さ**
      }
    ]
  };

  // グラフ領域の縦の長さ（＝50 * データの個数）
  // TODO データたくさんある場合は見やすいが　１個の時は逆に見にくかった　ここの計算式を策定してほしい
  const graph_height = 50 * data.datasets[0].data.length;

  const options = {
    indexAxis: 'y' as const,
    plugins: {
      title: {
        display: false
      },
      legend: {
        display: false // **凡例を非表示**
      }
    },
    maintainAspectRatio: false
  };
  return (
    <div style={{ height: `${graph_height}px` }} className={styles.chart}>
      <Bar options={options} data={data} />
    </div>
  );
};
