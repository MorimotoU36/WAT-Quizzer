import type { Meta, StoryObj } from '@storybook/nextjs';
import { AccuracyRateHistgramCard } from './AccuracyRateHistgramCard';

// API呼び出しをモック
jest.mock('quizzer-lib', () => ({
  ...jest.requireActual('quizzer-lib'),
  getAccuracyRateHistgramDataAPI: jest.fn().mockResolvedValue({
    result: {
      result: [5, 10, 8, 3, 1, 0, 0, 0, 0, 0]
    }
  })
}));

const meta = {
  title: 'Quizzer/AccuracyRateHistgramCard',
  component: AccuracyRateHistgramCard,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof AccuracyRateHistgramCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    file_num: 1
  }
};
