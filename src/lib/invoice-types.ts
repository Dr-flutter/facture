export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

export type StampConfig = {
  text: string;
  subtext: string;
  shape: "round" | "oval";
  color: string;
  style: "ink" | "official";
};

export type TemplateId = "event" | "minimal" | "mono";

export type InvoiceData = {
  headerTitle: string;
  headerPhones: string;
  headerTagline: string;
  invoiceNumber: string;
  date: string;
  location: string;
  subject: string;
  descriptionTitle: string;
  items: InvoiceItem[];
  currency: string;
  transport: string;
  cautionText: string;
  advance: number;
  footerNote: string;
  clientName?: string;
  clientPhone?: string;
  clientAddress?: string;
  template?: TemplateId;
  signature?: string;
  stamp?: StampConfig | null;
};

export const defaultInvoiceData = (number: string): InvoiceData => ({
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
  signature: undefined,
  stamp: null,
});

export const computeTotals = (data: InvoiceData) => {
  const total = data.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const remaining = Math.max(0, total - (data.advance || 0));
  return { total, remaining };
};

export const formatMoney = (n: number, currency = "f") => {
  // French-style formatting: 1.174.000f
  const fixed = Math.round(n).toString();
  const parts = [];
  for (let i = fixed.length; i > 0; i -= 3) {
    parts.unshift(fixed.slice(Math.max(0, i - 3), i));
  }
  return `${parts.join(".")}${currency}`;
};

export const generateInvoiceNumber = () => {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}`;
};
