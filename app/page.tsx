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
    <main style={{ fontFamily: "'Palatino', 'Book Antiqua', serif" }} className="min-h-screen bg-[#E8E0D4]">

      {/* HEADER */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-5 py-4 bg-[#F8F3EC] border-b border-[#D4B89630]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center shadow-md" style={{ background: "linear-gradient(145deg, #1A1208, #2C1E0A)" }}>
            <span style={{ color: "#D4A840", fontSize: 16, fontFamily: "serif" }} className="font-bold">ℬℬ</span>
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#1A1208] mb-0">BURCU BOZKIR</p>
            <p className="text-[8px] tracking-widest text-[#7A5A28]">BEAUTY STUDIO</p>
          </div>
        </div>
        <Link href="/booking" className="text-[#D4A840] text-[8px] px-4 py-2.5 rounded-full tracking-widest" style={{ background: "#1A1208" }}>
          RANDEVU AL
        </Link>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden text-center px-6 pt-12 pb-10" style={{ background: "linear-gradient(180deg, #F8F3EC 0%, #E8E0D4 100%)" }}>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20" style={{ background: "#D4B896", transform: "translate(40px, -40px)" }} />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10" style={{ background: "#7A5A28", transform: "translate(-20px, 20px)" }} />

        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl" style={{ background: "linear-gradient(145deg, #1A1208, #2C1E0A)" }}>
          <span style={{ color: "#D4A840", fontSize: 30, fontFamily: "serif" }} className="font-bold">ℬℬ</span>
        </div>

        <div className="inline-block rounded-full px-4 py-1.5 mb-5 border" style={{ background: "#7A5A2815", borderColor: "#7A5A2830" }}>
          <span className="text-[9px] tracking-widest text-[#7A5A28]">✦ METROPARK AVM · SEFAKöY ✦</span>
        </div>

        <h1 className="text-4xl font-light leading-tight mb-4 text-[#1A1208]">
          Güzelliğiniz<br />Bizim <em className="text-[#7A5A28]">Tutkumuz</em>
        </h1>
        <p className="text-sm text-[#6A4A28] leading-relaxed max-w-xs mx-auto mb-8">
          Profesyonel kalıcı makyaj ve laminasyon hizmetleriyle doğal güzelliğinizi ön plana çıkarıyoruz.
        </p>
        <div className="flex flex-col items-center gap-3">
          <Link href="/booking" className="text-[#D4A840] text-xs px-9 py-4 rounded-full tracking-widest shadow-lg" style={{ background: "#1A1208" }}>
            HEMEN RANDEVU AL →
          </Link>
          <a href="https://www.instagram.com/burcubozkir_beauty" target="_blank" className="text-[9px] text-[#7A5A28] tracking-widest">
            Instagram'da Gör ↗
          </a>
        </div>
      </section>

      {/* AYIRICI */}
      <div className="h-px mx-6" style={{ background: "linear-gradient(90deg, transparent, #D4B896, transparent)" }} />

      {/* STATS */}
      <section className="grid grid-cols-3 gap-3 px-5 py-6">
        {[
          ["1.200+", "Mutlu Müşteri"],
          ["5 Yıl", "Deneyim"],
          ["25.9K", "Takipçi"],
        ].map(([v, l]) => (
          <div key={l} className="rounded-xl py-4 text-center shadow-sm" style={{ background: "#F8F3EC" }}>
            <p className="text-lg font-medium text-[#7A5A28] mb-1">{v}</p>
            <p className="text-[8px] tracking-wider text-[#6A4A28]">{l}</p>
          </div>
        ))}
      </section>

      {/* HİZMETLER */}
      <section className="px-5 pb-8">
        <p className="text-[9px] tracking-[0.3em] text-[#7A5A28] text-center mb-5">HİZMETLERİMİZ</p>
        <div className="flex flex-col gap-3">
          {(services as Service[])?.map((service, i) => (
            <div key={service.id} className="rounded-2xl p-4 shadow-sm" style={{ background: "#F8F3EC" }}>
              <div className="flex justify-between items-start">
                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(145deg, #1A1208, #2C1E0A)" }}>
                    <span style={{ color: "#D4A840" }} className="text-[8px] font-bold">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1208] mb-0.5">{service.name}</p>
                    <p className="text-[9px] text-[#8A6A48]">{service.description}</p>
                    <p className="text-[8px] text-[#AA8A68] mt-0.5">{service.duration_minutes} dk</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-[#7A5A28] flex-shrink-0">₺{service.price}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-5">
          <Link href="/booking" className="inline-block border text-[#1A1208] border-[#1A1208] text-[9px] px-6 py-2.5 rounded-full tracking-widest">
            TÜM HİZMETLER İÇİN RANDEVU AL
          </Link>
        </div>
      </section>

      {/* NEDEN BIZ */}
      <section className="py-8 px-5 relative overflow-hidden" style={{ background: "#1A1208" }}>
        <p className="text-[9px] tracking-[0.3em] text-center mb-2" style={{ color: "#D4A840" }}>NEDEN BURCU BOZKIR?</p>
        <p className="text-xl font-light text-center mb-7" style={{ color: "#F0E0B0" }}>Fark Yaratan Detaylar</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            ["✦", "Uzman Eller", "5 yıllık profesyonel deneyim"],
            ["✦", "Hijyenik Ortam", "Steril ekipman ve malzeme"],
            ["✦", "Doğal Sonuç", "Kişiye özel uygulama"],
          ].map(([icon, title, desc]) => (
            <div key={title} className="text-center">
              <p className="text-lg mb-2" style={{ color: "#D4A840" }}>{icon}</p>
              <p className="text-[10px] font-semibold mb-1 tracking-wide" style={{ color: "#F0E0B0" }}>{title}</p>
              <p className="text-[8px] leading-relaxed" style={{ color: "#6A5A40" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* KONUM */}
      <section className="px-5 py-8 text-center">
        <p className="text-[9px] tracking-[0.3em] text-[#7A5A28] mb-1">BİZİ BULUN</p>
        <p className="text-2xl font-light text-[#1A1208] mb-5">Neredeyiz?</p>
        <div className="rounded-2xl p-6 shadow-sm" style={{ background: "#F8F3EC" }}>
       <footer className="py-8 px-6 text-center border-t" style={{ background: "#1A1208", borderColor: "#D4A84020" }}>
  <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 border" style={{ background: "#2C1E0A", borderColor: "#D4A84030" }}>
    <span style={{ color: "#D4A840", fontFamily: "serif" }} className="text-base font-bold">BB</span>
  </div>
  <p className="text-[9px] tracking-widest mb-1" style={{ color: "#D4A840" }}>BURCU BOZKIR BEAUTY STUDIO</p>
  <p className="text-[9px] mb-1" style={{ color: "#4A3A28" }}>Metropark AVM D1-112, Sefaköy / İstanbul</p>
  <a href="tel:02124244151" style={{ color: "#D4A840", fontSize: 11, textDecoration: "none" }}>📞 0212 424 41 51</a>
  <p className="text-[9px] text-[#4A3A28] mt-1">© 2025 · Tüm hakları saklıdır</p>
</footer>
          <div className="flex gap-2 justify-center">
            <Link href="/booking" className="text-[#D4A840] text-[9px] px-5 py-2.5 rounded-full tracking-widest" style={{ background: "#1A1208" }}>
              RANDEVU AL
            </Link>
            <a href="https://wa.me/905319242660" target="_blank" className="text-[9px] text-[#7A5A28] px-5 py-2.5 rounded-full tracking-widest border border-[#D4B896]">
              WHATSAPP
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 px-5 text-center border-t" style={{ background: "#1A1208", borderColor: "#D4A84020" }}>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 border" style={{ background: "#2C1E0A", borderColor: "#D4A84030" }}>
          <span style={{ color: "#D4A840", fontFamily: "serif" }} className="text-base font-bold">ℬℬ</span>
        </div>
        <p className="text-[9px] tracking-widest mb-1" style={{ color: "#D4A840" }}>BURCU BOZKIR BEAUTY STUDIO</p>
        <p className="text-[9px] text-[#4A3A28]">© 2025 · Metropark AVM, Sefaköy İstanbul</p>
      </footer>
    </main>
  )
}