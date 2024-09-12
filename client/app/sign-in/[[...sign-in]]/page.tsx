'use client'
import { SignIn, useOrganization } from '@clerk/nextjs'

export default function Page() {
  const { organization } = useOrganization()

  return (
    <div className='flex justify-center items-center'>
      <SignIn
        signUpUrl={!organization ? '/dashboard/emptyorgg' : '/dashboard'}
      />
    </div>
  )
}
