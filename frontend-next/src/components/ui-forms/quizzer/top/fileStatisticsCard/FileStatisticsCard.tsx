import { Card } from '@/components/ui-elements/card/Card';
import { getQuizFileStatisticsDataAPI, QuizFileStatisticsApiResponse } from 'quizzer-lib';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

interface FileStatisticsCardProps {
  file_num: number;
}
ChartJS.register(ArcElement, Tooltip, Legend);

export const FileStatisticsCard = ({ file_num }: FileStatisticsCardProps) => {
  const [quizFileStatisticsData, setQuizFileStatisticsData] = useState<QuizFileStatisticsApiResponse>();

  useEffect(() => {
    (async () => {
      const result = await getQuizFileStatisticsDataAPI({ file_num });
      result.result && setQuizFileStatisticsData(result.result as QuizFileStatisticsApiResponse);
    })();
  }, [file_num]);

  const labels = ['正解数', '不正解数', '未解答数'];
  const datasets = quizFileStatisticsData
    ? [
        {
          label: '正答率分布',
          data: [
            quizFileStatisticsData.clear || 0,
            quizFileStatisticsData.fail || 0,
            quizFileStatisticsData.not_answered || 0
          ],
          backgroundColor: ['crimson', 'black', 'dimgray']
        }
      ]
    : [];
  const data = {
    labels,
    datasets
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'left' as const
      },
      title: {
        display: true,
        text: `問題ファイル統計(${quizFileStatisticsData ? quizFileStatisticsData.file_nickname : 'null'}): ${
          quizFileStatisticsData ? quizFileStatisticsData.count : '0'
        }問中`
      }
    }
  };

  return (
    <>
      <Card variant="outlined" attr="margin-vertical">
        <p>
          {quizFileStatisticsData?.process_rate ? `進捗率:${quizFileStatisticsData?.process_rate.toFixed(2)}%` : ''}
        </p>
        <Card variant="outlined" attr="margin-vertical">
          {quizFileStatisticsData ? <Doughnut data={data} options={options} /> : <CircularProgress />}
        </Card>
      </Card>
    </>
  );
};
