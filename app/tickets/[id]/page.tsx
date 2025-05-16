import { getTicketById } from '@/actions/tickets'
import { logEvent } from '@/lib/sentry'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPriorityClass } from '@/lib/ui'
import CloseTicketButton from '@/components/CloseTicketButton'

const TicketDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params
  const ticket = await getTicketById(id)

  if (!ticket) {
    notFound()
  }

  logEvent('Viewing ticket details', 'ticket', { ticketId: ticket.id }, 'info')

  return (
    <div className='min-h-screen p-8'>
      <div className='max-w-2xl p-8 mx-auto space-y-6 bg-white border border-gray-200 rounded-lg shadow'>
        <h1 className='text-3xl font-bold text-blue-600'>{ticket.subject}</h1>

        <div className='text-gray-700'>
          <h2 className='mb-2 text-lg font-semibold'>Description</h2>
          <p>{ticket.description}</p>
        </div>

        <div className='text-gray-700'>
          <h2 className='mb-2 text-lg font-semibold'>Priority</h2>
          <p className={getPriorityClass(ticket.priority)}>{ticket.priority}</p>
        </div>

        <div className='text-gray-700'>
          <h2 className='mb-2 text-lg font-semibold'>Created At</h2>
          <p>{new Date(ticket.createdAt).toLocaleString()}</p>
        </div>

        <Link
          href='/tickets'
          className='inline-block px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700'>
          ← Back to Tickets
        </Link>

        {ticket.status !== 'Closed' && (
          <CloseTicketButton
            ticketId={ticket.id}
            isClosed={ticket.status === 'Closed'}
          />
        )}
      </div>
    </div>
  )
}

export default TicketDetailsPage
