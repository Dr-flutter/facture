import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { FileText, PenLine, Stamp, Sparkles, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl px-6 py-4 text-sm text-muted-foreground">
          Chargement...
        </div>
      </div>
    );
  }

  if (user) return <Navigate to="/app" />;

  return (
    <div className="min-h-screen relative">
      <div className="relative max-w-6xl mx-auto px-5 pt-6 pb-16">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center">
              <FileText className="w-5 h-5 text-background" />
            </div>
            <span className="font-display font-bold text-lg">Facturio<span className="font-sans font-normal italic text-[11px] text-muted-foreground ml-1.5">by Ndam digit</span></span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link
              to="/auth"
              className="text-sm font-medium px-4 py-2 rounded-xl hover:bg-foreground/5 transition"
            >
              Se connecter
            </Link>
          </div>
        </header>

        <main className="mt-20 lg:mt-32 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 glass px-3.5 py-1.5 rounded-full text-xs font-medium mb-7 animate-fade-in-up">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Factures premium en quelques secondes</span>
          </div>
          <h1 className="font-display font-bold text-5xl lg:text-7xl tracking-tight leading-[1.02] animate-fade-in-up">
            Des factures.<br />
            <span className="gradient-text">Sans friction.</span>
          </h1>
          <p className="mt-6 text-base lg:text-lg text-muted-foreground max-w-xl mx-auto animate-fade-in-up">
            Créez, signez, tamponnez et exportez en PDF. Conçu pour le mobile, pensé comme une app native.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up">
            <Link
              to="/auth"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-foreground text-background font-medium hover:opacity-90 transition shadow-elevated"
            >
              Commencer gratuitement
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-2xl glass font-medium hover:bg-foreground/[0.03] transition"
            >
              Se connecter
            </Link>
          </div>
        </main>

        <section className="mt-24 grid sm:grid-cols-3 gap-4">
          {[
            { icon: FileText, title: "Modèle premium", desc: "3 templates, design fidèle." },
            { icon: PenLine, title: "Signature au doigt", desc: "Signez directement à l'écran." },
            { icon: Stamp, title: "Cachet réaliste", desc: "Rond, ovale, encre personnalisée." },
          ].map((f, i) => (
            <div key={i} className="glass rounded-3xl p-6 shadow-soft animate-fade-in-up">
              <div className="w-10 h-10 rounded-xl bg-foreground/5 border border-border flex items-center justify-center mb-3">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
