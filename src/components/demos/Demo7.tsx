import yogaRetreat from "@/assets/demos/yoga-retreat.jpg";
import yogaMeditation from "@/assets/demos/yoga-meditation.jpg";

const Demo7 = () => (
  <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #f0fdf4, #ecfdf5, #d1fae5)", color: "#1a3a2a", fontFamily: "'Segoe UI', sans-serif" }}>
    {/* Navbar */}
    <nav className="flex items-center justify-between px-6 md:px-12 py-5">
      <span className="text-xl font-bold text-emerald-800">🧘 Zen Flow</span>
      <div className="hidden md:flex gap-6 text-sm text-emerald-600/60">
        <span>Classes</span><span>Instructors</span><span>Retreat</span><span>Pricing</span>
      </div>
      <button className="bg-emerald-600 text-white px-5 py-2 rounded-full text-sm">Book Class</button>
    </nav>

    {/* Hero */}
    <section className="relative">
      <div className="h-[60vh] overflow-hidden">
        <img src={yogaRetreat} alt="Zen Flow Yoga Bali" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f0fdf4] via-transparent to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 text-center px-6 pb-12">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl mx-auto mb-4 text-emerald-900">Temukan <span className="text-emerald-500 italic">Keseimbangan</span> Hidupmu</h1>
        <p className="text-emerald-700/50 text-lg max-w-xl mx-auto mb-8">Yoga studio premium di Bali. Kelas harian, retreat mingguan, dan instructor bersertifikasi internasional.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold">Jadwal Kelas</button>
          <button className="border-2 border-emerald-600 text-emerald-700 px-8 py-4 rounded-full text-lg bg-white/50">Free Trial</button>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="py-12 px-6">
      <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center">
        {[
          { num: "5,000+", label: "Yogis Joined" },
          { num: "15+", label: "Expert Instructors" },
          { num: "30+", label: "Classes / Week" },
        ].map((s, i) => (
          <div key={i} className="bg-white/70 rounded-2xl p-4 shadow-sm">
            <p className="text-2xl md:text-3xl font-bold text-emerald-600">{s.num}</p>
            <p className="text-xs text-emerald-600/50 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Classes */}
    <section className="py-16 px-6">
      <h2 className="text-3xl font-bold text-center mb-4 text-emerald-900">Kelas Kami</h2>
      <p className="text-center text-emerald-700/40 mb-10">Pilih kelas yang sesuai dengan kebutuhan dan level Anda</p>
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { name: "Hatha Yoga", time: "06:00", level: "Beginner", icon: "🌅", desc: "Fondasi dasar yoga. Fokus pada alignment, breathing, dan postur dasar." },
          { name: "Vinyasa Flow", time: "08:00", level: "Intermediate", icon: "🌊", desc: "Dynamic flow yang menghubungkan gerakan dengan nafas. Membangun kekuatan dan fleksibilitas." },
          { name: "Yin Yoga", time: "18:00", level: "All Levels", icon: "🌙", desc: "Deep stretch & relaxation. Tahan posisi lebih lama untuk melepas tension." },
          { name: "Power Yoga", time: "07:00", level: "Advanced", icon: "💪", desc: "Workout intense yang membangun otot dan stamina. Berkeringat dijamin!" },
          { name: "Prenatal Yoga", time: "10:00", level: "All Levels", icon: "🤰", desc: "Yoga khusus ibu hamil. Aman, gentle, dan mempersiapkan tubuh untuk persalinan." },
          { name: "Meditation", time: "17:00", level: "All Levels", icon: "🧠", desc: "Guided meditation untuk ketenangan pikiran. Teknik mindfulness & breathwork." },
        ].map((c, i) => (
          <div key={i} className="bg-white/70 border border-emerald-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">{c.icon}</div>
            <h3 className="font-bold text-lg text-emerald-800">{c.name}</h3>
            <p className="text-sm text-emerald-600/60 mt-1 mb-3">{c.time} · {c.level}</p>
            <p className="text-xs text-emerald-700/40 leading-relaxed">{c.desc}</p>
            <button className="mt-4 bg-emerald-100 text-emerald-700 px-5 py-2 rounded-full text-sm font-medium">Book</button>
          </div>
        ))}
      </div>
    </section>

    {/* Meditation Room */}
    <section className="py-16 px-6 bg-emerald-100/50">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img src={yogaMeditation} alt="Meditation Room" className="w-full h-full object-cover" />
        </div>
        <div>
          <span className="text-emerald-500 text-sm tracking-wider uppercase mb-4 block">Private Space</span>
          <h2 className="text-3xl font-bold text-emerald-900 mb-6">Ruang Meditasi Eksklusif</h2>
          <p className="text-emerald-700/50 leading-relaxed mb-4">Nikmati ruang meditasi private kami yang dirancang khusus untuk memberikan ketenangan total. Dengan akustik sempurna dan pencahayaan ambient.</p>
          <ul className="space-y-3">
            {["Sound healing therapy", "Aromatherapy session", "Private meditation guidance", "Crystal bowl ceremony"].map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-emerald-700/60 text-sm">
                <span className="text-emerald-500">✦</span> {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    {/* Instructors */}
    <section className="py-16 px-6">
      <h2 className="text-3xl font-bold text-center mb-10 text-emerald-900">Instructor Kami</h2>
      <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {[
          { name: "Ayu Dewi", specialty: "Hatha & Yin", exp: "10 tahun", cert: "RYT-500" },
          { name: "Made Surya", specialty: "Vinyasa & Power", exp: "8 tahun", cert: "E-RYT 200" },
          { name: "Komang Ari", specialty: "Meditation", exp: "12 tahun", cert: "CMT" },
          { name: "Wayan Sari", specialty: "Prenatal Yoga", exp: "6 tahun", cert: "RPYT" },
        ].map((t, i) => (
          <div key={i} className="bg-white/70 rounded-2xl p-6 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-200 mx-auto mb-3 flex items-center justify-center text-2xl">🧘</div>
            <h3 className="font-bold text-emerald-800">{t.name}</h3>
            <p className="text-xs text-emerald-500 mt-1">{t.cert} · {t.exp}</p>
            <p className="text-xs text-emerald-600/50 mt-1">{t.specialty}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Retreat */}
    <section className="py-16 px-6 bg-emerald-100/50">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-emerald-500 text-sm tracking-wider uppercase mb-4 block">Special Program</span>
        <h2 className="text-3xl font-bold text-emerald-900 mb-4">Weekend Retreat</h2>
        <p className="text-emerald-700/50 mb-8 max-w-lg mx-auto">3 hari 2 malam di villa private Ubud. Yoga, meditasi, healthy food, dan nature walk. Detox total dari kesibukan.</p>
        <div className="bg-white/70 rounded-2xl p-8 max-w-md mx-auto shadow-sm">
          <p className="text-4xl font-bold text-emerald-600 mb-2">Rp 3.5 Juta</p>
          <p className="text-sm text-emerald-600/50 mb-4">/person · all inclusive</p>
          <ul className="text-sm text-emerald-700/50 space-y-2 text-left mb-6">
            {["Akomodasi 2 malam", "6x yoga session", "3x meditation", "Healthy meals", "Nature excursion", "Spa treatment"].map((f, i) => (
              <li key={i} className="flex items-center gap-2"><span className="text-emerald-500">✓</span> {f}</li>
            ))}
          </ul>
          <button className="w-full bg-emerald-600 text-white py-3 rounded-full font-semibold">Book Retreat</button>
        </div>
      </div>
    </section>

    {/* Pricing */}
    <section className="py-16 px-6">
      <h2 className="text-2xl font-bold text-center mb-10 text-emerald-900">Membership</h2>
      <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {[
          { plan: "Drop-In", price: "Rp 100K", per: "/class", features: ["Akses 1 kelas", "Mat & towel included", "Locker access"] },
          { plan: "Monthly", price: "Rp 800K", per: "/month", features: ["Unlimited classes", "Mat & towel", "Locker access", "10% retail discount", "1 guest pass/month"] },
          { plan: "Annual", price: "Rp 7.5 Juta", per: "/year", features: ["Unlimited classes", "Priority booking", "Free retreat discount 20%", "Personal locker", "Unlimited guest passes", "Free merchandise"] },
        ].map((p, i) => (
          <div key={i} className={`bg-white rounded-2xl p-6 text-center shadow-sm ${i===1 ? 'ring-2 ring-emerald-500 scale-105' : ''}`}>
            {i===1 && <span className="text-xs bg-emerald-500 text-white px-3 py-1 rounded-full font-bold mb-3 inline-block">Best Value</span>}
            <h3 className="font-bold text-emerald-800">{p.plan}</h3>
            <p className="text-3xl font-bold text-emerald-600 mt-2">{p.price}</p>
            <p className="text-sm text-emerald-500/60 mb-4">{p.per}</p>
            <ul className="text-xs text-emerald-700/50 space-y-2 text-left">
              {p.features.map((f, j) => <li key={j} className="flex items-center gap-2"><span className="text-emerald-500">✓</span> {f}</li>)}
            </ul>
            <button className={`mt-4 w-full py-2 rounded-full text-sm font-medium ${i===1 ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'}`}>Choose Plan</button>
          </div>
        ))}
      </div>
    </section>

    {/* Testimonials */}
    <section className="py-16 px-6 bg-emerald-100/50">
      <h2 className="text-2xl font-bold text-center mb-10 text-emerald-900">Kata Member Kami</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { name: "Lisa W.", text: "Zen Flow mengubah hidup saya. Dari stress berat, sekarang merasa lebih tenang dan fokus setiap hari." },
          { name: "Putu A.", text: "Instructor-nya amazing! Sangat perhatian dan selalu adjust posture. Terasa kayak private class." },
          { name: "Sarah M.", text: "Retreat weekend-nya THE BEST. View rice terrace + yoga = healing luar biasa. Pasti balik lagi!" },
        ].map((t, i) => (
          <div key={i} className="bg-white/70 rounded-2xl p-6 shadow-sm">
            <div className="flex gap-1 mb-3">{[...Array(5)].map((_, j) => <span key={j} className="text-emerald-500">★</span>)}</div>
            <p className="text-sm text-emerald-700/50 italic mb-4">"{t.text}"</p>
            <p className="font-bold text-sm text-emerald-800">{t.name}</p>
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 px-6 text-center">
      <h2 className="text-3xl font-bold text-emerald-900 mb-4">Mulai Perjalanan Yoga-mu</h2>
      <p className="text-emerald-700/40 mb-8 max-w-md mx-auto">Kelas pertama gratis. Rasakan sendiri transformasinya.</p>
      <button className="bg-emerald-600 text-white px-10 py-4 rounded-full text-lg font-semibold">Coba Kelas Gratis</button>
    </section>

    <footer className="text-center py-8 text-emerald-500/40 text-sm">© 2024 Zen Flow. Generated by LP Builder.</footer>
  </div>
);
export default Demo7;
