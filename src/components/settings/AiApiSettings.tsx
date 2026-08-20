import React, { useState, useEffect } from 'react';
import {
  AiApiConfig,
  getStoredAiConfig,
  saveStoredAiConfig,
  testAiApiConnection,
  sendAiChatMessage,
} from '@/utils/aiClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  Cpu,
  Zap,
  Save,
  Eye,
  EyeOff,
  Globe,
  Check,
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  RefreshCw,
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export function AiApiSettings() {
  const [config, setConfig] = useState<AiApiConfig>(getStoredAiConfig());
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Live Chat Test states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [testInput, setTestInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    import('@/utils/aiClient').then(({ syncAiConfigFromCloud, getStoredAiConfig }) => {
      syncAiConfigFromCloud().then((cfg) => setConfig(cfg));
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    await saveStoredAiConfig(config);
    setIsSaving(false);
    toast({
      title: '💾 Pengaturan Disimpan Permanen!',
      description: 'Konfigurasi API AI telah tersimpan di browser & database server (tidak akan hilang saat refresh).',
    });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testAiApiConnection(config);
    setIsTesting(false);
    setTestResult(res);

    if (res.success) {
      toast({
        title: '⚡ Jalur API Terhubung!',
        description: res.message,
      });
    } else {
      toast({
        title: '⚠️ Gagal Terhubung',
        description: res.message,
        variant: 'destructive',
      });
    }
  };

  const handleSendLiveTest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!testInput.trim() || isChatting) return;

    const userText = testInput.trim();
    setTestInput('');

    const newMsg: ChatMessage = {
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages(prev => [...prev, newMsg]);
    setIsChatting(true);

    try {
      const history = [...chatMessages, newMsg].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const reply = await sendAiChatMessage(
        [
          { role: 'system', content: 'Anda adalah asisten AI landing page & copywriting cerdas, ramah, dan ringkas.' },
          ...history,
        ],
        config
      );

      setChatMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `❌ Error: ${err.message || 'Gagal memproses respon AI.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsChatting(false);
    }
  };

  const applyPreset = (preset: 'koboillm' | 'openai' | 'openrouter' | 'groq') => {
    if (preset === 'koboillm') {
      setConfig(prev => ({
        ...prev,
        endpointUrl: 'https://api.koboillm.com/v1/chat/completions',
        model: 'gpt-4o-mini',
      }));
    } else if (preset === 'openai') {
      setConfig(prev => ({
        ...prev,
        endpointUrl: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4o-mini',
      }));
    } else if (preset === 'openrouter') {
      setConfig(prev => ({
        ...prev,
        endpointUrl: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'deepseek/deepseek-chat',
      }));
    } else if (preset === 'groq') {
      setConfig(prev => ({
        ...prev,
        endpointUrl: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'llama-3.3-70b-versatile',
      }));
    }
    toast({ title: 'Preset diterapkan' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* 1. API CONFIGURATION CARD (Exact match to user screenshot) */}
      <div className="rounded-3xl border border-white/15 bg-slate-950/80 backdrop-blur-2xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-5">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 flex-shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-white">
                  KoboiLLM API Configuration
                </h2>
                <span className="text-[10px] font-black uppercase tracking-wider bg-purple-600/30 text-purple-300 border border-purple-500/40 px-2.5 py-0.5 rounded-full">
                  v8.0 Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Konfigurasi API AI utama untuk generate ide, outline, bab buku, dan copy promosi.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="text-xs h-9 rounded-xl border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 gap-1.5 flex-shrink-0"
          >
            {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
            Cek Jalur API
          </Button>
        </div>

        {/* API Key Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200">
              KoboiLLM API Key <span className="text-red-400">*</span>
            </label>
            {config.apiKey && (
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Tersimpan di sistem
              </span>
            )}
          </div>

          <div className="relative">
            <Input
              type={showKey ? 'text' : 'password'}
              placeholder="Masukkan API Key (cth: sk-... atau koboillm-...)"
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              className="bg-white/[0.06] border-white/15 text-white pr-10 rounded-2xl h-11 text-xs sm:text-sm font-mono placeholder:text-slate-500 focus:border-purple-500"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            API key disimpan secara aman dan otomatis dipulihkan saat browser di-refresh.
          </p>
        </div>

        {/* Endpoint URL Field & Presets */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-purple-400" /> API Endpoint URL (Jalur API)
          </label>
          <Input
            value={config.endpointUrl}
            onChange={(e) => setConfig({ ...config, endpointUrl: e.target.value })}
            placeholder="https://api.koboillm.com/v1/chat/completions"
            className="bg-white/[0.06] border-white/15 text-white rounded-2xl h-11 text-xs sm:text-sm font-mono placeholder:text-slate-500 focus:border-purple-500"
          />

          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-[11px] font-semibold text-slate-400">Preset Cepat:</span>
            <button
              type="button"
              onClick={() => applyPreset('koboillm')}
              className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200"
            >
              KoboiLLM Official
            </button>
            <button
              type="button"
              onClick={() => applyPreset('openai')}
              className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200"
            >
              OpenAI Standard
            </button>
            <button
              type="button"
              onClick={() => applyPreset('openrouter')}
              className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200"
            >
              OpenRouter
            </button>
            <button
              type="button"
              onClick={() => applyPreset('groq')}
              className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200"
            >
              Groq Cloud
            </button>
          </div>
        </div>

        {/* Model Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-200">Model AI</label>
          <select
            value={config.model}
            onChange={(e) => setConfig({ ...config, model: e.target.value })}
            className="w-full h-11 rounded-2xl bg-white/[0.06] border border-white/15 px-3 text-xs sm:text-sm font-medium text-white focus:outline-none focus:border-purple-500"
          >
            <option value="gpt-4o-mini" className="bg-slate-900 text-white">
              GPT-4o Mini (Direkomendasikan - Cepat & Hemat)
            </option>
            <option value="gpt-4o" className="bg-slate-900 text-white">
              GPT-4o (High Intelligence & Complex Copywriting)
            </option>
            <option value="claude-3-5-sonnet-20241022" className="bg-slate-900 text-white">
              Claude 3.5 Sonnet (Nuance Copywriting)
            </option>
            <option value="deepseek/deepseek-chat" className="bg-slate-900 text-white">
              DeepSeek V3 (Ultra Fast & Smart)
            </option>
            <option value="deepseek/deepseek-r1" className="bg-slate-900 text-white">
              DeepSeek R1 (Reasoning Master)
            </option>
            <option value="llama-3.3-70b-versatile" className="bg-slate-900 text-white">
              Llama 3.3 70B (High Speed Open Source)
            </option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10 flex-wrap">
          <Button
            type="button"
            variant="outline"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="rounded-2xl border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold text-xs h-10 px-5 gap-2"
          >
            {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-400" />}
            Uji Jalur API
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xs sm:text-sm h-10 px-6 rounded-2xl gap-2 shadow-lg shadow-purple-600/30"
          >
            <Save className="w-4 h-4" />
            Simpan Pengaturan
          </Button>
        </div>

        {testResult && (
          <div
            className={`p-3.5 rounded-2xl border text-xs animate-in fade-in duration-200 ${
              testResult.success
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            {testResult.success ? '✅ ' : '❌ '} {testResult.message}
          </div>
        )}
      </div>

      {/* 2. UJI INTERAKTIF AI KOBOILLM (Live Chat Test matching Screenshot 1) */}
      <div className="rounded-3xl border border-white/15 bg-slate-950/80 backdrop-blur-2xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-white">
            Uji Interaktif AI KoboiLLM
          </h3>
          <p className="text-xs text-slate-400">
            Kirim pesan live untuk memastikan model AI merespon dengan cepat dan tepat.
          </p>
        </div>

        {/* Live Chat Box Container */}
        <div className="rounded-2xl border border-white/15 bg-slate-900/60 overflow-hidden flex flex-col">
          {/* Chat Box Header */}
          <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
            <div className="flex items-center gap-2">
              <span className="text-purple-400 font-bold text-xs flex items-center gap-1.5">
                💬 Live Chat Test
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-white/10 text-slate-300 px-2 py-0.5 rounded-full">
              Model: {config.model}
            </span>
          </div>

          <div className="p-2 text-[11px] text-slate-400 border-b border-white/5 bg-white/[0.01] px-4">
            Kirim pesan pengujian untuk melihat respon instan dari model KoboiLLM yang aktif.
          </div>

          {/* Messages Area */}
          <div className="p-4 min-h-[220px] max-h-[340px] overflow-y-auto space-y-3">
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                  <Bot className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-300">Belum ada percakapan pengujian</p>
                <p className="text-[11px]">Ketik pesan di bawah untuk menguji jalur API</p>
              </div>
            ) : (
              chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 flex-shrink-0 text-xs mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white font-medium'
                        : 'bg-white/[0.08] border border-white/10 text-slate-100'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <span className="text-[9px] opacity-60 mt-1 block text-right">
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary flex-shrink-0 text-xs mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))
            )}

            {isChatting && (
              <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-500/10 p-2.5 rounded-xl w-fit animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>KoboiLLM sedang menyusun jawaban...</span>
              </div>
            )}
          </div>

          {/* Bottom Chat Input Form */}
          <form onSubmit={handleSendLiveTest} className="p-3 border-t border-white/10 bg-white/[0.02] flex items-center gap-2">
            <Input
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Ketik pesan tes, misal: 'Tuliskan hook 1 kalimat untuk buku bisnis'..."
              className="flex-1 bg-white/[0.06] border-white/15 text-white text-xs h-10 rounded-xl placeholder:text-slate-500 focus:border-purple-500"
              disabled={isChatting}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!testInput.trim() || isChatting}
              className="h-10 w-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex-shrink-0 shadow-md shadow-purple-600/30"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
