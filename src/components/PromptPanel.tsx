import { Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Props {
  promptText: string;
  hasPrompt: boolean;
}

export function PromptPanel({ promptText, hasPrompt }: Props) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(promptText);
    toast({ title: 'Prompt disalin!', description: 'Prompt sudah ada di clipboard.' });
  };

  const handleBuat = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
    } catch {
      // fallback: silently fail clipboard, still open tab
    }
    // Buka chat.z.ai tanpa query param agar tidak ada error 414
    window.open('https://chat.z.ai/', '_blank', 'noopener,noreferrer');
    toast({
      title: '✅ Prompt sudah disalin!',
      description: 'Halaman chat.z.ai sudah terbuka. Paste prompt (Ctrl+V / Cmd+V) lalu tekan Enter.',
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">🤖 AI Prompt Output</h2>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPrompt}
          onClick={handleCopy}
          className="gap-2"
        >
          <Copy className="h-4 w-4" />
          Salin Prompt
        </Button>
      </div>

      <ScrollArea className="flex-1 mb-4">
        <div className="rounded-lg bg-secondary p-4 min-h-[200px]">
          {hasPrompt ? (
            <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
              {promptText}
            </pre>
          ) : (
            <p className="text-muted-foreground text-sm italic">
              Prompt akan muncul di sini setelah kamu klik "Generate Prompt ⚡"
            </p>
          )}
        </div>
      </ScrollArea>

      <Button
        disabled={!hasPrompt}
        onClick={handleBuat}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2"
        size="lg"
      >
        <ExternalLink className="h-4 w-4" />
        Buat Landing Page
      </Button>
    </div>
  );
}
