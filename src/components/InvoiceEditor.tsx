import { useRef, useState } from "react";
import type { InvoiceData, InvoiceItem, TemplateId } from "@/lib/invoice-types";
import { computeTotals, formatMoney } from "@/lib/invoice-types";
import { EventTemplate } from "@/components/templates/EventTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import { MonoTemplate } from "@/components/templates/MonoTemplate";
import { SignaturePad } from "@/components/SignaturePad";
import { StampDesigner } from "@/components/StampDesigner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus, Trash2, Download, Share2, Eye, Save, PenLine, Stamp, Settings2, LayoutTemplate } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { exportElementToPDF, shareElementAsPDF } from "@/lib/pdf-export";
import { useNavigate } from "@tanstack/react-router";

const TEMPLATES: { id: TemplateId; label: string; desc: string }[] = [
  { id: "minimal", label: "Minimal", desc: "Apple-style, sobre" },
  { id: "mono", label: "Mono", desc: "Vercel, dark premium" },
  { id: "event", label: "Event", desc: "Coloré, événementiel" },
];

function RenderTemplate({ id, data, refEl }: { id: TemplateId; data: InvoiceData; refEl?: React.Ref<HTMLDivElement> }) {
  if (id === "event") return <EventTemplate ref={refEl} data={data} />;
  if (id === "mono") return <MonoTemplate ref={refEl} data={data} />;
  return <MinimalTemplate ref={refEl} data={data} />;
}

type Props = {
  initial: InvoiceData;
  invoiceId?: string;
  userId: string;
};

