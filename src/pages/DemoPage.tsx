import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Demo1 from "@/components/demos/Demo1";
import Demo2 from "@/components/demos/Demo2";
import Demo3 from "@/components/demos/Demo3";
import Demo4 from "@/components/demos/Demo4";
import Demo5 from "@/components/demos/Demo5";
import Demo6 from "@/components/demos/Demo6";
import Demo7 from "@/components/demos/Demo7";
import Demo8 from "@/components/demos/Demo8";
import { useCallback, useEffect } from "react";

const demoComponents: Record<string, React.FC> = {
  "1": Demo1, "2": Demo2, "3": Demo3, "4": Demo4,
  "5": Demo5, "6": Demo6, "7": Demo7, "8": Demo8,
};

const DemoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const DemoComponent = demoComponents[id || ""];
  const isInIframe = window !== window.parent;

  const handleBack = useCallback(() => {
    if (isInIframe) {
      try { window.parent.postMessage({ type: 'closeDemo' }, '*'); } catch {}
      try { (window.parent as any).closeDemo?.(); } catch {}
    } else {
      navigate("/");
    }
  }, [isInIframe, navigate]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'closeDemo') handleBack();
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [handleBack]);

  if (!DemoComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Demo Not Found</h1>
          <Link to="/" className="text-primary underline">← Kembali</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleBack}
        className="fixed top-4 left-4 z-50 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm hover:bg-black transition-colors shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali
      </button>
      <DemoComponent />
    </div>
  );
};

export default DemoPage;
