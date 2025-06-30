import React, { ReactNode } from 'react';
import { Container as MuiContainer } from '@mui/material';
import styles from './Container.module.css';

interface ContainerProps {
  attr?: string[];
  children?: ReactNode;
}

export const Container = ({ attr = [], children }: ContainerProps) => {
  return <MuiContainer className={attr.map((x) => styles[x] || '').join(' ')}>{children}</MuiContainer>;
};
