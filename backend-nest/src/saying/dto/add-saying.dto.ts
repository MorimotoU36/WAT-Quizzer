import { ApiProperty } from '@nestjs/swagger';

export class AddSayingDto {
  @ApiProperty({ description: '本ID' })
  book_id: number;

  @ApiProperty({ description: '格言本文' })
  saying: string;

  @ApiProperty({ description: '格言の説明' })
  explanation: string;
}
