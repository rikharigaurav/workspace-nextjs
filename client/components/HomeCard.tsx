'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface HomeCardProps {
  className?: string
  img: string
  title: string
  description: string
  handleClick?: () => void
}

const HomeCard = ({
  className,
  img,
  title,
  description,
  handleClick,
}: HomeCardProps) => {
  return (
    <section
      className={cn(
        ' text-black p-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-lg shadow-md transform transition-transform hover:scale-105 cursor-pointer bg-slate-100',
        className
      )}
      onClick={handleClick}
    >
      <div className='flex justify-center items-center p-3 rounded-full mb-4 bg-gray-200'>
        <Image src={img} alt={title} width={40} height={40} />
      </div>

      <div className='flex flex-col gap-2 text-center'>
        <h1 className='text-2xl font-bold'>{title}</h1>
        <p className='text-base font-normal'>{description}</p>
      </div>
    </section>
  )
}

export default HomeCard
