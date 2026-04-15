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
    <main style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: '#FAF7F2', minHeight: '100vh' }}>

      {/* ── HEADER ── */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #EDE6D8',
        padding: '14px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 2px 12px rgba(180,140,60,0.07)'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 8,
            background: 'linear-gradient(135deg, #C8A84B, #A07830)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 3px 10px rgba(200,168,75,0.4)'
          }}>
            <span style={{ color: 'white', fontSize: 13, fontWeight: 800, fontFamily: 'sans-serif', letterSpacing: 1 }}>BB</span>
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: '#2C1A0A' }}>BURCU</div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: '#2C1A0A' }}>BOZKIR</div>
          </div>
        </div>

        {/* Phone */}
        <a href="tel:02124244151" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 12, color: '#6A5030', textDecoration: 'none',
          fontFamily: 'sans-serif'
        }}>
          <span style={{ fontSize: 14 }}>📞</span>
          <span>0212-424<br />51 51</span>
        </a>

        {/* CTA */}
        <Link href="/booking" style={{
          background: 'linear-gradient(135deg, #C8A84B, #A07830)',
          color: 'white', textDecoration: 'none',
          fontSize: 10, fontWeight: 700, letterSpacing: 2,
          padding: '10px 16px', borderRadius: 8,
          fontFamily: 'sans-serif',
          boxShadow: '0 4px 14px rgba(200,168,75,0.4)'
        }}>RANDEVU AL</Link>
      </header>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        padding: '60px 24px 56px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #FDF8EE 0%, #F5E8CC 30%, #EDD68A 60%, #F5E8CC 80%, #FDF8EE 100%)',
      }}>
        {/* Dekoratif dalgalar */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.6) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 30%, rgba(255,220,120,0.4) 0%, transparent 45%),
            radial-gradient(ellipse at 60% 80%, rgba(255,255,255,0.5) 0%, transparent 40%)
          `
        }} />
        {/* Işık efekti üst */}
        <div style={{
          position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,240,180,0.7) 0%, transparent 65%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative' }}>
          <h1 style={{
            margin: '0 0 14px',
            fontSize: 36, fontWeight: 400, lineHeight: 1.2,
            color: '#2C1A0A',
            textShadow: '0 2px 12px rgba(255,255,255,0.8)'
          }}>
            Burcu Bozkir Beauty
          </h1>
          <p style={{
            margin: '0 0 28px',
            fontSize: 15, color: '#6A4A20', lineHeight: 1.7,
            fontStyle: 'italic', maxWidth: 300, marginLeft: 'auto', marginRight: 'auto'
          }}>
            Estetik ve güzellikte uzman ellere<br />teslim olun.
          </p>
          <Link href="/booking" style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #C8A84B, #A07830)',
            color: 'white', textDecoration: 'none',
            fontSize: 11, fontWeight: 700, letterSpacing: 3,
            padding: '14px 32px', borderRadius: 8,
            fontFamily: 'sans-serif',
            boxShadow: '0 6px 20px rgba(160,120,48,0.5)'
          }}>RANDEVU AL</Link>
        </div>
      </section>

      {/* ── HİZMETLER (opsiyonel) ── */}
      {services && services.length > 0 && (
        <section style={{ padding: '32px 20px 8px', background: '#FAF7F2' }}>
          <p style={{ textAlign: 'center', fontSize: 9, letterSpacing: 4, color: '#C8A84B', margin: '0 0 20px', fontFamily: 'sans-serif' }}>HİZMETLERİMİZ</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(services as Service[]).map((service, i) => (
              <div key={service.id} style={{
                background: 'white', borderRadius: 16, padding: '20px',
                border: '1px solid #EDE6D8',
                boxShadow: '0 4px 20px rgba(180,140,60,0.08)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: 'linear-gradient(135deg, #C8A84B20, #C8A84B40)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, color: '#C8A84B'
                    }}>✦</div>
                    <div>
                      <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#2C1A0A' }}>{service.name}</p>
                      <p style={{ margin: 0, fontSize: 11, color: '#9A8060', fontFamily: 'sans-serif' }}>{service.duration_minutes} dk</p>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 18, color: '#C8A84B', fontWeight: 500 }}>₺{service.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 8 }}>
            <Link href="/booking" style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #C8A84B, #A07830)',
              color: 'white', textDecoration: 'none',
              fontSize: 10, fontWeight: 700, letterSpacing: 3,
              padding: '13px 28px', borderRadius: 8,
              fontFamily: 'sans-serif',
              boxShadow: '0 4px 16px rgba(200,168,75,0.35)'
            }}>RANDEVU AL</Link>
          </div>
        </section>
      )}

      {/* ── UZMAN ELLER / HİJYENİK ORTAM ── */}
      <section style={{ padding: '32px 20px' }}>
        <p style={{ textAlign: 'center', fontSize: 9, letterSpacing: 4, color: '#C8A84B', margin: '0 0 20px', fontFamily: 'sans-serif' }}>UZMAN ELLER / HİJYENİK ORTAM BÖLÜMÜ</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            ['Uzman Eller', '5 yıllık profesyonel deneyim ve sürekli güncellenen teknikler'],
            ['Hijyenik Ortam', 'Her işlemde tek kullanımlık malzeme ve steril ekipman'],
          ].map(([title, desc]) => (
            <div key={String(title)} style={{
              background: 'white', borderRadius: 20, padding: '24px 16px',
              textAlign: 'center',
              border: '1px solid #EDE6D8',
              boxShadow: '0 6px 24px rgba(180,140,60,0.08)'
            }}>
              <div style={{ fontSize: 22, color: '#C8A84B', marginBottom: 14 }}>✦</div>
              <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 500, color: '#2C1A0A', lineHeight: 1.3 }}>{title}</h3>
              <p style={{ margin: 0, fontSize: 11, color: '#9A8060', lineHeight: 1.7, fontFamily: 'sans-serif' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEDEN BİZ ── */}
      <section style={{
        margin: '0 20px 32px',
        borderRadius: 20, overflow: 'hidden',
        background: 'linear-gradient(135deg, #FDF8EE 0%, #F5E8CC 40%, #EDD68A 70%, #F5E8CC 100%)',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute', right: -20, top: -20, bottom: -20, width: '50%',
          background: `
            radial-gradient(ellipse at 80% 50%, rgba(255,220,120,0.5) 0%, transparent 60%),
            radial-gradient(ellipse at 50% 80%, rgba(255,255,255,0.4) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }} />
        <div style={{ position: 'relative', padding: '32px 24px' }}>
          <p style={{ margin: '0 0 6px', fontSize: 9, letterSpacing: 4, color: '#C8A84B', fontFamily: 'sans-serif' }}>NEDEN BURCU BOZKIR? BÖLÜMÜ</p>
          <h2 style={{ margin: '0 0 8px', fontSize: 36, fontWeight: 400, color: '#2C1A0A' }}>Fark Yaratan</h2>
          <h2 style={{ margin: '0 0 24px', fontSize: 36, fontWeight: 400, color: '#2C1A0A', fontStyle: 'italic' }}>Detaylar</h2>
          {[
            ['✦', 'Doğal Sonuç', 'Yüz hatlarınıza özel kişiselleştirilmiş uygulama'],
            ['✦', '25.9K Takipçi', 'Instagram\'da güvenilir ve tanınan marka'],
          ].map(([icon, title, desc]) => (
            <div key={String(title)} style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-start' }}>
              <span style={{ color: '#C8A84B', fontSize: 14, marginTop: 2 }}>{icon}</span>
              <div>
                <p style={{ margin: '0 0 3px', fontSize: 14, fontWeight: 600, color: '#2C1A0A' }}>{title}</p>
                <p style={{ margin: 0, fontSize: 11, color: '#8A6A40', lineHeight: 1.6, fontFamily: 'sans-serif' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── KONUM ── */}
      <section style={{
        margin: '0 20px 32px',
        borderRadius: 20, overflow: 'hidden',
        position: 'relative',
        background: 'linear-gradient(135deg, #FDF8EE 0%, #F5E8CC 30%, #EDD68A 60%, #F5E8CC 100%)',
      }}>
        {/* Dekoratif sağ */}
        <div style={{
          position: 'absolute', right: -10, top: 0, bottom: 0, width: '45%',
          background: `
            radial-gradient(ellipse at 80% 30%, rgba(255,220,120,0.6) 0%, transparent 55%),
            radial-gradient(ellipse at 60% 70%, rgba(255,255,255,0.5) 0%, transparent 45%)
          `,
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', padding: '32px 24px' }}>
          <p style={{ margin: '0 0 6px', fontSize: 9, letterSpacing: 4, color: '#C8A84B', fontFamily: 'sans-serif' }}>NEREDEYİZ? BÖLÜMÜ</p>
          <h2 style={{ margin: '0 0 20px', fontSize: 40, fontWeight: 400, color: '#2C1A0A' }}>Neredeyiz?</h2>
          <p style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 600, color: '#2C1A0A' }}>Metropark AVM</p>
          <p style={{ margin: '0 0 2px', fontSize: 13, color: '#8A6A40', fontFamily: 'sans-serif' }}>D1-112 · 2. Kat</p>
          <p style={{ margin: '0 0 12px', fontSize: 13, color: '#8A6A40', fontFamily: 'sans-serif' }}>Sefaköy - İstanbul</p>
          <a href="tel:02124244151" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 16, fontWeight: 600, color: '#C8A84B',
            textDecoration: 'none', marginBottom: 24, fontFamily: 'sans-serif'
          }}>
            <span>📞</span> 0212 424 41 51
          </a>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/booking" style={{
              background: 'linear-gradient(135deg, #C8A84B, #A07830)',
              color: 'white', textDecoration: 'none',
              fontSize: 10, fontWeight: 700, letterSpacing: 2,
              padding: '12px 18px', borderRadius: 8,
              fontFamily: 'sans-serif',
              boxShadow: '0 4px 14px rgba(200,168,75,0.4)'
            }}>RANDEVU AL</Link>
            <a href="https://wa.me/905302223553" target="_blank" style={{
              border: '1.5px solid #C8A84B', color: '#C8A84B',
              textDecoration: 'none', background: 'white',
              fontSize: 10, fontWeight: 700, letterSpacing: 2,
              padding: '12px 18px', borderRadius: 8,
              fontFamily: 'sans-serif'
            }}>WHATSAPP</a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: 'linear-gradient(135deg, #C8A84B, #A07830)',
        padding: '20px 24px',
        textAlign: 'center'
      }}>
        <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, letterSpacing: 3, color: 'white', fontFamily: 'sans-serif' }}>BURCU BOZKIR BEAUTY STUDIO</p>
        <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.7)', fontFamily: 'sans-serif' }}>© 2025 · Metropark AVM, Sefaköy İstanbul</p>
      </footer>

    </main>
  )
}