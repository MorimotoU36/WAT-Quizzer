import React from 'react';
import { Container } from '@mui/material';
import { GetAccuracyGraphForm } from '@/components/ui-forms/quizzer/accuracyRateGraph/getAccuracyGraphForm/GetAccuracyGraphForm';
import { DisplayAccuracyChart } from '@/components/ui-forms/quizzer/accuracyRateGraph/displayAccuracyChart/DisplayAccuracyChart';
import { useAccuracyRateByCategory } from '@/hooks/useAccuracyRateByCategory';
import { useAccuracyGraphForm } from '@/contexts/AccuracyGraphFormContext';

export const AccuracyRateGraphContent = () => {
  const { getCategoryRateData } = useAccuracyGraphForm();
  const { accuracyData, fetchAccuracyData } = useAccuracyRateByCategory();

  const handleDisplayClick = () => {
    fetchAccuracyData(getCategoryRateData);
  };

  return (
    <Container>
      <GetAccuracyGraphForm onDisplayClick={handleDisplayClick} />
      <DisplayAccuracyChart accuracyData={accuracyData} />
    </Container>
  );
};
