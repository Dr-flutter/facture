import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Eraser, Check } from "lucide-react";

type Props = {
  initial?: string;
  onSave: (dataUrl: string | undefined) => void;
};

export function SignaturePad({ initial, onSave }: Props) {
  const ref = useRef<SignatureCanvas>(null);
  const [hasInk, setHasInk] = useState(!!initial);

  const clear = () => {
    ref.current?.clear();
    setHasInk(false);
    onSave(undefined);
  };

  const save = () => {
    if (!ref.current || ref.current.isEmpty()) return;
    const url = ref.current.getCanvas().toDataURL("image/png");
    onSave(url);
  };

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-soft">
        <SignatureCanvas
          ref={ref}
          penColor="#1a1a2e"
          canvasProps={{
            className: "w-full h-48 touch-none",
            style: { display: "block" },
          }}
          onEnd={() => setHasInk(true)}
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={clear} className="flex-1">
          <Eraser className="w-4 h-4 mr-2" /> Effacer
        </Button>
        <Button onClick={save} disabled={!hasInk} className="flex-1">
          <Check className="w-4 h-4 mr-2" /> Valider
        </Button>
      </div>
      {initial && (
        <div className="rounded-xl bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground mb-2">Signature actuelle :</p>
          <img src={initial} alt="signature" className="h-16" />
        </div>
      )}
    </div>
  );
}
