import { createFileRoute, Navigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { defaultInvoiceData, generateInvoiceNumber, type InvoiceData } from "@/lib/invoice-types";
import { InvoiceEditor } from "@/components/InvoiceEditor";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/app/editor/$id")({
  component: EditorPage,
});

function EditorPage() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const [data, setData] = useState<InvoiceData | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | undefined>();

  useEffect(() => {
    if (!user) return;
    if (id === "new") {
      setData(defaultInvoiceData(generateInvoiceNumber()));
      setInvoiceId(undefined);
      return;
    }
    supabase
      .from("invoices")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data: row }) => {
        if (row) {
          setData(row.data as unknown as InvoiceData);
          setInvoiceId(row.id);
        }
      });
  }, [id, user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Chargement…</div>;
  if (!user) return <Navigate to="/auth" />;
  if (!data) return <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Chargement de la facture…</div>;

  return (
    <div>
      <header className="glass sticky top-0 z-40 px-4 py-3 flex items-center gap-3 border-b border-border">
        <Link to="/app" className="p-2 rounded-lg hover:bg-foreground/5 transition">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="font-display font-semibold truncate flex-1">
          {invoiceId ? "Modifier" : "Nouvelle facture"}
        </h1>
        <ThemeToggle />
      </header>
      <InvoiceEditor initial={data} invoiceId={invoiceId} userId={user.id} />
    </div>
  );
}
