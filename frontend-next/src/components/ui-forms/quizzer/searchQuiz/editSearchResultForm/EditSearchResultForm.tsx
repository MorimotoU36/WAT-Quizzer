import React, { useState } from 'react';
import { FormControl, FormGroup, TextField } from '@mui/material';
import { Button } from '@/components/ui-elements/button/Button';
import { addCategoryToQuizAPI, checkOffQuizAPI, checkOnQuizAPI, deleteCategoryOfQuizAPI } from 'quizzer-lib';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';

interface EditSearchResultFormProps {
  checkedIdList: number[];
  setCheckedIdList: React.Dispatch<React.SetStateAction<number[]>>;
}

export const EditSearchResultForm = ({ checkedIdList, setCheckedIdList }: EditSearchResultFormProps) => {
  const [changedCategory, setChangedCategory] = useState<string>('');
  const setMessage = useSetRecoilState(messageState);

  // チェックした問題に指定カテゴリを一括登録する
  const registerCategoryToChecked = async () => {
    if (checkedIdList.length === 0) {
      setMessage({
        message: 'エラー:チェックされた問題がありません',
        messageColor: 'error'
      });
      return;
    } else if (changedCategory === '') {
      setMessage({
        message: 'エラー:一括登録するカテゴリ名を入力して下さい',
        messageColor: 'error'
      });
      return;
    }

    // チェックした問題にカテゴリを登録
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });

    // カテゴリをチェックした問題に一括登録
    const result = await addCategoryToQuizAPI({
      addCategoryToQuizRequestData: {
        quiz_id: checkedIdList
          .map((id) => {
            return String(id);
          })
          .join(','),
        category: changedCategory
      }
    });
    setMessage({
      ...result.message
    });
    // 終わったらチェック全て外す、入力カテゴリも消す
    setCheckedIdList([]);
    setChangedCategory('');
  };

  // チェックした問題から指定カテゴリを一括削除する
  const removeCategoryFromChecked = async () => {
    if (checkedIdList.length === 0) {
      setMessage({
        message: 'エラー:チェックされた問題がありません',
        messageColor: 'error'
      });
      return;
    } else if (changedCategory === '') {
      setMessage({
        message: 'エラー:一括削除するカテゴリ名を入力して下さい',
        messageColor: 'error'
      });
      return;
    }

    // チェックした問題からカテゴリを削除
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });

    const result = await deleteCategoryOfQuizAPI({
      deleteCategoryToQuizRequestData: {
        quiz_id: checkedIdList
          .map((id) => {
            return String(id);
          })
          .join(','),
        category: changedCategory
      }
    });
    setMessage({
      ...result.message
    });
    // 終わったらチェック全て外す、入力カテゴリも消す
    setCheckedIdList([]);
    setChangedCategory('');
  };

  // 選択した問題全てにチェックをつける
  const checkedToSelectedQuiz = async () => {
    if (checkedIdList.length === 0) {
      setMessage({
        message: 'エラー:選択された問題がありません',
        messageColor: 'error'
      });
      return;
    }

    // 選択した問題にチェック
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
    const result = await checkOnQuizAPI({
      checkQuizRequestData: {
        quiz_id: checkedIdList
          .map((id) => {
            return String(id);
          })
          .join(',')
      }
    });
    setMessage({
      ...result.message
    });
    // 終わったらチェック全て外す、入力カテゴリも消す
    setCheckedIdList([]);
    setChangedCategory('');
  };

  // 選択した問題全てにチェックを外す
  const uncheckedToSelectedQuiz = async () => {
    if (checkedIdList.length === 0) {
      setMessage({
        message: 'エラー:選択された問題がありません',
        messageColor: 'error'
      });
      return;
    }

    // 選択した問題にチェック
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
    const result = await checkOffQuizAPI({
      checkQuizRequestData: {
        quiz_id: checkedIdList
          .map((id) => {
            return String(id);
          })
          .join(',')
      }
    });
    setMessage({
      ...result.message
    });
    // 終わったらチェック全て外す、入力カテゴリも消す
    setCheckedIdList && setCheckedIdList([]);
    setChangedCategory && setChangedCategory('');
  };

  return (
    <>
      <FormGroup className="border border-gray-300 rounded-md !my-[4px] !p-[5px] flex items-center" row>
        チェックした問題全てにカテゴリ「
        <FormControl>
          <TextField
            id="change-category"
            value={changedCategory}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
              setChangedCategory && setChangedCategory(e.target.value)
            }
          />
        </FormControl>
        」を
        <FormControl>
          <Button
            attr="!mx-[10px]"
            label={'一括カテゴリ登録'}
            variant="contained"
            color="primary"
            disabled={checkedIdList.length === 0}
            onClick={async (e) => await registerCategoryToChecked()}
          ></Button>
        </FormControl>
        or
        <FormControl>
          <Button
            attr="!mx-[10px]"
            label={'一括カテゴリ削除'}
            variant="contained"
            color="primary"
            disabled={checkedIdList.length === 0}
            onClick={async (e) => await removeCategoryFromChecked()}
          ></Button>
        </FormControl>
      </FormGroup>

      <FormGroup className="border border-gray-300 rounded-md !my-[10px] !p-[5px] flex items-center" row>
        チェックした問題全てに
        <FormControl>
          <Button
            attr="!mx-[10px]"
            label={'✅をつける'}
            variant="contained"
            color="primary"
            disabled={checkedIdList.length === 0} // TODO 応用問題検索結果からチェック機能つける
            onClick={async (e) => await checkedToSelectedQuiz()}
          ></Button>
        </FormControl>
        or
        <FormControl>
          <Button
            attr="!mx-[10px]"
            label={'✅を外す'}
            variant="contained"
            color="primary"
            disabled={checkedIdList.length === 0}
            onClick={async (e) => await uncheckedToSelectedQuiz()}
          ></Button>
        </FormControl>
      </FormGroup>
    </>
  );
};
