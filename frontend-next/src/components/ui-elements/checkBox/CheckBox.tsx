import { FormControlLabel, Checkbox as MuiCheckbox } from '@mui/material';

export interface CheckboxProps {
  value: string;
  label: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  defaultChecked?: boolean;
}

export const Checkbox = ({ value, label, onChange, required, disabled, defaultChecked }: CheckboxProps) => {
  return (
    <>
      <FormControlLabel
        value={value}
        control={
          <MuiCheckbox onChange={onChange} required={required} disabled={disabled} defaultChecked={defaultChecked} />
        }
        label={label}
      />
    </>
  );
};
