/* ==========================================================================
   Grades Page Logic
   Renders the grade records table + stat cards, wires up search/filter
   dropdowns, and handles the "Add Grade" modal — new submissions are pushed
   into gradesData and immediately re-rendered into the table. Grade letter
   and grade point are always calculated automatically from the score.
   Replace `gradesData` with a real API/database call whenever ready.
   ========================================================================== */

let gradesData = [
  { studentId: "ST-1001", name: "Sudam Perera",   class: "6 A", subject: "Mathematics", term: "Term 2 (2026)", score: 95.6, rank: "1/36" },
  { studentId: "ST-1002", name: "Vishva Silva",    class: "6 A", subject: "Science",     term: "Term 2 (2026)", score: 80.3, rank: "2/36" },
  { studentId: "ST-1003", name: "Tharuni Navodha", class: "6 A", subject: "English",     term: "Term 2 (2026)", score: 76.5, rank: "8/40" },
  { studentId: "ST-1004", name: "Minul Gagun",     class: "6 A", subject: "History",     term: "Term 2 (2026)", score: 50.7, rank: "30/36" }
];

// School-wide totals shown in the stat cards (from the design), separate
// from the 4 sample rows above. Swap for real aggregated values once you're
// loading the full grades data set.
const schoolWideStats = {
  totalStudents: 2563,
  averageGradePct: 81.25,
  aPlusCount: 396,
  aPlusPctOfTotal: 18.2,
  passRatePct: 94.8,
  subjectAveragePct: 18
};

// Converts a numeric score into a letter grade + grade point. Adjust these
// cutoffs to match your school's actual grading scale.
function scoreToGrade(score) {
  if (score >= 90) return { letter: "A+", point: 4.0 };
  if (score >= 80) return { letter: "A",  point: 3.7 };
  if (score >= 70) return { letter: "B+", point: 3.3 };
  if (score >= 60) return { letter: "B",  point: 3.0 };
  if (score >= 50) return { letter: "C+", point: 2.3 };
  if (score >= 40) return { letter: "C",  point: 2.0 };
  return { letter: "F", point: 0.0 };
}

function gradeToClass(letter) {
  return "grade-" + letter.toLowerCase().replace("+", "-plus");
}

/* ---------------- Stat cards ---------------- */
function renderStats() {
  document.getElementById("statTotal").textContent = schoolWideStats.totalStudents.toLocaleString();
  document.getElementById("statAvgGrade").textContent = schoolWideStats.averageGradePct + "%";
  document.getElementById("statAPlus").textContent = schoolWideStats.aPlusCount;
  document.getElementById("statAPlusPct").textContent = schoolWideStats.aPlusPctOfTotal + "% of total";
  document.getElementById("statPassRate").textContent = schoolWideStats.passRatePct + "%";
  document.getElementById("statSubjectAvg").textContent = schoolWideStats.subjectAveragePct;
}

/* ---------------- Filter dropdowns ---------------- */
function populateFilterDropdowns() {
  const classSelect = document.getElementById("classFilter");
  const classes = [...new Set(gradesData.map((g) => g.class))].sort();
  classes.forEach((cls) => {
    const opt = document.createElement("option");
    opt.value = cls;
    opt.textContent = cls;
    classSelect.appendChild(opt);
  });

  // Sections aren't used on this page — removed duplicate grade selector.

  // Subject filter
  const subjectSelect = document.getElementById("subjectFilter");
  const subjects = [...new Set(gradesData.map((g) => g.subject))].sort();
  subjects.forEach((subj) => {
    const opt = document.createElement("option");
    opt.value = subj;
    opt.textContent = subj;
    subjectSelect.appendChild(opt);
  });
}

function refreshClassFilter() {
  const classSelect = document.getElementById("classFilter");
  const current = classSelect.value;
    classSelect.innerHTML = '<option value="all">All Grade</option>';
  const classes = [...new Set(gradesData.map((g) => g.class))].sort();
  classes.forEach((cls) => {
    const opt = document.createElement("option");
    opt.value = cls;
    opt.textContent = cls;
    classSelect.appendChild(opt);
  });
  classSelect.value = [...classSelect.options].some((o) => o.value === current) ? current : "all";
}

function refreshSubjectFilter() {
  const subjectSelect = document.getElementById("subjectFilter");
  const current = subjectSelect.value;
  subjectSelect.innerHTML = '<option value="all">All Subject</option>';
  const subjects = [...new Set(gradesData.map((g) => g.subject))].sort();
  subjects.forEach((subj) => {
    const opt = document.createElement("option");
    opt.value = subj;
    opt.textContent = subj;
    subjectSelect.appendChild(opt);
  });
  subjectSelect.value = [...subjectSelect.options].some((o) => o.value === current) ? current : "all";
}

