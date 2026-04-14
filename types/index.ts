export type Service = {
  id: string
  name: string
  duration_minutes: number
  price: number
  description: string | null
  is_active: boolean
  created_at: string
}

export type Appointment = {
  id: string
  customer_name: string
  customer_phone: string
  customer_note: string | null
  service_id: string
  appointment_date: string
  appointment_time: string
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
  services?: Service
}

export type BlockedSlot = {
  id: string
  blocked_date: string
  blocked_time: string
  reason: string | null
}

export type WorkingHours = {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
}

export type BookingFormData = {
  service_id: string
  appointment_date: string
  appointment_time: string
  customer_name: string
  customer_phone: string
  customer_note?: string
}