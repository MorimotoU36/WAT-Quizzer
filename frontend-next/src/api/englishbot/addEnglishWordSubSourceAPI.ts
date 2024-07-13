import { post } from '@/api/API';
import { ProcessingAddApiReponse } from 'quizzer-lib';
import { MessageState, WordDetailData, WordSubSourceData } from '../../../interfaces/state';
import { getWordDetail } from '@/pages/api/english';

interface AddEnglishWordSubSourceButtonProps {
  wordDetail: WordDetailData;
  subSourceData: WordSubSourceData;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setSubSourceData?: React.Dispatch<React.SetStateAction<WordSubSourceData>>;
  setWordDetail?: React.Dispatch<React.SetStateAction<WordDetailData>>;
}

// TODO ここのAPI部分は分けたい
export const addEnglishWordSubSourceAPI = async ({
  wordDetail,
  subSourceData,
  setMessage,
  setModalIsOpen,
  setSubSourceData,
  setWordDetail
}: AddEnglishWordSubSourceButtonProps) => {
  if (setModalIsOpen) {
    setModalIsOpen(false);
  }
  if (!subSourceData.subsource || subSourceData.subsource === '') {
    if (setMessage) {
      setMessage({ message: 'エラー:サブ出典を入力して下さい', messageColor: 'error', isDisplay: true });
    }
    return;
  }

  await post(
    '/english/word/subsource',
    {
      id: subSourceData.id,
      wordId: wordDetail.id,
      subSource: subSourceData.subsource
    },
    (data: ProcessingAddApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        if (setMessage) {
          setMessage({
            message: 'Success!! 編集に成功しました',
            messageColor: 'success.light',
            isDisplay: true
          });
        }

        // 更新後の単語データを再取得する
        if (setWordDetail && setMessage) {
          getWordDetail(String(wordDetail.id), setMessage, setWordDetail);
        }

        setSubSourceData &&
          setSubSourceData({
            id: -1,
            subsource: '',
            created_at: ''
          });
      } else {
        if (setMessage) {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error',
            isDisplay: true
          });
        }
      }
    }
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    if (setMessage) {
      setMessage({
        message: 'エラー:外部APIとの連携に失敗しました',
        messageColor: 'error',
        isDisplay: true
      });
    }
  });
};
