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
    <main style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif", background: "#FAFAF8" }}>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E8E0D0] shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div style={{ width: 48, height: 48, background: "linear-gradient(135deg, #C8A84B, #A07830)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, boxShadow: "0 4px 16px rgba(200,168,75,0.35)", flexShrink: 0 }}>
              <span style={{ color: "white", fontSize: 16, fontWeight: "bold", fontFamily: "serif" }}>BB</span>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, letterSpacing: 3, color: "#1A1208" }}>BURCU BOZKIR</p>
              <p style={{ margin: 0, fontSize: 9, letterSpacing: 4, color: "#C8A84B" }}>BEAUTY STUDIO</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:02124244151" className="hidden md:block text-sm text-stone-400 no-underline hover:text-[#C8A84B]" style={{ letterSpacing: 1 }}>📞 0212 424 41 51</a>
            <Link href="/booking" style={{ background: "linear-gradient(135deg, #C8A84B, #A07830)", color: "white", fontSize: 10, padding: "12px 24px", letterSpacing: 3, textDecoration: "none", boxShadow: "0 4px 16px rgba(200,168,75,0.3)", whiteSpace: "nowrap" }}>
              RANDEVU AL
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg, #FDFCFA 0%, #F8F4EE 40%, #F0E8DC 100%)" }} className="relative overflow-hidden">
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(200,168,75,0.06) 0%, transparent 60%)" }} />
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Sol metin */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div style={{ width: 32, height: 1, background: "#C8A84B" }} />
                <p style={{ margin: 0, fontSize: 9, letterSpacing: 5, color: "#C8A84B" }}>SEFAKöY · METROPARK AVM</p>
              </div>
              <h1 style={{ margin: "0 0 20px", fontWeight: 300, lineHeight: 1.1, color: "#1A1208", letterSpacing: -1 }} className="text-5xl md:text-6xl">
                Güzelliğin<br />En İnce<br /><em style={{ color: "#C8A84B", fontWeight: 400 }}>Hali</em>
              </h1>
              <p style={{ margin: "0 0 32px", color: "#8A7A68", lineHeight: 1.8 }} className="text-sm md:text-base max-w-md">
                Profesyonel kalıcı makyaj, kaş ve kirpik laminasyon hizmetleriyle doğal güzelliğinizi ön plana çıkarıyoruz.
              </p>
              <div className="flex flex-wrap gap-3 items-center">
                <Link href="/booking" style={{ background: "linear-gradient(135deg, #C8A84B, #A07830)", color: "white", padding: "14px 32px", fontSize: 11, letterSpacing: 3, textDecoration: "none", boxShadow: "0 8px 28px rgba(200,168,75,0.35)" }}>
                  RANDEVU AL
                </Link>
                <a href="tel:02124244151" style={{ border: "1px solid #C8A84B", color: "#C8A84B", padding: "13px 20px", fontSize: 11, letterSpacing: 2, textDecoration: "none" }}>
                  📞 ARA
                </a>
              </div>
              {/* Stats */}
              <div className="flex gap-8 mt-10 pt-8 border-t border-[#E8E0D0]">
                {[["1.200+", "Mutlu Müşteri"], ["5 Yıl", "Deneyim"], ["25.9K", "Takipçi"]].map(([v, l]) => (
                  <div key={l}>
                    <p style={{ margin: "0 0 4px", color: "#C8A84B", fontWeight: 300 }} className="text-2xl md:text-3xl">{v}</p>
                    <p style={{ margin: 0, fontSize: 9, color: "#AAA", letterSpacing: 2 }}>{l.toUpperCase()}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Sağ foto */}
            <div className="flex justify-center">
              <div style={{ width: "100%", maxWidth: 420, background: "linear-gradient(145deg, #F0E8DC, #E8DDD0)", height: 400, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}>
                <div style={{ position: "absolute", top: 20, left: 20, width: 36, height: 36, borderTop: "1px solid #C8A84B", borderLeft: "1px solid #C8A84B" }} />
                <div style={{ position: "absolute", bottom: 20, right: 20, width: 36, height: 36, borderBottom: "1px solid #C8A84B", borderRight: "1px solid #C8A84B" }} />
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: "#C8A84B", fontSize: 40, marginBottom: 8 }}>✦</p>
                  <p style={{ color: "#C0B090", fontSize: 10, letterSpacing: 3 }}>SALON FOTOĞRAFI</p>
                  <p style={{ color: "#D4C4A0", fontSize: 9, marginTop: 4 }}>Yakında eklenecek</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HİZMETLER */}
      <section className="bg-white py-16 md:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center gap-5 justify-center mb-4">
              <div style={{ width: 60, height: 1, background: "#C8A84B" }} />
              <p style={{ margin: 0, fontSize: 9, letterSpacing: 5, color: "#C8A84B" }}>HİZMETLERİMİZ</p>
              <div style={{ width: 60, height: 1, background: "#C8A84B" }} />
            </div>
            <h2 style={{ margin: 0, fontWeight: 300, color: "#1A1208" }} className="text-3xl md:text-4xl">Ne Yapmamızı İstersiniz?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(services as Service[])?.map((service, i) => (
              <div key={service.id} style={{ border: "1px solid #E8E0D0", padding: "32px 24px", position: "relative", background: "#FAFAF8" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #C8A84B, #F0D080)" }} />
                <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #C8A84B, #A07830)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>0{i + 1}</span>
                </div>
                <h3 style={{ margin: "0 0 12px", fontSize: 20, fontWeight: 500, color: "#1A1208" }}>{service.name}</h3>
                <p style={{ margin: "0 0 24px", fontSize: 12, color: "#8A7A68", lineHeight: 1.7 }}>{service.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: "1px solid #E8E0D0" }}>
                  <span style={{ fontSize: 10, color: "#AAA" }}>⏱ {service.duration_minutes} dk</span>
                  <span style={{ fontSize: 22, color: "#C8A84B", fontWeight: 400 }}>₺{service.price}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/booking" style={{ display: "inline-block", background: "linear-gradient(135deg, #C8A84B, #A07830)", color: "white", padding: "16px 40px", fontSize: 11, letterSpacing: 4, textDecoration: "none", boxShadow: "0 8px 28px rgba(200,168,75,0.3)" }}>
              RANDEVU AL
            </Link>
          </div>
        </div>
      </section>

      {/* NEDEN BİZ */}
      <section style={{ background: "linear-gradient(135deg, #1A1208 0%, #2C1E0A 100%)" }} className="py-16 md:py-20 px-6 relative overflow-hidden">
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(200,168,75,0.1) 0%, transparent 60%)" }} />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-12">
            <div className="flex items-center gap-5 justify-center mb-4">
              <div style={{ width: 60, height: 1, background: "rgba(200,168,75,0.3)" }} />
              <p style={{ margin: 0, fontSize: 9, letterSpacing: 5, color: "#C8A84B" }}>NEDEN BURCU BOZKIR?</p>
              <div style={{ width: 60, height: 1, background: "rgba(200,168,75,0.3)" }} />
            </div>
            <h2 style={{ margin: 0, fontWeight: 300, color: "white" }} className="text-3xl md:text-4xl">Fark Yaratan Detaylar</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              ["✦", "Uzman Eller", "5 yıllık profesyonel deneyim ve sürekli güncellenen teknikler"],
              ["✦", "Hijyenik Ortam", "Her işlemde tek kullanımlık malzeme ve steril ekipman"],
              ["✦", "Doğal Sonuç", "Yüz hatlarınıza özel, kişiselleştirilmiş uygulama"],
            ].map(([icon, title, desc]) => (
              <div key={String(title)} style={{ textAlign: "center", padding: "32px 24px", border: "1px solid rgba(200,168,75,0.12)", background: "rgba(200,168,75,0.04)" }}>
                <p style={{ margin: "0 0 16px", fontSize: 24, color: "#C8A84B" }}>{icon}</p>
                <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 500, color: "white", letterSpacing: 2 }}>{title}</h3>
                <p style={{ margin: 0, fontSize: 11, color: "#6A5A40", lineHeight: 1.8 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KONUM */}
      <section className="bg-white py-16 md:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div style={{ width: 32, height: 1, background: "#C8A84B" }} />
                <p style={{ margin: 0, fontSize: 9, letterSpacing: 5, color: "#C8A84B" }}>BİZİ BULUN</p>
              </div>
              <h2 style={{ margin: "0 0 20px", fontWeight: 300, color: "#1A1208" }} className="text-3xl md:text-4xl">Neredeyiz?</h2>
              <p style={{ margin: "0 0 4px", fontSize: 18, color: "#1A1208" }}>Metropark AVM</p>
              <p style={{ margin: "0 0 4px", fontSize: 13, color: "#8A7A68" }}>D1-112 · -2. Kat</p>
              <p style={{ margin: "0 0 8px", fontSize: 13, color: "#8A7A68" }}>Sefaköy · İstanbul</p>
              <a href="tel:02124244151" style={{ display: "block", fontSize: 16, color: "#C8A84B", textDecoration: "none", marginBottom: 32, fontWeight: 500 }}>📞 0212 424 41 51</a>
              <div className="flex flex-wrap gap-3">
                <Link href="/booking" style={{ background: "linear-gradient(135deg, #C8A84B, #A07830)", color: "white", padding: "14px 28px", fontSize: 10, letterSpacing: 3, textDecoration: "none", boxShadow: "0 6px 20px rgba(200,168,75,0.3)" }}>
                  RANDEVU AL
                </Link>
                <a href="https://wa.me/905302223553" target="_blank" style={{ border: "1px solid #C8A84B", color: "#C8A84B", padding: "13px 20px", fontSize: 10, letterSpacing: 2, textDecoration: "none" }}>
                  WHATSAPP
                </a>
              </div>
            </div>
            {/* Harita */}
            <a href="https://maps.google.com/?q=Metropark+AVM+Sefakoy+Istanbul" target="_blank"
              style={{ display: "block", background: "linear-gradient(145deg, #F8F4EE, #F0E8DC)", height: 320, position: "relative", textDecoration: "none", cursor: "pointer" }}>
              <div style={{ position: "absolute", top: 20, left: 20, width: 28, height: 28, borderTop: "1px solid #C8A84B", borderLeft: "1px solid #C8A84B" }} />
              <div style={{ position: "absolute", bottom: 20, right: 20, width: 28, height: 28, borderBottom: "1px solid #C8A84B", borderRight: "1px solid #C8A84B" }} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 10 }}>
                <p style={{ color: "#C8A84B", fontSize: 44, margin: 0 }}>📍</p>
                <p style={{ color: "#1A1208", fontSize: 15, fontWeight: 600, margin: 0 }}>Metropark AVM</p>
                <p style={{ color: "#8A7A68", fontSize: 12, margin: 0 }}>D1-112 · Sefaköy / İstanbul</p>
                <div style={{ marginTop: 10, background: "linear-gradient(135deg, #C8A84B, #A07830)", color: "white", padding: "10px 22px", fontSize: 10, letterSpacing: 2 }}>
                  Google Maps'te Aç →
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#1A1208" }} className="py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #C8A84B, #A07830)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "white", fontSize: 12, fontWeight: "bold", fontFamily: "serif" }}>BB</span>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, letterSpacing: 3, color: "#C8A84B" }}>BURCU BOZKIR BEAUTY STUDIO</p>
              <p style={{ margin: 0, fontSize: 9, color: "#4A3A20" }}>Metropark AVM D1-112, Sefaköy / İstanbul</p>
              <a href="tel:02124244151" style={{ color: "#C8A84B", fontSize: 10, textDecoration: "none" }}>📞 0212 424 41 51</a>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 9, color: "#4A3A20" }}>© 2025 · Tüm hakları saklıdır</p>
        </div>
      </footer>
    </main>
  )
}