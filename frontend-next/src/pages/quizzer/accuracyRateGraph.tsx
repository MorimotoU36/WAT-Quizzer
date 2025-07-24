import React, { useState } from 'react';
import { Container } from '@mui/material';
import { GetAccuracyRateByCategoryAPIResponseDto } from 'quizzer-lib';
import { Layout } from '@/components/templates/layout/Layout';
import { GetFileForm } from '@/components/ui-forms/quizzer/accuracyRateGraph/getFileForm/GetFileForm';
import { AccuracyChart } from '@/components/ui-forms/quizzer/accuracyRateGraph/accuracyChart/AccuracyChart';
import { AccuracyRadarChart } from '@/components/ui-forms/quizzer/accuracyRateGraph/accuracyRadarChart/AccuracyRadarChart';
import { ToggleButton } from '@/components/ui-elements/toggleButton/ToggleButton';

type Props = {
  isMock?: boolean;
};

export default function AccuracyRateGraphPage({ isMock }: Props) {
  const [accuracy_data, setAccuracyData] = useState<GetAccuracyRateByCategoryAPIResponseDto>({
    result: [],
    checked_result: [],
    all_result: []
  });
  const [alignment, setAlignment] = React.useState('Bar');

  const contents = () => {
    return (
      <Container>
        <GetFileForm setAccuracyData={setAccuracyData} />
        <ToggleButton alignment={alignment} setAlignment={setAlignment} buttonValues={['Bar', 'Radar']}></ToggleButton>
        {alignment === 'Bar' ? (
          <AccuracyChart accuracyData={accuracy_data} />
        ) : alignment === 'Radar' ? (
          <AccuracyRadarChart accuracyData={accuracy_data} />
        ) : (
          <></>
        )}
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'カテゴリ別正解率表示'} />
    </>
  );
}
