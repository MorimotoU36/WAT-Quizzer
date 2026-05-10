import type { Meta, StoryObj } from '@storybook/nextjs';
import { RandomQuizCard } from './RandomQuizCard';

const meta = {
  title: 'Organisms/Quizzer/Top/RandomQuizCard',
  component: RandomQuizCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof RandomQuizCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    file_num: 1
  }
};

export const NoFileSelected: Story = {
  args: {
    file_num: -1
  }
};
