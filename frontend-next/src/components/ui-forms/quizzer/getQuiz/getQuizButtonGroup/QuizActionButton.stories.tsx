import type { Meta, StoryObj } from '@storybook/nextjs';
import { QuizActionButton } from './QuizActionButton';
import { RecoilRoot } from 'recoil';
import React, { useState } from 'react';
import { GetQuizApiResponseDto } from 'quizzer-lib';

const meta = {
  title: 'Molecules/Quizzer/GetQuiz/QuizActionButton',
  component: QuizActionButton,
  decorators: [(story) => <RecoilRoot>{story()}</RecoilRoot>],
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof QuizActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// QuizActionButton は state を更新するため、ラッパーコンポーネントが必要
const QuizActionButtonWrapper = (args: React.ComponentProps<typeof QuizActionButton>) => {
  const [quizResponseData, setQuizResponseData] = useState<GetQuizApiResponseDto | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string>('');

  return (
    <div>
      <QuizActionButton
        {...args}
        getQuizResponseData={quizResponseData}
        setQuizResponseData={setQuizResponseData}
        setImageUrl={setImageUrl}
      />
      {quizResponseData && (
        <div style={{ marginTop: 16, padding: 8, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
          <p>Quiz Response Data: {JSON.stringify(quizResponseData, null, 2)}</p>
        </div>
      )}
      {imageUrl && (
        <div style={{ marginTop: 16 }}>
          <p>Image URL: {imageUrl}</p>
        </div>
      )}
    </div>
  );
};

export const QuizAction: Story = {
  render: (args) => (
    <QuizActionButtonWrapper
      {...args}
      label="クイズを取得"
      actionType="quiz"
      getQuizRequestData={{ fileNum: 1 }}
      getQuizMethod="random"
    />
  )
};

export const ImageAction: Story = {
  render: (args) => (
    <QuizActionButtonWrapper
      {...args}
      label="画像を取得"
      actionType="image"
      getQuizResponseData={{
        id: 1,
        question: 'サンプル問題',
        answer: 'サンプル回答',
        img_file: 'sample.jpg'
      }}
    />
  )
};

export const Disabled: Story = {
  render: (args) => (
    <QuizActionButtonWrapper
      {...args}
      label="無効化されたボタン"
      actionType="quiz"
      disabled={true}
      getQuizRequestData={{ fileNum: 1 }}
      getQuizMethod="random"
    />
  )
};
