import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class AddTodoDiaryDto {
  @ApiProperty({ description: '日付（YYYY-MM-DD形式）' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: '日付はYYYY-MM-DD形式で入力してください',
  })
  date: string;
}
