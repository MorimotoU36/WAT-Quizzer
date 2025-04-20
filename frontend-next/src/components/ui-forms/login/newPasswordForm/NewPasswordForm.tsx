import { Button } from '@/components/ui-elements/button/Button';
import { Card } from '@/components/ui-elements/card/Card';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface NewPasswordFormProps {
  cognitoUser: CognitoUser | null;
  setShowNewPasswordForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NewPasswordForm = ({ cognitoUser, setShowNewPasswordForm }: NewPasswordFormProps) => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<String>('');

  const router = useRouter();

  const handleNewPasswordSubmit = () => {
    if (!cognitoUser) return;

    cognitoUser.completeNewPasswordChallenge(
      newPassword,
      {},
      {
        onSuccess: (result) => {
          setMessage('パスワード変更＆ログイン成功！');
          setShowNewPasswordForm(false);
          localStorage.setItem('idToken', result.getIdToken().getJwtToken());
          router.push('/');
        },
        onFailure: (err) => {
          console.error('パスワード変更失敗:', err);
          setMessage('パスワード変更失敗: ' + err.message);
        }
      }
    );
  };
  return (
    <Card attr={'padding rect-600'}>
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
