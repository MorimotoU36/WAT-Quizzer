import type { Meta, StoryObj } from '@storybook/react';
import { QuizAnswerLogStatisticsCard } from './QuizAnswerLogStatisticsCard';
import { useState } from 'react';
import { Card } from '@/components/ui-elements/card/Card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LineController,
  ChartData
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
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

// モックデータ
const mockData = {
  day: [
    { date: '2024-05-01', count: 10, accuracy_rate: 0.7 },
    { date: '2024-05-02', count: 12, accuracy_rate: 0.8 },
    { date: '2024-05-03', count: 8, accuracy_rate: 0.6 },
    { date: '2024-05-04', count: 15, accuracy_rate: 0.9 },
    { date: '2024-05-05', count: 7, accuracy_rate: 0.5 }
  ],
  week: [
    { date: '2024-W18', count: 52, accuracy_rate: 0.75 },
    { date: '2024-W19', count: 43, accuracy_rate: 0.68 },
    { date: '2024-W20', count: 60, accuracy_rate: 0.82 }
  ],
  month: [
    { date: '2024-03', count: 120, accuracy_rate: 0.7 },
    { date: '2024-04', count: 150, accuracy_rate: 0.8 },
    { date: '2024-05', count: 110, accuracy_rate: 0.65 }
  ]
};

const QuizAnswerLogStatisticsCardWithMock = () => {
  const [dateUnit, setDateUnit] = useState<'day' | 'week' | 'month'>('day');
  const answerLogStatisticsData = mockData[dateUnit];

  const data: ChartData<'bar' | 'line', number[], string> = {
    labels: answerLogStatisticsData.map((x) => x.date),
    datasets: [
      {
        label: ANSWER_LOG_HISTGRAM_LABEL[0],
        data: answerLogStatisticsData.map((x) => x.count),
        backgroundColor: ANSWER_LOG_HISTGRAM_COLOR[0],
        type: 'bar',
        order: 2
      },
      {
        label: ANSWER_LOG_HISTGRAM_LABEL[1],
        data: answerLogStatisticsData.map((x) => x.accuracy_rate),
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
          dateUnit === 'month' ? 'ヶ月' : dateUnit === 'week' ? '週' : '日'
        }間の回答数`
      }
    }
  };

  return (
    <Card variant="outlined" attr={['margin-vertical']}>
      <PullDown
        label={'日付単位'}
        optionList={DATE_UNIT_OPTION}
        onChange={(e) => setDateUnit(e.target.value as 'day' | 'week' | 'month')}
        value={0}
      />
      <div className="h-[300px]" style={{ minHeight: 300 }}>
        <Chart type="bar" options={options} data={data} />
      </div>
    </Card>
  );
};

const meta = {
  title: 'Organisms/Quizzer/Top/QuizAnswerLogStatisticsCard',
  component: QuizAnswerLogStatisticsCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof QuizAnswerLogStatisticsCard>;

export default meta;

export const Mock: StoryObj = {
  render: () => <QuizAnswerLogStatisticsCardWithMock />
};
