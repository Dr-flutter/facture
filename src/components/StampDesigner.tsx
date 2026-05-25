import { useState } from "react";
import type { StampConfig } from "@/lib/invoice-types";
import { DigitalStamp } from "@/components/DigitalStamp";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const PRESETS = [
  { color: "#c4154d", label: "Rouge" },
  { color: "#1d4ed8", label: "Bleu" },
  { color: "#15803d", label: "Vert" },
  { color: "#0a0a0a", label: "Noir" },
  { color: "#7b2068", label: "Violet" },
];

type Props = {
  initial: StampConfig | null;
  onSave: (config: StampConfig | null) => void;
};

export function StampDesigner({ initial, onSave }: Props) {
  const [cfg, setCfg] = useState<StampConfig>(
    initial || {
      text: "VOTRE ENTREPRISE",
      subtext: "OFFICIEL",
      shape: "round",
      color: "#1d4ed8",
      style: "official",
    }
  );

  const update = (patch: Partial<StampConfig>) => setCfg({ ...cfg, ...patch });

  return (
    <div className="space-y-4">
      <div className="flex justify-center bg-muted/30 rounded-2xl p-6">
        <DigitalStamp config={cfg} size={160} />
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-xs">Texte principal</Label>
          <Input
            value={cfg.text}
            onChange={(e) => update({ text: e.target.value })}
            placeholder="Nom de l'entreprise"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs">Sous-texte</Label>
          <Input
            value={cfg.subtext}
            onChange={(e) => update({ subtext: e.target.value })}
            placeholder="OFFICIEL"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Forme</Label>
            <div className="flex gap-2 mt-1">
              {(["round", "oval"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => update({ shape: s })}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${
                    cfg.shape === s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/70"
                  }`}
                >
                  {s === "round" ? "Rond" : "Ovale"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-xs">Style</Label>
            <div className="flex gap-2 mt-1">
              {(["ink", "official"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => update({ style: s })}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${
                    cfg.style === s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/70"
                  }`}
                >
                  {s === "ink" ? "Encre" : "Officiel"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Label className="text-xs">Couleur d'encre</Label>
          <div className="flex gap-2 mt-2 flex-wrap">
            {PRESETS.map((p) => (
              <button
                key={p.color}
                onClick={() => update({ color: p.color })}
                className={`w-9 h-9 rounded-full border-2 transition ${
                  cfg.color === p.color
                    ? "border-foreground scale-110"
                    : "border-border"
                }`}
                style={{ backgroundColor: p.color }}
                title={p.label}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="outline" className="flex-1" onClick={() => onSave(null)}>
          Retirer
        </Button>
        <Button className="flex-1" onClick={() => onSave(cfg)}>
          Appliquer
        </Button>
      </div>
    </div>
  );
}
