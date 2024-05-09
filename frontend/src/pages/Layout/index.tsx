import { Sidebar } from 'components/Sidebar'
import { Outlet } from 'react-router-dom'

export const RootLayout = () => {
  return (
    <div className='min-h-screen w-full flex flex-col'>
      <Sidebar />
      <Outlet />
    </div>
  )
}
