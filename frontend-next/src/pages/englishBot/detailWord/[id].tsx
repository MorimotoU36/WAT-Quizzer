import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  MenuItem,
  Modal,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  styled
} from '@mui/material';
import EnglishBotLayout from '../components/EnglishBotLayout';
import { messageBoxStyle } from '../../../styles/Pages';
import { useEffect, useState } from 'react';
import { get, getApiAndGetValue, patch } from '@/common/API';
import { EnglishWordByIdApiResponse, ProcessingApiReponse } from '../../../../../interfaces/api';
import { PartofSpeechApiResponse, SourceApiResponse, WordApiResponse } from '../../../../../interfaces/db';
import { GetStaticPropsContext } from 'next';

type EachWordPageProps = {
  id: string;
};

type wordMeanData = {
  partofspeechId: number;
  partofspeechName: string;
  wordmeanId: number;
  meanId: number;
  mean: string;
  sourceId: number;
  sourceName: string;
};

type editWordMeanData = {
  wordId: number;
  wordmeanId: number;
  partofspeechId: number;
  mean: string;
  sourceId: number;
};

const mordalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

export default function EnglishBotEachWordPage({ id }: EachWordPageProps) {
  const [wordName, setWordName] = useState<string>();
  const [meanData, setMeanData] = useState<wordMeanData[]>([]);
  const [open, setOpen] = useState(false);
  const [posList, setPosList] = useState<JSX.Element[]>([]);
  const [sourceList, setSourceList] = useState<JSX.Element[]>([]);
  const [inputEditData, setInputEditData] = useState<editWordMeanData | undefined>();
  const [message, setMessage] = useState({
    message: '　',
    messageColor: 'common.black'
  });
  const handleOpen = (x: wordMeanData) => {
    setOpen(true);
    setInputEditData({
      wordId: +id,
      wordmeanId: x.wordmeanId,
      partofspeechId: x.partofspeechId,
      mean: x.mean,
      sourceId: x.sourceId
    });
  };
  const handleClose = () => {
    setOpen(false);
    setInputEditData(undefined);
  };

  useEffect(() => {
    Promise.all([
      getPartOfSpeechList(),
      getSourceList(),
      get(
        '/english/word/' + id,
        (data: ProcessingApiReponse) => {
          if (data.status === 200) {
            const result: EnglishWordByIdApiResponse[] = data.body as EnglishWordByIdApiResponse[];
            const wordmeans: wordMeanData[] = result.map((x: EnglishWordByIdApiResponse) => {
              return {
                partofspeechId: x.partsofspeech_id,
                partofspeechName: x.partsofspeech,
                wordmeanId: x.wordmean_id,
                meanId: x.mean_id,
                mean: x.meaning,
                sourceId: x.source_id,
                sourceName: x.source_name
              };
            });
            setWordName(result[0].name || '(null)');
            setMeanData(wordmeans);
          } else {
            setMessage({
              message: 'エラー:外部APIとの連携に失敗しました',
              messageColor: 'error'
            });
          }
        },
        {}
      )
    ]);
  }, [id]);

  // 品詞リスト取得
  const getPartOfSpeechList = async () => {
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
    get('/english/partsofspeech', (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: PartofSpeechApiResponse[] = data.body as PartofSpeechApiResponse[];
        let gotPosList = [];
        for (var i = 0; i < result.length; i++) {
          gotPosList.push(
            <MenuItem value={result[i].id} key={result[i].id}>
              {result[i].name}
            </MenuItem>
          );
        }
        gotPosList.push(
          <MenuItem value={-2} key={-2}>
            {'その他'}
          </MenuItem>
        );
        setPosList(gotPosList);
        setMessage({
          message: '　',
          messageColor: 'common.black'
        });
      } else {
        setMessage({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error'
        });
      }
    });
  };

  // 出典リスト取得
  const getSourceList = async () => {
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
    get('/english/source', (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: SourceApiResponse[] = data.body as SourceApiResponse[];
        let gotSourceList = [];
        for (var i = 0; i < result.length; i++) {
          gotSourceList.push(
            <MenuItem value={result[i].id} key={result[i].id}>
              {result[i].name}
            </MenuItem>
          );
        }
        gotSourceList.push(
          <MenuItem value={-2} key={-2}>
            {'その他'}
          </MenuItem>
        );
        setSourceList(gotSourceList);
        setMessage({
          message: '　',
          messageColor: 'common.black'
        });
      } else {
        setMessage({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error'
        });
      }
    });
  };

  // 品詞プルダウン表示、「その他」だったら入力用テキストボックスを出す
  const displayPosInput = (i: number) => {
    return (
      <>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          defaultValue={inputEditData?.partofspeechId || -1}
          label="partOfSpeech"
          key={i}
          sx={{ width: 1 }}
          onChange={(e) => {
            const inputtedData = Object.assign({}, inputEditData);
            inputtedData.partofspeechId = Number(e.target.value);
            setInputEditData(inputtedData);
          }}
        >
          <MenuItem value={-1} key={-1}>
            選択なし
          </MenuItem>
          {posList}
        </Select>
      </>
    );
  };

  // 出典プルダウン表示、「その他」だったら入力用テキストボックスを出す
  const displaySourceInput = (i: number) => {
    return (
      <>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          defaultValue={inputEditData?.sourceId || -1}
          label="source"
          key={i}
          sx={{ width: 1 }}
          onChange={(e) => {
            const inputtedData = Object.assign({}, inputEditData);
            inputtedData.sourceId = Number(e.target.value);
            setInputEditData(inputtedData);
          }}
        >
          <MenuItem value={-1} key={-1}>
            選択なし
          </MenuItem>
          {sourceList}
        </Select>
      </>
    );
  };

  const editSubmit = (meanId: number) => {
    patch(
      '/english/word/' + String(inputEditData?.wordId),
      {
        wordId: inputEditData?.wordId,
        wordMeanId: inputEditData?.wordmeanId,
        meanId,
        partofspeechId: inputEditData?.partofspeechId,
        meaning: inputEditData?.mean,
        sourceId: inputEditData?.sourceId
      },
      (data: ProcessingApiReponse) => {
        if (data.status === 200 || data.status === 201) {
          setMessage({
            message: 'Success!! 編集に成功しました',
            messageColor: 'success.light'
          });
        } else {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error'
          });
        }
      }
    );
    handleClose();
  };

  const makeMeaningStack = () => {
    return (
      <Box sx={{ width: '100%' }}>
        <Stack spacing={2}>
          {meanData.map((x) => {
            return (
              // eslint-disable-next-line react/jsx-key
              <Item key={x.wordmeanId}>
                {`[${x.partofspeechName}]`}
                {x.mean}
                {'  '}
                <Button variant="outlined" onClick={(e) => handleOpen(x)}>
                  編集
                </Button>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={mordalStyle}>
                    <Typography id="modal-modal-title" variant="h4" component="h4">
                      意味編集
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                      品詞：
                      {displayPosInput(1)}
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                      意味：
                      <TextField
                        variant="outlined"
                        defaultValue={x.mean}
                        onChange={(e) => {
                          const inputtedData = Object.assign({}, inputEditData);
                          inputtedData.mean = e.target.value;
                          setInputEditData(inputtedData);
                        }}
                      />
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                      出典：
                      {displaySourceInput(3)}
                    </Typography>
                    <Button variant="contained" onClick={(e) => editSubmit(x.meanId)}>
                      更新
                    </Button>
                  </Box>
                </Modal>
              </Item>
            );
          })}
        </Stack>
      </Box>
    );
  };

  const contents = () => {
    return (
      <Container>
        <h1>Detail Word</h1>
        <Card variant="outlined" style={messageBoxStyle}>
          <CardContent>
            <Typography variant="h6" component="h6" color={message.messageColor}>
              {message.message}
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h1" component="h1" color="common.black">
          {wordName}
        </Typography>

        {makeMeaningStack()}
      </Container>
    );
  };

  return (
    <>
      <EnglishBotLayout contents={contents()} title={'各単語詳細'} />
    </>
  );
}

export async function getAllWords() {
  const words = await getApiAndGetValue('/english/word');
  return await words.json();
}

export async function getStaticPaths() {
  const words: WordApiResponse[] = (await getAllWords()) as WordApiResponse[];
  return {
    paths: Object.values(words).map((word: WordApiResponse) => {
      return {
        params: {
          id: String(word.id)
        }
      };
    }),
    fallback: false
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const id = params!.id;
  return {
    props: {
      id
    }
  };
}
