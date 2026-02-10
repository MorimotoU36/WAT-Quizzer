import { PipeTransform, Injectable } from '@nestjs/common';
import {
  GetQuizFileStatisticsAPIRequestDto,
  GetQuizFileStatisticsAPIRequestReceivedDto,
} from 'quizzer-lib';

@Injectable()
export class GetQuizFileStatisticsPipe implements PipeTransform<
  GetQuizFileStatisticsAPIRequestReceivedDto,
  GetQuizFileStatisticsAPIRequestDto
> {
  transform(
    getQuizFileStatisticsDTO: GetQuizFileStatisticsAPIRequestReceivedDto,
  ): GetQuizFileStatisticsAPIRequestDto {
    return Object.entries(getQuizFileStatisticsDTO).reduce(
      (acc, cur) => {
        const key = cur[0];
        switch (key) {
          case 'file_num':
            if (cur[1] === '-1' || isNaN(parseInt(cur[1]))) {
              return { ...acc };
            } else {
              return { ...acc, [key]: parseInt(cur[1]) };
            }
          default:
            return { ...acc };
        }
      },
      { file_num: -1 },
    );
  }
}
