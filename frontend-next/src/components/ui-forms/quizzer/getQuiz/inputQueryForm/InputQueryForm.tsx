import React, { useState } from 'react';
import { FormControl, FormGroup, SelectChangeEvent } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { RangeSliderSection } from '@/components/ui-parts/card-contents/rangeSliderSection/RangeSliderSection';
import { GetQuizAPIRequestDto, PullDownOptionDto } from 'quizzer-lib';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { CheckboxGroup } from '@/components/ui-parts/checkboxGroup/CheckboxGroup';
import { Checkbox } from '@/components/ui-elements/checkBox/CheckBox';
import { QuizFilePullDown } from '@/components/ui-elements/pullDown/quizFilePullDown/QuizFilePullDown';
import { useQuizFormatList } from '@/hooks/useQuizFormatList';
import { getCategoryListOptions } from '@/utils/getCategoryListOptions';

interface InputQueryFormProps {
  getQuizRequestData: GetQuizAPIRequestDto;
  setQuizRequestData: React.Dispatch<React.SetStateAction<GetQuizAPIRequestDto>>;
}

export const InputQueryForm = ({ getQuizRequestData, setQuizRequestData }: InputQueryFormProps) => {
  const [categorylistoption, setCategorylistoption] = useState<PullDownOptionDto[]>([]);
  const { quizFormatListoption } = useQuizFormatList();
  const setMessage = useSetRecoilState(messageState);

  const selectedFileChange = (e: SelectChangeEvent<number>) => {
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3',
      isDisplay: true
    });
    setQuizRequestData({
      ...getQuizRequestData,
      file_num: +e.target.value
    });

    // カテゴリリスト取得
    (async () => {
      const { pullDownOption, message } = await getCategoryListOptions(String(e.target.value));
      setMessage(message);
      setCategorylistoption(pullDownOption);
    })();
  };

  return (
    <FormGroup>
      <QuizFilePullDown onFileChange={selectedFileChange} />
      <FormControl>
        <TextField
          label="問題番号"
          setStater={(value: string) => {
            setQuizRequestData({
              ...getQuizRequestData,
              quiz_num: +value
            });
          }}
        />
      </FormControl>

      <FormControl>
        <PullDown
          label={'カテゴリ'}
          optionList={categorylistoption}
          onChange={(e) => {
            setQuizRequestData({
              ...getQuizRequestData,
              category: String(e.target.value)
            });
          }}
        />
      </FormControl>

      <FormControl>
        <RangeSliderSection
          sectionTitle={'正解率(%)指定'}
          setStater={(value: number[] | number) => {
            setQuizRequestData({
              ...getQuizRequestData,
              min_rate: Array.isArray(value) ? value[0] : value,
              max_rate: Array.isArray(value) ? value[1] : value
            });
          }}
        />
      </FormControl>

      <FormControl>
        <CheckboxGroup
          checkboxProps={quizFormatListoption.map((x) => {
            return {
              value: String(x.id),
              label: x.name
            };
          })}
          setQueryofQuizStater={(checkBoxValue, checked) => {
            setQuizRequestData({
              ...getQuizRequestData,
              format_id: {
                ...getQuizRequestData.format_id,
                [checkBoxValue]: checked
              }
            });
          }}
          label={'問題種別'}
        />
      </FormControl>

      <FormControl>
        <Checkbox
          value="only-checked"
          label="チェック済から出題"
          onChange={(e) => {
            setQuizRequestData({
              ...getQuizRequestData,
              checked: e.target.checked
            });
          }}
        />
      </FormControl>
    </FormGroup>
  );
};
