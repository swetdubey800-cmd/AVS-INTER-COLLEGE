// ── LOADER ──
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 800);
});

// ── HEADER SCROLL SHADOW ──
window.addEventListener('scroll', () => {
  document.getElementById('main-header').classList.toggle('scrolled', window.scrollY > 20);
});

// ── SLIDER + DOTS ──
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('dots');
let current = 0;

slides.forEach((_, i) => {
  const btn = document.createElement('button');
  btn.className = 'dot' + (i === 0 ? ' active' : '');
  btn.addEventListener('click', () => goTo(i));
  dotsContainer.appendChild(btn);
});

function goTo(n) {
  slides[current].classList.remove('active');
  dotsContainer.children[current].classList.remove('active');
  current = n;
  slides[current].classList.add('active');
  dotsContainer.children[current].classList.add('active');
}

setInterval(() => goTo((current + 1) % slides.length), 4000);

// ── SCROLL FADE-UP ANIMATIONS ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('show');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});

mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileNav.classList.remove('open'));
});

/* ═══════════════════════════════════════════════════════
   NOTICE BOARD — Add this at the BOTTOM of script.js
   
   🔑 ADMIN PASSWORD: Change "AVS@2026" to your own password
═══════════════════════════════════════════════════════ */

(function () {

  /* ─── CONFIG ─────────────────────────────────────── */
  const NB_PASSWORD = "AVS@2026";   // ← Change your admin password here
  const NB_KEY      = "avs_notices"; // localStorage key (don't change)
  const NEW_DAYS    = 7;             // Days a notice shows "NEW" tag

  /* ─── TYPE LABELS ────────────────────────────────── */
  const TYPE_LABELS = {
    general:   "📢 General",
    exam:      "📝 Exam",
    holiday:   "🏖️ Holiday",
    admission: "🎓 Admission",
    event:     "🎉 Event",
    urgent:    "🚨 Urgent",
  };

  /* ─── DEFAULT NOTICES (shown first time, can be deleted) */
  const DEFAULT_NOTICES = [
    {
      id: "default-1",
      title: "Admissions Open for Session 2026–27",
      desc: "Limited seats available in KG to Class 12. Apply early to secure your child's future.",
      type: "admission",
      date: "2026-04-01",
      link: ""
    },
    {
      id: "default-2",
      title: "Half-Yearly Examination Schedule Released",
      desc: "Class 9–12 half-yearly exams will commence from 15th April 2026. Students must collect their admit cards from office.",
      type: "exam",
      date: "2026-04-05",
      link: ""
    },
    {
      id: "default-3",
      title: "Annual Sports Day – 20th April 2026",
      desc: "Parents and guardians are cordially invited to attend the Annual Sports Day celebrations.",
      type: "event",
      date: "2026-04-06",
      link: ""
    },
    {
      id: "default-4",
      title: "School Closed – Ram Navami",
      desc: "School will remain closed on 6th April 2026 on account of Ram Navami. Classes resume on 7th April.",
      type: "holiday",
      date: "2026-04-06",
      link: ""
    }
  ];

  /* ─── STATE ──────────────────────────────────────── */
  let isLoggedIn  = false;
  let adminOpen   = false;

  /* ─── LOAD / SAVE ────────────────────────────────── */
  function loadNotices() {
    const raw = localStorage.getItem(NB_KEY);
    if (!raw) {
      saveNotices(DEFAULT_NOTICES);
      return DEFAULT_NOTICES;
    }
    try { return JSON.parse(raw); } catch { return DEFAULT_NOTICES; }
  }

  function saveNotices(arr) {
    localStorage.setItem(NB_KEY, JSON.stringify(arr));
  }

  /* ─── DATE HELPERS ───────────────────────────────── */
  function formatDate(d) {
    if (!d) return '';
    const dt = new Date(d);
    return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function isNew(d) {
    if (!d) return false;
    return (Date.now() - new Date(d).getTime()) < NEW_DAYS * 86400000;
  }

  /* ─── RENDER CARDS ───────────────────────────────── */
  function renderCards() {
    const notices = loadNotices();
    const grid  = document.getElementById('nb-grid');
    const empty = document.getElementById('nb-empty');
    if (!grid) return;

    grid.innerHTML = '';

    if (!notices.length) {
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';

    // Sort: urgent first, then by date desc
    const sorted = [...notices].sort((a, b) => {
      if (a.type === 'urgent' && b.type !== 'urgent') return -1;
      if (b.type === 'urgent' && a.type !== 'urgent') return  1;
      return new Date(b.date) - new Date(a.date);
    });

    sorted.forEach((n, i) => {
      const card = document.createElement('div');
      card.className = 'nb-card';
      card.dataset.type = n.type || 'general';
      card.style.animationDelay = (i * 0.07) + 's';

      card.innerHTML = `
        ${isNew(n.date) ? '<span class="nb-new-tag">NEW</span>' : ''}
        <div class="nb-card-badge">${TYPE_LABELS[n.type] || '📢 General'}</div>
        <div class="nb-card-title">${escHtml(n.title)}</div>
        ${n.desc ? `<div class="nb-card-desc">${escHtml(n.desc)}</div>` : ''}
        <div class="nb-card-footer">
          <span class="nb-card-date">📅 ${n.date ? formatDate(n.date) : 'N/A'}</span>
          ${n.link ? `<a class="nb-card-link" href="${escHtml(n.link)}" target="_blank" rel="noopener">
            View Details
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>` : ''}
        </div>
      `;
      grid.appendChild(card);
    });
  }

  /* ─── RENDER TICKER ──────────────────────────────── */
  function renderTicker() {
    const ticker = document.getElementById('nb-ticker');
    if (!ticker) return;
    const notices = loadNotices();
    if (!notices.length) { ticker.textContent = 'No new notices.'; return; }

    // Duplicate for seamless loop
    const items = [...notices, ...notices];
    ticker.innerHTML = items.map((n, i) =>
      `<span class="nb-ticker-notice">${TYPE_LABELS[n.type] || '📢'}&nbsp;${escHtml(n.title)}</span>
       <span class="nb-ticker-sep">${i < items.length - 1 ? '✦' : ''}</span>`
    ).join('');
  }

  /* ─── RENDER EXISTING (ADMIN) ────────────────────── */
  function renderExisting() {
    const notices = loadNotices();
    const list = document.getElementById('nb-existing-list');
    if (!list) return;

    if (!notices.length) {
      list.innerHTML = '<p style="color:rgba(255,255,255,0.35);font-size:13px;text-align:center;padding:20px;">No notices yet.</p>';
      return;
    }

    list.innerHTML = notices.map(n => `
      <div class="nb-existing-item" data-id="${n.id}">
        <div class="nb-existing-info">
          <div class="nb-existing-title">${escHtml(n.title)}</div>
          <div class="nb-existing-meta">${TYPE_LABELS[n.type] || 'General'} · ${n.date ? formatDate(n.date) : 'No date'}</div>
        </div>
        <button class="nb-delete-btn" data-id="${n.id}">🗑 Delete</button>
      </div>
    `).join('');

    list.querySelectorAll('.nb-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const notices = loadNotices().filter(n => n.id !== id);
        saveNotices(notices);
        renderAll();
      });
    });
  }

  /* ─── RENDER ALL ─────────────────────────────────── */
  function renderAll() {
    renderCards();
    renderTicker();
    if (isLoggedIn) renderExisting();
  }

  /* ─── ESCAPE HTML ────────────────────────────────── */
  function escHtml(s) {
    return String(s || '')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
  }

  /* ─── GENERATE ID ────────────────────────────────── */
  function genId() {
    return 'nb-' + Date.now() + '-' + Math.random().toString(36).slice(2,7);
  }

  /* ─── ADMIN TOGGLE ───────────────────────────────── */
  const adminToggleBtn = document.getElementById('nb-admin-toggle');
  const adminPanel     = document.getElementById('nb-admin-panel');

  if (adminToggleBtn) {
    adminToggleBtn.addEventListener('click', () => {
      adminOpen = !adminOpen;
      adminPanel.style.display = adminOpen ? 'block' : 'none';
      if (!adminOpen) { isLoggedIn = false; showLogin(); }
    });
  }

  /* ─── LOGIN ──────────────────────────────────────── */
  const loginWrap   = document.getElementById('nb-login-wrap');
  const managerWrap = document.getElementById('nb-manager-wrap');
  const loginBtn    = document.getElementById('nb-login-btn');
  const pwdInput    = document.getElementById('nb-password');
  const loginError  = document.getElementById('nb-login-error');

  function showLogin() {
    if (loginWrap)   loginWrap.style.display   = 'flex';
    if (managerWrap) managerWrap.style.display  = 'none';
    if (pwdInput)    pwdInput.value = '';
    if (loginError)  loginError.textContent = '';
  }
  function showManager() {
    if (loginWrap)   loginWrap.style.display   = 'none';
    if (managerWrap) managerWrap.style.display  = 'block';
    renderExisting();
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', doLogin);
  }
  if (pwdInput) {
    pwdInput.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
  }

  function doLogin() {
    if (!pwdInput) return;
    if (pwdInput.value === NB_PASSWORD) {
      isLoggedIn = true;
      showManager();
    } else {
      loginError.textContent = '❌ Incorrect password. Try again.';
      pwdInput.value = '';
      pwdInput.focus();
      // Shake animation
      pwdInput.style.animation = 'none';
      setTimeout(() => { pwdInput.style.animation = 'nb-shake 0.4s ease'; }, 10);
    }
  }

  /* ─── LOGOUT ─────────────────────────────────────── */
  const logoutBtn = document.getElementById('nb-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      isLoggedIn = false;
      showLogin();
    });
  }

  /* ─── ADD NOTICE FORM ────────────────────────────── */
  const addBtn = document.getElementById('nb-form-add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const title = document.getElementById('nb-form-title')?.value.trim();
      const type  = document.getElementById('nb-form-type')?.value  || 'general';
      const desc  = document.getElementById('nb-form-desc')?.value.trim()  || '';
      const date  = document.getElementById('nb-form-date')?.value          || '';
      const link  = document.getElementById('nb-form-link')?.value.trim()  || '';

      if (!title) {
        alert('Please enter a notice title.');
        document.getElementById('nb-form-title')?.focus();
        return;
      }

      const notices = loadNotices();
      notices.unshift({ id: genId(), title, type, desc, date, link });
      saveNotices(notices);

      // Reset form
      ['nb-form-title','nb-form-desc','nb-form-date','nb-form-link'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      document.getElementById('nb-form-type').value = 'general';

      renderAll();

      // Success flash on button
      addBtn.textContent = '✅ Notice Added!';
      addBtn.style.background = 'linear-gradient(135deg,#27ae60,#58d68d)';
      setTimeout(() => {
        addBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add Notice`;
        addBtn.style.background = '';
      }, 2000);
    });
  }

  /* ─── SET TODAY AS DEFAULT DATE ─────────────────── */
  const dateInput = document.getElementById('nb-form-date');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  /* ─── SHAKE KEYFRAME (injected once) ─────────────── */
  if (!document.getElementById('nb-shake-style')) {
    const s = document.createElement('style');
    s.id = 'nb-shake-style';
    s.textContent = `@keyframes nb-shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-8px)}
      40%{transform:translateX(8px)}
      60%{transform:translateX(-5px)}
      80%{transform:translateX(5px)}
    }`;
    document.head.appendChild(s);
  }

  /* ─── INIT ───────────────────────────────────────── */
  renderAll();

})();
