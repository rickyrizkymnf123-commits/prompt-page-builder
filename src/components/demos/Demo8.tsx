import lawOffice from "@/assets/demos/law-office.jpg";
import lawCourt from "@/assets/demos/law-courtroom.jpg";
import lawHero from "@/assets/demos/law-hero.jpg";

const Demo8 = () => (
  <div className="min-h-screen" style={{ background: "#0c1220", color: "#c5ccd8", fontFamily: "'Times New Roman', serif" }}>
    {/* Navbar */}
    <nav className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-slate-700/30">
      <span className="text-xl font-bold text-slate-200 tracking-wider">⚖️ ARTHA & PARTNERS</span>
      <div className="hidden md:flex gap-6 text-sm text-slate-400">
        <span>Practice Areas</span><span>Our Team</span><span>Cases</span><span>Contact</span>
      </div>
      <button className="bg-amber-600 text-white px-5 py-2 text-sm tracking-wider">CONSULTATION</button>
    </nav>

    {/* Hero */}
    <section className="relative">
      <div className="h-[60vh] overflow-hidden">
        <img src={lawHero} alt="Artha & Partners" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1220] via-[#0c1220]/60 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-12">
        <span className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-4 block">Established 2005</span>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-slate-100">Trusted Legal <span className="text-amber-500">Excellence</span></h1>
        <p className="text-slate-400 text-lg max-w-xl mb-8">Kantor hukum terkemuka di Jakarta dengan track record 98% kemenangan kasus. Spesialisasi corporate law, litigation, dan IP.</p>
        <button className="bg-amber-600 text-white px-8 py-4 text-lg tracking-wider">KONSULTASI GRATIS</button>
      </div>
    </section>

    {/* Stats */}
    <section className="py-12 px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-4 gap-4 text-center">
        {[
          { num: "500+", label: "Cases Won" },
          { num: "19", label: "Years Experience" },
          { num: "98%", label: "Win Rate" },
          { num: "150+", label: "Corporate Clients" },
        ].map((s, i) => (
          <div key={i}>
            <p className="text-2xl md:text-3xl font-bold text-amber-500">{s.num}</p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Practice Areas */}
    <section className="py-16 px-6 bg-slate-800/20">
      <h2 className="text-2xl font-bold text-center mb-4 text-slate-200 tracking-wider">PRACTICE AREAS</h2>
      <p className="text-center text-slate-400/60 mb-10">Keahlian kami mencakup berbagai bidang hukum</p>
      <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {[
          { icon: "🏢", name: "Corporate Law", desc: "M&A, restructuring, joint ventures, dan corporate governance." },
          { icon: "⚔️", name: "Litigation", desc: "Penyelesaian sengketa di pengadilan dan arbitrase internasional." },
          { icon: "📜", name: "IP & Patent", desc: "Pendaftaran dan perlindungan hak kekayaan intelektual." },
          { icon: "🏠", name: "Real Estate", desc: "Transaksi properti, izin, dan regulasi pertanahan." },
          { icon: "💼", name: "Banking & Finance", desc: "Regulasi perbankan, fintech, dan instrumen keuangan." },
          { icon: "🌐", name: "International Trade", desc: "Ekspor-impor, kepabeanan, dan perjanjian perdagangan." },
          { icon: "👥", name: "Employment Law", desc: "Hubungan industrial, kontrak kerja, dan ketenagakerjaan." },
          { icon: "🔒", name: "Data Privacy", desc: "Compliance UU PDP, GDPR, dan keamanan data." },
        ].map((a, i) => (
          <div key={i} className="border border-slate-700/30 p-5 hover:bg-slate-800/30 transition-colors">
            <div className="text-2xl mb-3">{a.icon}</div>
            <h3 className="font-bold text-sm text-slate-200 tracking-wider mb-2">{a.name}</h3>
            <p className="text-xs text-slate-400/60 leading-relaxed">{a.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Office Image */}
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        <div className="rounded-lg overflow-hidden">
          <img src={lawOffice} alt="Our Office" className="w-full h-full object-cover" />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img src={lawCourt} alt="Courtroom" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="py-16 px-6">
      <h2 className="text-2xl font-bold text-center mb-4 text-slate-200 tracking-wider">OUR TEAM</h2>
      <p className="text-center text-slate-400/60 mb-10">Tim profesional dengan pengalaman puluhan tahun</p>
      <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {[
          { name: "Dr. Artha Wijaya, SH, MH", role: "Managing Partner", specialty: "Corporate Law", exp: "25 tahun" },
          { name: "Maria Santoso, SH, LLM", role: "Senior Partner", specialty: "Litigation", exp: "18 tahun" },
          { name: "Hendro Pratama, SH", role: "Partner", specialty: "IP & Patent", exp: "15 tahun" },
          { name: "Dewi Kartika, SH, MKn", role: "Associate", specialty: "Real Estate", exp: "8 tahun" },
        ].map((t, i) => (
          <div key={i} className="text-center">
            <div className="w-24 h-24 rounded-full bg-slate-700/30 mx-auto mb-3 flex items-center justify-center text-3xl">👤</div>
            <h3 className="font-bold text-slate-200 text-sm">{t.name}</h3>
            <p className="text-xs text-amber-500 mt-1">{t.role}</p>
            <p className="text-xs text-slate-400/60 mt-1">{t.specialty}</p>
            <p className="text-xs text-slate-400/40">{t.exp}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="py-16 px-6 bg-slate-800/20">
      <h2 className="text-2xl font-bold text-center mb-10 text-slate-200 tracking-wider">WHY CHOOSE US</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { icon: "🏆", title: "Track Record Terbukti", desc: "98% win rate dengan lebih dari 500 kasus yang berhasil ditangani." },
          { icon: "🤝", title: "Client-First Approach", desc: "Setiap klien mendapat perhatian personal. Komunikasi transparan dan responsif." },
          { icon: "🌏", title: "Network Internasional", desc: "Afiliasi dengan law firm di 15 negara untuk penanganan kasus cross-border." },
          { icon: "📚", title: "Deep Expertise", desc: "Tim dengan gelar dari universitas top: UI, UGM, Harvard, NUS." },
          { icon: "⏱️", title: "Efisiensi Waktu", desc: "Penyelesaian kasus lebih cepat dari rata-rata industri." },
          { icon: "💯", title: "Transparansi Biaya", desc: "Struktur fee jelas dari awal. Tanpa hidden cost atau surprise billing." },
        ].map((f, i) => (
          <div key={i} className="border border-slate-700/20 p-6">
            <div className="text-2xl mb-3">{f.icon}</div>
            <h3 className="font-bold text-sm text-amber-500 tracking-wider mb-2">{f.title}</h3>
            <p className="text-xs text-slate-400/60 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Notable Cases */}
    <section className="py-16 px-6">
      <h2 className="text-2xl font-bold text-center mb-10 text-slate-200 tracking-wider">NOTABLE CASES</h2>
      <div className="max-w-3xl mx-auto space-y-4">
        {[
          { case: "PT Maju Jaya vs PT Global Corp", type: "Corporate Dispute", result: "Won — Settlement Rp 50B", year: "2024" },
          { case: "Tech Startup IP Protection", type: "Intellectual Property", result: "Patent Granted", year: "2023" },
          { case: "Multi-National JV Agreement", type: "Corporate Advisory", result: "Successfully Structured", year: "2023" },
          { case: "Land Acquisition Dispute", type: "Real Estate Litigation", result: "Won — Full Compensation", year: "2022" },
        ].map((c, i) => (
          <div key={i} className="border border-slate-700/20 p-5 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm text-slate-200">{c.case}</h3>
              <p className="text-xs text-slate-400/60">{c.type}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-amber-500 font-bold">{c.result}</p>
              <p className="text-xs text-slate-400/40">{c.year}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Testimonials */}
    <section className="py-16 px-6 bg-slate-800/20">
      <h2 className="text-2xl font-bold text-center mb-10 text-slate-200 tracking-wider">CLIENT TESTIMONIALS</h2>
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {[
          { name: "CEO, PT Maju Jaya", text: "Artha & Partners menangani kasus kami dengan sangat profesional. Hasilnya melampaui ekspektasi. Highly recommended." },
          { name: "Founder, TechStartup.id", text: "Proses perlindungan IP kami berjalan smooth berkat tim AP. Mereka memahami kebutuhan startup dengan baik." },
        ].map((t, i) => (
          <div key={i} className="border border-slate-700/20 p-6">
            <p className="text-sm text-slate-300/70 italic mb-4">"{t.text}"</p>
            <p className="text-xs text-amber-500 font-bold">{t.name}</p>
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 px-6 text-center">
      <h2 className="text-3xl font-bold text-slate-100 mb-4">Butuh Bantuan <span className="text-amber-500">Hukum</span>?</h2>
      <p className="text-slate-400 mb-8 max-w-md mx-auto">Konsultasi awal gratis. Ceritakan kasus Anda dan kami akan memberikan solusi terbaik.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-amber-600 text-white px-8 py-4 text-lg tracking-wider">JADWALKAN KONSULTASI</button>
        <button className="border border-slate-600 text-slate-300 px-8 py-4 text-lg tracking-wider">021-555-0123</button>
      </div>
    </section>

    <footer className="text-center py-8 text-slate-600 text-sm border-t border-slate-700/20">© 2024 Artha & Partners. Generated by LP Builder.</footer>
  </div>
);
export default Demo8;
