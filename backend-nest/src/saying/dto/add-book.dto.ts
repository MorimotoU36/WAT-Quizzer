import { ApiProperty } from '@nestjs/swagger';

export class AddBookDto {
  @ApiProperty({ description: '本の名前' })
  book_name: string;
}
