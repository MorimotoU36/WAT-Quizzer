import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CognitoAuthService } from './cognito/cognito-auth.service';

@Injectable()
export class AuthService {
  constructor(private cognitoAuthService: CognitoAuthService) {}

  async signIn(username: string, password: string) {
    try {
      return await this.cognitoAuthService.signIn(username, password);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async completeNewPassword(username: string, password: string): Promise<any> {
    try {
      return await this.cognitoAuthService.completeNewPassword(
        username,
        password,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
