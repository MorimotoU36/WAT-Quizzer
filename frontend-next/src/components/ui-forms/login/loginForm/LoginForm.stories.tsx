import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LoginForm } from './LoginForm';

const meta: Meta<typeof LoginForm> = {
  title: 'Organisms/Login/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof LoginForm>;

const Wrapper = (props: any) => {
  const [username, setUsername] = useState('');
  return <LoginForm {...props} username={username} setUsername={setUsername} setShowNewPasswordForm={() => {}} />;
};

export const Default: Story = {
  render: (args) => <Wrapper {...args} />
};
