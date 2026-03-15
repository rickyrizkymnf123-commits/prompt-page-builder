import saasDashboard from "@/assets/demos/saas-dashboard.jpg";
import saasHero from "@/assets/demos/saas-hero.jpg";

const Demo3 = () => (
  <div className="min-h-screen" style={{ background: "#0a0a0a", color: "#e0e0e0", fontFamily: "'Courier New', monospace" }}>
    {/* Navbar */}
    <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-green-500/20">
      <span className="text-xl font-bold text-green-400">₿ CryptoVault</span>
      <div className="hidden md:flex gap-6 text-sm text-green-500/60">
        <span>Markets</span><span>Trade</span><span>Earn</span><span>API</span>
      </div>
      <button className="bg-green-500 text-black px-5 py-2 rounded text-sm font-bold">Start Trading</button>
    </nav>

    {/* Hero */}
    <section className="text-center py-20 md:py-32 px-6">
      <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 text-xs px-4 py-2 rounded mb-8">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Live Trading
      </div>
      <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl mx-auto mb-6">Trade Crypto with <span className="text-green-400">Zero Fees</span></h1>
      <p className="text-white/40 text-lg max-w-xl mx-auto mb-8">Platform trading crypto tercepat di Indonesia. 200+ pairs, leverage hingga 100x.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-green-500 text-black px-8 py-4 rounded text-lg font-bold">🚀 Mulai Trading</button>
        <button className="border border-green-500/30 text-green-400 px-8 py-4 rounded text-lg">Demo Account</button>
      </div>
    </section>

    {/* Dashboard Preview */}
    <section className="px-6 pb-16">
      <div className="max-w-5xl mx-auto rounded-xl overflow-hidden border border-green-500/20">
        <img src={saasDashboard} alt="CryptoVault Trading Dashboard" className="w-full h-auto" />
      </div>
    </section>

    {/* Live Prices */}
    <section className="py-16 px-6">
      <h2 className="text-2xl font-bold text-center mb-10 text-green-400">📊 Live Market Prices</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {[
          { coin: "BTC", name: "Bitcoin", price: "$67,432", change: "+2.4%", mcap: "$1.3T" },
          { coin: "ETH", name: "Ethereum", price: "$3,521", change: "+1.8%", mcap: "$423B" },
          { coin: "SOL", name: "Solana", price: "$142", change: "+5.2%", mcap: "$62B" },
          { coin: "BNB", name: "BNB Chain", price: "$598", change: "-0.3%", mcap: "$92B" },
        ].map((c, i) => (
          <div key={i} className="bg-white/5 border border-green-500/10 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🪙</span>
              <div>
                <p className="font-bold text-sm">{c.coin}</p>
                <p className="text-xs text-white/30">{c.name}</p>
              </div>
            </div>
            <p className="font-bold text-xl mb-1">{c.price}</p>
            <p className={`text-sm ${c.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{c.change}</p>
            <p className="text-xs text-white/20 mt-1">MCap: {c.mcap}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Features */}
    <section className="py-16 px-6 border-t border-green-500/10">
      <h2 className="text-2xl font-bold text-center mb-4 text-green-400">Kenapa CryptoVault?</h2>
      <p className="text-center text-white/30 mb-12 max-w-lg mx-auto">Dibangun oleh trader, untuk trader. Platform paling advanced di Indonesia.</p>
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { icon: "⚡", title: "Ultra Fast Execution", desc: "Eksekusi order dalam 0.01 detik. Matching engine tercepat dengan latensi super rendah." },
          { icon: "🔒", title: "Bank-Grade Security", desc: "95% asset di cold storage. 2FA, anti-phishing code, dan whitelist withdrawal." },
          { icon: "📊", title: "Advanced Charts", desc: "TradingView built-in gratis dengan 100+ indikator teknikal dan drawing tools." },
          { icon: "💰", title: "Zero Trading Fees", desc: "Tidak ada fee untuk 30 hari pertama. Setelah itu fee terendah di industri 0.05%." },
          { icon: "🌐", title: "200+ Trading Pairs", desc: "Akses ke semua major coins, altcoins, dan token DeFi populer." },
          { icon: "📱", title: "Mobile App", desc: "Trading dari mana saja. Tersedia di iOS dan Android dengan notifikasi real-time." },
        ].map((f, i) => (
          <div key={i} className="bg-green-500/5 border border-green-500/10 rounded-xl p-6">
            <div className="text-3xl mb-4">{f.icon}</div>
            <h3 className="font-bold mb-2 text-green-300 text-lg">{f.title}</h3>
            <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Platform Screenshot */}
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4 text-green-400">Platform Trading Profesional</h2>
        <p className="text-center text-white/30 mb-10">Interface yang intuitif dengan semua tools yang kamu butuhkan</p>
        <div className="rounded-xl overflow-hidden border border-green-500/20">
          <img src={saasHero} alt="CryptoVault Platform" className="w-full h-auto" />
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="py-16 px-6 border-t border-green-500/10">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { num: "$2.4B", label: "24h Volume" },
          { num: "500K+", label: "Active Traders" },
          { num: "200+", label: "Trading Pairs" },
          { num: "99.99%", label: "Uptime" },
        ].map((s, i) => (
          <div key={i}>
            <p className="text-3xl md:text-4xl font-bold text-green-400">{s.num}</p>
            <p className="text-sm text-white/30 mt-2">{s.label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Trading Tiers */}
    <section className="py-16 px-6">
      <h2 className="text-2xl font-bold text-center mb-4 text-green-400">Fee Structure</h2>
      <p className="text-center text-white/30 mb-10">Semakin banyak trading, semakin rendah fee-nya</p>
      <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {[
          { tier: "Starter", volume: "< $50K", maker: "0.10%", taker: "0.10%", benefits: ["Basic Charts", "Email Support", "2 Withdrawal/day"] },
          { tier: "Pro", volume: "$50K - $1M", maker: "0.05%", taker: "0.07%", benefits: ["Advanced Charts", "Priority Support", "10 Withdrawal/day", "API Access"] },
          { tier: "VIP", volume: "> $1M", maker: "0.02%", taker: "0.04%", benefits: ["All Pro features", "Dedicated Manager", "Unlimited Withdrawal", "Custom API", "OTC Desk"] },
        ].map((t, i) => (
          <div key={i} className={`border ${i===2 ? 'border-green-500 bg-green-500/5' : 'border-green-500/10'} rounded-xl p-6`}>
            <h3 className="text-lg font-bold text-green-300 mb-1">{t.tier}</h3>
            <p className="text-xs text-white/30 mb-4">Volume: {t.volume}</p>
            <div className="flex gap-4 mb-4">
              <div><p className="text-xs text-white/30">Maker</p><p className="text-xl font-bold text-green-400">{t.maker}</p></div>
              <div><p className="text-xs text-white/30">Taker</p><p className="text-xl font-bold text-green-400">{t.taker}</p></div>
            </div>
            <ul className="space-y-2 text-sm text-white/40">
              {t.benefits.map((b, j) => <li key={j} className="flex items-center gap-2"><span className="text-green-400">✓</span> {b}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>

    {/* Testimonials */}
    <section className="py-16 px-6 border-t border-green-500/10">
      <h2 className="text-2xl font-bold text-center mb-10 text-green-400">Apa Kata Trader Kami</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { name: "Rizky T.", role: "Day Trader", text: "Eksekusi paling cepat yang pernah saya coba. Spread tipis dan fee rendah. CryptoVault jadi platform utama saya." },
          { name: "Sinta M.", role: "Swing Trader", text: "Charting tools-nya lengkap banget. Bisa langsung analisa dan trade tanpa perlu platform lain." },
          { name: "Budi P.", role: "Investor", text: "Fitur staking-nya memberikan passive income yang konsisten. Security-nya juga bikin tenang." },
        ].map((t, i) => (
          <div key={i} className="bg-white/5 border border-green-500/10 rounded-xl p-6">
            <p className="text-sm text-white/50 italic mb-4">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-sm font-bold text-green-400">{t.name[0]}</div>
              <div>
                <p className="font-bold text-sm text-green-300">{t.name}</p>
                <p className="text-xs text-white/30">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 px-6 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Mulai Trading <span className="text-green-400">Sekarang</span></h2>
      <p className="text-white/40 mb-8 max-w-md mx-auto">Buat akun dalam 2 menit. Deposit dan trading langsung tanpa menunggu.</p>
      <button className="bg-green-500 text-black px-10 py-4 rounded text-lg font-bold">🚀 Daftar Gratis</button>
      <p className="text-xs text-white/20 mt-4">Tidak ada minimum deposit. Tidak ada hidden fees.</p>
    </section>

    <footer className="text-center py-8 text-white/20 text-sm border-t border-white/5">© 2024 CryptoVault. Generated by LP Builder.</footer>
  </div>
);
export default Demo3;
