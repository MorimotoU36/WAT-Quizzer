import React from 'react';
import { Button } from '@/components/ui-elements/button/Button';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import { GetImageOfQuizAPIResponseDto, GetQuizAPIRequestDto, GetQuizApiResponseDto } from 'quizzer-lib';
import { getQuizAPI, getImageOfQuizAPI } from '@/utils/api-wrapper';

interface QuizActionButtonProps {
  label: string;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'info' | 'error' | 'warning' | 'success';
  attr?: string;
  disabled?: boolean;
  getQuizRequestData?: GetQuizAPIRequestDto;
  getQuizMethod?: 'random' | 'worstRate' | 'leastClear' | 'LRU' | 'review' | 'todayNotAnswered';
  getQuizResponseData?: GetQuizApiResponseDto;
  setQuizResponseData?: React.Dispatch<React.SetStateAction<GetQuizApiResponseDto>>;
  setImageUrl?: React.Dispatch<React.SetStateAction<string>>;
  actionType: 'quiz' | 'image';
}

export const QuizActionButton = ({
  label,
  variant = 'contained',
  color = 'secondary',
  attr,
  disabled = false,
  getQuizRequestData,
  getQuizMethod,
  getQuizResponseData,
  setQuizResponseData,
  setImageUrl,
  actionType
}: QuizActionButtonProps) => {
  const setMessage = useSetRecoilState(messageState);

  const handleQuizAction = async () => {
    setImageUrl && setImageUrl('');
    setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });

    const result = await getQuizAPI({
      getQuizRequestData: getQuizRequestData!,
      getQuizMethod
    });

    setMessage(result.message);

    if (result.result) {
      setQuizResponseData && setQuizResponseData({ ...(result.result as GetQuizApiResponseDto) });
    }
  };

  const handleImageAction = async () => {
    setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });

    const result = await getImageOfQuizAPI({
      getImageOfQuizRequestData: { fileName: getQuizResponseData?.img_file || '' }
    });

    setMessage(result.message);
    const res = result.result as GetImageOfQuizAPIResponseDto;
    setImageUrl && setImageUrl(res.imageUrl);
  };

  const handleClick = () => {
    if (actionType === 'quiz') {
      handleQuizAction();
    } else if (actionType === 'image') {
      handleImageAction();
    }
  };

  return <Button label={label} attr={attr} variant={variant} color={color} disabled={disabled} onClick={handleClick} />;
};
