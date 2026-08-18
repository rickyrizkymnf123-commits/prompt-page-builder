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

export function getStoredAiConfig(): AiApiConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        apiKey: parsed.apiKey || '',
        endpointUrl: parsed.endpointUrl || DEFAULT_AI_CONFIG.endpointUrl,
        model: parsed.model || DEFAULT_AI_CONFIG.model,
      };
    }
  } catch {}
  return DEFAULT_AI_CONFIG;
}

export function saveStoredAiConfig(config: AiApiConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {}
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
  const currentConfig = { ...getStoredAiConfig(), ...customConfig };

  if (!currentConfig.apiKey.trim()) {
    throw new Error('API Key belum diisi. Silakan isi API Key di menu Konfigurasi API AI.');
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
