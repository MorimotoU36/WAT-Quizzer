import React from 'react';
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

const tokenToTailwindClass: Record<string, string> = {
  // CSSモジュールからの移行用マッピング
  textField: 'my-1', // 3px相当には近似でmy-1(4px)
  flex: 'flex-auto',
  fullWidth: 'w-full',
  'margin-x-10': 'mx-2.5' // 10px 相当
};

export const TextField = ({ label, variant, className, type, setStater, id, key, value }: TextFieldProps) => {
  const mappedClasses = (className || []).map((token) => tokenToTailwindClass[token] ?? token).join(' ');

  const baseClasses = tokenToTailwindClass.textField;
  const mergedClassName = [baseClasses, mappedClasses].filter(Boolean).join(' ');

  return (
    <MuiTextField
      className={mergedClassName}
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
};
