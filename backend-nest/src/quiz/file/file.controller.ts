import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { QuizFileService } from './file.service';
import {
  AddQuizFileApiRequest,
  DeleteQuizFileApiRequest,
  GetQuizFileStatisticsAPIRequestDto,
} from 'quizzer-lib';
import { GetQuizFileStatisticsPipe } from './pipe/getQuizFileStatistics.pipe';
import { CognitoAuthGuard } from 'src/auth/cognito/cognito-auth.guard';
import { Response } from 'express';

@UseGuards(CognitoAuthGuard)
@ApiTags('クイズファイル')
@Controller('quiz/file')
export class QuizFileController {
  constructor(private readonly quizFileService: QuizFileService) {}

  @Get()
  @ApiOperation({
    summary: 'クイズファイル一覧取得',
    description: '登録されているクイズファイルの一覧を取得します。',
  })
  async getFileList() {
    return await this.quizFileService.getFileList();
  }

  @Get('statistics')
  @ApiOperation({
    summary: 'クイズファイル統計情報取得',
    description: '指定したクイズファイルの統計情報を取得します。',
  })
  async getFileStatistics(
    @Query(GetQuizFileStatisticsPipe) req: GetQuizFileStatisticsAPIRequestDto,
  ) {
    return await this.quizFileService.getFileStatisticsData(req);
  }

  @Post()
  @ApiOperation({
    summary: 'クイズファイル追加',
    description: '新しいクイズファイルを追加します。',
  })
  async addFile(@Body() req: AddQuizFileApiRequest) {
    return await this.quizFileService.addFile(req);
  }

  @Delete()
  @ApiOperation({
    summary: 'クイズファイル削除',
    description: '指定したクイズファイルを削除します。',
  })
  async deleteFile(@Body() req: DeleteQuizFileApiRequest) {
    return await this.quizFileService.deleteFile(req);
  }

  @Get('csv')
  @ApiOperation({
    summary: 'クイズファイルCSVダウンロード',
    description: '指定したクイズファイルの内容をCSV形式でダウンロードします。',
  })
  async downloadCsv(@Query('file_num') file_num: string, @Res() res: Response) {
    const csv = await this.quizFileService.downloadCsv(+file_num);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
    res.send(csv);
  }
}
