/* ========================================
   DARK COSMOS — Interactions & Animations
   ======================================== */

import './style.css';

// ===== CUSTOM CURSOR =====
const cursorRing = document.getElementById('cursorRing');
const cursorDot = document.getElementById('cursorDot');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Magnetic hover on interactive elements
document.querySelectorAll('a, button, .project-card, .glass-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  // Frosted glass on scroll
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link based on scroll position
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

// Close menu on link click
document.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ===== SCROLL ANIMATIONS (IntersectionObserver) =====
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

const animObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 60);
      animObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.anim-item').forEach(el => animObserver.observe(el));

// ===== SKILL RINGS ANIMATION =====
const ringObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const rings = entry.target.querySelectorAll('.ring-fill');
      rings.forEach(ring => {
        const percent = ring.getAttribute('data-percent');
        ring.style.strokeDasharray = `${percent} ${100 - percent}`;
      });
      ringObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skills-grid').forEach(el => ringObserver.observe(el));

// ===== PROJECT FILTER =====
const filterTabs = document.querySelectorAll('.filter-tab');
const projectCards = document.querySelectorAll('.project-card');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.getAttribute('data-filter');

    projectCards.forEach(card => {
      if (filter === 'all' || card.getAttribute('data-category') === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeInUp 0.5s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== TESTIMONIAL CAROUSEL =====
const track = document.getElementById('testimonialTrack');
const cards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentSlide = 1;
const totalSlides = cards.length;

function updateCarousel(index) {
  currentSlide = index;
  cards.forEach((c, i) => c.classList.toggle('active', i === index));
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
  const offset = -(index * (100));
  track.style.transform = `translateX(calc(${offset}% - ${index * 24}px))`;
}

prevBtn.addEventListener('click', () => updateCarousel((currentSlide - 1 + totalSlides) % totalSlides));
nextBtn.addEventListener('click', () => updateCarousel((currentSlide + 1) % totalSlides));
dots.forEach((dot, i) => dot.addEventListener('click', () => updateCarousel(i)));

// Auto-play
let autoPlay = setInterval(() => updateCarousel((currentSlide + 1) % totalSlides), 5000);
track.addEventListener('mouseenter', () => clearInterval(autoPlay));
track.addEventListener('mouseleave', () => {
  autoPlay = setInterval(() => updateCarousel((currentSlide + 1) % totalSlides), 5000);
});

// ===== CARD TILT EFFECT =====
document.querySelectorAll('.project-card, .service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotateY = ((x - midX) / midX) * 6;
    const rotateX = ((midY - y) / midY) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Message Sent ✓';
    btn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
    setTimeout(() => {
      btn.textContent = 'Send Message →';
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 2500);
  }, 1500);
});

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== ADD SVG GRADIENT DEF FOR SKILL RINGS =====
const svgNS = 'http://www.w3.org/2000/svg';
const defs = document.createElementNS(svgNS, 'svg');
defs.setAttribute('width', '0');
defs.setAttribute('height', '0');
defs.style.position = 'absolute';
defs.innerHTML = `
  <defs>
    <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6C63FF"/>
      <stop offset="100%" stop-color="#00D4FF"/>
    </linearGradient>
  </defs>
`;
document.body.prepend(defs);

// ===== PARALLAX GLOW BLOBS =====
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  document.querySelectorAll('.glow-blob').forEach((blob, i) => {
    const speed = 0.03 + i * 0.02;
    blob.style.transform = `translateY(${scrollY * speed}px)`;
  });
});

// ===== INITIALIZE =====
updateCarousel(1);
