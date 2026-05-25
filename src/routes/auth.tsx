import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!phone || !password) return;
    if (mode === "signup" && !fullName) {
      toast.error("Entrez votre nom complet");
      return;
    }
    if (password.length < 6) {
      toast.error("Mot de passe : minimum 6 caractères");
      return;
    }
    try {
      setLoading(true);
      const res = mode === "signup"
        ? await signUp(phone, fullName, password)
        : await signIn(phone, password);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success(mode === "signup" ? "Compte créé !" : "Connecté");
      navigate({ to: "/app" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Action impossible";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-5 py-8 noise">
      <div
        className="absolute inset-x-0 top-0 h-[500px] pointer-events-none opacity-60"
        style={{ background: "radial-gradient(ellipse 50% 40% at 50% 0%, oklch(1 0 0 / 0.06) 0%, transparent 70%)" }}
      />

      <div className="relative w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground transition">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>

        <div className="glass rounded-2xl p-7 shadow-elevated">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold text-sm">
              F
            </div>
            <span className="font-display font-semibold">Facturio<span className="font-sans font-normal italic text-[10px] text-muted-foreground ml-1.5">by Ndam digit</span></span>
          </div>
          <h1 className="text-2xl font-display font-bold mt-4">
            {mode === "signup" ? "Créer un compte" : "Connexion"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signup"
              ? "Commencez à générer vos factures en quelques secondes."
              : "Heureux de vous revoir."}
          </p>

          <form onSubmit={submit} action="javascript:void(0)" className="mt-6 space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Votre nom"
                  className="mt-1.5"
                  autoComplete="name"
                />
              </div>
            )}
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="6 XX XX XX XX"
                className="mt-1.5"
                autoComplete="tel"
              />
            </div>
            <div>
              <Label htmlFor="pw">Mot de passe</Label>
              <Input
                id="pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </div>
            <Button type="submit" aria-busy={loading} disabled={loading} className="w-full h-11 rounded-xl">
              {loading ? "..." : mode === "signup" ? "Créer mon compte" : "Se connecter"}
            </Button>
          </form>

          <button
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="mt-5 w-full text-center text-sm text-muted-foreground hover:text-foreground transition"
          >
            {mode === "signup"
              ? "Déjà un compte ? Se connecter"
              : "Pas encore inscrit ? Créer un compte"}
          </button>
        </div>
      </div>
    </div>
  );
}
