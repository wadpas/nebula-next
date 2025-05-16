'use server'

import db from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { logEvent } from '@/lib/sentry'
import { signAuthToken, setAuthCookie, removeAuthCookie } from '@/lib/auth'

type ResponseResult = {
  success: boolean
  message: string
}

// Register new user
export async function registerUser(prevState: ResponseResult, formData: FormData): Promise<ResponseResult> {
  try {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!name || !email || !password) {
      logEvent('Validation error: Missing register fields', 'auth', { name, email }, 'warning')

      return { success: false, message: 'All fields are required' }
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      logEvent(`Registration failed: User already exists - ${email}`, 'auth', { email }, 'warning')

      return { success: false, message: 'User already exists' }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Sign and set auth token
    const token = await signAuthToken({ userId: user.id })
    await setAuthCookie(token)

    logEvent(`User registered successfully: ${email}`, 'auth', { userId: user.id, email }, 'info')

    return { success: true, message: 'Registration' }
  } catch (error) {
    logEvent('Unexpected error during registration', 'auth', {}, 'error', error)
    return {
      success: false,
      message: 'Something went wrong, please try again',
    }
  }
}
