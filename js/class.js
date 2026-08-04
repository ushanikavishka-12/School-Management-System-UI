/* ==========================================================================
   Classes Page Logic
   Renders the classes table + stat cards, wires up search/filter dropdowns,
   and handles the "Add New Class" modal — new submissions are pushed into
   classesData and immediately re-rendered into the table.
   Replace `classesData` with a real API/database call whenever ready.
   ========================================================================== */

let classesData = [
  { className: "Grade 6A", teacher: "Mrs. Nimaka Perera",  section: "G 6 Section", students: 86,  roomNo: "Block 2, Rm 14", status: "Active" },
  { className: "Grade 9B", teacher: "Mr. Kasun Perera",    section: "G 9 Section", students: 68,  roomNo: "Block 2, Rm 14", status: "Active" },
  { className: "Grade 8E", teacher: "Mr. Piyum Silva",     section: "G 8 Section", students: 71,  roomNo: "Block 2, Rm 14", status: "Full" },
  { className: "Grade 7E", teacher: "Mrs. Shalani Vithanage", section: "G 7 Section", students: 132, roomNo: "Block 2, Rm 14", status: "Active" }
];

// Figures shown in the stat cards reflect the full school-wide totals from
// the design (42 classes, 128 sections, etc.), separate from the 4 sample
// rows in classesData. Swap these for real aggregated values once you're
// loading the full data set.
const schoolWideStats = {
  totalClasses: 42,
  newSections: 8,
  totalSections: 128,
  avgSectionsPerClass: 3,
  activeClassesPct: 97.2
};

/* ---------------- Stat cards ---------------- */
function renderStats() {
  document.getElementById("statTotal").textContent = schoolWideStats.totalClasses;
  document.getElementById("statNewSections").textContent = schoolWideStats.newSections;
  document.getElementById("statTotalSections").textContent = schoolWideStats.totalSections;
  document.getElementById("statAvgSections").textContent = `Avg ${schoolWideStats.avgSectionsPerClass} / class`;
  document.getElementById("statActivePct").textContent = schoolWideStats.activeClassesPct + "%";

  const avgClassSize = classesData.length
    ? Math.round(classesData.reduce((sum, c) => sum + Number(c.students), 0) / classesData.length)
    : 0;
  document.getElementById("statAvgClassSize").textContent = avgClassSize;
}

/* ---------------- Filter dropdowns ---------------- */
function populateFilterDropdowns() {
  const teacherSelect = document.getElementById("teacherFilter");
  const roomSelect = document.getElementById("roomFilter");

  const teachers = [...new Set(classesData.map((c) => c.teacher))].sort();
  teachers.forEach((teacher) => {
    const opt = document.createElement("option");
    opt.value = teacher;
    opt.textContent = teacher;
    teacherSelect.appendChild(opt);
  });

  const rooms = [...new Set(classesData.map((c) => c.roomNo))].sort();
  rooms.forEach((room) => {
    const opt = document.createElement("option");
    opt.value = room;
    opt.textContent = room;
    roomSelect.appendChild(opt);
  });
}

function refreshFilterDropdowns() {
  const teacherSelect = document.getElementById("teacherFilter");
  const roomSelect = document.getElementById("roomFilter");
  const currentTeacher = teacherSelect.value;
  const currentRoom = roomSelect.value;

  teacherSelect.innerHTML = '<option value="all">All Teachers</option>';
  roomSelect.innerHTML = '<option value="all">All Room No</option>';
  populateFilterDropdowns();

  teacherSelect.value = [...teacherSelect.options].some((o) => o.value === currentTeacher) ? currentTeacher : "all";
  roomSelect.value = [...roomSelect.options].some((o) => o.value === currentRoom) ? currentRoom : "all";
}

