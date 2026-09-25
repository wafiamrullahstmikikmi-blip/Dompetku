'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addTransaction(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const amount = parseFloat(formData.get('amount') as string)
  const type = formData.get('type') as string
  const category_id = formData.get('category_id') as string // optional
  const transaction_date = formData.get('date') as string
  const description = formData.get('description') as string

  const { error } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      amount,
      type,
      category_id: category_id || null, // null if no category
      transaction_date,
      description
    })

  if (error) {
    console.error('Insert Error:', error)
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/transactions')
  revalidatePath('/dashboard')
}

export async function seedCategories() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const defaultCategories = [
    { user_id: user.id, name: 'Makanan & Minuman', type: 'expense', icon: '🍔' },
    { user_id: user.id, name: 'Transportasi', type: 'expense', icon: '🚗' },
    { user_id: user.id, name: 'Tagihan & Utilitas', type: 'expense', icon: '💡' },
    { user_id: user.id, name: 'Hiburan', type: 'expense', icon: '🎬' },
    { user_id: user.id, name: 'Gaji', type: 'income', icon: '💰' },
    { user_id: user.id, name: 'Bonus', type: 'income', icon: '🎉' },
  ]

  await supabase.from('categories').insert(defaultCategories)
  revalidatePath('/dashboard/transactions')
}

export async function addBudget(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const category = formData.get('category') as string
  const amount = parseFloat(formData.get('amount') as string)

  // Check if budget exists for this category
  const { data: existing } = await supabase
    .from('budgets')
    .select('id')
    .eq('category', category)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    // Update
    await supabase.from('budgets').update({ amount }).eq('id', existing.id)
  } else {
    // Insert
    await supabase.from('budgets').insert({ user_id: user.id, category, amount })
  }

  revalidatePath('/dashboard/budget')
}
