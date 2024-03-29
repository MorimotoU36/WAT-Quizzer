import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import { Secret } from 'aws-cdk-lib/aws-secretsmanager'
import { Construct } from 'constructs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { makeRecordsToApigw } from '../service/route53'

dotenv.config()

type BackendStackProps = {
  env: string
  apiCertificate: acm.Certificate
  hostedZone: route53.HostedZone
}

export class BackendStack extends cdk.Stack {
  readonly restApi: apigw.RestApi

  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, {
      env: { region: process.env.REGION || '' },
      crossRegionReferences: true
    })

    const { region, accountId } = new cdk.ScopedAws(this)

    // S3 Bucket for NestJS Lambda
    const bucket = new s3.Bucket(this, 'nestJSLambdaBucket', {
      bucketName: `${props.env}-nestjsapi-lambda-layer-bucket`
    })

    // Lambda layer
    const layer = new lambda.LayerVersion(
      this,
      `${props.env}QuizzerlambdaLayer`,
      {
        code: lambda.Code.fromAsset(
          path.join(__dirname, '../../../backend-nest/node_modules')
        ),
        compatibleRuntimes: [lambda.Runtime.NODEJS_18_X]
      }
    )

    // Lambda
    const nestLambda = new lambda.Function(this, `${props.env}QuizzerApi`, {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'src/main.handler',
      layers: [layer],
      environment: {
        NODE_PATH: '$NODE_PATH:/opt',
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        REGION: region,
        DB_URL_ID: process.env.DB_URL_ID || '',
        SCRAPE_TO_URL: process.env.SCRAPE_TO_URL || ''
      },
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../../backend-nest/dist')
      )
    })

    // LambdaにSecrets Manager への権限付与
    const stringSecretArn = `arn:aws:secretsmanager:${region}:${accountId}:secret:${
      process.env.DB_URL_ID || ''
    }-${process.env.DB_URL_SUFFIX || ''}`
    const smResource = Secret.fromSecretCompleteArn(
      this,
      'SecretsManager',
      stringSecretArn
    )
    smResource.grantRead(nestLambda)

    // API Gateway
    this.restApi = new apigw.RestApi(this, `NestAppApiGateway`, {
      restApiName: `NestAppApiGw`,
      deployOptions: {
        stageName: 'v1'
      },
      // CORS
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
        allowHeaders: apigw.Cors.DEFAULT_HEADERS,
        statusCode: 200
      }
    })

    // API gateway Usage plan
    const usagePlan = this.restApi.addUsagePlan(`${props.env}apiUsagePlan`, {
      name: `${props.env}apiUsagePlan`,
      throttle: {
        rateLimit: 10,
        burstLimit: 2
      }
    })
    usagePlan.addApiStage({
      api: this.restApi,
      stage: this.restApi.deploymentStage
    })

    // Api Key
    const key = this.restApi.addApiKey('ApiKey')
    usagePlan.addApiKey(key)

    this.restApi.root.addProxy({
      defaultIntegration: new apigw.LambdaIntegration(nestLambda),
      anyMethod: true,
      defaultMethodOptions: {
        apiKeyRequired: true
      }
    })

    // api Domain name
    const apiDomainName = this.restApi.addDomainName(
      `${props.env}ApiDomainName`,
      {
        domainName: process.env.API_DOMAIN_NAME || '',
        certificate: props.apiCertificate,
        endpointType: apigw.EndpointType.EDGE
      }
    )

    // make route53 record to this api domain
    makeRecordsToApigw(
      this,
      process.env.API_DOMAIN_NAME || '',
      apiDomainName,
      props.hostedZone
    )
  }
}
