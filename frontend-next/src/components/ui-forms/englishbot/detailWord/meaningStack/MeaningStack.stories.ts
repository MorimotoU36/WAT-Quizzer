import type { Meta, StoryObj } from '@storybook/react';
import { MeaningStack } from './MeaningStack';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Organisms/EnglishBot/DetailWord/MeaningStack',
  component: MeaningStack,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof MeaningStack>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Main: Story = {
  args: {
    posList: [],
    wordDetail: {
      id: 0,
      name: 'word',
      pronounce: '発音',
      mean: [],
      word_source: [],
      word_subsource: [],
      synonym_original: [],
      synonym_word: [],
      antonym_original: [],
      antonym_word: [],
      derivative: [],
      word_etymology: []
    }
  }
};
