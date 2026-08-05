
# School-Management-System-UI

Frontend UI for the **School Management System**, designed and developed for **EGOTECH WORLD**.

---

## Project Overview

This project focuses on creating a modern, responsive, and user-friendly **School Management System interface**. The UI was designed to provide an efficient experience for managing school operations through a clean dashboard-based layout.

The project follows a reusable component architecture by separating common UI elements such as the **Topbar** and **Footer** into individual components and integrating them across all pages. Functional pages — Add Student, Take Attendance, New Admission, Teachers, and Classes — are wired up with client-side JavaScript and `localStorage`, so the UI is fully interactive without needing a backend yet.

---

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- Bootstrap 5
- Chart.js (dashboard charts)
- Font Awesome (icons)
- Figma (UI Design)

---

## Project Structure


School-Management-System-UI
│
├── components
│   ├── footer.html
│   └── topbar.html
│
├── images
│   └── school.jpeg
│
├── js
│   ├── components.js
│   ├── dashboard.js
│   ├── forms.js
│   ├── teachers.js
│   └── class.js
│
├── styles
│   ├── components.css
│   ├── dashboard.css
│   ├── forms.css
│   ├── teachers.css
│   └── class.css
│
├── dashboard.html
├── add-student.html
├── take-attendance.html
├── new-admission.html
├── teachers.html
├── classes.html
│
└── README.md


---

## Features

### Dashboard

- Modern school management dashboard interface with a photo-blended welcome banner
- Overview of key school statistics (students, classes, teachers, exams, attendance, revenue)
- Attendance and academic performance charts (Chart.js)
- Upcoming events panel
- Quick action shortcuts linking directly to Add Student, Take Attendance, and New Admission
- Fully responsive layout with no horizontal overflow

### Student Management

- **Add Student** — validated form for entering student details (personal info, class/section, guardian info), saved to local storage with an auto-generated Student ID and a success confirmation screen

### Attendance

- **Take Attendance** — select class, section, and date; mark each student Present, Late, or Absent with a live running summary; supports "Mark All Present" and remembers previously saved attendance per class/section/date

### Admissions

- **New Admission** — multi-section application form (applicant details, previous school, guardian info, required documents checklist, terms agreement) that generates a formatted admission ID (e.g. `ADM-2026-0001`) and a printable confirmation summary

### Teachers

- Full teacher directory table with search, subject/department/status filters, and pagination
- Stat cards for total/male/female teacher counts, subjects taught, and average experience
- **Add New Teacher** modal with validation
- **Export** button that downloads the currently filtered/searched teacher list as a CSV file

### Classes

- Full classes directory table with search, teacher/room/status filters, and pagination
- Stat cards for total classes, new sections, total sections, average class size, and active class percentage
- **Add New Class** modal with validation, reused for editing existing classes
- Row-level **View** action opens a details modal for a class (teacher, section, students, room, status)
- Row-level **⋮ menu** with working **Edit** (pre-fills and updates the class) and **Delete** (with confirmation) actions
- **Export** button that downloads the currently filtered/searched class list as a CSV file

### Reusable Components

- Shared Topbar and Footer components injected via `js/components.js`
- Shared form/page styling (`styles/forms.css`) and helpers (`js/forms.js`) reused across Add Student, Take Attendance, and New Admission
- Shared modal, table, and dropdown-menu patterns reused across Teachers and Classes
- Component-based structure for easier maintenance and future expansion

### User Interface Design

- Clean, professional school-themed design with a consistent color palette
- Responsive layout across dashboard, tables, and forms
- Organized navigation structure across all pages
- Interactive elements: modals, toasts, dropdown action menus, segmented controls, live filtering

---

## Pages Developed

- School Management Dashboard
- Add Student
- Take Attendance
- New Admission
- Teachers
- Classes
- Topbar Component
- Footer Component

---

## Data Storage

All interactive pages currently persist data in the browser's `localStorage` (students, attendance records, admissions) or an in-memory JavaScript array (teachers, classes), so the UI works fully offline with no backend required. Sample data is seeded automatically on first load. Each page's JavaScript file isolates its data/storage logic so it can be swapped for real API calls once a backend is available — CRUD actions (create, edit, delete, export) already include commented-out example `fetch()` calls marking where backend integration would go.

---

## Development Process

1. Designed the user interface in **Figma**.
2. Created the frontend structure using **HTML5**.
3. Developed styling using **CSS3 and Bootstrap 5**.
4. Added JavaScript functionality for reusable components, dashboard interactions, and page-specific features (forms, tables, filtering, export, edit/delete).
5. Organized files into separate folders for better project management.
6. Tested and refined the UI for better user experience and responsiveness.

---

## Future Improvements

- Add grades and examination results management module
- Add edit/delete functionality for students and attendance records (already implemented for Teachers export and Classes)
- Connect all pages to real backend APIs (replace `localStorage`/in-memory arrays with database-backed storage)
- Implement user authentication and role-based access (Admin, Teacher, Student)
- Add pagination logic backed by real data (currently sample-only)
- Add Edit/Delete actions to the Teachers page (currently Classes-only)

---

## Author

Developed as a frontend UI project for **EGOTECH WORLD**.