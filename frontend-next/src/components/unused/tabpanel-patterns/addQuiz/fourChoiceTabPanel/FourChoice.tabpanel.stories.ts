import type { Meta, StoryObj } from '@storybook/react';
import { FourChoiceTabPanel } from './FourChoice.tabpanel';
import { initEditQuizRequestData } from 'quizzer-lib';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Unused/TabPanelPatterns/FourChoiceTabPanel',
  component: FourChoiceTabPanel,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof FourChoiceTabPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const FourChoiceTab: Story = {
  args: {
    value: 2,
    putQuizRequestData: initEditQuizRequestData,
    setPutQuizRequestData: undefined
  }
};
