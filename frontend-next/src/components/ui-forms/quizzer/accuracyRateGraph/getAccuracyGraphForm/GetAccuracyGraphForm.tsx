import React, { useState } from 'react';
import { FormControl, FormGroup } from '@mui/material';
import { GetCategoryRateAPIRequestDto } from 'quizzer-lib';
import { QuizFilePullDown } from '@/components/ui-elements/pullDown/quizFilePullDown/QuizFilePullDown';
import { ToggleButton } from '@/components/ui-elements/toggleButton/ToggleButton';
import { AccuracyChart } from '../accuracyChart/AccuracyChart';
import { AccuracyRadarChart } from '../accuracyRadarChart/AccuracyRadarChart';
import { Card } from '@/components/ui-elements/card/Card';
import { useAccuracyRateByCategory } from '@/hooks/useAccuracyRateByCategory';

interface GetAccuracyGraphFormProps {}

export const GetAccuracyGraphForm = ({}: GetAccuracyGraphFormProps) => {
  const [getCategoryRateData, setCategoryRateData] = useState<GetCategoryRateAPIRequestDto>({
    file_num: -1
  });
  const { accuracyData } = useAccuracyRateByCategory(getCategoryRateData);
  const [graph, setGraph] = React.useState('Bar');
  const [order, setOrder] = React.useState('Rate');

  return (
    <Card attr={['through-card', 'padding']}>
      <FormGroup>
        <FormControl>
          <QuizFilePullDown
            onFileChange={(e) => {
              setCategoryRateData({
                ...getCategoryRateData,
                file_num: +e.target.value
              });
            }}
          />
        </FormControl>
        <FormControl margin={'dense'} className={'!inline-block'}>
          {'グラフの種類：'}
          <ToggleButton alignment={graph} setAlignment={setGraph} buttonValues={['Bar', 'Radar']}></ToggleButton>
        </FormControl>
        <FormControl margin={'dense'} className={'!inline-block'}>
          {'表示順　　　：'}
          <ToggleButton alignment={order} setAlignment={setOrder} buttonValues={['Rate', 'Name']}></ToggleButton>
        </FormControl>
        <FormControl>
          {graph === 'Bar' ? (
            <AccuracyChart accuracyData={accuracyData} order={order} />
          ) : graph === 'Radar' ? (
            <AccuracyRadarChart accuracyData={accuracyData} order={order} />
          ) : (
            <></>
          )}
        </FormControl>
      </FormGroup>
    </Card>
  );
};
