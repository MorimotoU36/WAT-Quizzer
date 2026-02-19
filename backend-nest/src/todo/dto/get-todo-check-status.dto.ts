import { ApiProperty } from '@nestjs/swagger';

export class GetTodoCheckStatusDto {
  @ApiProperty({ description: '日付 (YYYY-MM-DD)' })
  date: string;
}
