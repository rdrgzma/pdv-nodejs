
export const formatMoney = (v: number | string | undefined | null) => {
  const num = typeof v === "number" ? v : Number(v || 0);
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export const formatDocument = (doc: string, tipo: 'CPF' | 'CNPJ') => {
  if (!doc) return "";
  const clean = doc.replace(/\D/g, "");
  if (tipo === "CPF" && clean.length === 11) {
    return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  if (tipo === "CNPJ" && clean.length === 14) {
    // FIX: Using a replacer function to avoid a rare parsing error where the '/' in the replacement string
    // was being misinterpreted as part of a regular expression.
    return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, (_match, p1, p2, p3, p4, p5) => `${p1}.${p2}.${p3}/${p4}-${p5}`);
  }
  return doc;
};