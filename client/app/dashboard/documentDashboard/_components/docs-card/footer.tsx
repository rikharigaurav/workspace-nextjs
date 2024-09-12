
interface FooterProps {
  title: string
}

export const Footer = ({
  title,
}: FooterProps) => {

  return (
    <div className='relative bg-white p-3'>
      <p className='text-[13px] truncate max-w-[calc(100%-20px)]'>{title}</p>
    </div>
  )
}
