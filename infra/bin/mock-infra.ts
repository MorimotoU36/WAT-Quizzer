#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { MockStack } from '../lib/stack/mock-stack'

const app = new cdk.App()

// モック環境専用のスタックのみを定義
new MockStack(app, 'MockStack', {})
