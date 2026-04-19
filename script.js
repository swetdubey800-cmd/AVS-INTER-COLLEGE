/* ════════════════════════════════════════
   AVS INTER COLLEGE — script.js
════════════════════════════════════════ */

// ── LOADER ──────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 900);
});

// ── HEADER SCROLL SHADOW ─────────────────
window.addEventListener('scroll', () => {
  const header = document.getElementById('main-header');
  if (header) header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── HERO SLIDER ──────────────────────────
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('dots');
let current = 0;
let sliderInterval;

if (slides.length && dotsContainer) {
  // Create dots
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', `Slide ${i + 1}`);
    btn.addEventListener('click', () => {
      goTo(i);
      resetInterval();
    });
    dotsContainer.appendChild(btn);
  });

  function goTo(n) {
    slides[current].classList.remove('active');
    dotsContainer.children[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dotsContainer.children[current].classList.add('active');
  }

  function resetInterval() {
    clearInterval(sliderInterval);
    sliderInterval = setInterval(() => goTo(current + 1), 4500);
  }

  sliderInterval = setInterval(() => goTo(current + 1), 4500);
}

// ── SCROLL FADE-UP ANIMATIONS ────────────
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('show');
      fadeObserver.unobserve(e.target); // Only animate once
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

// ── HAMBURGER MENU ───────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });
}

// ── COUNTER ANIMATION ────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  if (isNaN(target)) return;
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => {
  counterObserver.observe(el);
});

// ── SMOOTH SCROLL FOR ANCHOR LINKS ───────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const headerH = document.getElementById('main-header')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── GALLERY LIGHTBOX (simple) ─────────────
document.querySelectorAll('.gallery-item, .lib-g-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9000;
      background:rgba(5,15,28,0.95);
      display:flex;align-items:center;justify-content:center;
      cursor:zoom-out;animation:fadeIn 0.25s ease;
    `;
    const pic = document.createElement('img');
    pic.src = img.src;
    pic.alt = img.alt;
    pic.style.cssText = `
      max-width:92vw;max-height:90vh;border-radius:12px;
      box-shadow:0 24px 80px rgba(0,0,0,0.6);
      object-fit:contain;
    `;

    const close = document.createElement('button');
    close.innerHTML = '✕';
    close.style.cssText = `
      position:absolute;top:24px;right:28px;
      background:rgba(200,151,42,0.9);color:#071a2e;
      border:none;border-radius:50%;width:40px;height:40px;
      font-size:18px;font-weight:700;cursor:pointer;
      display:flex;align-items:center;justify-content:center;
    `;

    overlay.appendChild(pic);
    overlay.appendChild(close);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const closeLightbox = () => {
      overlay.remove();
      document.body.style.overflow = '';
    };
    overlay.addEventListener('click', closeLightbox);
    close.addEventListener('click', e => { e.stopPropagation(); closeLightbox(); });

    document.addEventListener('keydown', function escClose(e) {
      if (e.key === 'Escape') { closeLightbox(); document.removeEventListener('keydown', escClose); }
    });
  });
});

// Inject lightbox fadeIn keyframe if not present
if (!document.getElementById('lightbox-style')) {
  const st = document.createElement('style');
  st.id = 'lightbox-style';
  st.textContent = `@keyframes fadeIn{from{opacity:0}to{opacity:1}}`;
  document.head.appendChild(st);
}

// ── ACTIVE NAV LINK ON SCROLL ─────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"], .mobile-nav a[href^="#"]');

if (sections.length && navLinks.length) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelectorAll(`nav a[href="#${e.target.id}"], .mobile-nav a[href="#${e.target.id}"]`);
        active.forEach(l => l.classList.add('active'));
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));
}

// ── MARQUEE PAUSE ON HOVER ────────────────
const marquee = document.querySelector('.announcement-track');
if (marquee) {
  marquee.addEventListener('mouseenter', () => marquee.style.animationPlayState = 'paused');
  marquee.addEventListener('mouseleave', () => marquee.style.animationPlayState = 'running');
}

console.log('%cAVS Inter College 🎓', 'font-size:18px;color:#c8972a;font-weight:bold;');
console.log('%cBhagwanpur, Jaunpur, UP | Est. 1995', 'color:#888;font-size:12px');
