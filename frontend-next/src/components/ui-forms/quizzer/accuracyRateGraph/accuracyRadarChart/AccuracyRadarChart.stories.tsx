import type { Meta, StoryObj } from '@storybook/react';
import { AccuracyRadarChart } from './AccuracyRadarChart';

const meta = {
  title: 'Organisms/Quizzer/AccuracyRadarChart/AccuracyRadarChart',
  component: AccuracyRadarChart,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof AccuracyRadarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {
  args: {
    accuracyData: {
      result: [
        {
          file_num: 1,
          category: '英単語',
          count: BigInt(10),
          accuracy_rate: 0.8
        },
        {
          file_num: 1,
          category: '熟語',
          count: BigInt(8),
          accuracy_rate: 0.6
        },
        {
          file_num: 1,
          category: '文法',
          count: BigInt(12),
          accuracy_rate: 0.9
        }
      ],
      checked_result: [],
      all_result: []
    },
    order: 'Rate'
  }
};
