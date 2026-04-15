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

function LuxuryBg({ height = 340, id = 'b' }: { height?: number; id?: string }) {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      viewBox={0 0 400 ${height}}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={bg${id}} cx="50%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#FDF5E6" />
          <stop offset="45%" stopColor="#F0D898" />
          <stop offset="100%" stopColor="#D4A84B" />
        </radialGradient>
        <radialGradient id={gA${id}} cx="25%" cy="45%" r="55%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.92)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <radialGradient id={gB${id}} cx="75%" cy="65%" r="50%">
          <stop offset="0%" stopColor="rgba(255,238,160,0.75)" />
          <stop offset="100%" stopColor="rgba(255,238,160,0)" />
        </radialGradient>
        <radialGradient id={gC${id}} cx="65%" cy="20%" r="40%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <filter id={f1${id}}>
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id={f2${id}}>
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id={f3${id}}>
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      <rect width="400" height={height} fill={url(#bg${id})} />

      <ellipse cx="110" cy={height * 0.45} rx="150" ry="120" fill={url(#gA${id})} filter={url(#f1${id})} />
      <ellipse cx="310" cy={height * 0.65} rx="130" ry="100" fill={url(#gB${id})} filter={url(#f1${id})} />
      <ellipse cx="270" cy={height * 0.2} rx="100" ry="80" fill={url(#gC${id})} filter={url(#f1${id})} />

      <path
        d={M-30 ${height * 0.35} Q80 ${height * 0.1} 200 ${height * 0.32} Q310 ${height * 0.5} 430 ${height * 0.25}}
        stroke="rgba(200,160,50,0.22)"
        strokeWidth="28"
        fill="none"
        filter={url(#f1${id})}
      />
      <path
        d={M-30 ${height * 0.55} Q100 ${height * 0.3} 220 ${height * 0.52} Q330 ${height * 0.7} 430 ${height * 0.45}}
        stroke="rgba(200,155,45,0.18)"
        strokeWidth="22"
        fill="none"
        filter={url(#f1${id})}
      />
      <path
        d={M-30 ${height * 0.72} Q90 ${height * 0.5} 210 ${height * 0.68} Q320 ${height * 0.82} 430 ${height * 0.62}}
        stroke="rgba(185,145,40,0.15)"
        strokeWidth="18"
        fill="none"
        filter={url(#f1${id})}
      />

      <path
        d={M-30 ${height * 0.33} Q80 ${height * 0.08} 200 ${height * 0.3} Q310 ${height * 0.48} 430 ${height * 0.23}}
        stroke="rgba(240,195,80,0.55)"
        strokeWidth="1.5"
        fill="none"
        filter={url(#f3${id})}
      />
      <path
        d={M-30 ${height * 0.36} Q80 ${height * 0.11} 200 ${height * 0.33} Q310 ${height * 0.51} 430 ${height * 0.26}}
        stroke="rgba(255,230,130,0.4)"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d={M-30 ${height * 0.53} Q100 ${height * 0.28} 220 ${height * 0.5} Q330 ${height * 0.68} 430 ${height * 0.43}}
        stroke="rgba(230,180,65,0.5)"
        strokeWidth="1.5"
        fill="none"
        filter={url(#f3${id})}
      />
      <path
        d={M-30 ${height * 0.7} Q90 ${height * 0.48} 210 ${height * 0.66} Q320 ${height * 0.8} 430 ${height * 0.6}}
        stroke="rgba(210,165,55,0.45)"
        strokeWidth="1.2"
        fill="none"
        filter={url(#f3${id})}
      />

      {[
        [130, height * 0.28],
        [230, height * 0.45],
        [320, height * 0.35],
        [170, height * 0.62],
        [290, height * 0.72],
        [80, height * 0.55],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 2 === 0 ? 3 : 2} fill="rgba(255,252,200,0.95)" filter={url(#f2${id})} />
      ))}

      <rect width="400" height={height} fill="rgba(255,251,240,0.08)" />
    </svg>
  )
}

function Calendar({ onSelect, selected }: { onSelect: (date: string) => void; selected: string }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const todayStr = ${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}

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
        background: 'rgba(255,252,246,0.82)',
        backdropFilter: 'blur(14px)',
        borderRadius: 18,
        padding: 16,
        border: '1px solid rgba(200,168,75,0.14)',
        boxShadow:
          '0 10px 30px rgba(130,90,25,0.08), 0 2px 8px rgba(130,90,25,0.05), inset 0 1px 0 rgba(255,255,255,0.85)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <button
          onClick={prevMonth}
          style={{
            background: 'rgba(255,248,235,0.95)',
            border: '1px solid rgba(200,168,75,0.18)',
            borderRadius: 10,
            width: 32,
            height: 32,
            cursor: 'pointer',
            fontSize: 16,
            color: '#7A5A28',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
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
            background: 'rgba(255,248,235,0.95)',
            border: '1px solid rgba(200,168,75,0.18)',
            borderRadius: 10,
            width: 32,
            height: 32,
            cursor: 'pointer',
            fontSize: 16,
            color: '#7A5A28',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          ›
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
        {DAYS_TR.map((d) => (
          <div key={d} style={{ textAlign: 'center', fontSize: 9, color: '#AA8A68', fontWeight: 700, padding: '3px 0', fontFamily: 'sans-serif' }}>
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={e-${i}} />
          const dateStr = ${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}
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
        <p style={{ textAlign: 'center', fontSize: 11, color: '#7A5A28', marginTop: 10, fontStyle: 'italic', fontFamily: 'sans-serif' }}>
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
    supabase.from('services').select('*').eq('is_active', true).order('price', { ascending: true }).then(({ data }) => setServices(data || []))
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

      const allSlots = generateTimeSlots(workingDay.start_time, workingDay.end_time, selectedService.duration_minutes)
      const available = filterAvailableSlots(allSlots, selectedDate, appts.data || [], blocked.data || [])

      setAvailableSlots(available)
      setLoadingSlots(false)
    })
  }, [selectedService, selectedDate])

  function validate(): boolean {
    const e: Record<string, string