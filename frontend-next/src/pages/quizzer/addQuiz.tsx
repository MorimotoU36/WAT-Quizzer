import React, { useEffect, useState } from 'react';

import { get, post } from '../../common/API';
import { buttonStyle } from '../../styles/Pages';
import {
  Button,
  Card,
  Container,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs
} from '@mui/material';
import { addQuizDto } from '../../../interfaces/api/response';
import { AddQuizApiResponse, ProcessingApiReponse } from '../../../interfaces/api/response';
import { QuizFileApiResponse } from '../../../interfaces/db';
import { Layout } from '@/components/templates/layout/Layout';
import { MessageState, PullDownOptionState, QueryOfAddQuizState } from '../../../interfaces/state';
import { AddQuizLogSection } from '@/components/ui-forms/quizzer/addQuiz/addQuizLogSection/AddQuizLogSection';
import { MessageCard } from '@/components/ui-parts/messageCard/MessageCard';
import { Title } from '@/components/ui-elements/title/Title';
import { BasisTabPanel } from '@/components/ui-parts/tabpanel-patterns/addQuiz/basisTabPanel/Basis.tabpanel';
import { AppliedTabPanel } from '@/components/ui-parts/tabpanel-patterns/addQuiz/appliedTabPanel/Applied.tabpanel';
import { FourChoiceTabPanel } from '@/components/ui-parts/tabpanel-patterns/addQuiz/fourChoiceTabPanel/FourChoice.tabpanel';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { getFileList } from '@/common/response';
import { AddQuizButton } from '@/components/ui-parts/button-patterns/addQuiz/AddQuiz.button';

export default function AddQuizPage() {
  const [queryOfAddQuiz, setQueryOfAddQuiz] = useState<QueryOfAddQuizState>({
    fileNum: -1
  });
  const [message, setMessage] = useState<MessageState>({ message: '　', messageColor: 'common.black' });
  const [addLog, setAddLog] = useState<string>('');
  const [filelistoption, setFilelistoption] = useState<PullDownOptionState[]>([]);

  const [value, setValue] = React.useState(0);

  // 問題ファイルリスト取得
  useEffect(() => {
    getFileList(setMessage, setFilelistoption);
  }, []);

  const selectedFileChange = (e: SelectChangeEvent<number>) => {
    setQueryOfAddQuiz((prev) => ({
      ...prev,
      ['fileNum']: e.target.value as number
    }));
  };

  // タブ内コンテンツの設定
  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    };
  };

  // タブの切り替え
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setQueryOfAddQuiz((prev) => ({
      fileNum: queryOfAddQuiz.fileNum
    }));
  };

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>

        <MessageCard messageState={message}></MessageCard>

        <FormGroup>
          <FormControl>
            <PullDown label={'問題ファイル'} optionList={filelistoption} onChange={selectedFileChange} />
          </FormControl>

          <Card variant="outlined">
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="基礎問題" {...a11yProps(0)} />
              <Tab label="応用問題" {...a11yProps(1)} />
              <Tab label="四択問題" {...a11yProps(2)} />
            </Tabs>
            <BasisTabPanel
              value={value}
              index={0}
              queryOfAddQuizState={queryOfAddQuiz}
              setQueryofAddQuizStater={setQueryOfAddQuiz}
            />
            <AppliedTabPanel
              value={value}
              index={1}
              queryOfAddQuizState={queryOfAddQuiz}
              setQueryofAddQuizStater={setQueryOfAddQuiz}
            />
            <FourChoiceTabPanel
              value={value}
              index={2}
              queryOfAddQuizState={queryOfAddQuiz}
              setQueryofAddQuizStater={setQueryOfAddQuiz}
            />
          </Card>
        </FormGroup>

        <AddQuizButton
          value={value}
          queryOfAddQuizState={queryOfAddQuiz}
          setAddLog={setAddLog}
          setMessageStater={setMessage}
          setQueryofAddQuizStater={setQueryOfAddQuiz}
        />

        <AddQuizLogSection log={addLog} />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'問題追加'} />
    </>
  );
}
