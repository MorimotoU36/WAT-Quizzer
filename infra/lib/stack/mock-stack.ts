import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as dotenv from 'dotenv'
import * as s3 from 'aws-cdk-lib/aws-s3'

dotenv.config()

type MockStackProps = {}

export class MockStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MockStackProps) {
    super(scope, id, {
      env: { region: process.env.REGION || '' }
    })

    // S3 Bucket(mock)
    new s3.Bucket(this, `MockQuizzerFrontBucket`, {
      bucketName: `mock-quizzer-front-bucket`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.HEAD],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
          exposedHeaders: []
        }
      ]
    })
  }
}
