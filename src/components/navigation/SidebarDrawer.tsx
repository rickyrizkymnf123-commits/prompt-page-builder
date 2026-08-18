import React from 'react';
import {
  Zap,
  Wand2,
  Cpu,
  Target,
  Video,
  Timer,
  ShieldCheck,
  LayoutTemplate,
  DollarSign,
  FolderOpen,
  X,
  Rocket,
  LogOut,
  ChevronRight,
  Sparkles,
  Users,
  FileText,
  Settings,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  userEmail?: string;
  isAdmin?: boolean;
  pendingUsersCount?: number;
  onLogout?: () => void;
  onOpenSavedProjects?: () => void;
}

export function SidebarDrawer({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  userEmail,
  isAdmin,
  pendingUsersCount = 0,
  onLogout,
  onOpenSavedProjects,
}: Props) {
  if (!isOpen) return null;

  const coreMenuItems = [
    {
      id: 'generator',
      label: 'LP Generator (Utama)',
      desc: 'Formulir wizard & master prompt',
      icon: <Zap className="w-4 h-4 text-purple-400" />,
      badge: 'Utama',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'quick_prompt',
      label: 'Prompt Cepat (AI Auto-Fill)',
      desc: '1-klik auto generate dari deskripsi',
      icon: <Wand2 className="w-4 h-4 text-amber-400" />,
      badge: 'Fast',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'api_settings',
      label: 'Konfigurasi API AI',
      desc: 'Koneksi KoboiLLM / OpenAI & Live Chat',
      icon: <Cpu className="w-4 h-4 text-indigo-400" />,
      badge: 'v8.0',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'competitor_spy',
      label: 'AI Competitor Spy',
      desc: 'Analisa URL & angle penawaran lawan',
      icon: <Target className="w-4 h-4 text-red-400" />,
      badge: 'AI Tool',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    },
    {
      id: 'creative_sync',
      label: 'Creative-to-LP Sync',
      desc: 'Sinkronisasi naskah video TikTok/FB',
      icon: <Video className="w-4 h-4 text-purple-400" />,
      badge: 'AI Tool',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'five_second',
      label: 'Tes 5 Detik (Clarity Test)',
      desc: 'Cek pemahaman audiens dalam 5 detik',
      icon: <Timer className="w-4 h-4 text-amber-400" />,
      badge: 'Audit',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'audit',
      label: 'AI Landing Page Auditor',
      desc: 'Evaluasi 5 pilar konversi & anti-banned',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      badge: 'Pro',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'templates',
      label: 'Galeri Template',
      desc: 'Template siap pakai & template kustom',
      icon: <LayoutTemplate className="w-4 h-4 text-sky-400" />,
      badge: 'Ready',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    },
    {
      id: 'affiliate',
      label: 'Program Affiliate',
      desc: 'Komisi referral & penarikan dana',
      icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
      badge: 'Cuan',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
  ];

  const adminMenuItems = [
    {
      id: 'users',
      label: 'Kelola Pengguna (Users)',
      desc: 'Approval & daftar member terdaftar',
      icon: <Users className="w-4 h-4 text-amber-400" />,
      badge: pendingUsersCount > 0 ? `${pendingUsersCount} Pending` : 'Users',
      badgeColor: pendingUsersCount > 0 ? 'bg-amber-500 text-white font-black' : 'bg-white/10 text-slate-300',
    },
    {
      id: 'logs',
      label: 'Aktivitas & Log Webhook',
      desc: 'Riwayat transaksi & webhook masuk',
      icon: <FileText className="w-4 h-4 text-blue-400" />,
      badge: 'Logs',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      id: 'settings',
      label: 'Pengaturan Sistem & Webhook',
      desc: 'Secret key, URL order & endpoint',
      icon: <Settings className="w-4 h-4 text-slate-400" />,
      badge: 'Config',
      badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    },
    {
      id: 'lpbuilder',
      label: 'Live LP Builder Engine',
      desc: 'Engine generator HTML langsung',
      icon: <ExternalLink className="w-4 h-4 text-purple-400" />,
      badge: 'Engine',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
  ];

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
      {/* Backdrop with Blur */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Sidebar Content */}
      <div className="relative w-[300px] sm:w-[340px] max-w-[85vw] h-full bg-slate-950/95 backdrop-blur-3xl border-r border-white/15 p-4 sm:p-5 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-300">
        <div className="space-y-4 flex-1 overflow-y-auto pr-1 scrollbar-thin">
          {/* Header Drawer */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
                <Rocket className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-white">Landing Page Builder</h2>
                <span className="text-[10px] text-purple-300 font-mono">v12.0 Pro Edition</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Menu Items List - Core & AI Tools */}
          <div className="space-y-1.5 pt-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-2">
              Menu & Fitur AI
            </p>

            {coreMenuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all border ${
                    isActive
                      ? 'bg-purple-600/20 border-purple-500/50 text-white shadow-md shadow-purple-900/30 font-bold'
                      : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/5 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-1">
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{item.label}</p>
                      <p className="text-[10px] text-slate-400 truncate opacity-80">{item.desc}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full border flex-shrink-0 ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Admin Management Section */}
          {isAdmin && (
            <div className="space-y-1.5 pt-3 border-t border-white/10">
              <p className="text-[10px] font-black text-amber-400 uppercase tracking-wider px-2 flex items-center gap-1.5">
                👑 Menu Administrator
              </p>

              {adminMenuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all border ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-500/50 text-white shadow-md shadow-amber-900/30 font-bold'
                        : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/5 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-1">
                      <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{item.label}</p>
                        <p className="text-[10px] text-slate-400 truncate opacity-80">{item.desc}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full border flex-shrink-0 ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Saved Projects Shortcut */}
          {onOpenSavedProjects && (
            <div className="pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSavedProjects();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-secondary/80 hover:bg-secondary border border-border text-xs font-bold text-foreground transition-all"
              >
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-primary" />
                  <span>Buka Proyek Tersimpan</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Profile & Logout */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 mt-2">
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{userEmail || 'Akun Pengguna'}</p>
            <p className="text-[10px] text-slate-400">{isAdmin ? '⭐ Administrator' : '✅ Active Member'}</p>
          </div>

          {onLogout && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="h-8 w-8 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
