import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';

const meta = {
  title: 'Molecules/Header',
  component: Header,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen'
  }
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Quizzer: Story = {
  args: {
    bgColor: '#0077B6',
    onClick: () => {}
  }
};

export const EnglishBot: Story = {
  args: {
    bgColor: 'midnightblue',
    onClick: () => {}
  }
};
