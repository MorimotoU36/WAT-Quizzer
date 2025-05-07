import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { QuizFileModule } from './file/file.module';
import { CognitoAuthService } from 'src/auth/cognito/cognito-auth.service';

@Module({
  imports: [QuizFileModule],
  controllers: [QuizController],
  providers: [QuizService, CognitoAuthService],
})
export class QuizModule {}
