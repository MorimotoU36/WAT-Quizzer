import type { Meta, StoryObj } from '@storybook/nextjs';
import { EnglishBotDashboard } from './EnglishBotDashBoard';
import { RecoilRoot } from 'recoil';

const meta = {
  title: 'Organisms/EnglishBot/EnglishBotDashboard',
  component: EnglishBotDashboard,
  decorators: [(story) => <RecoilRoot>{story()}</RecoilRoot>],
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof EnglishBotDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};
