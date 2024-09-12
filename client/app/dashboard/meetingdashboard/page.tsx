'use client'

import { Separator } from '@/components/ui/separator'
import CallList from '@/components/callList'  

export default function Page() {

  return (
    <div className='flex flex-col p-6 space-y-8 bg-gray-50 min-h-screen overflow-y-auto'>
      <div className='flex flex-col items-start space-y-4'>
        <h1 className='text-3xl font-bold text-gray-800'>Upcoming Calls</h1>
        <CallList type='upcoming' />
      </div>
      <Separator />
      <div className='flex flex-col items-start space-y-4'>
        <h1 className='text-3xl font-bold text-gray-800'>Recorded Calls</h1>
        <CallList type='recordings' />
      </div>
      <Separator />
      <div className='flex flex-col items-start space-y-4'>
        <h1 className='text-3xl font-bold text-gray-800'>Ended Calls</h1>
        <CallList type='ended' />
      </div>
    </div>
  )
}
