// Enhanced Portfolio JavaScript with Smooth Animations
(function () {
  'use strict';

  // ==================== SMOOTH SCROLLING ====================
  const nav = document.querySelector('.navbar');
  const getOffset = () => (nav ? nav.offsetHeight : 0);
  const scrollLinks = document.querySelectorAll('nav a[href^="#"], .scroll-down[href^="#"]');

  function smoothScrollTo(e) {
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;
    
    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;
    
    e.preventDefault();
    const topPosition = targetEl.getBoundingClientRect().top + window.scrollY - getOffset();
    
    window.scrollTo({
      top: topPosition,
      behavior: 'smooth'
    });

    closeMobileNav();
  }

  scrollLinks.forEach((link) => link.addEventListener('click', smoothScrollTo));

  // ==================== MOBILE NAVIGATION ====================
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.getElementById('primary-nav');

  function closeMobileNav() {
    if (!navLinks) return;
    navLinks.classList.remove('open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }

  function toggleMobileNav() {
    if (!navLinks) return;
    const isOpen = navLinks.classList.toggle('open');
    if (hamburger) hamburger.setAttribute('aria-expanded', String(isOpen));
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileNav);
  }

  // Close mobile nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks || !hamburger) return;
    if (navLinks.classList.contains('open') && 
        !navLinks.contains(e.target) && 
        !hamburger.contains(e.target)) {
      closeMobileNav();
    }
  });

  // ==================== FALLING LEAVES ANIMATION ====================
  const leafColors = [
    'var(--leaf-green)',
    'var(--leaf-brown)',
    'var(--leaf-red)',
    '#8ab76a',
    '#b88c5e'
  ];

  function createLeaf() {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    
    // Random size between 16-28px
    const size = 16 + Math.random() * 12;
    leaf.style.width = `${size}px`;
    leaf.style.height = `${size}px`;
    
    // Random starting position
    const startX = Math.random() * 100;
    leaf.style.left = `${startX}vw`;
    
    // Random color
    const color = leafColors[Math.floor(Math.random() * leafColors.length)];
    leaf.style.backgroundColor = color;
    
    // Random rotation and animation duration
    const duration = 12 + Math.random() * 10; // 12-22 seconds
    const delay = Math.random() * 3;
    const swayOffset = 30 + Math.random() * 40; // 30-70px
    
    leaf.style.setProperty('--sway-offset', `${swayOffset}px`);
    leaf.style.animation = `fall-and-sway ${duration}s ease-in-out ${delay}s forwards`;
    
    // Add slight rotation variance
    leaf.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    document.body.appendChild(leaf);
    
    // Remove leaf after animation completes
    setTimeout(() => {
      leaf.remove();
    }, (duration + delay) * 1000 + 500);
  }

  // Initial batch of leaves
  for (let i = 0; i < 8; i++) {
    setTimeout(createLeaf, i * 600);
  }

  // Periodic leaf generation
  setInterval(createLeaf, 2800);

  // ==================== SCROLL REVEAL ANIMATION ====================
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add delay based on element's position in viewport
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  revealElements.forEach((el, index) => {
    // Add staggered delay for elements in the same section
    const section = el.closest('.section');
    const sectionElements = section ? section.querySelectorAll('.reveal') : [el];
    const elementIndex = Array.from(sectionElements).indexOf(el);
    el.dataset.delay = elementIndex * 100; // 100ms stagger
    
    revealObserver.observe(el);
  });

  // ==================== NAVBAR SCROLL EFFECT ====================
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateNavbar() {
    const currentScrollY = window.scrollY;
    
    if (nav) {
      if (currentScrollY > 100) {
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
      } else {
        nav.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.04)';
      }
    }
    
    lastScrollY = currentScrollY;
    ticking = false;
  }

  function requestNavbarUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestNavbarUpdate, { passive: true });

  // ==================== CONTACT FORM ====================
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');
      
      // Show success message (in a real app, this would send to a server)
      showNotification('Message sent successfully! Thank you for reaching out.', 'success');
      
      // Reset form
      contactForm.reset();
      
      // Log for demo purposes
      console.log('Form submitted:', { name, email, message });
    });
  }

  // ==================== NOTIFICATION SYSTEM ====================
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
      position: fixed;
      top: 90px;
      right: 24px;
      background: ${type === 'success' ? 'var(--accent)' : 'var(--fg)'};
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      animation: slideInRight 0.3s ease;
      font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Add notification animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // ==================== FOOTER YEAR ====================
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ==================== PARALLAX EFFECT FOR WAVES ====================
  const waveLayers = document.querySelectorAll('.wave-layer');
  
  function updateParallax() {
    const scrolled = window.scrollY;
    
    waveLayers.forEach((layer, index) => {
      const speed = (index + 1) * 0.05;
      const yPos = -(scrolled * speed);
      layer.style.transform = `translateY(${yPos}px)`;
    });
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateParallax);
  }, { passive: true });

  // ==================== SKILL CARDS INTERACTION ====================
  const skillCards = document.querySelectorAll('.skill-card');
  
  skillCards.forEach((card) => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  });

  // ==================== PROJECT CARDS HOVER EFFECT ====================
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach((card) => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  });

  // ==================== INITIALIZE ====================
  console.log('Portfolio initialized successfully! 🌊🍃');
  
  // Trigger initial navbar update
  updateNavbar();
})();