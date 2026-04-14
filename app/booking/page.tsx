'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Service, BookingFormData } from '@/types'
import { generateTimeSlots, filterAvailableSlots } from '@/lib/booking-logic'
import { sendWhatsAppNotification } from '@/utils/whatsapp'
import Link from 'next/link'

const DAYS_TR = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']

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
    <main className="min-h-screen pb-20" style={{ background: '#E8E0D4', fontFamily: "'Palatino', serif" }}>
      <header className="py-5 px-6 border-b flex items-center gap-4" style={{ background: '#F8F3EC', borderColor: '#D4B89630' }}>
        <Link href="/" style={{ color: '#7A5A28', fontSize: 13 }}>← Geri</Link>
        <div>
          <p style={{ fontWeight: 700, fontSize: 12, letterSpacing: 2, color: '#1A1208', margin: 0 }}>Randevu Al</p>
          <p style={{ fontSize: 10, color: '#7A5A28', margin: 0 }}>Burcu Bozkır Beauty Studio</p>
        </div>
      </header>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '32px 20px' }}>

        {/* 1. HİZMET */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 9, letterSpacing: 3, color: '#7A5A28', marginBottom: 12 }}>1. HİZMET</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {services.map(service => (
              <div
                key={service.id}
                onClick={() => {
                  setSelectedService(service)
                  setForm(f => ({ ...f, service_id: service.id }))
                }}
                style={{
                  cursor: 'pointer',
                  padding: '16px',
                  borderRadius: 16,
                  border: form.service_id === service.id ? '2px solid #7A5A28' : '2px solid #D4B89640',
                  background: form.service_id === service.id ? '#F8F3EC' : 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  userSelect: 'none',
                }}
              >
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: '#1A1208', margin: '0 0 3px' }}>{service.name}</p>
                  <p style={{ fontSize: 10, color: '#8A6A48', margin: 0 }}>{service.duration_minutes} dakika</p>
                </div>
                <p style={{ fontWeight: 700, color: '#7A5A28', fontSize: 15, margin: 0 }}>₺{service.price}</p>
              </div>
            ))}
          </div>
          {errors.service_id && <p style={{ color: 'red', fontSize: 11, marginTop: 6 }}>{errors.service_id}</p>}
        </div>

        {/* 2. TARİH */}
        {selectedService && (
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 9, letterSpacing: 3, color: '#7A5A28', marginBottom: 12 }}>2. TARİH</p>
            <input
              type="date" min={todayStr} value={selectedDate}
              onChange={e => { setSelectedDate(e.target.value); setForm(f => ({ ...f, appointment_date: e.target.value })) }}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '2px solid #D4B89640', background: 'white', fontSize: 14, boxSizing: 'border-box' }}
            />
            {selectedDate && <p style={{ fontSize: 11, color: '#7A5A28', marginTop: 4 }}>{DAYS_TR[new Date(selectedDate).getDay()]}</p>}
            {errors.appointment_date && <p style={{ color: 'red', fontSize: 11 }}>{errors.appointment_date}</p>}
          </div>
        )}

        {/* 3. SAAT */}
        {selectedDate && (
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 9, letterSpacing: 3, color: '#7A5A28', marginBottom: 12 }}>3. SAAT</p>
            {loadingSlots ? (
              <p style={{ fontSize: 13, color: '#8A6A48' }}>Yükleniyor...</p>
            ) : availableSlots.length === 0 ? (
              <p style={{ fontSize: 13, color: '#8A6A48', background: 'white', padding: 16, borderRadius: 12 }}>
                Bu tarihte müsait saat yok. Başka bir gün seçin.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {availableSlots.map(slot => (
                  <div
                    key={slot}
                    onClick={() => setForm(f => ({ ...f, appointment_time: slot }))}
                    style={{
                      cursor: 'pointer',
                      padding: '12px 4px',
                      borderRadius: 10,
                      textAlign: 'center',
                      fontSize: 13,
                      fontWeight: 500,
                      background: form.appointment_time === slot ? '#1A1208' : 'white',
                      color: form.appointment_time === slot ? '#D4A840' : '#1A1208',
                      border: '2px solid',
                      borderColor: form.appointment_time === slot ? '#1A1208' : '#D4B89640',
                      userSelect: 'none',
                    }}
                  >
                    {slot}
                  </div>
                ))}
              </div>
            )}
            {errors.appointment_time && <p style={{ color: 'red', fontSize: 11, marginTop: 6 }}>{errors.appointment_time}</p>}
          </div>
        )}

        {/* 4. BİLGİLER */}
        {form.appointment_time && (
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 9, letterSpacing: 3, color: '#7A5A28', marginBottom: 12 }}>4. BİLGİLERİNİZ</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="text" placeholder="Ad Soyad" value={form.customer_name}
                onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                style={{ padding: '12px 16px', borderRadius: 12, border: '2px solid #D4B89640', background: 'white', fontSize: 14 }}
              />
              {errors.customer_name && <p style={{ color: 'red', fontSize: 11, margin: 0 }}>{errors.customer_name}</p>}
              <input
                type="tel" placeholder="Telefon (05XX...)" value={form.customer_phone}
                onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))}
                style={{ padding: '12px 16px', borderRadius: 12, border: '2px solid #D4B89640', background: 'white', fontSize: 14 }}
              />
              {errors.customer_phone && <p style={{ color: 'red', fontSize: 11, margin: 0 }}>{errors.customer_phone}</p>}
              <textarea
                placeholder="Not (isteğe bağlı)" value={form.customer_note} rows={3}
                onChange={e => setForm(f => ({ ...f, customer_note: e.target.value }))}
                style={{ padding: '12px 16px', borderRadius: 12, border: '2px solid #D4B89640', background: 'white', fontSize: 14, resize: 'none' }}
              />
            </div>
          </div>
        )}

        {/* ÖZET + GÖNDER */}
        {form.customer_phone && (
          <div>
            <div style={{ background: '#F8F3EC', borderRadius: 16, padding: 20, marginBottom: 16, border: '1px solid #D4B89640' }}>
              <p style={{ fontSize: 10, color: '#8A6A48', marginBottom: 12 }}>Randevu Özeti</p>
              {[
                ['Hizmet', selectedService?.name],
                ['Tarih', form.appointment_date],
                ['Saat', form.appointment_time],
                ['Ücret', `₺${selectedService?.price}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: '#8A6A48' }}>{k}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: k === 'Ücret' ? '#7A5A28' : '#1A1208' }}>{v}</span>
                </div>
              ))}
            </div>
            {errors.general && <p style={{ color: 'red', fontSize: 12, marginBottom: 10 }}>{errors.general}</p>}
            <button
              onClick={handleSubmit} disabled={submitting}
              style={{
                width: '100%', padding: '16px', borderRadius: 28,
                background: '#1A1208', color: '#D4A840',
                fontSize: 12, fontWeight: 700, letterSpacing: 2,
                border: 'none', cursor: 'pointer', opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting ? 'GÖNDERİLİYOR...' : 'RANDEVUYU ONAYLA'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}