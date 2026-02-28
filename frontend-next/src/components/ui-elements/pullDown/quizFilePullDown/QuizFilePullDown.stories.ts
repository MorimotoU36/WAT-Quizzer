import type { Meta, StoryObj } from '@storybook/nextjs';
import { QuizFilePullDown } from './QuizFilePullDown';
import { RecoilRoot } from 'recoil';

const meta = {
  title: 'Molecules/QuizFilePullDown',
  component: QuizFilePullDown,
  decorators: [(story) => <RecoilRoot>{story()}</RecoilRoot>],
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof QuizFilePullDown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onFileChange: (e) => {
      console.log('File changed:', e.target.value);
    },
    value: ''
  }
};

export const WithValue: Story = {
  args: {
    onFileChange: (e) => {
      console.log('File changed:', e.target.value);
    },
    value: 1
  }
};
