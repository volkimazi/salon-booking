'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Appointment, Service, BlockedSlot } from '@/types'

type Tab = 'appointments' | 'services' | 'blocked'
type StatusFilter = 'all' | 'pending' | 'confirmed' | 'cancelled'

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('appointments')
  const [appointments, setAppointments] = useState<(Appointment & { services: Service })[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([])
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending')
  const [dateFilter, setDateFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/admin/login')
      else fetchAll()
    })
  }, [])

  async function fetchAll() {
    setLoading(true)
    const [appts, svcs, blocked] = await Promise.all([
      supabase.from('appointments').select('*, services(*)').order('appointment_date', { ascending: true }),
      supabase.from('services').select('*').order('created_at'),
      supabase.from('blocked_slots').select('*').order('blocked_date'),
    ])
    setAppointments((appts.data as any) || [])
    setServices(svcs.data || [])
    setBlockedSlots(blocked.data || [])
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('appointments').update({ status }).eq('id', id)
    fetchAll()
  }

  async function deleteService(id: string) {
    if (!confirm('Bu hizmeti kaldırmak istediğinize emin misiniz?')) return
    await supabase.from('services').update({ is_active: false }).eq('id', id)
    fetchAll()
  }

  async function removeBlocked(id: string) {
    await supabase.from('blocked_slots').delete().eq('id', id)
    fetchAll()
  }

  async function addBlocked() {
    const date = prompt('Bloke tarih (YYYY-MM-DD):')
    const time = prompt('Bloke saat (HH:MM):')
    if (!date || !time) return
    await supabase.from('blocked_slots').insert({ blocked_date: date, blocked_time: time })
    fetchAll()
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const filteredAppts = appointments.filter(a => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false
    if (dateFilter && a.appointment_date !== dateFilter) return false
    return true
  })

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    }
    const labels: Record<string, string> = {
      pending: 'Bekliyor',
      confirmed: 'Onaylandı',
      cancelled: 'İptal',
    }
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${map[status]}`}>
        {labels[status]}
      </span>
    )
  }

  if (loading) return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-sm text-stone-400">
      Yükleniyor...
    </div>
  )

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1A1A1A] rounded-full flex items-center justify-center">
            <span className="text-[#C9A96E] text-xs font-bold">BB</span>
          </div>
          <p className="font-medium text-sm">Admin Panel</p>
        </div>
        <button onClick={logout} className="text-xs text-stone-400 hover:text-stone-700">Çıkış</button>
      </header>

      <div className="px-6 py-4 flex gap-3 border-b border-stone-200 bg-white overflow-x-auto">
        {(['appointments', 'services', 'blocked'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-xs px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              tab === t ? 'bg-[#1A1A1A] text-white' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {t === 'appointments'
              ? `Randevular (${appointments.filter(a => a.status === 'pending').length})`
              : t === 'services' ? 'Hizmetler' : 'Bloke Saatler'}
          </button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">

        {tab === 'appointments' && (
          <div>
            <div className="flex gap-2 mb-4 flex-wrap">
              {(['all', 'pending', 'confirmed', 'cancelled'] as StatusFilter[]).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    statusFilter === s
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'border-stone-200 text-stone-500'
                  }`}
                >
                  {s === 'all' ? 'Tümü' : s === 'pending' ? 'Bekleyenler' : s === 'confirmed' ? 'Onaylananlar' : 'İptal'}
                </button>
              ))}
              <input
                type="date"
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                className="text-xs border border-stone-200 rounded-full px-3 py-1.5 focus:outline-none"
              />
              {dateFilter && (
                <button onClick={() => setDateFilter('')} className="text-xs text-stone-400">✕</button>
              )}
            </div>

            <div className="space-y-3">
              {filteredAppts.map(appt => (
                <div key={appt.id} className="bg-white rounded-2xl p-5 border border-stone-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-sm">{appt.customer_name}</p>
                      <p className="text-xs text-stone-400">{appt.customer_phone}</p>
                    </div>
                    {statusBadge(appt.status)}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-stone-500 mb-3">
                    <span>📅 {appt.appointment_date}</span>
                    <span>🕐 {appt.appointment_time?.slice(0, 5)}</span>
                    <span>💅 {appt.services?.name}</span>
                    <span>₺{appt.services?.price}</span>
                  </div>
                  {appt.customer_note && (
                    <p className="text-xs text-stone-400 mb-3">📝 {appt.customer_note}</p>
                  )}
                  <div className="flex gap-2">
                    {appt.status !== 'confirmed' && (
                      <button
                        onClick={() => updateStatus(appt.id, 'confirmed')}
                        className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-100"
                      >
                        Onayla
                      </button>
                    )}
                    {appt.status !== 'cancelled' && (
                      <button
                        onClick={() => updateStatus(appt.id, 'cancelled')}
                        className="text-xs bg-red-50 text-red-700 px-3 py-1.5 rounded-full hover:bg-red-100"
                      >
                        İptal Et
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {filteredAppts.length === 0 && (
                <p className="text-center text-stone-400 text-sm py-12">Randevu bulunamadı</p>
              )}
            </div>
          </div>
        )}

        {tab === 'services' && (
          <div className="space-y-3">
            {services.map(s => (
              <div key={s.id} className="bg-white rounded-2xl p-5 border border-stone-200 flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{s.name}</p>
                  <p className="text-xs text-stone-400">{s.duration_minutes} dk · ₺{s.price}</p>
                  {s.description && <p className="text-xs text-stone-400 mt-1">{s.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                    {s.is_active ? 'Aktif' : 'Pasif'}
                  </span>
                  {s.is_active && (
                    <button onClick={() => deleteService(s.id)} className="text-xs text-red-400 hover:text-red-600">
                      Kaldır
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'blocked' && (
          <div>
            <button
              onClick={addBlocked}
              className="mb-4 bg-[#1A1A1A] text-white text-xs px-4 py-2.5 rounded-full hover:bg-[#C9A96E] transition-colors"
            >
              + Bloke Saat Ekle
            </button>
            <div className="space-y-3">
              {blockedSlots.map(b => (
                <div key={b.id} className="bg-white rounded-2xl p-4 border border-stone-200 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{b.blocked_date}</p>
                    <p className="text-xs text-stone-400">{b.blocked_time?.slice(0, 5)}{b.reason && ` · ${b.reason}`}</p>
                  </div>
                  <button onClick={() => removeBlocked(b.id)} className="text-xs text-red-400 hover:text-red-600">
                    Kaldır
                  </button>
                </div>
              ))}
              {blockedSlots.length === 0 && (
                <p className="text-stone-400 text-sm text-center py-8">Bloke saat yok</p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}