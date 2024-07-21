import { loadCanvasToPinecone } from '@/components/pinecone'
import { NextResponse } from 'next/server'

// /api/updateDB
export async function POST(req: Request) {
  try {
    console.log('help')

    const body = await req.json()
    const { boardname, value } = body

    // Validate request body
    if (!boardname || !Array.isArray(value)) {
      return NextResponse.json(
        {
          error:
            'Bad Request: boardId and value are required and value must be an array',
        },
        { status: 400 }
      )
    }
    console.log('Received data', { boardname, value })

    console.log("Sending data to pinecone")
    await loadCanvasToPinecone(boardname, value)
    return NextResponse.json(
      { message: 'Data logged successfully' },
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
