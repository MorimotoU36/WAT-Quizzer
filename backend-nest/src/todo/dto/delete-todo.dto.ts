import { ApiProperty } from '@nestjs/swagger';

export class DeleteTodoDto {
  @ApiProperty({ description: 'Todo ID' })
  id: number;
}
