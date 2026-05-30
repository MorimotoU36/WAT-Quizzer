import { Module } from '@nestjs/common';
import { EnglishDerivativesController } from './derivatives.controller';
import { EnglishDerivativesService } from './derivatives.service';
import { CognitoAuthService } from 'src/auth/cognito/cognito-auth.service';

@Module({
  controllers: [EnglishDerivativesController],
  providers: [EnglishDerivativesService, CognitoAuthService],
})
export class EnglishDerivativesModule {}
