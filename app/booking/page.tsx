'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Service, BookingFormData } from '@/types'
import { generateTimeSlots, filterAvailableSlots } from '@/lib/booking-logic'
import { sendWhatsAppNotification } from '@/utils/whatsapp'
import Link from 'next/link'

const DAYS_TR = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']
const MONTHS_TR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']

const SERVICE_DATA: Record<string, { image: string }> = {
  'Kalıcı Makyaj': { image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80' },
  'Kaş Laminasyon': { image: 'https://images.unsplash.com/photo-1560574188-6a6774965120?w=400&q=80' },
  'Kirpik Lifting': { image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=400&q=80' },
}
const DEFAULT_SERVICE = { image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80' }

function Calendar({ onSelect, selected }: { onSelect: (date: string) => void; selected: string }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) } else setViewMonth(m => m - 1) }
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) } else setViewMonth(m => m + 1) }
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div style={{ background: '#FAF7F2', borderRadius: 14, padding: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <button onClick={prevMonth} style={{ background: '#F0EBE0', border: 'none', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', fontSize: 16, color: '#7A5A28' }}>‹</button>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: '#1A1208' }}>{MONTHS_TR[viewMonth]} {viewYear}</p>
        <button onClick={nextMonth} style={{ background: '#F0EBE0', border: 'none', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', fontSize: 16, color: '#7A5A28' }}>›</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 4 }}>
        {DAYS_TR.map(d => <div key={d} style={{ textAlign: 'center', fontSize: 9, color: '#AA8A68', fontWeight: 700, padding: '3px 0' }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const isPast = dateStr < todayStr
          const isSelected = dateStr === selected
          const isToday = dateStr === todayStr
          return (
            <button key={dateStr} onClick={() => !isPast && onSelect(dateStr)} disabled={isPast}
              style={{ border: 'none', borderRadius: 8, padding: '9px 2px', cursor: isPast ? 'not-allowed' : 'pointer', textAlign: 'center', fontSize: 12, fontWeight: isSelected ? 700 : 400, background: isSelected ? '#1A1208' : isToday ? '#F0EBE0' : 'transparent', color: isSelected ? '#D4A840' : isPast ? '#D4B89660' : isToday ? '#7A5A28' : '#1A1208', outline: isToday && !isSelected ? '1px solid #D4B89680' : 'none' }}>
              {day}
            </button>
          )
        })}
      </div>
      {selected && <p style={{ textAlign: 'center', fontSize: 11, color: '#7A5A28', marginTop: 10, fontStyle: 'italic' }}>📅 {selected.split('-').reverse().join('.')} seçildi</p>}
    </div>
  )
}

export default function BookingPage() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [form, setForm] = useState<BookingFormData>({
    service_id: '', appointment_date: '', appointment_time: '',
    customer_name: '', customer_phone: '', customer_note: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    supabase.from('services').select('*').eq('is_active', true)
      .then(({ data }) => setServices(data || []))
  }, [])

  useEffect(() => {
    if (!selectedService || !selectedDate) return
    setLoadingSlots(true)
    setAvailableSlots([])
    setForm(f => ({ ...f, appointment_time: '' }))
    const dayOfWeek = new Date(selectedDate).getDay()
    Promise.all([
      supabase.from('working_hours').select('*').eq('day_of_week', dayOfWeek).eq('is_active', true),
      supabase.from('appointments').select('*').eq('appointment_date', selectedDate),
      supabase.from('blocked_slots').select('*').eq('blocked_date', selectedDate),
    ]).then(([wh, appts, blocked]) => {
      const workingDay = wh.data?.[0]
      if (!workingDay) { setAvailableSlots([]); setLoadingSlots(false); return }
      const allSlots = generateTimeSlots(workingDay.start_time, workingDay.end_time, selectedService.duration_minutes)
      const available = filterAvailableSlots(allSlots, selectedDate, appts.data || [], blocked.data || [])
      setAvailableSlots(available)
      setLoadingSlots(false)
    })
  }, [selectedService, selectedDate])

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!form.service_id) e.service_id = 'Hizmet seçiniz'
    if (!form.appointment_date) e.appointment_date = 'Tarih seçiniz'
    if (!form.appointment_time) e.appointment_time = 'Saat seçiniz'
    if (!form.customer_name.trim()) e.customer_name = 'Ad Soyad giriniz'
    if (!form.customer_phone.trim()) e.customer_phone = 'Telefon numarası giriniz'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setSubmitting(true)
    const { data: existing } = await supabase.from('appointments').select('id')
      .eq('appointment_date', form.appointment_date)
      .eq('appointment_time', form.appointment_time)
      .neq('status', 'cancelled')
    if (existing && existing.length > 0) {
      setErrors({ appointment_time: 'Bu saat dolu, lütfen başka bir saat seçin' })
      setSubmitting(false)
      return
    }
    const { error } = await supabase.from('appointments').insert({ ...form, status: 'pending' })
    if (error) {
      setErrors({ general: 'Bir hata oluştu, lütfen tekrar deneyin' })
      setSubmitting(false)
      return
    }
    sendWhatsAppNotification({
      customerName: form.customer_name, customerPhone: form.customer_phone,
      serviceName: selectedService!.name, date: form.appointment_date,
      time: form.appointment_time, note: form.customer_note,
    })
    router.push(`/success?name=${encodeURIComponent(form.customer_name)}&service=${encodeURIComponent(selectedService!.name)}&date=${form.appointment_date}&time=${form.appointment_time}`)
  }

  return (
    <main style={{ background: '#E8E0D4', fontFamily: "'Palatino', serif", minHeight: '100vh', paddingBottom: 60 }}>

      <header style={{ background: '#F8F3EC', borderBottom: '1px solid #D4B89630', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ color: '#7A5A28', fontSize: 20, textDecoration: 'none' }}>←</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(145deg, #1A1208, #2C1E0A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#D4A840', fontSize: 13, fontWeight: 'bold' }}>BB</span>
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 11, letterSpacing: 2, color: '#1A1208' }}>RANDEVU AL</p>
            <p style={{ margin: 0, fontSize: 9, color: '#7A5A28' }}>Burcu Bozkır Beauty Studio</p>
          </div>
        </div>
      </header>

      <div style={{ background: '#F8F3EC', padding: '14px 20px', borderBottom: '1px solid #D4B89620' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {['Hizmet', 'Tarih & Saat', 'Bilgi', 'Onay'].map((step, i) => {
            const done = (i === 0 && selectedService) || (i === 1 && form.appointment_time) || (i === 2 && form.customer_phone)
            const active = i === 0 || (i === 1 && selectedService) || (i === 2 && form.appointment_time) || (i === 3 && form.customer_phone)
            return (
              <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: done ? '#7A5A28' : active ? '#1A1208' : '#D4B89640', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 'bold', color: done || active ? '#D4A840' : '#8A6A48' }}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: 7, color: active ? '#1A1208' : '#AA8A68', letterSpacing: 0.5 }}>{step.toUpperCase()}</span>
                </div>
                {i < 3 && <div style={{ width: 28, height: 1, background: done ? '#7A5A28' : '#D4B89640', margin: '0 4px', marginBottom: 16 }} />}
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ maxWidth: 500, margin: '0 auto', padding: '24px 16px' }}>

        {/* HİZMET KARTLARI */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <p style={{ fontSize: 9, letterSpacing: 4, color: '#7A5A28', margin: '0 0 4px' }}>ADIM 1</p>
            <h2 style={{ fontSize: 20, fontWeight: 400, color: '#1A1208', margin: 0 }}>Hizmet Seçin</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {services.map((service) => {
              const isSelected = form.service_id === service.id
              const data = SERVICE_DATA[service.name] || DEFAULT_SERVICE

              return (
                <div key={service.id} style={{ borderRadius: 20, overflow: 'hidden', border: isSelected ? '2px solid #7A5A28' : '2px solid transparent', boxShadow: isSelected ? '0 8px 28px rgba(122,90,40,0.2)' : '0 2px 16px rgba(0,0,0,0.07)', background: 'white' }}>

                  {/* Fotoğraf */}
                  <div onClick={() => { setSelectedService(service); setForm(f => ({ ...f, service_id: service.id, appointment_date: '', appointment_time: '' })); setSelectedDate(''); setAvailableSlots([]) }}
                    style={{ position: 'relative', height: 130, overflow: 'hidden', cursor: 'pointer' }}>
                    <img src={data.image} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, rgba(26,18,8,0.7) 100%)' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: 'white' }}>{service.name}</p>
                        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: 8 }}>⏱ {service.duration_minutes} dk</span>
                      </div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 19, color: '#D4A840' }}>₺{service.price}</p>
                    </div>
                    {isSelected && (
                      <div style={{ position: 'absolute', top: 10, right: 10, width: 26, height: 26, borderRadius: '50%', background: '#7A5A28', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#D4A840', fontSize: 13, fontWeight: 'bold' }}>✓</span>
                      </div>
                    )}
                  </div>

                  {/* Alt kısım */}
                  <div style={{ padding: '12px 16px', background: isSelected ? '#FAF7F2' : 'white' }}>
                    <p style={{ margin: '0 0 10px', fontSize: 11, color: '#8A6A48' }}>{service.description}</p>

                    <div onClick={() => { setSelectedService(service); setForm(f => ({ ...f, service_id: service.id })) }}
                      style={{ background: isSelected ? 'linear-gradient(135deg, #7A5A28, #1A1208)' : '#F5F0E8', borderRadius: 10, padding: '10px 14px', textAlign: 'center', cursor: 'pointer' }}>
                      <span style={{ fontSize: 11, color: isSelected ? '#D4A840' : '#7A5A28', letterSpacing: 1, fontWeight: 700 }}>
                        {isSelected ? '✓ SEÇİLDİ' : '📅 RANDEVU AL'}
                      </span>
                    </div>

                    {/* TAKVİM + SAAT — KART İÇİNDE */}
                    {isSelected && (
                      <div style={{ marginTop: 16, borderTop: '1px solid #D4B89630', paddingTop: 16 }}>
                        
                        {/* Takvim */}
                        <p style={{ fontSize: 9, letterSpacing: 3, color: '#7A5A28', margin: '0 0 10px', textAlign: 'center' }}>📅 TARİH SEÇİN</p>
                        <Calendar
                          selected={selectedDate}
                          onSelect={(date) => { setSelectedDate(date); setForm(f => ({ ...f, appointment_date: date, appointment_time: '' })) }}
                        />

                        {/* Saatler */}
                        {selectedDate && (
                          <div style={{ marginTop: 16 }}>
                            <p style={{ fontSize: 9, letterSpacing: 3, color: '#7A5A28', margin: '0 0 10px', textAlign: 'center' }}>🕐 SAAT SEÇİN</p>
                            {loadingSlots ? (
                              <p style={{ fontSize: 12, color: '#8A6A48', textAlign: 'center' }}>Yükleniyor...</p>
                            ) : availableSlots.length === 0 ? (
                              <p style={{ fontSize: 12, color: '#8A6A48', textAlign: 'center', background: '#F5F0E8', padding: 12, borderRadius: 10 }}>😔 Bu tarihte müsait saat yok.</p>
                            ) : (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                                {availableSlots.map(slot => (
                                  <div key={slot} onClick={() => setForm(f => ({ ...f, appointment_time: slot }))}
                                    style={{ cursor: 'pointer', padding: '10px 4px', borderRadius: 10, textAlign: 'center', fontSize: 13, fontWeight: 600, background: form.appointment_time === slot ? '#1A1208' : '#F5F0E8', color: form.appointment_time === slot ? '#D4A840' : '#1A1208', border: '2px solid', borderColor: form.appointment_time === slot ? '#1A1208' : 'transparent' }}>
                                    {slot}
                                  </div>
                                ))}
                              </div>
                            )}
                            {errors.appointment_time && <p style={{ color: '#C0392B', fontSize: 11, marginTop: 6, textAlign: 'center' }}>{errors.appointment_time}</p>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          {errors.service_id && <p style={{ color: '#C0392B', fontSize: 11, marginTop: 8, textAlign: 'center' }}>{errors.service_id}</p>}
        </div>

        {/* BİLGİLER */}
        {form.appointment_time && (
          <div style={{ marginBottom: 24, background: 'white', borderRadius: 20, padding: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 9, letterSpacing: 4, color: '#7A5A28', margin: '0 0 4px' }}>ADIM 2</p>
              <h2 style={{ fontSize: 18, fontWeight: 400, color: '#1A1208', margin: 0 }}>Bilgileriniz</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 10, color: '#8A6A48', letterSpacing: 1, display: 'block', marginBottom: 6 }}>AD SOYAD</label>
                <input type="text" placeholder="Adınız ve soyadınız" value={form.customer_name}
                  onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                  style={{ width: '100%', padding: '13px 16px', borderRadius: 12, border: '2px solid #D4B89640', background: '#FAF8F5', fontSize: 14, boxSizing: 'border-box' }} />
                {errors.customer_name && <p style={{ color: '#C0392B', fontSize: 11, margin: '4px 0 0' }}>{errors.customer_name}</p>}
              </div>
              <div>
                <label style={{ fontSize: 10, color: '#8A6A48', letterSpacing: 1, display: 'block', marginBottom: 6 }}>TELEFON</label>
                <input type="tel" placeholder="05XX XXX XX XX" value={form.customer_phone}
                  onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))}
                  style={{ width: '100%', padding: '13px 16px', borderRadius: 12, border: '2px solid #D4B89640', background: '#FAF8F5', fontSize: 14, boxSizing: 'border-box' }} />
                {errors.customer_phone && <p style={{ color: '#C0392B', fontSize: 11, margin: '4px 0 0' }}>{errors.customer_phone}</p>}
              </div>
              <div>
                <label style={{ fontSize: 10, color: '#8A6A48', letterSpacing: 1, display: 'block', marginBottom: 6 }}>NOT (İSTEĞE BAĞLI)</label>
                <textarea placeholder="Özel bir isteğiniz var mı?" value={form.customer_note} rows={3}
                  onChange={e => setForm(f => ({ ...f, customer_note: e.target.value }))}
                  style={{ width: '100%', padding: '13px 16px', borderRadius: 12, border: '2px solid #D4B89640', background: '#FAF8F5', fontSize: 14, resize: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>
        )}

        {/* ÖZET + GÖNDER */}
        {form.customer_phone && (
          <div>
            <div style={{ background: '#1A1208', borderRadius: 20, padding: 20, marginBottom: 12 }}>
              <p style={{ fontSize: 9, color: '#D4A840', letterSpacing: 3, marginBottom: 14, textAlign: 'center' }}>RANDEVU ÖZETİ</p>
              {[
                ['💅 Hizmet', selectedService?.name],
                ['📅 Tarih', selectedDate ? selectedDate.split('-').reverse().join('.') : ''],
                ['🕐 Saat', form.appointment_time],
                ['💰 Ücret', `₺${selectedService?.price}`],
              ].map(([k, v]) => (
                <div key={String(k)} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #ffffff10' }}>
                  <span style={{ fontSize: 12, color: '#6A5A40' }}>{k}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: String(k).includes('Ücret') ? '#D4A840' : '#F0E0B0' }}>{v}</span>
                </div>
              ))}
            </div>
            {errors.general && <p style={{ color: '#C0392B', fontSize: 12, marginBottom: 10, textAlign: 'center' }}>{errors.general}</p>}
            <button onClick={handleSubmit} disabled={submitting}
              style={{ width: '100%', padding: '18px', borderRadius: 28, background: 'linear-gradient(135deg, #7A5A28, #1A1208)', color: '#D4A840', fontSize: 13, fontWeight: 700, letterSpacing: 2, border: 'none', cursor: 'pointer', opacity: submitting ? 0.7 : 1, boxShadow: '0 8px 24px rgba(26,18,8,0.3)' }}>
              {submitting ? 'GÖNDERİLİYOR...' : 'RANDEVUYU ONAYLA →'}
            </button>
            <p style={{ textAlign: 'center', fontSize: 10, color: '#8A6A48', marginTop: 12 }}>
              Randevu sonrası WhatsApp ile onay gelecektir
            </p>
          </div>
        )}
      </div>
    </main>
  )
}