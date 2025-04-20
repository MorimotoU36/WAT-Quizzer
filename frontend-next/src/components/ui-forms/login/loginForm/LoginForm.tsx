import { AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button } from '@/components/ui-elements/button/Button';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { Card } from '@/components/ui-elements/card/Card';
import { FormControl, FormGroup } from '@mui/material';

interface LoginFormProps {
  setShowNewPasswordForm: React.Dispatch<React.SetStateAction<boolean>>;
  setCognitoUser: React.Dispatch<React.SetStateAction<CognitoUser | null>>;
}

const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USERPOOL_ID || '', // あなたのUser Pool ID
  ClientId: process.env.NEXT_PUBLIC_COGNITO_APPCLIENT_ID || '' // アプリクライアントID
};

export const userPool = new CognitoUserPool(poolData);

export const LoginForm = ({ setShowNewPasswordForm, setCognitoUser }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<String>('');

  const router = useRouter();

  const handleLogin = () => {
    const user = new CognitoUser({
      Username: username,
      Pool: userPool
    });

    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password
    });

    user.authenticateUser(authDetails, {
      onSuccess: (result: CognitoUserSession) => {
        setMessage('ログイン成功！');
        console.log('ID Token:', result.getIdToken().getJwtToken());
        localStorage.setItem('idToken', result.getIdToken().getJwtToken());
        router.push('/'); // トップページへ遷移
      },
      onFailure: (err) => {
        console.error('ログイン失敗:', err);
        setMessage('ログイン失敗: ' + err.message);
      },
      newPasswordRequired: () => {
        // 新しいパスワードフォーム表示
        setShowNewPasswordForm(true);
        setCognitoUser(user);
        setMessage('新しいパスワードが必要です');
      }
    });
  };

  return (
    <Card attr={'padding rect-600'}>
      <FormGroup>
        <h1>ログイン</h1>
        <FormControl>
          <TextField label={'ユーザー名'} id="username" value={username} setStater={setUsername} />
        </FormControl>
        <FormControl>
          <TextField type="password" id="password" label={'パスワード'} value={password} setStater={setPassword} />
        </FormControl>
        <FormControl>
          <Button label={'ログイン'} onClick={handleLogin} />
        </FormControl>
        <p>{message}</p>
      </FormGroup>
    </Card>
  );
};
