import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuizFileService } from './file.service';
import {
  AddQuizFileApiRequest,
  DeleteQuizFileApiRequest,
  GetQuizFileStatisticsAPIRequestDto,
} from 'quizzer-lib';
import { GetQuizFileStatisticsPipe } from './pipe/getQuizFileStatistics.pipe';
import { CognitoAuthGuard } from 'src/auth/cognito/cognito-auth.guard';

@UseGuards(CognitoAuthGuard)
@Controller('quiz/file')
export class QuizFileController {
  constructor(private readonly quizFileService: QuizFileService) {}

  @Get()
  async getFileList() {
    return await this.quizFileService.getFileList();
  }

  @Get('statistics')
  async getFileStatistics(
    @Query(GetQuizFileStatisticsPipe) req: GetQuizFileStatisticsAPIRequestDto,
  ) {
    return await this.quizFileService.getFileStatisticsData(req);
  }

  @Post()
  async addFile(@Body() req: AddQuizFileApiRequest) {
    return await this.quizFileService.addFile(req);
  }

  @Delete()
  async deleteFile(@Body() req: DeleteQuizFileApiRequest) {
    return await this.quizFileService.deleteFile(req);
  }
}
