'use client'

import { useOrganization } from '@clerk/nextjs'

import { EmptyOrg } from '../_components/empty-org'
import { AllDocs } from './_components/Docs-list'

interface AllDocsPageProps {
  searchParams: {
    search?: string
  }
}

const DashboardPage = ({ searchParams }: AllDocsPageProps) => {
  const { organization } = useOrganization()

  return (
    <div className='flex-1 h-[calc(100%-80px)] p-6 overflow-y-auto'>
      {!organization ? (
        <EmptyOrg />
      ) : (
        <AllDocs orgId={organization?.id} />
      )}
    </div>
  )
}

export default DashboardPage
