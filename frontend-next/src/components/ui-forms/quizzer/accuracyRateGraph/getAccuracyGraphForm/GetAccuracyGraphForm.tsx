import React, { useEffect, useState } from 'react';
import { FormGroup } from '@mui/material';
import {
  getAccuracyRateByCategoryAPI,
  GetAccuracyRateByCategoryAPIResponseDto,
  GetCategoryRateAPIRequestDto
} from 'quizzer-lib';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import { QuizFilePullDown } from '@/components/ui-elements/pullDown/quizFilePullDown/QuizFilePullDown';

interface GetAccuracyGraphFormProps {
  setAccuracyData: React.Dispatch<React.SetStateAction<GetAccuracyRateByCategoryAPIResponseDto>>;
}

export const GetAccuracyGraphForm = ({ setAccuracyData }: GetAccuracyGraphFormProps) => {
  const [getCategoryRateData, setCategoryRateData] = useState<GetCategoryRateAPIRequestDto>({
    file_num: -1
  });
  const setMessage = useSetRecoilState(messageState);

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
    <FormGroup>
      <QuizFilePullDown
        onFileChange={(e) => {
          setCategoryRateData({
            ...getCategoryRateData,
            file_num: +e.target.value
          });
        }}
      />
    </FormGroup>
  );
};
