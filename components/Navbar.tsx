import { getCurrentUser } from '@/lib/user'
import Link from 'next/link'

const Navbar = async () => {
  const user = await getCurrentUser()

  return (
    <nav className='flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200'>
      <div>
        <Link
          href='/'
          className='text-xl font-bold text-blue-600'>
          QuickTicket
        </Link>
      </div>
      <div className='flex items-center space-x-4'>
        {user ? (
          <>
            <Link
              href='/tickets/new'
              className='text-gray-700 transition hover:underline'>
              New Ticket
            </Link>
            <Link
              href='/tickets'
              className='text-gray-700 transition hover:underline'>
              My Tickets
            </Link>
          </>
        ) : (
          <>
            <Link
              href='/login'
              className='text-blue-600 transition hover:underline'>
              Login
            </Link>
            <Link
              href='/register'
              className='px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700'>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
