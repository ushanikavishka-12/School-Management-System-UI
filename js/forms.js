/* ==========================================================================
   Shared helpers for Add Student / Take Attendance / New Admission
   Data is kept in localStorage so the pages work fully offline with
   no backend — swap these functions out for real API calls whenever
   the school's backend is ready.
   ========================================================================== */

const STORAGE_KEYS = {
  students: 'bfis_students',
  attendance: 'bfis_attendance',
  admissions: 'bfis_admissions',
  admissionCounter: 'bfis_admission_counter',
};

function getData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error('Storage read failed for', key, e);
    return fallback;
  }
}

function setData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('Storage write failed for', key, e);
    return false;
  }
}

function getStudents() { return getData(STORAGE_KEYS.students, []); }
function saveStudents(list) { return setData(STORAGE_KEYS.students, list); }

function getAttendance() { return getData(STORAGE_KEYS.attendance, {}); }
function saveAttendance(obj) { return setData(STORAGE_KEYS.attendance, obj); }

function getAdmissions() { return getData(STORAGE_KEYS.admissions, []); }
function saveAdmissions(list) { return setData(STORAGE_KEYS.admissions, list); }

function nextAdmissionId() {
  let counter = getData(STORAGE_KEYS.admissionCounter, 0);
  counter += 1;
  setData(STORAGE_KEYS.admissionCounter, counter);
  const year = new Date().getFullYear();
  return `ADM-${year}-${String(counter).padStart(4, '0')}`;
}

function nextStudentId() {
  const students = getStudents();
  const maxNum = students.reduce((max, s) => {
    const m = /STU-(\d+)/.exec(s.id || '');
    return m ? Math.max(max, parseInt(m[1], 10)) : max;
  }, 0);
  return `STU-${String(maxNum + 1).padStart(4, '0')}`;
}

function initials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
}

/* Seed a handful of sample students on first run only, so
   Take Attendance has something to show before anyone has
   used Add Student yet. Safe to delete this block once the
   school has its own real student data. */
function seedSampleStudentsIfEmpty() {
  const existing = getStudents();
  if (existing.length > 0) return;

  const seed = [
    { id: 'STU-0001', name: 'Ashan Perera', className: 'Grade 6', section: 'A', gender: 'Male', guardianName: 'Nimal Perera', guardianPhone: '077 123 4567' },
    { id: 'STU-0002', name: 'Dinithi Fernando', className: 'Grade 6', section: 'A', gender: 'Female', guardianName: 'Kumari Fernando', guardianPhone: '071 234 5678' },
    { id: 'STU-0003', name: 'Kavindu Silva', className: 'Grade 6', section: 'A', gender: 'Male', guardianName: 'Ruwan Silva', guardianPhone: '076 345 6789' },
    { id: 'STU-0004', name: 'Senuli Jayawardena', className: 'Grade 6', section: 'B', gender: 'Female', guardianName: 'Anoma Jayawardena', guardianPhone: '070 456 7890' },
    { id: 'STU-0005', name: 'Tharindu Bandara', className: 'Grade 6', section: 'B', gender: 'Male', guardianName: 'Sunil Bandara', guardianPhone: '075 567 8901' },
    { id: 'STU-0006', name: 'Nethmi Rajapaksha', className: 'Grade 7', section: 'A', gender: 'Female', guardianName: 'Priyantha Rajapaksha', guardianPhone: '072 678 9012' },
    { id: 'STU-0007', name: 'Hasindu Weerasinghe', className: 'Grade 7', section: 'A', gender: 'Male', guardianName: 'Chandra Weerasinghe', guardianPhone: '078 789 0123' },
    { id: 'STU-0008', name: 'Ishara Gunawardena', className: 'Grade 7', section: 'B', gender: 'Female', guardianName: 'Malini Gunawardena', guardianPhone: '074 890 1234' },
  ];
  saveStudents(seed);
}

function showToast(message, type = 'success') {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    document.body.appendChild(toast);
  }
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  requestAnimationFrame(() => toast.classList.add('show'));
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

// Run seeding as soon as this script loads on any page that includes it.
seedSampleStudentsIfEmpty();