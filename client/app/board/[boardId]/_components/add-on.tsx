import { Hint } from '@/components/hint'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useStorage } from '@/liveblocks.config'
import { LayerType } from '@/types/canvas'
import axios from 'axios'
import { useQuery } from 'convex/react'
import React from 'react'

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

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import CalendarPage from '@/app/calendar/page'
import { CalendarRange, MessageSquare } from 'lucide-react'
import ChatApp from '@/app/chatApp/page'
import ChatbotPage from '@/app/(dashboard)/chatapp/page'
import { toast } from 'sonner'

interface centerToolsProps {
  boardId: string
}

const CenterTools = ({ boardId }: centerToolsProps) => {
  const board = useQuery(api.board.get, {
    id: boardId as Id<'boards'>,
  })

  const lay = useStorage((root) => root.layers)
  const updateDB = async () => {
    const data = new Array()
    if (LayerType.Text) {
      lay.forEach((layer) => {
        if (layer.value != undefined) {
          data.push(layer.value)
        }
      })
    }
    const formattedData = Array.isArray(data)
      ? data
          .map((item) => item.toString().trim())
          .filter((item) => item.length > 0)
      : []

      console.log('formattedData', formattedData)
    // const baordString = data.join(', ')
    // console.log("boardString", baordString)
    // console.log('sending data to api end point', data)
    await axios
      .post('/api/updateDB', {
        boardname: board?.title,
        value: formattedData,
      })
      .then(() => {
        toast.success('Vectors Updated')
      })
  }
  return (
    <div className='shadow-md justify-center flex items-center gap-x-2 pl-20'>
      <Hint label='Push to DataBase' side='bottom' sideOffset={10}>
        <Button onClick={updateDB} size={'lg'}>
          Update
        </Button>
      </Hint>
      <Hint label='Push to DataBase' side='bottom' sideOffset={10}>
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
      </Hint>
      <Hint label='Push to DataBase' side='bottom' sideOffset={10}>
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
      </Hint>
    </div>
  )
}

export default CenterTools
