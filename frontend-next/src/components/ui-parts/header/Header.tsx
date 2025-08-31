import React from 'react';

import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { HeaderBar } from '../../ui-elements/headerBar/HeaderBar';

interface HeaderProps {
  bgColor: string;
  subTitle?: string;
  onClick?: (event: React.KeyboardEvent<Element> | React.MouseEvent<Element, MouseEvent>) => void;
}

export const Header = ({ bgColor = '#0077B6', subTitle, onClick }: HeaderProps) => (
  <HeaderBar bgColor={bgColor}>
    <span className="text-white font-bold leading-[30px]">
      WAT Quizzer
      {subTitle && <span className="text-white font-bold leading-[30px]">{' - ' + subTitle}</span>}
    </span>
    {onClick ? (
      <span className="absolute right-2.5 leading-[30px]">
        <IconButton onClick={onClick} size="small" aria-label="Side Bar">
          <MenuIcon style={{ color: 'white' }} />
        </IconButton>
      </span>
    ) : (
      <></>
    )}
  </HeaderBar>
);
