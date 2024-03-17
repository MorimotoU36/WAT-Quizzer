import { Layout } from '@/components/templates/layout/Layout';
import { Container } from '@mui/material';
import { DisplayWordTestState, PullDownOptionState, QueryOfGetWordState } from '../../../interfaces/state';
import { useEffect, useState } from 'react';
import { GetWordQueryForm } from '@/components/ui-forms/englishbot/testWord/getWordForm/GetWordQueryForm';
import { GetWordButtonGroup } from '@/components/ui-forms/englishbot/testWord/getWordButtonGroup/GetWordButtonGroup';
import { DisplayTestWordSection } from '@/components/ui-forms/englishbot/testWord/displayTestWordSection/DisplayTestWordSection';
import { Title } from '@/components/ui-elements/title/Title';
import { getSourceList } from '@/common/response';
import { messageState } from '@/atoms/Message';
import { useRecoilState } from 'recoil';

export default function TestWordPage() {
  const [message, setMessage] = useRecoilState(messageState);
  const [sourcelistoption, setSourcelistoption] = useState<PullDownOptionState[]>([]);
  const [queryOfGetWord, setQueryOfGetWord] = useState<QueryOfGetWordState>({});
  const [displayWordTest, setDisplayWordTest] = useState<DisplayWordTestState>({
    wordName: ''
  });

  // 出典リスト取得
  useEffect(() => {
    getSourceList(setMessage, setSourcelistoption);
  }, []);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer - englishBot"></Title>

        <GetWordQueryForm
          sourcelistoption={sourcelistoption}
          queryOfGetWordState={queryOfGetWord}
          setQueryofWordStater={setQueryOfGetWord}
        />

        <GetWordButtonGroup
          queryOfGetWordState={queryOfGetWord}
          setMessageStater={setMessage}
          setDisplayWordTest={setDisplayWordTest}
        />

        <DisplayTestWordSection
          displayWordTest={displayWordTest}
          setMessageStater={setMessage}
          setDisplayWordTestState={setDisplayWordTest}
        />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="englishBot" contents={contents()} title={'単語テスト'} />
    </>
  );
}
