import { createClient } from '@/utils/supabase/server'
import { ArrowDownRight, ArrowUpRight, Wallet, UserCircle2 } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .order('transaction_date', { ascending: false })

  const txs = transactions || []

  const totalBalance = txs.reduce((acc, curr) => {
    return curr.type === 'income' ? acc + Number(curr.amount) : acc - Number(curr.amount)
  }, 0)

  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)

  const incomeThisMonth = txs
    .filter(t => t.type === 'income' && new Date(t.transaction_date) >= firstDay)
    .reduce((acc, curr) => acc + Number(curr.amount), 0)

  const expenseThisMonth = txs
    .filter(t => t.type === 'expense' && new Date(t.transaction_date) >= firstDay)
    .reduce((acc, curr) => acc + Number(curr.amount), 0)

  const recentTxs = txs.slice(0, 5)

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm">Selamat datang,</p>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 truncate max-w-[200px] md:max-w-md">
            {user?.email?.split('@')[0]}
          </h1>
        </div>
        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
          <UserCircle2 className="w-6 h-6" />
        </div>
      </div>

      {/* Main Balance Card (Fintech Style) */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-lg">
        <p className="text-slate-400 text-sm font-medium mb-1">Total Saldo Aktif</p>
        <h2 className="text-4xl font-bold mb-6">Rp {totalBalance.toLocaleString('id-ID')}</h2>
        
        <div className="flex gap-4 border-t border-slate-700 pt-4">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
              <div className="bg-emerald-400/20 p-1 rounded-full"><ArrowUpRight className="w-3 h-3" /></div>
              <p className="text-xs font-medium">Pemasukan</p>
            </div>
            <p className="text-sm font-semibold">Rp {incomeThisMonth.toLocaleString('id-ID')}</p>
          </div>
          <div className="w-px bg-slate-700"></div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-rose-400 mb-1">
              <div className="bg-rose-400/20 p-1 rounded-full"><ArrowDownRight className="w-3 h-3" /></div>
              <p className="text-xs font-medium">Pengeluaran</p>
            </div>
            <p className="text-sm font-semibold">Rp {expenseThisMonth.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions List (Mobile friendly) */}
      <div className="pt-4">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-bold text-slate-900">Transaksi Terakhir</h3>
          <span className="text-sm text-blue-600 font-medium cursor-pointer">Lihat Semua</span>
        </div>

        <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-100">
          {recentTxs.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">
              Belum ada transaksi.
            </div>
          ) : (
            <div className="flex flex-col">
              {recentTxs.map((t: any, i: number) => (
                <div key={t.id} className={`flex justify-between items-center p-4 ${i !== recentTxs.length - 1 ? 'border-b border-slate-50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {t.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{t.description || (t.type === 'income' ? 'Pemasukan' : 'Pengeluaran')}</p>
                      <p className="text-xs text-slate-500 font-medium">{new Date(t.transaction_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                    </div>
                  </div>
                  <div className={`font-bold text-sm ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {t.type === 'income' ? '+' : '-'}Rp {Number(t.amount).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
