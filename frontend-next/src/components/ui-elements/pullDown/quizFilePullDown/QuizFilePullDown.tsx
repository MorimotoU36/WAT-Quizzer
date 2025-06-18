import React from 'react';

import { useQuizFileList } from '@/hooks/useQuizFileList';
import { PullDown } from '../PullDown';
import { SelectChangeEvent } from '@mui/material';

type Props = {
  onFileChange: (e: SelectChangeEvent<number>) => void;
};

export const QuizFilePullDown: React.FC<Props> = ({ onFileChange }) => {
  const { filelistoption } = useQuizFileList();
  return <PullDown label={'問題ファイル'} optionList={filelistoption} onChange={onFileChange} />;
};
