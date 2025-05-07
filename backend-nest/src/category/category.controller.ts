import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CognitoAuthGuard } from 'src/auth/cognito/cognito-auth.guard';

@UseGuards(CognitoAuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategory(@Query('file_num', ParseIntPipe) file_num: number) {
    return await this.categoryService.getCategoryList(+file_num);
  }

  @Get('rate')
  async getAccuracyRateByCategory(
    @Query('file_num', ParseIntPipe) file_num: number,
  ) {
    return await this.categoryService.getAccuracyRateByCategory(+file_num);
  }
}
