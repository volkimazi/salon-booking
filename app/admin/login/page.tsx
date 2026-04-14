'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('E-posta veya şifre hatalı')
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-[#C9A96E] font-bold text-xs">BB</span>
          </div>
          <p className="font-medium">Yönetici Girişi</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-stone-200 space-y-4">
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E]"
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E]"
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#1A1A1A] text-white py-3 rounded-full text-sm hover:bg-[#C9A96E] transition-colors disabled:opacity-50"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </div>
      </div>
    </main>
  )
}