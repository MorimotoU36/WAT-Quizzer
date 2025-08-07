import React, { ReactNode } from 'react';

interface FooterBarProps {
  bgColor: string;
  children?: ReactNode;
}

export const FooterBar = ({ bgColor = '#0077B6', ...props }: FooterBarProps) => (
  <footer className="fixed bottom-0 w-full h-8 text-white mt-1" style={{ backgroundColor: bgColor }}>
    {props.children}
  </footer>
);
