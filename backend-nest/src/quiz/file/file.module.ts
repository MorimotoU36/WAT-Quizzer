import { Module } from '@nestjs/common';
import { QuizFileController } from './file.controller';
import { QuizFileService } from './file.service';
import { CognitoAuthService } from 'src/auth/cognito/cognito-auth.service';

@Module({
  imports: [],
  controllers: [QuizFileController],
  providers: [QuizFileService, CognitoAuthService],
})
export class QuizFileModule {}
