import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import styles from './PullDown.module.css';
import { getRandomStr } from 'quizzer-lib';

interface PullDownProps {
  optionList: {
    value: number | string;
    label: string;
  }[];
  label?: string;
  className?: string;
  value?: number;
  onChange?: (e: SelectChangeEvent<number>) => void;
}

export const PullDown = ({ optionList, label, className, value, onChange }: PullDownProps) => {
  const selectProps = {
    className: styles.pulldown,
    labelId: `quiz-file-name-${getRandomStr()}`,
    id: `quiz-file-id-${getRandomStr()}`,
    defaultValue: -1,
    onChange,
    ...(value && {
      value
    })
  };

  return (
    <FormControl disabled={optionList.length <= 1 ? true : false}>
      <InputLabel id={`quiz-file-input-${getRandomStr()}`} className={styles.pulldown}>
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
