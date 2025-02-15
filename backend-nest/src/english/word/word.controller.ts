import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EnglishWordService } from './word.service';
import {
  EditWordSourceAPIRequestDto,
  EditWordMeanAPIRequestDto,
  EditWordSubSourceAPIRequestDto,
  DeleteWordSubSourceAPIRequestDto,
  DeleteWordSourceAPIRequestDto,
  DeleteMeanAPIRequestDto,
  AddSynonymAPIRequestDto,
  AddAntonymAPIRequestDto,
  AddDerivativeAPIRequestDto,
  LinkWordEtymologyAPIRequestDto,
  AddEtymologyAPIRequestDto,
  ToggleCheckAPIRequestDto,
  AddWordAPIRequestDto,
  SubmitEnglishWordTestDataAPIRequestDto,
  SearchWordAPIRequestDto,
  GetEnglishWordTestDataAPIRequestDto,
} from 'quizzer-lib';
import { EnglishWordTestService } from './test/test.service';
import { WordTestPipe } from './test/pipe/wordTest.pipe';
// import { AuthGuard } from '../../auth/auth.guard';

@Controller('english/word')
export class EnglishWordController {
  constructor(
    private readonly englishWordService: EnglishWordService,
    private readonly englishWordTestService: EnglishWordTestService,
  ) {}

  @Get('num')
  async getWordNum() {
    return await this.englishWordService.getWordNumService();
  }

  // @UseGuards(AuthGuard)
  @Post()
  async addWord(@Body() req: AddWordAPIRequestDto) {
    return await this.englishWordService.addWordAndMeanService(req);
  }

  // @UseGuards(AuthGuard)
  @Get('search')
  async searchWord(@Query() req: SearchWordAPIRequestDto) {
    return await this.englishWordService.searchWordService(req);
  }

  // @UseGuards(AuthGuard)
  @Get('random')
  async getRandomWord() {
    return await this.englishWordService.getRandomWordService();
  }

  // @UseGuards(AuthGuard)
  @Get()
  async getAllWord() {
    return await this.englishWordService.getAllWordService();
  }

  // @UseGuards(AuthGuard)
  @Get('byname')
  async getWordByName(@Query('name') name: string) {
    return await this.englishWordService.getWordByNameService(name);
  }

  //TODO camel,snake混在
  // @UseGuards(AuthGuard)
  @Get('test')
  async getEnglishWordTestData(
    @Query(WordTestPipe) req: GetEnglishWordTestDataAPIRequestDto,
  ) {
    return await this.englishWordTestService.getTestData(req);
  }

  // @UseGuards(AuthGuard)
  @Post('test/clear')
  async wordTestCleared(@Body() req: SubmitEnglishWordTestDataAPIRequestDto) {
    return await this.englishWordService.wordTestClearedService(req);
  }

  // @UseGuards(AuthGuard)
  @Post('test/fail')
  async wordTestFailed(@Body() req: SubmitEnglishWordTestDataAPIRequestDto) {
    return await this.englishWordService.wordTestFailedService(req);
  }

  // @UseGuards(AuthGuard)
  @Get('test/statistics/week')
  async getWordTestLogStatisticsPastWeek() {
    return await this.englishWordTestService.getWordTestLogStatisticsPastWeek();
  }

  // @UseGuards(AuthGuard)
  @Post('source')
  async editSourceOfWordById(@Body() req: EditWordSourceAPIRequestDto) {
    return await this.englishWordService.editSourceOfWordById(req);
  }

  // @UseGuards(AuthGuard)
  @Delete('source')
  async deleteSourceOfWordById(@Body() req: DeleteWordSourceAPIRequestDto) {
    return await this.englishWordService.deleteSourceOfWordById(req);
  }

  // @UseGuards(AuthGuard)
  @Post('subsource')
  async addSubSourceOfWordById(@Body() req: EditWordSubSourceAPIRequestDto) {
    return await this.englishWordService.upsertSubSourceOfWordById(req);
  }

  // @UseGuards(AuthGuard)
  @Delete('subsource')
  async deleteSubSourceOfWordById(
    @Body() req: DeleteWordSubSourceAPIRequestDto,
  ) {
    return await this.englishWordService.deleteSubSourceOfWordById(req);
  }

  // @UseGuards(AuthGuard)
  @Delete('mean')
  async deleteWordMeanById(@Body() req: DeleteMeanAPIRequestDto) {
    return await this.englishWordService.deleteMeandById(req);
  }

  // @UseGuards(AuthGuard)
  @Get('summary')
  async getSummary() {
    return await this.englishWordService.getSummary();
  }

  // @UseGuards(AuthGuard)
  @Post('synonym')
  async addSynonym(@Body() req: AddSynonymAPIRequestDto) {
    return await this.englishWordService.addSynonymService(req);
  }

  // @UseGuards(AuthGuard)
  @Post('antonym')
  async addAntonym(@Body() req: AddAntonymAPIRequestDto) {
    return await this.englishWordService.addAntonymService(req);
  }

  // @UseGuards(AuthGuard)
  @Post('derivative')
  async addDerivative(@Body() req: AddDerivativeAPIRequestDto) {
    return await this.englishWordService.addDerivativeService(req);
  }

  // @UseGuards(AuthGuard)
  @Post('etymology')
  async addEtymology(@Body() req: AddEtymologyAPIRequestDto) {
    return await this.englishWordService.addEtymologyService(req);
  }

  // @UseGuards(AuthGuard)
  @Post('etymology/link')
  async linkWordEtymology(@Body() req: LinkWordEtymologyAPIRequestDto) {
    return await this.englishWordService.linkWordEtymologyService(req);
  }

  // @UseGuards(AuthGuard)
  @Post('check/toggle')
  async toggleCheck(@Body() req: ToggleCheckAPIRequestDto) {
    return await this.englishWordService.toggleCheckService(req);
  }

  /* 注 以下APIは一番最後に置くこと パスが上書きされて全てこのAPIが使われてしまうため */
  // @UseGuards(AuthGuard)
  // TODO これ /word/:id/source の方がいいはず　直して
  @Get('source/:id')
  async getSourceOfWordById(@Param('id') id: string) {
    return await this.englishWordService.getSourceOfWordById(+id);
  }

  // @UseGuards(AuthGuard)
  // TODO これも /word/:id/subsourceにする
  @Get('subsource/:id')
  async getSubSourceOfWordById(@Param('id') id: string) {
    return await this.englishWordService.getSubSourceOfWordById(+id);
  }

  // @UseGuards(AuthGuard)
  @Get(':id')
  async getWordById(@Param('id') id: string) {
    return await this.englishWordService.getWordByIdService(+id);
  }

  // @UseGuards(AuthGuard)
  @Patch(':id')
  async editWordMean(@Body() req: EditWordMeanAPIRequestDto) {
    return await this.englishWordService.editWordMeanService(req);
  }
}
