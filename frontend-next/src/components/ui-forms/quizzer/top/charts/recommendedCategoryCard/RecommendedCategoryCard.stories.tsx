import type { Meta, StoryObj } from '@storybook/nextjs';
import { RecommendedCategoryCard } from './RecommendedCategoryCard';

const meta = {
  title: 'Organisms/Quizzer/Top/RecommendedCategoryCard',
  component: RecommendedCategoryCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof RecommendedCategoryCard>;

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
