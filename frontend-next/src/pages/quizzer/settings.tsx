import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { PullDownOptionState } from '../../../interfaces/state';
import { Title } from '@/components/ui-elements/title/Title';
import { FileConfigSection } from '@/components/ui-forms/quizzer/settings/fileConfigSection/FileConfigSection';
import { LogConfigSection } from '@/components/ui-forms/quizzer/settings/logConfigSection/LogConfigSection';
import { messageState } from '@/atoms/Message';
import { useRecoilState } from 'recoil';
import { getQuizFileListAPI } from '@/api/quiz/getQuizFileListAPI';

type Props = {
  isMock?: boolean;
};

export default function QuizzerSettingPage({ isMock }: Props) {
  const [filelistoption, setFilelistoption] = useState<PullDownOptionState[]>([]);
  const [message, setMessage] = useRecoilState(messageState);
  const [fileName, setFileName] = useState<string>('');
  const [fileNum, setFileNum] = useState<number>(-1); // 削除する問題ファイルの番号
  const [deleteLogOfFileNum, setDeleteLogOfFileNum] = useState<number>(-1);
  const [deleteLogOfFileAlertOpen, setDeleteLogOfFileAlertOpen] = React.useState(false);

  useEffect(() => {
    !isMock && getQuizFileListAPI(setMessage, setFilelistoption);
  }, [isMock, setMessage]);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>

        <FileConfigSection
          fileName={fileName}
          deleteFileNum={fileNum}
          filelistoption={filelistoption}
          setMessage={setMessage}
          setDeleteFileNum={setFileNum}
          setFileName={setFileName}
          setFilelistoption={setFilelistoption}
        />

        <LogConfigSection
          deleteLogOfFileNum={deleteLogOfFileNum}
          deleteLogOfFileAlertOpen={deleteLogOfFileAlertOpen}
          filelistoption={filelistoption}
          setMessage={setMessage}
          setDeleteLogOfFileNum={setDeleteLogOfFileNum}
          setDeleteLogOfFileAlertOpen={setDeleteLogOfFileAlertOpen}
        />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'設定'} />
    </>
  );
}
