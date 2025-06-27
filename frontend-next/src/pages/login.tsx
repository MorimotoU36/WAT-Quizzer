import { useState } from 'react';
import { LoginForm } from '@/components/ui-forms/login/loginForm/LoginForm';
import { NewPasswordForm } from '@/components/ui-forms/login/newPasswordForm/NewPasswordForm';
import { Container } from '@/components/ui-elements/container/Container';

export default function LoginPage() {
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
  const [username, setUsername] = useState<string>('');

  return (
    <Container attr={['flex-center']}>
      {!showNewPasswordForm ? (
        <LoginForm setShowNewPasswordForm={setShowNewPasswordForm} username={username} setUsername={setUsername} />
      ) : (
        <NewPasswordForm username={username} />
      )}
      ;
    </Container>
  );
}
