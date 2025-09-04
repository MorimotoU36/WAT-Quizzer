import React, { useEffect, useState } from 'react';
import { FormControl, FormGroup } from '@mui/material';
import {
  getAccuracyRateByCategoryAPI,
  GetAccuracyRateByCategoryAPIResponseDto,
  GetCategoryRateAPIRequestDto
} from 'quizzer-lib';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import { QuizFilePullDown } from '@/components/ui-elements/pullDown/quizFilePullDown/QuizFilePullDown';
import { ToggleButton } from '@/components/ui-elements/toggleButton/ToggleButton';
import { AccuracyChart } from '../accuracyChart/AccuracyChart';
import { AccuracyRadarChart } from '../accuracyRadarChart/AccuracyRadarChart';
import { Card } from '@/components/ui-elements/card/Card';

interface GetAccuracyGraphFormProps {}

export const GetAccuracyGraphForm = ({}: GetAccuracyGraphFormProps) => {
  const [getCategoryRateData, setCategoryRateData] = useState<GetCategoryRateAPIRequestDto>({
    file_num: -1
  });
  const setMessage = useSetRecoilState(messageState);
  const [accuracy_data, setAccuracyData] = useState<GetAccuracyRateByCategoryAPIResponseDto>({
    result: [],
    checked_result: [],
    all_result: []
  });
  const [graph, setGraph] = React.useState('Bar');
  const [order, setOrder] = React.useState('Rate');

  useEffect(() => {
    (async () => {
      if (getCategoryRateData.file_num !== -1) {
        setMessage({
          message: '通信中...',
          messageColor: '#d3d3d3',
          isDisplay: true
        });
        const result = await getAccuracyRateByCategoryAPI({ getCategoryRateData });
        setMessage(result.message);
        if (result.result) {
          setAccuracyData({ ...(result.result as GetAccuracyRateByCategoryAPIResponseDto) });
        }
      }
    })();
  }, [getCategoryRateData, setMessage, setAccuracyData]);

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
            <AccuracyChart accuracyData={accuracy_data} order={order} />
          ) : graph === 'Radar' ? (
            <AccuracyRadarChart accuracyData={accuracy_data} order={order} />
          ) : (
            <></>
          )}
        </FormControl>
      </FormGroup>
    </Card>
  );
};
