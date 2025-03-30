import React from 'react';
import { CardContent, Input, Typography } from '@mui/material';
import { Card } from '@/components/ui-elements/card/Card';
import { EditQuizAPIRequestDto, insertAtArray } from 'quizzer-lib';
import styles from './EditQuizForm.module.css';
import { Checkbox } from '@/components/ui-elements/checkBox/CheckBox';

interface EditQuizFormProps {
  editQuizRequestData: EditQuizAPIRequestDto;
  setEditQuizRequestData: React.Dispatch<React.SetStateAction<EditQuizAPIRequestDto>>;
}

export const EditQuizForm = ({ editQuizRequestData, setEditQuizRequestData }: EditQuizFormProps) => {
  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" component="h6" className={styles.messageBox}>
            編集する問題（問題文,正解,カテゴリ,画像ファイル名,関連基礎問題番号,解説,ダミー選択肢）
          </Typography>

          <Typography variant="h6" component="h6" className={styles.messageBox}>
            <label htmlFor="question">問題文　：</label>
            <Input
              fullWidth
              maxRows={1}
              id="question"
              value={editQuizRequestData.question || ''}
              onChange={(e) => {
                // TODO ここのany
                setEditQuizRequestData((prev: any) => ({
                  ...prev,
                  question: e.target.value
                }));
              }}
            />
          </Typography>

          <Typography variant="h6" component="h6" className={styles.messageBox}>
            <label htmlFor="answer">答え　　：</label>
            <Input
              fullWidth
              maxRows={1}
              id="answer"
              value={editQuizRequestData.answer || ''}
              onChange={(e) => {
                setEditQuizRequestData((prev: any) => ({
                  ...prev,
                  answer: e.target.value
                }));
              }}
            />
          </Typography>

          <Typography variant="h6" component="h6" className={styles.messageBox}>
            <label htmlFor="category">カテゴリ：</label>
            <Input
              fullWidth
              maxRows={1}
              id="category"
              value={editQuizRequestData.category || ''}
              onChange={(e) => {
                setEditQuizRequestData((prev: any) => ({
                  ...prev,
                  category: e.target.value
                }));
              }}
            />
            <p className={styles.notation}>※カテゴリはカンマ(,)区切りで書くこと</p>
          </Typography>

          <Typography variant="h6" component="h6" className={styles.messageBox}>
            <label htmlFor="imgFile">画像ファイル名：</label>
            <Input
              fullWidth
              maxRows={1}
              id="imgFile"
              value={editQuizRequestData.img_file || ''}
              onChange={(e) => {
                setEditQuizRequestData((prev: any) => ({
                  ...prev,
                  img_file: e.target.value
                }));
              }}
            />
          </Typography>

          <Typography variant="h6" component="h6" className={styles.messageBox}>
            <label htmlFor="relatedBasisNum">関連基礎問題番号(カンマ区切りで問題番号を指定)：</label>
            <Input
              fullWidth
              disabled={editQuizRequestData.format_id === 1}
              maxRows={1}
              id="relatedBasisNum"
              value={editQuizRequestData.matched_basic_quiz_id || ''}
              onChange={(e) => {
                setEditQuizRequestData((prev: any) => ({
                  ...prev,
                  matched_basic_quiz_id: e.target.value
                }));
              }}
            />
          </Typography>

          <Typography variant="h6" component="h6" className={styles.messageBox}>
            <label htmlFor="description">解説：</label>
            <Input
              fullWidth
              maxRows={1}
              id="description"
              value={editQuizRequestData.explanation || ''}
              onChange={(e) => {
                setEditQuizRequestData((prev: any) => ({
                  ...prev,
                  explanation: e.target.value
                }));
              }}
            />
            <p className={styles.notation}>
              ※選択肢を示したいときは正解文を<b>{'{c}'}</b>、ダミー選択肢１、２、３をそれぞれ<b>{'{d1},{d2},{d3}'}</b>
              で書くこと
            </p>
          </Typography>

          {editQuizRequestData.format_id === 3 &&
            editQuizRequestData.dummyChoice &&
            editQuizRequestData.dummyChoice.map((choice, index) => {
              const inputId = 'dummy' + (index + 1);
              return (
                <>
                  <Typography variant="h6" component="h6" className={styles.messageBox}>
                    <label htmlFor={inputId}>{`ダミー選択肢${index + 1}：`}</label>
                    <Checkbox
                      value="only-checked"
                      label="(多答設定、この選択肢も正解にする)"
                      defaultChecked={
                        editQuizRequestData.dummyChoice ? editQuizRequestData.dummyChoice[index].isCorrect : false
                      }
                      onChange={(e) => {
                        setEditQuizRequestData((prev: any) => ({
                          ...prev,
                          dummyChoice: insertAtArray(prev.dummyChoice, index, {
                            ...prev.dummyChoice[index],
                            isCorrect: e.target.checked
                          })
                        }));
                      }}
                    />
                    <Input
                      fullWidth
                      disabled={editQuizRequestData.format_id !== 3}
                      maxRows={1}
                      id={inputId}
                      value={choice.sentense || ''}
                      onChange={(e) => {
                        setEditQuizRequestData((prev: any) => ({
                          ...prev,
                          dummyChoice: insertAtArray(prev.dummyChoice, index, {
                            ...prev.dummyChoice[index],
                            sentense: e.target.value
                          })
                        }));
                      }}
                    />
                  </Typography>
                </>
              );
            })}
        </CardContent>
      </Card>
    </>
  );
};
