// ═══════════════════════════════════════════════════
// DevAura Website - Main JavaScript
// ═══════════════════════════════════════════════════

// ─── Loading Screen ───
const loadingScreen = document.getElementById('loadingScreen');
window.addEventListener('load', () => {
  if (loadingScreen) {
    setTimeout(() => loadingScreen.classList.add('hidden'), 1800);
  }
});

// ─── Page Transitions ───
function setupPageTransitions() {
  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === window.location.pathname.split('/').pop() ||
          href.startsWith('http') || href.startsWith('#') ||
          link.target === '_blank') return;
      e.preventDefault();
      const transition = document.createElement('div');
      transition.className = 'page-transition';
      transition.innerHTML = '<div class="spinner"></div>';
      document.body.appendChild(transition);
      requestAnimationFrame(() => transition.classList.add('active'));
      setTimeout(() => { window.location.href = href; }, 400);
    });
  });
}
setupPageTransitions();

// ─── Custom Cursor ───
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
const gradientBg = document.getElementById('gradientBg');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (gradientBg) {
    gradientBg.style.setProperty('--mouse-x', (mx / window.innerWidth * 100) + '%');
    gradientBg.style.setProperty('--mouse-y', (my / window.innerHeight * 100) + '%');
  }
});

function animCursor() {
  if (cursor && ring) {
    cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  }
  requestAnimationFrame(animCursor);
}
if (cursor && ring) animCursor();

function initCursorHover() {
  document.querySelectorAll('a, button, .service-card, .project-card, input, select, textarea, .tech-card, .product-card, .tech-filter, .portfolio-filter').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (ring) { ring.style.transform = 'translate(-50%,-50%) scale(1.5)'; ring.style.borderColor = 'rgba(0,229,255,0.8)'; }
    });
    el.addEventListener('mouseleave', () => {
      if (ring) { ring.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.borderColor = 'rgba(0,229,255,0.5)'; }
    });
  });
}
initCursorHover();

// ─── Nav Toggle ───
function toggleNav() {
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  if (navLinks) navLinks.classList.toggle('open');
  if (hamburger) hamburger.classList.toggle('active');
}

// ─── Counter Animation ───
let countersAnimated = false;
function animateCounters() {
  if (countersAnimated) return;
  countersAnimated = true;
  document.querySelectorAll('[data-target]').forEach(el => {
    const target = +el.dataset.target;
    if (isNaN(target) || target === 0) return;
    let count = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = Math.round(count);
      if (count >= target) clearInterval(timer);
    }, 40);
  });
}

// ─── Scroll Reveal ───
const reveals = document.querySelectorAll('.reveal');
if (reveals.length > 0) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        if (entry.target.querySelector('[data-target]') || entry.target.hasAttribute('data-target')) {
          animateCounters();
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(r => observer.observe(r));
}

// Trigger counters on hero stats visibility
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateCounters(); statsObserver.disconnect(); }
  }, { threshold: 0.5 });
  statsObserver.observe(heroStats);
}

// ─── Active Nav Link ───
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, footer .footer-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath ||
        (currentPath === 'index.html' && href === 'index.html') ||
        (currentPath === 'index.html' && href === '#') ||
        ((currentPath === 'web-development.html' || currentPath === 'graphics-design.html' || currentPath === 'software-consulting.html' || currentPath === 'mobile-development.html') && href === 'services.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});

// ─── WhatsApp Float ───
const waBtn = document.getElementById('waFloatBtn');
const waMenu = document.getElementById('waMenu');
if (waBtn && waMenu) {
  waBtn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = waMenu.classList.toggle('show');
    waBtn.classList.toggle('open', isOpen);
  });
  document.addEventListener('click', e => {
    if (!waBtn.contains(e.target) && !waMenu.contains(e.target)) {
      waMenu.classList.remove('show');
      waBtn.classList.remove('open');
    }
  });
}

// ─── Theme Toggle (Dark/Light Mode) ───
const themeToggle = document.getElementById('themeToggle');
function setTheme(dark) {
  if (dark) {
    document.body.classList.remove('light');
    localStorage.setItem('devaura-theme', 'dark');
  } else {
    document.body.classList.add('light');
    localStorage.setItem('devaura-theme', 'light');
  }
}
if (themeToggle) {
  // Initialize from localStorage
  const savedTheme = localStorage.getItem('devaura-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light');
  }
  themeToggle.addEventListener('click', () => {
    setTheme(document.body.classList.contains('light'));
  });
}

