'use server'
import { cookies } from 'next/headers'
import { signin, signup } from '@/utils/authTools'
import { z } from 'zod'
import { COOKIE_NAME } from '@/utils/constants'
import { redirect } from 'next/navigation'

const authSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const registerUser = async (prevState: any, formData: FormData) => {
  const data = authSchema.parse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  try {
    const { token } = await signup(data)
    cookies().set(COOKIE_NAME, token)
  } catch (error) {
    console.error(error)
    return { message: 'Error signing up' }
  }

  // hay un bug al respecto, no se puede poner el redirect adentro del try
  redirect('/dashboard')
}

export const signinUser = async (prevState: any, formData: FormData) => {
  const data = authSchema.parse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  try {
    const { token } = await signin(data)
    cookies().set(COOKIE_NAME, token)
  } catch (error) {
    console.error(error)
    return { message: 'Error signing in' }
  }

  redirect('/dashboard')
}
