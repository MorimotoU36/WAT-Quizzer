import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { CognitoAuthService } from 'src/auth/cognito/cognito-auth.service';

@Module({
  imports: [],
  controllers: [TodoController],
  providers: [TodoService, CognitoAuthService],
})
export class TodoModule {}
