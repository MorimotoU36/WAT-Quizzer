import React, { useState } from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { GetAccuracyGraphForm } from '@/components/ui-forms/quizzer/accuracyRateGraph/getAccuracyGraphForm/GetAccuracyGraphForm';
import { DisplayAccuracyChart } from '@/components/ui-forms/quizzer/accuracyRateGraph/displayAccuracyChart/DisplayAccuracyChart';
import { GetCategoryRateAPIRequestDto } from 'quizzer-lib';
import { useAccuracyRateByCategory } from '@/hooks/useAccuracyRateByCategory';

export default function AccuracyRateGraphPage() {
  const [getCategoryRateData, setCategoryRateData] = useState<GetCategoryRateAPIRequestDto>({
    file_num: -1
  });
  const { accuracyData } = useAccuracyRateByCategory(getCategoryRateData);
  const [graph, setGraph] = React.useState('Bar');
  const [order, setOrder] = React.useState('Rate');

  const contents = () => {
    return (
      <Container>
        <GetAccuracyGraphForm
          graph={graph}
          order={order}
          getCategoryRateData={getCategoryRateData}
          setGraph={setGraph}
          setOrder={setOrder}
          setCategoryRateData={setCategoryRateData}
        />
        <DisplayAccuracyChart accuracyData={accuracyData} order={order} graph={graph} />
      </Container>
    );
  };

  return <Layout mode="quizzer" contents={contents()} title={'カテゴリ別正解率表示'} />;
}
