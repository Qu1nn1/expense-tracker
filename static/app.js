console.log("app.js loaded");
const $ = (s) => document.querySelector(s);
const fmt = (cents) => (cents / 100).toFixed(2);

async function fetchJson(url, opts) {
  const r = await fetch(url, opts);
  if (!r.ok) throw new Error((await r.json()).error || r.statusText);
  return r.json();
}

async function loadTrans() {
  console.log("fetching...");
  const rows = await fetchJson("/api/transactions");
  console.log("rows:", rows);
  const tbody = $("#table tbody");
  console.log("tbody found?", !!tbody);
  tbody.innerHTML = "";
  if (!rows.length) {
    tbody.innerHTML =
      '<tr><td colspan="4" class="text-center text-muted py-4">No transactions yet</td></tr>';
    return;
  }
  for (const r of rows) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
			<td>${r.date}</td>
			<td>${r.category}</td>
			<td>${r.note ?? ""}</td>
			<td class="text-end">${fmt(r.amount_cents)}</td>`;
    tbody.appendChild(tr);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadTrans();
});
