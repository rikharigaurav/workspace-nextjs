import { PutObjectCommandOutput, S3 } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'

dotenv.config()

export async function uploadToS3(
  file: File
): Promise<{ file_key: string; file_name: string }> {
  return new Promise((resolve, reject) => {
    try {
      const s3 = new S3({
        region: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION!,
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY!,
          secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
        },
      })

      const file_key =
        'DOCS/' +  file.name.replace(' ', '-')

      const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
        Key: file_key,
        Body: file,
      }

      s3: console.log('Uploading file to s3.......!')
      s3.putObject(
        params,
        (err: any, data: PutObjectCommandOutput | undefined) => {
          return resolve({
            file_key,
            file_name: file.name,
          })
        }
      )
    } catch (error) {
      reject(error)
    }
  })
}

export async function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${file_key}`
  return url
}


