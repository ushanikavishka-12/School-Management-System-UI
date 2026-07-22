const FALLBACK_COMPONENTS = {
  sidebar: `<aside class="sidebar" id="sidebar">

  <!-- Logo -->
  <div class="sidebar-logo">
    <div class="logo-icon">
      <i class="fa-solid fa-building"></i>
    </div>
    <div class="logo-text">
      <span class="logo-title">Hotel Sys</span>
      <span class="logo-sub">Hotel Management System</span>
    </div>
  </div>

  <!-- Nav -->
  <nav class="sidebar-nav">
    <a href="dashboard.html" class="nav-item" data-page="dashboard">
      <i class="fa-solid fa-table-columns"></i>
      <span>Dashboard</span>
    </a>
    <a href="reservations.html" class="nav-item" data-page="reservations">
      <i class="fa-solid fa-calendar-check"></i>
      <span>Reservations</span>
    </a>
    <a href="room-management.html" class="nav-item" data-page="rooms">
      <i class="fa-solid fa-door-open"></i>
      <span>Room Management</span>
    </a>
    <a href="housekeeping.html" class="nav-item" data-page="housekeeping">
      <i class="fa-solid fa-broom"></i>
      <span>Housekeeping</span>
    </a>
    <a href="pos.html" class="nav-item" data-page="pos">
      <i class="fa-solid fa-cash-register"></i>
      <span>Point of Sales</span>
    </a>
    <a href="billing.html" class="nav-item" data-page="billing">
      <i class="fa-solid fa-file-invoice-dollar"></i>
      <span>Billing & Invoicing</span>
    </a>
    <a href="staff_manage.html" class="nav-item" data-page="staff">
      <i class="fa-solid fa-users"></i>
      <span>Staff Management</span>
    </a>
    <a href="reports.html" class="nav-item" data-page="reports">
      <i class="fa-solid fa-chart-column"></i>
      <span>Reports</span>
    </a>
  </nav>

  <!-- Trial Plan Banner -->
  <div class="trial-banner">
    <div class="trial-top">
      <span class="trial-label">Trial Plan</span>
      <span class="trial-badge">41 Days Left</span>
    </div>
    <p class="trial-desc">Enjoy full access to all features.</p>
    <button class="btn-upgrade">
      <i class="fa-solid fa-crown"></i> Upgrade Now
    </button>
  </div>

  <div class="sidebar-bottom">
    <a href="signin.html" class="logout-link">
      <i class="fa-solid fa-right-from-bracket"></i>
      <span>Sign Out</span>
    </a>
  </div>

</aside>`,
  topbar: `<header class="topbar">

  <div class="topbar-left">
    <div class="brand-logo">
      <span class="brand-logo-icon">🎓</span>
      <div class="brand-logo-text">
        <span class="brand-name">Bright Future</span>
        <span class="brand-sub">International School</span>
      </div>
    </div>
  </div>

  <nav class="topbar-nav">
    <a href="dashboard.html" class="nav-link" data-page="dashboard.html">Dashboard</a>
    <a href="student.html" class="nav-link" data-page="student.html">Student</a>
    <a href="teachers.html" class="nav-link" data-page="teachers.html">Teachers</a>
    <a href="classes.html" class="nav-link" data-page="classes.html">Classes</a>
    <a href="attendance.html" class="nav-link" data-page="attendance.html">Attendance</a>
    <a href="grades.html" class="nav-link" data-page="grades.html">Grades</a>
  </nav>

  <div class="topbar-right">
    <button class="icon-btn" title="Calendar">📅</button>
    <button class="icon-btn" title="Notifications">🔔</button>

    <div class="admin-menu">
      <span class="admin-avatar">👤</span>
      <span class="admin-name">Admin</span>
      <span class="admin-caret">▾</span>
    </div>
  </div>

</header>`,
  footer: `<footer class="footer">
  <div class="footer-content">

    <div class="footer-brand-col">
      <div class="footer-brand-name">EgoTECH World</div>
      <p class="footer-brand-desc">
        Developing ready made and custom solutions for modern challenges.
      </p>
    </div>

    <div class="footer-nav-col">
      <h5 class="footer-col-title">Navigation</h5>
      <div class="footer-links-grid">
        <div class="footer-links-col">
          <a href="#">Home</a>
          <a href="#">Job</a>
          <a href="#">Services</a>
        </div>
        <div class="footer-links-col">
          <a href="#">Projects</a>
          <a href="#">Contact</a>
          <a href="#">About</a>
        </div>
      </div>
    </div>

    <div class="footer-divider-v"></div>

    <div class="footer-nav-col">
      <h5 class="footer-col-title">Resources</h5>
      <div class="footer-links-grid">
        <div class="footer-links-col">
          <a href="#">Documentation</a>
          <a href="#">Pricing</a>
          <a href="#">Support</a>
        </div>
        <div class="footer-links-col">
          <a href="#">Privacy &amp; Policy</a>
          <a href="#">Terms &amp; Conditions</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
    </div>

    <div class="footer-divider-v"></div>

    <div class="footer-social-col">
      <h5 class="footer-col-title">Stay Connected</h5>
      <div class="footer-social-icons">
        <a href="#" class="social-icon facebook" aria-label="Facebook">
          <i class="fa-brands fa-facebook-f"></i>
        </a>
        <a href="#" class="social-icon linkedin" aria-label="LinkedIn">
          <i class="fa-brands fa-linkedin-in"></i>
        </a>
      </div>
      <p class="footer-follow">Follow Us</p>
    </div>

  </div>

  <div class="footer-bottom">
    &copy; 2026 egotechworld.com &nbsp;&ndash;&nbsp;
    EGOTECHWORLD PVT LTD. All Rights Reserved.
  </div>
</footer>`
};

