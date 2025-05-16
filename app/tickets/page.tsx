import { getTickets } from '@/actions/tickets'
import TicketItem from '@/components/TicketItem'
import { getAuthCookie } from '@/lib/auth'
import { redirect } from 'next/navigation'

const TicketsPage = async () => {
  const user = await getAuthCookie()

  if (!user) {
    redirect('/login')
  }

  const tickets = await getTickets()

  return (
    <div className='p-8'>
      <h1 className='mb-8 text-3xl font-bold text-center'>Support Tickets</h1>
      {tickets.length === 0 ? (
        <p className='text-center text-gray-600'>No Tickets Yet</p>
      ) : (
        <div className='max-w-3xl mx-auto space-y-4'>
          {tickets.map((ticket) => (
            <TicketItem
              key={ticket.id}
              ticket={ticket}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TicketsPage
