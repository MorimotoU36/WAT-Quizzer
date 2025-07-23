import { GetAccuracyRateByCategoryAPIResponseDto } from 'quizzer-lib';
import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import styles from '../accuracyChart/AccuracyChart.module.css';

interface AccuracyRadarChartProps {
  accuracyData: GetAccuracyRateByCategoryAPIResponseDto;
}
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export const AccuracyRadarChart = ({ accuracyData }: AccuracyRadarChartProps) => {
  // データがない場合は何もしない
  if (accuracyData.result.length === 0 && accuracyData.checked_result.length === 0) {
    return <></>;
  }
  // Radarチャート用のラベルとデータを作成
  const labels = [...accuracyData.result.map((x) => x.category)];
  // 各データセットのデータをラベル順に揃える
  const resultData = [...accuracyData.result.map((x) => +x.accuracy_rate)];

  const data = {
    labels,
    datasets: [
      {
        label: 'カテゴリ別',
        data: resultData,
        backgroundColor: 'rgba(65, 105, 225, 0.2)', // royalblue
        borderColor: 'royalblue',
        pointBackgroundColor: 'royalblue',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'royalblue'
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false
      },
      legend: {
        display: true // Radarでは凡例を表示
      }
    },
    maintainAspectRatio: false
  };

  // Radarチャートは正方形が見やすいので高さを幅に合わせる
  return (
    <div className={styles.chartResponsive}>
      <Radar options={options} data={data} />
    </div>
  );
};
