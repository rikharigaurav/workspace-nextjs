'use client'
import { useEffect, useState } from 'react'
import {
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-sdk'

import Alert from './Alert'
import { Button } from '@/components/ui/button'

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void
}) => {
  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks()
  const callStartsAt = useCallStartsAt()
  const callEndedAt = useCallEndedAt()
  const callTimeNotArrived = callStartsAt && new Date(callStartsAt) > new Date()
  const callHasEnded = !!callEndedAt

  const call = useCall()

  if (!call) {
    throw new Error('useStreamCall must be used within a StreamCall component.')
  }

  const [isMicCamToggled, setIsMicCamToggled] = useState(false)

  useEffect(() => {
    if (isMicCamToggled) {
      call.camera.disable()
      call.microphone.disable()
    } else {
      call.camera.enable()
      call.microphone.enable()
    }
  }, [isMicCamToggled, call.camera, call.microphone])

  if (callTimeNotArrived)
    return (
      <Alert
        title={`Your Meeting has not started yet. It is scheduled for ${callStartsAt.toLocaleString()}`}
      />
    )

  if (callHasEnded)
    return (
      <Alert
        title='The call has been ended by the host'
        iconUrl='/icons/call-ended.svg'
      />
    )

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center gap-6 bg-gray-100 text-gray-900'>
      <h1 className='text-3xl font-bold'>Meeting Setup</h1>
      <VideoPreview className='w-full max-w-md rounded-lg shadow-md' />
      <div className='flex flex-col items-center justify-center gap-4'>
        <label className='flex items-center gap-2 text-lg font-medium'>
          <input
            type='checkbox'
            checked={isMicCamToggled}
            onChange={(e) => setIsMicCamToggled(e.target.checked)}
          />
          Turn Off Mic and Camera
        </label>
        <DeviceSettings  />
      </div>
      <Button
        className='rounded-lg bg-blue-600 text-white px-6 py-3 hover:bg-blue-700'
        onClick={() => {
          call.join()
          setIsSetupComplete(true)
        }}
      >
        Join Meeting
      </Button>
    </div>
  )
}

export default MeetingSetup
