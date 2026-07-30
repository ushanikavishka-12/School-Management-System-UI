/* ==========================================================================
   Teachers Page Logic
   Renders the teachers table + stat cards, wires up search/filter dropdowns,
   and handles the "Add New Teacher" modal — new submissions are pushed into
   teachersData and immediately re-rendered into the table.
   Replace `teachersData` with a real API/database call whenever ready.
   ========================================================================== */

let teachersData = [
  {
    id: "T-1001", name: "Mrs. Nimalka Perera", role: "Mathematics Teacher",
    email: "nimalka.perera@bfis.edu.lk", phone: "077 123 4567",
    subject: "Mathematics", department: "Science", classes: "8A, 9A, 10A",
    experience: 8, status: "Active", avatarColor: "#7C4FC7"
  },
  {
    id: "T-1002", name: "Mr. Kasun De Silva", role: "English Teacher",
    email: "kasun.desilva@bfis.edu.lk", phone: "071 234 5678",
    subject: "English", department: "Languages", classes: "6C, 7A, 8C",
    experience: 5, status: "Active", avatarColor: "#3468D1"
  },
  {
    id: "T-1003", name: "Mrs. Shalini Fernando", role: "Science Teacher",
    email: "shalini.fernando@bfis.edu.lk", phone: "076 345 6789",
    subject: "Science", department: "Science", classes: "7B, 8B, 9B",
    experience: 7, status: "Active", avatarColor: "#1F9254"
  },
  {
    id: "T-1004", name: "Mr. Chaminda Jayasuriya", role: "ICT Teacher",
    email: "chaminda.j@bfis.edu.lk", phone: "070 456 7890",
    subject: "Information Technology", department: "ICT", classes: "6A, 7C, 8A",
    experience: 6, status: "Active", avatarColor: "#B8720A"
  },
  {
    id: "T-1005", name: "Mrs. Piumi Rathnayake", role: "History Teacher",
    email: "piumi.r@bfis.edu.lk", phone: "075 567 8901",
    subject: "History", department: "Humanities", classes: "9A, 10B",
    experience: 4, status: "Active", avatarColor: "#C2185B"
  }
];

// Real total shown in the stat card / pagination summary (86 total teachers in
// the system, even though only these 5 sample rows exist in teachersData).
// Swap this for teachersData.length once you're loading the full data set.
const totalTeachersInSystem = 86;
let nextTeacherNumber = 1006;

