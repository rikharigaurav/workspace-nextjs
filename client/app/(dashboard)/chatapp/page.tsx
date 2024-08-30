'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Pinecone } from '@pinecone-database/pinecone'
import { useOrganization } from '@clerk/nextjs'
import { QuizDialog } from './_components/QuizFormat'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { request } from 'https'

type QuizQuestion = {
  question: string
  choices: string[]
  answer: string
  topic: string
}

const getPineconeClient = new Pinecone({
  apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
})

const ChatbotPage = () => {
  const { mutate } = useApiMutation(api.chatBot.createChat)
  const { mutate: addDocs } = useApiMutation(api.document.Createdoc)
  const [selectedNamespaces, setSelectedNamespaces] = useState<string[]>([])
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [namespaces, setNamespaces] = useState<string[]>([])
  const [textValue, setTextValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [functionValue, setFunctionValue] = useState('NO FUNCTION SELECTED')
  const { organization } = useOrganization()
  
  // const request = new XMLHttpRequest()

  // Fetch messages from the database
  const data = useQuery(api.chatBot.getAll, { orgId: organization?.id ?? '' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPineconeClient
          .index('workspace')
          .describeIndexStats()

        if (response && response.namespaces) {
          const names = Object.keys(response.namespaces)
          setNamespaces(names)
        } else {
          setNamespaces([])
        }
      } catch (error) {
        console.error('Error fetching namespaces:', error)
        setNamespaces([])
      }
    }

    fetchData()
  }, [])

  const handleFunctionSelect = (func: string) => {
    setFunctionValue(func)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const createChat = await mutate({
      orgId: organization?.id ?? '',
      message: textValue,
      userRole: 'user',
    })

    console.log('chat update to db', createChat)

    try {
      const response = await axios.post('/api/chatbot', {
        organization: organization?.id,
        value: selectedNamespaces,
        func: functionValue,
        message: textValue,
      })

      setTextValue('')
      // console.log('the message', response.data)
      // console.log('the axios response is ', response)

      if (functionValue === 'CreateQuiz' && response.data.message) {
        setQuizQuestions(response.data.message)
        setDialogOpen(true)
      } else if (functionValue === 'CreatePPT' && response.data) {
        console.log('the file response', response.data)
        console.log('the file response data pptxBlob', response.data.pptxBlob)

        const pptxBlob = response.data.pptxBlob

        console.log('The PPTX Blob is', pptxBlob)
        const url = URL.createObjectURL(pptxBlob)
        console.log('the url is ', url)
        const link = document.createElement('a')
        link.href = url
        link.download = 'generated.pptx'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        addDocs({
          orgId: organization?.id,
          Filename: 'ChatBot_PPT',
          documenturl: link.toString(),
          filekey: 'ChatBot_ppt',
        })
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
      setTextValue('') // Reset the input field after sending the message
    }
  }

  const handleSelect = (namespace: string) => {
    setSelectedNamespaces((prev) =>
      prev.includes(namespace)
        ? prev.filter((ns) => ns !== namespace)
        : [...prev, namespace]
    )
  }

  const renderMessages = () => {
    return data?.map((message: any, index: number) => (
      <div
        key={index}
        className={`flex ${
          message.userRole === 'user' ? 'justify-end ' : 'justify-start w-[85%]'
        }`}
      >
        <div
          className={`p-2 my-1 rounded-md ${
            message.userRole === 'user'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-black'
          }`}
        >
          {message.message}
        </div>
      </div>
    ))
  }

  return (
    <div className='flex flex-col gap-2 w-full h-full'>
      <div className='grid grid-cols-2 gap-4 p-1'>
        <Select onValueChange={handleFunctionSelect} value={functionValue}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select Function' />
          </SelectTrigger>
          <SelectContent className='w-full'>
            {[
              'NO FUNCTION SELECTED',
              'SetEventAtCalendar',
              'CreatePPT',
              'CreateQuiz',
            ].map((func) => (
              <SelectItem key={func} value={func}>
                {func}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className='w-full'>
            <SelectValue
              placeholder={
                selectedNamespaces.length > 0
                  ? selectedNamespaces.join(', ')
                  : 'Select Namespaces'
              }
            />
          </SelectTrigger>
          <SelectContent className='w-full'>
            {namespaces.map((namespace) => (
              <div
                key={namespace}
                className='command-item flex p-2 gap-x-2 cursor-pointer items-center'
                onClick={() => handleSelect(namespace)}
              >
                <Checkbox checked={selectedNamespaces.includes(namespace)} />
                {namespace}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='flex flex-col items-center justify-center w-full '>
        <div className='overflow-y-scroll max-h-[620px] min-w-full min-h-[620px] p-2 border border-black rounded-md'>
          {renderMessages()}
        </div>
        <div
          className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 w-full'
          id='message-container'
        >
          <form
            onSubmit={handleSubmit}
            className='sticky bottom-0 inset-x-0 px-2 py-4 bg-white shadow-md rounded-t-lg'
          >
            <div className='flex items-center w-full gap-x-2'>
              <Input
                value={textValue}
                onChange={handleInputChange}
                placeholder='Ask any question...'
                className='flex-grow'
              />
              <Button
                type='submit'
                className='bg-blue-600 ml-2 flex items-center'
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : <Send className='h-4 w-4' />}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <QuizDialog
        QuizArray={quizQuestions}
        open={dialogOpen}
        setOpen={setDialogOpen}
      />
    </div>
  )
        }

export default ChatbotPage
