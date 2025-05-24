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
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
  })
}

export const uploadQuizImageToS3 = async (
  file: Express.Multer.File
): Promise<string> => {
  const bucketName = process.env.NEXT_PUBLIC_QUIZ_IMAGE_S3_BUCKET
  const uploadParams = {
    Bucket: bucketName,
    Key: `uploads/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype
  }
  const s3Client = getS3Client()
  await s3Client.send(new PutObjectCommand(uploadParams))
  return `https://${bucketName}.s3.amazonaws.com/${uploadParams.Key}`
}

export const getQuizImageFromS3 = async (
  fileName: string
): Promise<Readable> => {
  const bucketName = process.env.NEXT_PUBLIC_QUIZ_IMAGE_S3_BUCKET
  console.log('region:', process.env.REGION)
  console.log('bucketName:', bucketName)
  console.log('fileName:', fileName)
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: `uploads/${fileName}`
  })
  const s3Client = getS3Client()
  const response = await s3Client.send(command)
  return response.Body as Readable
}
