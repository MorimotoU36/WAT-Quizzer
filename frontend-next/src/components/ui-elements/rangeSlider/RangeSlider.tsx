import React, { useState } from 'react';
import { Slider as MuiSlider } from '@mui/material';
import styles from './RangeSlider.module.css';

interface RangeSliderProps {
  setStater?: React.Dispatch<React.SetStateAction<number[] | number>> | ((value: number[] | number) => void);
}

export const RangeSlider = ({ setStater }: RangeSliderProps) => {
  const [value, setValue] = useState<number[] | number>([0, 100]);

  const handleChange = (event: Event, newValue: number[] | number) => {
    setValue(newValue);
    if (setStater) {
      setStater(newValue);
    }
  };

  return (
    <>
      <MuiSlider
        value={value}
        className={styles.default}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-label="range"
        aria-labelledby="range-slider"
      />
    </>
  );
};
