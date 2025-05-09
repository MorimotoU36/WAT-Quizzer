import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SayingService } from './saying.service';
import {
  AddBookAPIRequestDto,
  AddSayingAPIRequestDto,
  EditSayingAPIRequestDto,
} from 'quizzer-lib';
import { CognitoAuthGuard } from 'src/auth/cognito/cognito-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
@UseGuards(CognitoAuthGuard)
@Controller('saying')
export class SayingController {
  constructor(private readonly sayingService: SayingService) {}

  // 格言取得（本ID指定、無い場合はランダムで取得）（QueryがオプショナルでPupe使うと不具合発生するのでpipeはしない）
  @Get()
  async getSaying(@Query('book_id') book_id?: number) {
    return await this.sayingService.getRandomSaying(book_id);
  }

  // 啓発本追加
  @Post('/book')
  async addBook(@Body() req: AddBookAPIRequestDto) {
    return await this.sayingService.addBookService(req);
  }

  // 啓発本リスト取得
  @Get('/book')
  async getBookList() {
    return await this.sayingService.getBookListService();
  }

  // 格言追加
  @Post()
  async addSaying(@Body() req: AddSayingAPIRequestDto) {
    return await this.sayingService.addSayingService(req);
  }

  // 格言検索
  @Get('/search')
  async searchSaying(@Query('saying') saying: string) {
    return await this.sayingService.searchSayingService(saying);
  }

  // 格言編集
  @Patch()
  async editSaying(@Body() req: EditSayingAPIRequestDto) {
    return await this.sayingService.editSayingService(req);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.sayingService.uploadFile(file);
  }

  // 格言取得(格言ID指定)
  @Get('/:id')
  async getSayingById(@Param('id', ParseIntPipe) id: number) {
    return await this.sayingService.getSayingByIdService(+id);
  }
}
