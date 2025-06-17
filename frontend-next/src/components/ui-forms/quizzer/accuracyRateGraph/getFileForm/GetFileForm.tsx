import React, { useEffect, useState } from 'react';
import { FormGroup } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import {
  getAccuracyRateByCategoryAPI,
  GetAccuracyRateByCategoryAPIResponseDto,
  GetCategoryRateAPIRequestDto
} from 'quizzer-lib';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import { useQuizFileList } from '@/hooks/useQuizFileList';

interface GetFileFormProps {
  setAccuracyData: React.Dispatch<React.SetStateAction<GetAccuracyRateByCategoryAPIResponseDto>>;
}

export const GetFileForm = ({ setAccuracyData }: GetFileFormProps) => {
  const [getCategoryRateData, setCategoryRateData] = useState<GetCategoryRateAPIRequestDto>({
    file_num: -1
  });
  const { filelistoption } = useQuizFileList();
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
      <PullDown
        label={'問題ファイル'}
        optionList={filelistoption}
        onChange={(e) => {
          setCategoryRateData({
            ...getCategoryRateData,
            file_num: +e.target.value
          });
        }}
      />
    </FormGroup>
  );
};
