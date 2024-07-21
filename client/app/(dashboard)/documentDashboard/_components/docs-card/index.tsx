"use client"
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@clerk/nextjs'
import { MoreHorizontal } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import { api } from '@/convex/_generated/api'
import { Actions } from '@/components/actions'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiMutation } from '@/hooks/use-api-mutation'

import { Footer } from './footer'
import { Overlay } from './overlay'

interface BoardCardProps {
  filename: string
  orgId: string
  fileurl: string
  filekey?: string
}

export const DocsCard = ({
  filename,
  orgId,
  fileurl,
  filekey,
}: BoardCardProps) => {
  return (
    <Link href={`${fileurl}`}>
      <div className='group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden'>
        <div className='relative flex-1 bg-amber-50'>
          {/* Replace this placeholder with your actual icon */}
          <div className='absolute top-0 left-0 w-full h-full bg-gray-200 flex items-center justify-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-12 w-12 text-gray-500'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M17 3a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h10zm-3 4a1 1 0 00-1 1v5a1 1 0 002 0V8a1 1 0 00-1-1zm-6 0a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm6 9a1 1 0 100 2H7a1 1 0 100-2h7z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <Overlay />
          {/* <Actions
            id={orgId}
            title={filekey || ' '}
            dashboard='document'
            side='right'
          >
            <button className='absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none'>
              <MoreHorizontal className='text-white opacity-75 hover:opacity-100 transition-opacity' />
            </button>
          </Actions> */}
        </div>
        <Footer title={filename} />
      </div>
    </Link>
  )
}

DocsCard.Skeleton = function DocsCardSkeleton() {
  return (
    <div className='aspect-[100/127] rounded-lg overflow-hidden'>
      <Skeleton className='h-full w-full' />
    </div>
  )
}
