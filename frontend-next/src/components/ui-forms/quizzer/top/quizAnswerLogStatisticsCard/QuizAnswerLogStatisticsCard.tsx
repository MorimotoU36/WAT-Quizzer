import { Card } from '@/components/ui-elements/card/Card';
import { useEffect, useState } from 'react';
import {
  getAnswerLogStatisticsDataAPI,
  AnswerLogStatisticsApiResponse,
  GetAnswerLogStatisticsAPIRequestDto
} from 'quizzer-lib';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { CircularProgress } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';

interface QuizAnswerLogStatisticsCardProps {
  file_num: number;
}
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const QuizAnswerLogStatisticsCard = ({ file_num }: QuizAnswerLogStatisticsCardProps) => {
  const [answerLogStatisticsData, setAnswerLogStatisticsData] = useState<AnswerLogStatisticsApiResponse[]>([]);
  const [getAnswerLogStatisticsData, setRequestData] = useState<GetAnswerLogStatisticsAPIRequestDto>({});

  // TODO これは別ファイルに入れたい
  const dateUnitOption = [
    { value: 'day', label: '日' },
    { value: 'week', label: '週' },
    { value: 'month', label: '月' }
  ];

  useEffect(() => {
    (async () => {
      const result = await getAnswerLogStatisticsDataAPI({ getAnswerLogStatisticsData });
      result.result && setAnswerLogStatisticsData(result.result as AnswerLogStatisticsApiResponse[]);
    })();
  }, [getAnswerLogStatisticsData]);

  useEffect(() => {
    setRequestData({
      ...getAnswerLogStatisticsData,
      file_num
    });
  }, [file_num]);

  const data = {
    labels: answerLogStatisticsData.map((x) => {
      return x.date;
    }),
    datasets: [
      {
        label: '解答数',
        data: answerLogStatisticsData.map((x) => {
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
        text: `過去${answerLogStatisticsData.length}${
          getAnswerLogStatisticsData.date_unit === 'month'
            ? 'ヶ月'
            : getAnswerLogStatisticsData.date_unit === 'week'
            ? '週'
            : '日'
        }間の回答数`
      }
    }
  };

  return (
    <Card variant="outlined" attr="margin-vertical">
      <PullDown
        label={'日付単位'}
        optionList={dateUnitOption}
        onChange={(e) =>
          setRequestData({
            ...getAnswerLogStatisticsData,
            date_unit: e.target.value as 'day' | 'week' | 'month'
          })
        }
      />
      {answerLogStatisticsData.length > 0 ? <Bar options={options} data={data} /> : <CircularProgress />}
    </Card>
  );
};
