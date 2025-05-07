import { CognitoUserPool } from 'amazon-cognito-identity-js';
import * as dotenv from 'dotenv';
dotenv.config();

export const poolData = {
  UserPoolId: process.env.AWS_COGNITO_USERPOOL_ID,
  ClientId: process.env.AWS_COGNITO_APPCLIENT_ID, // アプリクライアントID
};

export const userPool = new CognitoUserPool(poolData);
