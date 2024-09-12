'use client'
import { useState } from 'react'
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-sdk'
import { useRouter, useSearchParams } from 'next/navigation'
import { Users, LayoutList, CalendarRange, MessageSquare } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Loader from '@/components/Loader'
import EndCallButton from './EndCallButton'
import { cn } from '@/lib/utils'
import { TranscriptionSettingsModeEnum } from '@stream-io/node-sdk'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer'
import CalendarPage from '@/app/calendar/page'
import ChatbotPage from '@/app/dashboard/chatapp/page'

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right'

const MeetingRoom = () => {
  const searchParams = useSearchParams()
  const isPersonalRoom = !!searchParams.get('personal')
  const router = useRouter()
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left')
  const [showParticipants, setShowParticipants] = useState(false)
  const { useCallCallingState } = useCallStateHooks()

  const call = useCall()
  // const { useCallSettings, useIsCallTranscribingInProgress } =
  //   useCallStateHooks()

  // const { transcription } = useCallSettings() || {}
  // if (transcription?.mode === TranscriptionSettingsModeEnum.DISABLED) {
  //   // transcriptions are not available, render nothing
  //   return null
  // }

  // const isTranscribing = useIsCallTranscribingInProgress()

  // console.log("isTranscribing", isTranscribing)
  // console.log("transcription", transcription)
  // for more detail about types of CallingState see: https://getstream.io/video/docs/react/ui-cookbook/ringing-call/#incoming-call-panel
  const callingState = useCallCallingState()

  if (callingState !== CallingState.JOINED) return <Loader />

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition='left' />
      default:
        return <SpeakerLayout participantsBarPosition='right' />
    }
  }

  return (
    <section className='relative h-screen w-full overflow-hidden pt-4 text-white'>
      <div className='relative flex size-full items-center justify-center'>
        <div className=' flex size-full max-w-[1000px] items-center'>
          <CallLayout />
        </div>
        <div
          className={cn('h-[calc(100vh-86px)] hidden ml-2', {
            'show-block': showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>
      {/* video layout and call controls */}
      <div className='fixed bottom-0 flex w-full items-center justify-center gap-5'>
        <CallControls onLeave={() => router.push(`/`)} />

        <DropdownMenu>
          <div className='flex items-center'>
            <DropdownMenuTrigger className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  '>
              <LayoutList size={20} className='text-white' />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className='border-dark-1 bg-dark-1 text-white'>
            {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className='border-dark-1' />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className=' cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  '>
            <Users size={20} className='text-white' />
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton />}
        {/* <button
          onClick={() => {
            if (isTranscribing) {
              call?.stopTranscription().catch((err) => {
                console.log('Failed to stop transcriptions', err)
              })
            } else {
              call?.startTranscription().catch((err) => {
                console.error('Failed to start transcription', err)
              })
            }
          }}
        >
          {isTranscribing ? 'Stop transcription' : 'Start transcription'}
        </button> */}
        {/* <Button
          onClick={() => {
            if (isTranscribing) {
              call?.stopTranscription().catch((err) => {
                console.log('Failed to stop transcriptions', err)
              })
            } else {
              call?.startTranscription().catch((err) => {
                console.error('Failed to start transcription', err)
              })
            }
          }}
        >
          {isTranscribing ? 'Stop transcription' : 'Start transcription'}
        </Button> */}
      </div>
      <nav className='fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 bg-slate-800'>
        <div className='flex items-center gap-6'>
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                size='lg'
                className='font-normal justify-start px-2 text-white bg-gray-700 hover:bg-gray-600'
              >
                <CalendarRange className='h-4 w-4 mr-2' />
                Calendar
              </Button>
            </DrawerTrigger>
            <DrawerContent className='mx-auto w-full min-w-sm h-2/3 bg-slate-700 text-white'>
              <DrawerHeader>
                <DrawerTitle>Calendar</DrawerTitle>
                <DrawerDescription>
                  Manage your calendar here.
                </DrawerDescription>
              </DrawerHeader>
              <div>
                <CalendarPage />
              </div>
              <DrawerFooter>
                <DrawerClose>
                  <Button variant='outline'>Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size='lg'
                className='font-normal justify-start px-2 text-white bg-gray-700 hover:bg-gray-600'
              >
                <MessageSquare className='h-4 w-4 mr-2' />
                Chat
              </Button>
            </SheetTrigger>
            <SheetContent className='min-w-[40vw] bg-slate-700 text-white'>
              <SheetHeader>
                <SheetTitle className='flex items-center'>
                  <Tabs
                    defaultValue='Participants'
                    className='w-[40vw] justify-center items-center'
                  >
                    <TabsList>
                      <TabsTrigger value='Participants'>
                        Participants
                      </TabsTrigger>
                      <TabsTrigger value='ChatBot'>ChatBot</TabsTrigger>
                    </TabsList>
                    <TabsContent value='Participants'>
                      Make changes to your account here.
                    </TabsContent>
                    <TabsContent value='ChatBot'>
                      <ChatbotPage />
                    </TabsContent>
                  </Tabs>
                </SheetTitle>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </section>
  )
}

export default MeetingRoom
