import React from 'react';
import { FormControl, FormGroup } from '@mui/material';
import { QuizFilePullDown } from '@/components/ui-elements/pullDown/quizFilePullDown/QuizFilePullDown';
import { ToggleButton } from '@/components/ui-elements/toggleButton/ToggleButton';
import { Card } from '@/components/ui-elements/card/Card';
import { useAccuracyGraphForm } from '@/contexts/AccuracyGraphFormContext';

export const GetAccuracyGraphForm = () => {
  const { graph, order, getCategoryRateData, setGraph, setOrder, setCategoryRateData } = useAccuracyGraphForm();

  const setGraphString: React.Dispatch<React.SetStateAction<string>> = (value) => {
    if (typeof value === 'function') {
      setGraph((prev) => (value as (prevState: string) => string)(prev) as any);
    } else {
      setGraph(value as any);
    }
  };

  const setOrderString: React.Dispatch<React.SetStateAction<string>> = (value) => {
    if (typeof value === 'function') {
      setOrder((prev) => (value as (prevState: string) => string)(prev) as any);
    } else {
      setOrder(value as any);
    }
  };

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
          <ToggleButton
            alignment={graph as unknown as string}
            setAlignment={setGraphString}
            buttonValues={['Bar', 'Radar']}
          ></ToggleButton>
        </FormControl>
        <FormControl margin={'dense'} className={'!inline-block'}>
          {'表示順　　　：'}
          <ToggleButton
            alignment={order as unknown as string}
            setAlignment={setOrderString}
            buttonValues={['Rate', 'Name']}
          ></ToggleButton>
        </FormControl>
      </FormGroup>
    </Card>
  );
};
