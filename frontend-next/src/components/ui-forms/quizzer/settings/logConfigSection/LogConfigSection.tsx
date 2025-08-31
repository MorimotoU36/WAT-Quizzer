import { Card, CardContent, CardHeader } from '@mui/material';
import { DeleteAnswerLogFileSection } from '../deleteAnswerLogFileSection/DeleteAnswerLogFileSection';
import { PullDownOptionDto, Message } from 'quizzer-lib';

interface LogConfigSectionProps {
  filelistoption: PullDownOptionDto[];
  setMessage: React.Dispatch<React.SetStateAction<Message>>;
}

export const LogConfigSection = ({ filelistoption, setMessage }: LogConfigSectionProps) => {
  return (
    <Card variant="outlined" className="my-2.5">
      <CardHeader title="解答データ削除" />
      <CardContent>
        <Card variant="outlined">
          <DeleteAnswerLogFileSection filelistoption={filelistoption} setMessage={setMessage} />
        </Card>
      </CardContent>
    </Card>
  );
};