export function InvoiceEditor({ initial, invoiceId, userId }: Props) {
  const [data, setData] = useState<InvoiceData>(initial);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const totals = computeTotals(data);
  const update = <K extends keyof InvoiceData>(k: K, v: InvoiceData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const addItem = () => {
    const item: InvoiceItem = {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unitPrice: 0,
    };
    update("items", [...data.items, item]);
  };

  const updateItem = (id: string, patch: Partial<InvoiceItem>) =>
    update(
      "items",
      data.items.map((i) => (i.id === id ? { ...i, ...patch } : i))
    );

  const removeItem = (id: string) =>
    update("items", data.items.filter((i) => i.id !== id));

  const save = async () => {
    if (!data.headerTitle?.trim()) {
      toast.error("Renseignez le nom de l'entreprise avant d'enregistrer");
      return;
    }
    setSaving(true);
    const payload = {
      user_id: userId,
      invoice_number: data.invoiceNumber,
      template: data.template || "minimal",
      data: data as never,
      total: totals.total,
    };
    try {
      const { error, data: saved } = invoiceId
        ? await supabase.from("invoices").update(payload).eq("id", invoiceId).select().single()
        : await supabase.from("invoices").insert(payload).select().single();
      setSaving(false);
      if (error) {
        console.error("Save invoice error:", error);
        toast.error(`Erreur: ${error.message}`);
        return;
      }
      toast.success("Facture enregistrée");
      if (!invoiceId && saved) {
        navigate({ to: "/app/editor/$id", params: { id: saved.id } });
      }
    } catch (e) {
      setSaving(false);
      const msg = e instanceof Error ? e.message : "inconnue";
      console.error(e);
      toast.error(`Erreur: ${msg}`);
    }
  };

  const download = async () => {
    if (!exportRef.current) return;
    toast.loading("Génération du PDF...", { id: "pdf" });
    try {
      await exportElementToPDF(exportRef.current, `${data.invoiceNumber || "facture"}.pdf`);
      toast.success("PDF téléchargé", { id: "pdf" });
    } catch {
      toast.error("Erreur PDF", { id: "pdf" });
    }
  };

  const share = async () => {
    if (!exportRef.current) return;
    try {
      await shareElementAsPDF(exportRef.current, `${data.invoiceNumber || "facture"}.pdf`);
    } catch {
      toast.error("Partage impossible");
    }
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Hidden full-size for PDF export */}
      <div className="fixed -left-[10000px] top-0 pointer-events-none" aria-hidden>
        <RenderTemplate id={data.template || "minimal"} data={data} refEl={exportRef} />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 pb-12">
        <div className="grid lg:grid-cols-[1fr_580px] gap-6">
          {/* === FORM === */}
          <div className="space-y-5 order-2 lg:order-1">
            <Section title="Modèle" icon={<LayoutTemplate className="w-4 h-4" />}>
              <div className="grid grid-cols-3 gap-2">
                {TEMPLATES.map((t) => {
                  const active = (data.template || "minimal") === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => update("template", t.id)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        active
                          ? "border-white bg-white/[0.08] shadow-glow"
                          : "border-white/10 hover:border-white/30 bg-white/[0.02]"
                      }`}
                    >
                      <p className="text-xs font-semibold">{t.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{t.desc}</p>
                    </button>
                  );
                })}
              </div>
            </Section>

            <Section title="En-tête" icon={<Settings2 className="w-4 h-4" />}>
              <Field label="Titre entreprise">
                <Input
                  value={data.headerTitle}
                  onChange={(e) => update("headerTitle", e.target.value)}
                  placeholder="VOTRE ENTREPRISE"
                />
              </Field>
              <Field label="Téléphones">
                <Input
                  value={data.headerPhones}
                  onChange={(e) => update("headerPhones", e.target.value)}
                  placeholder="6 XX XX XX XX"
                />
              </Field>
              <Field label="Tagline">
                <Input
                  value={data.headerTagline}
                  onChange={(e) => update("headerTagline", e.target.value)}
                />
              </Field>
            </Section>

            <Section title="Facture">
              <div className="grid grid-cols-2 gap-3">
                <Field label="N° facture">
                  <Input
                    value={data.invoiceNumber}
                    onChange={(e) => update("invoiceNumber", e.target.value)}
                  />
                </Field>
                <Field label="Devise">
                  <Input
                    value={data.currency}
                    onChange={(e) => update("currency", e.target.value)}
                  />
                </Field>
                <Field label="Date">
                  <Input
                    value={data.date}
                    onChange={(e) => update("date", e.target.value)}
                    placeholder="1NOVEMBRE2025"
                  />
                </Field>
                <Field label="Lieu">
                  <Input
                    value={data.location}
                    onChange={(e) => update("location", e.target.value)}
                    placeholder="TRADEX BASTOS"
                  />
                </Field>
              </div>
              <Field label="Sujet">
                <Input
                  value={data.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  placeholder="Décoration mariage"
                />
              </Field>
            </Section>

            <Section title="Articles">
              <Field label="Titre de la description">
                <Input
                  value={data.descriptionTitle}
                  onChange={(e) => update("descriptionTitle", e.target.value)}
                />
              </Field>
              <div className="space-y-2 mt-2">
                {data.items.map((it) => (
                  <div
                    key={it.id}
                    className="glass rounded-2xl p-3 grid grid-cols-[1fr_70px_100px_auto] gap-2 items-center"
                  >
                    <Input
                      value={it.description}
                      placeholder="Description"
                      onChange={(e) => updateItem(it.id, { description: e.target.value })}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      min={1}
                      value={it.quantity}
                      onChange={(e) =>
                        updateItem(it.id, { quantity: Number(e.target.value) || 1 })
                      }
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      min={0}
                      value={it.unitPrice}
                      onChange={(e) =>
                        updateItem(it.id, { unitPrice: Number(e.target.value) || 0 })
                      }
                      placeholder="PU"
                      className="text-sm"
                    />
                    <button
                      onClick={() => removeItem(it.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <Button variant="outline" onClick={addItem} className="w-full">
                  <Plus className="w-4 h-4 mr-2" /> Ajouter un article
                </Button>
              </div>
            </Section>

            <Section title="Montants">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Avance">
                  <Input
                    type="number"
                    min={0}
                    value={data.advance}
                    onChange={(e) => update("advance", Number(e.target.value) || 0)}
                  />
                </Field>
                <Field label="Transport">
                  <Input
                    value={data.transport}
                    onChange={(e) => update("transport", e.target.value)}
                  />
                </Field>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="glass rounded-xl px-4 py-3">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="font-bold text-base">
                    {formatMoney(totals.total, data.currency)}
                  </p>
                </div>
                <div className="glass rounded-xl px-4 py-3">
                  <p className="text-xs text-muted-foreground">Reste</p>
                  <p className="font-bold text-base">
                    {formatMoney(totals.remaining, data.currency)}
                  </p>
                </div>
              </div>
              <Field label="Note caution">
                <Textarea
                  rows={2}
                  value={data.cautionText}
                  onChange={(e) => update("cautionText", e.target.value)}
                />
              </Field>
              <Field label="Note de pied">
                <Textarea
                  rows={2}
                  value={data.footerNote}
                  onChange={(e) => update("footerNote", e.target.value)}
                />
              </Field>
            </Section>

            <Section title="Signature & Cachet">
              <div className="grid grid-cols-2 gap-3">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="h-auto py-3 flex-col gap-2">
                      <PenLine className="w-5 h-5" />
                      <span className="text-xs">
                        {data.signature ? "Modifier" : "Ajouter"} signature
                      </span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="max-h-[90vh]">
                    <SheetHeader>
                      <SheetTitle>Signature manuscrite</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                      <SignaturePad
                        initial={data.signature}
                        onSave={(s) => update("signature", s)}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="h-auto py-3 flex-col gap-2">
                      <Stamp className="w-5 h-5" />
                      <span className="text-xs">
                        {data.stamp ? "Modifier" : "Créer"} cachet
                      </span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Cachet numérique</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                      <StampDesigner
                        initial={data.stamp ?? null}
                        onSave={(s) => update("stamp", s)}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </Section>
          </div>

          {/* === LIVE PREVIEW (desktop) === */}
          <div className="hidden lg:block order-1 lg:order-2">
            <div className="sticky top-6">
              <div className="glass rounded-3xl p-4 shadow-elevated">
                <div className="overflow-hidden rounded-2xl bg-white">
                  <div
                    style={{
                      width: "100%",
                      transformOrigin: "top left",
                      transform: "scale(0.65)",
                      height: 1123 * 0.65,
                    }}
                  >
                    <RenderTemplate id={data.template || "minimal"} data={data} refEl={previewRef} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === STICKY ACTION BAR === */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 pointer-events-none">
        <div className="glass rounded-2xl shadow-elevated max-w-3xl mx-auto p-2 flex gap-2 pointer-events-auto">
          <Button
            variant="outline"
            className="lg:hidden flex-1"
            onClick={() => setPreviewOpen(true)}
          >
            <Eye className="w-4 h-4 mr-2" /> Aperçu
          </Button>
          <Button variant="outline" onClick={save} disabled={saving} className="flex-1">
            <Save className="w-4 h-4 mr-2" /> {saving ? "..." : "Enregistrer"}
          </Button>
          <Button onClick={download} className="flex-1">
            <Download className="w-4 h-4 mr-2" /> PDF
          </Button>
          <Button variant="secondary" onClick={share} className="hidden sm:flex">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* === MOBILE PREVIEW SHEET === */}
      <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
        <SheetContent side="bottom" className="h-[92vh] p-0 overflow-hidden">
          <SheetHeader className="px-4 pt-4">
            <SheetTitle>Aperçu</SheetTitle>
          </SheetHeader>
          <div className="overflow-auto h-full pb-20">
            <div className="px-2 py-4">
              <div
                style={{
                  transformOrigin: "top left",
                  transform: "scale(0.45)",
                  width: 794,
                  height: 1123 * 0.45,
                }}
              >
                <RenderTemplate id={data.template || "minimal"} data={data} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-3xl p-5 shadow-soft animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
