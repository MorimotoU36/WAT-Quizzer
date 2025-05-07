import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { userPool } from './cognito-auth.config';
import * as dotenv from 'dotenv';
dotenv.config();

const REGION = process.env.REGION;
const USER_POOL_ID = process.env.AWS_COGNITO_USERPOOL_ID;
const CLIENT_ID = process.env.AWS_COGNITO_APPCLIENT_ID;
const COGNITO_ISSUER = `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`;

// JWKSクライアント作成
const client = jwksClient({
  jwksUri: `${COGNITO_ISSUER}/.well-known/jwks.json`,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

@Injectable()
export class CognitoAuthService {
  async verifyAccessToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getKey,
        {
          issuer: COGNITO_ISSUER,
          algorithms: ['RS256'],
        },
        (err, decoded: any) => {
          if (err) {
            reject(new UnauthorizedException('Invalid or expired token'));
          }
          if (decoded.token_use !== 'access') {
            return reject(
              new UnauthorizedException('Token is not an access token'),
            );
          }

          if (decoded.client_id !== CLIENT_ID) {
            return reject(
              new UnauthorizedException('Token was not issued for this client'),
            );
          }

          resolve(decoded);
        },
      );
    });
  }

  async signIn(username: string, password: string): Promise<any> {
    const user = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    return new Promise((resolve, reject) => {
      user.authenticateUser(authDetails, {
        onSuccess: (result) => {
          const idToken = result.getIdToken().getJwtToken();
          const accessToken = result.getAccessToken().getJwtToken();
          resolve({ status: 'SUCCESS', idToken, accessToken });
        },
        onFailure: (err) => {
          reject(new UnauthorizedException(err.message));
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          // Cognitoがセッションを内部保持している
          resolve({
            status: 'NEW_PASSWORD_REQUIRED',
            session:
              user.getSignInUserSession()?.getAccessToken().getJwtToken() ??
              null,
            username,
          });
        },
      });
    });
  }

  async completeNewPassword(
    username: string,
    newPassword: string,
  ): Promise<any> {
    const user = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    return new Promise((resolve, reject) => {
      user.completeNewPasswordChallenge(
        newPassword,
        {},
        {
          onSuccess: (result) => {
            const idToken = result.getIdToken().getJwtToken();
            const accessToken = result.getAccessToken().getJwtToken();
            resolve({ status: 'SUCCESS', idToken, accessToken });
          },
          onFailure: (err) => {
            reject(new UnauthorizedException(err.message));
          },
        },
      );
    });
  }
}
