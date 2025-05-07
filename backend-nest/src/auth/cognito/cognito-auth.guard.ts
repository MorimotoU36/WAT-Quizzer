import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { CognitoAuthService } from './cognito-auth.service';

@Injectable()
export class CognitoAuthGuard implements CanActivate {
  constructor(private readonly cognitoAuthService: CognitoAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      const user = await this.cognitoAuthService.verifyAccessToken(token);
      req['user'] = user;
      return true;
    } catch (err) {
      return false;
    }
  }
}
