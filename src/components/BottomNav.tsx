'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, List, PieChart, Target } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Transaksi', href: '/dashboard/transactions', icon: List },
    { name: 'Analitik', href: '/dashboard/analytics', icon: PieChart },
    { name: 'Anggaran', href: '/dashboard/budget', icon: Target },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center pb-safe z-50">
      {links.map((link) => {
        const Icon = link.icon
        const isActive = pathname === link.href
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex flex-col items-center justify-center w-full py-3 gap-1 ${
              isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{link.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
