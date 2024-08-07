import { Layout } from '@/components/templates/layout/Layout';
import { Container } from '@mui/material';
import { DisplayWordTestState, PullDownOptionState, QueryOfGetWordState } from '../../../interfaces/state';
import { useEffect, useState } from 'react';
import { GetWordQueryForm } from '@/components/ui-forms/englishbot/testWord/getWordForm/GetWordQueryForm';
import { GetWordButtonGroup } from '@/components/ui-forms/englishbot/testWord/getWordButtonGroup/GetWordButtonGroup';
import { DisplayTestWordSection } from '@/components/ui-forms/englishbot/testWord/displayTestWordSection/DisplayTestWordSection';
import { Title } from '@/components/ui-elements/title/Title';
import { messageState } from '@/atoms/Message';
import { useRecoilState } from 'recoil';
import { getSourceListAPI } from '@/api/englishbot/getSourceListAPI';
import { getPartOfSpeechListAPI } from '@/api/englishbot/getPartOfSpeechListAPI';

type Props = {
  isMock?: boolean;
};

export default function TestWordPage({ isMock }: Props) {
  const [message, setMessage] = useRecoilState(messageState);
  // TODO テスト用単語出題のためにposListは使ってるだけ　ほんとはテスト用単語取る時のAPIで品詞名もとるようにしてそこからとって表示したい
  const [posList, setPosList] = useState<PullDownOptionState[]>([]);
  const [sourcelistoption, setSourcelistoption] = useState<PullDownOptionState[]>([]);
  const [queryOfGetWord, setQueryOfGetWord] = useState<QueryOfGetWordState>({});
  const [displayWordTest, setDisplayWordTest] = useState<DisplayWordTestState>({
    wordName: ''
  });
  // TODO テスト形式の値の管理方法　他のファイルでプロパティ形式で管理した方が良い？ constant.tsみたいなの作って　quizzeer側にもこんなのあったよね
  const [testType, setTestType] = useState<String>('0');

  // 出典リスト取得
  useEffect(() => {
    !isMock &&
      Promise.all([getPartOfSpeechListAPI(setMessage, setPosList), getSourceListAPI(setMessage, setSourcelistoption)]);
  }, [isMock, setMessage]);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer - englishBot"></Title>

        <GetWordQueryForm
          sourcelistoption={sourcelistoption}
          queryOfGetWordState={queryOfGetWord}
          setQueryofWordStater={setQueryOfGetWord}
          setTestType={setTestType}
        />

        <GetWordButtonGroup
          queryOfGetWordState={queryOfGetWord}
          setMessageStater={setMessage}
          setDisplayWordTest={setDisplayWordTest}
        />

        <DisplayTestWordSection
          displayWordTest={displayWordTest}
          testType={testType}
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
