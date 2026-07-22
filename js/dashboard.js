/* ==========================================================================
   Dashboard Page Logic
   Renders the Students Attendance + Academic Performance charts (Chart.js),
   the Upcoming Events list, and the Quick Action buttons.
   Replace the data arrays below with real API/database calls whenever ready.
   ========================================================================== */

const attendanceData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  values: [88, 95, 70, 82, 90]
};

const performanceData = {
  labels: ["Math", "Science", "English", "History", "ICT", "Art"],
  values: [78, 65, 90, 72, 68, 95],
  colors: ["#2F9E44", "#8B5CF6", "#F0A93E", "#2F5CFF", "#F0A93E", "#C2185B"]
};

const upcomingEvents = [
  { day: "5",  title: "English Day",     time: "9:00 AM - 2:00 PM",  location: "School Main Hall", theme: "event-pink" },
  { day: "8",  title: "Parents Meeting", time: "9:00 AM - 12:00 PM", location: "School Main Hall", theme: "event-yellow" },
  { day: "12", title: "Sports Meet",     time: "9:00 AM - 6:00 PM",  location: "School Ground",    theme: "event-purple" }
];

const quickActions = [
  { label: "Admissions",  icon: "🎓" },
  { label: "Attendance",  icon: "✅" },
  { label: "Timetable",   icon: "🗓" },
  { label: "Assignments", icon: "📋" },
  { label: "Reports",     icon: "📊" },
  { label: "Messages",    icon: "💬" },
  { label: "Certificates",icon: "📜" },
  { label: "Settings",    icon: "⚙️" }
];

/* ---------------- Welcome banner date ---------------- */
function renderTodayDate() {
  const el = document.getElementById("todayDate");
  if (!el) return;
  const today = new Date();
  el.textContent = today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

/* ---------------- Students Attendance chart (line) ---------------- */
function renderAttendanceChart() {
  const ctx = document.getElementById("attendanceChart");
  if (!ctx || typeof Chart === "undefined") return;

  new Chart(ctx, {
    type: "line",
    data: {
      labels: attendanceData.labels,
      datasets: [{
        data: attendanceData.values,
        borderColor: "#2F5CFF",
        backgroundColor: "rgba(47, 92, 255, 0.08)",
        borderWidth: 2,
        pointBackgroundColor: "#2F5CFF",
        pointRadius: 4,
        tension: 0.35,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, max: 100, ticks: { stepSize: 25 }, grid: { color: "#F0F0F5" } },
        x: { grid: { display: false } }
      }
    }
  });
}

/* ---------------- Academic Performance chart (bar) ---------------- */
function renderPerformanceChart() {
  const ctx = document.getElementById("performanceChart");
  if (!ctx || typeof Chart === "undefined") return;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: performanceData.labels,
      datasets: [{
        data: performanceData.values,
        backgroundColor: performanceData.colors,
        borderRadius: 6,
        maxBarThickness: 28
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, max: 100, ticks: { stepSize: 25 }, grid: { color: "#F0F0F5" } },
        x: { grid: { display: false } }
      }
    }
  });
}

/* ---------------- Upcoming Events list ---------------- */
function renderUpcomingEvents() {
  const container = document.getElementById("upcomingEventsList");
  if (!container) return;
  container.innerHTML = "";

  upcomingEvents.forEach((event) => {
    const row = document.createElement("div");
    row.className = `event-row ${event.theme}`;
    row.innerHTML = `
      <div class="event-date-badge">${event.day}</div>
      <div class="event-info">
        <span class="event-title">${event.title}</span>
        <span class="event-time">${event.time} &middot; ${event.location}</span>
      </div>
    `;
    container.appendChild(row);
  });
}

/* ---------------- Quick Action buttons ---------------- */
function renderQuickActions() {
  const container = document.getElementById("quickActionGrid");
  if (!container) return;
  container.innerHTML = "";

  quickActions.forEach((action) => {
    const btn = document.createElement("button");
    btn.className = "quick-action-btn";
    btn.innerHTML = `<span class="qa-icon">${action.icon}</span><span>${action.label}</span>`;
    btn.addEventListener("click", () => handleQuickAction(action.label));
    container.appendChild(btn);
  });
}

/* ---------------- Shared button handler (welcome banner + quick actions) ---------------- */
function handleQuickAction(label) {
  // Wire this up to real navigation/modals whenever ready
  console.log("Quick action clicked:", label);
}

document.addEventListener("DOMContentLoaded", () => {
  renderTodayDate();
  renderAttendanceChart();
  renderPerformanceChart();
  renderUpcomingEvents();
  renderQuickActions();
});
