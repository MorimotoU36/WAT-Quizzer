import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EditSayingDto {
  @ApiProperty({ description: '格言ID' })
  id: number;

  @ApiProperty({ description: '格言本文' })
  saying: string;

  @ApiPropertyOptional({ description: '格言の説明（オプション）' })
  explanation?: string;
}
