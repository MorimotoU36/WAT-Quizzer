import type { Meta, StoryObj } from '@storybook/react';
import { SourceStatisticsCard } from './SourceStatisticsCard';
import { useState } from 'react';
import { Card } from '@/components/ui-elements/card/Card';
import { PullDownOptionDto, SourceStatisticsApiResponse } from 'quizzer-lib';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// モックデータ
const mockSourceStatisticsData: SourceStatisticsApiResponse[] = [
  {
    id: 1,
    name: 'TOEIC',
    clear_count: 30,
    fail_count: 10,
    not_answered: 5,
    count: 45,
    accuracy_rate: 0.75
  },
  {
    id: 2,
    name: '英検',
    clear_count: 20,
    fail_count: 15,
    not_answered: 10,
    count: 45,
    accuracy_rate: 0.44
  }
];

const mockSourceListOption: PullDownOptionDto[] = mockSourceStatisticsData.map((x) => ({
  value: String(x.id),
  label: x.name
}));

const SourceStatisticsCardWithMock = () => {
  const [selectedSource, setSelectedSource] = useState<number>(1);
  const selectedSourceStaticsData = mockSourceStatisticsData.find((x) => x.id === selectedSource);

  const labels = ['正解数', '不正解数', '未解答数'];
  const datasets = selectedSourceStaticsData
    ? [
        {
          label: '正答率分布',
          data: [
            selectedSourceStaticsData.clear_count || 0,
            selectedSourceStaticsData.fail_count || 0,
            selectedSourceStaticsData.not_answered || 0
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
        text: `出典統計(${selectedSourceStaticsData ? selectedSourceStaticsData.name : 'null'}): ${
          selectedSourceStaticsData ? selectedSourceStaticsData.count : '0'
        }問中`
      }
    }
  };

  return (
    <Card variant="outlined" attr={['margin-vertical']}>
      <div style={{ marginBottom: 16 }}>
        <label>出典</label>
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(Number(e.target.value))}
          style={{ marginLeft: 8 }}
        >
          {mockSourceListOption.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <Card variant="outlined" attr={['rect-600', 'margin-vertical']}>
        <Doughnut data={data} options={options} />
      </Card>
    </Card>
  );
};

const meta = {
  title: 'Organisms/EnglishBot/Top/SourceStatisticsCard',
  component: SourceStatisticsCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof SourceStatisticsCard>;

export default meta;

export const Mock: StoryObj = {
  render: () => <SourceStatisticsCardWithMock />
};
