'use client'
import { useEffect, useState } from 'react'
import { useSocket } from '@/providers/socket-provider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Send, User } from 'lucide-react'
import { useOrganization, useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
// import { currentUser as getCurrentUser } from '@clerk/nextjs/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApiMutation } from '@/hooks/use-api-mutation'
// import { useUser } from "@clerk/clerk-react"

// Define the type for organization membership
type OrganizationMembership = {
  publicUserData: {
    firstName: string
  }
  role: string
}

// Define the type for messages
type Message = {
  userId: string
  content: string
}

export default function ChatbotPage() {
  const { sendMessage } = useSocket()
  const [message, setMessage] = useState('')
  const { organization, memberships } = useOrganization()
  const chatHistory = useQuery(api.chatApp.getAll, {
    orgId: organization?.id ?? '',
  })
  const [members, setMembers] = useState<OrganizationMembership[]>([])
  // const [currentUser, setCurrentUser] = useState<any>(null)
  const {mutate, pending} = useApiMutation(api.chatApp.createChat)
  const { isSignedIn, user } = useUser()

  useEffect(() => {
    const fetchMemberships = async () => {
      if (organization) {
        const membership = await organization.getMemberships()
        const data = membership?.data || []
        setMembers(data as OrganizationMembership[]) // Type assertion
      }
    }


    fetchMemberships()
    // fetchCurrentUser()
  }, [organization])

  const onClick = async () => {
    console.log("the message: ", message)

    // mutate({
    //   orgId: organization?.id,
    //   name: user?.username,
    //   message: message,
    // })

console.log("current usernmae", user?.username)
    sendMessage(message)
    setMessage('')
  }

  const renderMessages = () => {
    return chatHistory?.map((message: any, index: number) => (
      <div
        key={index}
        className={`flex ${
          message.name === user?.username
            ? 'justify-end'
            : 'justify-start w-[85%]'
        }`}
      >
        <div
          className={`p-2 my-2 rounded-lg ${
            message.name === user?.username
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-black'
          } max-w-xs relative`}
        >
          {user?.username !== message.name && (
            <div className='absolute -top-3 left-0 text-xs text-gray-600 bg-white rounded px-1'>
              {message.name}
            </div>
          )}
          <div className='text-sm'>{message.message}</div>
        </div>
      </div>
    ))
  }

  return (
    <div className='h-full w-full flex items-center justify-center flex-col gap-y-2'>
      <div className=' flex flex-row border border-black rounded-md'>
        <DropdownMenu>
          <DropdownMenuTrigger className='m-2'>
            <User />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Chat Participants</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {members.map((member, id) => (
              <DropdownMenuItem key={id}>
                <div className='flex justify-between w-full'>
                  <span>{member.publicUserData.firstName}</span>
                  <span className='text-gray-500'>
                    {member.role.split('org:')[1]}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='flex flex-col items-center justify-center w-full gap-y-2'>
        <div className='overflow-y-scroll max-h-[620px] min-w-full min-h-[620px] p-2 border border-black rounded-md'>
          {renderMessages()}
        </div>
        <div
          className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 w-full'
          id='message-container'
        >
          <div className='flex items-center w-full gap-x-2'>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Ask any question...'
              className='flex-grow'
            />
            <Button
              type='submit'
              className='bg-blue-600 ml-2 flex items-center'
              onClick={() => (onClick())}
            >
              <Send className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