// ─── Tech Stack Filtering ───
function initTechFilters() {
  const filters = document.querySelectorAll('.tech-filter');
  const cards = document.querySelectorAll('.tech-card');
  if (filters.length === 0 || cards.length === 0) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}
initTechFilters();

// ─── Portfolio Filtering ───
function initPortfolioFilters() {
  const filters = document.querySelectorAll('.portfolio-filter');
  const cards = document.querySelectorAll('.project-card');
  if (filters.length === 0 || cards.length === 0) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}
initPortfolioFilters();

// ─── Project Cost Calculator ───
function initCalculator() {
  const calcType = document.getElementById('calcType');
  const calcFeatures = document.querySelectorAll('.calc-feature');
  const calcBudget = document.getElementById('calcBudget');
  const calcTimeline = document.getElementById('calcTimeline');
  if (!calcType || !calcBudget || !calcTimeline) return;

  const baseCosts = {
    website: { min: 300, max: 3000, weeks: [2, 6] },
    mobile: { min: 800, max: 5000, weeks: [4, 10] },
    ecommerce: { min: 500, max: 4000, weeks: [3, 8] },
    saas: { min: 1500, max: 8000, weeks: [6, 16] },
    ai: { min: 1000, max: 6000, weeks: [4, 12] }
  };

  const featureCost = 400;

  function calculate() {
    const type = calcType.value;
    const base = baseCosts[type] || baseCosts.website;
    const featureCount = document.querySelectorAll('.calc-feature:checked').length;
    const extraCost = featureCount * featureCost;

    const minBudget = base.min + extraCost;
    const maxBudget = base.max + extraCost;
    const minWeeks = base.weeks[0] + Math.floor(featureCount * 0.5);
    const maxWeeks = base.weeks[1] + Math.ceil(featureCount * 1);

    calcBudget.textContent = `$${minBudget.toLocaleString()} - $${maxBudget.toLocaleString()} (negotiable)`;
    calcTimeline.textContent = `${minWeeks} - ${maxWeeks} weeks`;
  }

  calcType.addEventListener('change', calculate);
  calcFeatures.forEach(cb => cb.addEventListener('change', calculate));
  calculate();
}
initCalculator();

// ─── Custom Budget Toggle ───
document.querySelectorAll('#contactBudget').forEach(sel => {
  sel.addEventListener('change', () => {
    const customGroup = document.getElementById('customBudgetGroup');
    if (customGroup) {
      customGroup.style.display = sel.value === 'Custom' ? '' : 'none';
      if (sel.value !== 'Custom') {
        const customInput = document.getElementById('customBudget');
        if (customInput) customInput.value = '';
      }
    }
  });
});

// ─── Testimonial Carousel ───
function initTestimonials() {
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  if (!track || !dotsContainer) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let autoSlideTimer;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = ((index % cards.length) + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.testimonial-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
    resetAutoSlide();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(next, 6000);
  }
  resetAutoSlide();
}
initTestimonials();

// ─── Contact Form Submission ───
const contactForm = document.querySelector('.contact-form');
const submitBtn = document.querySelector('.btn-submit');
const successOverlay = document.getElementById('successOverlay');

if (contactForm && submitBtn) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch('https://submit-form.com/JFlNXVHYh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        if (successOverlay) {
          successOverlay.classList.add('active');
          setTimeout(() => successOverlay.classList.remove('active'), 5000);
        }
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Form submission failed' }));
        throw new Error(errorData.message || 'Form submission failed');
      }
    } catch (error) {
      alert('Error: ' + error.message);
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// ─── Smooth Scroll for Anchor Links ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── Nav Background on Scroll ───
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    } else {
      nav.style.boxShadow = 'none';
    }
  }, { passive: true });
}

// ─── Reinitialize Cursor Hover on Dynamic Content ───
// Run after a short delay to catch dynamically rendered elements
setTimeout(initCursorHover, 1000);
