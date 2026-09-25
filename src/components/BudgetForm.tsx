'use client'

import { useRef, useState } from 'react'
import { addBudget } from '@/app/actions/transactions'

export default function BudgetForm({ userCategories }: { userCategories: any[] }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await addBudget(formData)
      formRef.current?.reset() // Reset form setelah berhasil
    } catch (error) {
      console.error(error)
      alert("Gagal menyimpan anggaran")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Kategori</label>
        <select name="category" required className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 border outline-none focus:border-blue-500 transition-colors">
          <option value="">-- Pilih Kategori Pengeluaran --</option>
          {userCategories?.map((cat) => (
            <option key={cat.name} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Batas Maksimal (Rp)</label>
        <input type="number" name="amount" required min="1" placeholder="Contoh: 1500000" className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 border outline-none focus:border-blue-500 transition-colors" />
      </div>
      <button disabled={isSubmitting} type="submit" className="w-full disabled:bg-slate-400 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition-colors">
        {isSubmitting ? 'Menyimpan...' : 'Simpan Anggaran'}
      </button>
    </form>
  )
}
