import React from 'react';
import { CardContent, Typography } from '@mui/material';
import { Card } from '@/components/ui-elements/card/Card';

interface AddQuizLogSectionProps {
  log: string;
}

export const AddQuizLogSection = ({ log }: AddQuizLogSectionProps) => {
  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Typography className="text-sm" color="textSecondary" gutterBottom>
            --実行ログ--
          </Typography>
          <Typography variant="h6" component="h6">
            {log}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};
