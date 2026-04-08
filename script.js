// ── LOADER ──
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if(loader) loader.classList.add('hidden');
  }, 800);
});

// ── HEADER SCROLL SHADOW ──
window.addEventListener('scroll', () => {
  const header = document.getElementById('main-header');
  if(header) header.classList.toggle('scrolled', window.scrollY > 20);
});

// ── SLIDER + DOTS ──
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('dots');
let current = 0;

if(slides.length && dotsContainer) {
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
}

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

if(hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileNav.classList.remove('open'));
  });
}

/* ════════════════════════════════════════════════════════
   NOTICE BOARD — Firebase Firestore Version
   FIX: getApps() check se duplicate app error hataya
════════════════════════════════════════════════════════ */
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

(function () {

  /* ─── FIREBASE CONFIG ─────────────────────────────── */
  const firebaseConfig = {
    apiKey: "AIzaSyCgE1Ef5G0XokiStM6OUvri5AYVmy8eCQ",
    authDomain: "avs-inter-college.firebaseapp.com",
    projectId: "avs-inter-college",
    storageBucket: "avs-inter-college.firebasestorage.app",
    messagingSenderId: "1015183609592",
    appId: "1:1015183609592:web:7effcf7b46bad01e4e350d",
    measurementId: "G-TSTJYK3MJT"
  };

  /* ─── FIX 1: Duplicate app initialization rokne ke liye ─── */
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const db  = getFirestore(app);
  const NOTICES_COL = "notices";

  /* ─── CONFIG ─────────────────────────────────────── */
  const NB_PASSWORD = "AVS@2026";
  const NEW_DAYS    = 7;

  /* ─── TYPE LABELS ────────────────────────────────── */
  const TYPE_LABELS = {
    general:   "General",
    exam:      "Exam",
    holiday:   "Holiday",
    admission: "Admission",
    event:     "Event",
    urgent:    "Urgent",
  };

  /* ─── STATE ──────────────────────────────────────── */
  let isLoggedIn = false;
  let adminOpen  = false;
  let allNotices = [];

  /* ─── LOADING SPINNER ────────────────────────────── */
  function showGridLoader() {
    const grid = document.getElementById('nb-grid');
    if (grid) grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:48px 0;">
        <div class="nb-loader-spin"></div>
        <p style="color:rgba(255,255,255,0.4);font-size:13px;margin-top:14px;">Notices load ho rahi hain...</p>
      </div>`;
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
  function renderCards(notices) {
    const grid  = document.getElementById('nb-grid');
    const empty = document.getElementById('nb-empty');
    if (!grid) return;

    if (!notices.length) {
      grid.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';

    const sorted = [...notices].sort((a, b) => {
      if (a.type === 'urgent' && b.type !== 'urgent') return -1;
      if (b.type === 'urgent' && a.type !== 'urgent') return  1;
      return new Date(b.date) - new Date(a.date);
    });

    grid.innerHTML = sorted.map((n, i) => `
      <div class="nb-card" data-type="${n.type || 'general'}" style="animation-delay:${i * 0.07}s">
        ${isNew(n.date) ? '<span class="nb-new-tag">NEW</span>' : ''}
        <div class="nb-card-badge">${TYPE_LABELS[n.type] || 'General'}</div>
        <div class="nb-card-title">${escHtml(n.title)}</div>
        ${n.desc ? `<div class="nb-card-desc">${escHtml(n.desc)}</div>` : ''}
        <div class="nb-card-footer">
          <span class="nb-card-date">${n.date ? formatDate(n.date) : 'N/A'}</span>
          ${n.link ? `<a class="nb-card-link" href="${escHtml(n.link)}" target="_blank" rel="noopener">View Details</a>` : ''}
        </div>
      </div>
    `).join('');
  }

  /* ─── RENDER TICKER ──────────────────────────────── */
  function renderTicker(notices) {
    const ticker = document.getElementById('nb-ticker');
    if (!ticker) return;
    if (!notices.length) { ticker.textContent = 'Abhi koi notice nahi hai.'; return; }
    const items = [...notices, ...notices];
    ticker.innerHTML = items.map((n, i) =>
      `<span class="nb-ticker-notice">${TYPE_LABELS[n.type] || ''}&nbsp;${escHtml(n.title)}</span>
       <span class="nb-ticker-sep">${i < items.length - 1 ? '|' : ''}</span>`
    ).join('');
  }

  /* ─── RENDER EXISTING (ADMIN) ────────────────────── */
  function renderExisting(notices) {
    const list = document.getElementById('nb-existing-list');
    if (!list) return;
    if (!notices.length) {
      list.innerHTML = '<p style="color:rgba(255,255,255,0.35);font-size:13px;text-align:center;padding:20px;">Koi notice nahi hai abhi.</p>';
      return;
    }
    list.innerHTML = notices.map(n => `
      <div class="nb-existing-item" data-id="${n.id}">
        <div class="nb-existing-info">
          <div class="nb-existing-title">${escHtml(n.title)}</div>
          <div class="nb-existing-meta">${TYPE_LABELS[n.type] || 'General'} - ${n.date ? formatDate(n.date) : 'No date'}</div>
        </div>
        <button class="nb-delete-btn" data-id="${n.id}">Delete</button>
      </div>
    `).join('');

    list.querySelectorAll('.nb-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteNotice(btn.dataset.id));
    });
  }

  /* ─── FIX 2: renderAll — HAMESHA dono render karo ─── */
  function renderAll(notices) {
    allNotices = notices;
    renderCards(notices);
    renderTicker(notices);
    /* Admin logged in ho ya na ho — 
       allNotices update hota hai taaki admin panel
       open hone pe fresh data mile */
    if (isLoggedIn) renderExisting(notices);
  }

  /* ─── FIRESTORE: REAL-TIME LISTENER ──────────────── */
  function startRealtimeListener() {
    showGridLoader();

    /* FIX 3: orderBy "createdAt" desc ke saath — 
       notices collection mein createdAt field hamesha
       serverTimestamp() se aata hai isliye order sahi hai.
       Agar phir bhi order fail ho toh neeche fallback hai. */
    let q;
    try {
      q = query(collection(db, NOTICES_COL), orderBy("createdAt", "desc"));
    } catch(e) {
      q = query(collection(db, NOTICES_COL));
    }

    onSnapshot(q, (snapshot) => {
      const notices = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      renderAll(notices);
    }, (err) => {
      console.error("Firestore error:", err);

      /* FIX 4: orderBy index error aaye toh bina orderBy ke retry karo */
      if(err.code === 'failed-precondition' || err.message?.includes('index')) {
        console.warn("Index missing — retrying without orderBy...");
        const fallbackQ = query(collection(db, NOTICES_COL));
        onSnapshot(fallbackQ, (snapshot) => {
          const notices = snapshot.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .sort((a,b) => {
              const ta = a.createdAt?.toMillis?.() ?? 0;
              const tb = b.createdAt?.toMillis?.() ?? 0;
              return tb - ta;
            });
          renderAll(notices);
        });
        return;
      }

      const grid = document.getElementById('nb-grid');
      if (grid) grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:32px;color:rgba(255,100,100,0.7);">Notices load nahi ho saki. Internet check karein.</div>`;
    });
  }

  /* ─── FIRESTORE: ADD NOTICE ──────────────────────── */
  async function addNotice(data) {
    try {
      await addDoc(collection(db, NOTICES_COL), {
        ...data,
        createdAt: serverTimestamp()
      });
      return true;
    } catch (err) {
      console.error("Add error:", err);
      if(err.code === 'permission-denied') {
        alert('Permission denied! Firebase Console mein Firestore rules update karein:\nallow read, write: if true;');
      }
      return false;
    }
  }

  /* ─── FIRESTORE: DELETE NOTICE ───────────────────── */
  async function deleteNotice(id) {
    if (!confirm('Yeh notice delete karein?')) return;
    try {
      await deleteDoc(doc(db, NOTICES_COL, id));
      // onSnapshot auto-update karega
    } catch (err) {
      console.error("Delete error:", err);
      alert('Delete mein error aaya. Dobara try karein.');
    }
  }

  /* ─── ESCAPE HTML ────────────────────────────────── */
  function escHtml(s) {
    return String(s || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ─── ADMIN TOGGLE ───────────────────────────────── */
  const adminToggleBtn = document.getElementById('nb-admin-toggle');
  const adminPanel     = document.getElementById('nb-admin-panel');

  if (adminToggleBtn && adminPanel) {
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
    if (loginWrap)   loginWrap.style.display  = 'flex';
    if (managerWrap) managerWrap.style.display = 'none';
    if (pwdInput)    pwdInput.value = '';
    if (loginError)  loginError.textContent = '';
  }
  function showManager() {
    if (loginWrap)   loginWrap.style.display  = 'none';
    if (managerWrap) managerWrap.style.display = 'block';
    renderExisting(allNotices);
  }

  if (loginBtn) loginBtn.addEventListener('click', doLogin);
  if (pwdInput) pwdInput.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

  function doLogin() {
    if (!pwdInput) return;
    if (pwdInput.value === NB_PASSWORD) {
      isLoggedIn = true;
      showManager();
    } else {
      if (loginError) loginError.textContent = 'Galat password. Dobara try karein.';
      pwdInput.value = '';
      pwdInput.focus();
      pwdInput.style.animation = 'none';
      setTimeout(() => { pwdInput.style.animation = 'nb-shake 0.4s ease'; }, 10);
    }
  }

  /* ─── LOGOUT ─────────────────────────────────────── */
  document.getElementById('nb-logout-btn')?.addEventListener('click', () => {
    isLoggedIn = false; showLogin();
  });

  /* ─── ADD NOTICE FORM ────────────────────────────── */
  const addBtn = document.getElementById('nb-form-add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', async () => {
      const title = document.getElementById('nb-form-title')?.value.trim();
      const type  = document.getElementById('nb-form-type')?.value  || 'general';
      const desc  = document.getElementById('nb-form-desc')?.value.trim()  || '';
      const date  = document.getElementById('nb-form-date')?.value          || '';
      const link  = document.getElementById('nb-form-link')?.value.trim()  || '';

      if (!title) {
        alert('Notice ka title zaroori hai!');
        document.getElementById('nb-form-title')?.focus();
        return;
      }

      addBtn.disabled = true;
      addBtn.textContent = 'Saving...';

      const ok = await addNotice({ title, type, desc, date, link });

      if (ok) {
        ['nb-form-title','nb-form-desc','nb-form-date','nb-form-link'].forEach(id => {
          const el = document.getElementById(id); if (el) el.value = '';
        });
        const typeEl = document.getElementById('nb-form-type');
        if(typeEl) typeEl.value = 'general';
        const dateEl = document.getElementById('nb-form-date');
        if(dateEl) dateEl.value = new Date().toISOString().split('T')[0];

        addBtn.textContent = 'Notice Add Ho Gayi!';
        addBtn.style.background = 'linear-gradient(135deg,#27ae60,#58d68d)';
        setTimeout(() => {
          addBtn.textContent = 'Add Notice';
          addBtn.style.background = '';
          addBtn.disabled = false;
        }, 2000);

        /* FIX 5: onSnapshot se auto-update hoga — 
           renderExisting manually call karo bhi taaki admin ko turant dikh jaye */
        renderExisting(allNotices);
      } else {
        addBtn.textContent = 'Error - Retry';
        addBtn.style.background = 'linear-gradient(135deg,#e74c3c,#c0392b)';
        setTimeout(() => {
          addBtn.textContent = 'Add Notice';
          addBtn.style.background = '';
          addBtn.disabled = false;
        }, 2500);
      }
    });
  }

  /* ─── SET TODAY AS DEFAULT DATE ─────────────────── */
  const dateInput = document.getElementById('nb-form-date');
  if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

  /* ─── SHAKE KEYFRAME + LOADER STYLE ─────────────── */
  if (!document.getElementById('nb-shake-style')) {
    const s = document.createElement('style');
    s.id = 'nb-shake-style';
    s.textContent = `
      @keyframes nb-shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
      .nb-loader-spin { width:36px;height:36px;border:3px solid rgba(201,151,58,0.2);border-top-color:#c9973a;border-radius:50%;animation:nb-spin 0.9s linear infinite;margin:0 auto; }
      @keyframes nb-spin { to { transform:rotate(360deg); } }
    `;
    document.head.appendChild(s);
  }

  /* ─── INIT ───────────────────────────────────────── */
  startRealtimeListener();

})();
