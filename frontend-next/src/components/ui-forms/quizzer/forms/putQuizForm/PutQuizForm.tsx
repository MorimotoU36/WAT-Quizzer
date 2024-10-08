import React from 'react';
import { Tab, Tabs } from '@mui/material';
import { Card } from '@/components/ui-elements/card/Card';
import { BasisTabPanel } from '@/components/ui-parts/tabpanel-patterns/addQuiz/basisTabPanel/Basis.tabpanel';
import { AppliedTabPanel } from '@/components/ui-parts/tabpanel-patterns/addQuiz/appliedTabPanel/Applied.tabpanel';
import { FourChoiceTabPanel } from '@/components/ui-parts/tabpanel-patterns/addQuiz/fourChoiceTabPanel/FourChoice.tabpanel';
import { AddQuizAPIRequestDto, EditQuizAPIRequestDto } from 'quizzer-lib';

interface PutQuizFormProps {
  putQuizRequestData: AddQuizAPIRequestDto | EditQuizAPIRequestDto;
  setPutQuizRequestData:
    | React.Dispatch<React.SetStateAction<AddQuizAPIRequestDto>>
    | React.Dispatch<React.SetStateAction<EditQuizAPIRequestDto>>;
}

// タブ内コンテンツの設定
const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
};

export const PutQuizForm = ({ putQuizRequestData, setPutQuizRequestData }: PutQuizFormProps) => {
  // タブの切り替え
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setPutQuizRequestData({
      file_num: putQuizRequestData.file_num,
      quiz_num: -1,
      value: newValue
    });
  };

  return (
    <>
      <Card variant="outlined">
        <Tabs value={putQuizRequestData.value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="基礎問題" {...a11yProps(0)} />
          <Tab label="応用問題" {...a11yProps(1)} />
          <Tab label="四択問題" {...a11yProps(2)} />
        </Tabs>
        <BasisTabPanel
          value={putQuizRequestData.value}
          putQuizRequestData={putQuizRequestData}
          setPutQuizRequestData={setPutQuizRequestData}
        />
        <AppliedTabPanel
          value={putQuizRequestData.value}
          putQuizRequestData={putQuizRequestData}
          setPutQuizRequestData={setPutQuizRequestData}
        />
        <FourChoiceTabPanel
          value={putQuizRequestData.value}
          putQuizRequestData={putQuizRequestData}
          setPutQuizRequestData={setPutQuizRequestData}
        />
      </Card>
    </>
  );
};
