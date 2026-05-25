import { c as createLucideIcon } from "./createLucideIcon-hkZg55hz.js";
const __iconNode$1 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode$1);
const __iconNode = [
  ["path", { d: "M10 11v6", key: "nco0om" }],
  ["path", { d: "M14 11v6", key: "outv1u" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
const defaultInvoiceData = (number) => ({
  headerTitle: "VOTRE ENTREPRISE",
  headerPhones: "",
  headerTagline: "DESCRIPTION ACTIVITÉ",
  invoiceNumber: number,
  date: "",
  location: "",
  subject: "",
  descriptionTitle: "PRESTATIONS",
  items: [{ id: crypto.randomUUID(), description: "Prestation", quantity: 1, unitPrice: 0 }],
  currency: "f",
  transport: "—",
  cautionText: "",
  advance: 0,
  footerNote: "Merci pour votre confiance.",
  template: "minimal",
  signature: void 0,
  stamp: null
});
const computeTotals = (data) => {
  const total = data.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const remaining = Math.max(0, total - (data.advance || 0));
  return { total, remaining };
};
const formatMoney = (n, currency = "f") => {
  const fixed = Math.round(n).toString();
  const parts = [];
  for (let i = fixed.length; i > 0; i -= 3) {
    parts.unshift(fixed.slice(Math.max(0, i - 3), i));
  }
  return `${parts.join(".")}${currency}`;
};
const generateInvoiceNumber = () => {
  const d = /* @__PURE__ */ new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}`;
};
export {
  Plus as P,
  Trash2 as T,
  computeTotals as c,
  defaultInvoiceData as d,
  formatMoney as f,
  generateInvoiceNumber as g
};
