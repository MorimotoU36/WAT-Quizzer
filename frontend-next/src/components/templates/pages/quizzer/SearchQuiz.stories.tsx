import type { Meta, StoryObj } from '@storybook/react';
import SearchQuizPage from '../../../../pages/quizzer/searchQuiz';
import { RecoilRoot } from 'recoil';

const meta = {
  title: 'Templates/Quizzer/SearchQuizPage',
  component: SearchQuizPage,
  decorators: [(story) => <RecoilRoot>{story()} </RecoilRoot>],
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen'
  }
} satisfies Meta<typeof SearchQuizPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {
  args: { isMock: true }
};
