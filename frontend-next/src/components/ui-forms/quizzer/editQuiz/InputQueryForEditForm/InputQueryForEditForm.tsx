import React, { useEffect, useState } from 'react';
import { FormControl, FormGroup, SelectChangeEvent } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { Button } from '@/components/ui-elements/button/Button';
import {
  EditQuizAPIRequestDto,
  getQuizAPI,
  GetQuizAPIRequestDto,
  GetQuizApiResponseDto,
  getQuizAPIResponseToEditQuizAPIRequestAdapter,
  GetQuizFormatApiResponseDto,
  getQuizFormatListAPI,
  initEditQuizRequestData,
  initGetQuizRequestData
} from 'quizzer-lib';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { useRouter } from 'next/router';
import { useQuizFileList } from '@/hooks/useQuizFileList';

interface InputQueryForEditFormProps {
  setEditQuizRequestData: React.Dispatch<React.SetStateAction<EditQuizAPIRequestDto>>;
}

export const InputQueryForEditForm = ({ setEditQuizRequestData }: InputQueryForEditFormProps) => {
  const { filelistoption } = useQuizFileList();
  const [quizFormatListoption, setQuizFormatListoption] = useState<GetQuizFormatApiResponseDto[]>([]);
  const [getQuizRequestData, setQuizRequestData] = useState<GetQuizAPIRequestDto>(initGetQuizRequestData);
  const setMessage = useSetRecoilState(messageState);

  // 問題形式リスト取得
  useEffect(() => {
    // TODO これ　別関数にしたい
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

  // queryParam idが設定されていた場合、その問題IDの値を初期値設定する
  // TODO できれば前画面から問題の値を持って来させるようにしたい
  const router = useRouter();
  useEffect(() => {
    const { file_num, quiz_num } = router.query;
    if (file_num && quiz_num && !isNaN(+file_num) && !isNaN(+quiz_num)) {
      setQuizRequestData({
        file_num: +file_num,
        quiz_num: +quiz_num
      });
      // TODO  以下は問題取得ボタン押した時と処理同じなので別関数にまとめたい
      (async () => {
        setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
        const result = await getQuizAPI({
          getQuizRequestData: {
            file_num: +file_num,
            quiz_num: +quiz_num
          }
        });
        setMessage(result.message);
        if (result.result) {
          setEditQuizRequestData({
            ...getQuizAPIResponseToEditQuizAPIRequestAdapter(result.result as GetQuizApiResponseDto)
          });
        } else {
          setEditQuizRequestData(initEditQuizRequestData);
        }
      })();
    }
  }, [router, setEditQuizRequestData, setMessage]);

  const selectedFileChange = (e: SelectChangeEvent<number>) => {
    setQuizRequestData({
      ...getQuizRequestData,
      file_num: +e.target.value
    });
  };

  return (
    <>
      <FormGroup>
        <PullDown
          label={'問題ファイル'}
          optionList={filelistoption}
          onChange={selectedFileChange}
          value={getQuizRequestData.file_num}
        />
        <FormControl>
          <TextField
            label="問題番号"
            value={
              getQuizRequestData.quiz_num && !isNaN(getQuizRequestData.quiz_num) && getQuizRequestData.quiz_num !== -1
                ? String(getQuizRequestData.quiz_num)
                : ''
            }
            setStater={(value: string) => {
              setQuizRequestData({
                ...getQuizRequestData,
                quiz_num: +value
              });
            }}
          />
        </FormControl>
      </FormGroup>

      <Button
        label={'問題取得'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await getQuizAPI({ getQuizRequestData });
          setMessage(result.message);
          if (result.result) {
            setEditQuizRequestData({
              ...getQuizAPIResponseToEditQuizAPIRequestAdapter(result.result as GetQuizApiResponseDto)
            });
          } else {
            setEditQuizRequestData(initEditQuizRequestData);
          }
        }}
      />
    </>
  );
};