/* ---------------- Table rendering ---------------- */
function renderGradesTable() {
  const searchTerm = document.getElementById("tableSearch").value.trim().toLowerCase();
  const classValue = document.getElementById("classFilter").value;
  const subjectValue = document.getElementById("subjectFilter")?.value || "all";

  const filtered = gradesData.filter((g) => {
    const matchesSearch =
      searchTerm === "" ||
      g.name.toLowerCase().includes(searchTerm) ||
      g.studentId.toLowerCase().includes(searchTerm) ||
      g.class.toLowerCase().includes(searchTerm);
    const matchesClass = classValue === "all" || g.class === classValue;
    const matchesSubject = subjectValue === "all" || g.subject === subjectValue;
    return matchesSearch && matchesClass && matchesSubject;
  });

  const tbody = document.getElementById("gradesTableBody");
  tbody.innerHTML = "";

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="10" style="text-align:center; padding:32px; color:#A9ABB6;">
        No grade records match your search.
      </td></tr>`;
  } else {
    filtered.forEach((g, index) => {
      const grade = scoreToGrade(g.score);
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${g.studentId}</td>
        <td class="student-name-cell">${g.name}</td>
        <td>${g.class}</td>
        <td>${g.subject}</td>
        <td>${g.term}</td>
        <td><span class="grade-badge ${gradeToClass(grade.letter)}">${grade.letter}</span></td>
        <td>${g.score.toFixed(1)}%</td>
        <td>${grade.point.toFixed(1)}</td>
        <td>${g.rank || "-"}</td>
        <td>
          <div class="row-actions">
            <button title="View" onclick="viewGrade(${index})"><i class="fa-solid fa-eye"></i></button>
            <button title="More" onclick="moreOptions(${index})"><i class="fa-solid fa-ellipsis-vertical"></i></button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById("paginationSummary").textContent =
    `Showing 1 to ${filtered.length} of ${gradesData.length} students`;
}

/* ---------------- Export CSV ---------------- */
function exportVisibleGradesCSV() {
  const rows = [];
  const headers = ["Student ID","Student Name","Class","Subject","Term","Score","Grade Point","Rank"];
  rows.push(headers.join(","));

  const tbody = document.getElementById("gradesTableBody");
  [...tbody.querySelectorAll("tr")].forEach((tr) => {
    if (tr.querySelector("td") == null) return;
    const cols = [...tr.querySelectorAll("td")].slice(0, 9).map(td => td.textContent.trim().replace(/,/g, ""));
    rows.push(cols.join(","));
  });

  const csv = rows.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `grades_export_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ---------------- Row action placeholders ---------------- */
function viewGrade(index) { console.log("View grade record", gradesData[index]); }
function moreOptions(index) { console.log("More options for", gradesData[index]); }

/* ---------------- Add Grade modal ---------------- */
function openAddGradeModal() {
  document.getElementById("addGradeOverlay").classList.add("open");
  document.getElementById("addGradeError").textContent = "";
}

function closeAddGradeModal() {
  document.getElementById("addGradeOverlay").classList.remove("open");
  document.getElementById("addGradeForm").reset();
  document.getElementById("addGradeError").textContent = "";
}

function handleAddGradeSubmit(e) {
  e.preventDefault();
  const errorEl = document.getElementById("addGradeError");

  const studentId = document.getElementById("fieldStudentId").value.trim();
  const name = document.getElementById("fieldStudentName").value.trim();
  const studentClass = document.getElementById("fieldClass").value.trim();
  const subject = document.getElementById("fieldSubject").value;
  const term = document.getElementById("fieldTerm").value.trim();
  const score = document.getElementById("fieldScore").value;
  const rank = document.getElementById("fieldRank").value.trim();

  if (!studentId || !name || !studentClass || !subject || !term || score === "") {
    errorEl.textContent = "Please fill in all required fields.";
    return;
  }

  const scoreNum = Number(score);
  if (scoreNum < 0 || scoreNum > 100) {
    errorEl.textContent = "Score must be between 0 and 100.";
    return;
  }

  gradesData.push({
    studentId, name, class: studentClass, subject, term,
    score: scoreNum, rank: rank || ""
  });

  closeAddGradeModal();
  refreshClassFilter();
  refreshSubjectFilter();
  renderGradesTable();

  // This is where you'd call your real "add grade" API. Example:
  // fetch("/api/grades", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ studentId, name, class: studentClass, subject, term, score: scoreNum, rank })
  // });
}

document.addEventListener("DOMContentLoaded", () => {
  renderStats();
  populateFilterDropdowns();
  renderGradesTable();

  document.getElementById("tableSearch").addEventListener("input", renderGradesTable);
  document.getElementById("classFilter").addEventListener("change", renderGradesTable);
  

  document.getElementById("openAddGradeBtn").addEventListener("click", openAddGradeModal);
  document.getElementById("closeAddGradeBtn").addEventListener("click", closeAddGradeModal);
  document.getElementById("cancelAddGradeBtn").addEventListener("click", closeAddGradeModal);
  document.getElementById("addGradeForm").addEventListener("submit", handleAddGradeSubmit);

  // Subject filter and export button wiring
  const subjectEl = document.getElementById("subjectFilter");
  if (subjectEl) subjectEl.addEventListener("change", renderGradesTable);
  const exportBtn = document.getElementById("exportBtn");
  if (exportBtn) exportBtn.addEventListener("click", exportVisibleGradesCSV);

  document.getElementById("addGradeOverlay").addEventListener("click", (e) => {
    if (e.target.id === "addGradeOverlay") closeAddGradeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAddGradeModal();
  });
});
