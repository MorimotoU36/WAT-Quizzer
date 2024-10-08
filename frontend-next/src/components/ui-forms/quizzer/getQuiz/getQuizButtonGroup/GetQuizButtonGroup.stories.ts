import type { Meta, StoryObj } from '@storybook/react';

import { GetQuizButtonGroup } from './GetQuizButtonGroup';
import { initGetQuizRequestData } from 'quizzer-lib';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Organisms/Quizzer/GetQuiz/GetQuizButtonGroup',
  component: GetQuizButtonGroup,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof GetQuizButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const GetQuizButtons: Story = {
  args: {
    getQuizRequestData: initGetQuizRequestData
  }
};
