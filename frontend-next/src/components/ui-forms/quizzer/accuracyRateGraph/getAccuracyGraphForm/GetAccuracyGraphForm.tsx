import React from 'react';
import { FormControl, FormGroup } from '@mui/material';
import { GetCategoryRateAPIRequestDto } from 'quizzer-lib';
import { QuizFilePullDown } from '@/components/ui-elements/pullDown/quizFilePullDown/QuizFilePullDown';
import { ToggleButton } from '@/components/ui-elements/toggleButton/ToggleButton';
import { Card } from '@/components/ui-elements/card/Card';

interface GetAccuracyGraphFormProps {
  graph: string;
  order: string;
  getCategoryRateData: GetCategoryRateAPIRequestDto;
  setGraph: React.Dispatch<React.SetStateAction<string>>;
  setOrder: React.Dispatch<React.SetStateAction<string>>;
  setCategoryRateData: React.Dispatch<React.SetStateAction<GetCategoryRateAPIRequestDto>>;
}

export const GetAccuracyGraphForm = ({
  graph,
  order,
  getCategoryRateData,
  setGraph,
  setOrder,
  setCategoryRateData
}: GetAccuracyGraphFormProps) => {
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
      </FormGroup>
    </Card>
  );
};
