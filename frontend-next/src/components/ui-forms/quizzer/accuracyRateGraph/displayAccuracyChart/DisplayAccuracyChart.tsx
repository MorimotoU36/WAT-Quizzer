import React from 'react';
import { AccuracyChart } from '../accuracyChart/AccuracyChart';
import { AccuracyRadarChart } from '../accuracyRadarChart/AccuracyRadarChart';
import { GetAccuracyRateByCategoryAPIResponseDto } from 'quizzer-lib';

interface DisplayAccuracyChartProps {
  accuracyData: GetAccuracyRateByCategoryAPIResponseDto;
  order: string;
  graph: string;
}

export const DisplayAccuracyChart = ({ accuracyData, order, graph }: DisplayAccuracyChartProps) => {
  return (
    <>
      {graph === 'Bar' ? (
        <AccuracyChart accuracyData={accuracyData} order={order} />
      ) : graph === 'Radar' ? (
        <AccuracyRadarChart accuracyData={accuracyData} order={order} />
      ) : (
        <></>
      )}
    </>
  );
};
