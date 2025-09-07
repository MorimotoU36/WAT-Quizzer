import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CognitoAuthGuard } from 'src/auth/cognito/cognito-auth.guard';
import { AccuracyRateQueryPipe, AccuracyRateQueryDto } from './pipes/accuracy-rate-query.pipe';

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
  @ApiQuery({
    name: 'startDate',
    description: '開始日（yyyy-mm-dd形式）',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'endDate',
    description: '終了日（yyyy-mm-dd形式）',
    type: String,
    required: false,
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
  @UsePipes(AccuracyRateQueryPipe)
  async getAccuracyRateByCategory(@Query() query: AccuracyRateQueryDto) {
    return await this.categoryService.getAccuracyRateByCategory(
      query.file_num,
      query.startDate,
      query.endDate,
    );
  }
}
