import React from 'react';
import { Button as MuiButton } from '@mui/material';

interface ButtonProps {
  label: string;
  size?: 'small' | 'medium' | 'large';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  variant?: 'contained' | 'outlined' | 'text';
  href?: string;
  attr?: string;
  disabled?: boolean;
  onClick?: (event: React.KeyboardEvent | React.MouseEvent) => void;
}

// CSSクラス名をTailwindクラスにマッピング
const getTailwindClasses = (attr?: string): string => {
  if (!attr) return '';

  const classMappings: { [key: string]: string } = {
    separate: 'my-5 mx-2.5',
    'button-array': 'm-2.5',
    'top-button': 'm-5 w-25 h-25',
    'no-margin': 'm-0',
    'no-border': 'border-none',
    'after-inline': 'flex-none m-2.5',
    'no-min-width': 'min-w-0',
    'margin-x-10': 'mx-2.5'
  };

  return attr
    .split(' ')
    .map((className) => classMappings[className] || '')
    .filter(Boolean)
    .join(' ');
};

export const Button = ({
  color = 'primary',
  size = 'medium',
  variant = 'outlined',
  label,
  attr,
  ...props
}: ButtonProps) => {
  const tailwindClasses = getTailwindClasses(attr);

  return (
    <>
      <MuiButton className={tailwindClasses} variant={variant} size={size} color={color} {...props}>
        {label}
      </MuiButton>
    </>
  );
};
