import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as dotenv from 'dotenv'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as apigw from 'aws-cdk-lib/aws-apigateway'

dotenv.config()

type BackendStackProps = {
  env: string
  hostedZone: route53.HostedZone
}

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, {
      env: { region: process.env.REGION || '' },
      crossRegionReferences: true
    })

    // SAM  API
    apigw.RestApi.fromRestApiId(
      this,
      'SamBackendApi',
      process.env.SAM_APIGATEWAY_ID || ''
    )
  }
}
