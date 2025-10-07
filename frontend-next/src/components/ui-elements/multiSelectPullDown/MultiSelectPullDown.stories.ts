import type { Meta, StoryObj } from '@storybook/react';
import { MultiSelectPullDown } from './MultiSelectPullDown';

const meta = {
  title: 'Atom/MultiSelectPullDown',
  component: MultiSelectPullDown,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'padded'
  }
} satisfies Meta<typeof MultiSelectPullDown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: {
    label: 'マルチセレクトテスト',
    optionList: [
      {
        value: '0',
        label: '選択肢テスト０'
      },
      {
        value: '1',
        label: '選択肢テスト１'
      },
      {
        value: '2',
        label: '選択肢テスト２'
      },
      {
        value: '3',
        label: '選択肢テスト３'
      },
      {
        value: '4',
        label: '選択肢テスト４'
      }
    ]
  }
};

export const WithNumbers: Story = {
  args: {
    label: '数値選択',
    optionList: [
      {
        value: 1,
        label: '項目1'
      },
      {
        value: 2,
        label: '項目2'
      },
      {
        value: 3,
        label: '項目3'
      }
    ]
  }
};

export const SingleOption: Story = {
  args: {
    label: '単一オプション',
    optionList: [
      {
        value: 'single',
        label: '唯一の選択肢'
      }
    ]
  }
};

export const EmptyOptions: Story = {
  args: {
    label: '空のオプション',
    optionList: []
  }
};
