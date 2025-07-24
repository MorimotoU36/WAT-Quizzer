import React from 'react';
import { ToggleButtonGroup, ToggleButton as MuiToggleButton } from '@mui/material';

interface ToggleButtonProps {
  alignment: string;
  setAlignment: React.Dispatch<React.SetStateAction<string>>;
  buttonValues: string[];
}

export const ToggleButton = ({ alignment, setAlignment, buttonValues }: ToggleButtonProps) => {
  const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    setAlignment(newAlignment);
  };
  return (
    <ToggleButtonGroup color="primary" value={alignment} exclusive onChange={handleChange} aria-label="Platform">
      {buttonValues.map((value) => {
        return (
          <MuiToggleButton key={value} value={value}>
            {value}
          </MuiToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
};
