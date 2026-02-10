/* ============================================================================
   PORTFOLIO INTERACTIONS & ANIMATIONS
   Minimal JavaScript for enhanced micro-interactions and scroll effects
   ============================================================================ */

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initParallax();
  initSmoothScroll();
  initHeaderScroll();
  initFormHandling();
  initResumeButtonInteraction();
  initHamburgerMenu();
});

/* ============================================================================
   PARALLAX SCROLL EFFECT
   Subtle parallax movement on the hero image
   ============================================================================ */

function initParallax() {
  const heroImage = document.querySelector(".hero-image");
  
  if (!heroImage) return;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const heroSection = document.querySelector(".hero");
    const heroRect = heroSection.getBoundingClientRect();

    // Only apply parallax while hero is in view
    if (heroRect.top < window.innerHeight && heroRect.bottom > 0) {
      // Calculate parallax offset (slower than scroll)
      const parallaxOffset = scrollY * 0.5;
      heroImage.style.transform = `translateY(${parallaxOffset * 0.15}px)`;
    }
  });
}

/* ============================================================================
   SMOOTH SCROLL BEHAVIOR
   Enhanced smooth scrolling for all anchor links
   ============================================================================ */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      const target = document.querySelector(href);

      // Skip if target doesn't exist or is a javascript link
      if (!target || href === "#") return;

      e.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
}

/* ============================================================================
   HEADER SCROLL DETECTION
   Add shadow effect to header when page is scrolled
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
   INTERSECTION OBSERVER FOR LAZY ANIMATION
   Trigger animations when sections come into view (optional enhancement)
   ============================================================================ */

function initIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add the in-view marker
        entry.target.classList.add("in-view");

        // Stagger child elements for a polished entrance
        const children = Array.from(entry.target.children || []);
        children.forEach((child, i) => {
          // Apply a small stagger via inline animation with delay
          child.style.animation = `revealIn 560ms cubic-bezier(0.2,0.8,0.2,1) both ${i * 80}ms`;
        });

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe only elements marked for reveal to reduce work
  document.querySelectorAll(".reveal, .project-card").forEach((el) => {
    observer.observe(el);
  });
}

// Call intersection observer if browser supports it
if ("IntersectionObserver" in window) {
  document.addEventListener("DOMContentLoaded", initIntersectionObserver);
}

/* ============================================================================
   KEYBOARD ACCESSIBILITY
   Handle keyboard focus management
   ============================================================================ */

function initKeyboardNav() {
  // Track keyboard usage
  let isKeyboardUser = false;

  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      isKeyboardUser = true;
    }
  });

  document.addEventListener("mousedown", () => {
    isKeyboardUser = false;
  });

  // Apply focus styles only for keyboard users
  document.body.classList.toggle("keyboard-nav", isKeyboardUser);
}

initKeyboardNav();

/* ============================================================================
   PREVENT LAYOUT SHIFT
   Minor optimization for better perceived performance
   ============================================================================ */

// Preload critical images
window.addEventListener("load", () => {
  const heroImage = document.querySelector(".hero-image");
  if (heroImage && heroImage.complete) {
    heroImage.style.opacity = "1";
  }
});

/* ============================================================================
   FORM HANDLING & VALIDATION
   Enhance form interactions and provide user feedback
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

  // Accessible status element for messages
  const statusEl = document.getElementById("form-status");

  form.addEventListener("submit", async (e) => {
    // Prevent normal form submission to show inline feedback
    e.preventDefault();

    const submitBtn = form.querySelector(".btn-submit");
    const originalText = submitBtn.textContent;

    // Basic client-side validation for email field
    const email = form.querySelector('input[name="email"]');
    if (email && !email.checkValidity()) {
      // Inform user of invalid email
      statusEl.textContent = "Please provide a valid email address.";
      statusEl.className = "form-status error";
      email.focus();
      return;
    }

    // Disable button while submitting
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
        // Success — show accessible success message
        statusEl.textContent = "Thanks — your message has been sent. I'll reply within 24 hours.";
        statusEl.className = "form-status success";
        // Reset form and visual states
        form.reset();
        inputs.forEach((input) => {
          input.parentElement.classList.remove("filled", "focused");
        });
      } else {
        // Try to parse JSON error from Formspree
        const data = await response.json().catch(() => ({}));
        const errMsg = (data && data.error) ? data.error : "Something went wrong. Please try again later.";
        statusEl.textContent = errMsg;
        statusEl.className = "form-status error";
      }
    } catch (err) {
      // Network or other error
      statusEl.textContent = "Network error — please check your connection and try again.";
      statusEl.className = "form-status error";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

/* ============================================================================
   RESUME BUTTON INTERACTION
   Enhanced download button feedback
   ============================================================================ */

function initResumeButtonInteraction() {
  const resumeBtn = document.querySelector(".btn-resume");
  if (!resumeBtn) return;
  resumeBtn.addEventListener("click", (e) => {
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
   HAMBURGER MENU TOGGLE (SCISSOR-STYLE)
   Mobile navigation toggle with scissor-themed animation
   ============================================================================ */

function initHamburgerMenu() {
  const hamburger = document.getElementById("hamburger-menu");
  const mainNav = document.getElementById("main-nav");
  
  if (!hamburger || !mainNav) return;

  // Toggle menu on hamburger click
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mainNav.classList.toggle("active");
    
    // Update aria-expanded for accessibility
    const isExpanded = hamburger.classList.contains("active");
    hamburger.setAttribute("aria-expanded", isExpanded);
  });

  // Close menu when a nav link is clicked
  mainNav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      mainNav.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  // Close mobile menu when window is resized above tablet breakpoint
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      hamburger.classList.remove("active");
      mainNav.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });
}
