import React from 'react';
import { Button } from '@/components/ui-elements/button/Button';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import {
  getImageOfQuizAPI,
  GetImageOfQuizAPIResponseDto,
  getQuizAPI,
  GetQuizAPIRequestDto,
  GetQuizApiResponseDto
} from 'quizzer-lib';

interface GetQuizButtonGroupProps {
  getQuizRequestData: GetQuizAPIRequestDto;
  getQuizResponseData: GetQuizApiResponseDto;
  setQuizResponseData?: React.Dispatch<React.SetStateAction<GetQuizApiResponseDto>>;
  setImageUrl?: React.Dispatch<React.SetStateAction<string>>;
}

export const GetQuizButtonGroup = ({
  getQuizRequestData,
  getQuizResponseData,
  setQuizResponseData,
  setImageUrl
}: GetQuizButtonGroupProps) => {
  const setMessage = useSetRecoilState(messageState);

  return (
    <>
      <Button
        label={'出題'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={async (e) => {
          setImageUrl && setImageUrl('');
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await getQuizAPI({ getQuizRequestData });
          setMessage(result.message);
          if (result.result) {
            setQuizResponseData && setQuizResponseData({ ...(result.result as GetQuizApiResponseDto) });
          }
        }}
      />
      <Button
        label={'ランダム出題'}
        attr={'button-array'}
        variant="contained"
        color="secondary"
        onClick={async (e) => {
          setImageUrl && setImageUrl('');
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await getQuizAPI({ getQuizRequestData, getQuizMethod: 'random' });
          setMessage(result.message);
          if (result.result) {
            setQuizResponseData && setQuizResponseData({ ...(result.result as GetQuizApiResponseDto) });
          }
        }}
      />
      <Button
        label={'最低正解率問出題'}
        variant="contained"
        color="secondary"
        onClick={async (e) => {
          setImageUrl && setImageUrl('');
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await getQuizAPI({ getQuizRequestData, getQuizMethod: 'worstRate' });
          setMessage(result.message);
          if (result.result) {
            setQuizResponseData && setQuizResponseData({ ...(result.result as GetQuizApiResponseDto) });
          }
        }}
      />
      <Button
        label={'最小回答数問出題'}
        attr={'button-array'}
        variant="contained"
        color="secondary"
        onClick={async (e) => {
          setImageUrl && setImageUrl('');
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await getQuizAPI({ getQuizRequestData, getQuizMethod: 'leastClear' });
          setMessage(result.message);
          if (result.result) {
            setQuizResponseData && setQuizResponseData({ ...(result.result as GetQuizApiResponseDto) });
          }
        }}
      />
      <Button
        label={'LRU問出題'}
        attr={'button-array'}
        variant="contained"
        color="secondary"
        onClick={async (e) => {
          setImageUrl && setImageUrl('');
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await getQuizAPI({ getQuizRequestData, getQuizMethod: 'LRU' });
          setMessage(result.message);
          if (result.result) {
            setQuizResponseData && setQuizResponseData({ ...(result.result as GetQuizApiResponseDto) });
          }
        }}
      />
      <Button
        label={'昨日間違えた問題'}
        attr={'button-array'}
        variant="contained"
        color="secondary"
        onClick={async (e) => {
          setImageUrl && setImageUrl('');
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await getQuizAPI({ getQuizRequestData, getQuizMethod: 'review' });
          setMessage(result.message);
          if (result.result) {
            setQuizResponseData && setQuizResponseData({ ...(result.result as GetQuizApiResponseDto) });
          }
        }}
      />
      <Button
        label={'画像表示'}
        attr={'button-array'}
        variant="contained"
        color="info"
        disabled={!getQuizResponseData.img_file}
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await getImageOfQuizAPI({
            getImageOfQuizRequestData: { fileName: getQuizResponseData.img_file || '' }
          });
          setMessage(result.message);
          const res = result.result as GetImageOfQuizAPIResponseDto;
          setImageUrl && setImageUrl(res.imageUrl);
        }}
      />
    </>
  );
};
