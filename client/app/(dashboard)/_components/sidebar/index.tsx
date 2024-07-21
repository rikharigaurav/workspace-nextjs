import { List } from './list'
import { NewButton } from './new-button'

export const Sidebar = () => {
  return (
    <aside className='fixed z-[1] left-0 bg-blue-700 h-full w-[70px] flex p-3 flex-col gap-y-6 text-white shadow-lg'>
      <List />
      <NewButton />
    </aside>
  )
}
