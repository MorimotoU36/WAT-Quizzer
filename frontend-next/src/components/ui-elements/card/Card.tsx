import React, { ReactNode } from 'react';
import { Card as MuiCard, CardHeader as MuiCardHeader } from '@mui/material';
import styles from './Card.module.css';

interface CardProps {
  variant?: 'outlined' | 'elevation';
  attr?: string[];
  header?: string;
  subHeader?: string;
  children?: ReactNode;
}

export const Card = ({ variant = 'outlined', attr, header, subHeader, children }: CardProps) => {
  const classNames = attr ? attr.map((x) => styles[x] || '').join(' ') : '';

  return (
    <MuiCard variant={variant} className={classNames}>
      {(header || subHeader) && <MuiCardHeader title={header} subheader={subHeader} />}
      {children}
    </MuiCard>
  );
};
