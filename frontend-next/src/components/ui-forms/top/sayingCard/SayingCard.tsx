import React from 'react';
import { CardContent, Typography } from '@mui/material';
import { Card } from '@/components/ui-elements/card/Card';
import { GetSayingResponse } from 'quizzer-lib';
import { getSayingAPI } from '@/utils/api-wrapper';
import { Button } from '@/components/ui-elements/button/Button';

interface SayingCardProps {
  sayingResponse: GetSayingResponse;
  setSaying: React.Dispatch<React.SetStateAction<GetSayingResponse>>;
}

export const SayingCard = ({ sayingResponse, setSaying }: SayingCardProps) => {
  return (
    <>
      <Card variant="outlined" attr={['margin-vertical']}>
        <CardContent>
          <Typography variant="h6" component="h6" color="grey.700">
            今回の格言
            <Button
              label={'更新'}
              variant={'text'}
              size={'small'}
              attr={'after-inline'}
              onClick={async (e) => {
                const result = await getSayingAPI({ getSayingRequestData: {} });
                result.result && setSaying(result.result as GetSayingResponse);
              }}
            />
          </Typography>
          <Typography id="saying" variant="h2" component="p" color={'common.black'}>
            {sayingResponse.saying}
          </Typography>
          <Typography id="saying-explanation" variant="subtitle1" component="p" color="grey.800">
            {sayingResponse.explanation}
          </Typography>
          <Typography id="saying-bookname" variant="subtitle1" component="p" color="grey.600">
            {sayingResponse.selfhelp_book?.name || ''}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};
