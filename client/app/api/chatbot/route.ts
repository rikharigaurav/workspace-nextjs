  // FILE: api/chatbot/route.ts
  import { ChatMistralAI } from '@langchain/mistralai';
  import { streamObject } from 'ai';
  import { JsonOutputParser } from '@langchain/core/output_parsers';
  import { RunnableSequence } from '@langchain/core/runnables';
  import { StructuredOutputParser } from '@langchain/core/output_parsers';
  import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
  import { getContext, getContextForFunction } from '@/components/context';
  import { z } from 'zod';
  import { fetchMutation, fetchQuery } from 'convex/nextjs'
  import { mistral } from '@ai-sdk/mistral'

import { api } from '@/convex/_generated/api';
import axios from 'axios';
import { NextResponse } from 'next/server';

type ResponseData = {
   message: string
 }

  const llm = new ChatMistralAI({
    model: 'mistral-large-latest',
    temperature: 0,
  })

  export async function POST(req: Request) {
    // Process a POST request
    const { message, value, func, organization } = await req.json()

    console.log('the message', message)
    console.log("value", value)
    console.log("function", func)
    console.log("organization", organization)
    

    if (func === 'SetEventAtCalendar') {
        const zodSchema = z.array(
         z.object({
           title: z.string().describe('Title of the event'),
           description: z.string().describe('Description of the event'),
           date: z.string().describe('Date of the event'),
           time: z.string().describe('Time of the event'),
         })
       )

       const parser = StructuredOutputParser.fromZodSchema(zodSchema)

      const userMessage = `Extract important events from a PDF file and provide the following information for each event: * Title: [event title] * Description: [event description]`

      const context = await getContextForFunction(userMessage, value)

      const prompt = `
      Given the context data from the file and any additional information provided by the user, extract and list all events comprehensively in the following format:

      The output should be in the form of an array of objects containing key-value pairs with keys as title, description, date, and time for each event.
      
     Ensure that the response includes all types of events, such as:
      - Lectures
      - Quizzes
      - Exams
      - Holidays
      - Project deadlines
      - Meetings
      - Workshops
      - Seminars
      - Conferences
      - Company events
      - Webinars
      - Training sessions
      - Social events
      - Sports events
      - Cultural events
      - Miscellaneous activities (mentioning any specific event types if provided in the context)

      If the file does not contain this type of information, return "no such info found".

      Context:
      ${context}

      Additional Information:
      {question}

      {format_Instructions}

      NOTE: 
      1. include all the events created
      2. Update the date format to DD/MM/YYYY
      3. if are given no instruction regarding time update the time to an average office time [9:00AM-5:00PM]
      4. Do not add any comment or anything other than the given json out parser
      `

      console.log('The prompt is', prompt)

      // const chain = ChatPromptTemplate.fromTemplate(prompt).pipe(llm).pipe(parser);
      const chain = RunnableSequence.from([
        ChatPromptTemplate.fromTemplate(prompt),
        llm,
        parser,
      ])

      console.log(
        'the parser getformatinformation',
        parser.getFormatInstructions()
      )
      console.log('the chain created', chain)

      const result = await chain.invoke({
        question: message,
        format_Instructions: parser.getFormatInstructions(),
      })

      console.log('The output', result)

      for (const event of result) {
        await fetchMutation(api.calendar.create, {
          orgId: organization,
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
        })
      }
      
      const createChat = await fetchMutation(api.chatBot.createChat, {
        orgId: organization,
        message: 'All Important Events are scheduled',
        userRole: 'server',
      })
      
      return NextResponse.json({
            message: result
      })
    
      // const stream = new ReadableStream({
      //   async start(controller) {
      //     const textChunk = JSON.stringify(result)
      //     console.log(textChunk)
      //     controller.enqueue(new TextEncoder().encode(textChunk))
      //     controller.close()
      //   },
      // })
    } else if (func === 'CreatePPT') {
      const zodSchema = z.array(
        z.object({
          name: z.string().describe('Slide title'),
          content: z.string().describe('Slide description (50-60 words)'),
        })
      )

    try{

      const parser = StructuredOutputParser.fromZodSchema(zodSchema)

      const userMessage = `Create a 5-slide presentation summary based on the provided text. Each slide should have a title and a brief description (approximately 50-60 words).`

      const Funccontext = await getContextForFunction(userMessage, value)
      const formatInstructions = parser.getFormatInstructions()

      const prompt = `
          Create a summary of the context given and seperate the context accroding to there importance. Then Add your knowledge to enhance the content for the topic or if enough leave the context alone. 
          Use your own knowledge and decide weather to change the paragraph or to create bullet points for that content and etc.

          Generate a 5-slide presentation based on the summary of the following context: {context} Each slide should have a name and a content description which should be in context to the Documentation or the Canvas board (50-60 words). 

          
          The output should be in the form of an array of objects containing key-value pairs with keys as 'name' and 'content' for each slide.

          The content should be related to the slide name and the content should be atleat 50 words. Seperate paragraph where you need them. If the content is not much for the slide name either skip it or add more content by researching your llm  

          Additional Information:
          {question}

          {format_Instructions}

          NOTE:
          1. Do not add too much extra info.
          2. Focus on creating the content from the Docs and the canvas directly.
          3. The content should not be a brief note it should explain the name of the slide, and if the content is less add your words making it a nice 60-70 words paragraph
          `

      console.log('The prompt is', prompt)

      const chain = RunnableSequence.from([
        ChatPromptTemplate.fromTemplate(prompt),
        llm,
        parser,
      ])

      console.log(
        'The parser format instructions:',
        parser.getFormatInstructions()
      )
      console.log('The chain created:', chain)

      const slides = await chain.invoke({
        context: Funccontext,
        question: message,
        format_Instructions: parser.getFormatInstructions(),
      })

      console.log('ReWrite the Prompt', prompt)
      console.log('The output:', slides)

      console.log(
        'The first slide is: \n SLIDE TITLE',
        slides[0].name,
        '\n SLIDE CONTENT',
        slides[0].content
      )

      const jsonData = {
        'presentation': {
          'template':
            'https://drive.google.com/uc?export=download&id=1rTGWx5f6qHhZrS5eUgDLZNrFcd_aM8UX',
          'export_version': 'Pptx2010',
          'resultFileName': 'Bot_File',
          'slides': slides.map((slide, index) => ({
            'type': 'slide',
            'slide_index': index,
            'shapes': [
              { 'name': 'Subtitle 2', 'content': slide.content },
              { 'name': 'Title 1', 'content': slide.name },
            ],
          })),
        },
      }
      console.log('The jsonData', JSON.stringify(jsonData, null, 2))

      // const formData = new FormData()
      // formData.append('jsonData', JSON.stringify(jsonData))
      // console.log("The form data is ", formData)
    //   // Send the request
    //   const response = await axios.post(
    //   'https://gen.powerpointgeneratorapi.com/v1.0/generator/create',
    //   formData,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${process.env.PPT_TOKEN_BEARER}`,
    //       'Content-Type': 'multipart/form-data',
    //     },
    //     responseType: 'blob',
    //   }
    // )

    // const pptxBlob = new Blob([response.data], {
    //   type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // })

    // const arrayBuffer = await pptxBlob.arrayBuffer()
    // const base64String = btoa(
    //   String.fromCharCode(...new Uint8Array(arrayBuffer))
    // )

    // console.log('hte PPTBLOb data is ', pptxBlob)
    // console.log("the arrayBuffer ", arrayBuffer)
    // // console.log("the response data being sent is ", response.data)

    

    // await fetchMutation(api.chatBot.createChat, {
    //   orgId: organization,
    //   message: 'PPT is Ready',
    //   userRole: 'server',
    // })

    // console.log("The pptx Blov ", pptxBlob)

    return NextResponse.json({
      message: 'PPT created successfully',
      jsonData: jsonData,
    })
    } catch(error: any) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log('Error data:', error.response.data)
            console.log('Error status:', error.response.status)
            console.log('Error headers:', error.response.headers)
          } else if (error.request) {
            // The request was made but no response was received
            console.log('Error request:', error.request)
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error message:', error.message)
          }
          console.error('Error creating PowerPoint:', error)
        }
    } else if (func === 'CreateQuiz') {

        console.log("function Quiz")
        const zodSchema = z.array(
          z.object({
            question: z.string().describe('Quiz question'),
            choices: z.array(z.string()).length(4).describe('Array of 4 choices'),
            answer: z.string().describe('Correct answer to the question'),
            topic: z.string().describe('Topic of the question'),
          })
        )

        const parser = StructuredOutputParser.fromZodSchema(zodSchema)

        const userMessage = `Create a quiz with 10 questions, ensuring an equal number of questions from all topics. Each question should have 4 choices.`

        // interface QuizQuestion {
        //   question: string
        //   choices: string[]
        //   answer: string
        //   topic: string
        // }
        const context = await getContextForFunction(userMessage, value)
        const formatInstructions = parser.getFormatInstructions()

        const prompt = `
        
        Generate 5 multiple-choice questions with 4 options each for the following context: [Insert the given context here] Each question should be in the format: [Question statement] with 4 possible answers: [Option A], [Option B], [Option C], [Option D] and there [ANSWER] and [TOPIC] Please ensure the questions are clear, concise, and accurate, and that the options are plausible and well-written. The questions should be strictly from the context only

        The output should be in the form of an array of objects containing key-value pairs with keys as 'question', 'choices', 'answer', and 'topic' for each question.

        Context:
          ${context}

          Additional Information:
          {question}

          {format_Instructions}
          `

        console.log('The prompt is', prompt)

        const chain = RunnableSequence.from([
          ChatPromptTemplate.fromTemplate(prompt),
          llm,
          parser,
        ])

        console.log(
          'The parser format instructions:',
          parser.getFormatInstructions()
        )
        console.log('The chain created:', chain)

        const stream = await chain.invoke({
          question: message,
          format_Instructions: parser.getFormatInstructions(),
        })

        console.log('the result is', stream)

        await fetchMutation(api.chatBot.createChat, {
          orgId: organization,
          message: 'The Quiz is Ready',
          userRole: 'server',
        })


        return NextResponse.json({
          message: stream
        })
      
    } else {

      const context = await getContext(message, value)
      console.log('The Context of file is ', context)

      const prompt = `Compose a prompt for an LLM model that takes a provided file as input, extracts relevant context from it, and uses that context to generate a response. If a file is not provided, the prompt should instruct the model to search for relevant information on its own. In either case, if the model is unable to find an answer, it should apologize for not providing an answer and conclude its response. Please generate a prompt that meets these specifications. If a file is provided, use the text within it to inform your response. If no file is provided, draw upon your internal knowledge database to search for relevant information. If, after searching, you are unable to find a suitable answer, please acknowledge this and apologize for not being able to provide an answer
          ${context}

          ${message}
          `

      console.log('The message is ', message)
      const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
        ['system', prompt],
        new MessagesPlaceholder('chat_history'),
        ['human', message],
      ])

      const result = await llm.invoke(prompt)

      console.log("the resutl", result.content)

    await fetchMutation(api.chatBot.createChat, {
      orgId: organization,
      message: JSON.stringify(result.content),
      userRole: 'server',
    })
    // 

    return new Response('', {
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
}