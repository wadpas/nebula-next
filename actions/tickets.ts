'use server'

import db from '@/lib/prisma'
import { logEvent } from '@/lib/sentry'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/users'

export async function createTicket(
  prevState: { success: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      logEvent('Unauthorized ticket creation attempt', 'ticket', {}, 'warning')

      return {
        success: false,
        message: 'You must be logged in to create a ticket',
      }
    }

    const subject = formData.get('subject') as string
    const description = formData.get('description') as string
    const priority = formData.get('priority') as string

    if (!subject || !description || !priority) {
      logEvent('Missing required fields', 'ticket', { subject, description, priority }, 'error')
    }

    const ticket = await db.ticket.create({
      data: {
        subject,
        description,
        priority,
        user: { connect: { id: user.id } },
      },
    })

    logEvent(`Ticket created successfully: ${ticket.id}`, 'ticket', { ticketId: ticket.id }, 'info')

    revalidatePath('/tickets')

    return {
      message: 'Ticket created successfully',
      success: true,
    }
  } catch (error) {
    logEvent(
      'An error occurred while creating the ticket',
      'ticket',
      {
        formData: Object.fromEntries(formData.entries()),
      },
      'error',
      error
    )

    return {
      message: 'An error occurred',
      success: false,
    }
  }
}

export async function getTickets() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      logEvent('Unauthorized access to ticket list', 'ticket', {}, 'warning')
      return []
    }

    const tickets = await db.ticket.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })
    logEvent('Tickets fetched successfully', 'ticket', { count: tickets.length }, 'info')

    return tickets
  } catch (error) {
    logEvent('An error occurred while getting the tickets', 'ticket', {}, 'error', error)

    return []
  }
}

export async function getTicketById(id: string) {
  try {
    const ticket = await db.ticket.findUnique({
      where: { id },
    })

    if (!ticket) {
      logEvent('Ticket not found', 'ticket', { ticketId: id }, 'warning')
    }

    return ticket
  } catch (error) {
    logEvent('Error fetching ticket details', 'ticket', { ticketId: id }, 'error', error)
    return null
  }
}

export async function closeTicket(
  prevState: { success: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const ticketId = formData.get('ticketId') as string

  if (!ticketId) {
    logEvent('Missing ticket ID', 'ticket', {}, 'warning')
    return { success: false, message: 'Ticket ID is Required' }
  }

  const user = await getCurrentUser()

  if (!user) {
    logEvent('Missing user ID', 'ticket', {}, 'warning')

    return { success: false, message: 'Unauthorized' }
  }

  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
  })

  if (!ticket || ticket.userId !== user.id) {
    logEvent('Unauthorized ticket close attempt', 'ticket', { ticketId, userId: user.id }, 'warning')

    return {
      success: false,
      message: 'You are not authorized to close this ticket',
    }
  }

  await db.ticket.update({
    where: { id: ticketId },
    data: { status: 'Closed' },
  })

  revalidatePath('/tickets')
  revalidatePath(`/tickets/${ticketId}`)

  return { success: true, message: 'Ticket closed successfully' }
}
