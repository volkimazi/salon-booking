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

function LuxurySection({
  children,
  minHeight,
}: {
  children: React.ReactNode
  minHeight?: number
}) {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 24,
        minHeight: minHeight || 0,
        background:
          'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.92), transparent 30%), radial-gradient(circle at 80% 70%, rgba(255,240,190,0.72), transparent 28%), linear-gradient(135deg, #FDF7EA 0%, #F2DEAC 45%, #D4A84B 100%)',
        boxShadow: '0 16px 48px rgba(130,90,25,0.14)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.28) 28%, transparent 46%, rgba(255,235,170,0.18) 62%, transparent 78%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 70% 25%, rgba(255,255,255,0.45), transparent 18%), radial-gradient(circle at 35% 75%, rgba(255,250,220,0.35), transparent 18%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '16%',
          left: '-8%',
          width: '120%',
          height: 28,
          transform: 'rotate(-8deg)',
          background: 'rgba(200,168,75,0.12)',
          filter: 'blur(10px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '48%',
          left: '-10%',
          width: '125%',
          height: 22,
          transform: 'rotate(-6deg)',
          background: 'rgba(190,150,55,0.10)',
          filter: 'blur(10px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '74%',
          left: '-8%',
          width: '120%',
          height: 18,
          transform: 'rotate(-7deg)',
          background: 'rgba(180,145,45,0.09)',
          filter: 'blur(10px)',
        }}
      />
      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </div>
  )
}

