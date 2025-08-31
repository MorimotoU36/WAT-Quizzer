import React, { useEffect, useMemo, useState } from 'react';
import { Button as MuiButton, CardActions, CardContent, Collapse, Typography, IconButton } from '@mui/material';
import { Card } from '@/components/ui-elements/card/Card';
import { Button } from '@/components/ui-elements/button/Button';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import {
  clearQuizAPI,
  failQuizAPI,
  generateQuizSentense,
  GetQuizApiResponseDto,
  initGetQuizResponseData,
  reverseCheckQuizAPI
} from 'quizzer-lib';
import { Chip } from '@/components/ui-elements/chip/Chip';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/router';

interface DisplayQuizSectionProps {
  getQuizResponseData: GetQuizApiResponseDto;
  setQuizResponseData?: React.Dispatch<React.SetStateAction<GetQuizApiResponseDto>>;
  imageUrl: string;
  setImageUrl?: React.Dispatch<React.SetStateAction<string>>;
}

export const DisplayQuizSection = ({
  getQuizResponseData,
  setQuizResponseData,
  imageUrl,
  setImageUrl
}: DisplayQuizSectionProps) => {
  const setMessage = useSetRecoilState(messageState);
  const [expanded, setExpanded] = useState<boolean>(false);
  const displayQuiz = useMemo(() => {
    return {
      ...getQuizResponseData,
      ...generateQuizSentense(getQuizResponseData)
    };
  }, [getQuizResponseData]);
  const router = useRouter();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // 出題変わったら閉じる
  useEffect(() => {
    setExpanded(false);
    setImageUrl && setImageUrl('');
  }, [getQuizResponseData.quiz_sentense, setImageUrl]);

  return (
    <>
      <Card variant="outlined">
        <CardContent className="!m-[8px] shadow-lg bg-gray-100">
          <Typography variant="h5" component="h2" className="flex items-center justify-start h-full">
            問題
            {/**TODO このアイコンをコンポーネント化する　検索テーブルの方でも同じの使ってるから */}
            {displayQuiz.file_num !== -1 && displayQuiz.quiz_num !== -1 && (
              <IconButton
                aria-label={`${displayQuiz.file_num}-${displayQuiz.quiz_num}`}
                onClick={() => {
                  router.push({
                    pathname: '/quizzer/editQuiz',
                    query: { file_num: displayQuiz.file_num, quiz_num: displayQuiz.quiz_num }
                  });
                }}
              >
                <EditIcon />
              </IconButton>
            )}
          </Typography>
          <Typography variant="subtitle1" component="h2">
            {getQuizResponseData.checked ? '✅' : ''}
            {displayQuiz.quiz_sentense.split(/(\n)/).map((item, index) => {
              return <React.Fragment key={index}>{item.match(/\n/) ? <br /> : item}</React.Fragment>;
            })}
          </Typography>
          {imageUrl && (
            <img src={imageUrl} alt="取得した画像" className="max-h-[192px] max-w-full object-contain my-[8px] block" />
          )}
          {displayQuiz.quiz_category &&
            displayQuiz.quiz_category.map((category, index) => {
              return <Chip key={index} label={category.category} />;
            })}
          <Typography variant="subtitle2" className="text-gray-400">
            {displayQuiz.count && `(取得問題数${String(displayQuiz.count)}問中)`}
          </Typography>
        </CardContent>

        <CardActions>
          <MuiButton size="small" onClick={handleExpandClick} aria-expanded={expanded}>
            答え
          </MuiButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="subtitle1" component="h2">
              {displayQuiz.answer}
            </Typography>
            <Typography variant="subtitle2" component="h3">
              {displayQuiz.quiz_explanation?.explanation.split(/(\\n)/).map((item, index) => {
                return <React.Fragment key={index}>{item.match(/\\n/) ? <br /> : item}</React.Fragment>;
              })}
            </Typography>
            <Button
              label={'正解!!'}
              attr={'button-array'}
              variant="contained"
              color="primary"
              disabled={getQuizResponseData.quiz_num === -1}
              onClick={async (e) => {
                setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
                const result = await clearQuizAPI({
                  getQuizResponseData
                });
                setMessage(result.message);
                // TODO 成功時の判定法
                if (result.message.messageColor === 'success.light' && setQuizResponseData) {
                  setQuizResponseData(initGetQuizResponseData);
                  setExpanded(false);
                  setImageUrl && setImageUrl('');
                }
              }}
            />
            <Button
              label={'不正解...'}
              attr={'button-array'}
              variant="contained"
              color="secondary"
              disabled={getQuizResponseData.quiz_num === -1}
              onClick={async (e) => {
                setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
                const result = await failQuizAPI({
                  getQuizResponseData
                });
                setMessage(result.message);
                // TODO 成功時の判定法
                if (result.message.messageColor === 'success.light' && setQuizResponseData) {
                  setQuizResponseData(initGetQuizResponseData);
                  setExpanded(false);
                  setImageUrl && setImageUrl('');
                }
              }}
            />
            <Button
              label={'チェックつける/外す'}
              attr={'button-array'}
              variant="contained"
              color="warning"
              disabled={getQuizResponseData.quiz_num === -1}
              onClick={async (e) => {
                setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
                const result = await reverseCheckQuizAPI({
                  getQuizResponseData
                });
                setMessage(result.message);
                // TODO 成功時の判定法
                result.message.messageColor === 'success.light' &&
                  setQuizResponseData &&
                  setQuizResponseData((prev) => ({
                    ...prev,
                    checked: prev.checked !== undefined && !prev.checked
                    // checked: result.result ? (result.result as GetQuizApiResponseDto).checked : false
                  }));
              }}
            />
          </CardContent>
        </Collapse>
      </Card>
    </>
  );
};
