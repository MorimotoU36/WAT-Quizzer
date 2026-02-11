import type { Meta, StoryObj } from '@storybook/nextjs';
import { TodoSection } from './TodoSection';

const meta = {
  title: 'Organisms/Settings/TodoSection',
  component: TodoSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof TodoSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};