async function loadComponent(selector, filePath) {
  try {
    const target = document.querySelector(selector);
    if (!target) return;

    const useFallback = location.protocol === 'file:';
    if (useFallback) {
      const componentName = filePath.includes('sidebar')
        ? 'sidebar'
        : filePath.includes('topbar')
          ? 'topbar'
          : 'footer';
      target.innerHTML = FALLBACK_COMPONENTS[componentName];
      return;
    }

    const res = await fetch(filePath);
    if (!res.ok) throw new Error(`Failed to load ${filePath}`);
    const html = await res.text();
    target.innerHTML = html;
  } catch (err) {
    console.error(err);

    const target = document.querySelector(selector);
    if (!target) return;

    const componentName = filePath.includes('sidebar')
      ? 'sidebar'
      : filePath.includes('topbar')
        ? 'topbar'
        : 'footer';
    target.innerHTML = FALLBACK_COMPONENTS[componentName];
  }
}

function setActiveNav() {
  const page = document.body.dataset.page;
  if (!page) return;
  const normalizedPage = page.replace(/\.html$/i, '');

  document.querySelectorAll('.nav-item, .nav-link').forEach(item => {
    item.classList.remove('active');
    const itemPage = (item.dataset.page || '').replace(/\.html$/i, '');
    if (itemPage === normalizedPage) {
      item.classList.add('active');
    }
  });
}

function setPageTitle() {
  const title = document.body.dataset.title;
  const sub   = document.body.dataset.sub;
  const el    = document.getElementById('page-title');
  const elSub = document.getElementById('page-sub');
  if (title && el) el.textContent = title;
  if (sub && elSub) elSub.textContent = sub;
}

async function loadAllComponents() {
  await loadComponent('#sidebar-placeholder', 'components/sidebar.html');
  await loadComponent('#topbar-placeholder',  'components/topbar.html');
  await loadComponent('#footer-placeholder',  'components/footer.html');
  setActiveNav();
  setPageTitle();
}

document.addEventListener('DOMContentLoaded', loadAllComponents);