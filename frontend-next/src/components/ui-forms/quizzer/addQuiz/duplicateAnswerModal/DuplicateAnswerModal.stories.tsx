import type { Meta, StoryObj } from '@storybook/nextjs';
import React, { useState } from 'react';
import { DuplicateAnswerModal } from './DuplicateAnswerModal';

const meta = {
  title: 'Molecules/Quizzer/AddQuiz/DuplicateAnswerModal',
  component: DuplicateAnswerModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof DuplicateAnswerModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockDuplicateQuizzes = [
  {
    id: 1,
    file_num: 1,
    quiz_num: 1,
    quiz_sentense: 'JavaScriptのデータ型でプリミティブ型でないものはどれか？',
    answer: 'Object'
  },
  {
    id: 2,
    file_num: 1,
    quiz_num: 5,
    quiz_sentense: 'JavaScriptにおいてnullのtypeofの結果は何か？',
    answer: 'Object'
  }
];

export const Open: Story = {
  args: {
    isOpen: true,
    setIsOpen: () => {},
    duplicateQuizzes: mockDuplicateQuizzes,
    answer: 'Object',
    onConfirm: () => {}
  }
};

export const SingleDuplicate: Story = {
  args: {
    isOpen: true,
    setIsOpen: () => {},
    duplicateQuizzes: [mockDuplicateQuizzes[0]],
    answer: 'Object',
    onConfirm: () => {}
  }
};

export const Closed: Story = {
  args: {
    isOpen: false,
    setIsOpen: () => {},
    duplicateQuizzes: mockDuplicateQuizzes,
    answer: 'Object',
    onConfirm: () => {}
  }
};

const DuplicateAnswerModalInteractive = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div>
      <button onClick={() => { setIsOpen(true); setConfirmed(false); }}>モーダルを開く</button>
      {confirmed && <p style={{ color: 'green', marginTop: 8 }}>登録が実行されました</p>}
      <DuplicateAnswerModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        duplicateQuizzes={mockDuplicateQuizzes}
        answer="Object"
        onConfirm={() => {
          setIsOpen(false);
          setConfirmed(true);
        }}
      />
    </div>
  );
};

export const Interactive: StoryObj = {
  render: () => <DuplicateAnswerModalInteractive />
};
