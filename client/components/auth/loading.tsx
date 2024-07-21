'use client'
import { useEffect, useState } from 'react'
import { Loader2Icon } from 'lucide-react'

const Loader = () => {
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity((prevOpacity) => (prevOpacity === 1 ? 0.3 : 1))
    })

    return () => clearInterval(interval)
  }, [])

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <div className='flex flex-col items-center justify-center space-y-8'>
        <Loader2Icon className='animate-spin text-blue-500' size={48} />
        <div className='font-bold text-3xl text-gray-800' style={{ opacity }}>
          WORKSPACE
        </div>
        <span className='text-xl text-gray-700 mt-4'>Please be patient 😊</span>
      </div>
    </div>
  )
}

export default Loader
