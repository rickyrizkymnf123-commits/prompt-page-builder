import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, Zap, Server, Cpu, DollarSign } from "lucide-react";

const RUPIAH = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

const costItems = [
  {
    label: "Generate Prompt AI",
    desc: "AI menganalisis 8 parameter form → menyusun prompt copywriting profesional",
    inputTokens: "~2.500 token",
    outputTokens: "~4.000 token",
    costUsd: 0.035,
    costIdr: 570,
  },
  {
    label: "Generate Landing Page (AI Eksternal)",
    desc: "Prompt dikirim ke AI model untuk generate full HTML landing page",
    inputTokens: "~5.000 token",
    outputTokens: "~15.000 token",
    costUsd: 0.12,
    costIdr: 1_950,
  },
  {
    label: "Edit & Modifikasi Section",
    desc: "Setiap kali edit teks, warna, atau tambah section baru via AI",
    inputTokens: "~1.500 token",
    outputTokens: "~3.000 token",
    costUsd: 0.025,
    costIdr: 400,
  },
  {
    label: "Inject Countdown & Sales Notif",
    desc: "AI generate kode JavaScript custom sesuai konfigurasi",
    inputTokens: "~1.000 token",
    outputTokens: "~2.500 token",
    costUsd: 0.02,
    costIdr: 325,
  },
  {
    label: "Server & Infrastruktur",
    desc: "Database, autentikasi, CDN, SSL, hosting 24/7",
    inputTokens: "—",
    outputTokens: "—",
    costUsd: 0.05,
    costIdr: 815,
  },
];

const totalPerSession = costItems.reduce((s, c) => s + c.costIdr, 0);

export function CostBreakdownModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2 decoration-dashed"
        >
          <Info className="h-3 w-3" />
          Kenapa tools ini tidak gratis?
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Transparansi Biaya: Kenapa Tidak Gratis?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Intro */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-foreground leading-relaxed">
              Banyak yang bertanya <strong>"Kenapa tools ini bayar?"</strong> — Jawabannya
              sederhana: setiap kali kamu klik <strong>Generate</strong>, di balik layar ada{" "}
              <strong>AI model premium</strong> yang memproses ribuan token (kata), dan setiap
              token itu <span className="text-primary font-semibold">ada biayanya</span>.
            </p>
          </div>

          {/* Token explanation */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
            <Cpu className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-semibold text-foreground mb-1">Apa itu Token?</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                Token adalah satuan pemrosesan AI. Rata-rata <strong>1 kata = 1.3 token</strong>.
                Setiap prompt yang kamu kirim (<em>input token</em>) dan setiap jawaban AI (
                <em>output token</em>) dihitung dan dikenakan biaya oleh provider AI.
              </p>
            </div>
          </div>

          {/* Cost table */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="bg-card px-3 sm:px-4 py-2.5 border-b border-border">
              <p className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                <Server className="h-4 w-4 text-primary" />
                Rincian Biaya Per Sesi Penggunaan
              </p>
            </div>
            <div className="divide-y divide-border">
              {costItems.map((item, i) => (
                <div key={i} className="px-3 sm:px-4 py-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-foreground">{item.label}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      {item.inputTokens !== "—" && (
                        <div className="flex gap-3 mt-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                            Input: {item.inputTokens}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                            Output: {item.outputTokens}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs sm:text-sm font-bold text-primary">{RUPIAH(item.costIdr)}</p>
                      <p className="text-[10px] text-muted-foreground">${item.costUsd.toFixed(3)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Total */}
            <div className="px-3 sm:px-4 py-3 bg-primary/5 border-t-2 border-primary/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-bold text-foreground">Total Biaya Per Sesi</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">1x generate + edit + fitur marketing</p>
                </div>
                <div className="text-right">
                  <p className="text-sm sm:text-base font-extrabold text-primary">{RUPIAH(totalPerSession)}</p>
                  <p className="text-[10px] text-muted-foreground">~${costItems.reduce((s, c) => s + c.costUsd, 0).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly projection */}
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 sm:p-4">
            <p className="text-xs sm:text-sm font-bold text-foreground mb-1.5 flex items-center gap-2">
              <Zap className="h-4 w-4 text-destructive" />
              Simulasi Jika Gratis Unlimited:
            </p>
            <div className="space-y-1.5 text-[11px] sm:text-xs text-muted-foreground">
              <p>
                • 100 user × 5 generate/hari = <strong>500 sesi/hari</strong>
              </p>
              <p>
                • Biaya harian: 500 × {RUPIAH(totalPerSession)} ={" "}
                <strong className="text-destructive">{RUPIAH(500 * totalPerSession)}</strong>
              </p>
              <p>
                • Biaya bulanan: {RUPIAH(500 * totalPerSession * 30)} ={" "}
                <strong className="text-destructive">{RUPIAH(500 * totalPerSession * 30)}</strong>
              </p>
              <p className="pt-1 text-foreground font-semibold">
                💡 Itu baru 100 user. Bayangkan kalau 1.000+ user — biayanya bisa{" "}
                <span className="text-destructive">{RUPIAH(5000 * totalPerSession * 30)}/bulan</span>!
              </p>
            </div>
          </div>

          {/* Closing */}
          <div className="rounded-lg bg-secondary/50 p-3 sm:p-4 text-center">
            <p className="text-xs sm:text-sm text-foreground leading-relaxed">
              Dengan berlangganan, kamu membantu kami <strong>menjaga server tetap hidup</strong>,{" "}
              <strong>terus mengembangkan fitur baru</strong>, dan memberikan{" "}
              <strong>kualitas output terbaik</strong> untuk bisnis kamu. 🙏
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
              * Biaya dihitung berdasarkan rate card AI model premium (GPT-4 / Gemini Pro) + infrastruktur cloud.
              Kurs: $1 = Rp 16.300
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
