'use server'

import { S3 } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'
import os from 'os'

const s3 = new S3({
  region: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
})

export async function downloadFromS3(file_key: string): Promise<string> {
  try {

    console.log(s3)
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: file_key,
    }
    console.log(params)
    

    const obj = await s3.getObject(params)
    console.log("getobject", obj)

    const downloadsPath = path.join(os.homedir(), 'Downloads')
    const file_name = path.join(downloadsPath, `${Date.now().toString()}.pdf`)
    // const file_name = `Users/gaura/Downloads/${Date.now().toString()}.pdf`

    if (obj.Body instanceof require("stream").Readable) {
      console.log('Downloading file from S3:', file_key)

      const file = fs.createWriteStream(file_name)
      // file.on('open', function (fd) {
      //   // @ts-ignore
      //   obj.Body?.pipe(file).on('finish', () => {
      //     return file_name
      //   })
      // })

      // @ts-ignore
      const downloadStream = obj.Body?.pipe(file)

      // Wait for the download to finish
      await new Promise<void>((resolve, reject) => {
        downloadStream.on('finish', () => {
          console.log('Successfully downloaded file:', file_name)
          resolve()
        })
          downloadStream.on('error', reject)
        })

      return file_name
    } else {
      throw new Error('S3 object body is not a readable stream')
    }
  } catch (error) {
    console.error('Error downloading from S3:', error)
    throw new Error('Access Denied or other error')
  }
}
