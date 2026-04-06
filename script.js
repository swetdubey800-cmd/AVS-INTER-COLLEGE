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
   FIREBASE NOTICE BOARD (SAME UI + LIVE DATABASE)
═══════════════════════════════════════════════════════ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* 🔥 FIREBASE CONFIG */
const firebaseConfig = {
  apiKey: "AIzaSyCgElEf5G0X0kiStM6O0Uvri5AYVmy8eCQ",
  authDomain: "avs-inter-college.firebaseapp.com",
  projectId: "avs-inter-college",
  storageBucket: "avs-inter-college.appspot.com",
  messagingSenderId: "1015183609592",
  appId: "1:1015183609592:web:7effcf7b46bad01e4e350d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

(function () {

  const NB_PASSWORD = "AVS@2026";
  const NEW_DAYS = 7;

  const TYPE_LABELS = {
    general: "📢 General",
    exam: "📝 Exam",
    holiday: "🏖️ Holiday",
    admission: "🎓 Admission",
    event: "🎉 Event",
    urgent: "🚨 Urgent",
  };

  let isLoggedIn = false;
  let adminOpen = false;

  /* 🔥 FIREBASE LOAD */
  async function loadNotices() {
    const snapshot = await getDocs(collection(db, "notices"));
    let notices = [];
    snapshot.forEach(doc => {
      notices.push({ id: doc.id, ...doc.data() });
    });
    return notices;
  }

  /* 🔥 FIREBASE SAVE */
  async function saveNotice(data) {
    await addDoc(collection(db, "notices"), data);
  }

  /* 🔥 DELETE */
  async function removeNotice(id) {
    await deleteDoc(doc(db, "notices", id));
  }

  function formatDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-IN');
  }

  function isNew(d) {
    return d && (Date.now() - new Date(d)) < NEW_DAYS * 86400000;
  }

  /* ─── RENDER CARDS ─── */
  async function renderCards() {
    const notices = await loadNotices();
    const grid = document.getElementById('nb-grid');
    const empty = document.getElementById('nb-empty');
    if (!grid) return;

    grid.innerHTML = '';

    if (!notices.length) {
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';

    const sorted = notices.sort((a, b) => new Date(b.date) - new Date(a.date));

    sorted.forEach((n, i) => {
      const card = document.createElement('div');
      card.className = 'nb-card';
      card.style.animationDelay = (i * 0.07) + 's';

      card.innerHTML = `
        ${isNew(n.date) ? '<span class="nb-new-tag">NEW</span>' : ''}
        <div class="nb-card-badge">${TYPE_LABELS[n.type] || '📢 General'}</div>
        <div class="nb-card-title">${n.title}</div>
        ${n.desc ? `<div class="nb-card-desc">${n.desc}</div>` : ''}
        <div class="nb-card-footer">
          <span>📅 ${formatDate(n.date)}</span>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  /* ─── ADMIN LIST ─── */
  async function renderExisting() {
    const notices = await loadNotices();
    const list = document.getElementById('nb-existing-list');
    if (!list) return;

    list.innerHTML = notices.map(n => `
      <div class="nb-existing-item">
        <div>${n.title}</div>
        <button data-id="${n.id}">Delete</button>
      </div>
    `).join('');

    list.querySelectorAll('button').forEach(btn => {
      btn.onclick = async () => {
        await removeNotice(btn.dataset.id);
        renderAll();
      };
    });
  }

  async function renderAll() {
    await renderCards();
    if (isLoggedIn) renderExisting();
  }

  /* ─── LOGIN ─── */
  document.getElementById('nb-login-btn')?.addEventListener('click', () => {
    const pwd = document.getElementById('nb-password').value;
    if (pwd === NB_PASSWORD) {
      isLoggedIn = true;
      alert("✅ Login Success");
      renderExisting();
    } else {
      alert("❌ Wrong Password");
    }
  });

  /* ─── ADD NOTICE ─── */
  document.getElementById('nb-form-add-btn')?.addEventListener('click', async () => {
    if (!isLoggedIn) return alert("Login first");

    const title = document.getElementById('nb-form-title').value;
    const desc = document.getElementById('nb-form-desc').value;

    if (!title) return alert("Enter title");

    await saveNotice({
      title,
      desc,
      type: "general",
      date: new Date().toISOString()
    });

    alert("✅ Notice Added (Live)");
    renderAll();
  });

  window.addEventListener('DOMContentLoaded', renderAll);

})();