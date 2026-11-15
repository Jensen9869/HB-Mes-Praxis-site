export const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (ch) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);

export const STATUS_LABEL: Record<string, string> = {
  awaiting_payment: "Awaiting payment",
  active: "Active",
  approved: "Approved",
  payment_failed: "Payment failed",
  cancelled: "Cancelled",
  rejected: "Rejected",
  completed: "Completed",
};

export function layout(title: string, body: string) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style>
  body{font-family:system-ui,sans-serif;max-width:960px;margin:2rem auto;padding:0 1rem;color:#1e293b}
  h1{font-size:1.5rem} h2{font-size:1.1rem;margin-top:2rem}
  table{width:100%;border-collapse:collapse;font-size:.9rem}
  th,td{text-align:left;padding:.5rem;border-bottom:1px solid #e2e8f0;vertical-align:top}
  th{background:#f8fafc;font-weight:600}
  .btn{display:inline-block;padding:.5rem 1rem;border-radius:.5rem;background:#ea580c;color:#fff;text-decoration:none;font-weight:600;border:0;cursor:pointer;font-size:.9rem}
  .btn.secondary{background:#102a43} .btn.danger{background:#b91c1c} .btn.small{padding:.3rem .6rem;font-size:.8rem}
  .pill{padding:.15rem .5rem;border-radius:999px;font-size:.75rem;background:#e2e8f0}
  .pill.active,.pill.approved{background:#dcfce7;color:#166534}
  .pill.awaiting_payment{background:#fef3c7;color:#92400e}
  .pill.payment_failed,.pill.cancelled,.pill.rejected{background:#fee2e2;color:#991b1b}
  .muted{color:#64748b;font-size:.85rem} .top{display:flex;justify-content:space-between;align-items:center}
  form.inline{display:inline} input,select{padding:.4rem;border:1px solid #cbd5e1;border-radius:.4rem}
</style></head><body>${body}</body></html>`;
}

export const pill = (status: string) =>
  `<span class="pill ${esc(status)}">${esc(STATUS_LABEL[status] ?? status)}</span>`;