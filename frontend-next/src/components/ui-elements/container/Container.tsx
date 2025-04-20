import React, { ReactNode } from 'react';
import { Container as MuiContainer } from '@mui/material';
import styles from './Container.module.css';

interface ContainerProps {
  attr?: string;
  children?: ReactNode;
}

// TODO attr みたいなクラスの指定方法。他のコンポーネントもだけどなんかわかりにくい。string配列形式の方が良さそう
export const Container = ({ ...props }: ContainerProps) => {
  return (
    <>
      <MuiContainer className={(props.attr ? props.attr.split(' ').map((x) => styles[x] || '') : []).join(' ')}>
        {props.children}
      </MuiContainer>
    </>
  );
};
