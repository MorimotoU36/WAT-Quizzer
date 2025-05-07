import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CognitoAuthService } from 'src/auth/cognito/cognito-auth.service';

@Module({
  imports: [],
  controllers: [CategoryController],
  providers: [CategoryService, CognitoAuthService],
})
export class CategoryModule {}
