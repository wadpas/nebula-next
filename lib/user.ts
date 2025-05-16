import { getAuthCookie, verifyAuthToken } from '@/lib/auth'
import db from '@/lib/prisma'

type AuthPayload = {
  userId: string
}

export async function getCurrentUser() {
  try {
    const token = await getAuthCookie()
    if (!token) return null

    const payload = (await verifyAuthToken(token)) as AuthPayload

    if (!payload?.userId) return null

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    return user
  } catch (error) {
    console.log('Error getting the current user', error)
    return null
  }
}
