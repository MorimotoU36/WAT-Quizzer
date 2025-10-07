import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox, CheckboxProps } from './CheckBox';

const meta: Meta<typeof Checkbox> = {
  title: 'ui-elements/CheckBox',
  component: Checkbox,
  tags: ['autodocs']
};

export default meta;

export const Default: StoryObj<CheckboxProps> = {
  args: {
    value: 'default',
    label: 'デフォルト'
  }
};

export const Checked: StoryObj<CheckboxProps> = {
  args: {
    value: 'checked',
    label: 'チェック済み',
    defaultChecked: true
  }
};

export const Disabled: StoryObj<CheckboxProps> = {
  args: {
    value: 'disabled',
    label: '無効化',
    disabled: true
  }
};

export const Required: StoryObj<CheckboxProps> = {
  args: {
    value: 'required',
    label: '必須',
    required: true
  }
};
