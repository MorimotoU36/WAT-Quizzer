import React, { useEffect, useState } from 'react';
import { Card, CardContent, FormGroup, Input, SelectChangeEvent, Typography } from '@mui/material';
import {
  addQuizAPI,
  AddQuizAPIRequestDto,
  AddQuizApiResponseDto,
  GetQuizFileApiResponseDto,
  getQuizFileListAPI,
  GetQuizFormatApiResponseDto,
  getQuizFormatListAPI,
  initAddQuizRequestData,
  PullDownOptionDto,
  quizFileListAPIResponseToPullDownAdapter
} from 'quizzer-lib';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { Button } from '@/components/ui-elements/button/Button';
import styles from './AddQuizForm.module.css';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { RadioGroupSection } from '@/components/ui-parts/card-contents/radioGroupSection/RadioGroupSection';

interface AddQuizFormProps {
  setAddLog: React.Dispatch<React.SetStateAction<string>>;
}

export const AddQuizForm = ({ setAddLog }: AddQuizFormProps) => {
  const [filelistoption, setFilelistoption] = useState<PullDownOptionDto[]>([]);
  const [quizFormatListoption, setQuizFormatListoption] = useState<GetQuizFormatApiResponseDto[]>([]);
  const [addQuizRequestData, setAddQuizRequestData] = useState<AddQuizAPIRequestDto>(initAddQuizRequestData);
  const setMessage = useSetRecoilState(messageState);

  // 問題ファイルリスト取得
  useEffect(() => {
    (async () => {
      setMessage({
        message: '通信中...',
        messageColor: '#d3d3d3',
        isDisplay: true
      });
      const result = await getQuizFileListAPI();
      setMessage(result.message);
      const pullDownOption = result.result
        ? quizFileListAPIResponseToPullDownAdapter(result.result as GetQuizFileApiResponseDto[])
        : [];
      setFilelistoption(pullDownOption);
    })();
  }, [setMessage]);

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

  return (
    <>
      <FormGroup>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" component="h6" className={styles.messageBox}>
              追加する問題（問題種別,問題文,正解,カテゴリ,画像ファイル名,関連基礎問題番号,解説,ダミー選択肢）
            </Typography>

            <Typography variant="h6" component="h6" className={styles.messageBox}>
              <label htmlFor="question">問題ファイル：</label>
              <PullDown
                label={'問題ファイル'}
                optionList={filelistoption}
                onChange={(e: SelectChangeEvent<number>) => {
                  setAddQuizRequestData((prev: any) => ({
                    ...prev,
                    file_num: +e.target.value
                  }));
                }}
              />
            </Typography>

            <Typography variant="h6" component="h6" className={styles.messageBox}>
              <label htmlFor="question">問題種別：</label>
              <RadioGroupSection
                sectionTitle={''}
                radioGroupProps={{
                  radioButtonProps: quizFormatListoption.map((x) => {
                    return {
                      value: String(x.id),
                      label: x.name
                    };
                  }),
                  defaultValue: '1',
                  setQueryofQuizStater: (value: string) => {
                    setAddQuizRequestData((prev: any) => ({
                      ...prev,
                      format_id: +value
                    }));
                  }
                }}
              />
            </Typography>

            <Typography variant="h6" component="h6" className={styles.messageBox}>
              <label htmlFor="question">問題文　：</label>
              <Input
                fullWidth
                maxRows={1}
                id="question"
                value={addQuizRequestData.question || ''}
                onChange={(e) => {
                  // TODO ここのany
                  setAddQuizRequestData((prev: any) => ({
                    ...prev,
                    question: e.target.value
                  }));
                }}
              />
            </Typography>

            <Typography variant="h6" component="h6" className={styles.messageBox}>
              <label htmlFor="answer">答え　　：</label>
              <Input
                fullWidth
                maxRows={1}
                id="answer"
                value={addQuizRequestData.answer || ''}
                onChange={(e) => {
                  setAddQuizRequestData((prev: any) => ({
                    ...prev,
                    answer: e.target.value
                  }));
                }}
              />
            </Typography>

            <Typography variant="h6" component="h6" className={styles.messageBox}>
              <label htmlFor="category">カテゴリ：</label>
              <Input
                fullWidth
                maxRows={1}
                id="category"
                value={addQuizRequestData.category || ''}
                onChange={(e) => {
                  setAddQuizRequestData((prev: any) => ({
                    ...prev,
                    category: e.target.value
                  }));
                }}
              />
              <p className={styles.notation}>※カテゴリはカンマ(,)区切りで書くこと</p>
            </Typography>

            <Typography variant="h6" component="h6" className={styles.messageBox}>
              <label htmlFor="imgFile">画像ファイル名：</label>
              <Input
                fullWidth
                maxRows={1}
                id="imgFile"
                value={addQuizRequestData.img_file || ''}
                onChange={(e) => {
                  setAddQuizRequestData((prev: any) => ({
                    ...prev,
                    img_file: e.target.value
                  }));
                }}
              />
            </Typography>

            <Typography variant="h6" component="h6" className={styles.messageBox}>
              <label htmlFor="relatedBasisNum">関連基礎問題番号(カンマ区切りで問題番号を指定)：</label>
              <Input
                fullWidth
                disabled={addQuizRequestData.format_id === 1}
                maxRows={1}
                id="relatedBasisNum"
                value={addQuizRequestData.matched_basic_quiz_id || ''}
                onChange={(e) => {
                  setAddQuizRequestData((prev: any) => ({
                    ...prev,
                    matched_basic_quiz_id: e.target.value
                  }));
                }}
              />
            </Typography>

            <Typography variant="h6" component="h6" className={styles.messageBox}>
              <label htmlFor="description">解説：</label>
              <Input
                fullWidth
                maxRows={1}
                id="description"
                value={addQuizRequestData.explanation || ''}
                onChange={(e) => {
                  setAddQuizRequestData((prev: any) => ({
                    ...prev,
                    explanation: e.target.value
                  }));
                }}
              />
              <p className={styles.notation}>
                ※選択肢を示したいときは正解文を<b>{'{c}'}</b>、ダミー選択肢１、２、３をそれぞれ<b>{'{d1},{d2},{d3}'}</b>
                で書くこと
              </p>
            </Typography>

            <Typography variant="h6" component="h6" className={styles.messageBox}>
              <label htmlFor="dummy1">ダミー選択肢1：</label>
              <Input
                fullWidth
                disabled={addQuizRequestData.format_id !== 3}
                maxRows={1}
                id="dummy1"
                value={addQuizRequestData.dummy1 || ''}
                onChange={(e) => {
                  setAddQuizRequestData((prev: any) => ({
                    ...prev,
                    dummy1: e.target.value
                  }));
                }}
              />
            </Typography>

            <Typography variant="h6" component="h6" className={styles.messageBox}>
              <label htmlFor="dummy2">ダミー選択肢2：</label>
              <Input
                fullWidth
                disabled={addQuizRequestData.format_id !== 3}
                maxRows={1}
                id="dummy2"
                value={addQuizRequestData.dummy2 || ''}
                onChange={(e) => {
                  setAddQuizRequestData((prev: any) => ({
                    ...prev,
                    dummy2: e.target.value
                  }));
                }}
              />
            </Typography>

            <Typography variant="h6" component="h6" className={styles.messageBox}>
              <label htmlFor="dummy3">ダミー選択肢3：</label>
              <Input
                fullWidth
                disabled={addQuizRequestData.format_id !== 3}
                maxRows={1}
                id="dummy3"
                value={addQuizRequestData.dummy3 || ''}
                onChange={(e) => {
                  setAddQuizRequestData((prev: any) => ({
                    ...prev,
                    dummy3: e.target.value
                  }));
                }}
              />
            </Typography>
          </CardContent>
        </Card>
      </FormGroup>
      <Button
        label="問題登録"
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await addQuizAPI({
            addQuizRequestData
          });
          setMessage(result.message);
          setAddLog((result.result as AddQuizApiResponseDto).log || '');
          result.message.messageColor === 'success.light' && setAddQuizRequestData(initAddQuizRequestData);
        }}
      />
    </>
  );
};
