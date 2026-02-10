import { ApiProperty } from '@nestjs/swagger';

export class AddTodoDto {
  @ApiProperty({ description: 'Todo名' })
  todo: string;
}
