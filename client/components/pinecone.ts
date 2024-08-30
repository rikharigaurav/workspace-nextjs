import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import md5 from 'md5'
import {
  Document,
  RecursiveCharacterTextSplitter,
} from '@pinecone-database/doc-splitter'
import { getEmbeddings } from './embeddings'
import { convertToAscii } from './utils'
import { downloadFromS3 } from '@/lib/s3-server'
import { useStorage } from '@/liveblocks.config'
import { LayerType } from '@/types/canvas'

export const getPineconeClient = () => {
  return new Pinecone({
    apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
  })
}

type PDFPage = {
  pageContent: string
  metadata: {
    loc: { pageNumber: number }
  }
}

const client = getPineconeClient()
console.log("pinecone client" , client)
const pineconeIndex = client.index('workspace')
console.log('pinecone pineconeIndex', pineconeIndex)

export async function loadS3IntoPinecone(fileKey: string) {
  try {
    // 1. Obtain the PDF -> Download and read from S3
    console.log('Downloading S3 file into file system')
    const file_name = await downloadFromS3(fileKey)
    if (!file_name) {
      throw new Error('Could not download from S3')
    }
    console.log('Loading PDF into memory:', file_name)
    const loader = new PDFLoader(file_name)
    const pages = (await loader.load()) as PDFPage[]

    // 2. Split and segment the PDF
    console.log('Splitting and segmenting the PDF')
    const documents = await Promise.all(pages.map(prepareDocument))

    // 3. Vectorize and embed individual documents
    console.log('Vectorizing and embedding documents')
    const vectors = await Promise.all(documents.flat().map(embedDocument))

    // 4. Upload to Pinecone
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey))

    console.log('Inserting vectors into Pinecone')
    await namespace.upsert(vectors)

    console.log('Successfully uploaded vectors to Pinecone')
    return documents[0]
  } catch (error) {
    console.error('Error in loadS3IntoPinecone:', error)
    throw error
  }
}


async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent)
    const hash = md5(doc.pageContent)

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord
  } catch (error) {
    console.error('Error embedding document:', error)
    throw error
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder()
  return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes))
}

async function prepareDocument(page: PDFPage) {
  try {
    let { pageContent, metadata } = page
    pageContent = pageContent.replace(/\n/g, '')
    // Split the docs
    const splitter = new RecursiveCharacterTextSplitter()
    const docs = await splitter.splitDocuments([
      new Document({
        pageContent,
        metadata: {
          pageNumber: metadata.loc.pageNumber,
          text: truncateStringByBytes(pageContent, 36000),
        },
      }),
    ])
    return docs
  } catch (error) {
    console.error('Error preparing document:', error)
    throw error
  }
}


// Code for loading text to pinecone
export async function loadCanvasToPinecone(
  boardname: string,
  values: string[]
) {
  const BoardNamespaceName = `BOARD/${boardname}`
  try {
    console.log('Loading boardID and data:', BoardNamespaceName, values)

    // Embed texts and prepare records
    const vectors = await Promise.all(
      values.map((text) => embedText(text, boardname))
    )
    console.log('Vectors of the text:', vectors)

    // Upload to Pinecone
    const namespace = pineconeIndex.namespace(BoardNamespaceName)
    console.log('Namespace:', namespace)

    const response = await namespace.upsert(vectors)
    console.log('Vectors uploaded to Pinecone:', response)

    console.log('Successfully uploaded vectors to Pinecone')
  } catch (error) {
    console.error('Error in loadCanvasToPinecone:', error)
    throw error
  }
}

// Function to embed a single text and prepare Pinecone record
async function embedText(text: string, boardname: string) {
  try {
    console.log('Text being processed:', text)

    // Get embeddings
    const embeddings = await getEmbeddings(text)
    console.log('Embeddings:', embeddings)

    // Create hash ID
    const hash = md5(text)
    console.log('Hash:', hash)

    // Prepare Pinecone record
    const record: PineconeRecord = {
      id: hash,
      values: embeddings,
      metadata: {
        text: truncateStringByBytesforBoard(text, 3600), // Ensure text fits within byte limit
        boardname: boardname,
      },
    }
    console.log('Pinecone Record:', record)

    return record
  } catch (error) {
    console.error('Error embedding document:', error)
    throw error
  }
}

// Function to truncate text by bytes to fit within the limit
export const truncateStringByBytesforBoard = (str: string, bytes: number) => {
  const enc = new TextEncoder()
  return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes))
}
