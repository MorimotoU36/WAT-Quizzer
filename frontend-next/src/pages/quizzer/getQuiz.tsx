import React, { useState } from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { GetQuizButtonGroup } from '@/components/ui-forms/quizzer/getQuiz/getQuizButtonGroup/GetQuizButtonGroup';
import { DisplayQuizSection } from '@/components/ui-forms/quizzer/getQuiz/displayQuizSection/DisplayQuizSection';
import { InputQueryForm } from '@/components/ui-forms/quizzer/getQuiz/inputQueryForm/InputQueryForm';
import {
  GetQuizAPIRequestDto,
  GetQuizApiResponseDto,
  initGetQuizRequestData,
  initGetQuizResponseData
} from 'quizzer-lib';

type Props = {
  isMock?: boolean;
};

export default function GetQuizPage({ isMock }: Props) {
  const [getQuizRequestData, setQuizRequestData] = useState<GetQuizAPIRequestDto>(initGetQuizRequestData);
  const [getQuizResponseData, setQuizResponseData] = useState<GetQuizApiResponseDto>(initGetQuizResponseData);
  // TODO このstate 上のDtoに組み入れられないか？
  const [imageUrl, setImageUrl] = useState<string>('');

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>
        <InputQueryForm getQuizRequestData={getQuizRequestData} setQuizRequestData={setQuizRequestData} />
        <GetQuizButtonGroup
          getQuizRequestData={getQuizRequestData}
          getQuizResponseData={getQuizResponseData}
          setQuizResponseData={setQuizResponseData}
          setImageUrl={setImageUrl}
        />
        <DisplayQuizSection
          getQuizResponseData={getQuizResponseData}
          setQuizResponseData={setQuizResponseData}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
        />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'問題出題'} />
    </>
  );
}
