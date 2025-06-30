import React, { useState } from 'react';
import { FormControl, FormGroup } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import styles from './GetWordQueryForm.module.css';
import { Card } from '@/components/ui-elements/card/Card';
import { RadioGroup } from '@/components/ui-parts/radioGroup/RadioGroup';
import { Button } from '@/components/ui-elements/button/Button';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import {
  getDateForSqlString,
  getEnglishWordTestDataAPI,
  GetEnglishWordTestDataAPIRequestDto,
  GetEnglishWordTestDataAPIResponseDto,
  PullDownOptionDto
} from 'quizzer-lib';
import { RangeSliderSection } from '@/components/ui-parts/card-contents/rangeSliderSection/RangeSliderSection';
import { Checkbox } from '@/components/ui-elements/checkBox/CheckBox';
import { englishTestTypeRadioButton } from '@/constants/contents/radioButton';

interface GetWordQueryFormProps {
  sourcelistoption: PullDownOptionDto[];
  setDisplayTestData?: React.Dispatch<React.SetStateAction<GetEnglishWordTestDataAPIResponseDto>>;
}

export const GetWordQueryForm = ({ sourcelistoption, setDisplayTestData }: GetWordQueryFormProps) => {
  const [queryOfTestData, setQueryOfTestData] = useState<GetEnglishWordTestDataAPIRequestDto>({ format: 'random' });
  const setMessage = useSetRecoilState(messageState);
  // TODO テスト形式の値の管理方法　他のファイルでプロパティ形式で管理した方が良い？ constant.tsみたいなの作って　quizzeer側にもこんなのあったよね
  const [testType, setTestType] = useState<string>('0');

  return (
    <>
      <Card attr={['through-card', 'padding-vertical']}>
        <FormGroup>
          <PullDown
            label={'出典'}
            optionList={sourcelistoption}
            onChange={(e) => {
              setQueryOfTestData({
                ...queryOfTestData,
                source: String(e.target.value)
              });
            }}
          />
          <FormControl className={styles.row}>
            サブ出典登録日時指定：
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                className={styles.datePicker}
                onChange={(newValue) => {
                  setQueryOfTestData({
                    ...queryOfTestData,
                    startDate: getDateForSqlString(newValue as Date)
                  });
                }}
              />
            </LocalizationProvider>
            〜
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                className={styles.datePicker}
                onChange={(newValue) => {
                  setQueryOfTestData({
                    ...queryOfTestData,
                    endDate: getDateForSqlString(newValue as Date)
                  });
                }}
              />
            </LocalizationProvider>
          </FormControl>
          <FormControl>
            <Checkbox
              value="only-checked"
              label="チェック済から出題"
              onChange={(e) => {
                setQueryOfTestData({
                  ...queryOfTestData,
                  checked: e.target.checked
                });
              }}
            />
          </FormControl>
          <FormControl>
            <RangeSliderSection
              sectionTitle={'正解率(%)指定'}
              setStater={(value: number[] | number) => {
                setQueryOfTestData({
                  ...queryOfTestData,
                  min_rate: Array.isArray(value) ? value[0] : value,
                  max_rate: Array.isArray(value) ? value[1] : value
                });
              }}
            />
          </FormControl>
          <FormControl>
            テスト形式：
            <RadioGroup
              radioButtonProps={englishTestTypeRadioButton}
              defaultValue={'0'}
              setQueryofQuizStater={(value: string) => {
                setTestType(value);
              }}
            />
          </FormControl>
        </FormGroup>
      </Card>
      {/* TODO API共通化した結果処理同じようなボタン２つ並ぶことになった　これコンポーネントまとめれないか？  */}
      <Button
        label={'Random Word'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await getEnglishWordTestDataAPI({
            getEnglishWordTestData: {
              ...queryOfTestData,
              format: 'random'
            }
          });
          setMessage(result.message);
          if (result.message.messageColor === 'common.black') {
            setDisplayTestData &&
              setDisplayTestData({ ...(result.result as GetEnglishWordTestDataAPIResponseDto), testType });
          }
        }}
      />
      <Button
        label={'LRU'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await getEnglishWordTestDataAPI({
            getEnglishWordTestData: {
              ...queryOfTestData,
              format: 'lru'
            }
          });
          setMessage(result.message);
          if (result.message.messageColor === 'common.black') {
            setDisplayTestData &&
              setDisplayTestData({ ...(result.result as GetEnglishWordTestDataAPIResponseDto), testType });
          }
        }}
      />
    </>
  );
};
