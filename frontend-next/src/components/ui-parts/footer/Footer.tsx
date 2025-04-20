import React from 'react';

import styles from './Footer.module.css';
import { FooterBar } from '@/components/ui-elements/footerBar/FooterBar';
import { Button } from '@/components/ui-elements/button/Button';
import { useRouter } from 'next/router';

interface FooterProps {
  bgColor: string;
  topHref: string;
}

export const Footer = ({ bgColor = '#0077B6', topHref }: FooterProps) => {
  const router = useRouter();

  return (
    <FooterBar bgColor={bgColor}>
      <span className={styles.left}>
        <Button attr="no-margin no-border" size="small" color="inherit" href={topHref} label="トップ" />
        <Button
          attr="no-margin no-border"
          size="small"
          color="inherit"
          onClick={(e) => {
            // TODO 別関数にして別ファイルに置く？
            localStorage.removeItem('idToken');
            localStorage.removeItem('accessToken');
            router.push('/login');
          }}
          label="ログアウト"
        />
      </span>
      <span className={styles.right}>©️ Tatsuroh Wakasugi</span>
    </FooterBar>
  );
};
