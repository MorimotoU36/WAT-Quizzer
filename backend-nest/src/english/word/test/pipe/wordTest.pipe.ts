import { PipeTransform, Injectable } from '@nestjs/common';
import {
  GetEnglishWordTestDataAPIRequestDto,
  GetEnglishWordTestDataAPIRequestReceivedDto,
  parseStrToBool,
} from 'quizzer-lib';

@Injectable()
export class WordTestPipe implements PipeTransform<
  GetEnglishWordTestDataAPIRequestReceivedDto,
  GetEnglishWordTestDataAPIRequestDto
> {
  transform(
    wordTestRequestDTO: GetEnglishWordTestDataAPIRequestReceivedDto,
  ): GetEnglishWordTestDataAPIRequestDto {
    return Object.entries(wordTestRequestDTO).reduce(
      (acc, cur) => {
        const key = cur[0];
        switch (key) {
          case 'min_rate':
          case 'max_rate':
            if (cur[1] === '-1' || isNaN(parseInt(cur[1]))) {
              return { ...acc };
            } else {
              return { ...acc, [key]: parseInt(cur[1]) };
            }
          case 'checked':
            return { ...acc, [key]: parseStrToBool(cur[1]) };
          default:
            if (cur[1] === '-1') {
              return { ...acc };
            } else {
              return { ...acc, [key]: cur[1] };
            }
        }
      },
      { format: wordTestRequestDTO.format },
    );
  }
}
