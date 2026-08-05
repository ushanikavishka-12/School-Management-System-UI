/* ==========================================================================
   Attendance Page Logic
   Renders the attendance records table + stat cards, and wires up the
   search box, class/section/date filters.
   Replace `attendanceData` with a real API/database call whenever ready —
   this page reads records, it doesn't create them (marking attendance
   happens on take-attendance.html, linked from the banner button).
   ========================================================================== */

let attendanceData = [
  { studentId: "ST-1001", name: "Sudam Perera",    class: "6 A", date: "2026-05-22", day: "Monday", status: "Present", checkIn: "7:30 AM", checkOut: "1:30 PM", remarks: "" },
  { studentId: "ST-1002", name: "Vishva Silva",     class: "6 A", date: "2026-05-22", day: "Monday", status: "Present", checkIn: "7:30 AM", checkOut: "1:30 PM", remarks: "" },
  { studentId: "ST-1003", name: "Tharuni Navodha",  class: "6 A", date: "2026-05-22", day: "Monday", status: "Late",    checkIn: "8:30 AM", checkOut: "1:30 PM", remarks: "Traffic" },
  { studentId: "ST-1004", name: "Minul Gagun",      class: "6 A", date: "2026-05-22", day: "Monday", status: "Absent",  checkIn: "-",        checkOut: "-",        remarks: "Sick Leave" }
];

// School-wide totals shown in the stat cards (from the design), separate
// from the 4 sample rows above. Swap for real aggregated values once you're
// loading the full attendance data set.
const schoolWideStats = {
  totalStudents: 2563,
  presentToday: 2167,
  absentToday: 396,
  weekAttendancePct: 94.8,
  monthAttendancePct: 96.3
};

function formatDisplayDate(isoDate) {
  const date = new Date(isoDate + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

/* ---------------- Stat cards ---------------- */
function renderStats() {
  document.getElementById("statTotal").textContent = schoolWideStats.totalStudents.toLocaleString();
  document.getElementById("statPresent").textContent = schoolWideStats.presentToday.toLocaleString();
  document.getElementById("statPresentPct").textContent =
    ((schoolWideStats.presentToday / schoolWideStats.totalStudents) * 100).toFixed(1) + "%";

  document.getElementById("statAbsent").textContent = schoolWideStats.absentToday.toLocaleString();
  document.getElementById("statAbsentPct").textContent =
    ((schoolWideStats.absentToday / schoolWideStats.totalStudents) * 100).toFixed(1) + "% of total";

  document.getElementById("statWeekAttendance").textContent = schoolWideStats.weekAttendancePct + "%";
  document.getElementById("statMonthAttendance").textContent = schoolWideStats.monthAttendancePct + "%";
}

/* ---------------- Filter dropdowns ---------------- */
function populateFilterDropdowns() {
  const classSelect = document.getElementById("classFilter");
  const classes = [...new Set(attendanceData.map((r) => r.class))].sort();
  classes.forEach((cls) => {
    const opt = document.createElement("option");
    opt.value = cls;
    opt.textContent = cls;
    classSelect.appendChild(opt);
  });

  // Sections aren't tracked separately in this sample data — populate with
  // placeholder options for now; wire up to real section data once available.
  const sectionSelect = document.getElementById("sectionFilter");
  ["Section A", "Section B", "Section C"].forEach((section) => {
    const opt = document.createElement("option");
    opt.value = section;
    opt.textContent = section;
    sectionSelect.appendChild(opt);
  });

  // Default the date filter to the most recent record's date
  if (attendanceData.length) {
    document.getElementById("dateFilter").value = attendanceData[0].date;
  }
}

/* ---------------- Table rendering ---------------- */
function renderAttendanceTable() {
  const searchTerm = document.getElementById("tableSearch").value.trim().toLowerCase();
  const classValue = document.getElementById("classFilter").value;
  const dateValue = document.getElementById("dateFilter").value;

  const filtered = attendanceData.filter((r) => {
    const matchesSearch =
      searchTerm === "" ||
      r.name.toLowerCase().includes(searchTerm) ||
      r.studentId.toLowerCase().includes(searchTerm) ||
      r.class.toLowerCase().includes(searchTerm);
    const matchesClass = classValue === "all" || r.class === classValue;
    const matchesDate = !dateValue || r.date === dateValue;
    return matchesSearch && matchesClass && matchesDate;
  });

  const tbody = document.getElementById("attendanceTableBody");
  tbody.innerHTML = "";

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="10" style="text-align:center; padding:32px; color:#A9ABB6;">
        No attendance records match your search.
      </td></tr>`;
  } else {
    filtered.forEach((r, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.studentId}</td>
        <td class="student-name-cell">${r.name}</td>
        <td>${r.class}</td>
        <td>${formatDisplayDate(r.date)}</td>
        <td>${r.day}</td>
        <td><span class="status-badge status-${r.status.toLowerCase()}">${r.status}</span></td>
        <td>${r.checkIn}</td>
        <td>${r.checkOut}</td>
        <td>${r.remarks ? r.remarks : '<span class="remark-empty">-</span>'}</td>
        <td>
          <div class="row-actions">
            <button title="View" onclick="viewRecord(${index})"><i class="fa-solid fa-eye"></i></button>
            <button title="More" onclick="moreOptions(${index})"><i class="fa-solid fa-ellipsis-vertical"></i></button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById("paginationSummary").textContent =
    `Showing 1 to ${filtered.length} of ${attendanceData.length} students`;
}

/* ---------------- Row action placeholders ---------------- */
function viewRecord(index) { console.log("View record", attendanceData[index]); }
function moreOptions(index) { console.log("More options for", attendanceData[index]); }

document.addEventListener("DOMContentLoaded", () => {
  renderStats();
  populateFilterDropdowns();
  renderAttendanceTable();

  document.getElementById("tableSearch").addEventListener("input", renderAttendanceTable);
  document.getElementById("classFilter").addEventListener("change", renderAttendanceTable);
  document.getElementById("sectionFilter").addEventListener("change", renderAttendanceTable);
  document.getElementById("dateFilter").addEventListener("change", renderAttendanceTable);
});
