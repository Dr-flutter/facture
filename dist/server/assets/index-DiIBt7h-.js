import { L as jsxRuntimeExports } from "./server-yV66q4WE.js";
import { u as useAuth, N as Navigate, L as Link } from "./router-Cr9f9ArS.js";
import { T as ThemeToggle } from "./ThemeToggle-BZFNumPv.js";
import { F as FileText } from "./file-text-CBITuEeC.js";
import { c as createLucideIcon } from "./createLucideIcon-hkZg55hz.js";
import { P as PenLine, S as Stamp } from "./stamp-meq3I0eE.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
      key: "1s2grr"
    }
  ],
  ["path", { d: "M20 2v4", key: "1rf3ol" }],
  ["path", { d: "M22 4h-4", key: "gwowj6" }],
  ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
function Index() {
  const {
    user,
    loading
  } = useAuth();
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl px-6 py-4 text-sm text-muted-foreground", children: "Chargement..." }) });
  }
  if (user) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/app" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-6xl mx-auto px-5 pt-6 pb-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-foreground flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5 text-background" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-lg", children: [
          "Facturio",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-sans font-normal italic text-[11px] text-muted-foreground ml-1.5", children: "by Ndam digit" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", className: "text-sm font-medium px-4 py-2 rounded-xl hover:bg-foreground/5 transition", children: "Se connecter" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mt-20 lg:mt-32 text-center max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 glass px-3.5 py-1.5 rounded-full text-xs font-medium mb-7 animate-fade-in-up", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Factures premium en quelques secondes" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-5xl lg:text-7xl tracking-tight leading-[1.02] animate-fade-in-up", children: [
        "Des factures.",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-text", children: "Sans friction." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-base lg:text-lg text-muted-foreground max-w-xl mx-auto animate-fade-in-up", children: "Créez, signez, tamponnez et exportez en PDF. Conçu pour le mobile, pensé comme une app native." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/auth", className: "group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-foreground text-background font-medium hover:opacity-90 transition shadow-elevated", children: [
          "Commencer gratuitement",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 group-hover:translate-x-1 transition" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", className: "inline-flex items-center justify-center px-7 py-3.5 rounded-2xl glass font-medium hover:bg-foreground/[0.03] transition", children: "Se connecter" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mt-24 grid sm:grid-cols-3 gap-4", children: [{
      icon: FileText,
      title: "Modèle premium",
      desc: "3 templates, design fidèle."
    }, {
      icon: PenLine,
      title: "Signature au doigt",
      desc: "Signez directement à l'écran."
    }, {
      icon: Stamp,
      title: "Cachet réaliste",
      desc: "Rond, ovale, encre personnalisée."
    }].map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-6 shadow-soft animate-fade-in-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-foreground/5 border border-border flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "w-5 h-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: f.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: f.desc })
    ] }, i)) })
  ] }) });
}
export {
  Index as component
};
