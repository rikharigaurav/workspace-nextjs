'use client'

import { useQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'

import { DocsCard } from './docs-card'
import { EmptySearch } from '../../_components/empty-search'

interface BoardListProps {
  orgId: string
}

export const AllDocs = ({ orgId }: BoardListProps) => {
  // console.log("The current Organization id", orgId)
  const data = useQuery(api.document.getAllDocs, {
    orgId: orgId,
  })

  // console.log("the docs data", data?.length)
  if (data === undefined) {
    return (
      <div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10'>
          <DocsCard.Skeleton />
          <DocsCard.Skeleton />
          <DocsCard.Skeleton />
          <DocsCard.Skeleton />
        </div>
      </div>
    )
  }

  if (!data?.length ) {
    return <EmptySearch />
  }

  if (!data?.length) {
    return (
      <div className='h-full w-full justify-center items-center flex'>
        No Docs found
      </div>
    )
  }

  return (
    <div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10'>
        {data?.map((file) => (
          <DocsCard 
            key={file._id}
            filename={file.Filename}
            orgId={file.orgId}
            fileurl={file.documenturl}
            // filekey={file.filekey}
          />
        ))}
      </div>
    </div>
  )
}
