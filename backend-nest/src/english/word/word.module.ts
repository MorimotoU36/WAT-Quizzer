import { Module } from '@nestjs/common';
import { EnglishWordController } from './word.controller';
import { EnglishWordService } from './word.service';
import { EnglishWordTestService } from './test/test.service';
import { CognitoAuthService } from 'src/auth/cognito/cognito-auth.service';

@Module({
  imports: [],
  controllers: [EnglishWordController],
  providers: [EnglishWordService, EnglishWordTestService, CognitoAuthService],
})
export class EnglishWordModule {}
