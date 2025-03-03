import { Card } from '@/components/ui-elements/card/Card';
import { getQuizFileStatisticsDataAPI, PullDownOptionDto, QuizFileStatisticsApiResponse } from 'quizzer-lib';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';

interface FileStatisticsCardProps {}
ChartJS.register(ArcElement, Tooltip, Legend);

export const FileStatisticsCard = ({}: FileStatisticsCardProps) => {
  const [filelistoption, setFilelistoption] = useState<PullDownOptionDto[]>([]);
  const [selectedFile, setSelectedFile] = useState<number>(1);
  const [quizFileStatisticsData, setQuizFileStatisticsData] = useState<QuizFileStatisticsApiResponse[]>([]);
  const selectedFileStaticsData = quizFileStatisticsData.find((x) => x.file_num === selectedFile);

  useEffect(() => {
    (async () => {
      const result = await getQuizFileStatisticsDataAPI({});
      result.result && setQuizFileStatisticsData(result.result as QuizFileStatisticsApiResponse[]);
      // 問題ファイルプルダウン ファイル統計リスト取得から作成
      result.result &&
        setFilelistoption(
          (result.result as QuizFileStatisticsApiResponse[]).map((x) => {
            return {
              value: String(x.file_num),
              label: x.file_nickname
            } as PullDownOptionDto;
          })
        );
    })();
  }, []);

  const labels = ['正解数', '不正解数', '未解答数'];
  const datasets = selectedFileStaticsData
    ? [
        {
          label: '正答率分布',
          data: [
            selectedFileStaticsData.clear || 0,
            selectedFileStaticsData.fail || 0,
            selectedFileStaticsData.not_answered || 0
          ],
          backgroundColor: ['crimson', 'black', 'dimgray']
        }
      ]
    : [];
  const data = {
    labels,
    datasets
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'left' as const
      },
      title: {
        display: true,
        text: `問題ファイル統計(${selectedFileStaticsData ? selectedFileStaticsData.file_nickname : 'null'}): ${
          selectedFileStaticsData ? selectedFileStaticsData.count : '0'
        }問中`
      }
    }
  };

  return (
    <>
      <Card variant="outlined" attr="margin-vertical">
        {/*TODO quizzer形式のプルダウン結構使うから　あらかじめquizzerのファイル値が入った状態のプルダウンをコンポーネントとして用意したほうがいい気した */}
        <PullDown
          label={'問題ファイル'}
          optionList={filelistoption}
          onChange={(e) => setSelectedFile(+e.target.value)}
        />
        <p>
          {selectedFileStaticsData?.process_rate ? `進捗率:${selectedFileStaticsData?.process_rate.toFixed(2)}%` : ''}
        </p>
        <Card variant="outlined" attr="rect-600 margin-vertical">
          {quizFileStatisticsData.length > 0 ? <Doughnut data={data} options={options} /> : <CircularProgress />}
        </Card>
      </Card>
    </>
  );
};
