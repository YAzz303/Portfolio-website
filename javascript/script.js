/**
 * Yajjyu Tuladhar Portfolio — script.js
 * Modules: smooth scroll · mobile nav · scroll reveal · navbar shadow · contact form · footer year
 */
(function () {
  'use strict';

  /* ===== SMOOTH SCROLLING ===== */
  const navbar = document.querySelector('.navbar');
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
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
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
      { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(function (el, index) {
      // Gentle stagger: group elements in sets of 4 to avoid long waits on larger sections
      el.dataset.delay = (index % 4) * 90;
      observer.observe(el);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ===== NAVBAR SHADOW ON SCROLL ===== */
  var lastScrollY = 0;
  var rafPending  = false;

  function updateNavbarShadow() {
    if (!navbar) return;
    navbar.style.boxShadow = window.scrollY > 50
      ? '0 2px 16px rgba(0, 0, 0, 0.07)'
      : 'none';
    rafPending = false;
  }

  window.addEventListener('scroll', function () {
    lastScrollY = window.scrollY;
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(updateNavbarShadow);
    }
  }, { passive: true });

  /* ===== CONTACT FORM (Formspree) =====
   *
   * Setup instructions:
   *   1. Go to https://formspree.io and create a free account.
   *   2. Create a new form — Formspree will give you an endpoint like:
   *      https://formspree.io/f/abcdefgh
   *   3. In index.html, set the <form action="..."> to your endpoint.
   *   4. That's it — submissions go straight to your email inbox.
   *
   * The free tier supports 50 submissions / month with no server needed.
   */
  var form       = document.getElementById('contact-form');
  var statusEl   = document.getElementById('form-status');
  var submitBtn  = document.getElementById('submit-btn');

  if (form && statusEl && submitBtn) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Basic client-side check before hitting network
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Disable button and show loading state
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

  // Init navbar shadow on load
  updateNavbarShadow();

})();