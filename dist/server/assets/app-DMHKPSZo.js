import { a6 as useRouter, U as reactExports, L as jsxRuntimeExports, O as Outlet } from "./server-yV66q4WE.js";
import { u as useAuth, e as useNavigate, s as supabase, t as toast, N as Navigate, L as Link } from "./router-Cr9f9ArS.js";
import { B as Button, I as Input } from "./button-DodBI157.js";
import { T as ThemeToggle } from "./ThemeToggle-BZFNumPv.js";
import { P as Plus, f as formatMoney, T as Trash2 } from "./invoice-types-DqROAFIU.js";
import { F as FileText } from "./file-text-CBITuEeC.js";
import { c as createLucideIcon } from "./createLucideIcon-hkZg55hz.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function useLocation(opts) {
  const router = useRouter();
  {
    const location = router.stores.location.get();
    return location;
  }
}
const __iconNode$3 = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode$1);
const __iconNode = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode);
function AppDashboard() {
  const {
    user,
    loading,
    signOut
  } = useAuth();
  const [invoices, setInvoices] = reactExports.useState(null);
  const [search, setSearch] = reactExports.useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === "/app";
  reactExports.useEffect(() => {
    if (!user || !isDashboard) return;
    supabase.from("invoices").select("id, invoice_number, total, created_at, data").eq("user_id", user.id).order("created_at", {
      ascending: false
    }).then(({
      data,
      error
    }) => {
      if (error) toast.error("Chargement impossible");
      else setInvoices(data || []);
    });
  }, [user, isDashboard]);
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Chargement…" }) });
  if (!user) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/auth" });
  if (!isDashboard) return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
  const filtered = (invoices || []).filter((i) => {
    const q = search.toLowerCase();
    return !q || i.invoice_number.toLowerCase().includes(q) || (i.data?.subject || "").toLowerCase().includes(q) || (i.data?.location || "").toLowerCase().includes(q);
  });
  const duplicate = async (row) => {
    const {
      data: full
    } = await supabase.from("invoices").select("*").eq("id", row.id).single();
    if (!full) return;
    const {
      data: copy
    } = await supabase.from("invoices").insert({
      user_id: user.id,
      invoice_number: `${full.invoice_number}-copie`,
      template: full.template,
      data: full.data,
      total: full.total
    }).select().single();
    if (copy) {
      toast.success("Facture dupliquée");
      navigate({
        to: "/app/editor/$id",
        params: {
          id: copy.id
        }
      });
    }
  };
  const remove = async (id) => {
    if (!confirm("Supprimer cette facture ?")) return;
    const {
      error
    } = await supabase.from("invoices").delete().eq("id", id);
    if (error) toast.error("Échec");
    else {
      setInvoices((arr) => (arr || []).filter((i) => i.id !== id));
      toast.success("Supprimée");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen pb-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "glass sticky top-0 z-40 px-4 py-3 flex items-center justify-between border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-foreground flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4 text-background" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold", children: [
          "Facturio",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-sans font-normal italic text-[10px] text-muted-foreground ml-1.5", children: "by Ndam digit" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => signOut(), "aria-label": "Déconnexion", className: "text-sm text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-foreground/5 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-3xl mx-auto px-4 pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold", children: "Mes factures" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            filtered.length,
            " facture",
            filtered.length > 1 ? "s" : ""
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "rounded-xl h-11 px-5 shadow-elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/editor/$id", params: {
          id: "new"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
          " Nouvelle"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Rechercher une facture...", className: "pl-10 h-11 rounded-xl glass border-white/40" })
      ] }),
      invoices === null ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-sm text-muted-foreground py-10", children: "Chargement..." }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-10 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-foreground mx-auto flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-7 h-7 text-background" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Aucune facture pour l'instant" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 mb-5", children: "Créez votre première facture en quelques secondes." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/editor/$id", params: {
          id: "new"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
          " Créer une facture"
        ] }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filtered.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-4 flex items-center gap-3 shadow-soft animate-fade-in-up", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-11 rounded-xl bg-foreground flex items-center justify-center text-background text-xs font-bold flex-shrink-0", children: "N°" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold truncate", children: i.data?.subject || i.invoice_number }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
            i.invoice_number,
            " · ",
            new Date(i.created_at).toLocaleDateString("fr-FR"),
            i.data?.location ? ` · ${i.data.location}` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right hidden sm:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm", children: formatMoney(Number(i.total), i.data?.currency || "f") }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", variant: "ghost", className: "h-9 w-9 p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/editor/$id", params: {
            id: i.id
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-4 h-4" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "h-9 w-9 p-0", onClick: () => duplicate(i), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "h-9 w-9 p-0 text-destructive", onClick: () => remove(i.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
        ] })
      ] }, i.id)) })
    ] })
  ] });
}
export {
  AppDashboard as component
};
