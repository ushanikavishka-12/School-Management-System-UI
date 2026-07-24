/* ==========================================================================
   components.js — loads shared Topbar + Footer into every page
   Works with Live Server (fetch) AND direct file:// open (fallback HTML)
   ========================================================================== */

/* ── Fallback HTML (used when fetch() is unavailable via file://) ── */
const FALLBACK_COMPONENTS = {

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
    <a href="students.html"  class="nav-link" data-page="students.html">Students</a>
    <a href="teachers.html"  class="nav-link" data-page="teachers.html">Teachers</a>
    <a href="classes.html"   class="nav-link" data-page="classes.html">Classes</a>
    <a href="attendance.html" class="nav-link" data-page="attendance.html">Attendance</a>
    <a href="grades.html"    class="nav-link" data-page="grades.html">Grades</a>
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

/* ── Load a component file into a placeholder element ── */
async function loadComponent(selector, filePath) {
  const target = document.querySelector(selector);
  if (!target) return;

  /* Determine which fallback key to use */
  const key = filePath.includes('topbar')
    ? 'topbar'
    : filePath.includes('footer')
      ? 'footer'
      : null;

  /* Use fallback directly when opened via file:// */
  if (location.protocol === 'file:') {
    if (key && FALLBACK_COMPONENTS[key]) {
      target.innerHTML = FALLBACK_COMPONENTS[key];
    }
    return;
  }

  /* Otherwise fetch the file (Live Server / real server) */
  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error(`Failed to load ${filePath}`);
    target.innerHTML = await res.text();
  } catch (err) {
    console.warn('fetch failed, using fallback:', err.message);
    if (key && FALLBACK_COMPONENTS[key]) {
      target.innerHTML = FALLBACK_COMPONENTS[key];
    }
  }
}

/* ── Highlight the active nav link ── */
function setActiveNav() {
  const page = document.body.dataset.page || '';
  const normalised = page.replace(/\.html$/i, '');
  const currentFile = location.pathname.split('/').pop().replace(/\.html$/i, '');

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    const linkPage = (link.dataset.page || '').replace(/\.html$/i, '');
    if (linkPage === normalised || linkPage === currentFile) {
      link.classList.add('active');
    }
  });
}

/* ── Set page title / subtitle from data attributes ── */
function setPageMeta() {
  const title = document.body.dataset.title;
  const sub   = document.body.dataset.sub;
  const elTitle = document.getElementById('page-title');
  const elSub   = document.getElementById('page-sub');
  if (title && elTitle) elTitle.textContent = title;
  if (sub   && elSub)   elSub.textContent   = sub;
}

/* ── Boot ── */
async function loadAllComponents() {
  await loadComponent('#topbar-placeholder',  'components/topbar.html');
  await loadComponent('#footer-placeholder',  'components/footer.html');
  setActiveNav();
  setPageMeta();
}

document.addEventListener('DOMContentLoaded', loadAllComponents);