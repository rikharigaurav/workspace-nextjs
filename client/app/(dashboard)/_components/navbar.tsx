'use client'

import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700'],
})

export const Navbar = () => {
  return (
    <div className='flex items-center justify-center gap-x-4 p-5 bg-gray-100 shadow-md'>
      <div className={`font-bold text-3xl text-gray-800 ${poppins.className}`}>
        <span className='tracking-wider bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text text-5xl'>
          WORKSPACE
        </span>
      </div>
    </div>
  )
}
