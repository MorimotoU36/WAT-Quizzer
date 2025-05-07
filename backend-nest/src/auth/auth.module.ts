import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CognitoAuthService } from './cognito/cognito-auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, CognitoAuthService],
})
export class AuthModule {}
