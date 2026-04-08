/**
 * ================================================================
 * MAKHUZA EDUCATIONAL CONSULTANTS — Main JavaScript
 * Responsibilities:
 *   1. Navbar scroll state
 *   2. Mobile drawer toggle
 *   3. Hero word-by-word text reveal
 *   4. Scroll-reveal (IntersectionObserver)
 *   5. Counter / stat animations
 *   6. Parallax hero background
 *   7. FAQ accordion
 *   8. Contact form validation + submit
 *   9. Back-to-top button
 *  10. Active nav link detection
 *  11. Page-load fade
 * ================================================================
 */

(function () {
  "use strict";

  /* ─── 1. NAVBAR SCROLL STATE ─────────────────────────────────── */
  const navbar = document.getElementById("navbar");

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run on load

  /* ─── 2. MOBILE DRAWER TOGGLE ────────────────────────────────── */
  const navToggle = document.querySelector(".nav-toggle");
  const navDrawer = document.querySelector(".nav-drawer");

  if (navToggle && navDrawer) {
    navToggle.addEventListener("click", () => {
      const isOpen = navDrawer.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close on any drawer link click
    navDrawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navDrawer.classList.remove("open");
        navToggle.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ─── 3. HERO WORD-BY-WORD REVEAL ───────────────────────────── */
  // Wraps each word in the hero title with .hero-word spans
  function prepHeroWords() {
    const title = document.querySelector(".hero-title");
    if (!title) return;

    title.querySelectorAll(".hero-title-line").forEach((line) => {
      const words = line.textContent.trim().split(" ");
      line.innerHTML = words
        .map(
          (word, i) =>
            `<span class="hero-word" style="transition-delay:${0.08 + i * 0.08}s">${word}</span> `
        )
        .join("");
    });

    // Trigger after a short paint delay
    requestAnimationFrame(() => {
      setTimeout(() => {
        title.querySelectorAll(".hero-word").forEach((w) => w.classList.add("visible"));
      }, 200);
    });
  }

  prepHeroWords();

  /* ─── 4. INTERSECTION OBSERVER — SCROLL REVEALS ─────────────── */
  // Watches elements with .reveal / .reveal-left / .reveal-right / .reveal-scale
  // and adds .visible when they enter the viewport
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  function registerRevealElements() {
    document
      .querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale")
      .forEach((el) => revealObserver.observe(el));
  }

  registerRevealElements();

  /* ─── 5. COUNTER ANIMATIONS ─────────────────────────────────── */
  // Elements with [data-count="200"] count up from 0 when they appear
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1800; // ms
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll("[data-count]").forEach((el) => counterObserver.observe(el));

  /* ─── 6. HERO PARALLAX ───────────────────────────────────────── */
  // Moves the hero background at 40% scroll speed for depth
  const heroSection = document.querySelector(".hero");

  function handleParallax() {
    if (!heroSection) return;
    const scrolled = window.scrollY;
    heroSection.style.setProperty("--parallax-y", `${scrolled * 0.35}px`);
  }

  window.addEventListener("scroll", handleParallax, { passive: true });

  /* ─── 7. FAQ ACCORDION ───────────────────────────────────────── */
  // Opens/closes FAQ items; only one open at a time (optional)
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const isOpen = item.classList.contains("open");

      // Close all
      document.querySelectorAll(".faq-item.open").forEach((openItem) => {
        openItem.classList.remove("open");
      });

      // Re-open if it wasn't open
      if (!isOpen) item.classList.add("open");
    });
  });

  /* ─── 8. CONTACT FORM ────────────────────────────────────────── */
  // Basic client-side validation; the action can point to
  // Formspree / Netlify Forms / your own backend
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector(".form-submit");
      const formNote = contactForm.querySelector(".form-note");

      // Simple required-field validation
      let valid = true;
      contactForm.querySelectorAll("[required]").forEach((field) => {
        if (!field.value.trim()) {
          field.style.borderColor = "#E84A4A";
          valid = false;
        } else {
          field.style.borderColor = "";
        }
      });

      if (!valid) {
        if (formNote) formNote.textContent = "Please fill in all required fields.";
        return;
      }

      // Optimistic UI feedback
      if (submitBtn) {
        submitBtn.textContent = "Sending…";
        submitBtn.disabled = true;
      }

      try {
        // ----------------------------------------------------------
        // REPLACE action URL with your Formspree endpoint or backend
        // e.g. "https://formspree.io/f/YOUR_FORM_ID"
        // ----------------------------------------------------------
        const response = await fetch(contactForm.action || "#", {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          contactForm.innerHTML = `
            <div style="text-align:center;padding:3rem 1rem">
              <div style="font-size:3rem;margin-bottom:1rem">✅</div>
              <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;margin-bottom:.5rem">Message Received!</h3>
              <p style="color:var(--text-muted)">We'll get back to you within 24 hours. In the meantime, feel free to WhatsApp us for a quicker response.</p>
            </div>`;
        } else {
          throw new Error("Server error");
        }
      } catch {
        if (submitBtn) { submitBtn.textContent = "Book Free Consultation"; submitBtn.disabled = false; }
        if (formNote) formNote.textContent = "Something went wrong. Please try WhatsApp or email us directly.";
      }
    });
  }

  /* ─── 9. BACK-TO-TOP BUTTON ─────────────────────────────────── */
  const backTop = document.querySelector(".back-top");

  window.addEventListener(
    "scroll",
    () => {
      if (!backTop) return;
      backTop.classList.toggle("visible", window.scrollY > 500);
    },
    { passive: true }
  );

  if (backTop) {
    backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ─── 10. ACTIVE NAV LINK ────────────────────────────────────── */
  // Highlights the nav link matching the current page URL
  const currentPage = location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-links a, .nav-drawer a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (href === currentPage || href === "./" + currentPage) {
      link.classList.add("active");
    }
  });

  /* ─── 11. PAGE-LOAD FADE ─────────────────────────────────────── */
  document.body.classList.add("page-fade");

})();
