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
    <main style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: '#F5EFE6', minHeight: '100vh' }}>

      {/* ── HEADER ── */}
      <header style={{
        background: 'rgba(255,252,245,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(200,168,75,0.15)',
        padding: '14px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 4px 24px rgba(160,120,48,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10,
            background: 'linear-gradient(135deg, #D4A84B, #A07830)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(200,168,75,0.45)'
          }}>
            <span style={{ color: 'white', fontSize: 13, fontWeight: 800, fontFamily: 'sans-serif', letterSpacing: 1 }}>BB</span>
          </div>
          <div style={{ borderLeft: '1px solid #E0D0B0', paddingLeft: 10, lineHeight: 1.25 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: '#2C1A0A' }}>BURCU</div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: '#2C1A0A' }}>BOZKIR</div>
          </div>
        </div>
        <a href="tel:02124244151" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 11, color: '#7A5A30', textDecoration: 'none', fontFamily: 'sans-serif', lineHeight: 1.4
        }}>
          <span style={{ fontSize: 15 }}>📞</span>
          <span>0212-424<br />51 51</span>
        </a>
        <Link href="/booking" style={{
          background: 'linear-gradient(135deg, #D4A84B, #A07830)',
          color: 'white', textDecoration: 'none',
          fontSize: 10, fontWeight: 700, letterSpacing: 2,
          padding: '11px 18px', borderRadius: 10,
          fontFamily: 'sans-serif',
          boxShadow: '0 6px 18px rgba(180,130,40,0.45)'
        }}>RANDEVU AL</Link>
      </header>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        padding: '70px 24px 64px', textAlign: 'center',
        background: `
          radial-gradient(ellipse at 50% 0%, rgba(255,235,160,0.9) 0%, rgba(240,210,130,0.6) 30%, transparent 65%),
          radial-gradient(ellipse at 20% 60%, rgba(255,245,210,0.8) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 40%, rgba(220,180,90,0.5) 0%, transparent 45%),
          radial-gradient(ellipse at 60% 90%, rgba(255,250,230,0.9) 0%, transparent 55%),
          linear-gradient(160deg, #FDF5E0 0%, #F5E4B8 25%, #EDD080 45%, #F0E0A8 65%, #FAF0D0 85%, #FDF8EC 100%)
        `
      }}>
        {/* Işıltı efektleri */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.7) 0%, transparent 35%),
            radial-gradient(ellipse at 70% 70%, rgba(255,255,255,0.5) 0%, transparent 30%),
            radial-gradient(ellipse at 85% 15%, rgba(255,240,150,0.4) 0%, transparent 25%)
          `
        }} />
        {/* Dalga çizgileri - dekoratif */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden'
        }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              position: 'absolute',
              left: `${-20 + i * 30}%`,
              top: `${10 + i * 20}%`,
              width: '80%', height: '60%',
              borderRadius: '50%',
              background: `rgba(210,170,80,${0.06 - i * 0.01})`,
              transform: `rotate(${-20 + i * 15}deg) scaleX(2)`,
              filter: 'blur(20px)'
            }} />
          ))}
        </div>

        <div style={{ position: 'relative' }}>
          <h1 style={{
            margin: '0 0 16px',
            fontSize: 38, fontWeight: 400, lineHeight: 1.2, color: '#2C1A0A',
            textShadow: '0 2px 20px rgba(255,255,255,0.9)'
          }}>
            Burcu Bozkir Beauty
          </h1>
          <p style={{
            margin: '0 0 32px',
            fontSize: 16, color: '#7A5A2A', lineHeight: 1.7,
            fontStyle: 'italic', maxWidth: 280, marginLeft: 'auto', marginRight: 'auto',
            textShadow: '0 1px 8px rgba(255,255,255,0.8)'
          }}>
            Estetik ve güzellikte uzman ellere<br />teslim olun.
          </p>
          <Link href="/booking" style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #C8A84B, #9A7030)',
            color: 'white', textDecoration: 'none',
            fontSize: 11, fontWeight: 700, letterSpacing: 3,
            padding: '14px 34px', borderRadius: 10,
            fontFamily: 'sans-serif',
            boxShadow: '0 8px 28px rgba(150,110,30,0.55), 0 2px 8px rgba(150,110,30,0.3)',
          }}>RANDEVU AL</Link>
        </div>
      </section>

      {/* ── HİZMETLER ── */}
      {services && services.length > 0 && (
        <section style={{ padding: '36px 20px 12px', background: '#F5EFE6' }}>
          <p style={{ textAlign: 'center', fontSize: 9, letterSpacing: 4, color: '#B8903A', margin: '0 0 20px', fontFamily: 'sans-serif' }}>HİZMETLERİMİZ</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(services as Service[]).map((service) => (
              <div key={service.id} style={{
                background: 'rgba(255,252,245,0.85)',
                backdropFilter: 'blur(8px)',
                borderRadius: 18, padding: '20px',
                border: '1px solid rgba(200,168,75,0.2)',
                boxShadow: '0 8px 32px rgba(160,120,40,0.1), 0 2px 8px rgba(160,120,40,0.06)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      background: 'linear-gradient(135deg, rgba(200,168,75,0.15), rgba(200,168,75,0.3))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, color: '#C8A84B',
                      border: '1px solid rgba(200,168,75,0.2)'
                    }}>✦</div>
                    <div>
                      <p style={{ margin: '0 0 3px', fontSize: 15, fontWeight: 600, color: '#2C1A0A' }}>{service.name}</p>
                      <p style={{ margin: 0, fontSize: 11, color: '#9A8060', fontFamily: 'sans-serif' }}>{service.duration_minutes} dk</p>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 19, color: '#C8A84B', fontWeight: 500 }}>₺{service.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 12 }}>
            <Link href="/booking" style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #C8A84B, #9A7030)',
              color: 'white', textDecoration: 'none',
              fontSize: 10, fontWeight: 700, letterSpacing: 3,
              padding: '13px 28px', borderRadius: 10,
              fontFamily: 'sans-serif',
              boxShadow: '0 6px 20px rgba(180,130,40,0.4)'
            }}>RANDEVU AL</Link>
          </div>
        </section>
      )}

      {/* ── UZMAN ELLER / HİJYENİK ORTAM ── */}
      <section style={{ padding: '28px 20px' }}>
        <p style={{ textAlign: 'center', fontSize: 9, letterSpacing: 4, color: '#B8903A', margin: '0 0 18px', fontFamily: 'sans-serif' }}>UZMAN ELLER / HİJYENİK ORTAM BÖLÜMÜ</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            ['Uzman\nEller', '5 yıllık profesyonel deneyim ve sürekli güncellenen teknikler'],
            ['Hijyenik\nOrtam', 'Her işlemde tek kullanımlık malzeme ve steril ekipman'],
          ].map(([title, desc]) => (
            <div key={String(title)} style={{
              background: 'rgba(255,252,245,0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: 22, padding: '28px 16px',
              textAlign: 'center',
              border: '1px solid rgba(200,168,75,0.18)',
              boxShadow: '0 12px 40px rgba(160,120,40,0.12), 0 4px 12px rgba(160,120,40,0.07), inset 0 1px 0 rgba(255,255,255,0.8)'
            }}>
              <div style={{
                fontSize: 20, color: '#C8A84B', marginBottom: 16,
                filter: 'drop-shadow(0 2px 4px rgba(200,168,75,0.4))'
              }}>✦</div>
              <h3 style={{ margin: '0 0 14px', fontSize: 20, fontWeight: 500, color: '#2C1A0A', lineHeight: 1.3, whiteSpace: 'pre-line' }}>{title}</h3>
              <p style={{ margin: 0, fontSize: 11, color: '#9A7A50', lineHeight: 1.7, fontFamily: 'sans-serif' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEDEN BİZ ── */}
      <section style={{
        margin: '4px 20px 28px',
        borderRadius: 22, overflow: 'hidden',
        position: 'relative',
        background: `
          radial-gradient(ellipse at 80% 30%, rgba(220,180,90,0.7) 0%, transparent 50%),
          radial-gradient(ellipse at 20% 70%, rgba(255,245,210,0.8) 0%, transparent 45%),
          radial-gradient(ellipse at 60% 10%, rgba(255,255,255,0.6) 0%, transparent 35%),
          linear-gradient(150deg, #FDF5E0 0%, #F5E4B8 30%, #EDD080 55%, #F0E0A8 75%, #FDF8EC 100%)
        `,
        boxShadow: '0 12px 40px rgba(160,120,40,0.15), 0 4px 16px rgba(160,120,40,0.08)'
      }}>
        <div style={{
          position: 'absolute', right: -30, top: 0, bottom: 0, width: '55%',
          background: `
            radial-gradient(ellipse at 90% 40%, rgba(255,220,100,0.6) 0%, transparent 55%),
            radial-gradient(ellipse at 60% 80%, rgba(255,255,255,0.5) 0%, transparent 45%)
          `,
          pointerEvents: 'none'
        }} />
        <div style={{ position: 'relative', padding: '32px 24px' }}>
          <p style={{ margin: '0 0 6px', fontSize: 9, letterSpacing: 4, color: '#B8903A', fontFamily: 'sans-serif' }}>NEDEN BURCU BOZKIR?</p>
          <h2 style={{ margin: '0 0 4px', fontSize: 34, fontWeight: 400, color: '#2C1A0A', textShadow: '0 2px 10px rgba(255,255,255,0.7)' }}>Fark Yaratan</h2>
          <h2 style={{ margin: '0 0 24px', fontSize: 34, fontWeight: 400, color: '#2C1A0A', fontStyle: 'italic', textShadow: '0 2px 10px rgba(255,255,255,0.7)' }}>Detaylar</h2>
          {[
            ['Doğal Sonuç', 'Yüz hatlarınıza özel kişiselleştirilmiş uygulama'],
            ['25.9K Takipçi', "Instagram'da güvenilir ve tanınan marka"],
          ].map(([title, desc]) => (
            <div key={String(title)} style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-start' }}>
              <span style={{ color: '#C8A84B', fontSize: 13, marginTop: 3, filter: 'drop-shadow(0 1px 3px rgba(200,168,75,0.5))' }}>✦</span>
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
        borderRadius: 22, overflow: 'hidden',
        position: 'relative',
        background: `
          radial-gradient(ellipse at 85% 30%, rgba(220,180,90,0.65) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 70%, rgba(255,245,200,0.7) 0%, transparent 45%),
          radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.6) 0%, transparent 40%),
          linear-gradient(150deg, #FDF5E0 0%, #F5E4B8 30%, #EDD080 55%, #F0E0A8 75%, #FDF8EC 100%)
        `,
        boxShadow: '0 12px 40px rgba(160,120,40,0.15), 0 4px 16px rgba(160,120,40,0.08)'
      }}>
        <div style={{
          position: 'absolute', right: -20, top: 0, bottom: 0, width: '50%',
          background: `
            radial-gradient(ellipse at 85% 35%, rgba(255,215,80,0.55) 0%, transparent 50%),
            radial-gradient(ellipse at 55% 75%, rgba(255,255,255,0.5) 0%, transparent 40%)
          `,
          pointerEvents: 'none'
        }} />
        <div style={{ position: 'relative', padding: '32px 24px' }}>
          <p style={{ margin: '0 0 6px', fontSize: 9, letterSpacing: 4, color: '#B8903A', fontFamily: 'sans-serif' }}>BİZİ BULUN</p>
          <h2 style={{ margin: '0 0 20px', fontSize: 42, fontWeight: 400, color: '#2C1A0A', textShadow: '0 2px 12px rgba(255,255,255,0.8)' }}>Neredeyiz?</h2>
          <p style={{ margin: '0 0 3px', fontSize: 17, fontWeight: 600, color: '#2C1A0A' }}>Metropark AVM</p>
          <p style={{ margin: '0 0 2px', fontSize: 13, color: '#8A6A40', fontFamily: 'sans-serif' }}>D1-112 · 2. Kat</p>
          <p style={{ margin: '0 0 14px', fontSize: 13, color: '#8A6A40', fontFamily: 'sans-serif' }}>Sefaköy - İstanbul</p>
          <a href="tel:02124244151" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 15, fontWeight: 600, color: '#B8903A',
            textDecoration: 'none', marginBottom: 24, fontFamily: 'sans-serif'
          }}>
            <span>📞</span> 0212 424 41 51
          </a>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/booking" style={{
              background: 'linear-gradient(135deg, #C8A84B, #9A7030)',
              color: 'white', textDecoration: 'none',
              fontSize: 10, fontWeight: 700, letterSpacing: 2,
              padding: '13px 20px', borderRadius: 10,
              fontFamily: 'sans-serif',
              boxShadow: '0 6px 18px rgba(160,110,30,0.5)'
            }}>RANDEVU AL</Link>
            <a href="https://wa.me/905302223553" target="_blank" style={{
              border: '1.5px solid #C8A84B', color: '#9A7030',
              textDecoration: 'none',
              background: 'rgba(255,252,245,0.7)',
              backdropFilter: 'blur(8px)',
              fontSize: 10, fontWeight: 700, letterSpacing: 2,
              padding: '13px 20px', borderRadius: 10,
              fontFamily: 'sans-serif'
            }}>WHATSAPP</a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: 'linear-gradient(135deg, #C8A84B, #9A7030)',
        padding: '20px 24px', textAlign: 'center'
      }}>
        <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, letterSpacing: 3, color: 'white', fontFamily: 'sans-serif' }}>BURCU BOZKIR BEAUTY STUDIO</p>
        <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.75)', fontFamily: 'sans-serif' }}>© 2025 · Metropark AVM, Sefaköy İstanbul</p>
      </footer>

    </main>
  )
}