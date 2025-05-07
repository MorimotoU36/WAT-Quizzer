import { Module } from '@nestjs/common';
import { EnglishController } from './english.controller';
import { EnglishService } from './english.service';
import { EnglishWordModule } from './word/word.module';
import { CognitoAuthService } from 'src/auth/cognito/cognito-auth.service';

@Module({
  imports: [EnglishWordModule],
  controllers: [EnglishController],
  providers: [EnglishService, CognitoAuthService],
})
export class EnglishModule {}
