import type { Meta, StoryObj } from '@storybook/nextjs';
import { CategoryTreeGraph } from './CategoryTreeGraph';
import { CategoryParentChildAPIResponseDto } from 'quizzer-lib';
import { fn } from 'storybook/test';

const mockParentChildList: CategoryParentChildAPIResponseDto[] = [
  { id: 1, file_num: 1, parent_category_name: '文法', child_category_name: '動詞' },
  { id: 2, file_num: 1, parent_category_name: '文法', child_category_name: '名詞' },
  { id: 3, file_num: 1, parent_category_name: '動詞', child_category_name: '自動詞' },
  { id: 4, file_num: 1, parent_category_name: '動詞', child_category_name: '他動詞' },
  { id: 5, file_num: 1, parent_category_name: '語彙', child_category_name: '基礎単語' },
  { id: 6, file_num: 1, parent_category_name: '語彙', child_category_name: '上級単語' }
];

const meta = {
  title: 'Organisms/Quizzer/Settings/CategoryTreeGraph',
  component: CategoryTreeGraph,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof CategoryTreeGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    parentChildList: mockParentChildList,
    onDelete: fn()
  }
};

export const Empty: Story = {
  args: {
    parentChildList: [],
    onDelete: fn()
  }
};
