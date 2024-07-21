
'use client'
import { useState } from 'react'
import { useSocket } from '@/providers/socket-provider'

export default function ChatbotPage() {
  const { sendMessage, messages } = useSocket()
  const [message, setMessage] = useState('')

  return (
    <div className='h-full w-full flex items-center justify-center'>
      <div className='flex items-center justify-center'>
        <input
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        
          placeholder='Message...'
        />
        <button
          onClick={() => {
            sendMessage(message)
            setMessage('')
          }}
          className='px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          Send
        </button>
      </div>
      <ul>
        {messages.map((e, index) => (
          <li key={index}>{e}</li>
        ))}
      </ul>
    </div>
  )
}



// 'use client'

// import React, { useState, useEffect } from 'react'

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
// import { User } from 'lucide-react'
// import { useOrganization } from '@clerk/nextjs'
// import { useQuery } from 'convex/react'
// import { api } from '@/convex/_generated/api'
// import { useSocket } from '@/providers/socket-provider'

// // Define the type for organization membership
// type OrganizationMembership = {
//   publicUserData: {
//     firstName: string
//   }
//   role: string
// }

// const ChatApp = () => {
//   const { sendMessage, messages } = useSocket()
//   const [message, setMessage] = useState('')
//   // const { organization } = useOrganization()
//   // const chatHistory = useQuery(api.chatApp.getAll, {
//   //   orgId: organization?.id ?? '',
//   // })
//   // const [members, setMembers] = useState<OrganizationMembership[]>([])

//   // useEffect(() => {
//   //   const fetchMemberships = async () => {
//   //     if (organization) {
//   //       const membership = await organization.getMemberships()
//   //       const data = membership?.data || []
//   //       setMembers(data as OrganizationMembership[]) // Type assertion
//   //     }
//   //   }

//   //   fetchMemberships()
//   // }, [organization])

//   const renderMessages = () => {
//     return chatHistory?.map((message: any, index: number) => (
//       <div
//         key={index}
//         className={`flex ${
//           message.userRole === 'user' ? 'justify-end' : 'justify-start w-[85%]'
//         }`}
//       >
//         <div
//           className={`p-2 my-1 rounded-md ${
//             message.userRole === 'user'
//               ? 'bg-blue-500 text-white'
//               : 'bg-gray-300 text-black'
//           }`}
//         >
//           {messages.map((e) => (
//             <li>{e}</li>
//           ))}
//         </div>
//       </div>
//     ))
//   }

//   return (
//     <div className='p-2 m-4'>
//       <div>
//         <DropdownMenu>
//           <DropdownMenuTrigger className='m-2'>
//             <User />
//           </DropdownMenuTrigger>
//           <DropdownMenuContent>
//             <DropdownMenuLabel>Chat Participants</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             {members.map((member, id) => (
//               <DropdownMenuItem key={id}>
//                 <div className='flex justify-between w-full'>
//                   <span>{member.publicUserData.firstName}</span>
//                   <span className='text-gray-500'>
//                     {member.role.split('org:')[1]}
//                   </span>
//                 </div>
//               </DropdownMenuItem>
//             ))}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//       <div className='p-4'>
//         <div className='overflow-y-scroll max-h-[700px]'>
//           {renderMessages()}
//         </div>
//         <div className='flex items-center justify-center space-x-2 mb-4'>
//           <input
//           onChange={(e) => setMessage(e.target.value)}
//           value={message}
//           placeholder='Message...'
//         />
//         <button
//           onClick={() => {
//             sendMessage(message)
//             setMessage('')
//           }}
//           className='px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
//         >
//           Send
//         </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ChatApp

