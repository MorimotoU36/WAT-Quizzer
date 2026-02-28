import type { Meta, StoryObj } from '@storybook/nextjs';
import { DisplaySentence } from './DisplaySentence';

const meta = {
  title: 'Atom/DisplaySentence',
  component: DisplaySentence,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof DisplaySentence>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sentence: 'これは通常の文章です。'
  }
};

export const WithNewLine: Story = {
  args: {
    sentence: 'これは改行を含む文章です。\\n2行目です。\\n3行目です。'
  }
};

export const WithCheck: Story = {
  args: {
    sentence: 'チェック済みの文章です。',
    checked: true
  }
};

export const WithColor: Story = {
  args: {
    sentence: 'カラーが指定された文章です。',
    color: 'primary.main'
  }
};

export const WithId: Story = {
  args: {
    sentence: 'IDが指定された文章です。',
    id: 'sentence-id'
  }
};

export const LongText: Story = {
  args: {
    sentence: 'これは長い文章の例です。複数の文を含む文章を表示する場合のテストです。改行も含めて\\n複数行にわたる文章を表示できます。'
  }
};
