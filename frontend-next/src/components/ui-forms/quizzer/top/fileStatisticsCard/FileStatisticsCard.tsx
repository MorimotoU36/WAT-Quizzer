import { Card } from '@/components/ui-elements/card/Card';
import { getQuizFileStatisticsDataAPI, QuizFileStatisticsApiResponse } from 'quizzer-lib';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

interface FileStatisticsCardProps {}
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const FileStatisticsCard = ({}: FileStatisticsCardProps) => {
  const [quizFileStatisticsData, setQuizFileStatisticsData] = useState<QuizFileStatisticsApiResponse[]>([]);

  useEffect(() => {
    (async () => {
      const result = await getQuizFileStatisticsDataAPI({});
      result.result && setQuizFileStatisticsData(result.result as QuizFileStatisticsApiResponse[]);
    })();
  }, []);

  const data = {
    labels: quizFileStatisticsData.map((x) => {
      return x.file_nickname;
    }),
    datasets: [
      {
        label: '問題数',
        data: quizFileStatisticsData.map((x) => x.count),
        backgroundColor: 'royalblue'
      },
      {
        label: '正解数',
        data: quizFileStatisticsData.map((x) => x.clear),
        backgroundColor: 'crimson'
      },
      {
        label: '不正解数',
        data: quizFileStatisticsData.map((x) => x.fail),
        backgroundColor: 'black'
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: '問題ファイル統計'
      }
    }
  };

  return (
    <Card variant="outlined" attr="margin-vertical">
      {quizFileStatisticsData.length > 0 ? <Bar options={options} data={data} /> : <CircularProgress />}
    </Card>
  );
};
