export function sendWhatsAppNotification(booking: {
  customerName: string
  customerPhone: string
  serviceName: string
  date: string
  time: string
  note?: string
}) {
  const salonPhone = process.env.NEXT_PUBLIC_SALON_WHATSAPP
  if (!salonPhone) return

  const message = encodeURIComponent(
    `🌸 YENİ RANDEVU\n\n` +
    `👤 ${booking.customerName}\n` +
    `📞 ${booking.customerPhone}\n` +
    `💅 ${booking.serviceName}\n` +
    `📅 ${booking.date}\n` +
    `🕐 ${booking.time}\n` +
    (booking.note ? `📝 ${booking.note}` : '')
  )

  if (typeof window !== 'undefined') {
    window.open(`https://wa.me/${salonPhone}?text=${message}`, '_blank')
  }
}