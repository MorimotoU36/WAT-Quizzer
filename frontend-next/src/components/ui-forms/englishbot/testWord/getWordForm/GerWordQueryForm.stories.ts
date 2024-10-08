import type { Meta, StoryObj } from '@storybook/react';

import { GetWordQueryForm } from './GetWordQueryForm';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Organisms/EnglishBot/TestWord/GetWordQueryForm',
  component: GetWordQueryForm,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof GetWordQueryForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const InputForm: Story = {
  args: {
    sourcelistoption: []
  }
};
