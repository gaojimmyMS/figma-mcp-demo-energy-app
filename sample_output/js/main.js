// ---------- Data ----------
const MOCK_DEVICES = [
  { id: "1", name: "Smart Outlet A", icon: "🖥️", room: "Living Room" },
  { id: "2", name: "Smart Outlet B", icon: "🍳", room: "Kitchen" },
  { id: "3", name: "Smart Outlet C", icon: "💡", room: "Bedroom" },
  { id: "4", name: "Smart Outlet D", icon: "🎮", room: "Office" },
];

const ROOMS = [
  "Living Room", "Kitchen", "Bedroom", "Office",
  "Bathroom", "Garage", "Dining Room", "Basement",
];
const ICONS = ["🖥️", "📺", "🍳", "💡", "🎮", "🔌", "🎸", "❄️", "🖨️", "📱", "🎵", "🌀"];

// Approx. running wattage assigned once devices reach the dashboard.
const WATTS = [120, 340, 60, 210];
const KWH_RATE = 0.17; // $ per kWh

// ---------- App state ----------
let devices = [];      // configured devices
let activeId = null;   // selected tab in config
let editingName = false;

// ---------- Screen navigation ----------
const screens = {
  discovery: document.getElementById("screen-discovery"),
  config: document.getElementById("screen-config"),
  dashboard: document.getElementById("screen-dashboard"),
};

function show(name) {
  Object.entries(screens).forEach(([key, el]) => {
    el.hidden = key !== name;
  });
  if (name === "config") renderConfig();
  if (name === "dashboard") renderDashboard();
  screens[name].scrollTop = 0;
}

// ================= SCREEN 1: DISCOVERY =================
const scanBtn = document.getElementById("scanBtn");
const scanBtnLabel = document.getElementById("scanBtnLabel");
const scanOrb = document.getElementById("scanOrb");
const scanWifi = document.getElementById("scanWifi");
const scanDone = document.getElementById("scanDone");
const deviceList = document.getElementById("deviceList");
const deviceListEmpty = document.getElementById("deviceListEmpty");

let scanning = false;
let scanComplete = false;
let foundDevices = [];

function startScan() {
  if (scanning || scanComplete) return;
  scanning = true;
  scanComplete = false;
  foundDevices = [];

  scanOrb.classList.add("is-scanning");
  scanWifi.hidden = false;
  scanDone.hidden = true;
  deviceList.innerHTML = "";
  scanBtn.classList.add("btn--scanning");
  scanBtn.disabled = true;
  scanBtnLabel.textContent = "Scanning your home…";

  MOCK_DEVICES.forEach((device, i) => {
    setTimeout(() => {
      foundDevices.push({ ...device });
      addDeviceRow(device);
      if (i === MOCK_DEVICES.length - 1) {
        setTimeout(finishScan, 400);
      }
    }, 600 + i * 700);
  });
}

function addDeviceRow(device) {
  const row = document.createElement("div");
  row.className = "device-row";
  row.innerHTML = `
    <div class="device-row__icon">${device.icon}</div>
    <div class="device-row__body">
      <div class="device-row__name">${device.name}</div>
      <div class="device-row__room">${device.room}</div>
    </div>
    <div class="device-row__check">✓</div>`;
  deviceList.appendChild(row);
}