function getInitials(name) {
  const cleaned = name.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s*/i, "");
  return cleaned.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function subjectToClass(subject) {
  return "subject-" + subject.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/* ---------------- Stat cards ---------------- */
function renderStats() {
  document.getElementById("statTotal").textContent = totalTeachersInSystem;
  document.getElementById("statMale").textContent = "38";
  document.getElementById("statFemale").textContent = "48";
  document.getElementById("statMalePct").textContent = "44.2% of total";
  document.getElementById("statFemalePct").textContent = "55.8% of total";

  const uniqueSubjects = new Set(teachersData.map((t) => t.subject)).size;
  document.getElementById("statSubjects").textContent = uniqueSubjects || "24";

  const avgExp = teachersData.length
    ? (teachersData.reduce((sum, t) => sum + Number(t.experience), 0) / teachersData.length).toFixed(1)
    : "0";
  document.getElementById("statAvgExperience").textContent = avgExp + " Years";
}

/* ---------------- Filter dropdowns ---------------- */
function populateFilterDropdowns() {
  const subjectSelect = document.getElementById("subjectFilter");
  const departmentSelect = document.getElementById("departmentFilter");

  const subjects = [...new Set(teachersData.map((t) => t.subject))].sort();
  subjects.forEach((subj) => {
    const opt = document.createElement("option");
    opt.value = subj;
    opt.textContent = subj;
    subjectSelect.appendChild(opt);
  });

  const departments = [...new Set(teachersData.map((t) => t.department))].sort();
  departments.forEach((dept) => {
    const opt = document.createElement("option");
    opt.value = dept;
    opt.textContent = dept;
    departmentSelect.appendChild(opt);
  });
}

/* ---------------- Table rendering ---------------- */
function renderTeachersTable() {
  const searchTerm = document.getElementById("tableSearch").value.trim().toLowerCase();
  const subjectValue = document.getElementById("subjectFilter").value;
  const departmentValue = document.getElementById("departmentFilter").value;
  const statusValue = document.getElementById("statusFilter").value;

  const filtered = teachersData.filter((t) => {
    const matchesSearch =
      searchTerm === "" ||
      t.name.toLowerCase().includes(searchTerm) ||
      t.email.toLowerCase().includes(searchTerm) ||
      t.phone.toLowerCase().includes(searchTerm);
    const matchesSubject = subjectValue === "all" || t.subject === subjectValue;
    const matchesDepartment = departmentValue === "all" || t.department === departmentValue;
    const matchesStatus = statusValue === "all" || t.status === statusValue;
    return matchesSearch && matchesSubject && matchesDepartment && matchesStatus;
  });

  const tbody = document.getElementById("teachersTableBody");
  tbody.innerHTML = "";

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="10" style="text-align:center; padding:32px; color:#A9ABB6;">
        No teachers match your search.
      </td></tr>`;
  } else {
    filtered.forEach((t) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${t.id}</td>
        <td>
          <div class="teacher-name-cell">
            <div class="teacher-avatar" style="background:${t.avatarColor};">${getInitials(t.name)}</div>
            <div class="teacher-name-info">
              <span class="teacher-name">${t.name}</span>
              <span class="teacher-role">${t.role}</span>
            </div>
          </div>
        </td>
        <td>${t.email}</td>
        <td><span class="subject-badge ${subjectToClass(t.subject)}">${t.subject}</span></td>
        <td>${t.department}</td>
        <td>${t.classes}</td>
        <td>${t.experience} Years</td>
        <td>${t.phone}</td>
        <td><span class="status-badge status-${t.status.toLowerCase()}">${t.status}</span></td>
        <td>
          <div class="row-actions">
            <button title="View" onclick="viewTeacher('${t.id}')"><i class="fa-solid fa-eye"></i></button>
            <button title="Edit" onclick="editTeacher('${t.id}')"><i class="fa-solid fa-pen"></i></button>
            <button title="More" onclick="moreOptions('${t.id}')"><i class="fa-solid fa-ellipsis-vertical"></i></button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById("paginationSummary").textContent =
    `Showing 1 to ${filtered.length} of ${totalTeachersInSystem} teachers`;
}

/* ---------------- Row action placeholders ---------------- */
function viewTeacher(id) { console.log("View teacher", id); }
function editTeacher(id) { console.log("Edit teacher", id); }
function moreOptions(id) { console.log("More options for", id); }

/* ---------------- Add Teacher modal ---------------- */
function openAddTeacherModal() {
  document.getElementById("addTeacherOverlay").classList.add("open");
  document.getElementById("addTeacherError").textContent = "";
}

function closeAddTeacherModal() {
  document.getElementById("addTeacherOverlay").classList.remove("open");
  document.getElementById("addTeacherForm").reset();
  document.getElementById("addTeacherError").textContent = "";
}

const avatarColorPalette = ["#7C4FC7", "#3468D1", "#1F9254", "#B8720A", "#C2185B", "#0E7C86", "#D14343"];
function randomAvatarColor() {
  return avatarColorPalette[Math.floor(Math.random() * avatarColorPalette.length)];
}

function handleAddTeacherSubmit(e) {
  e.preventDefault();
  const errorEl = document.getElementById("addTeacherError");

  const name = document.getElementById("fieldName").value.trim();
  let teacherId = document.getElementById("fieldTeacherId").value.trim();
  const role = document.getElementById("fieldRole").value.trim();
  const email = document.getElementById("fieldEmail").value.trim();
  const phone = document.getElementById("fieldPhone").value.trim();
  const subject = document.getElementById("fieldSubject").value;
  const department = document.getElementById("fieldDepartment").value;
  const classes = document.getElementById("fieldClasses").value.trim();
  const experience = document.getElementById("fieldExperience").value;
  const status = document.getElementById("fieldStatus").value;

  if (!name || !role || !email || !phone || !subject || !department || !classes || experience === "") {
    errorEl.textContent = "Please fill in all required fields.";
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    errorEl.textContent = "Please enter a valid email address.";
    return;
  }

  if (!teacherId) {
    teacherId = `T-${nextTeacherNumber++}`;
  }

  teachersData.push({
    id: teacherId, name, role, email, phone,
    subject, department, classes,
    experience: Number(experience), status,
    avatarColor: randomAvatarColor()
  });

  closeAddTeacherModal();
  renderTeachersTable();
  renderStats();

  // This is where you'd call your real "create teacher" API. Example:
  // fetch("/api/teachers", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ teacherId, name, role, email, phone, subject, department, classes, experience, status })
  // });
}

document.addEventListener("DOMContentLoaded", () => {
  renderStats();
  populateFilterDropdowns();
  renderTeachersTable();

  document.getElementById("tableSearch").addEventListener("input", renderTeachersTable);
  document.getElementById("subjectFilter").addEventListener("change", renderTeachersTable);
  document.getElementById("departmentFilter").addEventListener("change", renderTeachersTable);
  document.getElementById("statusFilter").addEventListener("change", renderTeachersTable);

  document.getElementById("openAddTeacherBtn").addEventListener("click", openAddTeacherModal);
  document.getElementById("closeAddTeacherBtn").addEventListener("click", closeAddTeacherModal);
  document.getElementById("cancelAddTeacherBtn").addEventListener("click", closeAddTeacherModal);
  document.getElementById("addTeacherForm").addEventListener("submit", handleAddTeacherSubmit);

  document.getElementById("addTeacherOverlay").addEventListener("click", (e) => {
    if (e.target.id === "addTeacherOverlay") closeAddTeacherModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAddTeacherModal();
  });
});
