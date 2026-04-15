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

  const LuxuryBg = ({ height = 340, id = 'h' }: { height?: number; id?: string }) => (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      viewBox={`0 0 400 ${height}`} preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`bg${id}`} cx="50%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#FDF5E6" />
          <stop offset="45%" stopColor="#F0D898" />
          <stop offset="100%" stopColor="#D4A84B" />
        </radialGradient>
        <radialGradient id={`gA${id}`} cx="25%" cy="45%" r="55%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.92)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <radialGradient id={`gB${id}`} cx="75%" cy="65%" r="50%">
          <stop offset="0%" stopColor="rgba(255,238,160,0.75)" />
          <stop offset="100%" stopColor="rgba(255,238,160,0)" />
        </radialGradient>
        <radialGradient id={`gC${id}`} cx="65%" cy="20%" r="40%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <filter id={`f1${id}`}><feGaussianBlur stdDeviation="10"/></filter>
        <filter id={`f2${id}`}><feGaussianBlur stdDeviation="5"/></filter>
        <filter id={`f3${id}`}><feGaussianBlur stdDeviation="2"/></filter>
      </defs>

      {/* Arka plan */}
      <rect width="400" height={height} fill={`url(#bg${id})`} />

      {/* Büyük aydınlık alanlar */}
      <ellipse cx="110" cy={height * 0.45} rx="150" ry="120" fill={`url(#gA${id})`} filter={`url(#f1${id})`} />
      <ellipse cx="310" cy={height * 0.65} rx="130" ry="100" fill={`url(#gB${id})`} filter={`url(#f1${id})`} />
      <ellipse cx="270" cy={height * 0.2} rx="100" ry="80" fill={`url(#gC${id})`} filter={`url(#f1${id})`} />

      {/* Akan dalgalar — kalın yumuşak */}
      <path d={`M-30 ${height*0.35} Q80 ${height*0.1} 200 ${height*0.32} Q310 ${height*0.5} 430 ${height*0.25}`}
        stroke="rgba(200,160,50,0.22)" strokeWidth="28" fill="none" filter={`url(#f1${id})`} />
      <path d={`M-30 ${height*0.55} Q100 ${height*0.3} 220 ${height*0.52} Q330 ${height*0.7} 430 ${height*0.45}`}
        stroke="rgba(200,155,45,0.18)" strokeWidth="22" fill="none" filter={`url(#f1${id})`} />
      <path d={`M-30 ${height*0.72} Q90 ${height*0.5} 210 ${height*0.68} Q320 ${height*0.82} 430 ${height*0.62}`}
        stroke="rgba(185,145,40,0.15)" strokeWidth="18" fill="none" filter={`url(#f1${id})`} />

      {/* Parlak altın şeritler — ince */}
      <path d={`M-30 ${height*0.33} Q80 ${height*0.08} 200 ${height*0.30} Q310 ${height*0.48} 430 ${height*0.23}`}
        stroke="rgba(240,195,80,0.55)" strokeWidth="1.5" fill="none" filter={`url(#f3${id})`} />
      <path d={`M-30 ${height*0.36} Q80 ${height*0.11} 200 ${height*0.33} Q310 ${height*0.51} 430 ${height*0.26}`}
        stroke="rgba(255,230,130,0.4)" strokeWidth="0.8" fill="none" />
      <path d={`M-30 ${height*0.53} Q100 ${height*0.28} 220 ${height*0.50} Q330 ${height*0.68} 430 ${height*0.43}`}
        stroke="rgba(230,180,65,0.5)" strokeWidth="1.5" fill="none" filter={`url(#f3${id})`} />
      <path d={`M-30 ${height*0.70} Q90 ${height*0.48} 210 ${height*0.66} Q320 ${height*0.80} 430 ${height*0.60}`}
        stroke="rgba(210,165,55,0.45)" strokeWidth="1.2" fill="none" filter={`url(#f3${id})`} />

      {/* Işıltı noktaları */}
      {[[130,height*0.28],[230,height*0.45],[320,height*0.35],[170,height*0.62],[290,height*0.72],[80,height*0.55]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i%2===0?3:2} fill="rgba(255,252,200,0.95)" filter={`url(#f2${id})`} />
      ))}

      {/* Üst beyaz örtü — çok hafif */}
      <rect width="400" height={height} fill="rgba(255,251,240,0.08)" />
    </svg>
  )

  return (
    <main style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: '#EEE4D5', minHeight: '100vh' }}>

      {/* HEADER */}
      <header style={{
        background: 'rgba(255,252,247,0.97)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(200,168,75,0.1)',
        padding: '13px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 2px 20px rgba(150,110,40,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10,
            background: 'linear-gradient(145deg, #D4A84B, #9A6E28)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(180,130,40,0.45), inset 0 1px 0 rgba(255,220,120,0.3)'
          }}>
            <span style={{ color: 'white', fontSize: 13, fontWeight: 800, fontFamily: 'sans-serif', letterSpacing: 1 }}>BB</span>
          </div>
          <div style={{ borderLeft: '1px solid #E8D8B0', paddingLeft: 10, lineHeight: 1.25 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: '#2C1A0A' }}>BURCU</div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: '#2C1A0A' }}>BOZKIR</div>
          </div>
        </div>
        <a href="tel:02124244151" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#7A5A30', textDecoration: 'none', fontFamily: 'sans-serif', lineHeight: 1.4 }}>
          <span style={{ fontSize: 15 }}>📞</span>
          <span>0212-424<br />51 51</span>
        </a>
        <Link href="/booking" style={{
          background: 'linear-gradient(145deg, #D4A84B, #9A6E28)',
          color: 'white', textDecoration: 'none',
          fontSize: 10, fontWeight: 700, letterSpacing: 2,
          padding: '11px 18px', borderRadius: 10,
          fontFamily: 'sans-serif',
          boxShadow: '0 6px 18px rgba(160,110,30,0.5), inset 0 1px 0 rgba(255,220,120,0.25)'
        }}>RANDEVU AL</Link>
      </header>

      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: 340 }}>
        <LuxuryBg height={340} id="hero" />
        <div style={{ position: 'relative', zIndex: 2, padding: '64px 24px 60px', textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 16px', fontSize: 38, fontWeight: 400, lineHeight: 1.2, color: '#2C1A0A', textShadow: '0 2px 20px rgba(255,255,255,0.95)' }}>
            Burcu Bozkir Beauty
          </h1>
          <p style={{ margin: '0 0 32px', fontSize: 16, color: '#7A5020', lineHeight: 1.7, fontStyle: 'italic', maxWidth: 280, marginLeft: 'auto', marginRight: 'auto', textShadow: '0 1px 10px rgba(255,255,255,0.9)' }}>
            Estetik ve güzellikte uzman ellere<br />teslim olun.
          </p>
          <Link href="/booking" style={{
            display: 'inline-block',
            background: 'linear-gradient(145deg, #C8A84B, #9A6E28)',
            color: 'white', textDecoration: 'none',
            fontSize: 11, fontWeight: 700, letterSpacing: 3,
            padding: '14px 34px', borderRadius: 10,
            fontFamily: 'sans-serif',
            boxShadow: '0 8px 28px rgba(140,95,20,0.55), inset 0 1px 0 rgba(255,220,120,0.3)'
          }}>RANDEVU AL</Link>
        </div>
      </section>

      {/* HİZMETLER */}
      {services && services.length > 0 && (
        <section style={{ padding: '36px 20px 12px', background: '#EEE4D5' }}>
          <p style={{ textAlign: 'center', fontSize: 9, letterSpacing: 4, color: '#A07830', margin: '0 0 20px', fontFamily: 'sans-serif' }}>HİZMETLERİMİZ</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(services as Service[]).map((service) => (
              <div key={service.id} style={{
                background: 'rgba(255,252,246,0.9)',
                backdropFilter: 'blur(12px)',
                borderRadius: 18, padding: '20px',
                border: '1px solid rgba(200,168,75,0.15)',
                boxShadow: '0 8px 32px rgba(130,90,25,0.1), 0 2px 8px rgba(130,90,25,0.06), inset 0 1px 0 rgba(255,255,255,0.85)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: 'linear-gradient(145deg, rgba(212,168,75,0.15), rgba(180,130,40,0.22))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: '#C8A030', border: '1px solid rgba(200,160,60,0.2)', boxShadow: 'inset 0 1px 0 rgba(255,220,120,0.25)' }}>✦</div>
                    <div>
                      <p style={{ margin: '0 0 3px', fontSize: 15, fontWeight: 600, color: '#2C1A0A' }}>{service.name}</p>
                      <p style={{ margin: 0, fontSize: 11, color: '#9A8060', fontFamily: 'sans-serif' }}>{service.duration_minutes} dk</p>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 19, color: '#C8A030', fontWeight: 500 }}>₺{service.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 12 }}>
            <Link href="/booking" style={{ display: 'inline-block', background: 'linear-gradient(145deg, #C8A84B, #9A6E28)', color: 'white', textDecoration: 'none', fontSize: 10, fontWeight: 700, letterSpacing: 3, padding: '13px 28px', borderRadius: 10, fontFamily: 'sans-serif', boxShadow: '0 6px 20px rgba(150,100,25,0.45), inset 0 1px 0 rgba(255,220,120,0.25)' }}>RANDEVU AL</Link>
          </div>
        </section>
      )}

      {/* UZMAN ELLER / HİJYENİK ORTAM */}
      <section style={{ padding: '28px 20px' }}>
        <p style={{ textAlign: 'center', fontSize: 9, letterSpacing: 4, color: '#A07830', margin: '0 0 18px', fontFamily: 'sans-serif' }}>UZMAN ELLER / HİJYENİK ORTAM</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            ['Uzman\nEller', '5 yıllık profesyonel deneyim ve sürekli güncellenen teknikler'],
            ['Hijyenik\nOrtam', 'Her işlemde tek kullanımlık malzeme ve steril ekipman'],
          ].map(([title, desc]) => (
            <div key={String(title)} style={{
              background: 'rgba(255,252,246,0.88)',
              backdropFilter: 'blur(16px)',
              borderRadius: 22, padding: '28px 16px',
              textAlign: 'center',
              border: '1px solid rgba(200,168,75,0.13)',
              boxShadow: '0 16px 48px rgba(130,90,25,0.12), 0 4px 16px rgba(130,90,25,0.07), inset 0 1px 0 rgba(255,255,255,0.92), inset 0 -1px 0 rgba(200,160,60,0.06)'
            }}>
              <div style={{ fontSize: 22, color: '#C8A030', marginBottom: 16, filter: 'drop-shadow(0 2px 6px rgba(200,160,40,0.45))' }}>✦</div>
              <h3 style={{ margin: '0 0 14px', fontSize: 20, fontWeight: 500, color: '#C8A030', lineHeight: 1.3, whiteSpace: 'pre-line' }}>{title}</h3>
              <p style={{ margin: 0, fontSize: 11, color: '#8A7050', lineHeight: 1.7, fontFamily: 'sans-serif' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEDEN BİZ */}
      <section style={{ margin: '4px 20px 28px', borderRadius: 22, overflow: 'hidden', position: 'relative', boxShadow: '0 16px 48px rgba(130,90,25,0.14)' }}>
        <LuxuryBg height={220} id="why" />
        <div style={{ position: 'relative', zIndex: 2, padding: '32px 24px' }}>
          <p style={{ margin: '0 0 6px', fontSize: 9, letterSpacing: 4, color: '#9A7020', fontFamily: 'sans-serif' }}>NEDEN BURCU BOZKIR?</p>
          <h2 style={{ margin: '0 0 4px', fontSize: 32, fontWeight: 400, color: '#2C1A0A', textShadow: '0 2px 14px rgba(255,255,255,0.85)' }}>Fark Yaratan</h2>
          <h2 style={{ margin: '0 0 24px', fontSize: 32, fontWeight: 400, color: '#2C1A0A', fontStyle: 'italic', textShadow: '0 2px 14px rgba(255,255,255,0.85)' }}>Detaylar</h2>
          {[
            ['Doğal Sonuç', 'Yüz hatlarınıza özel kişiselleştirilmiş uygulama'],
            ['25.9K Takipçi', "Instagram'da güvenilir ve tanınan marka"],
          ].map(([title, desc]) => (
            <div key={String(title)} style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-start' }}>
              <span style={{ color: '#C8A030', fontSize: 13, marginTop: 3, filter: 'drop-shadow(0 1px 4px rgba(200,160,40,0.55))' }}>✦</span>
              <div>
                <p style={{ margin: '0 0 3px', fontSize: 14, fontWeight: 600, color: '#2C1A0A' }}>{title}</p>
                <p style={{ margin: 0, fontSize: 11, color: '#7A6030', lineHeight: 1.6, fontFamily: 'sans-serif' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* KONUM */}
      <section style={{ margin: '0 20px 32px', borderRadius: 22, overflow: 'hidden', position: 'relative', boxShadow: '0 16px 48px rgba(130,90,25,0.14)' }}>
        <LuxuryBg height={260} id="loc" />
        <div style={{ position: 'relative', zIndex: 2, padding: '32px 24px' }}>
          <p style={{ margin: '0 0 6px', fontSize: 9, letterSpacing: 4, color: '#9A7020', fontFamily: 'sans-serif' }}>BİZİ BULUN</p>
          <h2 style={{ margin: '0 0 20px', fontSize: 40, fontWeight: 400, color: '#2C1A0A', textShadow: '0 2px 16px rgba(255,255,255,0.9)' }}>Neredeyiz?</h2>
          <p style={{ margin: '0 0 3px', fontSize: 17, fontWeight: 600, color: '#2C1A0A' }}>Metropark AVM</p>
          <p style={{ margin: '0 0 2px', fontSize: 13, color: '#7A6030', fontFamily: 'sans-serif' }}>D1-112 · 2. Kat</p>
          <p style={{ margin: '0 0 14px', fontSize: 13, color: '#7A6030', fontFamily: 'sans-serif' }}>Sefaköy - İstanbul</p>
          <a href="tel:02124244151" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, color: '#A87820', textDecoration: 'none', marginBottom: 24, fontFamily: 'sans-serif' }}>
            <span>📞</span> 0212 424 41 51
          </a>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/booking" style={{ background: 'linear-gradient(145deg, #C8A84B, #9A6E28)', color: 'white', textDecoration: 'none', fontSize: 10, fontWeight: 700, letterSpacing: 2, padding: '13px 20px', borderRadius: 10, fontFamily: 'sans-serif', boxShadow: '0 6px 20px rgba(150,100,20,0.5), inset 0 1px 0 rgba(255,220,120,0.25)' }}>RANDEVU AL</Link>
            <a href="https://wa.me/905302223553" target="_blank" style={{ border: '1.5px solid rgba(200,160,60,0.45)', color: '#8A6820', textDecoration: 'none', background: 'rgba(255,252,240,0.75)', backdropFilter: 'blur(8px)', fontSize: 10, fontWeight: 700, letterSpacing: 2, padding: '13px 20px', borderRadius: 10, fontFamily: 'sans-serif', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.85)' }}>WHATSAPP</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'linear-gradient(145deg, #C8A84B, #9A6E28)', padding: '20px 24px', textAlign: 'center', boxShadow: 'inset 0 1px 0 rgba(255,220,120,0.2)' }}>
        <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, letterSpacing: 3, color: 'white', fontFamily: 'sans-serif', textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>BURCU BOZKIR BEAUTY STUDIO</p>
        <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.75)', fontFamily: 'sans-serif' }}>© 2025 · Metropark AVM, Sefaköy İstanbul</p>
      </footer>

    </main>
  )
}