import coffeeHero from "@/assets/demos/coffee-hero.jpg";
import coffeeInterior from "@/assets/demos/coffee-shop-interior.jpg";
import coffeeLatte from "@/assets/demos/coffee-latte.jpg";
import coffeeBeans from "@/assets/demos/coffee-beans.jpg";

const Demo5 = () => (
  <div className="min-h-screen" style={{ background: "#1a120b", color: "#f5e6d3", fontFamily: "'Georgia', serif" }}>
    {/* Navbar */}
    <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-amber-800/30">
      <span className="text-xl font-bold">☕ Kopi Nusantara</span>
      <div className="hidden md:flex gap-6 text-sm text-amber-600/70">
        <span>Menu</span><span>Tentang</span><span>Lokasi</span><span>Reservasi</span>
      </div>
      <button className="bg-amber-700 text-white px-5 py-2 rounded-full text-sm">Pesan Meja</button>
    </nav>

    {/* Hero with image */}
    <section className="relative">
      <div className="h-[60vh] overflow-hidden">
        <img src={coffeeHero} alt="Kopi Nusantara" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a120b] via-[#1a120b]/50 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 text-center px-6 pb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Kopi <span className="text-amber-500 italic">Otentik</span> Indonesia</h1>
        <p className="text-amber-600/60 text-lg max-w-xl mx-auto mb-8">Dari biji pilihan Toraja hingga Gayo. Diseduh dengan passion, disajikan dengan cinta.</p>
        <button className="bg-amber-700 px-8 py-4 rounded-full text-lg font-semibold text-white">Lihat Menu</button>
      </div>
    </section>

    {/* Menu Favorit */}
    <section className="py-16 px-6 bg-amber-900/20">
      <h2 className="text-3xl font-bold text-center mb-4">Menu Favorit</h2>
      <p className="text-center text-amber-600/50 mb-10">Racikan terbaik pilihan pelanggan kami</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {[
          { name: "Espresso", price: "25K", desc: "Bold & intense" },
          { name: "Cappuccino", price: "35K", desc: "Creamy & smooth" },
          { name: "Kopi Susu Gula Aren", price: "28K", desc: "Signature drink" },
          { name: "V60 Single Origin", price: "40K", desc: "Pour over perfection" },
          { name: "Affogato", price: "38K", desc: "Espresso + gelato" },
          { name: "Cold Brew", price: "32K", desc: "12-hour brewed" },
          { name: "Es Kopi Susu", price: "25K", desc: "Classic favorite" },
          { name: "Tubruk Jawa", price: "20K", desc: "Traditional style" },
        ].map((m, i) => (
          <div key={i} className="bg-amber-900/30 border border-amber-800/30 rounded-2xl p-5 text-center hover:bg-amber-900/50 transition-colors">
            <div className="text-3xl mb-3">☕</div>
            <h3 className="font-bold text-sm mb-1">{m.name}</h3>
            <p className="text-xs text-amber-600/40 mb-2">{m.desc}</p>
            <p className="text-amber-500 font-semibold">Rp {m.price}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Interior Showcase */}
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl overflow-hidden">
          <img src={coffeeInterior} alt="Interior Kopi Nusantara" className="w-full h-full object-cover" />
        </div>
        <div className="rounded-2xl overflow-hidden">
          <img src={coffeeLatte} alt="Latte Art" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>

    {/* Story */}
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-amber-500 text-sm tracking-wider uppercase mb-4 block">Cerita Kami</span>
          <h2 className="text-3xl font-bold mb-6">Dari Warung Kecil ke Kopi Nusantara</h2>
          <p className="text-amber-600/60 leading-relaxed mb-4">Bermula dari warung kecil di Bandung tahun 2018, Kopi Nusantara lahir dari kecintaan mendalam terhadap kopi Indonesia.</p>
          <p className="text-amber-600/60 leading-relaxed mb-4">Kami bekerja langsung dengan petani lokal dari Toraja, Gayo, Flores, dan Bali untuk menghadirkan cita rasa terbaik dari setiap daerah penghasil kopi di nusantara.</p>
          <p className="text-amber-600/60 leading-relaxed">Setiap cangkir yang kami sajikan adalah hasil dari proses seleksi ketat, roasting presisi, dan brewing yang penuh perhatian.</p>
        </div>
        <div className="rounded-2xl overflow-hidden">
          <img src={coffeeBeans} alt="Coffee Beans" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="py-16 px-6 bg-amber-900/20">
      <h2 className="text-3xl font-bold text-center mb-10">Kenapa Kopi Nusantara?</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { icon: "🌱", title: "Direct Trade", desc: "Biji kopi langsung dari petani lokal. Fair price, kualitas premium." },
          { icon: "🔥", title: "Fresh Roasted", desc: "Di-roast setiap minggu untuk memastikan kesegaran optimal di setiap cangkir." },
          { icon: "🏆", title: "Award Winning", desc: "Pemenang Indonesia Coffee Festival 2023. Diakui oleh SCA certified Q-graders." },
          { icon: "♻️", title: "Sustainable", desc: "Packaging ramah lingkungan dan program daur ulang cup untuk menjaga bumi." },
          { icon: "👨‍🍳", title: "Expert Barista", desc: "Tim barista bersertifikasi SCA dengan pengalaman rata-rata 5+ tahun." },
          { icon: "🎨", title: "Cozy Space", desc: "Interior hangat dan nyaman, cocok untuk kerja, ngobrol, atau me-time." },
        ].map((f, i) => (
          <div key={i} className="bg-amber-900/30 border border-amber-800/20 rounded-2xl p-6">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-bold text-lg mb-2">{f.title}</h3>
            <p className="text-sm text-amber-600/50 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Testimonials */}
    <section className="py-16 px-6">
      <h2 className="text-3xl font-bold text-center mb-10">Kata Pelanggan</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { name: "Andi K.", text: "Kopi susu gula aren terbaik di Bandung! Tempatnya cozy banget, cocok buat WFA." },
          { name: "Maya S.", text: "Single origin V60-nya luar biasa. Bisa ngerasain karakter kopi dari berbagai daerah." },
          { name: "Dimas R.", text: "Udah jadi langganan setia. Barista-nya knowledgeable dan selalu kasih rekomendasi tepat." },
        ].map((t, i) => (
          <div key={i} className="bg-amber-900/30 border border-amber-800/20 rounded-2xl p-6">
            <div className="flex gap-1 mb-3">{[...Array(5)].map((_, j) => <span key={j} className="text-amber-500">★</span>)}</div>
            <p className="text-sm text-amber-600/60 italic mb-4">"{t.text}"</p>
            <p className="font-bold text-sm">{t.name}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Locations */}
    <section className="py-16 px-6 bg-amber-900/20">
      <h2 className="text-2xl font-bold text-center mb-8">Lokasi Kami</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { city: "Bandung", address: "Jl. Braga No. 42", hours: "07:00 - 23:00" },
          { city: "Jakarta", address: "Jl. Senopati No. 15", hours: "08:00 - 22:00" },
          { city: "Bali", address: "Jl. Petitenget No. 8", hours: "07:00 - 23:00" },
        ].map((l, i) => (
          <div key={i} className="bg-amber-900/30 border border-amber-800/20 rounded-xl p-6 text-center">
            <p className="text-2xl mb-2">📍</p>
            <h3 className="font-bold text-lg mb-1">{l.city}</h3>
            <p className="text-sm text-amber-600/60">{l.address}</p>
            <p className="text-xs text-amber-600/40 mt-2">Buka setiap hari {l.hours}</p>
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 px-6 text-center">
      <h2 className="text-3xl font-bold mb-4">Reservasi <span className="text-amber-500 italic">Sekarang</span></h2>
      <p className="text-amber-600/50 mb-8 max-w-md mx-auto">Book meja untuk pengalaman kopi terbaik. Atau pesan delivery langsung ke rumah.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-amber-700 px-8 py-4 rounded-full text-lg font-semibold text-white">Reservasi Meja</button>
        <button className="border-2 border-amber-700 px-8 py-4 rounded-full text-lg text-amber-500">Order Delivery</button>
      </div>
    </section>

    <footer className="text-center py-8 text-amber-800/40 text-sm border-t border-amber-800/20">© 2024 Kopi Nusantara. Generated by LP Builder.</footer>
  </div>
);
export default Demo5;
