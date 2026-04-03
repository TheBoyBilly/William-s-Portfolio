/* ============================================================================
   PORTFOLIO CORE INTERACTIONS
   Handles form validation, hamburger menu, header scroll, and keyboard nav.
   All scroll animations, parallax, and smooth scroll are handled by
   gsap-animations.js (GSAP + Lenis)
   ============================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initHeaderScroll();
  initFormHandling();
  initResumeButtonInteraction();
  initHamburgerMenu();
});

/* ============================================================================
   HEADER SCROLL DETECTION
   ============================================================================ */

function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

/* ============================================================================
   FORM HANDLING & VALIDATION
   ============================================================================ */

function initFormHandling() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const inputs = form.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      input.parentElement.classList.add("focused");
    });

    input.addEventListener("blur", () => {
      if (!input.value.trim()) {
        input.parentElement.classList.remove("focused");
      }
    });

    input.addEventListener("input", () => {
      if (input.value.trim()) {
        input.parentElement.classList.add("filled");
      } else {
        input.parentElement.classList.remove("filled");
      }
    });
  });

  const statusEl = document.getElementById("form-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector(".btn-submit");
    const originalText = submitBtn.textContent;

    const email = form.querySelector('input[name="email"]');
    if (email && !email.checkValidity()) {
      statusEl.textContent = "Please provide a valid email address.";
      statusEl.className = "form-status error";
      email.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        statusEl.textContent =
          "Thanks — your message has been sent. I'll reply within 24 hours.";
        statusEl.className = "form-status success";
        form.reset();
        inputs.forEach((input) => {
          input.parentElement.classList.remove("filled", "focused");
        });
      } else {
        const data = await response.json().catch(() => ({}));
        const errMsg =
          data && data.error
            ? data.error
            : "Something went wrong. Please try again later.";
        statusEl.textContent = errMsg;
        statusEl.className = "form-status error";
      }
    } catch (err) {
      statusEl.textContent =
        "Network error — please check your connection and try again.";
      statusEl.className = "form-status error";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

/* ============================================================================
   RESUME BUTTON INTERACTION
   ============================================================================ */

function initResumeButtonInteraction() {
  const resumeBtn = document.querySelector(".btn-resume");
  if (!resumeBtn) return;

  resumeBtn.addEventListener("click", () => {
    const icon = resumeBtn.querySelector(".btn-icon");
    if (icon) {
      icon.style.animation = "bounce 0.6s ease-in-out";
      setTimeout(() => {
        icon.style.animation = "";
      }, 600);
    }
  });
}

/* ============================================================================
   HAMBURGER MENU TOGGLE
   ============================================================================ */

function initHamburgerMenu() {
  const hamburger = document.getElementById("hamburger-menu");
  const mainNav = document.getElementById("main-nav");

  if (!hamburger || !mainNav) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mainNav.classList.toggle("active");

    const isExpanded = hamburger.classList.contains("active");
    hamburger.setAttribute("aria-expanded", isExpanded);

    // Prevent body scroll when menu is open
    document.body.style.overflow = isExpanded ? "hidden" : "";
  });

  // Close menu when a nav link is clicked
  mainNav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      mainNav.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  // Close on resize above mobile
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      hamburger.classList.remove("active");
      mainNav.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });
}

/* ============================================================================
   PRELOAD HERO IMAGE
   ============================================================================ */

window.addEventListener("load", () => {
  const heroImage = document.querySelector(".hero-image");
  if (heroImage && heroImage.complete) {
    heroImage.style.opacity = "1";
  }
});
