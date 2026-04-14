import Link from 'next/link'
import { createSupabaseServer } from '@/lib/supabase/server'
import { Service } from '@/types'

export default async function HomePage() {
  const supabase = await createSupabaseServer()
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true })

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <header className="py-6 px-6 flex justify-between items-center border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center">
            <span className="text-[#C9A96E] font-bold text-sm">BB</span>
          </div>
          <div>
            <p className="font-semibold text-sm tracking-wide">BURCU BOZKIR</p>
            <p className="text-xs text-stone-500">Beauty Studio</p>
          </div>
        </div>
        <Link href="/booking" className="bg-[#1A1A1A] text-white text-sm px-5 py-2.5 rounded-full hover:bg-[#C9A96E] transition-colors">
          Randevu Al
        </Link>
      </header>

      <section className="px-6 py-20 text-center max-w-2xl mx-auto">
        <p className="text-xs tracking-[0.3em] text-[#C9A96E] uppercase mb-4">Güzellik Stüdyosu</p>
        <h1 className="text-4xl font-light leading-tight mb-6">
          Kendinizin En<br />
          <span className="italic">Güzel Hali</span>
        </h1>
        <p className="text-stone-500 leading-relaxed mb-10 text-sm">
          Metropark AVM'de profesyonel kalıcı makyaj, kaş ve kirpik laminasyon hizmetleri.
        </p>
        <Link href="/booking" className="inline-block bg-[#1A1A1A] text-white px-10 py-4 rounded-full text-sm tracking-wide hover:bg-[#C9A96E] transition-colors">
          Hemen Randevu Al →
        </Link>
      </section>

      <section className="px-6 py-16 max-w-4xl mx-auto">
        <p className="text-center text-xs tracking-[0.3em] text-[#C9A96E] uppercase mb-2">Hizmetlerimiz</p>
        <h2 className="text-center text-2xl font-light mb-10">Ne yapmamızı istersiniz?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(services as Service[])?.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
              <h3 className="font-medium mb-2">{service.name}</h3>
              <p className="text-stone-500 text-sm mb-4">{service.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[#C9A96E] font-semibold">₺{service.price}</span>
                <span className="text-xs text-stone-400">{service.duration_minutes} dk</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#1A1A1A] text-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] text-[#C9A96E] uppercase mb-6">Neden Burcu Bozkır?</p>
          <div className="grid grid-cols-3 gap-8 text-sm">
            <div><p className="text-[#C9A96E] text-3xl font-light mb-2">1.200+</p><p className="text-stone-400">Mutlu Müşteri</p></div>
            <div><p className="text-[#C9A96E] text-3xl font-light mb-2">5 Yıl</p><p className="text-stone-400">Deneyim</p></div>
            <div><p className="text-[#C9A96E] text-3xl font-light mb-2">25.9K</p><p className="text-stone-400">Takipçi</p></div>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 text-center text-stone-400 text-xs">
        <p>Metropark AVM D1-112, Sefaköy / İstanbul</p>
        <p className="mt-1">© 2025 Burcu Bozkır Beauty Studio</p>
      </footer>
    </main>
  )
}