'use client'

import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
      setIsInstallable(false)
    } else {
      console.log('User dismissed the install prompt')
    }
    
    // Clear the deferredPrompt variable, since it can only be used once
    setDeferredPrompt(null)
  }

  if (!isInstallable || isInstalled) {
    return null
  }

  return (
    <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center shadow-md md:hidden fixed top-0 left-0 right-0 z-50 animate-in slide-in-from-top-full duration-300">
      <div className="flex flex-col">
        <span className="font-bold text-sm">Instal Aplikasi DompetKu</span>
        <span className="text-xs text-blue-100">Akses lebih cepat & mudah dari HP</span>
      </div>
      <button 
        onClick={handleInstallClick}
        className="bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-blue-50 active:scale-95 transition-all"
      >
        Instal
      </button>
    </div>
  )
}
