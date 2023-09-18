import React, { useState } from 'react';

import EnglishBotLayout from './components/EnglishBotLayout';
import { buttonStyle, messageBoxStyle, searchedTableStyle } from '../../styles/Pages';
import { Button, Card, CardContent, CardHeader, Container, TextField, Typography } from '@mui/material';
import { get, post } from '@/common/API';
import { DataGrid, GridRowSelectionModel, GridRowsProp } from '@mui/x-data-grid';
import { meanColumns } from '../../../utils/englishBot/SearchWordTable';
import { EnglishWordByNameApiResponse, ProcessingApiReponse } from '../../../../interfaces/api';

const cardContentStyle = {
  display: 'flex',
  width: '100%'
};

const inputTextBeforeButtonStyle = {
  flex: 'auto'
};

const buttonAfterInputTextStyle = {
  flex: 'none',
  margin: '10px'
};

type InputExampleData = {
  exampleJa?: string;
  exampleEn?: string;
  meanId?: number[];
};

export default function EnglishBotAddExamplePage() {
  const [inputExampleData, setInputExampleData] = useState<InputExampleData>({});
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
      '/english/word/byname',
      (data: ProcessingApiReponse) => {
        if (data.status === 200) {
          const result: EnglishWordByNameApiResponse[] = data.body as EnglishWordByNameApiResponse[];
          setSearchResult(result || []);
          setMessage({
            message: 'Success!!取得しました',
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
        name: query
      }
    );
  };

  // チェックした問題のIDをステートに登録
  const registerCheckedIdList = (selectionModel: GridRowSelectionModel) => {
    const copyInputData = Object.assign({}, inputExampleData);
    copyInputData.meanId = selectionModel as number[];
    setInputExampleData(copyInputData);
  };

  // 例文データ登録
  const submitExampleData = () => {
    console.log(`now state: ${JSON.stringify(inputExampleData)}`);

    if (!inputExampleData || !inputExampleData.exampleEn || inputExampleData.exampleEn === '') {
      setMessage({
        message: 'エラー:例文(英文)が入力されていません',
        messageColor: 'error'
      });
      return;
    } else if (!inputExampleData.exampleJa || inputExampleData.exampleJa === '') {
      setMessage({
        message: 'エラー:例文(和文)が入力されていません',
        messageColor: 'error'
      });
      return;
    } else if (!inputExampleData.meanId || inputExampleData.meanId.length === 0) {
      setMessage({
        message: 'エラー:単語または意味へのチェック指定がありません',
        messageColor: 'error'
      });
      return;
    }

    setMessage({ message: '通信中...', messageColor: '#d3d3d3' });
    post(
      '/english/example',
      {
        exampleEn: inputExampleData.exampleEn,
        exampleJa: inputExampleData.exampleJa,
        meanId: inputExampleData.meanId
      },
      (data: ProcessingApiReponse) => {
        if (data.status === 200 || data.status === 201) {
          setMessage({
            message: '例文を登録しました',
            messageColor: 'success.light'
          });
          setInputExampleData({});
          setQuery('');
        } else {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error'
          });
        }
      }
    );
  };

  const contents = () => {
    return (
      <Container>
        <h1>Add Example Sentense</h1>

        <Card variant="outlined" style={messageBoxStyle}>
          <CardContent>
            <Typography variant="h6" component="h6" color={message.messageColor}>
              {message.message}
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardHeader title="例文追加" />
          <CardContent>
            <Card variant="outlined">
              <CardHeader subheader="例文(英文)" />
              <CardContent style={cardContentStyle}>
                <TextField
                  label="例文(英語)"
                  variant="outlined"
                  onChange={(e) => {
                    const copyInputData = Object.assign({}, inputExampleData);
                    copyInputData.exampleEn = e.target.value;
                    setInputExampleData(copyInputData);
                  }}
                  style={inputTextBeforeButtonStyle}
                />
              </CardContent>
              <CardHeader subheader="例文(和訳)" />
              <CardContent style={cardContentStyle}>
                <TextField
                  label="例文(和訳)"
                  variant="outlined"
                  onChange={(e) => {
                    const copyInputData = Object.assign({}, inputExampleData);
                    copyInputData.exampleJa = e.target.value;
                    setInputExampleData(copyInputData);
                  }}
                  style={inputTextBeforeButtonStyle}
                />
              </CardContent>
            </Card>
          </CardContent>

          <CardContent>
            <Card variant="outlined">
              <CardHeader subheader="関連付け単語検索" />
              <CardContent style={cardContentStyle}>
                <TextField
                  label="単語検索(完全一致)"
                  variant="outlined"
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                  style={inputTextBeforeButtonStyle}
                />
                <Button variant="contained" style={buttonAfterInputTextStyle} onClick={(e) => searchWord()}>
                  検索
                </Button>
              </CardContent>

              <CardContent style={cardContentStyle}>
                <div style={searchedTableStyle}>
                  <DataGrid
                    rows={searchResult}
                    columns={meanColumns}
                    pageSizeOptions={[15]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    onRowSelectionModelChange={(selectionModel, details) => registerCheckedIdList(selectionModel)}
                  />
                </div>
              </CardContent>

              <Button style={buttonStyle} variant="contained" color="primary" onClick={(e) => submitExampleData()}>
                登録
              </Button>
            </Card>
          </CardContent>
        </Card>
      </Container>
    );
  };

  return (
    <>
      <EnglishBotLayout contents={contents()} title={'例文追加'} />
    </>
  );
}
