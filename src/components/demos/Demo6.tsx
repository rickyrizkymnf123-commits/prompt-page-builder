import weddingHero from "@/assets/demos/wedding-hero.jpg";

const Demo6 = () => (
  <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #fdf4ff, #fae8ff, #f5d0fe)", color: "#1a1a2e", fontFamily: "'Segoe UI', sans-serif" }}>
    <nav className="flex items-center justify-between px-6 md:px-12 py-5">
      <span className="text-xl font-black" style={{ color: "#a855f7" }}>💜 InviteKu</span>
      <div className="hidden md:flex gap-6 text-sm" style={{ color: "#a855f780" }}><span>Template</span><span>Fitur</span><span>Harga</span><span>Galeri</span></div>
      <button className="px-5 py-2.5 rounded-full text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>Buat Undangan</button>
    </nav>

    {/* Hero */}
    <section className="text-center py-16 md:py-24 px-6">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6" style={{ background: "#a855f715", color: "#a855f7" }}>💒 #1 Wedding Invitation Platform</div>
      <h1 className="text-4xl md:text-6xl font-black leading-tight max-w-3xl mx-auto mb-6" style={{ color: "#581c87" }}>Undangan Digital<br /><span style={{ color: "#a855f7" }}>Elegan & Modern</span></h1>
      <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: "#581c8760" }}>Buat undangan pernikahan digital yang cantik dalam 5 menit. 50+ template premium, musik, RSVP, dan gift.</p>
      <button className="px-10 py-4 rounded-full text-lg font-bold text-white shadow-lg" style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)", boxShadow: "0 15px 40px #a855f730" }}>Mulai Gratis ✨</button>
    </section>

    {/* Hero Image */}
    <section className="px-6 pb-16">
      <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-xl">
        <img src={weddingHero} alt="Beautiful event setup" className="w-full h-[300px] md:h-[450px] object-cover" />
      </div>
    </section>

    {/* Templates */}
    <section className="py-16 px-6" style={{ background: "#fff5" }}>
      <h2 className="text-3xl font-black text-center mb-4" style={{ color: "#581c87" }}>50+ Template Premium</h2>
      <p className="text-center mb-12" style={{ color: "#a855f780" }}>Pilih template sesuai tema pernikahanmu</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {[
          { name: "Romantic Rose", style: "Floral", color: "#ffe4e6" },
          { name: "Golden Elegance", style: "Classic", color: "#fef3c7" },
          { name: "Modern Minimal", style: "Clean", color: "#e0e7ff" },
          { name: "Garden Party", style: "Nature", color: "#dcfce7" },
          { name: "Rustic Charm", style: "Vintage", color: "#fde68a" },
          { name: "Royal Blue", style: "Formal", color: "#dbeafe" },
          { name: "Tropical Vibes", style: "Beach", color: "#ccfbf1" },
          { name: "Cherry Blossom", style: "Japanese", color: "#fce7f3" },
        ].map((t, i) => (
          <div key={i} className="rounded-2xl overflow-hidden shadow-sm border border-white/50 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="aspect-[3/4] flex items-center justify-center text-4xl relative" style={{ background: t.color }}>
              <img src={weddingHero} alt={t.name} className="absolute inset-0 w-full h-full object-cover opacity-30" />
              <span className="relative z-10">💐</span>
            </div>
            <div className="p-3 bg-white">
              <p className="font-bold text-sm" style={{ color: "#581c87" }}>{t.name}</p>
              <p className="text-xs" style={{ color: "#a855f780" }}>{t.style}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Features */}
    <section className="py-16 px-6">
      <h2 className="text-3xl font-black text-center mb-12" style={{ color: "#581c87" }}>Fitur Lengkap</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          { icon: "🎵", title: "Background Music", desc: "Pilih dari 20+ lagu romantis atau upload lagu sendiri untuk undanganmu" },
          { icon: "📋", title: "RSVP & Tamu", desc: "Kelola daftar tamu, konfirmasi kehadiran, dan jumlah undangan otomatis" },
          { icon: "🎁", title: "Digital Gift", desc: "Terima amplop digital langsung di undangan. Support bank transfer & e-wallet" },
          { icon: "📍", title: "Peta Lokasi", desc: "Google Maps terintegrasi ke lokasi acara. Tamu bisa langsung navigasi" },
          { icon: "⏰", title: "Countdown Timer", desc: "Hitung mundur otomatis ke hari H yang membuat tamu excited" },
          { icon: "📸", title: "Gallery Foto", desc: "Tampilkan foto prewedding yang indah dengan slider & lightbox" },
          { icon: "💌", title: "Custom Wish", desc: "Tamu bisa kirim ucapan dan doa langsung di undangan" },
          { icon: "🔗", title: "Share Link", desc: "Kirim undangan via WhatsApp, SMS, atau social media dengan 1 klik" },
          { icon: "📊", title: "Dashboard", desc: "Monitor statistik undangan — siapa yang buka, RSVP, dan kirim gift" },
        ].map((f, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="text-2xl mb-3">{f.icon}</div>
            <h3 className="font-bold text-sm mb-1" style={{ color: "#581c87" }}>{f.title}</h3>
            <p className="text-xs leading-relaxed" style={{ color: "#a855f780" }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Testimonials */}
    <section className="py-16 px-6" style={{ background: "#fff5" }}>
      <h2 className="text-3xl font-black text-center mb-12" style={{ color: "#581c87" }}>Cerita Pasangan Bahagia</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          { name: "Andi & Sarah", text: "Template-nya cantik banget! Tamu-tamu pada kagum dan nanya ini bikin dimana. Highly recommended!" },
          { name: "Reza & Maya", text: "Fitur RSVP-nya sangat membantu. Kami bisa plan seating arrangement dengan mudah." },
          { name: "Dimas & Putri", text: "Digital gift-nya bikin praktis. Tidak perlu ribet terima amplop fisik. Modern dan elegan!" },
        ].map((t, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex gap-1 mb-3">{[...Array(5)].map((_, j) => <span key={j}>⭐</span>)}</div>
            <p className="italic text-sm mb-4" style={{ color: "#581c8790" }}>"{t.text}"</p>
            <p className="font-bold text-sm" style={{ color: "#a855f7" }}>💑 {t.name}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Pricing */}
    <section className="py-16 px-6 text-center">
      <h2 className="text-3xl font-black mb-10" style={{ color: "#581c87" }}>Harga Spesial</h2>
      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <div className="rounded-3xl p-8 shadow-sm border border-purple-200 bg-white">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#a855f7" }}>BASIC</p>
          <p className="text-3xl font-black mb-4" style={{ color: "#581c87" }}>Rp 49.000</p>
          <ul className="text-sm space-y-2 mb-6 text-left" style={{ color: "#581c8790" }}>
            {["10 Template", "RSVP Online", "Gallery 10 Foto", "Background Music", "Share Link"].map((f, i) => (
              <li key={i} className="flex items-center gap-2"><span style={{ color: "#a855f7" }}>✓</span> {f}</li>
            ))}
          </ul>
          <button className="w-full py-3 rounded-full font-bold text-sm border-2" style={{ borderColor: "#a855f7", color: "#a855f7" }}>Pilih Basic</button>
        </div>
        <div className="rounded-3xl p-8 shadow-xl border-2 border-purple-400 bg-white relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>BEST VALUE</div>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#a855f7" }}>PREMIUM</p>
          <div className="mb-4">
            <span className="text-sm line-through text-gray-400">Rp 150.000</span>
            <p className="text-3xl font-black" style={{ color: "#581c87" }}>Rp 75.000</p>
          </div>
          <ul className="text-sm space-y-2 mb-6 text-left" style={{ color: "#581c8790" }}>
            {["50+ Template Premium", "Custom Domain", "Unlimited Tamu", "RSVP + Digital Gift", "Background Music", "Gallery Unlimited", "Countdown Timer", "Support 24/7"].map((f, i) => (
              <li key={i} className="flex items-center gap-2"><span style={{ color: "#a855f7" }}>✓</span> {f}</li>
            ))}
          </ul>
          <button className="w-full py-3 rounded-full font-bold text-sm text-white" style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>Pilih Premium →</button>
        </div>
      </div>
    </section>

    <footer className="py-12 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-black text-xl mb-3" style={{ color: "#a855f7" }}>💜 InviteKu</p>
        <p className="text-sm mb-6" style={{ color: "#a855f760" }}>Platform undangan digital #1 Indonesia</p>
        <p className="text-xs" style={{ color: "#a855f740" }}>© 2024 InviteKu. Generated by LP Builder.</p>
      </div>
    </footer>
  </div>
);
export default Demo6;
