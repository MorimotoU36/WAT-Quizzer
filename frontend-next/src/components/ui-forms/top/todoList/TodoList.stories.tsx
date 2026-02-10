import type { Meta, StoryObj } from '@storybook/nextjs';
import { TodoList, Todo } from './TodoList';

const meta = {
  title: 'ui-forms/top/TodoList',
  component: TodoList,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof TodoList>;

export default meta;
type Story = StoryObj<typeof meta>;

// デフォルトのストーリー（初期状態）
export const Default: Story = {
  args: {}
};

// 一部完了している状態
export const PartiallyCompleted: Story = {
  args: {
    todos: [
      { id: '1', title: '朝の運動をする', completed: true },
      { id: '2', title: 'プロジェクトの進捗を確認する', completed: true },
      { id: '3', title: '新しい技術を学ぶ', completed: false },
      { id: '4', title: 'コードレビューを完了する', completed: false }
    ]
  }
};

// 全て完了している状態（背景が緑色になる）
export const AllCompleted: Story = {
  args: {
    todos: [
      { id: '1', title: '朝の運動をする', completed: true },
      { id: '2', title: 'プロジェクトの進捗を確認する', completed: true },
      { id: '3', title: '新しい技術を学ぶ', completed: true },
      { id: '4', title: 'コードレビューを完了する', completed: true }
    ]
  }
};

// カスタムTodoリスト
export const CustomTodos: Story = {
  args: {
    todos: [
      { id: '1', title: 'カスタムTodo 1', completed: false },
      { id: '2', title: 'カスタムTodo 2', completed: true },
      { id: '3', title: 'カスタムTodo 3', completed: false }
    ]
  }
};

// 空のTodoリスト
export const Empty: Story = {
  args: {
    todos: []
  }
};
