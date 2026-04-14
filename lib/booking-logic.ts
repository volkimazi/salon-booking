import { WorkingHours, BlockedSlot, Appointment } from '@/types'

export function generateTimeSlots(start: string, end: string, durationMinutes: number): string[] {
  const slots: string[] = []
  const [startH, startM] = start.split(':').map(Number)
  const [endH, endM] = end.split(':').map(Number)

  let current = startH * 60 + startM
  const endTotal = endH * 60 + endM

  while (current + durationMinutes <= endTotal) {
    const h = Math.floor(current / 60).toString().padStart(2, '0')
    const m = (current % 60).toString().padStart(2, '0')
    slots.push(`${h}:${m}`)
    current += durationMinutes
  }
  return slots
}

export function filterAvailableSlots(
  allSlots: string[],
  date: string,
  bookedAppointments: Appointment[],
  blockedSlots: BlockedSlot[]
): string[] {
  const bookedTimes = bookedAppointments
    .filter(a => a.appointment_date === date && a.status !== 'cancelled')
    .map(a => a.appointment_time.slice(0, 5))

  const blockedTimes = blockedSlots
    .filter(b => b.blocked_date === date)
    .map(b => b.blocked_time.slice(0, 5))

  return allSlots.filter(slot => !bookedTimes.includes(slot) && !blockedTimes.includes(slot))
}