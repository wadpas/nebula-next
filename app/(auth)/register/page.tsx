'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { registerUser } from '@/actions/auth'

const RegisterForm = () => {
  const router = useRouter()

  const initialState = {
    success: false,
    message: '',
  }

  const [state, formAction] = useActionState(registerUser, initialState)

  useEffect(() => {
    if (state.success) {
      toast.success('Registration successful!')
      router.push('/tickets')
      router.refresh()
    } else if (state.message) {
      toast.error(state.message)
    }
  }, [state, router])

  return (
    <div className='flex items-center justify-center min-h-screen px-4'>
      <div className='w-full max-w-md p-8 bg-white border border-gray-200 rounded-lg shadow-md'>
        <h1 className='mb-6 text-3xl font-bold text-center'>Register</h1>
        <form
          action={formAction}
          className='space-y-4 text-gray-700'>
          <input
            className='w-full p-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
            type='text'
            name='name'
            placeholder='Your Name'
            autoComplete='name'
            required
          />
          <input
            className='w-full p-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
            type='email'
            name='email'
            placeholder='Your Email'
            autoComplete='email'
            required
          />
          <input
            className='w-full p-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
            type='password'
            name='password'
            placeholder='Password'
            autoComplete='new-password'
            required
          />
          <button
            className='w-full p-3 text-white transition bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50'
            type='submit'>
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterForm
