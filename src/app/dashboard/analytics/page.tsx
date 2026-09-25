import { createClient } from '@/utils/supabase/server'
import { PieChart, TrendingDown } from 'lucide-react'

export default async function AnalyticsPage() {
  const supabase = createClient()
  
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, categories(name)')
  
  const txs = transactions || []
  
  const expenses = txs.filter(t => t.type === 'expense')
  const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0)
  
  const categoryTotals = expenses.reduce((acc: any, curr) => {
    const catName = curr.categories?.name || 'Lain-lain'
    acc[catName] = (acc[catName] || 0) + Number(curr.amount)
    return acc
  }, {})

  const sortedCategories = Object.keys(categoryTotals).map(name => ({
    name,
    amount: categoryTotals[name],
    percentage: totalExpense > 0 ? (categoryTotals[name] / totalExpense) * 100 : 0
  })).sort((a, b) => b.amount - a.amount)

  // Color palette for categories
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-500', 'bg-cyan-500']

  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
          <PieChart className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analitik</h1>
          <p className="text-slate-500 text-sm">Distribusi pengeluaran Anda</p>
        </div>
      </div>

      {/* Total Expense Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">Total Pengeluaran</p>
          <h2 className="text-2xl font-bold text-slate-900">Rp {totalExpense.toLocaleString('id-ID')}</h2>
        </div>
        <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
          <TrendingDown className="w-6 h-6" />
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Berdasarkan Kategori</h3>
        
        {sortedCategories.length === 0 ? (
          <p className="text-slate-500 text-center text-sm py-4">Belum ada pengeluaran.</p>
        ) : (
          <div className="space-y-5">
            {sortedCategories.map((cat, index) => {
              const colorClass = colors[index % colors.length]
              
              return (
                <div key={cat.name} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <div className="flex items-center gap-2 text-slate-800">
                      <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
                      {cat.name}
                    </div>
                    <span className="text-slate-900">Rp {cat.amount.toLocaleString('id-ID')}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${colorClass}`} 
                        style={{ width: `${cat.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-slate-500 w-10 text-right">
                      {cat.percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
