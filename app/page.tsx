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
      <header style={{ background: "white", borderBottom: "1px solid #E8E0D0", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, background: "linear-gradient(135deg, #C8A84B, #A07830)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, boxShadow: "0 4px 16px rgba(200,168,75,0.35)" }}>
            <span style={{ color: "white", fontSize: 16, fontWeight: "bold", fontFamily: "serif" }}>BB</span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, letterSpacing: 3, color: "#1A1208" }}>BURCU BOZKIR</p>
            <p style={{ margin: 0, fontSize: 9, letterSpacing: 4, color: "#C8A84B" }}>BEAUTY STUDIO</p>
          </div>
        </div>
        <nav style={{ display: "flex", gap: 32, alignItems: "center" }}>
          <a href="tel:02124244151" style={{ fontSize: 12, color: "#888", textDecoration: "none", letterSpacing: 1 }}>📞 0212 424 41 51</a>
          <Link href="/booking" style={{ background: "linear-gradient(135deg, #C8A84B, #A07830)", color: "white", fontSize: 10, padding: "12px 24px", letterSpacing: 3, textDecoration: "none", boxShadow: "0 4px 16px rgba(200,168,75,0.3)" }}>
            RANDEVU AL
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ position: "relative", minHeight: "90vh", background: "linear-gradient(135deg, #FDFCFA 0%, #F8F4EE 40%, #F0E8DC 100%)", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(200,168,75,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(200,168,75,0.08) 0%, transparent 50%)" }} />
        <div style={{ position: "absolute", top: 0, right: "38%", bottom: 0, width: 1, background: "linear-gradient(to bottom, transparent, rgba(200,168,75,0.12), transparent)" }} />

        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, width: "100%", maxWidth: 1200, margin: "0 auto", padding: "0 60px" }}>
          {/* Sol metin */}
          <div style={{ paddingRight: 80, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <div style={{ width: 32, height: 1, background: "#C8A84B" }} />
              <p style={{ margin: 0, fontSize: 9, letterSpacing: 5, color: "#C8A84B" }}>SEFAKöY · METROPARK AVM · İSTANBUL</p>
            </div>
            <h1 style={{ margin: "0 0 20px", fontSize: 56, fontWeight: 300, lineHeight: 1.1, color: "#1A1208", letterSpacing: -1 }}>
              Güzelliğin<br />En İnce<br /><em style={{ color: "#C8A84B", fontWeight: 400 }}>Hali</em>
            </h1>
            <p style={{ margin: "0 0 36px", fontSize: 14, color: "#8A7A68", lineHeight: 1.8, maxWidth: 400 }}>
              Profesyonel kalıcı makyaj, kaş ve kirpik laminasyon hizmetleriyle doğal güzelliğinizi ön plana çıkarıyoruz.
            </p>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <Link href="/booking" style={{ background: "linear-gradient(135deg, #C8A84B, #A07830)", color: "white", padding: "16px 36px", fontSize: 11, letterSpacing: 4, textDecoration: "none", boxShadow: "0 8px 28px rgba(200,168,75,0.35)" }}>
                RANDEVU AL
              </Link>
              <a href="tel:02124244151" style={{ border: "1px solid #C8A84B", color: "#C8A84B", padding: "15px 24px", fontSize: 11, letterSpacing: 2, textDecoration: "none" }}>
                📞 ARA
              </a>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 40, marginTop: 52, paddingTop: 36, borderTop: "1px solid #E8E0D0" }}>
              {[["1.200+", "Mutlu Müşteri"], ["5 Yıl", "Deneyim"], ["25.9K", "Takipçi"]].map(([v, l]) => (
                <div key={l}>
                  <p style={{ margin: "0 0 4px", fontSize: 28, color: "#C8A84B", fontWeight: 300 }}>{v}</p>
                  <p style={{ margin: 0, fontSize: 9, color: "#AAA", letterSpacing: 2 }}>{l.toUpperCase()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ foto */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
  <a 
  href="https://maps.google.com/?q=Metropark+AVM+Sefakoy+Istanbul" 
  target="_blank" 
  style={{ display: "block", position: "relative", height: 360, overflow: "hidden", textDecoration: "none", cursor: "pointer", background: "linear-gradient(145deg, #F8F4EE, #F0E8DC)" }}
>
  <div style={{ position: "absolute", top: 20, left: 20, width: 28, height: 28, borderTop: "1px solid #C8A84B", borderLeft: "1px solid #C8A84B" }} />
  <div style={{ position: "absolute", bottom: 20, right: 20, width: 28, height: 28, borderBottom: "1px solid #C8A84B", borderRight: "1px solid #C8A84B" }} />
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12 }}>
    <p style={{ color: "#C8A84B", fontSize: 48, margin: 0 }}>📍</p>
    <p style={{ color: "#1A1208", fontSize: 16, fontWeight: 600, margin: 0 }}>Metropark AVM</p>
    <p style={{ color: "#8A7A68", fontSize: 12, margin: 0 }}>D1-112 · Sefaköy / İstanbul</p>
    <div style={{ marginTop: 8, background: "linear-gradient(135deg, #C8A84B, #A07830)", color: "white", padding: "10px 24px", fontSize: 11, letterSpacing: 2 }}>
      Google Maps'te Aç →
    </div>
  </div>
</a>
            </div>
          </div>
        </div>
      </section>

      {/* HİZMETLER */}
      <section style={{ background: "white", padding: "80px 60px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, justifyContent: "center", marginBottom: 16 }}>
              <div style={{ width: 60, height: 1, background: "#C8A84B" }} />
              <p style={{ margin: 0, fontSize: 9, letterSpacing: 5, color: "#C8A84B" }}>HİZMETLERİMİZ</p>
              <div style={{ width: 60, height: 1, background: "#C8A84B" }} />
            </div>
            <h2 style={{ margin: 0, fontSize: 40, fontWeight: 300, color: "#1A1208" }}>Ne Yapmamızı İstersiniz?</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {(services as Service[])?.map((service, i) => (
              <div key={service.id} style={{ border: "1px solid #E8E0D0", padding: "36px 28px", position: "relative", background: "#FAFAF8" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #C8A84B, #F0D080)" }} />
                <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #C8A84B, #A07830)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>0{i + 1}</span>
                </div>
                <h3 style={{ margin: "0 0 12px", fontSize: 20, fontWeight: 500, color: "#1A1208" }}>{service.name}</h3>
                <p style={{ margin: "0 0 24px", fontSize: 12, color: "#8A7A68", lineHeight: 1.7 }}>{service.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: "1px solid #E8E0D0" }}>
                  <span style={{ fontSize: 10, color: "#AAA", letterSpacing: 1 }}>⏱ {service.duration_minutes} dk</span>
                  <span style={{ fontSize: 22, color: "#C8A84B", fontWeight: 400 }}>₺{service.price}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/booking" style={{ display: "inline-block", background: "linear-gradient(135deg, #C8A84B, #A07830)", color: "white", padding: "16px 40px", fontSize: 11, letterSpacing: 4, textDecoration: "none", boxShadow: "0 8px 28px rgba(200,168,75,0.3)" }}>
              RANDEVU AL
            </Link>
          </div>
        </div>
      </section>

      {/* NEDEN BİZ */}
      <section style={{ background: "linear-gradient(135deg, #1A1208 0%, #2C1E0A 100%)", padding: "80px 60px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(200,168,75,0.1) 0%, transparent 60%)" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, justifyContent: "center", marginBottom: 16 }}>
              <div style={{ width: 60, height: 1, background: "rgba(200,168,75,0.3)" }} />
              <p style={{ margin: 0, fontSize: 9, letterSpacing: 5, color: "#C8A84B" }}>NEDEN BURCU BOZKIR?</p>
              <div style={{ width: 60, height: 1, background: "rgba(200,168,75,0.3)" }} />
            </div>
            <h2 style={{ margin: 0, fontSize: 40, fontWeight: 300, color: "white" }}>Fark Yaratan Detaylar</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
            {[
              ["✦", "Uzman Eller", "5 yıllık profesyonel deneyim ve sürekli güncellenen teknikler"],
              ["✦", "Hijyenik Ortam", "Her işlemde tek kullanımlık malzeme ve steril ekipman"],
              ["✦", "Doğal Sonuç", "Yüz hatlarınıza özel, kişiselleştirilmiş uygulama"],
            ].map(([icon, title, desc]) => (
              <div key={String(title)} style={{ textAlign: "center", padding: "36px 24px", border: "1px solid rgba(200,168,75,0.12)", background: "rgba(200,168,75,0.04)" }}>
                <p style={{ margin: "0 0 16px", fontSize: 24, color: "#C8A84B" }}>{icon}</p>
                <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 500, color: "white", letterSpacing: 2 }}>{title}</h3>
                <p style={{ margin: 0, fontSize: 11, color: "#6A5A40", lineHeight: 1.8 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KONUM */}
      <section style={{ background: "white", padding: "80px 60px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 32, height: 1, background: "#C8A84B" }} />
              <p style={{ margin: 0, fontSize: 9, letterSpacing: 5, color: "#C8A84B" }}>BİZİ BULUN</p>
            </div>
            <h2 style={{ margin: "0 0 20px", fontSize: 40, fontWeight: 300, color: "#1A1208" }}>Neredeyiz?</h2>
            <p style={{ margin: "0 0 6px", fontSize: 18, color: "#1A1208" }}>Metropark AVM</p>
            <p style={{ margin: "0 0 4px", fontSize: 13, color: "#8A7A68" }}>D1-112 · -2. Kat</p>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: "#8A7A68" }}>Sefaköy · İstanbul</p>
            <a href="tel:02124244151" style={{ display: "block", fontSize: 16, color: "#C8A84B", textDecoration: "none", marginBottom: 36, fontWeight: 500 }}>📞 0212 424 41 51</a>
            <div style={{ display: "flex", gap: 14 }}>
              <Link href="/booking" style={{ background: "linear-gradient(135deg, #C8A84B, #A07830)", color: "white", padding: "14px 28px", fontSize: 10, letterSpacing: 3, textDecoration: "none", boxShadow: "0 6px 20px rgba(200,168,75,0.3)" }}>
                RANDEVU AL
              </Link>
              <a href="https://wa.me/905302223553" target="_blank" style={{ border: "1px solid #C8A84B", color: "#C8A84B", padding: "13px 20px", fontSize: 10, letterSpacing: 2, textDecoration: "none" }}>
                WHATSAPP
              </a>
            </div>
          </div>
          <div style={{ background: "linear-gradient(145deg, #F8F4EE, #F0E8DC)", height: 360, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <div style={{ position: "absolute", top: 20, left: 20, width: 28, height: 28, borderTop: "1px solid #C8A84B", borderLeft: "1px solid #C8A84B" }} />
            <div style={{ position: "absolute", bottom: 20, right: 20, width: 28, height: 28, borderBottom: "1px solid #C8A84B", borderRight: "1px solid #C8A84B" }} />
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#C8A84B", fontSize: 32, marginBottom: 8 }}>📍</p>
              <p style={{ color: "#C0B090", fontSize: 10, letterSpacing: 3 }}>HARİTA</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#1A1208", padding: "40px 60px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #C8A84B, #A07830)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontSize: 12, fontWeight: "bold", fontFamily: "serif" }}>BB</span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 11, letterSpacing: 3, color: "#C8A84B" }}>BURCU BOZKIR BEAUTY STUDIO</p>
            <p style={{ margin: 0, fontSize: 9, color: "#4A3A20" }}>Metropark AVM D1-112, Sefaköy / İstanbul</p>
            <a href="tel:02124244151" style={{ color: "#C8A84B", fontSize: 10, textDecoration: "none" }}>📞 0212 424 41 51</a>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: 9, color: "#4A3A20" }}>© 2025 · Tüm hakları saklıdır</p>
      </footer>
    </main>
  )
}