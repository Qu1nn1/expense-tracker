const $ = (s) => document.querySelector(s);
const fmt = (cents) => (cents / 100).toFixed(2);

async function fetchJson(url, opts) {
  const r = await fetch(url, opts);
  if (!r.ok) throw new Error((await r.json()).error || r.statusText);
  return r.json();
}

async function loadTrans() {
  const rows = await fetchJson("/api/transactions");
  const tbody = $("#table tbody");
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

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

async function loadCatChart() {
  const rows = await fetchJson("/api/summary/category");
  const x = rows.map((r) => r.category);
  const y = rows.map((r) => r.total_cents / 100);
  Plotly.newPlot("barByCat", [{ type: "bar", x, y }], { title: "By Category" });
}

async function loadMonthChart() {
  const rows = await fetchJson("/api/summary/month");
  const x = rows.map((r) => r.month);
  const y = rows.map((r) => r.total_cents / 100);
  Plotly.newPlot(
    "lineByMonth",
    [{ type: "scatter", mode: "lines+markers", x, y }],
    { title: "By Month" },
  );
}

async function refreshAll() {
  await loadTrans();
  await loadCatChart();
  await loadMonthChart();
}

document.addEventListener("DOMContentLoaded", () => {
  refreshAll();
  const form = $("#form");
  $("#date").value = todayISO();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = {
      amount: $("#amount").value,
      category: $("#category").value,
      note: $("#note").value,
      date: $("#date").value,
    };
    try {
      await fetchJson("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      form.reset();
      $("#date").value = todayISO();
      await refreshAll();
    } catch (err) {
      alert(err.message);
    }
  });
});
