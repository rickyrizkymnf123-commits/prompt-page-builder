import coffeeHero from "@/assets/demos/coffee-hero.jpg";
import coffeeInterior from "@/assets/demos/coffee-interior.jpg";
import coffeeBeans from "@/assets/demos/coffee-beans.jpg";

const Demo1 = () => (
  <div className="min-h-screen" style={{ background: "#0a0a0a", color: "#fff", fontFamily: "'Segoe UI', sans-serif" }}>
    {/* Navbar */}
    <nav className="flex items-center justify-between px-6 md:px-16 py-6 border-b border-white/5">
      <span className="text-2xl font-black tracking-tight">KOPI<span style={{ color: "#c8a97e" }}>NUSANTARA</span></span>
      <div className="hidden md:flex gap-8 text-sm text-white/40 font-medium">
        <span>Menu</span><span>Tentang</span><span>Lokasi</span><span>Reservasi</span>
      </div>
      <button style={{ background: "#c8a97e" }} className="text-black px-6 py-2.5 rounded-full text-sm font-bold">Pesan Meja</button>
    </nav>

    {/* Hero */}
    <section className="relative py-24 md:py-40 px-6 text-center overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 50% 0%, #c8a97e 0%, transparent 60%)" }} />
      <p className="text-sm uppercase tracking-[0.3em] mb-6 relative z-10" style={{ color: "#c8a97e" }}>☕ Specialty Coffee Since 2018</p>
      <h1 className="text-5xl md:text-8xl font-black leading-[0.9] max-w-4xl mx-auto mb-8 relative z-10">
        RASAKAN<br /><span style={{ color: "#c8a97e" }}>KENIKMATAN</span><br />SEJATI
      </h1>
      <p className="text-white/40 text-lg max-w-md mx-auto mb-10 relative z-10">Single origin pilihan dari petani lokal, disangrai dengan cinta di roastery kami.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
        <button style={{ background: "#c8a97e" }} className="text-black px-8 py-4 rounded-full text-base font-bold">Lihat Menu</button>
        <button className="border border-white/20 px-8 py-4 rounded-full text-base">Virtual Tour ▶</button>
      </div>
    </section>

    {/* Hero Image */}
    <section className="px-6 pb-16">
      <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden">
        <img src={coffeeHero} alt="Specialty coffee latte art" className="w-full h-[300px] md:h-[500px] object-cover" />
      </div>
    </section>

    {/* Menu */}
    <section className="py-20 px-6" style={{ background: "#111" }}>
      <p className="text-center text-sm uppercase tracking-[0.2em] mb-3" style={{ color: "#c8a97e" }}>Our Selection</p>
      <h2 className="text-3xl md:text-5xl font-black text-center mb-16">MENU PILIHAN</h2>
      <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {[
          { name: "Espresso Toraja", price: "32K", tag: "BEST SELLER", desc: "Bold & earthy dari Sulawesi" },
          { name: "V60 Gayo", price: "38K", tag: "SIGNATURE", desc: "Fruity notes, clean finish" },
          { name: "Cappuccino Oat", price: "42K", tag: "NEW", desc: "Creamy oat milk latte art" },
          { name: "Affogato Gelato", price: "45K", tag: "DESSERT", desc: "Espresso meets vanilla gelato" },
        ].map((item, i) => (
          <div key={i} className="border border-white/10 rounded-3xl p-6 hover:border-[#c8a97e]/40 transition-colors group">
            <div className="w-full aspect-square rounded-2xl mb-4 flex items-center justify-center text-5xl" style={{ background: "#1a1a1a" }}>☕</div>
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: "#c8a97e20", color: "#c8a97e" }}>{item.tag}</span>
            <h3 className="font-bold text-lg mt-3 mb-1">{item.name}</h3>
            <p className="text-white/30 text-sm mb-3">{item.desc}</p>
            <p className="text-xl font-black" style={{ color: "#c8a97e" }}>Rp {item.price}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Interior Gallery */}
    <section className="py-20 px-6">
      <p className="text-center text-sm uppercase tracking-[0.2em] mb-3" style={{ color: "#c8a97e" }}>Our Space</p>
      <h2 className="text-3xl md:text-4xl font-black text-center mb-12">SUASANA YANG MEMANJAKAN</h2>
      <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
        <div className="rounded-2xl overflow-hidden">
          <img src={coffeeInterior} alt="Coffee shop interior" className="w-full h-[250px] md:h-[350px] object-cover hover:scale-105 transition-transform duration-700" />
        </div>
        <div className="rounded-2xl overflow-hidden">
          <img src={coffeeBeans} alt="Coffee beans roasting" className="w-full h-[250px] md:h-[350px] object-cover hover:scale-105 transition-transform duration-700" />
        </div>
      </div>
    </section>

    {/* Story */}
    <section className="py-20 px-6" style={{ background: "#111" }}>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] mb-3" style={{ color: "#c8a97e" }}>Our Story</p>
          <h2 className="text-3xl md:text-4xl font-black mb-6">DARI KEBUN KE CANGKIR</h2>
          <p className="text-white/40 leading-relaxed mb-6">Kami bekerja langsung dengan petani kopi di Toraja, Gayo, dan Flores. Setiap biji dipilih tangan, disangrai dalam batch kecil untuk memastikan kesegaran optimal.</p>
          <p className="text-white/40 leading-relaxed mb-8">Proses roasting kami menggunakan mesin Probat Jerman dengan kontrol suhu presisi, menghasilkan profil rasa yang konsisten dan menonjolkan karakter unik dari setiap origin.</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { val: "7+", label: "Tahun" },
              { val: "15", label: "Origin" },
              { val: "4.9", label: "Rating" },
            ].map((s, i) => (
              <div key={i} className="text-center p-4 rounded-2xl" style={{ background: "#1a1a1a" }}>
                <p className="text-2xl font-black" style={{ color: "#c8a97e" }}>{s.val}</p>
                <p className="text-xs text-white/30">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden">
          <img src={coffeeHero} alt="Our coffee story" className="w-full h-[400px] object-cover" />
        </div>
      </div>
    </section>

    {/* Full Menu */}
    <section className="py-20 px-6">
      <h2 className="text-3xl font-black text-center mb-12">FULL MENU</h2>
      <div className="max-w-3xl mx-auto space-y-0">
        {[
          { cat: "ESPRESSO", items: [{ name: "Single Espresso", price: "22K" }, { name: "Double Espresso", price: "28K" }, { name: "Americano", price: "28K" }, { name: "Long Black", price: "30K" }] },
          { cat: "MILK BASED", items: [{ name: "Cappuccino", price: "35K" }, { name: "Flat White", price: "38K" }, { name: "Café Latte", price: "38K" }, { name: "Piccolo Latte", price: "30K" }] },
          { cat: "MANUAL BREW", items: [{ name: "V60 Drip", price: "38K" }, { name: "Chemex", price: "42K" }, { name: "Aeropress", price: "35K" }, { name: "Cold Drip", price: "40K" }] },
          { cat: "NON-COFFEE", items: [{ name: "Matcha Latte", price: "38K" }, { name: "Chocolate", price: "35K" }, { name: "Fresh Juice", price: "30K" }, { name: "Iced Tea", price: "25K" }] },
        ].map((section, i) => (
          <div key={i} className="mb-10">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-4 pb-2 border-b border-white/10" style={{ color: "#c8a97e" }}>{section.cat}</h3>
            {section.items.map((item, j) => (
              <div key={j} className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-white/70">{item.name}</span>
                <span className="font-bold" style={{ color: "#c8a97e" }}>Rp {item.price}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>

    {/* Testimonials */}
    <section className="py-20 px-6" style={{ background: "#111" }}>
      <h2 className="text-3xl font-black text-center mb-12">APA KATA MEREKA</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          { name: "Sarah K.", text: "Kopi terbaik di Jakarta! V60 Gayo-nya luar biasa, clean dan fruity. Tempatnya juga nyaman banget buat kerja.", rating: 5 },
          { name: "Budi W.", text: "Selalu jadi tempat meeting favorit. Espresso-nya konsisten enak, barista-nya ramah dan knowledgeable.", rating: 5 },
          { name: "Anita R.", text: "Interior-nya estetik, kopi-nya juara. Cappuccino oat milk mereka bikin ketagihan. Highly recommended!", rating: 5 },
        ].map((t, i) => (
          <div key={i} className="p-6 rounded-2xl border border-white/5" style={{ background: "#1a1a1a" }}>
            <div className="flex gap-1 mb-4">{[...Array(t.rating)].map((_, j) => <span key={j} className="text-yellow-500">★</span>)}</div>
            <p className="text-white/50 mb-4 italic text-sm leading-relaxed">"{t.text}"</p>
            <p className="font-bold text-sm" style={{ color: "#c8a97e" }}>— {t.name}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Location */}
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] mb-3" style={{ color: "#c8a97e" }}>Visit Us</p>
          <h2 className="text-3xl font-black mb-6">LOKASI KAMI</h2>
          <div className="space-y-6">
            {[
              { loc: "Senopati", addr: "Jl. Senopati No. 42, Jakarta Selatan", hours: "07:00 — 22:00" },
              { loc: "Kemang", addr: "Jl. Kemang Raya No. 18, Jakarta Selatan", hours: "08:00 — 23:00" },
              { loc: "PIK", addr: "Pantai Indah Kapuk Blok A2 No. 5", hours: "07:00 — 21:00" },
            ].map((l, i) => (
              <div key={i} className="p-5 rounded-2xl border border-white/5" style={{ background: "#111" }}>
                <h3 className="font-bold mb-1" style={{ color: "#c8a97e" }}>{l.loc}</h3>
                <p className="text-white/40 text-sm">{l.addr}</p>
                <p className="text-white/30 text-xs mt-1">🕐 {l.hours}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden">
          <img src={coffeeInterior} alt="Our café" className="w-full h-full object-cover min-h-[300px]" />
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-24 px-6 text-center" style={{ background: "#111" }}>
      <h2 className="text-3xl md:text-5xl font-black mb-6">RESERVASI<br /><span style={{ color: "#c8a97e" }}>SEKARANG</span></h2>
      <p className="text-white/40 mb-8 max-w-md mx-auto">Nikmati pengalaman kopi terbaik bersama kami. Reservasi gratis, tanpa minimum order.</p>
      <button style={{ background: "#c8a97e" }} className="text-black px-10 py-4 rounded-full text-lg font-bold">Pesan Meja →</button>
      <p className="text-white/20 text-sm mt-4">📞 +62 812-3456-7890 • reservasi@kopinusantara.id</p>
    </section>

    <footer className="py-12 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-8 text-sm text-white/30">
        <div>
          <p className="font-bold text-white mb-3">KOPI<span style={{ color: "#c8a97e" }}>NUSANTARA</span></p>
          <p>Specialty coffee roasters since 2018.</p>
        </div>
        <div>
          <p className="font-bold text-white/60 mb-3">Menu</p>
          <p>Espresso</p><p>Manual Brew</p><p>Non-Coffee</p><p>Food</p>
        </div>
        <div>
          <p className="font-bold text-white/60 mb-3">Info</p>
          <p>Tentang Kami</p><p>Karir</p><p>Blog</p><p>Franchise</p>
        </div>
        <div>
          <p className="font-bold text-white/60 mb-3">Social</p>
          <p>Instagram</p><p>TikTok</p><p>YouTube</p>
        </div>
      </div>
      <p className="text-center text-white/10 text-xs mt-8">© 2024 KopiNusantara. Generated by LP Builder.</p>
    </footer>
  </div>
);
export default Demo1;
