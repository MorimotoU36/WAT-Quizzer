import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EnglishService } from './english.service';
import {
  AddExampleAPIRequestDto,
  SubmitAssociationExampleAPIRequestDto,
} from 'quizzer-lib';
// import { AuthGuard } from '../auth/auth.guard';

// @UseGuards(AuthGuard)
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

  // TODO isLinkedはNestのPipeを使ってbooleanで受け取るようにしたい。
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

  /* 注 以下APIは一番最後に置くこと パスが上書きされて全てこのAPIが使われてしまうため */
  // バッチ用
  @Post('source/:id/words')
  async registerWordsToSource(
    @Param('id') id: string,
    @Body('words') words: string[], // wordIds を配列で受け取る
  ) {
    return await this.englishService.registerWordsToSource(+id, words);
  }
}
