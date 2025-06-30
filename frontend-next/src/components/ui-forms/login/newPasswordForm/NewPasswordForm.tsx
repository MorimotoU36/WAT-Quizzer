import { Button } from '@/components/ui-elements/button/Button';
import { Card } from '@/components/ui-elements/card/Card';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { authNewPasswordSigninAPI } from 'quizzer-lib';

interface NewPasswordFormProps {
  username: string;
}

export const NewPasswordForm = ({ username }: NewPasswordFormProps) => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<String>('');

  const router = useRouter();

  const handleNewPasswordSubmit = async () => {
    if (!username || username === '') return;

    try {
      const res = await authNewPasswordSigninAPI({
        authSigninRequestData: {
          username,
          password: newPassword
        }
      });
      // TODO 型定義する
      const data = res.result as any;

      if (data.status === 'SUCCESS') {
        localStorage.setItem('idToken', data.idToken);
        localStorage.setItem('accessToken', data.accessToken);
        router.push('/');
      } else {
        setMessage('不明な応答が返されました' + data.error + ' - ' + data.message);
      }
    } catch (err: any) {
      console.error(err);
      setMessage('パスワード変更失敗: ' + err.message);
    }
  };
  return (
    <Card attr={['padding', 'rect-600']}>
      <h1>新しいパスワードでログイン</h1>
      <TextField
        type="password"
        id="newPassword"
        label={'新しいパスワード'}
        value={newPassword}
        setStater={setNewPassword}
      />
      <Button label={'パスワード変更してログイン'} onClick={handleNewPasswordSubmit} />
      <p>{message}</p>
    </Card>
  );
};
