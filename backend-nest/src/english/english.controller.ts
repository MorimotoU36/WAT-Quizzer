import {
  Body,
  Controller,
  Get,
  ParseBoolPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EnglishService } from './english.service';
import {
  AddExampleAPIRequestDto,
  RegisterWordsToSourceDto,
  SubmitAssociationExampleAPIRequestDto,
} from 'quizzer-lib';
import { CognitoAuthGuard } from 'src/auth/cognito/cognito-auth.guard';

@UseGuards(CognitoAuthGuard)
@Controller('english')
export class EnglishController {
  constructor(private readonly englishService: EnglishService) {}

  @Get('/partsofspeech')
  async getPosList() {
    return await this.englishService.getPartsofSpeechService();
  }

  @Get('/source')
  async getSourceList() {
    return await this.englishService.getSourceService();
  }

  @Post('/example')
  async addExample(@Body() req: AddExampleAPIRequestDto) {
    return await this.englishService.addExampleService(req);
  }

  @Get('/example')
  async searchExample(
    @Query('query') query: string,
    @Query('isLinked', ParseBoolPipe) isLinked: boolean,
  ) {
    return await this.englishService.searchExampleService(query, isLinked);
  }

  @Post('/example/association')
  async changeAssociationOfExample(
    @Body() req: SubmitAssociationExampleAPIRequestDto,
  ) {
    return await this.englishService.changeAssociationOfExampleService(req);
  }

  @Get('/example/test')
  async getExampleTest() {
    return await this.englishService.getExampleTestService();
  }

  @Get('source/statistics')
  async getSourceStatistics() {
    return await this.englishService.getSourceStatisticsData();
  }

  // バッチ用
  @Post('source/words')
  async registerWordsToSource(
    @Body() registerWordsToSourceDto: RegisterWordsToSourceDto,
  ) {
    return await this.englishService.registerWordsToSource(
      +registerWordsToSourceDto.sourceId,
      registerWordsToSourceDto.words,
    );
  }
}
