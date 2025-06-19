import { Card } from '@/components/ui-elements/card/Card';
import { useEffect, useState } from 'react';
import {
  GetAnswerLogStatisticsAPIRequestDto,
  getAccuracyRateHistgramDataAPI,
  AccuracyRateHistgramApiResponse
} from 'quizzer-lib';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  LineElement,
  PointElement
} from 'chart.js';
import { CircularProgress } from '@mui/material';
import styles from '../../../../../Chart.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);
interface AccuracyRateHistgramCardProps {
  file_num: number;
}
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const AccuracyRateHistgramCard = ({ file_num }: AccuracyRateHistgramCardProps) => {
  const [accuracyRateHistgramData, setAccuracyRateHistgramData] = useState<AccuracyRateHistgramApiResponse>({
    result: []
  });
  const [getAccuracyRateHistgramData, setRequestData] = useState<GetAnswerLogStatisticsAPIRequestDto>({});

  useEffect(() => {
    (async () => {
      const result = await getAccuracyRateHistgramDataAPI({ getAccuracyRateHistgramData });
      result.result && setAccuracyRateHistgramData(result.result as AccuracyRateHistgramApiResponse);
    })();
  }, [getAccuracyRateHistgramData]);

  useEffect(() => {
    setRequestData({
      ...getAccuracyRateHistgramData,
      file_num
    });
  }, [file_num]);

  const data: ChartData<'bar' | 'line', number[], string> = {
    labels: accuracyRateHistgramData.result.map((x, index) => {
      return String(index * 10);
    }),
    datasets: [
      {
        label: '正解率',
        data: accuracyRateHistgramData.result.map((x) => {
          return x;
        }),
        backgroundColor: 'limegreen',
        type: 'bar'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: '正解率ヒストグラム'
      }
    }
  };

  return (
    <Card variant="outlined" attr="margin-vertical">
      <div className={styles.quiz_accuracy_hist}>
        {accuracyRateHistgramData.result.length > 0 ? (
          <Chart type="bar" options={options} data={data} />
        ) : (
          <CircularProgress />
        )}
      </div>
    </Card>
  );
};
