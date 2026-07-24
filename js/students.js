// ===============================
// students.js
// Handles: student data, rendering table, stats,
// Add New Student modal, and localStorage persistence
// ===============================

const STORAGE_KEY = "sms_students";

// Starting sample data (matches the design mock)
const defaultStudents = [
  {
    id: "ST-1001",
    name: "Sudam Fernando",
    email: "sudam@edu.lk",
    class: "8A",
    dob: "2013-05-22",
    gender: "Male",
    parentName: "Mahesh Induwara",
    parentContact: "077 4587 517",
    status: "Active"
  },
  {
    id: "ST-1002",
    name: "Hasini Amasha",
    email: "hasini.a@edu.lk",
    class: "6C",
    dob: "2015-11-06",
    gender: "Female",
    parentName: "Shen De Silva",
    parentContact: "076 3490 211",
    status: "Active"
  },
  {
    id: "ST-1003",
    name: "Vishwa Perera",
    email: "vishwa.p@edu.lk",
    class: "9D",
    dob: "2014-07-14",
    gender: "Male",
    parentName: "Amila Perera",
    parentContact: "077 4566 517",
    status: "Inactive"
  }
];

let students = loadStudents();

// ---- Pagination state ----
const ROWS_PER_PAGE = 8;
let currentPage = 1;

// ===== Load / Save =====
function loadStudents() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [...defaultStudents];
    }
  }
  return [...defaultStudents];
}

function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

// ===== Helpers =====
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
}

function generateNextId() {
  const nums = students
    .map(s => parseInt(s.id.replace("ST-", ""), 10))
    .filter(n => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 1000;
  return "ST-" + (max + 1);
}

function populateClassFilter() {
  const classFilter = document.getElementById("classFilter");
  const currentValue = classFilter.value;
  const uniqueClasses = [...new Set(students.map(s => s.class))].sort();

  classFilter.innerHTML = '<option value="">All Classes</option>';
  uniqueClasses.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    classFilter.appendChild(opt);
  });
  classFilter.value = currentValue;
}

// ===== Stats =====
function updateStats(filteredList) {
  const total = students.length;
  const male = students.filter(s => s.gender === "Male").length;
  const female = students.filter(s => s.gender === "Female").length;
  const active = students.filter(s => s.status === "Active").length;
  const activePercent = total ? ((active / total) * 100).toFixed(1) : "0.0";
  const malePercent = total ? ((male / total) * 100).toFixed(1) : "0.0";
  const femalePercent = total ? ((female / total) * 100).toFixed(1) : "0.0";

  document.getElementById("statTotal").textContent = total.toLocaleString();
  document.getElementById("statNew").textContent = 0; // placeholder, tracked separately if needed
  document.getElementById("statMale").textContent = male.toLocaleString();
  document.getElementById("statMaleChange").textContent = malePercent + "%";
  document.getElementById("statFemale").textContent = female.toLocaleString();
  document.getElementById("statFemaleChange").textContent = femalePercent + "%";
  document.getElementById("statActive").textContent = activePercent + "%";
}

// ===== Render Table =====
function renderTable() {
  const tbody = document.getElementById("studentsTableBody");
  const searchValue = document.getElementById("searchInput").value.toLowerCase();
  const classValue = document.getElementById("classFilter").value;
  const statusValue = document.getElementById("statusFilter").value;

  let filtered = students.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchValue) ||
      s.id.toLowerCase().includes(searchValue) ||
      (s.email || "").toLowerCase().includes(searchValue);
    const matchesClass = classValue ? s.class === classValue : true;
    const matchesStatus = statusValue ? s.status === statusValue : true;
    return matchesSearch && matchesClass && matchesStatus;
  });

  // Pagination
  const totalRows = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / ROWS_PER_PAGE));
  if (currentPage > totalPages) currentPage = totalPages;
  const startIdx = (currentPage - 1) * ROWS_PER_PAGE;
  const pageRows = filtered.slice(startIdx, startIdx + ROWS_PER_PAGE);

  tbody.innerHTML = "";

  if (pageRows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#9CA3AF; padding:24px;">No students found</td></tr>`;
  }

  pageRows.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="student-id">${s.id}</td>
      <td>
        <div class="student-name-cell">
          <span>${s.name}</span>
          <span class="email">${s.email || ""}</span>
        </div>
      </td>
      <td>${s.class}</td>
      <td>${formatDate(s.dob)}</td>
      <td><span class="badge ${s.gender === "Male" ? "male" : "female"}">${s.gender}</span></td>
      <td>
        <div class="parent-info">
          <span>${s.parentName}</span>
          <span class="contact">${s.parentContact}</span>
        </div>
      </td>
      <td><span class="badge ${s.status === "Active" ? "active" : "inactive"}">${s.status}</span></td>
      <td class="actions-cell">
        <i class="fa-regular fa-eye" title="View" data-id="${s.id}"></i>
        <i class="fa-solid fa-ellipsis-vertical" title="More" data-id="${s.id}"></i>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Footer text
  const showingText = document.getElementById("showingText");
  if (totalRows === 0) {
    showingText.textContent = "Showing 0 to 0 of 0 students";
  } else {
    showingText.textContent = `Showing ${startIdx + 1} to ${Math.min(startIdx + ROWS_PER_PAGE, totalRows)} of ${totalRows} students`;
  }

  renderPagination(totalPages);
  updateStats(filtered);
}

function renderPagination(totalPages) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const prevBtn = document.createElement("button");
  prevBtn.innerHTML = "&lt;";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => { currentPage--; renderTable(); };
  pagination.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.onclick = () => { currentPage = i; renderTable(); };
    pagination.appendChild(btn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.innerHTML = "&gt;";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => { currentPage++; renderTable(); };
  pagination.appendChild(nextBtn);
}

// ===== Modal Controls =====
const modal = document.getElementById("addStudentModal");
const openBtn = document.getElementById("openAddStudentBtn");
const closeBtn = document.getElementById("closeAddStudentBtn");
const cancelBtn = document.getElementById("cancelAddStudentBtn");
const addStudentForm = document.getElementById("addStudentForm");

function openModal() {
  modal.classList.add("open");
}

function closeModal() {
  modal.classList.remove("open");
  addStudentForm.reset();
}

openBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// ===== Add Student Form Submit =====
addStudentForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const newStudent = {
    id: generateNextId(),
    name: document.getElementById("fName").value.trim(),
    email: document.getElementById("fEmail").value.trim(),
    class: document.getElementById("fClass").value.trim(),
    dob: document.getElementById("fDob").value,
    gender: document.getElementById("fGender").value,
    parentName: document.getElementById("fParentName").value.trim(),
    parentContact: document.getElementById("fParentContact").value.trim(),
    status: document.getElementById("fStatus").value
  };

  students.unshift(newStudent); // add to top of the list
  saveStudents();
  populateClassFilter();
  currentPage = 1;
  renderTable();
  closeModal();
});

// ===== Search & Filters =====
document.getElementById("searchInput").addEventListener("input", () => {
  currentPage = 1;
  renderTable();
});
document.getElementById("classFilter").addEventListener("change", () => {
  currentPage = 1;
  renderTable();
});
document.getElementById("statusFilter").addEventListener("change", () => {
  currentPage = 1;
  renderTable();
});

// ===== Init =====
populateClassFilter();
renderTable();
