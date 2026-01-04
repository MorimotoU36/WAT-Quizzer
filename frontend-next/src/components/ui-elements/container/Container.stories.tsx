import type { Meta, StoryObj } from '@storybook/nextjs';
import { Container } from './Container';

const meta: Meta<typeof Container> = {
  title: 'ui-elements/container/Container',
  component: Container,
  argTypes: {
    attr: {
      control: 'array',
      description: 'クラス名の配列'
    },
    children: {
      control: 'text',
      description: '子要素'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {
    children: 'デフォルトのコンテナ'
  }
};

export const WithAttr: Story = {
  args: {
    attr: ['root', 'customClass'],
    children: '複数クラス名を指定した例'
  }
};
