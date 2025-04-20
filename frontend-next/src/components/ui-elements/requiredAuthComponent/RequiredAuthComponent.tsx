import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseJwt } from 'quizzer-lib';

type Props = {
  children: React.ReactNode;
};

export default function RequiredAuthComponent({ children }: Props) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('idToken');
    if (!token) {
      router.replace('/login');
      return;
    }

    const payload = parseJwt(token);

    if (!payload || typeof payload.exp !== 'number') {
      console.warn('Invalid token structure');
      localStorage.removeItem('idToken');
      router.replace('/login');
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      console.warn('Token expired');
      localStorage.removeItem('idToken');
      router.replace('/login');
      return;
    }

    setIsAuthenticated(true);
    setChecking(false);
  }, []);

  if (checking) return <></>;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
