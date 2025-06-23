import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSigninRequestDto } from 'quizzer-lib';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() req: AuthSigninRequestDto) {
    return await this.authService.signIn(req.username, req.password);
  }

  @Post('newpassword')
  @HttpCode(HttpStatus.OK)
  async completeNewPassword(@Body() req: AuthSigninRequestDto) {
    return await this.authService.completeNewPassword(
      req.username,
      req.password,
    );
  }
}
