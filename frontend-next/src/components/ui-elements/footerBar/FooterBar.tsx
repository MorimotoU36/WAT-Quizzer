import React, { ReactNode } from 'react';

interface FooterBarProps {
  bgColor: string;
  children?: ReactNode;
}

export const FooterBar = ({ bgColor = '#0077B6', ...props }: FooterBarProps) => (
  <footer
    className="fixed text-white bottom-[0px] w-full h-[32px] mt-[4px] shadow-md"
    style={{ backgroundColor: bgColor }}
  >
    {props.children}
  </footer>
);
