import type { Meta, StoryObj } from '@storybook/nextjs';
import { SayingSection } from './SayingSection';

const meta = {
  title: 'Organisms/Settings/SayingSection',
  component: SayingSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof SayingSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    booklistoption: []
  }
};

export const WithBookOptions: Story = {
  args: {
    booklistoption: [
      { value: '1', label: '本1' },
      { value: '2', label: '本2' },
      { value: '3', label: '本3' }
    ]
  }
};
