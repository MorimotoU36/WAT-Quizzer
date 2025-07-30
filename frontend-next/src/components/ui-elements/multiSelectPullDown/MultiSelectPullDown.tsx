import React from 'react';
import { Checkbox, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
import styles from '../pullDown/PullDown.module.css';
import { getRandomStr } from 'quizzer-lib';

interface MultiSelectPullDownProps {
  optionList: {
    value: number | string;
    label: string;
  }[];
  label?: string;
  className?: string;
  value?: number | string;
  onChange?: (e: SelectChangeEvent<string[]>) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
      //width: 250
    }
  }
};

export const MultiSelectPullDown = ({ optionList, label, className, value, onChange }: MultiSelectPullDownProps) => {
  const [selectedValue, setSelectedValue] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof selectedValue>) => {
    const {
      target: { value }
    } = event;
    setSelectedValue(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
    onChange && onChange(event);
  };

  const selectProps = {
    className: styles.pulldown,
    labelId: `quiz-file-name-${getRandomStr()}`,
    id: `quiz-file-id-${getRandomStr()}`,
    value: selectedValue,
    onChange: handleChange,
    MenuProps
  };

  return (
    <FormControl disabled={optionList.length <= 1 ? true : false}>
      <InputLabel id={`quiz-file-input-${getRandomStr()}`} className={styles.pulldown}>
        {label}
      </InputLabel>
      <Select
        {...selectProps}
        multiple
        input={<OutlinedInput label="Tag" />}
        renderValue={(selected) => String(selected)}
      >
        {optionList.map((x) => (
          <MenuItem value={x.value} key={x.value}>
            <Checkbox checked={selectedValue.includes(String(x.value))} />
            {x.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
