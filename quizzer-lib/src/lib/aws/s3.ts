import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import * as dotenv from 'dotenv'

dotenv.config()

export const uploadQuizImageToS3 = async (
  file: Express.Multer.File
): Promise<string> => {
  const imageS3Bucketname = process.env.QUIZ_IMAGE_S3_BUCKET
  const imageS3 = new S3Client({
    region: process.env.AWS_REGION || '',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
  })

  const uploadParams = {
    Bucket: imageS3Bucketname,
    Key: `uploads/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype
  }

  await imageS3.send(new PutObjectCommand(uploadParams))

  return `https://${imageS3Bucketname}.s3.amazonaws.com/${uploadParams.Key}`
}
