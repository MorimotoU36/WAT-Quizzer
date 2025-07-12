import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthSigninRequestDto } from 'quizzer-lib';

@ApiTags('認証')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'サインイン',
    description:
      'ユーザー名とパスワードでサインインします。パスワード変更が必要な場合はNEW_PASSWORD_REQUIREDを返します。',
  })
  @ApiResponse({
    status: 200,
    description: 'サインイン成功またはパスワード変更要求。',
  })
  async signin(@Body() req: AuthSigninRequestDto) {
    return await this.authService.signIn(req.username, req.password);
  }

  @Post('newpassword')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '新しいパスワードの設定',
    description:
      '初回サインイン時など、パスワード変更が必要な場合に新しいパスワードを設定します。',
  })
  @ApiResponse({
    status: 200,
    description: '新しいパスワード設定後のサインイン成功。',
  })
  async completeNewPassword(@Body() req: AuthSigninRequestDto) {
    return await this.authService.completeNewPassword(
      req.username,
      req.password,
    );
  }
}
