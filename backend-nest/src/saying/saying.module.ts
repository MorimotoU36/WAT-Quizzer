import { Module } from '@nestjs/common';
import { SayingService } from './saying.service';
import { SayingController } from './saying.controller';
import { CognitoAuthService } from 'src/auth/cognito/cognito-auth.service';

@Module({
  imports: [],
  controllers: [SayingController],
  providers: [SayingService, CognitoAuthService],
})
export class SayingModule {}
