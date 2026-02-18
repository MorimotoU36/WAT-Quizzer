import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as dotenv from 'dotenv'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'

dotenv.config()

type BackendStackProps = {
  env: string
  hostedZone: route53.HostedZone
}

export class BackendStack extends cdk.Stack {
  readonly todoCheckStatusTable: dynamodb.Table

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

    // DynamoDB Table for Todo check status
    // Partition key: userId (Cognito user ID)
    // Sort key: date (YYYY-MM-DD format)
    // Attributes: completedTodoIds (array of completed Todo IDs)
    this.todoCheckStatusTable = new dynamodb.Table(this, `${props.env}TodoCheckStatusTable`, {
      tableName: `${props.env}-todo-check-status`,
      partitionKey: {
        name: 'userId',
        type: dynamodb.AttributeType.STRING
      },
      sortKey: {
        name: 'date',
        type: dynamodb.AttributeType.STRING
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: false
    })
  }
}
