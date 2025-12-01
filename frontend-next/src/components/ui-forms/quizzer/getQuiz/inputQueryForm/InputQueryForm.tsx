import React, { useState } from 'react';
import { FormControl, FormGroup } from '@mui/material';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { RangeSliderSection } from '@/components/ui-parts/card-contents/rangeSliderSection/RangeSliderSection';
import { GetQuizAPIRequestDto, PullDownOptionDto } from 'quizzer-lib';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { CheckboxGroup } from '@/components/ui-parts/checkboxGroup/CheckboxGroup';
import { Checkbox } from '@/components/ui-elements/checkBox/CheckBox';
import { QuizFilePullDown } from '@/components/ui-elements/pullDown/quizFilePullDown/QuizFilePullDown';
import { useQuizFormatList } from '@/hooks/useQuizFormatList';
import { useSelectedFileChange } from '@/hooks/useSelectedFileChange';
import { MultiSelectPullDown } from '@/components/ui-elements/multiSelectPullDown/MultiSelectPullDown';

interface InputQueryFormProps {
  getQuizRequestData: GetQuizAPIRequestDto;
  setQuizRequestData: React.Dispatch<React.SetStateAction<GetQuizAPIRequestDto>>;
}

export const InputQueryForm = ({ getQuizRequestData, setQuizRequestData }: InputQueryFormProps) => {
  const [categorylistoption, setCategorylistoption] = useState<PullDownOptionDto[]>([]);
  const { quizFormatListoption } = useQuizFormatList();
  const setMessage = useSetRecoilState(messageState);

  return (
    <FormGroup className="!mt-4">
      <FormControl className="max-w-full">
        <QuizFilePullDown
          onFileChange={useSelectedFileChange({
            setMessage,
            setCategorylistoption,
            setQuizRequestData
          })}
        />
      </FormControl>
      <FormControl className="max-w-full">
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

      <FormControl className="max-w-full">
        <MultiSelectPullDown
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
