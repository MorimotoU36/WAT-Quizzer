import { Card } from '@/components/ui-elements/card/Card';
import { useEffect, useState } from 'react';
import { getQuizStatisticsWeekDataAPI, QuizStatisticsWeekApiResponse } from 'quizzer-lib';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { CircularProgress } from '@mui/material';

interface PastWeekAnswerDataCardProps {}
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const PastWeekAnswerDataCard = ({}: PastWeekAnswerDataCardProps) => {
  const [quizStatisticsWeekData, setQuizStatisticsWeekData] = useState<QuizStatisticsWeekApiResponse[]>([]);

  useEffect(() => {
    (async () => {
      const result = await getQuizStatisticsWeekDataAPI({});
      result.result && setQuizStatisticsWeekData(result.result as QuizStatisticsWeekApiResponse[]);
    })();
  }, []);

  const data = {
    labels: quizStatisticsWeekData.map((x) => {
      return x.date;
    }),
    datasets: [
      {
        label: '解答数',
        data: quizStatisticsWeekData.map((x) => {
          return x.count;
        }),
        backgroundColor: 'royalblue'
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
        text: '過去１週間の回答数'
      }
    }
  };

  return (
    <Card variant="outlined" attr="margin-vertical">
      {quizStatisticsWeekData.length > 0 ? <Bar options={options} data={data} /> : <CircularProgress />}
    </Card>
  );
};
