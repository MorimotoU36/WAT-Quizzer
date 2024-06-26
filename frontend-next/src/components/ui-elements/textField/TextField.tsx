import React from 'react';
import styles from './TextField.module.css';
import { TextField as MuiTextField } from '@mui/material';

interface TextFieldProps {
  label: string;
  variant?: 'standard' | 'filled' | 'outlined';
  className?: string[];
  type?: string;
  id?: string;
  key?: string;
  value?: string;
  setStater?: React.Dispatch<React.SetStateAction<string>> | ((value: string) => void);
}

export const TextField = ({ label, variant, className, type, setStater, id, key, value }: TextFieldProps) => (
  <MuiTextField
    className={[styles.textField].concat(className ? className.map((x) => styles[x] || '') : []).join(' ')}
    variant={variant || 'outlined'}
    label={label}
    type={type || 'text'}
    onChange={(e) => {
      if (setStater) {
        setStater(e.target.value);
      }
    }}
    id={id}
    key={key}
    value={value}
  />
);