/* ---------------- Table rendering ---------------- */
function renderClassesTable() {
  const searchTerm = document.getElementById("tableSearch").value.trim().toLowerCase();
  const teacherValue = document.getElementById("teacherFilter").value;
  const roomValue = document.getElementById("roomFilter").value;
  const statusValue = document.getElementById("statusFilter").value;

  const filtered = classesData.filter((c) => {
    const matchesSearch =
      searchTerm === "" ||
      c.className.toLowerCase().includes(searchTerm) ||
      c.teacher.toLowerCase().includes(searchTerm);
    const matchesTeacher = teacherValue === "all" || c.teacher === teacherValue;
    const matchesRoom = roomValue === "all" || c.roomNo === roomValue;
    const matchesStatus = statusValue === "all" || c.status === statusValue;
    return matchesSearch && matchesTeacher && matchesRoom && matchesStatus;
  });

  const tbody = document.getElementById("classesTableBody");
  tbody.innerHTML = "";

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="7" style="text-align:center; padding:32px; color:#A9ABB6;">
        No classes match your search.
      </td></tr>`;
  } else {
    filtered.forEach((c, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div class="class-name-cell">
            <div class="class-icon"><i class="fa-solid fa-house"></i></div>
            ${c.className}
          </div>
        </td>
        <td>${c.teacher}</td>
        <td>${c.section}</td>
        <td>${c.students}</td>
        <td>${c.roomNo}</td>
        <td><span class="status-badge status-${c.status.toLowerCase()}">${c.status}</span></td>
        <td>
          <div class="row-actions">
            <button title="View" onclick="viewClass(${index})"><i class="fa-solid fa-eye"></i></button>
            <button title="More" onclick="moreOptions(${index})"><i class="fa-solid fa-ellipsis-vertical"></i></button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById("paginationSummary").textContent =
    `Showing 1 to ${filtered.length} of ${classesData.length} classes`;
}

/* ---------------- Row action placeholders ---------------- */
function viewClass(index) { console.log("View class", classesData[index]); }
function moreOptions(index) { console.log("More options for", classesData[index]); }

/* ---------------- Add Class modal ---------------- */
function openAddClassModal() {
  document.getElementById("addClassOverlay").classList.add("open");
  document.getElementById("addClassError").textContent = "";
}

function closeAddClassModal() {
  document.getElementById("addClassOverlay").classList.remove("open");
  document.getElementById("addClassForm").reset();
  document.getElementById("addClassError").textContent = "";
}

function handleAddClassSubmit(e) {
  e.preventDefault();
  const errorEl = document.getElementById("addClassError");

  const className = document.getElementById("fieldClassName").value.trim();
  const teacher = document.getElementById("fieldTeacher").value.trim();
  const section = document.getElementById("fieldSection").value.trim();
  const students = document.getElementById("fieldStudents").value;
  const roomNo = document.getElementById("fieldRoomNo").value.trim();
  const status = document.getElementById("fieldStatus").value;

  if (!className || !teacher || !section || students === "" || !roomNo) {
    errorEl.textContent = "Please fill in all required fields.";
    return;
  }

  if (Number(students) < 0) {
    errorEl.textContent = "Students count can't be negative.";
    return;
  }

  classesData.push({
    className, teacher, section,
    students: Number(students), roomNo, status
  });

  closeAddClassModal();
  refreshFilterDropdowns();
  renderClassesTable();
  renderStats();

  // This is where you'd call your real "create class" API. Example:
  // fetch("/api/classes", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ className, teacher, section, students, roomNo, status })
  // });
}

document.addEventListener("DOMContentLoaded", () => {
  renderStats();
  populateFilterDropdowns();
  renderClassesTable();

  document.getElementById("tableSearch").addEventListener("input", renderClassesTable);
  document.getElementById("teacherFilter").addEventListener("change", renderClassesTable);
  document.getElementById("roomFilter").addEventListener("change", renderClassesTable);
  document.getElementById("statusFilter").addEventListener("change", renderClassesTable);

  document.getElementById("openAddClassBtn").addEventListener("click", openAddClassModal);
  document.getElementById("closeAddClassBtn").addEventListener("click", closeAddClassModal);
  document.getElementById("cancelAddClassBtn").addEventListener("click", closeAddClassModal);
  document.getElementById("addClassForm").addEventListener("submit", handleAddClassSubmit);

  document.getElementById("addClassOverlay").addEventListener("click", (e) => {
    if (e.target.id === "addClassOverlay") closeAddClassModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAddClassModal();
  });
});
