import type { Meta, StoryObj } from '@storybook/nextjs';
import { ToggleButton } from './ToggleButton';
import React, { useState } from 'react';

const meta = {
  title: 'Atom/ToggleButton',
  component: ToggleButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main = {
  render: () => <ToggleButtonStory />
} as unknown as Story;

const ToggleButtonStory = () => {
  const [alignment, setAlignment] = React.useState('left');
  return <ToggleButton alignment={alignment} setAlignment={setAlignment} buttonValues={['left', 'center', 'right']} />;
};
