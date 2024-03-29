import React, { useState } from 'react';

import { buttonStyle } from '../../styles/Pages';
import { Button, Card, CardHeader, Container } from '@mui/material';
import { GridRowsProp } from '@mui/x-data-grid';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { MessageState } from '../../../interfaces/state';
import { AddExampleSection } from '@/components/ui-forms/englishbot/addExample/addExampleSection/AddExampleSection';
import { SearchRelatedWordSection } from '@/components/ui-forms/englishbot/addExample/searchRelatedWordSection/SearchRelatedWordSection';
import { submitExampleSentenseAPI } from '@/common/ButtonAPI';

export type InputExampleData = {
  exampleJa?: string;
  exampleEn?: string;
  meanId?: number[];
};

export default function EnglishBotAddExamplePage() {
  const [inputExampleData, setInputExampleData] = useState<InputExampleData>({});
  const [searchResult, setSearchResult] = useState<GridRowsProp>([] as GridRowsProp);
  const [message, setMessage] = useState<MessageState>({
    message: '　',
    messageColor: 'common.black'
  });

  const contents = () => {
    return (
      <Container>
        <Title label="Add Example Sentense"></Title>

        <Card variant="outlined">
          <CardHeader title="例文追加" />
          <AddExampleSection inputExampleData={inputExampleData} setInputExampleData={setInputExampleData} />
          <SearchRelatedWordSection
            searchResult={searchResult}
            inputExampleData={inputExampleData}
            setMessage={setMessage}
            setSearchResult={setSearchResult}
            setInputExampleData={setInputExampleData}
          />
          <Button
            style={buttonStyle}
            variant="contained"
            color="primary"
            onClick={(e) => submitExampleSentenseAPI({ inputExampleData, setMessage, setInputExampleData })}
          >
            登録
          </Button>
        </Card>
      </Container>
    );
  };

  return (
    <>
      <Layout
        mode="englishBot"
        contents={contents()}
        title={'例文追加'}
        messageState={message}
        setMessageStater={setMessage}
      />
    </>
  );
}
