import { createClient } from '@/utils/supabase/server'
import { PlusCircle } from 'lucide-react'
import TransactionForm from '@/components/TransactionForm'

export default async function TransactionsPage() {
  const supabase = createClient()
  
  // Fetch transactions
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, categories(name)')
    .order('transaction_date', { ascending: false })

  // Fetch categories for the form
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Data Transaksi</h1>
        <p className="text-slate-500 mt-1">Kelola dan pantau semua pemasukan dan pengeluaran Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Tambah Transaksi */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-500" /> Tambah Baru
            </h2>
            
            <TransactionForm categories={categories || []} />
          </div>
        </div>

        {/* Tabel Transaksi */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">Riwayat Transaksi</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-medium">Tanggal</th>
                    <th className="px-6 py-4 font-medium">Deskripsi</th>
                    <th className="px-6 py-4 font-medium">Kategori</th>
                    <th className="px-6 py-4 font-medium text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {!transactions || transactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                        Belum ada transaksi yang dicatat.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((t: any) => (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(t.transaction_date).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-900 block">{t.description || '-'}</span>
                          <span className="text-xs text-slate-500 capitalize">{t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}</span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {t.categories?.name ? (
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{t.categories.name}</span>
                          ) : '-'}
                        </td>
                        <td className={`px-6 py-4 text-right font-medium whitespace-nowrap ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {t.type === 'income' ? '+' : '-'} Rp {Number(t.amount).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
