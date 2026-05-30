import type { Meta, StoryObj } from '@storybook/nextjs';
import { CategoryTreemapChart } from './CategoryTreemapChart';

const mockData = [
  {
    name: '文法',
    _colorIndex: 0,
    children: [
      { name: '動詞', size: 20, _colorIndex: 0 },
      { name: '名詞', size: 15, _colorIndex: 0 },
      { name: '形容詞', size: 10, _colorIndex: 0 }
    ]
  },
  {
    name: '語彙',
    _colorIndex: 1,
    children: [
      { name: '基礎単語', size: 30, _colorIndex: 1 },
      {
        name: '上級単語',
        _colorIndex: 1,
        children: [
          { name: 'ビジネス', size: 12, _colorIndex: 1 },
          { name: '学術', size: 8, _colorIndex: 1 }
        ]
      }
    ]
  },
  { name: 'リスニング', size: 25, _colorIndex: 2 }
];

const meta = {
  title: 'Organisms/Quizzer/AccuracyRateGraph/CategoryTreemapChart',
  component: CategoryTreemapChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof CategoryTreemapChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: mockData
  }
};

export const Empty: Story = {
  args: {
    data: []
  }
};
