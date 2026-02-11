import type { Meta, StoryObj } from '@storybook/nextjs';
import { DeleteTodoForm } from './DeleteTodoForm';

const meta = {
  title: 'Organisms/Settings/DeleteTodoForm',
  component: DeleteTodoForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof DeleteTodoForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};
