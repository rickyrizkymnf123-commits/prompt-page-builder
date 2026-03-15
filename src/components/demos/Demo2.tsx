import skincareHero from "@/assets/demos/skincare-hero.jpg";

const Demo2 = () => (
  <div className="min-h-screen" style={{ background: "#f8f5f0", color: "#2d2d2d", fontFamily: "'Georgia', serif" }}>
    {/* Navbar */}
    <nav className="flex items-center justify-between px-6 md:px-16 py-6">
      <span className="text-xl font-bold italic" style={{ color: "#8b6f47" }}>Lumière Beauty</span>
      <div className="hidden md:flex gap-8 text-sm" style={{ color: "#8b6f4780" }}>
        <span>Collections</span><span>Ingredients</span><span>Journal</span><span>About</span>
      </div>
      <button className="px-6 py-2.5 rounded-none text-sm font-semibold border-2" style={{ borderColor: "#8b6f47", color: "#8b6f47" }}>SHOP</button>
    </nav>

    {/* Hero */}
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] mb-6" style={{ color: "#8b6f47" }}>— The New Collection</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] mb-6" style={{ fontFamily: "'Georgia', serif" }}>
            Timeless<br />Elegance,<br /><span style={{ color: "#8b6f47" }}>Natural</span> Glow
          </h1>
          <p className="text-lg mb-8" style={{ color: "#2d2d2d80" }}>Skincare mewah berbahan alami Indonesia. Formulasi eksklusif untuk kulit bercahaya sepanjang hari.</p>
          <button className="px-10 py-4 text-white text-sm font-semibold tracking-widest uppercase" style={{ background: "#8b6f47" }}>Discover More</button>
        </div>
        <div className="rounded-none overflow-hidden">
          <img src={skincareHero} alt="Luxury skincare products" className="w-full h-[400px] md:h-[500px] object-cover" />
        </div>
      </div>
    </section>

    {/* Bestsellers */}
    <section className="py-20 px-6" style={{ background: "#fff" }}>
      <div className="max-w-6xl mx-auto">
        <p className="text-xs uppercase tracking-[0.4em] mb-3 text-center" style={{ color: "#8b6f47" }}>— Bestsellers</p>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Curated for You</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Rose Petal Serum", price: "Rp 389.000", sub: "30ml — Anti-Aging", color: "#fce4ec" },
            { name: "Jasmine Night Cream", price: "Rp 425.000", sub: "50ml — Hydrating", color: "#e8ddd0" },
            { name: "Golden Elixir Oil", price: "Rp 520.000", sub: "15ml — Brightening", color: "#f0ebe3" },
          ].map((p, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[3/4] mb-6 flex items-center justify-center text-6xl transition-transform group-hover:scale-[1.02] rounded-sm overflow-hidden">
                <img src={skincareHero} alt={p.name} className="w-full h-full object-cover" style={{ filter: `hue-rotate(${i * 30}deg)` }} />
              </div>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#8b6f47" }}>{p.sub}</p>
              <h3 className="text-xl font-bold mb-1">{p.name}</h3>
              <p className="font-semibold" style={{ color: "#8b6f47" }}>{p.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Routine */}
    <section className="py-20 px-6" style={{ background: "#f8f5f0" }}>
      <div className="max-w-5xl mx-auto">
        <p className="text-xs uppercase tracking-[0.4em] mb-3 text-center" style={{ color: "#8b6f47" }}>— Daily Routine</p>
        <h2 className="text-3xl font-bold text-center mb-16">Your 4-Step Ritual</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: "01", name: "Cleanse", desc: "Bersihkan wajah dengan Gentle Foam Cleanser" },
            { step: "02", name: "Tone", desc: "Seimbangkan pH kulit dengan Rose Water Toner" },
            { step: "03", name: "Treat", desc: "Aplikasikan serum sesuai kebutuhan kulit" },
            { step: "04", name: "Moisturize", desc: "Kunci kelembaban dengan cream pilihan" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-sm font-bold" style={{ background: "#8b6f4715", color: "#8b6f47" }}>{s.step}</div>
              <h3 className="font-bold text-lg mb-2">{s.name}</h3>
              <p className="text-sm" style={{ color: "#2d2d2d60" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Ingredients */}
    <section className="py-20 px-6" style={{ background: "#fff" }}>
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.4em] mb-3" style={{ color: "#8b6f47" }}>— Philosophy</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Pure Ingredients, Pure Results</h2>
        <p className="text-lg mb-12" style={{ color: "#2d2d2d60" }}>Setiap produk menggunakan bahan alami pilihan dari seluruh Indonesia</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { name: "Rosehip Oil", from: "Flores", icon: "🌺" },
            { name: "Jasmine Extract", from: "Jawa Barat", icon: "🌸" },
            { name: "Turmeric", from: "Bali", icon: "🫚" },
            { name: "Coconut Oil", from: "Sulawesi", icon: "🥥" },
          ].map((ing, i) => (
            <div key={i} className="text-center p-6 rounded-xl" style={{ background: "#f8f5f0" }}>
              <div className="text-4xl mb-3">{ing.icon}</div>
              <p className="font-bold text-sm">{ing.name}</p>
              <p className="text-xs" style={{ color: "#8b6f4780" }}>{ing.from}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Full Range */}
    <section className="py-20 px-6" style={{ background: "#f8f5f0" }}>
      <h2 className="text-3xl font-bold text-center mb-12">Complete Range</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {[
          { name: "Gentle Cleanser", price: "Rp 189K", size: "120ml" },
          { name: "Rose Water Toner", price: "Rp 210K", size: "150ml" },
          { name: "Vitamin C Serum", price: "Rp 349K", size: "30ml" },
          { name: "Eye Cream", price: "Rp 299K", size: "15ml" },
          { name: "Face Mask", price: "Rp 89K", size: "1pc" },
          { name: "Lip Treatment", price: "Rp 159K", size: "10ml" },
          { name: "Body Lotion", price: "Rp 259K", size: "200ml" },
          { name: "Gift Set", price: "Rp 899K", size: "5 items" },
        ].map((p, i) => (
          <div key={i} className="bg-white p-5 group cursor-pointer hover:shadow-lg transition-shadow">
            <div className="aspect-square mb-4 flex items-center justify-center text-4xl" style={{ background: "#f8f5f0" }}>🧴</div>
            <p className="font-bold text-sm mb-1">{p.name}</p>
            <p className="text-xs mb-2" style={{ color: "#8b6f4780" }}>{p.size}</p>
            <p className="font-bold" style={{ color: "#8b6f47" }}>{p.price}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Testimonials */}
    <section className="py-20 px-6" style={{ background: "#fff" }}>
      <h2 className="text-3xl font-bold text-center mb-12">What They Say</h2>
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {[
          { name: "Amelia R.", role: "Beauty Influencer", text: "Setelah 2 minggu pakai Rose Petal Serum, kulit saya terasa jauh lebih lembut dan glowing. Ini skincare terbaik yang pernah saya coba." },
          { name: "Diana S.", role: "Dermatologist", text: "Formulasinya bagus, ingredients yang dipilih memang proven effective. Saya rekomendasikan ke pasien saya." },
          { name: "Lisa T.", role: "Model", text: "Satu-satunya brand lokal yang saya pakai untuk daily routine. Hasilnya nyata dan packaging-nya cantik." },
          { name: "Rina K.", role: "Beauty Blogger", text: "Night cream-nya juara! Bangun tidur kulit terasa supple dan kenyal. Worth every penny." },
        ].map((t, i) => (
          <div key={i} className="p-6 rounded-xl" style={{ background: "#f8f5f0" }}>
            <div className="text-3xl mb-4" style={{ color: "#8b6f47" }}>"</div>
            <p className="italic mb-4 leading-relaxed" style={{ color: "#2d2d2d90" }}>{t.text}</p>
            <p className="font-bold">{t.name}</p>
            <p className="text-xs" style={{ color: "#8b6f47" }}>{t.role}</p>
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 px-6 text-center" style={{ background: "#8b6f47", color: "#fff" }}>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Begin Your Beauty Journey</h2>
      <p className="mb-8 opacity-70">Free shipping untuk pembelian pertama • Garansi 30 hari</p>
      <button className="px-10 py-4 text-sm font-semibold tracking-widest uppercase" style={{ background: "#fff", color: "#8b6f47" }}>Shop Now →</button>
    </section>

    <footer className="py-12 px-6" style={{ background: "#f8f5f0" }}>
      <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-8 text-sm" style={{ color: "#8b6f4760" }}>
        <div><p className="font-bold italic text-lg mb-3" style={{ color: "#8b6f47" }}>Lumière Beauty</p><p>Premium Indonesian skincare since 2020.</p></div>
        <div><p className="font-bold mb-3" style={{ color: "#8b6f47" }}>Shop</p><p>Serums</p><p>Creams</p><p>Cleansers</p><p>Sets</p></div>
        <div><p className="font-bold mb-3" style={{ color: "#8b6f47" }}>Help</p><p>FAQ</p><p>Shipping</p><p>Returns</p></div>
        <div><p className="font-bold mb-3" style={{ color: "#8b6f47" }}>Follow</p><p>Instagram</p><p>TikTok</p><p>YouTube</p></div>
      </div>
      <p className="text-center text-xs mt-8" style={{ color: "#8b6f4730" }}>© 2024 Lumière Beauty. Generated by LP Builder.</p>
    </footer>
  </div>
);
export default Demo2;
