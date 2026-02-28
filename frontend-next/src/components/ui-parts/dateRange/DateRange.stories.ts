import type { Meta, StoryObj } from '@storybook/nextjs';
import { DateRange } from './DateRange';
import React, { useState } from 'react';

const meta = {
  title: 'Molecules/DateRange',
  component: DateRange,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof DateRange>;

export default meta;
type Story = StoryObj<typeof meta>;

// DateRange コンポーネントは setState 関数を props として受け取るため、
// Story 内で state を管理する必要があります
const DateRangeWrapper = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <div>
      <DateRange setStartState={setStartDate} setEndState={setEndDate} />
      {startDate && <p>開始日: {startDate.toLocaleDateString()}</p>}
      {endDate && <p>終了日: {endDate.toLocaleDateString()}</p>}
    </div>
  );
};

export const Default: Story = {
  render: () => <DateRangeWrapper />
};

export const WithInitialDates: Story = {
  render: () => {
    const [startDate, setStartDate] = useState<Date | null>(new Date('2024-01-01'));
    const [endDate, setEndDate] = useState<Date | null>(new Date('2024-12-31'));

    return (
      <div>
        <DateRange setStartState={setStartDate} setEndState={setEndDate} />
        {startDate && <p>開始日: {startDate.toLocaleDateString()}</p>}
        {endDate && <p>終了日: {endDate.toLocaleDateString()}</p>}
      </div>
    );
  }
};
