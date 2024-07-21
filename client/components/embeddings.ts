import { CohereEmbeddings } from '@langchain/cohere'

// const config = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const embeddings = new CohereEmbeddings({
  apiKey: process.env.NEXT_PUBLIC_COHERE_API_KEY, // In Node.js defaults to process.env.COHERE_API_KEY
  batchSize: 48, // Default value if omitted is 48. Max value is 96
})

// const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
  try {
    // const response = await openai.createEmbedding({
    //   model: "text-embedding-ada-002",
    //   input: text.replace(/\n/g, " "),
    // });    
    const res = embeddings.embedQuery(text)
    console.log(res)
    return res

    // const result = await response.json();
    // return result.data[0].embedding as number[];
  } catch (error) {
    console.log("error calling openai embeddings api", error);
    throw error;
  }
}
