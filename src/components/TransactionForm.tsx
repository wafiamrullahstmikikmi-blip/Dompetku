'use client'

import { useRef, useState } from 'react'
import { addTransaction, seedCategories } from '@/app/actions/transactions'

export default function TransactionForm({ categories }: { categories: any[] }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await addTransaction(formData)
      formRef.current?.reset() // Reset form setelah berhasil
    } catch (error) {
      console.error(error)
      alert("Gagal menyimpan transaksi")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Jenis</label>
        <select name="type" className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2 border outline-none focus:border-blue-500 focus:bg-white transition-colors" required>
          <option value="expense">Pengeluaran</option>
          <option value="income">Pemasukan</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
        <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2 border outline-none focus:border-blue-500 focus:bg-white transition-colors" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah (Rp)</label>
        <input type="number" name="amount" required min="1" placeholder="Contoh: 50000" className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2 border outline-none focus:border-blue-500 focus:bg-white transition-colors" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
        {categories && categories.length > 0 ? (
          <select name="category_id" className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2 border outline-none focus:border-blue-500 focus:bg-white transition-colors" required>
            <option value="">-- Pilih Kategori --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
            ))}
          </select>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-rose-500">Kategori masih kosong.</p>
            <button formAction={seedCategories} className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg transition-colors border border-slate-200">
              Buat Kategori Bawaan (Otomatis)
            </button>
            <input type="hidden" name="category_id" value="" />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
        <textarea name="description" placeholder="Catatan transaksi..." className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2 border outline-none focus:border-blue-500 focus:bg-white transition-colors h-24 resize-none"></textarea>
      </div>

      <button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-xl transition-colors">
        {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}
      </button>
    </form>
  )
}
