import { CartItem, StoreInfo } from '../types';
import { formatMoney } from './helpers';

interface ReceiptData {
  numero: string;
  dataHora: string;
  itens: CartItem[];
  subtotal: number;
  descontos?: number;
  acrescimos?: number;
  total: number;
  pagamento?: string;
  cliente?: string;
  recebido?: number;
  troco?: number;
}

function buildReceiptHTML(loja: StoreInfo, { numero, dataHora, itens, subtotal, descontos = 0, acrescimos = 0, total, pagamento = "Dinheiro", cliente = "Balcão", recebido = 0, troco = 0 }: ReceiptData) {
  const itensRows = itens.map(i => `
    <tr>
      <td>${i.nome}<br/><span class="muted">${i.qtd} x ${formatMoney(i.preco)}</span></td>
      <td class="right">${formatMoney(i.qtd * i.preco)}</td>
    </tr>
  `).join("");

  return `
    <div class="center">
      <div><strong>${loja.nome}</strong></div>
      <div class="muted">${loja.doc}</div>
      <div class="muted">${loja.endereco}</div>
      <div class="muted">${loja.contato}</div>
    </div>
    <div class="hr"></div>
    <div class="muted">Cupom Não Fiscal</div>
    <div>Nº: ${numero}</div>
    <div class="muted">Data/Hora: ${dataHora}</div>
    <div class="muted">Cliente: ${cliente || "Balcão"}</div>
    <div class="hr"></div>
    <table><tbody>${itensRows}</tbody></table>
    <div class="hr"></div>
    <table class="totais">
      <tr><td>Subtotal</td><td class="right">${formatMoney(subtotal)}</td></tr>
      <tr><td>Descontos</td><td class="right">-${formatMoney(descontos)}</td></tr>
      <tr><td>Acréscimos</td><td class="right">${formatMoney(acrescimos)}</td></tr>
      <tr><td><strong>Total</strong></td><td class="right"><strong>${formatMoney(total)}</strong></td></tr>
      <tr><td>Pagamento</td><td class="right">${pagamento}</td></tr>
      ${pagamento === "Dinheiro" ? `
        <tr><td>Recebido</td><td class="right">${formatMoney(recebido)}</td></tr>
        <tr><td>Troco</td><td class="right">${formatMoney(troco)}</td></tr>
      ` : ``}
    </table>
    <div class="hr"></div>
    <div class="center">
      <div class="muted">Obrigado pela preferência!</div>
      <div class="qr"></div>
      <div class="muted">Volte sempre! 🚗</div>
    </div>
  `;
}

export function printReceipt(loja: StoreInfo, data: ReceiptData) {
  const contentHtml = buildReceiptHTML(loja, data);
  const win = window.open("", "_blank", "width=420,height=800");
  if (!win) {
    alert("Pop-up bloqueado. Permita pop-ups para imprimir.");
    return;
  }
  win.document.open();
  win.document.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>Comprovante</title>
      <style>
        @page { size: 80mm auto; margin: 5mm; }
        body { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
        .receipt { width: 72mm; margin: 0 auto; }
        .center { text-align: center; }
        .right { text-align: right; }
        .muted { color: #444; font-size: 12px; }
        .hr { border-top: 1px dashed #000; margin: 8px 0; }
        table { width: 100%; border-collapse: collapse; }
        td { vertical-align: top; font-size: 12px; }
        .totais td { font-size: 13px; }
        .qr { width: 120px; height: 120px; background: #eee; display: block; margin: 8px auto; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="receipt">
        ${contentHtml}
      </div>
      <script>
        window.onload = function() {
          window.print();
          setTimeout(() => window.close(), 300);
        };
      </script>
    </body>
    </html>
  `);
  win.document.close();
}