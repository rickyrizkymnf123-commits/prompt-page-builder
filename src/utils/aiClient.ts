import { supabase } from '@/integrations/supabase/client';

export interface AiApiConfig {
  apiKey: string;
  endpointUrl: string;
  model: string;
}

export const DEFAULT_AI_CONFIG: AiApiConfig = {
  apiKey: '',
  endpointUrl: 'https://api.koboillm.com/v1/chat/completions',
  model: 'gpt-4o-mini',
};

const STORAGE_KEY = 'lpb_ai_config';
let memoryConfig: AiApiConfig | null = null;

export function getStoredAiConfig(): AiApiConfig {
  if (memoryConfig && memoryConfig.apiKey) {
    return memoryConfig;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const cfg: AiApiConfig = {
        apiKey: parsed.apiKey || '',
        endpointUrl: parsed.endpointUrl || DEFAULT_AI_CONFIG.endpointUrl,
        model: parsed.model || DEFAULT_AI_CONFIG.model,
      };
      memoryConfig = cfg;
      return cfg;
    }
  } catch {}
  return DEFAULT_AI_CONFIG;
}

export async function saveStoredAiConfig(config: AiApiConfig): Promise<void> {
  memoryConfig = config;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {}

  // Also sync to Supabase app_settings for global persistence
  try {
    await supabase.from('app_settings').upsert(
      {
        key: 'lpb_ai_config',
        value: JSON.stringify(config),
        updated_at: new Date().toISOString(),
      } as any,
      { onConflict: 'key' }
    );
  } catch (e) {
    console.warn('Could not sync AI config to Supabase app_settings:', e);
  }
}

export async function syncAiConfigFromCloud(): Promise<AiApiConfig> {
  try {
    const { data } = await (supabase as any)
      .from('app_settings')
      .select('value')
      .eq('key', 'lpb_ai_config')
      .maybeSingle();

    if (data?.value) {
      const parsed = JSON.parse(data.value);
      if (parsed && parsed.apiKey) {
        const cloudConfig: AiApiConfig = {
          apiKey: parsed.apiKey,
          endpointUrl: parsed.endpointUrl || DEFAULT_AI_CONFIG.endpointUrl,
          model: parsed.model || DEFAULT_AI_CONFIG.model,
        };
        memoryConfig = cloudConfig;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudConfig));
        return cloudConfig;
      }
    }
  } catch {}
  return getStoredAiConfig();
}

// Auto-sync on startup
if (typeof window !== 'undefined') {
  syncAiConfigFromCloud();
}

export async function testAiApiConnection(config: AiApiConfig): Promise<{ success: boolean; message: string }> {
  if (!config.apiKey.trim()) {
    return { success: false, message: 'API Key belum diisi. Masukkan API key terlebih dahulu.' };
  }

  try {
    const response = await fetch(config.endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: config.model || 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Ping test' }],
        max_tokens: 5,
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      const msg = errJson?.error?.message || `HTTP Error ${response.status}: ${response.statusText}`;
      return { success: false, message: msg };
    }

    const data = await response.json();
    if (data?.choices?.[0]?.message) {
      return { success: true, message: 'Jalur API KoboiLLM terhubung dan aktif!' };
    }
    return { success: true, message: 'Respon diterima dari API.' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Gagal menghubungi server API.' };
  }
}

export async function sendAiChatMessage(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  customConfig?: Partial<AiApiConfig>
): Promise<string> {
  let currentConfig = { ...getStoredAiConfig(), ...customConfig };

  if (!currentConfig.apiKey.trim()) {
    // Try one more cloud sync
    const synced = await syncAiConfigFromCloud();
    currentConfig = { ...synced, ...customConfig };
  }

  if (!currentConfig.apiKey.trim()) {
    throw new Error('API Key KoboiLLM belum diatur oleh Administrator di panel Admin.');
  }

  const response = await fetch(currentConfig.endpointUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentConfig.apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: currentConfig.model || 'gpt-4o-mini',
      messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => null);
    throw new Error(errJson?.error?.message || `Error API ${response.status}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || '';
}
