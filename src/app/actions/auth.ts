'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  let identifier = formData.get('username') as string
  if (!identifier.includes('@')) {
    identifier = `${identifier}@dompetku.local`
  }

  const data = {
    email: identifier,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?message=Username atau Password salah')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  let identifier = formData.get('username') as string
  if (!identifier.includes('@')) {
    identifier = `${identifier}@dompetku.local`
  }

  const data = {
    email: identifier,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/register?message=' + error.message)
  }

  // If email confirmation is disabled, user is signed in directly.
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
