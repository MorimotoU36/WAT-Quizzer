import React from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { FileConfigSection } from '@/components/ui-forms/quizzer/settings/fileConfigSection/FileConfigSection';
import { LogConfigSection } from '@/components/ui-forms/quizzer/settings/logConfigSection/LogConfigSection';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import { DownloadQuizCsvSection } from '@/components/ui-forms/quizzer/settings/downloadQuizCsvSection/DownloadQuizCsvSection';
import { useQuizFileList } from '@/hooks/useQuizFileList';

export default function QuizzerSettingPage() {
  const { filelistoption } = useQuizFileList();
  const setMessage = useSetRecoilState(messageState);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>
        <FileConfigSection setMessage={setMessage} filelistoption={filelistoption} />
        <LogConfigSection filelistoption={filelistoption} setMessage={setMessage} />
        <DownloadQuizCsvSection filelistoption={filelistoption} />
      </Container>
    );
  };

  return <Layout mode="quizzer" contents={contents()} title={'設定'} />;
}
