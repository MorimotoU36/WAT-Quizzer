import { PipeTransform, Injectable } from '@nestjs/common';
import {
  parseStrToBool,
  SearchQuizAPIRequestDto,
  SearchQuizAPIRequestReceivedDto,
} from 'quizzer-lib';

@Injectable()
export class SearchQuizPipe
  implements
    PipeTransform<SearchQuizAPIRequestReceivedDto, SearchQuizAPIRequestDto>
{
  transform(
    searchQuizDTO: SearchQuizAPIRequestReceivedDto,
  ): SearchQuizAPIRequestDto {
    return Object.entries(searchQuizDTO).reduce(
      (acc, cur) => {
        const key = cur[0];
        switch (key) {
          case 'file_num':
          case 'min_rate':
          case 'max_rate':
            if (cur[1] === '-1' || isNaN(parseInt(cur[1]))) {
              return { ...acc };
            } else {
              return { ...acc, [key]: parseInt(cur[1]) };
            }
          case 'checked':
          case 'searchInOnlySentense':
          case 'searchInOnlyAnswer':
            return { ...acc, [key]: parseStrToBool(cur[1]) };
          case 'format_id':
            return cur[1] && cur[1] !== ''
              ? {
                  ...acc,
                  [key]: cur[1]
                    .split(',')
                    .filter((x) => x !== '')
                    .reduce((accummulate, currentValue) => {
                      return { ...accummulate, [currentValue]: true };
                    }, {}),
                }
              : {
                  ...acc,
                };
          default:
            if (cur[1] === '-1') {
              return { ...acc };
            } else {
              return { ...acc, [key]: cur[1] };
            }
        }
      },
      { query: '', file_num: -1 },
    );
  }
}
