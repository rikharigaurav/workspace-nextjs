import { loadS3IntoPinecone } from '@/components/pinecone'
// import { cu } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

// /api/create-chat
export async function POST(req: Request) {
  try {
    // const { userId } = await auth()
    // if (!userId) {
    //   return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    // }

    const body = await req.json()
    const { file_key, file_name } = body

    // Validate request body
    if (!file_key || !file_name) {
      return NextResponse.json(
        { error: 'Bad Request: Missing file_key or file_name' },
        { status: 400 }
      )
    }

    console.log('Received file_key:', file_key)
    console.log('Received file_name:', file_name)

    // Log entry point of loadS3IntoPinecone
    console.log('Calling loadS3IntoPinecone with file_key:', file_key)
    await loadS3IntoPinecone(file_key)
    console.log('Successfully called loadS3IntoPinecone')

    return NextResponse.json(
      { message: 'File uploaded successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing the request:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error },
      { status: 500 }
    )
  }
}
