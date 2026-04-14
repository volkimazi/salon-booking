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
    service_id: '',
    appointment_date: '',
    appointment_time: '',
    customer_name: '',
    customer_phone: '',
    customer_note: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
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
      if (!workingDay) {
        setAvailableSlots([])
        setLoadingSlots(false)
        return
      }
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

    const { data: existing } = await supabase
      .from('appointments')
      .select('id')
      .eq('appointment_date', form.appointment_date)
      .eq('appointment_time', form.appointment_time)
      .neq('status', 'cancelled')

    if (existing && existing.length > 0) {
      setErrors({ appointment_time: 'Bu saat dolu, lütfen başka bir saat seçin' })
      setSubmitting(false)
      return
    }

    const { error } = await supabase.from('appointments').insert({
      ...form,
      status: 'pending',
    })

    if (error) {
      setErrors({ general: 'Bir hata oluştu, lütfen tekrar deneyin' })
      setSubmitting(false)
      return
    }

    sendWhatsAppNotification({
      customerName: form.customer_name,
      customerPhone: form.customer_phone,
      serviceName: selectedService!.name,
      date: form.appointment_date,
      time: form.appointment_time,
      note: form.customer_note,
    })

    router.push(`/success?name=${encodeURIComponent(form.customer_name)}&service=${encodeURIComponent(selectedService!.name)}&date=${form.appointment_date}&time=${form.appointment_time}`)
  }

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <main className="min-h-screen bg-[#FAF8F5] pb-20">
      <header className="py-5 px-6 border-b border-stone-200 flex items-center gap-4">
        <Link href="/" className="text-stone-400 hover:text-stone-700 text-sm">← Geri</Link>
        <div>
          <p className="font-medium text-sm">Randevu Al</p>
          <p className="text-xs text-stone-400">Burcu Bozkır Beauty Studio</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-6 py-8 space-y-8">
        <section>
          <p className="text-xs tracking-widest text-[#C9A96E] uppercase mb-3">1. Hizmet</p>
          <div className="space-y-3">
            {services.map(service => (
              <button
                key={service.id}
                onClick={() => {
                  setSelectedService(service)
                  setForm(f => ({ ...f, service_id: service.id }))
                }}
                className={`w-full text-left rounded-2xl p-4 border transition-all ${
                  form.service_id === service.id
                    ? 'border-[#C9A96E] bg-[#C9A96E]/5'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{service.name}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{service.duration_minutes} dakika</p>
                  </div>
                  <p className="text-[#C9A96E] font-semibold text-sm">₺{service.price}</p>
                </div>
              </button>
            ))}
          </div>
          {errors.service_id && <p className="text-red-500 text-xs mt-2">{errors.service_id}</p>}
        </section>

        {selectedService && (
          <section>
            <p className="text-xs tracking-widest text-[#C9A96E] uppercase mb-3">2. Tarih</p>
            <input
              type="date"
              min={todayStr}
              value={selectedDate}
              onChange={e => {
                setSelectedDate(e.target.value)
                setForm(f => ({ ...f, appointment_date: e.target.value }))
              }}
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E]"
            />
            {selectedDate && (
              <p className="text-xs text-stone-400 mt-1">{DAYS_TR[new Date(selectedDate).getDay()]}</p>
            )}
            {errors.appointment_date && <p className="text-red-500 text-xs mt-2">{errors.appointment_date}</p>}
          </section>
        )}

        {selectedDate && (
          <section>
            <p className="text-xs tracking-widest text-[#C9A96E] uppercase mb-3">3. Saat</p>
            {loadingSlots ? (
              <p className="text-sm text-stone-400">Müsait saatler yükleniyor...</p>
            ) : availableSlots.length === 0 ? (
              <p className="text-sm text-stone-500 bg-white rounded-xl p-4 border border-stone-200">
                Bu tarihte müsait saat bulunmuyor. Lütfen başka bir gün seçin.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setForm(f => ({ ...f, appointment_time: slot }))}
                    className={`rounded-xl py-3 text-sm font-medium transition-all ${
                      form.appointment_time === slot
                        ? 'bg-[#1A1A1A] text-white'
                        : 'bg-white border border-stone-200 hover:border-[#C9A96E]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
            {errors.appointment_time && <p className="text-red-500 text-xs mt-2">{errors.appointment_time}</p>}
          </section>
        )}

        {form.appointment_time && (
          <section>
            <p className="text-xs tracking-widest text-[#C9A96E] uppercase mb-3">4. Bilgileriniz</p>
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Ad Soyad"
                  value={form.customer_name}
                  onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E]"
                />
                {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>}
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Telefon Numarası (05XX...)"
                  value={form.customer_phone}
                  onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))}
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E]"
                />
                {errors.customer_phone && <p className="text-red-500 text-xs mt-1">{errors.customer_phone}</p>}
              </div>
              <textarea
                placeholder="Not eklemek ister misiniz? (isteğe bağlı)"
                value={form.customer_note}
                onChange={e => setForm(f => ({ ...f, customer_note: e.target.value }))}
                rows={3}
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E] resize-none"
              />
            </div>
          </section>
        )}

        {form.customer_phone && (
          <section>
            <div className="bg-white rounded-2xl p-5 border border-stone-200 mb-4">
              <p className="text-xs text-stone-400 mb-3">Randevu Özeti</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-stone-500">Hizmet</span><span className="font-medium">{selectedService?.name}</span></div>
                <div className="flex justify-between"><span className="text-stone-500">Tarih</span><span className="font-medium">{form.appointment_date}</span></div>
                <div className="flex justify-between"><span className="text-stone-500">Saat</span><span className="font-medium">{form.appointment_time}</span></div>
                <div className="flex justify-between"><span className="text-stone-500">Ücret</span><span className="font-medium text-[#C9A96E]">₺{selectedService?.price}</span></div>
              </div>
            </div>
            {errors.general && <p className="text-red-500 text-sm mb-3">{errors.general}</p>}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-[#1A1A1A] text-white py-4 rounded-full text-sm font-medium hover:bg-[#C9A96E] transition-colors disabled:opacity-50"
            >
              {submitting ? 'Gönderiliyor...' : 'Randevuyu Onayla'}
            </button>
          </section>
        )}
      </div>
    </main>
  )
}