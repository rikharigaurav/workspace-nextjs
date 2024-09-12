'use client'

import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700'],
})

export const Navbar = () => {
  return (
    <nav className='bg-black text-white p-4 w-full'>
      <div className='container mx-auto w-full'>
        <h1 className='text-4xl font-bold justify-start flex items-center'>AI Space</h1>
      </div>
    </nav>
  )
}
