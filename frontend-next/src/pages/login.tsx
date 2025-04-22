import { useState } from 'react';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { LoginForm } from '@/components/ui-forms/login/loginForm/LoginForm';
import { NewPasswordForm } from '@/components/ui-forms/login/newPasswordForm/NewPasswordForm';
import { Container } from '@/components/ui-elements/container/Container';

const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USERPOOL_ID || '', // あなたのUser Pool ID
  ClientId: process.env.NEXT_PUBLIC_COGNITO_APPCLIENT_ID || '' // アプリクライアントID
};

export const userPool = new CognitoUserPool(poolData);

export default function LoginPage() {
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
  const [username, setUsername] = useState<string>('');

  return (
    <Container attr="flex-center">
      {!showNewPasswordForm ? (
        <LoginForm setShowNewPasswordForm={setShowNewPasswordForm} username={username} setUsername={setUsername} />
      ) : (
        <NewPasswordForm username={username} />
      )}
      ;
    </Container>
  );
}
