import Link from 'next/link'
import { Home, List, PieChart, Target, LogOut, Wallet } from 'lucide-react'
import { logout } from '@/app/actions/auth'

export default function Sidebar({ userEmail }: { userEmail: string }) {
  return (
    <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 min-h-screen flex-col transition-all">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 text-white font-bold text-xl gap-2">

        <Wallet className="w-6 h-6 text-emerald-400" />
        DompetKu
      </div>
      
      <div className="p-4 border-b border-slate-800">
        <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Akun</p>
        <p className="text-sm truncate text-slate-200">{userEmail}</p>
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
          <Home className="w-5 h-5" /> Dashboard
        </Link>
        <Link href="/dashboard/transactions" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
          <List className="w-5 h-5" /> Data Transaksi
        </Link>
        <Link href="/dashboard/analytics" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
          <PieChart className="w-5 h-5" /> Analitik
        </Link>
        <Link href="/dashboard/budget" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
          <Target className="w-5 h-5" /> Anggaran
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <form action={logout}>
          <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors">
            <LogOut className="w-5 h-5" /> Keluar
          </button>
        </form>
      </div>
    </aside>
  )
}
