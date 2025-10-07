'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseJwt } from 'quizzer-lib';
import { isMockMode } from '@/utils/api-wrapper';

type Props = {
  children: React.ReactNode;
};

export default function RequiredAuthComponent({ children }: Props) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // モック環境では認証チェックをスキップ
    if (isMockMode()) {
      setIsAuthenticated(true);
      setChecking(false);
      return;
    }

    const idToken = localStorage.getItem('idToken');
    const accessToken = localStorage.getItem('accessToken');
    if (!idToken || !accessToken) {
      router.replace('/login');
      return;
    }

    const idTokenPayload = parseJwt(idToken);
    const accessTokenPayload = parseJwt(accessToken);

    if (
      !idTokenPayload ||
      typeof idTokenPayload.exp !== 'number' ||
      !accessTokenPayload ||
      typeof accessTokenPayload.exp !== 'number'
    ) {
      console.warn('Invalid token structure');
      localStorage.removeItem('idToken');
      localStorage.removeItem('accessToken');
      router.replace('/login');
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    if (idTokenPayload.exp < now || accessTokenPayload.exp < now) {
      console.warn('idToken expired');
      localStorage.removeItem('idToken');
      localStorage.removeItem('accessToken');
      router.replace('/login');
      return;
    }

    setIsAuthenticated(true);
    setChecking(false);
  });

  if (checking) return <></>;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
