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
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A1208 0%, #2C1E0A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Helvetica Neue', sans-serif", position: 'relative', overflow: 'hidden' }}>

      {/* Arka plan efekti */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(200,168,75,0.12) 0%, transparent 60%)' }} />
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,168,75,0.06) 0%, transparent 70%)' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,168,75,0.04) 0%, transparent 70%)' }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: 420, padding: '0 24px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #C8A84B, #A07830)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 16, margin: '0 auto 16px', boxShadow: '0 12px 40px rgba(200,168,75,0.4)' }}>
            <span style={{ color: 'white', fontSize: 26, fontWeight: 'bold', fontFamily: 'serif' }}>BB</span>
          </div>
          <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, letterSpacing: 3, color: '#C8A84B' }}>BURCU BOZKIR</p>
          <p style={{ margin: 0, fontSize: 10, color: '#6A5A30', letterSpacing: 2 }}>BEAUTY STUDIO · YÖNETİCİ GİRİŞİ</p>
        </div>

        {/* Form kartı */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,168,75,0.15)', borderRadius: 20, padding: '36px 32px', backdropFilter: 'blur(10px)' }}>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 10, color: '#C8A84B', letterSpacing: 2, marginBottom: 8 }}>E-POSTA</label>
            <input
              type="email"
              placeholder="admin@burcubozkir.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,168,75,0.2)', borderRadius: 10, fontSize: 13, color: 'white', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 10, color: '#C8A84B', letterSpacing: 2, marginBottom: 8 }}>ŞİFRE</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,168,75,0.2)', borderRadius: 10, fontSize: 13, color: 'white', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {error && (
            <div style={{ background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
              <p style={{ margin: 0, fontSize: 11, color: '#FF8A80' }}>⚠️ {error}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', padding: '15px', background: loading ? 'rgba(200,168,75,0.5)' : 'linear-gradient(135deg, #C8A84B, #A07830)', color: '#1A1208', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 800, letterSpacing: 3, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 8px 24px rgba(200,168,75,0.35)' }}
          >
            {loading ? 'GİRİŞ YAPILIYOR...' : 'GİRİŞ YAP'}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 10, color: '#4A3A20', letterSpacing: 1 }}>
          © 2025 Burcu Bozkır Beauty Studio
        </p>
      </div>
    </main>
  )
}