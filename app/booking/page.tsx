'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Service, BookingFormData } from '@/types'
import { generateTimeSlots, filterAvailableSlots } from '@/lib/booking-logic'
import { sendWhatsAppNotification } from '@/utils/whatsapp'
import Link from 'next/link'

const DAYS_TR = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
const SERVICE_ICONS: Record<string, string> = {
  'Kalıcı Makyaj': '💄',
  'Kaş Laminasyon': '✨',
  'Kirpik Lifting': '👁️',
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

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <main style={{ background: '#E8E0D4', fontFamily: "'Palatino', serif", minHeight: '100vh', paddingBottom: 60 }}>
      
      {/* HEADER */}
      <header style={{ background: '#F8F3EC', borderBottom: '1px solid #D4B89630', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ color: '#7A5A28', fontSize: 20, textDecoration: 'none', lineHeight: 1 }}>←</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(145deg, #1A1208, #2C1E0A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#D4A840', fontSize: 13, fontWeight: 'bold' }}>BB</span>
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 11, letterSpacing: 2, color: '#1A1208' }}>RANDEVU AL</p>
            <p style={{ margin: 0, fontSize: 9, color: '#7A5A28', letterSpacing: 1 }}>Burcu Bozkır Beauty Studio</p>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 500, margin: '0 auto', padding: '28px 16px' }}>

        {/* ADIM GÖSTERGESİ */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
          {['Hizmet', 'Tarih', 'Saat', 'Bilgi'].map((step, i) => {
            const stepNum = i + 1
            const isActive = stepNum === 1 || (stepNum === 2 && selectedService) || (stepNum === 3 && selectedDate) || (stepNum === 4 && form.appointment_time)
            const isDone = (stepNum === 1 && selectedService) || (stepNum === 2 && selectedDate) || (stepNum === 3 && form.appointment_time)
            return (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: isDone ? '#7A5A28' : isActive ? '#1A1208' : '#D4B89640',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 'bold',
                    color: isDone || isActive ? '#D4A840' : '#8A6A48',
                  }}>
                    {isDone ? '✓' : stepNum}
                  </div>
                  <span style={{ fontSize: 8, color: isActive ? '#1A1208' : '#8A6A48', letterSpacing: 1 }}>{step.toUpperCase()}</span>
                </div>
                {i < 3 && <div style={{ width: 24, height: 1, background: '#D4B89640', marginBottom: 16 }} />}
              </div>
            )
          })}
        </div>

        {/* 1. HİZMET */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 9, letterSpacing: 3, color: '#7A5A28', marginBottom: 14, textAlign: 'center' }}>HİZMET SEÇİN</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {services.map((service, i) => {
              const isSelected = form.service_id === service.id
              const icon = SERVICE_ICONS[service.name] || '✦'
              return (
                <div
                  key={service.id}
                  onClick={() => { setSelectedService(service); setForm(f => ({ ...f, service_id: service.id })) }}
                  style={{
                    cursor: 'pointer',
                    borderRadius: 20,
                    border: isSelected ? '2px solid #7A5A28' : '2px solid transparent',
                    background: isSelected ? '#F8F3EC' : 'white',
                    boxShadow: isSelected ? '0 4px 20px rgba(122,90,40,0.15)' : '0 2px 12px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'stretch' }}>
                    {/* Sol renk şeridi */}
                    <div style={{
                      width: 6,
                      background: isSelected ? '#7A5A28' : '#D4B89640',
                      flexShrink: 0,
                    }} />
                    <div style={{ padding: '18px 16px', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: isSelected ? 'linear-gradient(145deg, #1A1208, #2C1E0A)' : '#F5F0E8',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 20, flexShrink: 0,
                          }}>
                            {icon}
                          </div>
                          <div>
                            <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 15, color: '#1A1208' }}>{service.name}</p>
                            <p style={{ margin: 0, fontSize: 10, color: '#8A6A48' }}>{service.description}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                              <span style={{ fontSize: 9, color: '#AA8A68', background: '#F5F0E8', padding: '2px 8px', borderRadius: 10 }}>⏱ {service.duration_minutes} dk</span>
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: 18, color: '#7A5A28' }}>₺{service.price}</p>
                          {isSelected && <p style={{ margin: '4px 0 0', fontSize: 9, color: '#7A5A28' }}>✓ Seçildi</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {errors.service_id && <p style={{ color: '#C0392B', fontSize: 11, marginTop: 8, textAlign: 'center' }}>{errors.service_id}</p>}
        </div>

        {/* 2. TARİH */}
        {selectedService && (
          <div style={{ marginBottom: 24, background: 'white', borderRadius: 20, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: 9, letterSpacing: 3, color: '#7A5A28', marginBottom: 14, textAlign: 'center' }}>TARİH SEÇİN</p>
            <input
              type="date" min={todayStr} value={selectedDate}
              onChange={e => { setSelectedDate(e.target.value); setForm(f => ({ ...f, appointment_date: e.target.value })) }}
              style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '2px solid #D4B89640', background: '#FAF8F5', fontSize: 14, boxSizing: 'border-box', color: '#1A1208' }}
            />
            {selectedDate && (
              <p style={{ fontSize: 12, color: '#7A5A28', marginTop: 8, textAlign: 'center', fontStyle: 'italic' }}>
                {DAYS_TR[new Date(selectedDate).getDay()]} günü seçildi
              </p>
            )}
            {errors.appointment_date && <p style={{ color: '#C0392B', fontSize: 11, marginTop: 6 }}>{errors.appointment_date}</p>}
          </div>
        )}

        {/* 3. SAAT */}
        {selectedDate && (
          <div style={{ marginBottom: 24, background: 'white', borderRadius: 20, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: 9, letterSpacing: 3, color: '#7A5A28', marginBottom: 14, textAlign: 'center' }}>SAAT SEÇİN</p>
            {loadingSlots ? (
              <p style={{ fontSize: 13, color: '#8A6A48', textAlign: 'center' }}>Müsait saatler yükleniyor...</p>
            ) : availableSlots.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 16 }}>
                <p style={{ fontSize: 24, marginBottom: 8 }}>😔</p>
                <p style={{ fontSize: 13, color: '#8A6A48' }}>Bu tarihte müsait saat yok.</p>
                <p style={{ fontSize: 11, color: '#AA8A68' }}>Lütfen başka bir gün seçin.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {availableSlots.map(slot => (
                  <div
                    key={slot}
                    onClick={() => setForm(f => ({ ...f, appointment_time: slot }))}
                    style={{
                      cursor: 'pointer',
                      padding: '12px 4px',
                      borderRadius: 12,
                      textAlign: 'center',
                      fontSize: 13,
                      fontWeight: 600,
                      background: form.appointment_time === slot ? '#1A1208' : '#FAF8F5',
                      color: form.appointment_time === slot ? '#D4A840' : '#1A1208',
                      border: '2px solid',
                      borderColor: form.appointment_time === slot ? '#1A1208' : '#D4B89630',
                      boxShadow: form.appointment_time === slot ? '0 4px 12px rgba(26,18,8,0.2)' : 'none',
                    }}
                  >
                    {slot}
                  </div>
                ))}
              </div>
            )}
            {errors.appointment_time && <p style={{ color: '#C0392B', fontSize: 11, marginTop: 8 }}>{errors.appointment_time}</p>}
          </div>
        )}

        {/* 4. BİLGİLER */}
        {form.appointment_time && (
          <div style={{ marginBottom: 24, background: 'white', borderRadius: 20, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: 9, letterSpacing: 3, color: '#7A5A28', marginBottom: 14, textAlign: 'center' }}>BİLGİLERİNİZ</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 10, color: '#8A6A48', letterSpacing: 1, display: 'block', marginBottom: 6 }}>AD SOYAD</label>
                <input
                  type="text" placeholder="Adınız ve soyadınız" value={form.customer_name}
                  onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                  style={{ width: '100%', padding: '13px 16px', borderRadius: 12, border: '2px solid #D4B89640', background: '#FAF8F5', fontSize: 14, boxSizing: 'border-box' }}
                />
                {errors.customer_name && <p style={{ color: '#C0392B', fontSize: 11, margin: '4px 0 0' }}>{errors.customer_name}</p>}
              </div>
              <div>
                <label style={{ fontSize: 10, color: '#8A6A48', letterSpacing: 1, display: 'block', marginBottom: 6 }}>TELEFON</label>
                <input
                  type="tel" placeholder="05XX XXX XX XX" value={form.customer_phone}
                  onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))}
                  style={{ width: '100%', padding: '13px 16px', borderRadius: 12, border: '2px solid #D4B89640', background: '#FAF8F5', fontSize: 14, boxSizing: 'border-box' }}
                />
                {errors.customer_phone && <p style={{ color: '#C0392B', fontSize: 11, margin: '4px 0 0' }}>{errors.customer_phone}</p>}
              </div>
              <div>
                <label style={{ fontSize: 10, color: '#8A6A48', letterSpacing: 1, display: 'block', marginBottom: 6 }}>NOT (İSTEĞE BAĞLI)</label>
                <textarea
                  placeholder="Özel bir isteğiniz var mı?" value={form.customer_note} rows={3}
                  onChange={e => setForm(f => ({ ...f, customer_note: e.target.value }))}
                  style={{ width: '100%', padding: '13px 16px', borderRadius: 12, border: '2px solid #D4B89640', background: '#FAF8F5', fontSize: 14, resize: 'none', boxSizing: 'border-box' }}
                />
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
                ['📅 Tarih', form.appointment_date],
                ['🕐 Saat', form.appointment_time],
                ['💰 Ücret', `₺${selectedService?.price}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #ffffff10' }}>
                  <span style={{ fontSize: 12, color: '#6A5A40' }}>{k}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: k?.includes('Ücret') ? '#D4A840' : '#F0E0B0' }}>{v}</span>
                </div>
              ))}
            </div>
            {errors.general && <p style={{ color: '#C0392B', fontSize: 12, marginBottom: 10, textAlign: 'center' }}>{errors.general}</p>}
            <button
              onClick={handleSubmit} disabled={submitting}
              style={{
                width: '100%', padding: '18px', borderRadius: 28,
                background: 'linear-gradient(135deg, #7A5A28, #1A1208)',
                color: '#D4A840', fontSize: 13, fontWeight: 700,
                letterSpacing: 2, border: 'none', cursor: 'pointer',
                opacity: submitting ? 0.7 : 1,
                boxShadow: '0 8px 24px rgba(26,18,8,0.3)',
              }}
            >
              {submitting ? 'GÖNDERİLİYOR...' : 'RANDEVUYU ONAYLA →'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}