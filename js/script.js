// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

function animCursor() {
  if (cursor && ring) {
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
  }
  requestAnimationFrame(animCursor);
}

if (cursor && ring) {
  animCursor();
}

// Adjust custom cursor size on interactive hover
function initCursorHover() {
  document.querySelectorAll('a, button, .service-card, .project-card, input, select, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (ring) {
        ring.style.transform = 'translate(-50%,-50%) scale(1.5)';
        ring.style.borderColor = 'rgba(0,229,255,0.8)';
      }
    });
    el.addEventListener('mouseleave', () => {
      if (ring) {
        ring.style.transform = 'translate(-50%,-50%) scale(1)';
        ring.style.borderColor = 'rgba(0,229,255,0.5)';
      }
    });
  });
}
initCursorHover();

// Nav toggle
function toggleNav() {
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  if (navLinks) {
    navLinks.classList.toggle('open');
  }
  if (hamburger) {
    hamburger.classList.toggle('active');
  }
}

// Counter animation
let countersAnimated = false;
function animateCounters() {
  if (countersAnimated) return;
  countersAnimated = true;
  document.querySelectorAll('[data-target]').forEach(el => {
    const target = +el.dataset.target;
    let count = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = Math.round(count) + '+';
      if (count >= target) clearInterval(timer);
    }, 40);
  });
}

// Scroll reveal observer
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

// Trigger counter when hero stats visible
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  }, { threshold: 0.5 });
  statsObserver.observe(heroStats);
}

// Active navigation link highlighting based on current page URL
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, footer .footer-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (
      href === currentPath ||
      (currentPath === 'index.html' && href === 'index.html') ||
      (currentPath === 'index.html' && href === '#') ||
      ((currentPath === 'web-development.html' || currentPath === 'graphics-design.html' || currentPath === 'software-consulting.html') && href === 'services.html')
    ) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});

// WhatsApp floating menu toggle
const waBtn = document.getElementById('waFloatBtn');
const waMenu = document.getElementById('waMenu');

if (waBtn && waMenu) {
  waBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = waMenu.classList.toggle('show');
    waBtn.classList.toggle('open', isOpen);
  });

  document.addEventListener('click', (e) => {
    if (!waBtn.contains(e.target) && !waMenu.contains(e.target)) {
      waMenu.classList.remove('show');
      waBtn.classList.remove('open');
    }
  });
}
