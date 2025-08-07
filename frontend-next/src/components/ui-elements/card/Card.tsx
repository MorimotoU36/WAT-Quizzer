import React, { ReactNode } from 'react';
import { Card as MuiCard, CardHeader as MuiCardHeader } from '@mui/material';

interface CardProps {
  variant?: 'outlined' | 'elevation';
  attr?: string[];
  header?: string;
  subHeader?: string;
  children?: ReactNode;
}

export const Card = ({ variant = 'outlined', attr, header, subHeader, children }: CardProps) => {
  // attrの値とtailwindクラスの対応表
  const tailwindMap: { [key: string]: string } = {
    'message-card': 'my-2.5 mb-5 border-none',
    'silver-card': 'bg-gray-400 mb-5',
    'through-card': 'bg-transparent',
    'square-200': 'w-[200px] h-[200px]',
    'square-300': 'w-[300px] h-[300px]',
    'square-400': 'w-[400px] h-[400px]',
    'rect-400': 'w-[400px] h-[200px]',
    'rect-straight-400': 'w-[200px] h-[400px]',
    'rect-600': 'w-[600px] h-[300px]',
    auto: 'w-auto h-auto',
    'margin-vertical': 'my-0.5',
    padding: 'p-0.5',
    'padding-vertical': 'py-1 px-0.5'
  };
  const classNames = attr ? attr.map((x) => tailwindMap[x] || '').join(' ') : '';

  return (
    <MuiCard variant={variant} className={classNames}>
      {(header || subHeader) && <MuiCardHeader title={header} subheader={subHeader} />}
      {children}
    </MuiCard>
  );
};
