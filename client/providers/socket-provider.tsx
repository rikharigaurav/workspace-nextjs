'use client'
import { api } from '@/convex/_generated/api'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { useOrganization, useUser } from '@clerk/nextjs'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface SocketProviderProps {
  children?: React.ReactNode
}

interface ISocketContext {
  sendMessage: (msg: string) => any
}

const SocketContext = React.createContext<ISocketContext | null>(null)

export const useSocket = () => {
  const state = useContext(SocketContext)
  if (!state) throw new Error('state is undefined')
  return state
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>()
  const { organization } = useOrganization()
  const {mutate, pending} = useApiMutation(api.chatApp.createChat)
  const { user } = useUser()
  // const [messages, setMessages] = useState<string[]>([])

  const sendMessage: ISocketContext['sendMessage'] = useCallback(
    (msg) => {
      console.log('Send Message', msg)
      if (socket) {
        socket.emit('event:message', { message: msg, username: user?.username })
      }
    },
    [socket]
  )


  const onMessageRec = useCallback((msg: string) => {
    console.log('From Server Msg Rec', msg)
    const { message, username } = JSON.parse(msg) as { message: string, username: string }
  
    if(username !== user?.username)
      mutate({
        orgId: organization?.id,
        name: username,
        message: message,
      })
    // setMessages((prev) => [...prev, message])
  }, [])

  useEffect(() => {
    const _socket = io('http://localhost:8000')
    _socket.on('message', onMessageRec)

    setSocket(_socket)

    return () => {
      _socket.off('message', onMessageRec)
      _socket.disconnect()
      setSocket(undefined)
    }
  }, [onMessageRec])

  return (
    <SocketContext.Provider value={{ sendMessage }}>
      {children}
    </SocketContext.Provider>
  )
}
