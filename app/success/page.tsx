import Link from 'next/link'

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { name?: string; service?: string; date?: string; time?: string }
}) {
  return (
    <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6">
      <div className="max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-[#C9A96E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl text-[#C9A96E]">✓</span>
        </div>
        <h1 className="text-2xl font-light mb-3">Randevunuz Alındı!</h1>
        <p className="text-stone-500 text-sm leading-relaxed mb-8">
          Sayın <strong>{searchParams.name}</strong>, <br />
          <strong>{searchParams.service}</strong> randevunuz <br />
          <strong>{searchParams.date}</strong> tarihinde <strong>{searchParams.time}</strong> saatinde onay bekliyor.
          En kısa sürede sizi arayacağız.
        </p>
        <div className="bg-white rounded-2xl p-5 border border-stone-200 text-sm text-left mb-8">
          <p className="text-stone-500 text-xs mb-3">Adres</p>
          <p className="font-medium">Metropark AVM D1-112</p>
          <p className="text-stone-500">Sefaköy / İstanbul</p>
        </div>
        <Link href="/" className="inline-block text-sm text-stone-500 underline underline-offset-4">
          Ana Sayfaya Dön
        </Link>
      </div>
    </main>
  )
}