function Calendar({
  onSelect,
  selected,
}: {
  onSelect: (date: string) => void
  selected: string
}) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div
      style={{
        background: 'rgba(255,252,246,0.84)',
        backdropFilter: 'blur(12px)',
        borderRadius: 18,
        padding: 16,
        border: '1px solid rgba(200,168,75,0.15)',
        boxShadow:
          '0 10px 30px rgba(130,90,25,0.08), 0 2px 8px rgba(130,90,25,0.05), inset 0 1px 0 rgba(255,255,255,0.88)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <button
          onClick={prevMonth}
          style={{
            background: 'rgba(255,248,235,0.96)',
            border: '1px solid rgba(200,168,75,0.18)',
            borderRadius: 10,
            width: 32,
            height: 32,
            cursor: 'pointer',
            fontSize: 16,
            color: '#7A5A28',
          }}
        >
          ‹
        </button>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: '#2C1A0A', fontFamily: 'sans-serif' }}>
          {MONTHS_TR[viewMonth]} {viewYear}
        </p>
        <button
          onClick={nextMonth}
          style={{
            background: 'rgba(255,248,235,0.96)',
            border: '1px solid rgba(200,168,75,0.18)',
            borderRadius: 10,
            width: 32,
            height: 32,
            cursor: 'pointer',
            fontSize: 16,
            color: '#7A5A28',
          }}
        >
          ›
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
        {DAYS_TR.map((d) => (
          <div
            key={d}
            style={{
              textAlign: 'center',
              fontSize: 9,
              color: '#AA8A68',
              fontWeight: 700,
              padding: '3px 0',
              fontFamily: 'sans-serif',
            }}
          >
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const isPast = dateStr < todayStr
          const isSelected = dateStr === selected
          const isToday = dateStr === todayStr

          return (
            <button
              key={dateStr}
              onClick={() => !isPast && onSelect(dateStr)}
              disabled={isPast}
              style={{
                border: 'none',
                borderRadius: 10,
                padding: '10px 2px',
                cursor: isPast ? 'not-allowed' : 'pointer',
                textAlign: 'center',
                fontSize: 12,
                fontWeight: isSelected ? 700 : 500,
                background: isSelected
                  ? 'linear-gradient(145deg, #C8A84B, #9A6E28)'
                  : isToday
                    ? 'rgba(240,232,215,0.9)'
                    : 'transparent',
                color: isSelected ? 'white' : isPast ? '#D4B89660' : isToday ? '#7A5A28' : '#2C1A0A',
                outline: isToday && !isSelected ? '1px solid rgba(200,168,75,0.35)' : 'none',
                fontFamily: 'sans-serif',
                boxShadow: isSelected ? '0 6px 18px rgba(150,100,25,0.3)' : 'none',
              }}
            >
              {day}
            </button>
          )
        })}
      </div>

      {selected && (
        <p
          style={{
            textAlign: 'center',
            fontSize: 11,
            color: '#7A5A28',
            marginTop: 10,
            fontStyle: 'italic',
            fontFamily: 'sans-serif',
          }}
        >
          📅 {selected.split('-').reverse().join('.')} seçildi
        </p>
      )}
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
      .order('price', { ascending: true })
      .then(({ data }) => setServices(data || []))
  }, [])

  useEffect(() => {
    if (!selectedService || !selectedDate) return

    setLoadingSlots(true)
    setAvailableSlots([])
    setForm((f) => ({ ...f, appointment_time: '' }))

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

      const allSlots = generateTimeSlots(
        workingDay.start_time,
        workingDay.end_time,
        selectedService.duration_minutes
      )
      const available = filterAvailableSlots(
        allSlots,
        selectedDate,
        appts.data || [],
        blocked.data || []
      )

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

    router.push(
      `/success?name=${encodeURIComponent(form.customer_name)}&service=${encodeURIComponent(
        selectedService!.name
      )}&date=${form.appointment_date}&time=${form.appointment_time}`
    )
  }

  return (
    <main
      style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        background: '#EEE4D5',
        minHeight: '100vh',
        paddingBottom: 60,
      }}
    >
      <header
        style={{
          background: 'rgba(255,252,247,0.97)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(200,168,75,0.1)',
          padding: '13px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 2px 20px rgba(150,110,40,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            href="/"
            style={{
              color: '#7A5A30',
              fontSize: 20,
              textDecoration: 'none',
              fontFamily: 'sans-serif',
            }}
          >
            ←
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: 'linear-gradient(145deg, #D4A84B, #9A6E28)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow:
                  '0 4px 16px rgba(180,130,40,0.45), inset 0 1px 0 rgba(255,220,120,0.3)',
              }}
            >
              <span
                style={{
                  color: 'white',
                  fontSize: 13,
                  fontWeight: 800,
                  fontFamily: 'sans-serif',
                  letterSpacing: 1,
                }}
              >
                BB
              </span>
            </div>

            <div style={{ lineHeight: 1.2 }}>
              <p
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: 2,
                  color: '#2C1A0A',
                  fontFamily: 'sans-serif',
                }}
              >
                RANDEVU AL
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 9,
                  color: '#7A5A28',
                  fontFamily: 'sans-serif',
                }}
              >
                Burcu Bozkır Beauty Studio
              </p>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '22px 16px 0' }}>
        <LuxurySection minHeight={160}>
          <div style={{ padding: '30px 24px', textAlign: 'center' }}>
            <p
              style={{
                margin: '0 0 8px',
                fontSize: 9,
                letterSpacing: 4,
                color: '#9A7020',
                fontFamily: 'sans-serif',
              }}
            >
              HİZMET SEÇİN
            </p>
            <h1
              style={{
                margin: '0 0 10px',
                fontSize: 34,
                fontWeight: 400,
                color: '#2C1A0A',
                textShadow: '0 2px 16px rgba(255,255,255,0.9)',
              }}
            >
              Randevu Al
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: 15,
                color: '#7A5020',
                lineHeight: 1.7,
                fontStyle: 'italic',
                textShadow: '0 1px 10px rgba(255,255,255,0.85)',
              }}
            >
              Size en uygun hizmeti seçin ve
              <br />
              kolayca randevunuzu oluşturun.
            </p>
          </div>
        </LuxurySection>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 22 }}>
          {services.map((service) => {
            const isSelected = form.service_id === service.id

            return (
              <div
                key={service.id}
                style={{
                  background: isSelected ? 'rgba(255,252,246,0.94)' : 'rgba(255,252,246,0.9)',
                  backdropFilter: 'blur(14px)',
                  borderRadius: 22,
                  border: isSelected
                    ? '1.5px solid rgba(200,168,75,0.38)'
                    : '1px solid rgba(200,168,75,0.14)',
                  boxShadow: isSelected
                    ? '0 16px 42px rgba(130,90,25,0.14), 0 4px 14px rgba(130,90,25,0.08), inset 0 1px 0 rgba(255,255,255,0.9)'
                    : '0 10px 28px rgba(130,90,25,0.09), 0 2px 8px rgba(130,90,25,0.05), inset 0 1px 0 rgba(255,255,255,0.85)',
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '20px 18px 16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 12,
                          flexShrink: 0,
                          background:
                            'linear-gradient(145deg, rgba(212,168,75,0.16), rgba(180,130,40,0.24))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 16,
                          color: '#C8A030',
                          border: '1px solid rgba(200,160,60,0.18)',
                          boxShadow: 'inset 0 1px 0 rgba(255,220,120,0.25)',
                        }}
                      >
                        ✦
                      </div>

                      <div>
                        <p
                          style={{
                            margin: '0 0 4px',
                            fontSize: 23,
                            fontWeight: 500,
                            color: '#2C1A0A',
                            lineHeight: 1.1,
                          }}
                        >
                          {service.name}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 11,
                            color: '#9A8060',
                            fontFamily: 'sans-serif',
                          }}
                        >
                          {service.duration_minutes} dk
                        </p>
                      </div>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: 28,
                        color: '#C8A030',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      ₺{service.price}
                    </p>
                  </div>

                  {service.description && (
                    <p
                      style={{
                        margin: '14px 0 16px',
                        fontSize: 12,
                        color: '#8A7050',
                        lineHeight: 1.7,
                        fontFamily: 'sans-serif',
                      }}
                    >
                      {service.description}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedService(service)
                      setForm((f) => ({
                        ...f,
                        service_id: service.id,
                        appointment_date: '',
                        appointment_time: '',
                      }))
                      setSelectedDate('')
                      setAvailableSlots([])
                    }}
                    style={{
                      width: '100%',
                      background: isSelected
                        ? 'linear-gradient(145deg, #C8A84B, #9A6E28)'
                        : 'rgba(255,248,235,0.95)',
                      color: isSelected ? 'white' : '#8A6820',
                      border: isSelected
                        ? 'none'
                        : '1.5px solid rgba(200,160,60,0.28)',
                      textDecoration: 'none',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 2,
                      padding: '13px 16px',
                      borderRadius: 12,
                      fontFamily: 'sans-serif',
                      cursor: 'pointer',
                      boxShadow: isSelected
                        ? '0 8px 24px rgba(150,100,25,0.35), inset 0 1px 0 rgba(255,220,120,0.22)'
                        : 'inset 0 1px 0 rgba(255,255,255,0.9)',
                    }}
                  >
                    {isSelected ? '✓ SEÇİLDİ' : 'RANDEVU AL'}
                  </button>
                </div>

                {isSelected && (
                  <div
                    style={{
                      borderTop: '1px solid rgba(200,168,75,0.14)',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 16,
                      background: 'rgba(255,250,242,0.6)',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: 9,
                          letterSpacing: 3,
                          color: '#7A5A28',
                          margin: '0 0 10px',
                          textAlign: 'center',
                          fontFamily: 'sans-serif',
                        }}
                      >
                        TARİH SEÇİN
                      </p>

                      <Calendar
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date)
                          setForm((f) => ({
                            ...f,
                            appointment_date: date,
                            appointment_time: '',
                          }))
                        }}
                      />

                      {errors.appointment_date && (
                        <p
                          style={{
                            color: '#C0392B',
                            fontSize: 11,
                            marginTop: 6,
                            textAlign: 'center',
                            fontFamily: 'sans-serif',
                          }}
                        >
                          {errors.appointment_date}
                        </p>
                      )}
                    </div>

                    {selectedDate && (
                      <div>
                        <p
                          style={{
                            fontSize: 9,
                            letterSpacing: 3,
                            color: '#7A5A28',
                            margin: '0 0 10px',
                            textAlign: 'center',
                            fontFamily: 'sans-serif',
                          }}
                        >
                          SAAT SEÇİN
                        </p>

                        {loadingSlots ? (
                          <p
                            style={{
                              fontSize: 12,
                              color: '#8A6A48',
                              textAlign: 'center',
                              fontFamily: 'sans-serif',
                            }}
                          >
                            Yükleniyor...
                          </p>
                        ) : availableSlots.length === 0 ? (
                          <p
                            style={{
                              fontSize: 12,
                              color: '#8A6A48',
                              textAlign: 'center',
                              background: 'rgba(255,248,235,0.95)',
                              padding: 12,
                              borderRadius: 12,
                              fontFamily: 'sans-serif',
                              border: '1px solid rgba(200,168,75,0.14)',
                            }}
                          >
                            Bu tarihte müsait saat yok.
                          </p>
                        ) : (
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(4, 1fr)',
                              gap: 8,
                            }}
                          >
                            {availableSlots.map((slot) => (
                              <button
                                type="button"
                                key={slot}
                                onClick={() =>
                                  setForm((f) => ({
                                    ...f,
                                    appointment_time: slot,
                                  }))
                                }
                                style={{
                                  cursor: 'pointer',
                                  padding: '11px 4px',
                                  borderRadius: 12,
                                  textAlign: 'center',
                                  fontSize: 12,
                                  fontWeight: 700,
                                  fontFamily: 'sans-serif',
                                  background:
                                    form.appointment_time === slot
                                      ? 'linear-gradient(145deg, #C8A84B, #9A6E28)'
                                      : 'rgba(255,248,235,0.95)',
                                  color:
                                    form.appointment_time === slot ? 'white' : '#2C1A0A',
                                  border:
                                    form.appointment_time === slot
                                      ? 'none'
                                      : '1px solid rgba(200,168,75,0.16)',
                                  boxShadow:
                                    form.appointment_time === slot
                                      ? '0 8px 18px rgba(150,100,25,0.26)'
                                      : 'inset 0 1px 0 rgba(255,255,255,0.86)',
                                }}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        )}

                        {errors.appointment_time && (
                          <p
                            style={{
                              color: '#C0392B',
                              fontSize: 11,
                              marginTop: 6,
                              textAlign: 'center',
                              fontFamily: 'sans-serif',
                            }}
                          >
                            {errors.appointment_time}
                          </p>
                        )}
                      </div>
                    )}

                    {form.appointment_time && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <p
                          style={{
                            fontSize: 9,
                            letterSpacing: 3,
                            color: '#7A5A28',
                            margin: 0,
                            textAlign: 'center',
                            fontFamily: 'sans-serif',
                          }}
                        >
                          BİLGİLERİNİZ
                        </p>

                        <div>
                          <label
                            style={{
                              fontSize: 10,
                              color: '#8A6A48',
                              letterSpacing: 1,
                              display: 'block',
                              marginBottom: 5,
                              fontFamily: 'sans-serif',
                            }}
                          >
                            AD SOYAD
                          </label>
                          <input
                            type="text"
                            placeholder="Adınız ve soyadınız"
                            value={form.customer_name}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                customer_name: e.target.value,
                              }))
                            }
                            style={{
                              width: '100%',
                              padding: '12px 14px',
                              borderRadius: 12,
                              border: '1.5px solid rgba(200,168,75,0.16)',
                              background: 'rgba(255,252,246,0.92)',
                              fontSize: 13,
                              boxSizing: 'border-box',
                              fontFamily: 'sans-serif',
                              color: '#2C1A0A',
                              outline: 'none',
                            }}
                          />
                          {errors.customer_name && (
                            <p
                              style={{
                                color: '#C0392B',
                                fontSize: 11,
                                margin: '4px 0 0',
                                fontFamily: 'sans-serif',
                              }}
                            >
                              {errors.customer_name}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            style={{
                              fontSize: 10,
                              color: '#8A6A48',
                              letterSpacing: 1,
                              display: 'block',
                              marginBottom: 5,
                              fontFamily: 'sans-serif',
                            }}
                          >
                            TELEFON
                          </label>
                          <input
                            type="tel"
                            placeholder="05XX XXX XX XX"
                            value={form.customer_phone}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                customer_phone: e.target.value,
                              }))
                            }
                            style={{
                              width: '100%',
                              padding: '12px 14px',
                              borderRadius: 12,
                              border: '1.5px solid rgba(200,168,75,0.16)',
                              background: 'rgba(255,252,246,0.92)',
                              fontSize: 13,
                              boxSizing: 'border-box',
                              fontFamily: 'sans-serif',
                              color: '#2C1A0A',
                              outline: 'none',
                            }}
                          />
                          {errors.customer_phone && (
                            <p
                              style={{
                                color: '#C0392B',
                                fontSize: 11,
                                margin: '4px 0 0',
                                fontFamily: 'sans-serif',
                              }}
                            >
                              {errors.customer_phone}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            style={{
                              fontSize: 10,
                              color: '#8A6A48',
                              letterSpacing: 1,
                              display: 'block',
                              marginBottom: 5,
                              fontFamily: 'sans-serif',
                            }}
                          >
                            NOT (İSTEĞE BAĞLI)
                          </label>
                          <textarea
                            placeholder="Özel bir isteğiniz var mı?"
                            value={form.customer_note}
                            rows={3}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                customer_note: e.target.value,
                              }))
                            }
                            style={{
                              width: '100%',
                              padding: '12px 14px',
                              borderRadius: 12,
                              border: '1.5px solid rgba(200,168,75,0.16)',
                              background: 'rgba(255,252,246,0.92)',
                              fontSize: 13,
                              resize: 'none',
                              boxSizing: 'border-box',
                              fontFamily: 'sans-serif',
                              color: '#2C1A0A',
                              outline: 'none',
                            }}
                          />
                        </div>

                        {form.customer_phone && selectedService && (
                          <LuxurySection>
                            <div style={{ padding: 18 }}>
                              <p
                                style={{
                                  fontSize: 9,
                                  color: '#9A7020',
                                  letterSpacing: 3,
                                  margin: '0 0 12px',
                                  textAlign: 'center',
                                  fontFamily: 'sans-serif',
                                }}
                              >
                                RANDEVU ÖZETİ
                              </p>

                              {[
                                ['Hizmet', selectedService.name],
                                ['Tarih', selectedDate.split('-').reverse().join('.')],
                                ['Saat', form.appointment_time],
                                ['Ücret', `₺${selectedService.price}`],
                              ].map(([k, v]) => (
                                <div
                                  key={String(k)}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: 8,
                                    paddingBottom: 8,
                                    borderBottom: '1px solid rgba(150,110,30,0.08)',
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: 11,
                                      color: '#7A6030',
                                      fontFamily: 'sans-serif',
                                    }}
                                  >
                                    {k}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: 11,
                                      fontWeight: 700,
                                      color: k === 'Ücret' ? '#A87820' : '#2C1A0A',
                                      fontFamily: 'sans-serif',
                                    }}
                                  >
                                    {v}
                                  </span>
                                </div>
                              ))}

                              {errors.general && (
                                <p
                                  style={{
                                    color: '#C0392B',
                                    fontSize: 11,
                                    marginBottom: 10,
                                    textAlign: 'center',
                                    fontFamily: 'sans-serif',
                                  }}
                                >
                                  {errors.general}
                                </p>
                              )}

                              <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                style={{
                                  width: '100%',
                                  padding: '15px',
                                  borderRadius: 14,
                                  background: 'linear-gradient(145deg, #C8A84B, #9A6E28)',
                                  color: 'white',
                                  fontSize: 11,
                                  fontWeight: 700,
                                  letterSpacing: 2,
                                  border: 'none',
                                  cursor: 'pointer',
                                  opacity: submitting ? 0.7 : 1,
                                  fontFamily: 'sans-serif',
                                  boxShadow:
                                    '0 8px 24px rgba(150,100,25,0.34), inset 0 1px 0 rgba(255,220,120,0.22)',
                                  marginTop: 8,
                                }}
                              >
                                {submitting ? 'GÖNDERİLİYOR...' : 'RANDEVUYU ONAYLA'}
                              </button>

                              <p
                                style={{
                                  textAlign: 'center',
                                  fontSize: 10,
                                  color: '#8A6A48',
                                  marginTop: 10,
                                  fontFamily: 'sans-serif',
                                }}
                              >
                                Randevu sonrası WhatsApp ile onay gelecektir
                              </p>
                            </div>
                          </LuxurySection>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {errors.service_id && (
          <p
            style={{
              color: '#C0392B',
              fontSize: 11,
              marginTop: 10,
              textAlign: 'center',
              fontFamily: 'sans-serif',
            }}
          >
            {errors.service_id}
          </p>
        )}
      </div>
    </main>
  )
}