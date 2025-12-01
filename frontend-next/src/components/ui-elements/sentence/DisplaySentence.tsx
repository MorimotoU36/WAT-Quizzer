import React from 'react';
import { Typography } from '@mui/material';

interface DisplaySentenceProps {
  checked?: boolean;
  quizSentence: string;
}

export const DisplaySentence = ({ checked, quizSentence }: DisplaySentenceProps) => {
  return (
    <Typography variant="subtitle1" component="h2">
      {checked ? '✅' : ''}
      {quizSentence.split(/(\n)/).map((item, index) => {
        return <React.Fragment key={index}>{item.match(/\n/) ? <br /> : item}</React.Fragment>;
      })}
    </Typography>
  );
};