function finishScan() {
  scanning = false;
  scanComplete = true;
  scanOrb.classList.remove("is-scanning");
  scanWifi.hidden = true;
  scanDone.hidden = false;

  scanBtn.classList.remove("btn--scanning");
  scanBtn.disabled = false;
  scanBtn.innerHTML = `Configure ${foundDevices.length} Devices
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
  scanBtn.onclick = () => {
    devices = foundDevices.map((d) => ({ ...d }));
    activeId = devices[0]?.id ?? null;
    show("config");
  };
}

scanBtn.addEventListener("click", startScan);

// ================= SCREEN 2: CONFIG =================
const deviceTabs = document.getElementById("deviceTabs");
const configBody = document.getElementById("configBody");
const progressCount = document.getElementById("progressCount");
const progressPct = document.getElementById("progressPct");
const progressFill = document.getElementById("progressFill");

function renderConfig() {
  editingName = false;
  renderTabs();
  renderConfigBody();
  renderProgress();
}

function renderTabs() {
  deviceTabs.innerHTML = "";
  devices.forEach((d, i) => {
    const tab = document.createElement("button");
    tab.className = "tab" + (d.id === activeId ? " tab--active" : "");
    tab.innerHTML = `<span>${d.icon}</span> Outlet ${i + 1}`;
    tab.addEventListener("click", () => {
      activeId = d.id;
      editingName = false;
      renderConfig();
    });
    deviceTabs.appendChild(tab);
  });
}

function renderConfigBody() {
  const active = devices.find((d) => d.id === activeId);
  if (!active) return;

  const iconCells = ICONS.map(
    (icon) =>
      `<button class="icon-cell${icon === active.icon ? " icon-cell--active" : ""}" data-icon="${icon}">${icon}</button>`
  ).join("");

  const roomCells = ROOMS.map(
    (room) =>
      `<button class="room-cell${room === active.room ? " room-cell--active" : ""}" data-room="${room}">${room}</button>`
  ).join("");

  const nameBlock = editingName
    ? `<div class="name-edit">
         <input class="name-edit__input" id="nameInput" value="${escapeHtml(active.name)}" autofocus />
         <button class="name-edit__save" id="nameSave" aria-label="Save name">
           <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
         </button>
       </div>`
    : `<div class="name-view" id="nameView">
         <span class="name-view__text">${escapeHtml(active.name)}</span>
         <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#0d9488" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path></svg>
       </div>`;

  configBody.innerHTML = `
    <div class="card">
      <div class="card__label">Pick an icon</div>
      <div class="icon-grid">${iconCells}</div>
    </div>
    <div class="card">
      <div class="card__label">Device name</div>
      ${nameBlock}
    </div>
    <div class="card">
      <div class="card__label">Assign to room</div>
      <div class="room-grid">${roomCells}</div>
    </div>`;

  configBody.querySelectorAll(".icon-cell").forEach((cell) => {
    cell.addEventListener("click", () => {
      update(active.id, { icon: cell.dataset.icon });
      renderConfig();
    });
  });
  configBody.querySelectorAll(".room-cell").forEach((cell) => {
    cell.addEventListener("click", () => {
      update(active.id, { room: cell.dataset.room });
      renderConfig();
    });
  });

  if (editingName) {
    const input = document.getElementById("nameInput");
    const save = document.getElementById("nameSave");
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") commitName();
    });
    save.addEventListener("click", commitName);
  } else {
    document.getElementById("nameView").addEventListener("click", () => {
      editingName = true;
      renderConfigBody();
    });
  }
}

function commitName() {
  const active = devices.find((d) => d.id === activeId);
  const input = document.getElementById("nameInput");
  if (input && input.value.trim() && active) {
    update(active.id, { name: input.value.trim() });
  }
  editingName = false;
  renderConfig();
}

function renderProgress() {
  const idx = devices.findIndex((d) => d.id === activeId);
  const pct = Math.round(((idx + 1) / devices.length) * 100);
  progressCount.textContent = `${idx + 1} of ${devices.length} outlets`;
  progressPct.textContent = `${pct}% done`;
  progressFill.style.width = `${pct}%`;
}

function update(id, patch) {
  devices = devices.map((d) => (d.id === id ? { ...d, ...patch } : d));
}

document.getElementById("configBack").addEventListener("click", () => show("discovery"));
document.getElementById("toDashboard").addEventListener("click", () => show("dashboard"));

// ================= SCREEN 3: DASHBOARD =================
const chart = document.getElementById("chart");
const outletList = document.getElementById("outletList");
const totalWattsEl = document.getElementById("totalWatts");
const totalCostEl = document.getElementById("totalCost");

let outletStates = {}; // id -> on/off

function renderDashboard() {
  const data = devices.map((d, i) => ({
    ...d,
    watts: WATTS[i % WATTS.length],
  }));

  data.forEach((d) => {
    if (!(d.id in outletStates)) outletStates[d.id] = true;
  });

  const maxWatts = Math.max(...data.map((d) => d.watts), 1);

  // Chart
  chart.innerHTML = data
    .map((d) => {
      const on = outletStates[d.id];
      const h = on ? Math.max((d.watts / maxWatts) * 100, 6) : 4;
      return `
        <div class="bar">
          <div class="bar__value">${on ? d.watts : 0}W</div>
          <div class="bar__fill" style="height:${h}%"></div>
          <div class="bar__label">${d.icon}</div>
        </div>`;
    })
    .join("");

  // Outlet list
  outletList.innerHTML = "";
  data.forEach((d) => {
    const on = outletStates[d.id];
    const row = document.createElement("div");
    row.className = "outlet" + (on ? "" : " outlet--off");
    row.innerHTML = `
      <div class="outlet__icon">${d.icon}</div>
      <div class="outlet__body">
        <div class="outlet__name">${escapeHtml(d.name)}</div>
        <div class="outlet__meta">${d.room} · <span class="outlet__watts">${on ? d.watts : 0} W</span></div>
      </div>
      <button class="switch${on ? " switch--on" : ""}" aria-label="Toggle ${escapeHtml(d.name)}">
        <span class="switch__knob"></span>
      </button>`;
    row.querySelector(".switch").addEventListener("click", () => {
      outletStates[d.id] = !outletStates[d.id];
      renderDashboard();
    });
    outletList.appendChild(row);
  });

  // Totals
  const total = data.reduce((sum, d) => sum + (outletStates[d.id] ? d.watts : 0), 0);
  const dailyCost = (total / 1000) * 24 * KWH_RATE;
  totalWattsEl.textContent = total.toLocaleString();
  totalCostEl.textContent = `$${dailyCost.toFixed(2)}`;
}

document.getElementById("dashBack").addEventListener("click", () => show("config"));

// ---------- Utils ----------
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}
