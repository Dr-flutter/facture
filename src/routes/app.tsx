import { createFileRoute, Link, Navigate, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Plus, LogOut, Search, Copy, Trash2, Pencil } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { formatMoney } from "@/lib/invoice-types";
import { toast } from "sonner";

export const Route = createFileRoute("/app")({
  component: AppDashboard,
});

type InvoiceRow = {
  id: string;
  invoice_number: string;
  total: number;
  created_at: string;
  data: { subject?: string; date?: string; location?: string; currency?: string };
};

function AppDashboard() {
  const { user, loading, signOut } = useAuth();
  const [invoices, setInvoices] = useState<InvoiceRow[] | null>(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === "/app";

  useEffect(() => {
    if (!user || !isDashboard) return;
    supabase
      .from("invoices")
      .select("id, invoice_number, total, created_at, data")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error("Chargement impossible");
        else setInvoices((data as unknown as InvoiceRow[]) || []);
      });
  }, [user, isDashboard]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="text-sm text-muted-foreground">Chargement…</span></div>;
  if (!user) return <Navigate to="/auth" />;
  if (!isDashboard) return <Outlet />;

  const filtered = (invoices || []).filter((i) => {
    const q = search.toLowerCase();
    return (
      !q ||
      i.invoice_number.toLowerCase().includes(q) ||
      (i.data?.subject || "").toLowerCase().includes(q) ||
      (i.data?.location || "").toLowerCase().includes(q)
    );
  });

  const duplicate = async (row: InvoiceRow) => {
    const { data: full } = await supabase.from("invoices").select("*").eq("id", row.id).single();
    if (!full) return;
    const { data: copy } = await supabase.from("invoices").insert({
      user_id: user.id,
      invoice_number: `${full.invoice_number}-copie`,
      template: full.template,
      data: full.data,
      total: full.total,
    }).select().single();
    if (copy) {
      toast.success("Facture dupliquée");
      navigate({ to: "/app/editor/$id", params: { id: copy.id } });
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette facture ?")) return;
    const { error } = await supabase.from("invoices").delete().eq("id", id);
    if (error) toast.error("Échec");
    else {
      setInvoices((arr) => (arr || []).filter((i) => i.id !== id));
      toast.success("Supprimée");
    }
  };

  return (
    <div className="min-h-screen pb-10">
      <header className="glass sticky top-0 z-40 px-4 py-3 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
            <FileText className="w-4 h-4 text-background" />
          </div>
          <span className="font-display font-bold">Facturio<span className="font-sans font-normal italic text-[10px] text-muted-foreground ml-1.5">by Ndam digit</span></span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button onClick={() => signOut()} aria-label="Déconnexion" className="text-sm text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-foreground/5 transition">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>


      <main className="max-w-3xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-display font-bold">Mes factures</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} facture{filtered.length > 1 ? "s" : ""}</p>
          </div>
          <Button asChild className="rounded-xl h-11 px-5 shadow-elevated">
            <Link to="/app/editor/$id" params={{ id: "new" }}>
              <Plus className="w-4 h-4 mr-2" /> Nouvelle
            </Link>
          </Button>
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une facture..."
            className="pl-10 h-11 rounded-xl glass border-white/40"
          />
        </div>

        {invoices === null ? (
          <div className="text-center text-sm text-muted-foreground py-10">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-foreground mx-auto flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-background" />
            </div>

            <h3 className="font-semibold">Aucune facture pour l'instant</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-5">
              Créez votre première facture en quelques secondes.
            </p>
            <Button asChild className="rounded-xl">
              <Link to="/app/editor/$id" params={{ id: "new" }}>
                <Plus className="w-4 h-4 mr-2" /> Créer une facture
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((i) => (
              <div key={i.id} className="glass rounded-2xl p-4 flex items-center gap-3 shadow-soft animate-fade-in-up">
                <div className="w-11 h-11 rounded-xl bg-foreground flex items-center justify-center text-background text-xs font-bold flex-shrink-0">
                  N°
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{i.data?.subject || i.invoice_number}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {i.invoice_number} · {new Date(i.created_at).toLocaleDateString("fr-FR")}
                    {i.data?.location ? ` · ${i.data.location}` : ""}
                  </p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="font-bold text-sm">{formatMoney(Number(i.total), i.data?.currency || "f")}</p>
                </div>
                <div className="flex gap-1">
                  <Button asChild size="sm" variant="ghost" className="h-9 w-9 p-0">
                    <Link to="/app/editor/$id" params={{ id: i.id }}>
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="ghost" className="h-9 w-9 p-0" onClick={() => duplicate(i)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-9 w-9 p-0 text-destructive" onClick={() => remove(i.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
