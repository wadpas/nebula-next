'use client'

import { createTicket } from '@/actions/tickets'
import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const NewTicket = () => {
  const [state, formAction] = useActionState(createTicket, { success: false, message: '' })

  const router = useRouter()

  useEffect(() => {
    if (state.success) {
      toast.success(state.message)
      router.push('/tickets')
    }
  }, [state, router])

  return (
    <div className='flex items-center justify-center flex-1 h-screen'>
      <div className='w-full max-w-md p-8 bg-white border border-gray-200 rounded-lg shadow-md'>
        <h1 className='mb-6 text-3xl font-bold text-center text-blue-600'>Submit a Support Ticket</h1>
        {state.message && !state.success && <p className='mb-4 text-center text-red-500'>{state.message}</p>}
        <form
          action={formAction}
          className='space-y-4 text-gray-700'>
          <input
            className='w-full p-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
            type='text'
            name='subject'
            placeholder='Subject'
          />
          <textarea
            className='w-full p-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
            name='description'
            placeholder='Describe your issue'
            rows={4}
          />
          <select
            className='w-full p-3 text-gray-700 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
            name='priority'
            defaultValue='Low'>
            <option value='Low'>Low Priority</option>
            <option value='Medium'>Medium Priority</option>
            <option value='High'>High Priority</option>
          </select>
          <button
            className='w-full p-3 text-white transition bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50'
            type='submit'>
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default NewTicket
