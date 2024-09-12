import { ReactNode } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import Image from 'next/image'

interface WorkspaceModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  className?: string
  children?: ReactNode
  handleClick?: () => void
  buttonText?: string
  image?: string
  buttonIcon?: string
}

const WorkspaceModal = ({
  isOpen,
  onClose,
  title,
  className,
  children,
  handleClick,
  buttonText,
  image,
  buttonIcon,
}: WorkspaceModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='flex w-full max-w-[520px] flex-col gap-6 border-none border bg-gray-200 px-6 py-9 text-black rounded-lg'>
        <div className='flex flex-col gap-6'>
          {image && (
            <div className='flex justify-center'>
              <Image src={image} alt='checked' width={72} height={72} />
            </div>
          )}
          <h1 className={`text-3xl font-bold leading-[42px] ${className}`}>
            {title}
          </h1>
          {children}
          <button
            className='bg-gray-300 hover:bg-gray-400 text-black py-3 px-6 rounded-lg flex items-center justify-center transition-colors duration-300 ease-in-out'
            onClick={handleClick}
          >
            {buttonIcon && (
              <Image
                src={buttonIcon}
                alt='button icon'
                width={16}
                height={16}
                className='mr-2'
              />
            )}
            {buttonText}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WorkspaceModal
