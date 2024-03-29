import type { Meta, StoryObj } from '@storybook/react';

import { InputQueryForEditForm } from './InputQueryForEditForm';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Organisms/GetQuiz/InputQueryForm',
  component: InputQueryForEditForm,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof InputQueryForEditForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const InputForEditForm: Story = {
  args: {
    filelistoption: [],
    queryOfQuizState: {
      fileNum: 0,
      quizNum: 0,
      format: 'basic'
    }
  }
};
