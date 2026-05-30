import { BadGatewayException, Injectable } from '@nestjs/common';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';

@Injectable()
export class EnglishDerivativesService {
  private readonly lambdaClient: LambdaClient;
  private readonly functionName: string;

  constructor() {
    this.lambdaClient = new LambdaClient({
      region: process.env.REGION ?? '',
    });
    this.functionName = process.env.WORD_DERIVATIVES_FUNCTION_NAME ?? '';
  }

  async getDerivatives(word: string) {
    const payload = JSON.stringify({
      httpMethod: 'GET',
      queryStringParameters: { word },
    });

    const command = new InvokeCommand({
      FunctionName: this.functionName,
      Payload: Buffer.from(payload),
    });

    const response = await this.lambdaClient.send(command);

    if (!response.Payload) {
      throw new BadGatewayException('No response from Lambda');
    }

    const result = JSON.parse(Buffer.from(response.Payload).toString('utf-8'));

    if (result.statusCode !== 200) {
      throw new BadGatewayException(
        JSON.parse(result.body ?? '{}')?.error ?? 'Lambda returned error',
      );
    }

    return JSON.parse(result.body);
  }
}
