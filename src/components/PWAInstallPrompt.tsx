import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "facturio.pwa.dismiss";

export function PWAInstallPrompt() {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(DISMISS_KEY)) return;
    const handler = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!visible || !evt) return null;

  const install = async () => {
    await evt.prompt();
    const { outcome } = await evt.userChoice;
    if (outcome === "accepted") localStorage.setItem(DISMISS_KEY, "installed");
    setVisible(false);
  };

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "later");
    setVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-[380px] z-[100] animate-fade-in-up">
      <div className="glass rounded-2xl p-4 shadow-elevated flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center flex-shrink-0">
          <Download className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Installer Facturio</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Accédez à vos factures depuis votre écran d'accueil.
          </p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={install} className="h-8 rounded-lg text-xs">
              Installer
            </Button>
            <Button size="sm" variant="ghost" onClick={dismiss} className="h-8 rounded-lg text-xs">
              Plus tard
            </Button>
          </div>
        </div>
        <button onClick={dismiss} className="text-muted-foreground hover:text-foreground p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
