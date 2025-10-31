import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as dotenv from 'dotenv'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'

dotenv.config()

type MockStackProps = {}

export class MockStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MockStackProps) {
    super(scope, id, {
      env: { region: process.env.REGION || 'ap-northeast-1' }
    })

    // S3 Bucket for CloudFront origin (public read access for mock environment)
    const mockBucket = new s3.Bucket(this, `MockQuizzerFrontBucket`, {
      bucketName: `mock-quizzer-front-bucket-${this.account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      publicReadAccess: true,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.HEAD],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
          exposedHeaders: []
        }
      ]
    })

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(
      this,
      'MockQuizzerDistribution',
      {
        defaultBehavior: {
          origin: new origins.S3Origin(mockBucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS
        },
        priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
        comment: 'Mock Quizzer Frontend Distribution'
      }
    )

    // Outputs
    new cdk.CfnOutput(this, 'MockBucketName', {
      value: mockBucket.bucketName,
      description: 'Mock S3 Bucket Name'
    })

    new cdk.CfnOutput(this, 'MockDistributionId', {
      value: distribution.distributionId,
      description: 'Mock CloudFront Distribution ID'
    })

    new cdk.CfnOutput(this, 'MockDistributionDomainName', {
      value: distribution.distributionDomainName,
      description: 'Mock CloudFront Distribution Domain Name'
    })

    new cdk.CfnOutput(this, 'MockWebsiteURL', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'Mock Website URL'
    })
  }
}
