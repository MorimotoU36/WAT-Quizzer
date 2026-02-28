import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as dotenv from 'dotenv'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as iam from 'aws-cdk-lib/aws-iam'

dotenv.config()

type BackendStackProps = {
  env: string
  hostedZone: route53.HostedZone
  lambdaFunctionRoleArn?: string
}

export class BackendStack extends cdk.Stack {
  readonly todoCheckStatusTable: dynamodb.Table
  readonly lambdaDynamoDBPolicy: iam.Policy

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
    this.todoCheckStatusTable = new dynamodb.Table(
      this,
      `${props.env}TodoCheckStatusTable`,
      {
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
      }
    )

    // Lambda関数用のDynamoDBアクセスポリシーを作成
    // 注意: SAM template.yamlでLambda関数のIAMロールARNを指定する必要があります
    if (props.lambdaFunctionRoleArn) {
      const lambdaRole = iam.Role.fromRoleArn(
        this,
        'LambdaFunctionRole',
        props.lambdaFunctionRoleArn
      )

      this.lambdaDynamoDBPolicy = new iam.Policy(
        this,
        `${props.env}LambdaDynamoDBPolicy`,
        {
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'dynamodb:GetItem',
                'dynamodb:PutItem',
                'dynamodb:UpdateItem',
                'dynamodb:DeleteItem',
                'dynamodb:Query'
              ],
              resources: [this.todoCheckStatusTable.tableArn]
            })
          ]
        }
      )

      lambdaRole.attachInlinePolicy(this.lambdaDynamoDBPolicy)
    } else {
      // Lambda関数のIAMロールARNが指定されていない場合、ポリシーのみ作成
      // SAM template.yamlで手動でアタッチする必要があります
      this.lambdaDynamoDBPolicy = new iam.Policy(
        this,
        `${props.env}LambdaDynamoDBPolicy`,
        {
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'dynamodb:GetItem',
                'dynamodb:PutItem',
                'dynamodb:UpdateItem',
                'dynamodb:DeleteItem',
                'dynamodb:Query'
              ],
              resources: [this.todoCheckStatusTable.tableArn]
            })
          ]
        }
      )
    }

    // スタック出力にポリシーARNを追加（SAM template.yamlで参照可能にするため）
    new cdk.CfnOutput(this, 'LambdaDynamoDBPolicyArn', {
      value: this.lambdaDynamoDBPolicy.node.addr,
      description:
        'IAM Policy ID for Lambda function to access DynamoDB Todo check status table'
    })

    new cdk.CfnOutput(this, 'TodoCheckStatusTableArn', {
      value: this.todoCheckStatusTable.tableArn,
      description: 'DynamoDB Table ARN for Todo check status'
    })
  }
}
