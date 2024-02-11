import React, { useEffect, useState } from 'react';
import { del, patch, post } from '../../common/API';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  SelectChangeEvent,
  TextField
} from '@mui/material';
import { getRandomStr } from '../../../lib/str';
import { ProcessingApiReponse } from '../../../interfaces/api/response';
import { Layout } from '@/components/templates/layout/Layout';
import { MessageState, PullDownOptionState } from '../../../interfaces/state';
import { Title } from '@/components/ui-elements/title/Title';
import { getFileList } from '@/common/response';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { AddFileSection } from '@/components/ui-forms/quizzer/settings/addFileSection/AddFileSection';

export default function SelectQuizPage() {
  const [filelistoption, setFilelistoption] = useState<PullDownOptionState[]>([]);
  const [message, setMessage] = useState<MessageState>({
    message: '　',
    messageColor: 'common.black',
    isDisplay: false
  });
  const [fileName, setFileName] = useState<string>('');
  const [file_num, setFileNum] = useState<number>(-1);
  const [deleteQuizFileNum, setDeleteQuizFileNum] = useState<number>(-1);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [deleteQuizFileAlertOpen, setDeleteQuizFileAlertOpen] = React.useState(false);

  useEffect(() => {
    getFileList(setMessage, setFilelistoption);
  }, []);

  const addFile = () => {
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3',
      isDisplay: true
    });
    post(
      '/quiz/file',
      {
        file_name: getRandomStr(),
        file_nickname: fileName
      },
      (data: ProcessingApiReponse) => {
        if (data.status === 200 || data.status === 201) {
          setMessage({
            message: `新規ファイル「${fileName}」を追加しました`,
            messageColor: 'success.light',
            isDisplay: true
          });
        } else {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error',
            isDisplay: true
          });
        }
      }
    );
    getFileList(setMessage, setFilelistoption);
  };

  const cardStyle = {
    margin: '10px 0'
  };

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

  const selectedFileChange = (e: SelectChangeEvent<number>) => {
    setFileNum(+e.target.value);
  };

  const handleClickOpen = () => {
    setAlertOpen(true);
  };

  const handleClose = () => {
    setAlertOpen(false);
  };

  // ファイルと問題削除
  const deleteFile = () => {
    handleClose();

    if (file_num === -1) {
      setMessage({
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error',
        isDisplay: true
      });
      return;
    }

    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3',
      isDisplay: true
    });
    del(
      '/quiz/file',
      {
        file_id: file_num
      },
      (data: ProcessingApiReponse) => {
        if (data.status === 200 || data.status === 201) {
          setMessage({
            message: `ファイルを削除しました(id:${file_num})`,
            messageColor: 'success.light',
            isDisplay: true
          });
        } else {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error',
            isDisplay: true
          });
        }
      }
    );
    setFileNum(-1);
  };

  // 指定ファイルのこれまでの回答データ削除
  const deleteAnswerData = () => {
    setDeleteQuizFileAlertOpen(false);

    if (deleteQuizFileNum === -1) {
      setMessage({
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error',
        isDisplay: true
      });
      return;
    }

    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3',
      isDisplay: true
    });
    patch(
      '/quiz/answer_log/file',
      {
        file_id: deleteQuizFileNum
      },
      (data: ProcessingApiReponse) => {
        if (data.status === 200 || data.status === 201) {
          setMessage({
            message: `回答ログを削除しました(id:${deleteQuizFileNum})`,
            messageColor: 'success.light',
            isDisplay: true
          });
        } else {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error',
            isDisplay: true
          });
        }
      }
    );

    setDeleteQuizFileNum(-1);
  };

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>

        <Card variant="outlined" style={cardStyle}>
          <CardHeader title="問題ファイル" />
          <CardContent>
            <Card variant="outlined">
              <AddFileSection
                fileName={fileName}
                setMessage={setMessage}
                setFileName={setFileName}
                setFilelistoption={setFilelistoption}
              />
              <CardHeader subheader="ファイル削除" />
              <CardContent style={cardContentStyle}>
                <PullDown label={'問題ファイル'} optionList={filelistoption} onChange={selectedFileChange} />
                <Button variant="contained" style={buttonAfterInputTextStyle} onClick={(e) => handleClickOpen()}>
                  削除
                </Button>
                <Dialog
                  open={alertOpen}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">本当に削除しますか？</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      指定ファイルだけでなく、ファイルの問題全ても同時に削除されます。
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} variant="outlined">
                      キャンセル
                    </Button>
                    <Button
                      onClick={(e) => {
                        deleteFile();
                      }}
                      variant="contained"
                      autoFocus
                    >
                      削除
                    </Button>
                  </DialogActions>
                </Dialog>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card variant="outlined" style={cardStyle}>
          <CardHeader title="解答データ削除" />
          <CardContent>
            <Card variant="outlined">
              <CardHeader subheader="ファイル新規追加" />
              <CardContent style={cardContentStyle}>
                <PullDown
                  label={'問題ファイル'}
                  optionList={filelistoption}
                  onChange={(e) => {
                    setDeleteQuizFileNum(+e.target.value);
                  }}
                />
                <Button
                  variant="contained"
                  style={buttonAfterInputTextStyle}
                  onClick={(e) => setDeleteQuizFileAlertOpen(true)}
                >
                  削除
                </Button>
                <Dialog
                  open={deleteQuizFileAlertOpen}
                  onClose={(e) => setDeleteQuizFileAlertOpen(false)}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">本当に削除しますか？</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      指定ファイルのこれまでの回答データが削除されます。
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={(e) => setDeleteQuizFileAlertOpen(false)} variant="outlined">
                      キャンセル
                    </Button>
                    <Button
                      onClick={(e) => {
                        deleteAnswerData();
                      }}
                      variant="contained"
                      autoFocus
                    >
                      削除
                    </Button>
                  </DialogActions>
                </Dialog>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </Container>
    );
  };

  return (
    <>
      <Layout
        mode="quizzer"
        contents={contents()}
        title={'設定'}
        messageState={message}
        setMessageStater={setMessage}
      />
    </>
  );
}
