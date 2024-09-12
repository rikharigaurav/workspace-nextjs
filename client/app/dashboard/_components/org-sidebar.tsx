'use client'

import { useRouter } from 'next/navigation'
import { Poppins } from 'next/font/google'
import {
  CalendarRange,
  FileStack,
  LayoutDashboard,
  MessageSquare,
  Presentation,
  SquarePen,
} from 'lucide-react'
import {
  UserButton,
  OrganizationSwitcher,
  useOrganization,
} from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import { InviteButton } from './invite-button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ChatbotPage from '../chatapp/page'
import CalendarPage from '@/app//calendar/page'
import ChatApp from '@/app/chatApp/page'
import { InviteMember } from './inviteMember'

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
})

export const OrgSidebar = () => {
  const searchParams = useSearchParams()
  const { organization } = useOrganization()
  const favorites = searchParams.get('favorites')
  const router = useRouter()

  const [DashboardState, SetDashboardState] = useState<
    'meetings' | 'docs' | undefined
  >(undefined)

  return (
    <div className='hidden lg:flex flex-col space-y-6 w-[270px] pt-5 bg-white shadow-lg justify-start'>
      <div className='flex items-center gap-x-2'>
        <div className='flex-1 flex justify-center items-center gap-x-4'>
          <UserButton />
          {organization && <InviteMember />}
        </div>
        <div className='block lg:hidden flex-1'>
          <OrganizationSwitcher
            hidePersonal
            appearance={{
              elements: {
                rootBox: {
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: '376px',
                },
                organizationSwitcherTrigger: {
                  padding: '6px',
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  justifyContent: 'space-between',
                  backgroundColor: 'white',
                },
              },
            }}
          />
        </div>
      </div>
      <OrganizationSwitcher
        hidePersonal
        appearance={{
          elements: {
            rootBox: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            },
            organizationSwitcherTrigger: {
              padding: '6px',
              width: '100%',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              justifyContent: 'space-between',
              backgroundColor: 'white',
              color: 'black',
            },
          },
        }}
      />
      <div className='space-y-1 w-full'>
        <Button
          variant={favorites ? 'ghost' : 'secondary'}
          size='lg'
          className='font-normal justify-start px-2 w-full text-black hover:bg-gray-200'
          onClick={() => router.push('/')}
        >
          <LayoutDashboard className='h-4 w-4 mr-2' />
          Workspace
        </Button>

        <Button
          variant={favorites ? 'ghost' : 'secondary'}
          size='lg'
          className='font-normal justify-start px-2 w-full text-black hover:bg-gray-200'
          onClick={() => router.push('/boardDashboard')}
        >
          <SquarePen className='h-4 w-4 mr-2' />
          Boards
        </Button>

        <Button
          variant={favorites ? 'ghost' : 'secondary'}
          size='lg'
          className='font-normal justify-start px-2 w-full text-black hover:bg-gray-200'
          onClick={() => router.push('/meetingdashboard')}
        >
          <Presentation className='h-4 w-4 mr-2' />
          Meetings
        </Button>
        <Button
          variant={favorites ? 'ghost' : 'secondary'}
          size='lg'
          className='font-normal justify-start px-2 w-full text-black hover:bg-gray-200'
          onClick={() => router.push('/documentDashboard')}
        >
          <FileStack className='h-4 w-4 mr-2' />
          Documents
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              size='lg'
              className='font-normal justify-start px-2 w-full text-white hover:text-black hover:bg-gray-200'
            >
              <MessageSquare className='h-4 w-4 mr-2' />
              Chat
            </Button>
          </SheetTrigger>
          <SheetContent className='min-w-[40vw]'>
            <SheetHeader>
              <SheetTitle className='flex items-center'>
                <Tabs
                  defaultValue='Participants'
                  className='w-[40vw] justify-center items-center'
                >
                  <TabsList>
                    <TabsTrigger value='Participants'>Participants</TabsTrigger>
                    <TabsTrigger value='ChatBot'>ChatBot</TabsTrigger>
                  </TabsList>
                  <TabsContent value='Participants'>
                    <ChatApp />
                  </TabsContent>
                  <TabsContent value='ChatBot'>
                    <ChatbotPage />
                  </TabsContent>
                </Tabs>
              </SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <Drawer>
          <DrawerTrigger asChild>
            <Button
              size='lg'
              className='font-normal justify-start px-2 w-full text-white hover:text-black hover:bg-gray-200'
            >
              <CalendarRange className='h-4 w-4 mr-2' />
              Calendar
            </Button>
          </DrawerTrigger>
          <DrawerContent className='mx-auto w-full min-w-sm h-2/3'>
            <DrawerHeader>
              <DrawerTitle>Calendar</DrawerTitle>
              <DrawerDescription>Manage your calendar here.</DrawerDescription>
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
      </div>
    </div>
  )
}
