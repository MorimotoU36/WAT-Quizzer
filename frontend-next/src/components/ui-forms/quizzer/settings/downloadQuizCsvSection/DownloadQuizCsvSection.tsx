import { Card, CardContent, CardHeader } from '@mui/material';
import styles from '../Settings.module.css';
import { PullDownOptionDto, downloadQuizCsvAPI } from 'quizzer-lib';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { useState } from 'react';
import { Button } from '@/components/ui-elements/button/Button';

interface DownloadQuizCsvSectionProps {
  filelistoption: PullDownOptionDto[];
}

export const DownloadQuizCsvSection = ({ filelistoption }: DownloadQuizCsvSectionProps) => {
  const [deleteLogOfFileNum, setDeleteLogOfFileNum] = useState<number>(-1);
  // TODO settings関連 似たようなコンポーネントが多いのでまとめたい
  return (
    <Card variant="outlined" className={styles.card}>
      <CardHeader title="問題データCSVダウンロード" />
      <CardContent>
        <Card variant="outlined">
          <CardHeader subheader="ファイル選択" />
          <CardContent className={styles.cardContent}>
            <PullDown
              className={'cardContent'}
              optionList={filelistoption}
              onChange={(e) => {
                setDeleteLogOfFileNum(+e.target.value);
              }}
            />
            <Button
              label="CSVダウンロード"
              variant="contained"
              attr="after-inline"
              onClick={(e) =>
                downloadQuizCsvAPI({
                  downloadQuizCsvApiRequest: { file_num: deleteLogOfFileNum }
                })
              }
            />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
