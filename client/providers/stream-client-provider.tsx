'use client'

import { ReactNode, useEffect, useState } from 'react'
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk'
import { useUser } from '@clerk/nextjs'

import { tokenProvider } from '@/actions/stream.actions'
import Loader from '@/components/Loader'

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY

export const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>()
  const { user, isLoaded } = useUser()
  // console.log("User: ", user, "isLOoaded: ", isLoaded)

  useEffect(() => {
    if (!isLoaded || !user) return
    if (!API_KEY) throw new Error('Stream API key is missing')

    const client = new StreamVideoClient({
      apiKey: API_KEY,
      user: {
        id: user?.id,
        name: user?.username || user?.id,
        image: user?.imageUrl,
      },
      tokenProvider,
    })
    // console.log("Client : ", client)

    setVideoClient(client)
    // console.log("Video CLient", videoClient)
  }, [user, isLoaded])

  if (!videoClient) {
    // console.log(user)
    return (
    <Loader/>
  )}

  return <StreamVideo client={videoClient}>{children}</StreamVideo>
}


