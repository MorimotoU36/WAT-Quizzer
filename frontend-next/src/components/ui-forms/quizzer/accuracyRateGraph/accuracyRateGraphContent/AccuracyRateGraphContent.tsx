import React from 'react';
import { Container } from '@mui/material';
import { GetAccuracyGraphForm } from '@/components/ui-forms/quizzer/accuracyRateGraph/getAccuracyGraphForm/GetAccuracyGraphForm';
import { DisplayAccuracyChart } from '@/components/ui-forms/quizzer/accuracyRateGraph/displayAccuracyChart/DisplayAccuracyChart';
import { useAccuracyRateByCategory } from '@/hooks/useAccuracyRateByCategory';
import { useAccuracyGraphForm } from '@/contexts/AccuracyGraphFormContext';

export const AccuracyRateGraphContent = () => {
  const { getCategoryRateData } = useAccuracyGraphForm();
  const { accuracyData } = useAccuracyRateByCategory(getCategoryRateData);
  return (
    <Container>
      <GetAccuracyGraphForm />
      <DisplayAccuracyChart accuracyData={accuracyData} />
    </Container>
  );
};
