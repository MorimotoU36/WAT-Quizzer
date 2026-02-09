import React from 'react';
import { GetQuizAPIRequestDto, GetQuizApiResponseDto } from 'quizzer-lib';
import { QuizActionButton } from './QuizActionButton';

interface GetQuizButtonGroupProps {
  getQuizRequestData: GetQuizAPIRequestDto;
  getQuizResponseData: GetQuizApiResponseDto;
  setQuizResponseData?: React.Dispatch<React.SetStateAction<GetQuizApiResponseDto>>;
  setImageUrl?: React.Dispatch<React.SetStateAction<string>>;
}

export const GetQuizButtonGroup = ({
  getQuizRequestData,
  getQuizResponseData,
  setQuizResponseData,
  setImageUrl
}: GetQuizButtonGroupProps) => {
  return (
    <>
      <QuizActionButton
        label="出題"
        variant="contained"
        color="primary"
        attr="button-array"
        actionType="quiz"
        getQuizRequestData={getQuizRequestData}
        getQuizResponseData={getQuizResponseData}
        setQuizResponseData={setQuizResponseData}
        setImageUrl={setImageUrl}
      />
      <QuizActionButton
        label="ランダム出題"
        variant="contained"
        color="secondary"
        attr="button-array"
        actionType="quiz"
        getQuizMethod="random"
        getQuizRequestData={getQuizRequestData}
        getQuizResponseData={getQuizResponseData}
        setQuizResponseData={setQuizResponseData}
        setImageUrl={setImageUrl}
      />
      <QuizActionButton
        label="最低正解率問出題"
        variant="contained"
        color="secondary"
        actionType="quiz"
        getQuizMethod="worstRate"
        getQuizRequestData={getQuizRequestData}
        getQuizResponseData={getQuizResponseData}
        setQuizResponseData={setQuizResponseData}
        setImageUrl={setImageUrl}
      />
      <QuizActionButton
        label="最小回答数問出題"
        variant="contained"
        color="secondary"
        attr="button-array"
        actionType="quiz"
        getQuizMethod="leastClear"
        getQuizRequestData={getQuizRequestData}
        getQuizResponseData={getQuizResponseData}
        setQuizResponseData={setQuizResponseData}
        setImageUrl={setImageUrl}
      />
      <QuizActionButton
        label="LRU問出題"
        variant="contained"
        color="secondary"
        attr="button-array"
        actionType="quiz"
        getQuizMethod="LRU"
        getQuizRequestData={getQuizRequestData}
        getQuizResponseData={getQuizResponseData}
        setQuizResponseData={setQuizResponseData}
        setImageUrl={setImageUrl}
      />
      <QuizActionButton
        label="以前間違えた問題"
        variant="contained"
        color="secondary"
        attr="button-array"
        actionType="quiz"
        getQuizMethod="review"
        getQuizRequestData={getQuizRequestData}
        getQuizResponseData={getQuizResponseData}
        setQuizResponseData={setQuizResponseData}
        setImageUrl={setImageUrl}
      />
      <QuizActionButton
        label="今日まだ解いてない問題"
        variant="contained"
        color="secondary"
        attr="button-array"
        actionType="quiz"
        getQuizMethod="todayNotAnswered"
        getQuizRequestData={getQuizRequestData}
        getQuizResponseData={getQuizResponseData}
        setQuizResponseData={setQuizResponseData}
        setImageUrl={setImageUrl}
      />
      <QuizActionButton
        label="画像表示"
        variant="contained"
        color="info"
        attr="button-array"
        actionType="image"
        disabled={!getQuizResponseData.img_file}
        getQuizResponseData={getQuizResponseData}
        setImageUrl={setImageUrl}
      />
    </>
  );
};
