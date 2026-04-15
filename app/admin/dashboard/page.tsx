'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Appointment, Service, BlockedSlot } from '@/types'

type Tab = 'appointments' | 'services' | 'blocked' | 'hours'
type StatusFilter = 'all' | 'pending' | 'confirmed' | 'cancelled'

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: 'Bekliyor', bg: '#FFF8E8', color: '#C8A84B' },
  confirmed: { label: 'Onaylandı', bg: '#E8F5EE', color: '#2C7A4A' },
  cancelled: { label: 'İptal', bg: '#FEE8E8', color: '#C0392B' },
}

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('appointments')
  const [appointments, setAppointments] = useState<(Appointment & { services: Service })[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([])
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending')
  const [dateFilter, setDateFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [cancelNote, setCancelNote] = useState('')

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

  function sendWhatsApp(phone: string, message: string) {
    const clean = phone.replace(/\D/g, '')
    const number = clean.startsWith('0') ? '90' + clean.slice(1) : clean
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank')
  }

  async function confirmAppointment(appt: Appointment & { services: Service }) {
    await supabase.from('appointments').update({ status: 'confirmed' }).eq('id', appt.id)
    const msg = `🌸 Sayın ${appt.customer_name},\n\nRandevunuz onaylandı!\n\n💅 Hizmet: ${appt.services?.name}\n📅 Tarih: ${appt.appointment_date}\n🕐 Saat: ${appt.appointment_time?.slice(0, 5)}\n\nSizi bekliyoruz.\nMetropark AVM D1-112, Sefaköy / İstanbul\n📞 0212 424 41 51\n\n— Burcu Bozkır Beauty Studio`
    sendWhatsApp(appt.customer_phone, msg)
    fetchAll()
  }

  async function cancelAppointment(appt: Appointment & { services: Service }) {
    if (!cancelNote.trim()) return
    await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', appt.id)
    const msg = `Sayın ${appt.customer_name},\n\nMaalesef randevunuz iptal edildi.\n\n💅 Hizmet: ${appt.services?.name}\n📅 Tarih: ${appt.appointment_date}\n🕐 Saat: ${appt.appointment_time?.slice(0, 5)}\n\n📝 Açıklama: ${cancelNote}\n\nYeni randevu için bize ulaşabilirsiniz.\n📞 0212 424 41 51\n\n— Burcu Bozkır Beauty Studio`
    sendWhatsApp(appt.customer_phone, msg)
    setCancellingId(null)
    setCancelNote('')
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

  const pendingCount = appointments.filter(a => a.status === 'pending').length
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length
  const todayStr = new Date().toISOString().split('T')[0]
  const todayCount = appointments.filter(a => a.appointment_date === todayStr).length

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F6F2', fontFamily: 'sans-serif' }}>
      <p style={{ color: '#C8A84B', fontSize: 14, letterSpacing: 2 }}>Yükleniyor...</p>
    </div>
  )

  const menuItems = [
    { id: 'appointments', label: 'Randevular', icon: '📅', badge: pendingCount },
    { id: 'services', label: 'Hizmetler', icon: '💅', badge: null },
    { id: 'blocked', label: 'Bloke Saatler', icon: '🔒', badge: null },
    { id: 'hours', label: 'Çalışma Saatleri', icon: '⏰', badge: null },
  ]

  return (
    <div style={{ fontFamily: "'Helvetica Neue', sans-serif", background: '#F8F6F2', minHeight: '100vh', display: 'flex' }}>

      {/* SIDEBAR */}
      <div style={{ width: 220, background: 'linear-gradient(180deg, #1A1208 0%, #2C1E0A 100%)', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 40 }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(200,168,75,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #C8A84B, #A07830)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, boxShadow: '0 4px 12px rgba(200,168,75,0.3)' }}>
              <span style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>BB</span>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, letterSpacing: 2, color: '#C8A84B', fontWeight: 700 }}>BURCU BOZKIR</p>
              <p style={{ margin: 0, fontSize: 8, color: '#6A5A30', letterSpacing: 1 }}>Admin Panel</p>
            </div>
          </div>
        </div>

        <nav style={{ padding: '16px 10px', flex: 1 }}>
          {menuItems.map(item => (
            <div key={item.id} onClick={() => setTab(item.id as Tab)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 8, marginBottom: 4, cursor: 'pointer', background: tab === item.id ? 'rgba(200,168,75,0.15)' : 'transparent', borderLeft: tab === item.id ? '3px solid #C8A84B' : '3px solid transparent' }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              <span style={{ fontSize: 12, color: tab === item.id ? '#C8A84B' : '#6A5A40', fontWeight: tab === item.id ? 700 : 400, flex: 1 }}>{item.label}</span>
              {item.badge ? (
                <div style={{ background: '#C8A84B', color: '#1A1208', fontSize: 9, fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.badge}</div>
              ) : null}
            </div>
          ))}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(200,168,75,0.1)' }}>
          <div onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', opacity: 0.5 }}>
            <span style={{ fontSize: 12 }}>🚪</span>
            <span style={{ fontSize: 11, color: '#C8A84B' }}>Çıkış Yap</span>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, marginLeft: 220, overflow: 'auto' }}>

        {/* Top bar */}
        <div style={{ background: 'white', padding: '18px 32px', borderBottom: '1px solid #EEE8E0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 30, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1A1208' }}>
              {tab === 'appointments' ? 'Randevular' : tab === 'services' ? 'Hizmetler' : tab === 'blocked' ? 'Bloke Saatler' : 'Çalışma Saatleri'}
            </h1>
            <p style={{ margin: 0, fontSize: 11, color: '#AAA' }}>Burcu Bozkır Beauty Studio</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #C8A84B, #A07830)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(200,168,75,0.3)' }}>
              <span style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>B</span>
            </div>
          </div>
        </div>

        <div style={{ padding: '28px 32px' }}>

          {/* RANDEVULAR */}
          {tab === 'appointments' && (
            <div>
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginBottom: 28 }}>
                {[
                  { label: 'Bekleyen', value: pendingCount, color: '#C8A84B', bg: '#FFF8E8', icon: '⏳' },
                  { label: 'Onaylanan', value: confirmedCount, color: '#2C7A4A', bg: '#E8F5EE', icon: '✓' },
                  { label: 'Bugünkü', value: todayCount, color: '#1A1208', bg: 'white', icon: '📅' },
                  { label: 'Toplam', value: appointments.length, color: '#5A6A8A', bg: '#EEF0F8', icon: '📊' },
                ].map(s => (
                  <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '20px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ margin: '0 0 8px', fontSize: 11, color: '#AAA' }}>{s.label}</p>
                        <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</p>
                      </div>
                      <span style={{ fontSize: 20 }}>{s.icon}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                {([['all', 'Tümü'], ['pending', 'Bekleyenler'], ['confirmed', 'Onaylananlar'], ['cancelled', 'İptal']] as [StatusFilter, string][]).map(([v, l]) => (
                  <button key={v} onClick={() => setStatusFilter(v)}
                    style={{ background: statusFilter === v ? '#1A1208' : 'white', color: statusFilter === v ? 'white' : '#888', border: `1px solid ${statusFilter === v ? '#1A1208' : '#E8E0D0'}`, borderRadius: 20, padding: '7px 16px', fontSize: 11, cursor: 'pointer', fontWeight: statusFilter === v ? 700 : 400 }}>
                    {l}
                  </button>
                ))}
                <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
                  style={{ border: '1px solid #E8E0D0', borderRadius: 8, padding: '7px 12px', fontSize: 11, color: '#888', background: 'white', marginLeft: 'auto' }} />
                {dateFilter && <button onClick={() => setDateFilter('')} style={{ fontSize: 11, color: '#AAA', background: 'none', border: 'none', cursor: 'pointer' }}>✕ Temizle</button>}
              </div>

              {/* List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filteredAppts.map(appt => {
                  const s = statusConfig[appt.status]
                  return (
                    <div key={appt.id} style={{ background: 'white', borderRadius: 14, padding: '20px 24px', border: '1px solid #EEE8E0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FFF8E8', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #C8A84B30' }}>
                            <span style={{ fontSize: 18, fontWeight: 700, color: '#C8A84B' }}>{appt.customer_name[0]}</span>
                          </div>
                          <div>
                            <p style={{ margin: '0 0 2px', fontSize: 15, fontWeight: 700, color: '#1A1208' }}>{appt.customer_name}</p>
                            <p style={{ margin: 0, fontSize: 11, color: '#AAA' }}>{appt.customer_phone}</p>
                          </div>
                        </div>
                        <span style={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 700, padding: '5px 12px', borderRadius: 20 }}>{s.label}</span>
                      </div>

                      <div style={{ display: 'flex', gap: 20, marginBottom: 16, padding: '12px 16px', background: '#F8F6F2', borderRadius: 8, flexWrap: 'wrap' }}>
                        {[
                          ['HİZMET', appt.services?.name],
                          ['TARİH', appt.appointment_date],
                          ['SAAT', appt.appointment_time?.slice(0, 5)],
                          ['ÜCRET', `₺${appt.services?.price}`],
                        ].map(([k, v]) => (
                          <div key={k}>
                            <p style={{ margin: '0 0 2px', fontSize: 9, color: '#AAA', letterSpacing: 1 }}>{k}</p>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1A1208' }}>{v}</p>
                          </div>
                        ))}
                      </div>

                      {appt.customer_note && (
                        <p style={{ margin: '0 0 14px', fontSize: 11, color: '#888', background: '#FFFBF0', padding: '8px 12px', borderRadius: 6, borderLeft: '3px solid #C8A84B' }}>📝 {appt.customer_note}</p>
                      )}

                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {appt.status !== 'confirmed' && (
                          <button onClick={() => confirmAppointment(appt)}
                            style={{ background: 'linear-gradient(135deg, #C8A84B, #A07830)', color: 'white', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 11, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(200,168,75,0.3)' }}>
                            ✓ Onayla & WA Gönder
                          </button>
                        )}
                        {appt.status !== 'cancelled' && (
                          <button onClick={() => setCancellingId(appt.id)}
                            style={{ background: '#FEE8E8', color: '#C0392B', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                            ✕ İptal Et
                          </button>
                        )}
                        {appt.status === 'confirmed' && (
                          <button onClick={() => {
                            const msg = `🌸 Sayın ${appt.customer_name}, randevunuzu hatırlatmak istedik!\n\n💅 ${appt.services?.name}\n📅 ${appt.appointment_date}\n🕐 ${appt.appointment_time?.slice(0, 5)}\n\n— Burcu Bozkır Beauty Studio`
                            sendWhatsApp(appt.customer_phone, msg)
                          }} style={{ background: '#EEF4FF', color: '#3B6AC0', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 11, cursor: 'pointer' }}>
                            📱 Hatırlatma Gönder
                          </button>
                        )}
                      </div>

                      {cancellingId === appt.id && (
                        <div style={{ marginTop: 14, padding: '16px', background: '#FEF5F5', borderRadius: 10, border: '1px solid #FDD' }}>
                          <p style={{ margin: '0 0 10px', fontSize: 11, color: '#C0392B', fontWeight: 600 }}>İptal nedeni yazın (müşteriye WA gidecek):</p>
                          <textarea value={cancelNote} onChange={e => setCancelNote(e.target.value)} rows={2}
                            placeholder="Örnek: Belirtilen saatte müsait değiliz, yeni randevu için 0212 424 41 51'i arayabilirsiniz."
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #FDD', fontSize: 11, resize: 'none', boxSizing: 'border-box', background: 'white' }} />
                          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                            <button onClick={() => cancelAppointment(appt)}
                              style={{ background: '#C0392B', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                              İptal Et & WA Gönder
                            </button>
                            <button onClick={() => { setCancellingId(null); setCancelNote('') }}
                              style={{ background: 'transparent', color: '#AAA', border: '1px solid #DDD', borderRadius: 8, padding: '8px 14px', fontSize: 11, cursor: 'pointer' }}>
                              Vazgeç
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
                {filteredAppts.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#CCC' }}>
                    <p style={{ fontSize: 40, marginBottom: 12 }}>📅</p>
                    <p style={{ fontSize: 14 }}>Randevu bulunamadı</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* HİZMETLER */}
          {tab === 'services' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                <button style={{ background: 'linear-gradient(135deg, #C8A84B, #A07830)', color: 'white', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 11, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(200,168,75,0.3)' }}>+ Hizmet Ekle</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {services.map((s, i) => (
                  <div key={s.id} style={{ background: 'white', borderRadius: 12, padding: '20px 24px', border: '1px solid #EEE8E0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #C8A84B, #A07830)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(200,168,75,0.25)' }}>
                        <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>0{i + 1}</span>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 3px', fontSize: 15, fontWeight: 700, color: '#1A1208' }}>{s.name}</p>
                        <p style={{ margin: '0 0 2px', fontSize: 11, color: '#AAA' }}>{s.duration_minutes} dk</p>
                        {s.description && <p style={{ margin: 0, fontSize: 11, color: '#CCC' }}>{s.description}</p>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 20, fontWeight: 700, color: '#C8A84B' }}>₺{s.price}</span>
                      <span style={{ background: s.is_active ? '#E8F5EE' : '#F0F0F0', color: s.is_active ? '#2C7A4A' : '#AAA', fontSize: 10, padding: '4px 10px', borderRadius: 12 }}>
                        {s.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                      {s.is_active && (
                        <button onClick={() => deleteService(s.id)}
                          style={{ background: '#FEE8E8', border: 'none', borderRadius: 8, padding: '7px 12px', fontSize: 10, color: '#C0392B', cursor: 'pointer' }}>
                          Kaldır
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BLOKE SAATLER */}
          {tab === 'blocked' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                <button onClick={addBlocked}
                  style={{ background: 'linear-gradient(135deg, #C8A84B, #A07830)', color: 'white', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 11, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(200,168,75,0.3)' }}>
                  + Bloke Saat Ekle
                </button>
              </div>
              {blockedSlots.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#CCC' }}>
                  <p style={{ fontSize: 40, marginBottom: 12 }}>🔒</p>
                  <p style={{ fontSize: 14 }}>Bloke saat yok</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {blockedSlots.map(b => (
                    <div key={b.id} style={{ background: 'white', borderRadius: 12, padding: '16px 24px', border: '1px solid #EEE8E0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 600, color: '#1A1208' }}>{b.blocked_date}</p>
                        <p style={{ margin: 0, fontSize: 11, color: '#AAA' }}>{b.blocked_time?.slice(0, 5)}{b.reason && ` · ${b.reason}`}</p>
                      </div>
                      <button onClick={() => removeBlocked(b.id)}
                        style={{ background: '#FEE8E8', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 11, color: '#C0392B', cursor: 'pointer' }}>
                        Kaldır
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ÇALIŞMA SAATLERİ */}
          {tab === 'hours' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['Pazartesi', '09:00', '20:00', true],
                ['Salı', '09:00', '20:00', true],
                ['Çarşamba', '09:00', '20:00', true],
                ['Perşembe', '09:00', '20:00', true],
                ['Cuma', '09:00', '20:00', true],
                ['Cumartesi', '10:00', '18:00', true],
                ['Pazar', '-', '-', false],
              ].map(([day, start, end, active]) => (
                <div key={String(day)} style={{ background: 'white', borderRadius: 12, padding: '16px 24px', border: '1px solid #EEE8E0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: active ? '#1A1208' : '#CCC', minWidth: 140 }}>{day}</p>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {active ? (
                      <>
                        <span style={{ fontSize: 13, color: '#888' }}>{start} — {end}</span>
                        <span style={{ background: '#E8F5EE', color: '#2C7A4A', fontSize: 10, padding: '4px 12px', borderRadius: 12 }}>Açık</span>
                      </>
                    ) : (
                      <span style={{ background: '#FEE8E8', color: '#C0392B', fontSize: 10, padding: '4px 12px', borderRadius: 12 }}>Kapalı</span>
                    )}
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