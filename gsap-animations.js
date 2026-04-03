/* ============================================================================
   PREMIUM GSAP ANIMATION SYSTEM
   - Preloader with cinematic name reveal
   - Lenis smooth scroll integration
   - ScrollTrigger-powered section animations
   - 3D tilt effects on cards
   - Magnetic cursor on buttons
   - Text split animations for section titles
   - Scroll progress bar
   - GitHub projects with live screenshots
   ============================================================================ */

(function () {
  "use strict";

  // Wait for GSAP to be available
  if (typeof gsap === "undefined") {
    console.warn("GSAP not loaded — animations disabled");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ==========================================================================
     PRELOADER
     ========================================================================== */

  function initPreloader() {
    const preloader = document.getElementById("preloader");
    if (!preloader) return;

    const chars = preloader.querySelectorAll(".preloader-char");
    const line = preloader.querySelector(".preloader-line");
    const role = preloader.querySelector(".preloader-role");

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(preloader, {
          yPercent: -100,
          duration: 0.8,
          ease: "power4.inOut",
          onComplete: () => {
            preloader.style.display = "none";
            document.body.classList.add("loaded");
            initPageAnimations();
          },
        });
      },
    });

    // Stagger characters in
    tl.from(chars, {
      y: 60,
      opacity: 0,
      rotateX: -90,
      stagger: 0.04,
      duration: 0.6,
      ease: "back.out(1.7)",
    });

    // Line expands
    tl.from(
      line,
      {
        scaleX: 0,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.2"
    );

    // Role fades in
    tl.from(
      role,
      {
        y: 20,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.3"
    );

    // Hold for a beat
    tl.to({}, { duration: 0.4 });
  }

  /* ==========================================================================
     LENIS SMOOTH SCROLL
     ========================================================================== */

  let lenis;

  function initLenisScroll() {
    if (typeof Lenis === "undefined") return;

    lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Integrate with GSAP ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Update ScrollTrigger on Lenis scroll
    lenis.on("scroll", ScrollTrigger.update);

    // Handle anchor clicks for smooth scrolling with Lenis
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        const target = document.querySelector(href);
        if (!target || href === "#") return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80 });

        // Close mobile nav if open
        const hamburger = document.getElementById("hamburger-menu");
        const mainNav = document.getElementById("main-nav");
        if (hamburger && mainNav) {
          hamburger.classList.remove("active");
          mainNav.classList.remove("active");
          hamburger.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  /* ==========================================================================
     SCROLL PROGRESS BAR
     ========================================================================== */

  function initScrollProgress() {
    const bar = document.getElementById("scroll-progress");
    if (!bar) return;

    gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
    });
  }

  /* ==========================================================================
     CURSOR GLOW (Desktop only)
     ========================================================================== */

  function initCursorGlow() {
    if (window.matchMedia("(hover: none)").matches) return;

    const glow = document.getElementById("cursor-glow");
    if (!glow) return;

    let mouseX = 0,
      mouseY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    gsap.ticker.add(() => {
      gsap.set(glow, {
        x: mouseX,
        y: mouseY,
      });
    });
  }

  /* ==========================================================================
     TEXT SPLIT ANIMATION
     ========================================================================== */

  function initTextSplit() {
    const titles = document.querySelectorAll("[data-split-text]");

    titles.forEach((title) => {
      const text = title.textContent;
      title.innerHTML = "";
      title.setAttribute("aria-label", text);

      // Wrap each character in a span
      [...text].forEach((char) => {
        const span = document.createElement("span");
        span.className = "split-char";
        span.textContent = char === " " ? "\u00A0" : char;
        span.setAttribute("aria-hidden", "true");
        title.appendChild(span);
      });

      const chars = title.querySelectorAll(".split-char");

      // Custom animation for Hero Title (now simplified for absolute visibility)
      if (title.id === "hero-heading") {
        gsap.set(title, { autoAlpha: 1, opacity: 1, visibility: "visible" });
      } else {
        gsap.from(chars, {
          y: 80,
          opacity: 0,
          rotateX: -60,
          stagger: 0.03,
          duration: 0.8,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: title,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }
    });
  }

  /* ==========================================================================
     MAGNETIC CURSOR EFFECT
     ========================================================================== */

  function initMagneticCursor() {
    if (window.matchMedia("(hover: none)").matches) return;

    const magnetics = document.querySelectorAll(".magnetic");

    magnetics.forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(el, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.4,
          ease: "power2.out",
        });
      });

      el.addEventListener("mouseleave", () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.3)",
        });
      });
    });
  }

  /* ==========================================================================
     3D TILT EFFECT ON CARDS
     ========================================================================== */

  function initTiltEffect() {
    if (window.matchMedia("(hover: none)").matches) return;

    const tiltElements = document.querySelectorAll("[data-tilt]");

    tiltElements.forEach((el) => {
      el.style.transformStyle = "preserve-3d";
      el.style.perspective = "1000px";

      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(el, {
          rotateY: x * 12,
          rotateX: -y * 12,
          transformPerspective: 1000,
          duration: 0.4,
          ease: "power2.out",
        });
      });

      el.addEventListener("mouseleave", () => {
        gsap.to(el, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.6,
          ease: "power2.out",
        });
      });
    });
  }

  /* ==========================================================================
     SECTION SCROLL ANIMATIONS
     ========================================================================== */

  function initSectionAnimations() {
    // Hero animations
    const heroContent = document.querySelector(".hero-content");
    if (heroContent) {
      const heroTl = gsap.timeline({ delay: 0.2 });

      const tagline = heroContent.querySelector(".hero-tagline");
      if (tagline) {
        heroTl.from(
          tagline,
          {
            y: 30,
            autoAlpha: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "+=0.1"
        );
      }

      const techStack = heroContent.querySelector(".hero-tech-stack");
      if (techStack) {
        const icons = techStack.querySelectorAll(".hero-tech-icon");
        heroTl.from(
          icons,
          {
            y: 30,
            opacity: 0,
            scale: 0.8,
            stagger: 0.06,
            duration: 0.5,
            ease: "back.out(1.4)",
          },
          "-=0.3"
        );
      }

      const ctas = heroContent.querySelector(".hero-ctas");
      if (ctas) {
        heroTl.from(
          ctas.children,
          {
            y: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.2"
        );
      }
    }

    // Hero image 3D reveal
    const heroImage = document.querySelector(".hero-image-wrapper");
    if (heroImage) {
      gsap.from(heroImage, {
        scale: 0.8,
        opacity: 0,
        rotateY: -15,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.5,
      });
    }

    // Fade-up elements on scroll
    document.querySelectorAll('[data-animate="fade-up"]').forEach((el) => {
      gsap.from(el, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    });

    // Stagger-up groups
    document.querySelectorAll('[data-animate="stagger-up"]').forEach((el) => {
      const children = el.children;
      gsap.from(children, {
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    });

    // Section-level parallax
    document
      .querySelectorAll(
        ".about, .skills, .projects, .experience, .education, .resume, .contact"
      )
      .forEach((section) => {
        const inner =
          section.querySelector('[class$="-inner"]') ||
          section.firstElementChild;
        if (!inner) return;

        gsap.from(inner, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });

    // Project cards scale-in
    const projectCards = document.querySelectorAll(".project-card");
    if (projectCards.length) {
      gsap.from(projectCards, {
        scale: 0.85,
        opacity: 0,
        y: 40,
        stagger: 0.12,
        duration: 0.7,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: ".projects-grid",
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    }

    // Experience item slide-in
    const expItems = document.querySelectorAll(".experience-item");
    expItems.forEach((item) => {
      gsap.from(item, {
        x: -50,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    });

    // Skills group 3D fly-in
    const skillsGroups = document.querySelectorAll(".skills-group");
    skillsGroups.forEach((group, i) => {
      gsap.from(group, {
        y: 40,
        rotateX: -10,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: group,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });
    });
  }

  /* ==========================================================================
     PARALLAX SECTIONS
     ========================================================================== */

  function initParallaxSections() {
    // Aurora orbs parallax
    const orbs = document.querySelectorAll(".aurora-orb");
    orbs.forEach((orb, i) => {
      gsap.to(orb, {
        y: -100 * (i + 1),
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    // Hero image parallax
    const heroImg = document.querySelector(".hero-image");
    if (heroImg) {
      gsap.to(heroImg, {
        y: 80,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }
  }

  /* ==========================================================================
     GITHUB PROJECTS WITH LIVE SCREENSHOTS
     ========================================================================== */

  async function initGitHubProjects() {
    const container = document.getElementById("projects-container");
    const loading = document.getElementById("projects-loading");
    const errorEl = document.getElementById("projects-error");

    if (!container) return;

    if (loading) loading.style.display = "flex";
    if (errorEl) errorEl.textContent = "";

    try {
      const res = await fetch(
        "https://api.github.com/users/TheBoyBilly/repos?per_page=100&sort=updated"
      );
      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

      const data = await res.json();

      // Sort by updated, take top 6
      const repos = Array.isArray(data)
        ? data
            .filter((r) => !r.fork)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 6)
        : [];

      container.innerHTML = "";

      if (repos.length === 0) {
        container.innerHTML =
          '<p class="repo-error">No repositories found.</p>';
        return;
      }

      repos.forEach((repo, index) => {
        const card = document.createElement("article");
        card.className = "project-card";
        card.setAttribute("data-tilt", "");
        card.style.opacity = "0";

        // Fix broken URLs or specific overrides
        const urlOverrides = {
          "VidMetrics-Lite": "https://vidmetrics.vercel.app",
        };

        if (urlOverrides[repo.name]) {
          repo.homepage = urlOverrides[repo.name];
        }

        // Screenshot thumbnail
        const thumbWrapper = document.createElement("div");
        thumbWrapper.className = "project-thumb-wrapper";

        const thumb = document.createElement("img");
        thumb.className = "project-thumb";
        thumb.alt = `${repo.name} preview`;
        thumb.loading = "lazy";

        // Use microlink for live screenshots if homepage exists
        if (repo.homepage && repo.homepage.trim() !== "") {
          // Use microlink.io screenshot API
          thumb.src = `https://api.microlink.io/?url=${encodeURIComponent(repo.homepage)}&screenshot=true&embed=screenshot.url`;
          thumb.onerror = function () {
            this.src = `https://opengraph.githubassets.com/1/${repo.full_name}`;
            this.onerror = function () {
              this.style.display = "none";
              thumbWrapper.classList.add("no-thumb");
            };
          };
        } else {
          // Fallback to GitHub OpenGraph image
          thumb.src = `https://opengraph.githubassets.com/1/${repo.full_name}`;
          thumb.onerror = function () {
            this.style.display = "none";
            thumbWrapper.classList.add("no-thumb");
          };
        }

        // Loading skeleton
        const skeleton = document.createElement("div");
        skeleton.className = "thumb-skeleton";
        thumbWrapper.appendChild(skeleton);

        thumb.onload = function () {
          skeleton.style.display = "none";
          this.style.opacity = "1";
        };
        thumb.style.opacity = "0";
        thumb.style.transition = "opacity 0.4s ease";

        thumbWrapper.appendChild(thumb);
        card.appendChild(thumbWrapper);

        // Card body
        const body = document.createElement("div");
        body.className = "project-card-body";

        const title = document.createElement("h3");
        title.className = "project-title";
        // Format repo name: replace dashes/underscores with spaces, capitalize
        title.textContent = repo.name
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        body.appendChild(title);

        const desc = document.createElement("p");
        desc.className = "project-description";
        desc.textContent = repo.description || "No description provided.";
        body.appendChild(desc);

        // Tech tags
        const techList = document.createElement("ul");
        techList.className = "project-tech";
        if (repo.language) {
          const langTag = document.createElement("li");
          langTag.textContent = repo.language;
          techList.appendChild(langTag);
        }
        // Add topics as tech tags
        if (repo.topics && repo.topics.length > 0) {
          repo.topics.slice(0, 3).forEach((topic) => {
            const topicTag = document.createElement("li");
            topicTag.textContent = topic;
            techList.appendChild(topicTag);
          });
        }
        body.appendChild(techList);

        // Links
        const links = document.createElement("div");
        links.className = "project-links";

        const ghLink = document.createElement("a");
        ghLink.className = "project-link";
        ghLink.href = repo.html_url;
        ghLink.target = "_blank";
        ghLink.rel = "noopener noreferrer";
        ghLink.innerHTML =
          '<span>Source Code</span><span class="link-arrow">→</span>';
        links.appendChild(ghLink);

        if (repo.homepage && repo.homepage.trim() !== "") {
          const liveLink = document.createElement("a");
          liveLink.className = "project-link project-link-live";
          liveLink.href = repo.homepage;
          liveLink.target = "_blank";
          liveLink.rel = "noopener noreferrer";
          liveLink.innerHTML =
            '<span>Live Site</span><span class="link-arrow">↗</span>';
          links.appendChild(liveLink);
        }

        body.appendChild(links);
        card.appendChild(body);
        container.appendChild(card);

        // Animate card in with stagger
        gsap.to(card, {
          opacity: 1,
          y: 0,
          delay: index * 0.1,
          duration: 0.6,
          ease: "power3.out",
        });
      });

      // Re-initialize tilt for dynamically added cards
      initTiltEffect();
    } catch (err) {
      console.error(err);
      if (errorEl) {
        errorEl.textContent =
          "Unable to load projects. Please try again later.";
      }
    } finally {
      if (loading) loading.style.display = "none";
    }
  }

  /* ==========================================================================
     HEADER ACTIVE NAV LINK ON SCROLL
     ========================================================================== */

  function initActiveNavTracking() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 40%",
        end: "bottom 40%",
        onEnter: () => setActiveLink(section.id),
        onEnterBack: () => setActiveLink(section.id),
      });
    });

    function setActiveLink(id) {
      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${id}`
        );
      });
    }
  }

  /* ==========================================================================
     PAGE ANIMATIONS INIT (called after preloader)
     ========================================================================== */

  function initPageAnimations() {
    initScrollProgress();
    initCursorGlow();
    initTextSplit();
    initMagneticCursor();
    initTiltEffect();
    initSectionAnimations();
    initParallaxSections();
    initActiveNavTracking();
    initGitHubProjects();
  }

  /* ==========================================================================
     MASTER INIT
     ========================================================================== */

  function masterInit() {
    initLenisScroll();
    initPreloader();

    // High-performance fail-safe for content visibility
    setTimeout(() => {
      console.log("Forcing content reveal fallback...");
      gsap.set(["#hero-heading", ".hero-tech-icon", ".split-char", ".hero-tagline"], { 
        autoAlpha: 1, 
        opacity: 1,
        visibility: "visible",
        overwrite: true 
      });
    }, 4500); 
  }

  // Start when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", masterInit);
  } else {
    masterInit();
  }
})();
