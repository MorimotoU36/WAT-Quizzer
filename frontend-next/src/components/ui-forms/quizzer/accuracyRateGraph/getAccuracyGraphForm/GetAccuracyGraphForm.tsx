import React from 'react';
import { FormControl, FormGroup } from '@mui/material';
import { QuizFilePullDown } from '@/components/ui-elements/pullDown/quizFilePullDown/QuizFilePullDown';
import { ToggleButton } from '@/components/ui-elements/toggleButton/ToggleButton';
import { Card } from '@/components/ui-elements/card/Card';
import { useAccuracyGraphForm } from '@/contexts/AccuracyGraphFormContext';
import { DateRange } from '@/components/ui-parts/dateRange/DateRange';
import { getDateForSqlString } from 'quizzer-lib';
import { CheckboxGroup } from '@/components/ui-parts/checkboxGroup/CheckboxGroup';
import { useQuizFormatList } from '@/hooks/useQuizFormatList';

export const GetAccuracyGraphForm = () => {
  const { graph, order, getCategoryRateData, setGraph, setOrder, setCategoryRateData } = useAccuracyGraphForm();
  const { quizFormatListoption } = useQuizFormatList();

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
        <FormControl margin={'dense'} className={'!flex-row items-center'}>
          {'取得範囲　　：'}
          <DateRange
            setStartState={(newValue: Date | null) => {
              setCategoryRateData({
                ...getCategoryRateData,
                startDate: getDateForSqlString(newValue as Date)
              });
            }}
            setEndState={(newValue: Date | null) => {
              setCategoryRateData({
                ...getCategoryRateData,
                endDate: getDateForSqlString(newValue as Date)
              });
            }}
          />
        </FormControl>
        <FormControl>
          <CheckboxGroup
            checkboxProps={quizFormatListoption.map((x) => {
              return {
                value: String(x.id),
                label: x.name,
                checked: !!(getCategoryRateData.format_id && getCategoryRateData.format_id[String(x.id)])
              };
            })}
            setQueryofQuizStater={(checkBoxValue, checked) => {
              const setData = {
                ...getCategoryRateData,
                format_id: {
                  ...getCategoryRateData.format_id,
                  [checkBoxValue]: checked
                }
              };
              setCategoryRateData(setData);
            }}
            label={'問題種別'}
          />
        </FormControl>
      </FormGroup>
    </Card>
  );
};
