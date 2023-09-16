import React, { useEffect, useState } from 'react';

import { get } from '../../common/API';
import EnglishBotLayout from './components/EnglishBotLayout';
import { buttonStyle, messageBoxStyle, searchedTableStyle } from '../../styles/Pages';
import { Button, Card, CardContent, Container, FormControl, FormGroup, TextField, Typography } from '@mui/material';
import { columns } from '../../../utils/englishBot/SearchWordTable';
import { DataGrid, GridRowsProp } from '@mui/x-data-grid';
import { ProcessingApiReponse, WordApiResponse } from '@/interfaces/API';

export default function EnglishBotDictionaryPage() {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<GridRowsProp>([] as GridRowsProp);
  const [message, setMessage] = useState({
    message: '　',
    messageColor: 'common.black'
  });

  const searchWord = () => {
    if (!query || query === '') {
      setMessage({ message: 'エラー:検索語句を入力して下さい', messageColor: 'error' });
      return;
    }

    setMessage({ message: '通信中...', messageColor: '#d3d3d3' });
    get(
      '/english/word/search',
      (data: ProcessingApiReponse) => {
        if (data.status === 200) {
          const result: WordApiResponse[] = data.body as WordApiResponse[];
          setSearchResult(result || []);
          setMessage({
            message: 'Success!!' + result.length + '問の問題を取得しました',
            messageColor: 'success.light'
          });
        } else {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error'
          });
        }
      },
      {
        wordName: query
      }
    );
  };

  const contents = () => {
    return (
      <Container>
        <h1>Dictionary</h1>
        <Card variant="outlined" style={messageBoxStyle}>
          <CardContent>
            <Typography variant="h6" component="h6" color={message.messageColor}>
              {message.message}
            </Typography>
          </CardContent>
        </Card>

        <FormGroup>
          <FormControl>
            <TextField
              label="単語名検索"
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
          </FormControl>
        </FormGroup>

        <Button style={buttonStyle} variant="contained" color="primary" onClick={(e) => searchWord()}>
          検索
        </Button>

        <div style={searchedTableStyle}>
          <DataGrid
            rows={searchResult}
            columns={columns}
            pageSizeOptions={[15]}
            //checkboxSelection
            disableRowSelectionOnClick
            //onRowSelectionModelChange={(selectionModel, details) => registerCheckedIdList(selectionModel, details)}
          />
        </div>
      </Container>
    );
  };

  return (
    <>
      <EnglishBotLayout contents={contents()} title={'辞書'} />
    </>
  );
}
