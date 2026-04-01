import React, { useState } from 'react';
import { FormControl, FormGroup, SelectChangeEvent } from '@mui/material';
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
  const [categoryResetKey, setCategoryResetKey] = useState(0);
  const { quizFormatListoption } = useQuizFormatList();
  const setMessage = useSetRecoilState(messageState);

  const selectedFileChangeHandler = useSelectedFileChange({
    setMessage,
    setCategorylistoption,
    setQuizRequestData
  });

  const handleFileChange = (e: SelectChangeEvent<number | string>) => {
    selectedFileChangeHandler(e);
    setQuizRequestData((prev) => ({
      ...prev,
      quiz_num: 0,
      keyword: '',
      category: ''
    }));
    setCategoryResetKey((prev) => prev + 1);
  };

  return (
    <FormGroup className="!mt-4">
      <FormControl className="max-w-full">
        <QuizFilePullDown onFileChange={handleFileChange} />
      </FormControl>
      <FormControl className="max-w-full">
        <TextField
          label="問題番号"
          value={(getQuizRequestData.quiz_num ?? 0) > 0 ? String(getQuizRequestData.quiz_num) : ''}
          setStater={(value: string) => {
            setQuizRequestData({
              ...getQuizRequestData,
              quiz_num: +value
            });
          }}
        />
      </FormControl>

      <FormControl className="max-w-full">
        <TextField
          label="キーワード"
          value={getQuizRequestData.keyword || ''}
          setStater={(value: string) => {
            setQuizRequestData({
              ...getQuizRequestData,
              keyword: value
            });
          }}
        />
      </FormControl>

      <FormControl className="max-w-full">
        <MultiSelectPullDown
          key={categoryResetKey}
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

      <FormControl className="!block">
        <div className="flex flex-row items-start gap-4 flex-nowrap">
          <div className="flex-shrink-0 !inline-flex">
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
          </div>
          <div className="flex-shrink-0 flex items-center">
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
          </div>
        </div>
      </FormControl>
    </FormGroup>
  );
};
