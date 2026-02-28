import type { Meta, StoryObj } from '@storybook/nextjs';
import RequiredAuthComponent from './RequiredAuthComponent';

const meta = {
  title: 'Molecules/RequiredAuthComponent',
  component: RequiredAuthComponent,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof RequiredAuthComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div>認証が必要なコンテンツ</div>
  }
};

export const WithContent: Story = {
  args: {
    children: (
      <div>
        <h1>保護されたページ</h1>
        <p>このコンテンツは認証が必要です。</p>
      </div>
    )
  }
};
