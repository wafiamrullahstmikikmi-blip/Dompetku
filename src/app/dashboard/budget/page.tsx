import { createClient } from '@/utils/supabase/server'
import { Target, AlertCircle, Plus } from 'lucide-react'
import BudgetForm from '@/components/BudgetForm'

export default async function BudgetPage() {
  const supabase = createClient()
  
  // Try to fetch budgets
  const { data: budgets, error: budgetError } = await supabase.from('budgets').select('*')
  
  if (budgetError) {
    return (
      <div className="space-y-6 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Anggaran</h1>
            <p className="text-slate-500 text-sm">Target pengeluaran bulanan</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 text-rose-600 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h3 className="font-bold text-lg text-slate-800">Sistem Anggaran Belum Aktif</h3>
          </div>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Fitur ini membutuhkan tabel baru di database Anda. Silakan ikuti langkah-langkah di bawah ini untuk mengaktifkannya.
          </p>
          
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-3 text-sm flex items-center gap-2">
              <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">1</span> 
              Copy kode SQL ini:
            </h4>
            <div className="relative">
              <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-xs overflow-x-auto shadow-inner">
{`create table public.budgets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  category text not null,
  amount numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.budgets enable row level security;
create policy "Users can manage own budgets" on budgets for all using (auth.uid() = user_id);`}
              </pre>
            </div>
            
            <h4 className="font-semibold text-slate-700 mt-6 mb-2 text-sm flex items-center gap-2">
              <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">2</span> 
              Buka SQL Editor di Dasbor Supabase Anda, paste kodenya, dan klik "RUN".
            </h4>
          </div>
        </div>
      </div>
    )
  }

  // If table exists, proceed with normal page logic
  
  // Fetch current month's expenses
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  
  const { data: expensesData } = await supabase
    .from('transactions')
    .select('*, categories(name)')
    .eq('type', 'expense')
    .gte('transaction_date', firstDay.toISOString())

  const expenses = expensesData || []

  // Aggregate expenses by category
  const expensesByCategory = expenses.reduce((acc: any, curr) => {
    const catName = curr.categories?.name || 'Lain-lain'
    acc[catName] = (acc[catName] || 0) + Number(curr.amount)
    return acc
  }, {})

  // Fetch unique categories from user's categories table for the dropdown
  const { data: userCategories } = await supabase
    .from('categories')
    .select('name')
    .eq('type', 'expense')
    .order('name')

  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Anggaran</h1>
          <p className="text-slate-500 text-sm">Target pengeluaran bulanan</p>
        </div>
      </div>

      {/* Daftar Anggaran & Progress */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Status Anggaran Bulan Ini</h2>
        
        {!budgets || budgets.length === 0 ? (
          <p className="text-slate-500 text-center py-4 text-sm">Belum ada anggaran yang diatur.</p>
        ) : (
          <div className="space-y-6">
            {budgets.map((b) => {
              const spent = expensesByCategory[b.category] || 0
              const limit = Number(b.amount)
              const percentage = Math.min((spent / limit) * 100, 100)
              const isWarning = percentage > 80
              const isDanger = percentage >= 100

              return (
                <div key={b.id}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-slate-800">{b.category}</span>
                    <span className="font-medium text-slate-600">
                      Rp {spent.toLocaleString('id-ID')} <span className="text-slate-400 font-normal">/ Rp {limit.toLocaleString('id-ID')}</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isDanger ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  {isDanger && <p className="text-xs text-rose-500 mt-1">Anggaran telah melampaui batas!</p>}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Form Tambah/Ubah Anggaran */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-500" /> Atur Anggaran Baru
        </h2>
        <BudgetForm userCategories={userCategories || []} />
      </div>

    </div>
  )
}
