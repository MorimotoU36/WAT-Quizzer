import React, { ReactNode } from 'react';

interface HeaderBarProps {
  bgColor: string;
  children?: ReactNode;
}

export const HeaderBar = ({ bgColor = '#0077B6', ...props }: HeaderBarProps) => (
  <header className="fixed top-0 w-full h-[30px] shadow-md" style={{ backgroundColor: bgColor }}>
    {props.children}
  </header>
);
