import { useState, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { GetQuizFormatApiResponseDto, getQuizFormatListAPI } from 'quizzer-lib';

export const useQuizFormatList = () => {
  const [quizFormatListoption, setQuizFormatListoption] = useState<GetQuizFormatApiResponseDto[]>([]);
  const setMessage = useSetRecoilState(messageState);

  useEffect(() => {
    (async () => {
      setMessage({
        message: '通信中...',
        messageColor: '#d3d3d3',
        isDisplay: true
      });
      const result = await getQuizFormatListAPI();
      setMessage(result.message);
      setQuizFormatListoption(result.result ? (result.result as GetQuizFormatApiResponseDto[]) : []);
    })();
  }, [setMessage]);

  return { quizFormatListoption };
};
