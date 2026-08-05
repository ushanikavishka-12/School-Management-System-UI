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
    filtered.forEach((r) => {
      const tr = document.createElement("tr");
      // Pass studentId to action handlers so we can reliably lookup the record
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
            <button title="View" onclick="viewRecord('${r.studentId}')"><i class="fa-solid fa-eye"></i></button>
            <button title="More" onclick="moreOptions('${r.studentId}')"><i class="fa-solid fa-ellipsis-vertical"></i></button>
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
function findRecordById(studentId) {
  return attendanceData.find(r => r.studentId === studentId);
}

function viewRecord(studentId) {
  const record = findRecordById(studentId);
  if (!record) return alert('Record not found');

  // Create modal if it doesn't exist
  let modal = document.getElementById('attendance-record-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'attendance-record-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h3 id="modalTitle">Record</h3>
          <button id="modalClose" class="modal-close">&times;</button>
        </div>
        <div class="modal-body" id="modalBody"></div>
        <div class="modal-footer">
          <button id="modalEdit" class="btn">Edit</button>
          <button id="modalExport" class="btn">Export</button>
          <button id="modalDelete" class="btn btn-danger">Delete</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Wire close
    modal.querySelector('#modalClose').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  }

  // Populate body
  const body = modal.querySelector('#modalBody');
  body.innerHTML = `
    <table class="modal-table">
      <tr><th>Student ID</th><td>${record.studentId}</td></tr>
      <tr><th>Name</th><td>${record.name}</td></tr>
      <tr><th>Class</th><td>${record.class}</td></tr>
      <tr><th>Date</th><td>${formatDisplayDate(record.date)}</td></tr>
      <tr><th>Day</th><td>${record.day}</td></tr>
      <tr><th>Status</th><td>${record.status}</td></tr>
      <tr><th>Check In</th><td>${record.checkIn}</td></tr>
      <tr><th>Check Out</th><td>${record.checkOut}</td></tr>
      <tr><th>Remarks</th><td id="modalRemarks">${record.remarks || '-'}</td></tr>
    </table>
  `;

  // Wire actions
  modal.querySelector('#modalExport').onclick = () => exportSingleToCSV(studentId);
  modal.querySelector('#modalDelete').onclick = () => { modal.remove(); deleteRecord(studentId); };
  modal.querySelector('#modalEdit').onclick = () => {
    const newRemarks = prompt('Edit remarks:', record.remarks || '');
    if (newRemarks === null) return; // cancelled
    record.remarks = newRemarks.trim();
    // Optionally prompt for status
    const newStatus = prompt('Edit status (Present / Absent / Late):', record.status);
    if (newStatus !== null) record.status = newStatus.trim();
    renderAttendanceTable();
    // Update modal content
    const remarksEl = modal.querySelector('#modalRemarks');
    if (remarksEl) remarksEl.textContent = record.remarks || '-';
  };
}

function moreOptions(studentId) {
  // For now reuse the details modal which includes actions
  viewRecord(studentId);
}

function deleteRecord(studentId) {
  const idx = attendanceData.findIndex(r => r.studentId === studentId);
  if (idx === -1) return alert('Record not found');
  if (!confirm(`Delete attendance record for ${attendanceData[idx].name}?`)) return;
  attendanceData.splice(idx, 1);
  renderAttendanceTable();
}

function exportSingleToCSV(studentId) {
  const record = findRecordById(studentId);
  if (!record) return alert('Record not found');
  const header = ["Student ID","Student Name","Class","Date","Day","Status","Check In","Check Out","Remarks"];
  const line = [
    record.studentId,
    `"${record.name.replace(/"/g, '""')}"`,
    record.class,
    record.date,
    record.day,
    record.status,
    record.checkIn,
    record.checkOut,
    `"${(record.remarks||'').replace(/"/g,'""')}"`
  ];
  const csv = header.join(',') + '\n' + line.join(',');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${record.studentId}-attendance.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ---------------- Export (CSV) ---------------- */
function getFilteredAttendance() {
  const searchTerm = document.getElementById("tableSearch").value.trim().toLowerCase();
  const classValue = document.getElementById("classFilter").value;
  const dateValue = document.getElementById("dateFilter").value;

  return attendanceData.filter((r) => {
    const matchesSearch =
      searchTerm === "" ||
      r.name.toLowerCase().includes(searchTerm) ||
      r.studentId.toLowerCase().includes(searchTerm) ||
      r.class.toLowerCase().includes(searchTerm);
    const matchesClass = classValue === "all" || r.class === classValue;
    const matchesDate = !dateValue || r.date === dateValue;
    return matchesSearch && matchesClass && matchesDate;
  });
}

function exportFilteredToCSV() {
  const rows = getFilteredAttendance();
  if (!rows || rows.length === 0) {
    alert("No records to export.");
    return;
  }

  const header = [
    "Student ID",
    "Student Name",
    "Class",
    "Date",
    "Day",
    "Status",
    "Check In",
    "Check Out",
    "Remarks"
  ];

  const csvLines = [];
  csvLines.push(header.join(","));

  rows.forEach((r) => {
    const line = [
      r.studentId,
      `"${r.name.replace(/"/g, '""')}"`,
      r.class,
      r.date,
      r.day,
      r.status,
      r.checkIn,
      r.checkOut,
      `"${(r.remarks || "").replace(/"/g, '""')}"`
    ];
    csvLines.push(line.join(","));
  });

  const csvContent = csvLines.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const now = new Date();
  const filename = `attendance-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}.csv`;
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.addEventListener("DOMContentLoaded", () => {
  renderStats();
  populateFilterDropdowns();
  renderAttendanceTable();

  document.getElementById("tableSearch").addEventListener("input", renderAttendanceTable);
  document.getElementById("classFilter").addEventListener("change", renderAttendanceTable);
  document.getElementById("sectionFilter").addEventListener("change", renderAttendanceTable);
  document.getElementById("dateFilter").addEventListener("change", renderAttendanceTable);

  // Export button: download currently filtered rows as CSV
  const exportBtn = document.getElementById("exportBtn");
  if (exportBtn) exportBtn.addEventListener("click", exportFilteredToCSV);
});
