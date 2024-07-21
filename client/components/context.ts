import { Pinecone } from '@pinecone-database/pinecone'
import { getEmbeddings } from './embeddings'

const client = new Pinecone({
  apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
})

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    const pineconeIndex = await client.index('workspace')
    const namespace = await pineconeIndex.namespace(fileKey)

    // Log embeddings and fileKey to ensure they are correct
    console.log('Embeddings:', embeddings)
    console.log('File Key:', fileKey)

    const queryResult = await namespace.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    })

    console.log('Query Result:', queryResult)

    return queryResult.matches || []
  } catch (error) {
    console.log('Error querying embeddings:', error)
    throw error
  }
}

export async function getContext(query: string, fileKey: string[]) {
  try {
    const queryEmbeddings = await getEmbeddings(query)
    console.log('Query Embeddings:', queryEmbeddings)
    console.log('File Key:', fileKey)

    const allDocs = await Promise.all(
      fileKey.map(async (namespace) => {
        console.log('Current namespace', namespace)
        const matches = await getMatchesFromEmbeddings(
          queryEmbeddings,
          namespace
        )
        console.log('Matches:', matches)

        const qualifyingDocs = matches.filter(
          (match) => match.score && match.score > 0.7
        )
        console.log('Qualifying Docs:', qualifyingDocs)
        type Metadata = {
          text: string
          pageNumber: number
        }

        if(qualifyingDocs.length >= 1){
          const docs = qualifyingDocs.map(
            (match) => (match.metadata as Metadata).text
          )
          return docs.join(', ')
        } else {
          const docs = matches.map(
            (match) => (match.metadata as Metadata).text
          )
          return docs.join(', ')
        }
      })
    )

    const concatenatedDocs = allDocs.join(', ').substring(0, 3000)
    console.log('Returning context docs:', concatenatedDocs)
    return concatenatedDocs
  } catch (error) {
    console.log('Error in getContext:', error)
    throw error
  }
}

export async function getContextForFunction(query: string, fileKey: string[]) {
  try {
    const queryEmbeddings = await getEmbeddings(query)
    console.log('Query Embeddings:', queryEmbeddings)
    console.log('File Key:', fileKey)

    const allDocs = await Promise.all(
      fileKey.map(async (namespace) => {
        console.log('Current namespace', namespace)
        const matches = await getMatchesFromEmbeddings(
          queryEmbeddings,
          namespace
        )
        console.log('Matches:', matches)

        type Metadata = {
          text: string
          pageNumber: number
        }

        const docs = matches.map((match) => (match.metadata as Metadata).text)
        return docs.join(', ')
      })
    )

    const concatenatedDocs = allDocs.join(', ').substring(0, 3000)
    console.log('Returning context docs:', concatenatedDocs)
    return concatenatedDocs
  } catch (error) {
    console.log('Error in getContextForFunction:', error)
    throw error
  }
}
