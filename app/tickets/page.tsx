import { getTickets } from '@/actions/tickets'
import TicketItem from '@/components/common/TicketItem'
import { redirect } from 'next/navigation'

const TicketsPage = async () => {
  const user = await 'user'

  if (!user) {
    redirect('/login')
  }

  const tickets = await getTickets()

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold mb-8 text-center'>Support Tickets</h1>
      {tickets.length === 0 ? (
        <p className='text-center text-gray-600'>No Tickets Yet</p>
      ) : (
        <div className='space-y-4 max-w-3xl mx-auto'>
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
