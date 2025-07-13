import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CognitoAuthGuard } from 'src/auth/cognito/cognito-auth.guard';

@ApiTags('カテゴリ')
@UseGuards(CognitoAuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: 'カテゴリ一覧取得',
    description: '指定されたファイル番号に対応するカテゴリ一覧を取得します。',
  })
  @ApiQuery({
    name: 'file_num',
    description: 'ファイル番号',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'カテゴリ一覧の取得に成功しました。',
  })
  @ApiResponse({
    status: 400,
    description: 'リクエストパラメータが不正です。',
  })
  @ApiResponse({
    status: 401,
    description: '認証が必要です。',
  })
  @Get()
  async getCategory(@Query('file_num', ParseIntPipe) file_num: number) {
    return await this.categoryService.getCategoryList(+file_num);
  }

  @ApiOperation({
    summary: 'カテゴリ別正答率取得',
    description: '指定されたファイル番号の各カテゴリ別の正答率を取得します。',
  })
  @ApiQuery({
    name: 'file_num',
    description: 'ファイル番号',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'カテゴリ別正答率の取得に成功しました。',
  })
  @ApiResponse({
    status: 400,
    description: 'リクエストパラメータが不正です。',
  })
  @ApiResponse({
    status: 401,
    description: '認証が必要です。',
  })
  @Get('rate')
  async getAccuracyRateByCategory(
    @Query('file_num', ParseIntPipe) file_num: number,
  ) {
    return await this.categoryService.getAccuracyRateByCategory(+file_num);
  }
}
