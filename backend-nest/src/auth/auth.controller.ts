import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSigninRequestDto } from 'quizzer-lib';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // TODO このレスポンスステータスが201になる？200が正しいのでできれば治す
  @Post('signin')
  async signin(@Body() req: AuthSigninRequestDto) {
    return await this.authService.signIn(req.username, req.password);
  }

  @Post('newpassword')
  async completeNewPassword(@Body() req: AuthSigninRequestDto) {
    return await this.authService.completeNewPassword(
      req.username,
      req.password,
    );
  }
}
