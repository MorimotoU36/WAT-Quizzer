import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { GetAccuracyRateByCategoryAPIResponseDto, GetCategoryRateAPIRequestDto } from 'quizzer-lib';
import { getAccuracyRateByCategoryAPI } from '@/utils/api-wrapper';

export const useAccuracyRateByCategory = (getCategoryRateData: GetCategoryRateAPIRequestDto) => {
  const setMessage = useSetRecoilState(messageState);
  const [accuracyData, setAccuracyData] = useState<GetAccuracyRateByCategoryAPIResponseDto>({
    result: [],
    checked_result: [],
    all_result: []
  });

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
  }, [getCategoryRateData, setMessage]);

  return { accuracyData };
};
