import studioImg from "@/assets/demos/photography-studio.jpg";
import weddingImg from "@/assets/demos/photography-wedding.jpg";
import landscapeImg from "@/assets/demos/photography-landscape.jpg";

const Demo4 = () => (
  <div className="min-h-screen" style={{ background: "#111", color: "#fff", fontFamily: "'Helvetica Neue', sans-serif" }}>
    {/* Navbar */}
    <nav className="flex items-center justify-between px-6 md:px-12 py-5">
      <span className="text-xl font-light tracking-[0.3em] uppercase">Lens Studio</span>
      <div className="hidden md:flex gap-6 text-sm text-white/50 tracking-wider">
        <span>Portfolio</span><span>About</span><span>Services</span><span>Contact</span>
      </div>
      <button className="border border-white/30 px-5 py-2 text-sm tracking-widest uppercase">Book Now</button>
    </nav>

    {/* Hero */}
    <section className="relative">
      <div className="aspect-[21/9] w-full overflow-hidden">
        <img src={studioImg} alt="Photography Studio" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/60 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-12 md:pb-16">
        <h1 className="text-5xl md:text-8xl font-extralight tracking-tight max-w-4xl mb-4">Capturing <em className="font-serif italic text-amber-300">Moments</em></h1>
        <p className="text-white/40 text-lg max-w-lg mb-8">Professional photography for weddings, events, and commercial projects across Indonesia.</p>
        <button className="border border-white/30 px-8 py-3 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors">View Gallery</button>
      </div>
    </section>

    {/* Gallery Grid */}
    <section className="px-6 py-20">
      <h2 className="text-2xl font-light tracking-wider text-center mb-12">Selected Works</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-5xl mx-auto">
        <div className="aspect-[3/4] rounded-sm overflow-hidden">
          <img src={weddingImg} alt="Wedding Photography" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="aspect-[3/4] rounded-sm overflow-hidden">
          <img src={landscapeImg} alt="Landscape Photography" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="aspect-[3/4] rounded-sm overflow-hidden">
          <img src={studioImg} alt="Studio Photography" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        </div>
      </div>
    </section>

    {/* Services */}
    <section className="py-16 px-6 border-t border-white/10">
      <h2 className="text-2xl font-light tracking-wider text-center mb-12">Our Services</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {[
          { icon: "💒", title: "Wedding", desc: "Dokumentasi lengkap hari bahagia Anda. Dari persiapan hingga resepsi, setiap momen berharga diabadikan." },
          { icon: "🏢", title: "Commercial", desc: "Product photography, corporate headshots, dan konten visual untuk brand Anda yang memukau." },
          { icon: "🌄", title: "Landscape & Travel", desc: "Fine art prints dari landscape Indonesia yang menakjubkan. Cocok untuk dekorasi dan koleksi." },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <div className="text-4xl mb-4">{s.icon}</div>
            <h3 className="text-lg font-light tracking-wider mb-3 text-amber-300">{s.title}</h3>
            <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* About */}
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="aspect-square rounded-sm overflow-hidden">
          <img src={landscapeImg} alt="About Lens Studio" className="w-full h-full object-cover" />
        </div>
        <div>
          <span className="text-amber-300 text-sm tracking-[0.3em] uppercase mb-4 block">About The Artist</span>
          <h2 className="text-3xl font-light mb-6">12 Tahun Mengabadikan Keindahan</h2>
          <p className="text-white/40 leading-relaxed mb-4">Lens Studio didirikan tahun 2012 oleh fotografer profesional yang memiliki passion mendalam terhadap keindahan Indonesia.</p>
          <p className="text-white/40 leading-relaxed mb-6">Dengan pengalaman lebih dari satu dekade, kami telah menangani lebih dari 500 project mulai dari intimate wedding hingga large-scale commercial campaign.</p>
          <div className="flex gap-8">
            <div><p className="text-3xl font-light text-amber-300">500+</p><p className="text-white/30 text-xs mt-1">Projects</p></div>
            <div><p className="text-3xl font-light text-amber-300">12</p><p className="text-white/30 text-xs mt-1">Years</p></div>
            <div><p className="text-3xl font-light text-amber-300">50+</p><p className="text-white/30 text-xs mt-1">Awards</p></div>
          </div>
        </div>
      </div>
    </section>

    {/* Process */}
    <section className="py-16 px-6 border-t border-white/10">
      <h2 className="text-2xl font-light tracking-wider text-center mb-12">How We Work</h2>
      <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {[
          { num: "01", title: "Konsultasi", desc: "Diskusi konsep, lokasi, dan mood yang diinginkan." },
          { num: "02", title: "Planning", desc: "Persiapan detail timeline, equipment, dan crew." },
          { num: "03", title: "Shooting Day", desc: "Eksekusi profesional dengan perhatian pada setiap detail." },
          { num: "04", title: "Delivery", desc: "Editing premium dan delivery dalam 14 hari kerja." },
        ].map((p, i) => (
          <div key={i} className="text-center">
            <span className="text-4xl font-extralight text-amber-300/50">{p.num}</span>
            <h3 className="font-light tracking-wider mt-2 mb-2">{p.title}</h3>
            <p className="text-xs text-white/40">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Featured Wedding */}
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-light tracking-wider text-center mb-12">Featured: Wedding Photography</h2>
        <div className="rounded-sm overflow-hidden">
          <img src={weddingImg} alt="Featured Wedding" className="w-full h-[400px] object-cover" />
        </div>
        <p className="text-center text-white/30 text-sm mt-4 italic">"Every love story is beautiful, but ours is my favorite." — Wedding at Bali, 2024</p>
      </div>
    </section>

    {/* Packages */}
    <section className="py-16 px-6 border-t border-white/10">
      <h2 className="text-2xl font-light tracking-wider text-center mb-12">Packages</h2>
      <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {[
          { name: "Basic", price: "Rp 2.5 Juta", features: ["50 Edited Photos", "2 Hours Session", "1 Location", "Online Gallery", "Print-Ready Files"] },
          { name: "Premium", price: "Rp 5 Juta", features: ["150 Edited Photos", "5 Hours Session", "3 Locations", "Drone Shots", "Behind the Scenes", "Photo Book 20 pages"] },
          { name: "Exclusive", price: "Rp 10 Juta", features: ["Unlimited Photos", "Full Day Coverage", "Unlimited Locations", "Drone + Video Highlight", "Premium Photo Album", "2 Photographers", "Same Day Edit"] },
        ].map((p, i) => (
          <div key={i} className={`border ${i===1 ? 'border-amber-400 bg-amber-400/5' : 'border-white/10'} rounded-sm p-6`}>
            {i===1 && <span className="text-xs bg-amber-400 text-black px-3 py-1 tracking-wider uppercase font-bold mb-4 inline-block">Most Popular</span>}
            <h3 className="text-lg font-light tracking-wider mb-2">{p.name}</h3>
            <p className="text-3xl font-bold text-amber-300 mb-6">{p.price}</p>
            <ul className="space-y-3 text-sm text-white/50">
              {p.features.map((f, j) => <li key={j} className="flex items-center gap-2"><span className="text-amber-300">✓</span> {f}</li>)}
            </ul>
            <button className={`mt-6 w-full py-3 text-sm tracking-widest uppercase ${i===1 ? 'bg-amber-400 text-black' : 'border border-white/20 text-white/70'}`}>Choose Plan</button>
          </div>
        ))}
      </div>
    </section>

    {/* Testimonials */}
    <section className="py-16 px-6">
      <h2 className="text-2xl font-light tracking-wider text-center mb-12">Client Reviews</h2>
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {[
          { name: "Anita & Reza", event: "Wedding", text: "Hasil foto-nya beyond expectation. Setiap momen ditangkap dengan sempurna. Team-nya profesional dan sangat detail." },
          { name: "PT Global Tech", event: "Corporate", text: "Product photography terbaik. Hasil foto meningkatkan conversion rate online store kami 40%. Highly recommended!" },
        ].map((t, i) => (
          <div key={i} className="border border-white/10 rounded-sm p-6">
            <p className="text-sm text-white/50 italic mb-4">"{t.text}"</p>
            <p className="font-light text-amber-300">{t.name}</p>
            <p className="text-xs text-white/30">{t.event}</p>
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 px-6 text-center border-t border-white/10">
      <h2 className="text-3xl md:text-4xl font-extralight mb-4">Let's Create <em className="font-serif italic text-amber-300">Together</em></h2>
      <p className="text-white/40 mb-8 max-w-md mx-auto">Ceritakan project Anda. Kami siap menghadirkan visual yang memukau.</p>
      <button className="border border-amber-400 text-amber-300 px-10 py-4 text-sm tracking-widest uppercase hover:bg-amber-400 hover:text-black transition-colors">Get in Touch</button>
    </section>

    <footer className="text-center py-8 text-white/20 text-sm">© 2024 Lens Studio. Generated by LP Builder.</footer>
  </div>
);
export default Demo4;
