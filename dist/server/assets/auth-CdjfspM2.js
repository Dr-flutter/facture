import { U as reactExports, L as jsxRuntimeExports } from "./server-yV66q4WE.js";
import { u as useAuth, e as useNavigate, L as Link, t as toast } from "./router-Cr9f9ArS.js";
import { I as Input, B as Button } from "./button-DodBI157.js";
import { A as ArrowLeft, L as Label } from "./arrow-left-CGna1T7O.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./createLucideIcon-hkZg55hz.js";
function AuthPage() {
  const [mode, setMode] = reactExports.useState("signup");
  const [phone, setPhone] = reactExports.useState("");
  const [fullName, setFullName] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const {
    signIn,
    signUp
  } = useAuth();
  const navigate = useNavigate();
  const submit = async (e) => {
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
      const res = mode === "signup" ? await signUp(phone, fullName, password) : await signIn(phone, password);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success(mode === "signup" ? "Compte créé !" : "Connecté");
      navigate({
        to: "/app"
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Action impossible";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen relative flex items-center justify-center px-5 py-8 noise", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 top-0 h-[500px] pointer-events-none opacity-60", style: {
      background: "radial-gradient(ellipse 50% 40% at 50% 0%, oklch(1 0 0 / 0.06) 0%, transparent 70%)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
        " Retour"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-7 shadow-elevated", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold text-sm", children: "F" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-semibold", children: [
            "Facturio",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-sans font-normal italic text-[10px] text-muted-foreground ml-1.5", children: "by Ndam digit" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold mt-4", children: mode === "signup" ? "Créer un compte" : "Connexion" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: mode === "signup" ? "Commencez à générer vos factures en quelques secondes." : "Heureux de vous revoir." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, action: "javascript:void(0)", className: "mt-6 space-y-4", children: [
          mode === "signup" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Nom complet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", value: fullName, onChange: (e) => setFullName(e.target.value), placeholder: "Votre nom", className: "mt-1.5", autoComplete: "name" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", children: "Téléphone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "phone", type: "tel", value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "6 XX XX XX XX", className: "mt-1.5", autoComplete: "tel" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pw", children: "Mot de passe" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "pw", type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "••••••••", className: "mt-1.5", autoComplete: mode === "signup" ? "new-password" : "current-password" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", "aria-busy": loading, disabled: loading, className: "w-full h-11 rounded-xl", children: loading ? "..." : mode === "signup" ? "Créer mon compte" : "Se connecter" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMode(mode === "signup" ? "signin" : "signup"), className: "mt-5 w-full text-center text-sm text-muted-foreground hover:text-foreground transition", children: mode === "signup" ? "Déjà un compte ? Se connecter" : "Pas encore inscrit ? Créer un compte" })
      ] })
    ] })
  ] });
}
export {
  AuthPage as component
};
