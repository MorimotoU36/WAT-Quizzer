import React, { useState } from 'react';
import { Container } from '@mui/material';
import { GetAccuracyRateByCategoryAPIResponseDto } from 'quizzer-lib';
import { Layout } from '@/components/templates/layout/Layout';
import { GetFileForm } from '@/components/ui-forms/quizzer/accuracyRateGraph/getFileForm/GetFileForm';
import { AccuracyChart } from '@/components/ui-forms/quizzer/accuracyRateGraph/accuracyChart/AccuracyChart';
import { AccuracyRadarChart } from '@/components/ui-forms/quizzer/accuracyRateGraph/accuracyRadarChart/AccuracyRadarChart';
import { ToggleButton } from '@/components/ui-elements/toggleButton/ToggleButton';

export default function AccuracyRateGraphPage() {
  const [accuracy_data, setAccuracyData] = useState<GetAccuracyRateByCategoryAPIResponseDto>({
    result: [],
    checked_result: [],
    all_result: []
  });
  const [graph, setGraph] = React.useState('Bar');
  const [order, setOrder] = React.useState('Rate');

  const contents = () => {
    return (
      <Container>
        <GetFileForm setAccuracyData={setAccuracyData} />
        <div className="my-1">
          {'グラフの種類：'}
          <ToggleButton alignment={graph} setAlignment={setGraph} buttonValues={['Bar', 'Radar']}></ToggleButton>
        </div>
        <div className="my-1">
          {'表示順　　　：'}
          <ToggleButton alignment={order} setAlignment={setOrder} buttonValues={['Rate', 'Name']}></ToggleButton>
        </div>
        {graph === 'Bar' ? (
          <AccuracyChart accuracyData={accuracy_data} order={order} />
        ) : graph === 'Radar' ? (
          <AccuracyRadarChart accuracyData={accuracy_data} order={order} />
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
