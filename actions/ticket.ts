'use server'

export async function createTicket(
  prevState: { success: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const { subject, description, priority } = Object.fromEntries(formData.entries())

  console.log(subject)

  return {
    message: 'Ticket created successfully',
    success: true,
  }
}
