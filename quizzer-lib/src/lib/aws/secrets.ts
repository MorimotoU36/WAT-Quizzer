import {
  SecretsManagerClient,
  GetSecretValueCommand
} from '@aws-sdk/client-secrets-manager'

// TODO これ消す　APIkeyはsecrets manager使ってないし　というよりcognito依存方式に切り替えたい
export const getApiKey = async () => {
  if (process.env.NEXT_PUBLIC_API_KEY_VALUE) {
    return process.env.NEXT_PUBLIC_API_KEY_VALUE || ''
  }

  try {
    const client = new SecretsManagerClient({
      region: process.env.NEXT_PUBLIC_REGION || ''
    })
    const params = {
      SecretId: process.env.NEXT_PUBLIC_API_KEY || ''
    }
    const command = new GetSecretValueCommand(params)
    const response = await client.send(command)
    return response.SecretString
      ? (JSON.parse(response.SecretString).API_KEY as string)
      : ''
  } catch (err) {
    return JSON.stringify({ err }, null, 2)
  }
}
