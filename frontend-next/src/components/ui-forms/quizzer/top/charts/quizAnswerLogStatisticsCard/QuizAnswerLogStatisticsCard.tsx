import { Card } from '@/components/ui-elements/card/Card';
import { useEffect, useState } from 'react';
import {
  getAnswerLogStatisticsDataAPI,
  AnswerLogStatisticsApiResponse,
  GetAnswerLogStatisticsAPIRequestDto
} from 'quizzer-lib';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  LineElement,
  PointElement,
  LineController
} from 'chart.js';
import { CircularProgress } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import styles from '../../../../../Chart.module.css';
import { ANSWER_LOG_HISTGRAM_LABEL, ANSWER_LOG_HISTGRAM_COLOR, DATE_UNIT_OPTION } from '@/constants/contents/chart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  LineController,
  PointElement,
  Title,
  Tooltip,
  Legend
);
interface QuizAnswerLogStatisticsCardProps {
  file_num: number;
}
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const QuizAnswerLogStatisticsCard = ({ file_num }: QuizAnswerLogStatisticsCardProps) => {
  const [answerLogStatisticsData, setAnswerLogStatisticsData] = useState<AnswerLogStatisticsApiResponse[]>([]);
  const [getAnswerLogStatisticsData, setRequestData] = useState<GetAnswerLogStatisticsAPIRequestDto>({});

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

  const data: ChartData<'bar' | 'line', number[], string> = {
    labels: answerLogStatisticsData.map((x) => {
      return x.date;
    }),
    datasets: [
      {
        label: ANSWER_LOG_HISTGRAM_LABEL[0],
        data: answerLogStatisticsData.map((x) => {
          return x.count;
        }),
        backgroundColor: ANSWER_LOG_HISTGRAM_COLOR[0],
        type: 'bar',
        order: 2
      },
      {
        label: ANSWER_LOG_HISTGRAM_LABEL[1],
        data: answerLogStatisticsData.map((x) => {
          return x.accuracy_rate;
        }),
        backgroundColor: ANSWER_LOG_HISTGRAM_COLOR[1],
        type: 'line',
        order: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
    <Card variant="outlined" attr={['margin-vertical']}>
      <PullDown
        label={'日付単位'}
        optionList={DATE_UNIT_OPTION}
        onChange={(e) =>
          setRequestData({
            ...getAnswerLogStatisticsData,
            date_unit: e.target.value as 'day' | 'week' | 'month'
          })
        }
      />
      <div className={styles.quiz_stat_week}>
        {answerLogStatisticsData.length > 0 ? <Chart type="bar" options={options} data={data} /> : <CircularProgress />}
      </div>
    </Card>
  );
};
