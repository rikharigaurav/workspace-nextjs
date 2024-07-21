'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { BoardCard } from './board-card'
import { EmptyBoards } from './empty-boards'
import { NewBoardButton } from './new-board-button'

interface BoardListProps {
  orgId: string
}

export const BoardList = ({ orgId }: BoardListProps) => {
  const data = useQuery(api.boards.get, { orgId })

  if (data === undefined) {
    return (
      <div>
        <h2 className='text-3xl font-bold text-gray-800'>Team Boards</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 mt-8 pb-10'>
          <NewBoardButton orgId={orgId} disabled />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
        </div>
      </div>
    )
  }

  if (!data?.length) {
    return <EmptyBoards />
  }

  return (
    <div>
      <h2 className='text-3xl font-bold text-gray-800'>Team Boards</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 mt-8 pb-10'>
        <NewBoardButton orgId={orgId} />
        {data?.map((board: any) => (
          <BoardCard
            key={board._id}
            id={board._id}
            title={board.title}
            imageUrl={board.imageUrl}
            authorId={board.authorId}
            authorName={board.authorName}
            createdAt={board._creationTime}
            orgId={board.orgId}
          />
        ))}
      </div>
    </div>
  )
}
