'use server'

import db from '@/lib/prisma'
import { logEvent } from '@/lib/sentry'
import { revalidatePath } from 'next/cache'

export async function createTicket(
  prevState: { success: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
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
