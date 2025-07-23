import React, { useEffect, useState } from 'react';
import { Slider as MuiSlider } from '@mui/material';
import styles from './RangeSlider.module.css';

interface RangeSliderProps {
  setStater?: React.Dispatch<React.SetStateAction<number[] | number>> | ((value: number[] | number) => void);
  value?: number[];
}

export const RangeSlider = ({ setStater, value }: RangeSliderProps) => {
  const [internalValue, setInternalValue] = useState<number[] | number>(value ?? [0, 100]);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (event: Event, newValue: number[] | number) => {
    setInternalValue(newValue);
    if (setStater) {
      setStater(newValue);
    }
  };

  return (
    <>
      <MuiSlider
        value={internalValue}
        className={styles.default}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-label="range"
        aria-labelledby="range-slider"
      />
    </>
  );
};
