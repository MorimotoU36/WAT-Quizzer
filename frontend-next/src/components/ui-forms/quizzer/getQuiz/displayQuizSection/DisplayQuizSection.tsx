import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  Button as MuiButton,
  CardActions,
  CardContent,
  Collapse,
  Typography,
  IconButton,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { Card } from '@/components/ui-elements/card/Card';
import { Button } from '@/components/ui-elements/button/Button';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { generateQuizSentense, GetQuizApiResponseDto, initGetQuizResponseData } from 'quizzer-lib';
import { clearQuizAPI, failQuizAPI, reverseCheckQuizAPI } from '@/utils/api-wrapper';
import { Chip } from '@/components/ui-elements/chip/Chip';
import { DisplaySentence } from '@/components/ui-elements/sentence/DisplaySentence';
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
  const [hideAccuracyRate, setHideAccuracyRate] = useState<boolean>(false);
  const prevQuizSentenseRef = useRef<string>(getQuizResponseData.quiz_sentense);
  const displayQuiz = useMemo(() => {
    const generated = generateQuizSentense(getQuizResponseData);
    // チェックボックスがONの時（hideAccuracyRateがtrue）は正解率を削除
    let quizSentense = generated.quiz_sentense || '';
    if (hideAccuracyRate && quizSentense) {
      // 正解率のパターン (正解率XX.XX%) を削除
      quizSentense = quizSentense.replace(/\(正解率[\d.]+%\)/g, '');
    }
    return {
      ...getQuizResponseData,
      ...generated,
      quiz_sentense: quizSentense
    };
  }, [getQuizResponseData, hideAccuracyRate]);
  const router = useRouter();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // 出題変わったら閉じる
  useEffect(() => {
    if (prevQuizSentenseRef.current !== getQuizResponseData.quiz_sentense) {
      prevQuizSentenseRef.current = getQuizResponseData.quiz_sentense;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setExpanded(false);
      setImageUrl && setImageUrl('');
    }
  }, [getQuizResponseData.quiz_sentense, setImageUrl]);

  return (
    <>
      <Card variant="outlined">
        <CardContent className="!m-[8px] shadow-lg bg-gray-100">
          <div className="flex items-center justify-between mb-2">
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={hideAccuracyRate}
                  onChange={(e) => setHideAccuracyRate(e.target.checked)}
                  size="small"
                />
              }
              label="正解率を非表示"
            />
          </div>
          <DisplaySentence checked={getQuizResponseData.checked} sentence={displayQuiz.quiz_sentense} />
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
            <DisplaySentence sentence={displayQuiz.answer} />
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
