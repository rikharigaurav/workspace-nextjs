
import { Navbar } from './_components/navbar'
import { OrgSidebar } from './_components/org-sidebar'
import { Sidebar } from './_components/sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className='h-full overflow-hidden '>
      <Sidebar />
      <div className='pl-[60px] h-full'>
        <div className='flex gap-x-3 h-full'>
          <OrgSidebar />
          <div className='h-full flex-1'>
            <Navbar />
            <div className='h-full w-full bg-slate-200'>
            {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default DashboardLayout