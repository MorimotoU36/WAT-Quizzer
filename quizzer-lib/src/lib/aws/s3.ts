import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { Readable } from 'stream'
import * as dotenv from 'dotenv'

dotenv.config()

export const getS3Client = () => {
  return new S3Client({
    region: process.env.REGION || '',
    credentials: {
      accessKeyId: process.env.AKEY || '',
      secretAccessKey: process.env.SAKEY || ''
    }
  })
}

export const uploadQuizImageToS3 = async (
  file: Express.Multer.File
): Promise<string> => {
  const bucketName = process.env.QUIZ_IMAGE_S3_BUCKET
  const uploadParams = {
    Bucket: bucketName,
    Key: `uploads/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype
  }
  console.log('upload img buffer length:' + file.buffer.length)
  console.log('upload img buffer byteLength:' + file.buffer.byteLength)
  const s3Client = getS3Client()
  await s3Client.send(new PutObjectCommand(uploadParams))
  return `https://${bucketName}.s3.amazonaws.com/${uploadParams.Key}`
}

export const getQuizImageFromS3 = async (fileName: string): Promise<Buffer> => {
  const bucketName = process.env.QUIZ_IMAGE_S3_BUCKET
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: `uploads/${fileName}`
  })
  const s3Client = getS3Client()
  const response = await s3Client.send(command)
  const stream = response.Body as Readable
  const chunks: Uint8Array[] = []

  for await (const chunk of stream) {
    chunks.push(chunk as Uint8Array)
  }
  return Buffer.concat(chunks)
}
