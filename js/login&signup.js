/* ==========================================================================
   Sign In / Sign Up Page Logic
   Handles Login/Sign up tab switching, password show/hide toggles, and
   client-side form validation for both forms.
   Wire up the actual account-creation / login API calls where noted below.
   ========================================================================== */

function switchTab(tab) {
  const loginWrap = document.getElementById("loginWrap");
  const signupWrap = document.getElementById("signupWrap");
  const tabLogin = document.getElementById("tabLogin");
  const tabSignup = document.getElementById("tabSignup");

  if (tab === "login") {
    loginWrap.style.display = "block";
    signupWrap.style.display = "none";
    tabLogin.classList.add("active");
    tabSignup.classList.remove("active");
  } else {
    loginWrap.style.display = "none";
    signupWrap.style.display = "block";
    tabSignup.classList.add("active");
    tabLogin.classList.remove("active");
  }
}

/* ---------------- Password show/hide ---------------- */
function setupPasswordToggles() {
  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (input.type === "password") {
        input.type = "text";
        btn.textContent = "🙈";
      } else {
        input.type = "password";
        btn.textContent = "👁";
      }
    });
  });
}

/* ---------------- Sign up form ---------------- */
function setupSignupForm() {
  const form = document.getElementById("signupForm");
  const errorEl = document.getElementById("signupError");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorEl.textContent = "";

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const phone = document.getElementById("signupPhone").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("signupConfirmPassword").value;
    const agreed = document.getElementById("agreeTerms").checked;

    if (!name || !email || !phone || !password || !confirmPassword) {
      errorEl.textContent = "Please fill in all fields.";
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      errorEl.textContent = "Please enter a valid email address.";
      return;
    }

    if (password.length < 8) {
      errorEl.textContent = "Password must be at least 8 characters.";
      return;
    }

    if (password !== confirmPassword) {
      errorEl.textContent = "Passwords do not match.";
      return;
    }

    if (!agreed) {
      errorEl.textContent = "You must agree to the Terms of Service and Privacy Policy.";
      return;
    }

    // All checks passed — this is where you'd call your real signup API.
    // Example:
    // fetch("/api/signup", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ name, email, phone, password })
    // });

    console.log("Signup submitted:", { name, email, phone });
    alert(`Account created for ${name}!`);
    window.location.href = "dashboard.html";
  });
}

/* ---------------- Login form ---------------- */
function setupLoginForm() {
  const form = document.getElementById("loginForm");
  const errorEl = document.getElementById("loginError");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorEl.textContent = "";

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
      errorEl.textContent = "Please enter your email and password.";
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      errorEl.textContent = "Please enter a valid email address.";
      return;
    }

    // This is where you'd call your real login API.
    // Example:
    // fetch("/api/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email, password })
    // });

    console.log("Login submitted:", { email });
    alert("Login successful!");
    window.location.href = "dashboard.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupPasswordToggles();
  setupSignupForm();
  setupLoginForm();
});
