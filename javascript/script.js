/**
 * Yajjyu Tuladhar Portfolio — script.js
 * Modules: smooth scroll · mobile nav · scroll reveal · navbar shadow · active nav · contact form · footer year
 */
(function () {
  'use strict';

  /* ===== SMOOTH SCROLLING ===== */
  const navbar    = document.querySelector('.navbar');
  const navHeight = () => (navbar ? navbar.offsetHeight : 0);

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (!id || id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight();
      window.scrollTo({ top, behavior: 'smooth' });
      closeMobileNav();
    });
  });

  /* ===== MOBILE NAVIGATION ===== */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.getElementById('primary-nav');

  function closeMobileNav() {
    if (!navLinks) return;
    navLinks.classList.remove('open');
    if (hamburger) {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!navLinks || !hamburger) return;
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMobileNav();
    }
  });

  /* ===== ACTIVE NAV LINK ON SCROLL ===== */
  const sections = document.querySelectorAll('section[id], main[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    let currentId = '';
    const offset = navHeight() + 80;

    sections.forEach(function (section) {
      const top = section.getBoundingClientRect().top;
      if (top <= offset) {
        currentId = section.id;
      }
    });

    navAnchors.forEach(function (anchor) {
      anchor.classList.toggle(
        'active',
        anchor.getAttribute('href') === '#' + currentId
      );
    });
  }

  /* ===== SCROLL REVEAL ===== */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const delay = Number(entry.target.dataset.delay) || 0;
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    );

    // Assign stagger delays per section
    document.querySelectorAll('section, main').forEach(function (section) {
      const revealEls = section.querySelectorAll('.reveal');
      revealEls.forEach(function (el, index) {
        // Respect data-delay set in HTML, otherwise compute stagger
        if (!el.dataset.delay) {
          el.dataset.delay = (index % 5) * 80;
        }
        observer.observe(el);
      });
    });

    // Also observe any top-level reveal elements
    document.querySelectorAll('.reveal:not(section .reveal):not(main .reveal)').forEach(function (el) {
      observer.observe(el);
    });

  } else {
    // Fallback
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ===== NAVBAR SHADOW & ACTIVE LINK ON SCROLL ===== */
  var rafPending = false;

  function onScroll() {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(function () {
        updateNavbarShadow();
        updateActiveNav();
        rafPending = false;
      });
    }
  }

  function updateNavbarShadow() {
    if (!navbar) return;
    navbar.style.boxShadow = window.scrollY > 40
      ? '0 1px 24px rgba(0,0,0,0.08)'
      : 'none';
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ===== CONTACT FORM (Formspree) =====
   *
   * Setup:
   *   1. Go to https://formspree.io and create a free account.
   *   2. Create a new form — get an endpoint like: https://formspree.io/f/abcdefgh
   *   3. In index.html, set the <form action="..."> to your endpoint.
   *
   * Free tier: 50 submissions/month with no server needed.
   */
  var form      = document.getElementById('contact-form');
  var statusEl  = document.getElementById('form-status');
  var submitBtn = document.getElementById('submit-btn');

  if (form && statusEl && submitBtn) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
      setStatus('', '');

      try {
        var res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          setStatus('Message sent — thank you!', 'success');
          form.reset();
        } else {
          var data = {};
          try { data = await res.json(); } catch (_) { /* ignore */ }
          var msg = (data.errors || []).map(function (err) { return err.message; }).join(', ')
            || 'Submission failed — please try again.';
          setStatus(msg, 'error');
        }
      } catch (_) {
        setStatus('Network error — please check your connection and try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-regular fa-paper-plane"></i> Send Message';
      }
    });
  }

  function setStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className   = 'form-status' + (type ? ' ' + type : '');
  }

  /* ===== FOOTER YEAR ===== */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== INIT ===== */
  updateNavbarShadow();
  updateActiveNav();

})();