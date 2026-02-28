import type { Meta, StoryObj } from '@storybook/nextjs';
import { AddTodoForm } from './AddTodoForm';

const meta = {
  title: 'Organisms/Settings/AddTodoForm',
  component: AddTodoForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof AddTodoForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};
