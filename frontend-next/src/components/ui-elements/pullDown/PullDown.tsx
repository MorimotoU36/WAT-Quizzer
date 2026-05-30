import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { getRandomStr } from 'quizzer-lib';
import { pullDownMenuProps } from '@/constants/pullDown';

interface PullDownProps {
  optionList: {
    value: number | string;
    label: string;
  }[];
  label?: string;
  className?: string;
  value?: number | string;
  onChange?: (e: SelectChangeEvent<number | string>) => void;
}

export const PullDown = ({ optionList, label, className, value, onChange }: PullDownProps) => {
  const selectProps = {
    className: `my-[8px] ${className || ''}`,
    labelId: `quiz-file-name-${getRandomStr()}`,
    id: `quiz-file-id-${getRandomStr()}`,
    defaultValue: -1,
    onChange,
    ...(value && {
      value
    }),
    MenuProps: pullDownMenuProps
  };

  return (
    <FormControl disabled={optionList.length <= 1 ? true : false} className="min-w-[200px]">
      <InputLabel id={`quiz-file-input-${getRandomStr()}`} className="my-[2px]">
        {label}
      </InputLabel>
      <Select {...selectProps}>
        <MenuItem value={-1} key={-1}>
          選択なし
        </MenuItem>
        {optionList.map((x) => (
          <MenuItem value={x.value} key={x.value}>
            {x.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
