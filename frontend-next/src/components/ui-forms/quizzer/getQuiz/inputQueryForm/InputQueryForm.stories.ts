import type { Meta, StoryObj } from '@storybook/react';

import { InputQueryForm } from './InputQueryForm';
import { quizFileMock } from '../../../../../../.storybook/mockData/quizFile';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Organisms/Quizzer/GetQuiz/InputQueryForm',
  component: InputQueryForm,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof InputQueryForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const InputForm: Story = {
  args: {
    filelistoption: quizFileMock,
    categorylistoption: [],
    queryOfQuizState: {
      fileNum: 0,
      quizNum: 0,
      format: 'basic'
    },
    displayQuizState: {
      fileNum: 0,
      quizNum: 0,
      quizSentense: '問題テスト',
      quizAnswer: '答えテスト',
      checked: false,
      expanded: true
    }
  }
};
