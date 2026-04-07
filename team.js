/* ============================================================
   TEAM.JS — Firebase Firestore + Storage Version
   AVS Inter College | Full Admin Panel
   Password: AVS@Admin2026  ← Change here
   ============================================================ */

import { initializeApp }            from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, getDoc,
         updateDoc, deleteDoc, doc, query, orderBy,
         onSnapshot, serverTimestamp }
                                    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref as storageRef, uploadBytes,
         getDownloadURL, deleteObject }
                                    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

/* ─── FIREBASE CONFIG ─────────────────────────────────── */
const firebaseConfig = {
  apiKey: "AIzaSyCgE1Ef5G0XokiStM6OUvri5AYVmy8eCQ",
  authDomain: "avs-inter-college.firebaseapp.com",
  projectId: "avs-inter-college",
  storageBucket: "avs-inter-college.firebasestorage.app",
  messagingSenderId: "1015183609592",
  appId: "1:1015183609592:web:7effcf7b46bad01e4e350d",
  measurementId: "G-TSTJYK3MJT"
};

const app     = initializeApp(firebaseConfig);
const db      = getFirestore(app);
const storage = getStorage(app);
const STAFF_COL = "staff"; // Firestore collection name

/* ─── ADMIN CONFIG ────────────────────────────────────── */
const ADMIN_PASSWORD = "AVS@Admin2026"; // ← Apna password yahan badlein

/* ─── CATEGORY LABELS ──────────────────────────────────── */
const CAT_LABELS = {
  leadership: "Leadership",
  science:    "Science Faculty",
  arts:       "Arts Faculty",
  primary:    "Primary Faculty",
  admin:      "Administration",
};

/* ─── STATE ───────────────────────────────────────────── */
let allStaff     = [];
let adminLoggedIn = false;
let activeFilter  = 'all';

/* ═══════════════════════════════════════════════════════
   DEFAULT DATA — First time only (Firestore mein save hoga)
═══════════════════════════════════════════════════════ */
const DEFAULT_STAFF = [
  { category:'leadership', name:'Shri Vinod Kumar Singh', role:'Founder', subject:'Mathematics', classes:'Class 6 – 12', experience:'30+ Years', education:['M.Sc. (Mathematics) — Banaras Hindu University','B.Ed. — Lucknow University','LL.B. — Allahabad University'], bio:'Shri Vinod Kumar Singh founded AVS Inter College in 1995 with a mission to bring quality education to rural Jaunpur.', colors:['#6b3a0a','#c9973a'], photo:'' },
  { category:'leadership', name:'Shri Vinay Kumar Singh', role:'Principal', subject:'Academic Leadership', classes:'All Classes', experience:'22 Years', education:['M.A. (Education) — Allahabad University','B.Ed. — Lucknow University','CTET Qualified'], bio:'Shri Vinay Kumar Singh leads AVS Inter College with integrity and deep commitment to student welfare.', colors:['#1a3a5c','#2e7bc4'], photo:'' },
  { category:'leadership', name:'Shri Ashish Kumar Singh', role:'Director', subject:'Physics', classes:'Class 9 – 12', experience:'18 Years', education:['M.Sc. (Physics) — Banaras Hindu University','B.Ed. — Allahabad University','NET Qualified — CSIR'], bio:'Shri Ashish Kumar Singh oversees the strategic direction and academic standards of AVS Inter College.', colors:['#2c5f2e','#5a9e5d'], photo:'' },
  { category:'science', name:'Mr. Suresh Kumar Mishra', role:'Senior Lecturer', subject:'Physics', classes:'Class 9 – 12', experience:'14 Years', education:['M.Sc. (Physics) — Allahabad University','B.Ed. — VBSPU Jaunpur','UPTET Qualified'], bio:'Mr. Suresh Mishra is celebrated for breaking complex Physics topics into simple, relatable ideas.', colors:['#1a3a5c','#4a8fc4'], photo:'' },
  { category:'science', name:'Mrs. Rekha Gupta', role:'Senior Lecturer', subject:'Chemistry', classes:'Class 9 – 12', experience:'12 Years', education:['M.Sc. (Chemistry) — BHU Varanasi','B.Ed. — Lucknow University'], bio:'Mrs. Rekha Gupta heads the Chemistry laboratory and makes chemical reactions come alive through demonstration-based teaching.', colors:['#5c3a1a','#c48b4b'], photo:'' },
  { category:'science', name:'Mr. Ashok Kumar Pandey', role:'Lecturer', subject:'Biology', classes:'Class 9 – 12', experience:'9 Years', education:['M.Sc. (Botany) — Gorakhpur University','B.Ed. — VBSPU Jaunpur'], bio:'Mr. Ashok Pandey teaches Biology with emphasis on diagrams, lab work and conceptual depth.', colors:['#2c5f2e','#5a9e5d'], photo:'' },
  { category:'science', name:'Mr. Devendra Kumar Singh', role:'Senior Lecturer', subject:'Mathematics', classes:'Class 6 – 12', experience:'16 Years', education:['M.Sc. (Mathematics) — Allahabad University','B.Ed. — VBSPU Jaunpur','UPTET Qualified'], bio:'Mr. Devendra Singh is the cornerstone of the Maths department.', colors:['#3a1a5c','#7b4bc4'], photo:'' },
  { category:'science', name:'Mrs. Sunita Verma', role:'Lecturer', subject:'Mathematics', classes:'Class 6 – 10', experience:'8 Years', education:['M.Sc. (Mathematics) — BHU Varanasi','B.Ed., CTET Qualified'], bio:'Mrs. Sunita Verma makes Mathematics enjoyable through interactive activities and visual methods.', colors:['#5c1a1a','#c44b4b'], photo:'' },
  { category:'science', name:'Mr. Rajeev Srivastava', role:'Lecturer', subject:'Computer Science', classes:'Class 6 – 12', experience:'10 Years', education:['MCA — IGNOU New Delhi','B.Ed. — Lucknow University'], bio:'Mr. Rajeev Srivastava heads the Computer Lab and teaches programming fundamentals and digital literacy.', colors:['#1a4a5c','#4b9ec4'], photo:'' },
  { category:'science', name:'Mr. Kuldeep Soni', role:'Lecturer', subject:'General Science', classes:'Class 6 – 8', experience:'7 Years', education:['B.Sc. (PCM) — VBSPU Jaunpur','B.Ed., UPTET Qualified'], bio:'Mr. Kuldeep Soni builds strong science foundations in middle school students through experiments and models.', colors:['#3a1a5c','#7b4bc4'], photo:'' },
  { category:'science', name:'Mrs. Nisha Yadav', role:'Lecturer', subject:'Biology', classes:'Class 6 – 10', experience:'6 Years', education:['M.Sc. (Zoology) — Gorakhpur University','B.Ed. — VBSPU Jaunpur'], bio:'Mrs. Nisha Yadav brings biology to life with charts, models and field-based learning.', colors:['#2c5f2e','#5a9e5d'], photo:'' },
  { category:'arts', name:'Mr. Shyam Narayan Tripathi', role:'Senior Lecturer', subject:'Hindi', classes:'Class 6 – 12', experience:'18 Years', education:['M.A. (Hindi) — Allahabad University','B.Ed., NET Qualified','Sahitya Ratna — UP Government'], bio:'Mr. Tripathi is a celebrated Hindi educator and accomplished poet.', colors:['#5c1a1a','#c44b4b'], photo:'' },
  { category:'arts', name:'Mrs. Meera Shukla', role:'Lecturer', subject:'English', classes:'Class 6 – 12', experience:'11 Years', education:['M.A. (English) — BHU Varanasi','B.Ed. — Lucknow University'], bio:'Mrs. Meera Shukla runs a special English communication programme for senior students.', colors:['#1a3a5c','#2e7bc4'], photo:'' },
  { category:'arts', name:'Mr. Ramakant Dubey', role:'Lecturer', subject:'History & Civics', classes:'Class 9 – 12', experience:'13 Years', education:['M.A. (History) — Allahabad University','B.Ed. — VBSPU Jaunpur'], bio:'Mr. Ramakant Dubey brings history alive through storytelling, timelines and contextual analysis.', colors:['#3d3d1a','#9e9e4b'], photo:'' },
  { category:'arts', name:'Mrs. Kavita Rai', role:'Lecturer', subject:'Geography', classes:'Class 9 – 12', experience:'9 Years', education:['M.A. (Geography) — Gorakhpur University','B.Ed. — VBSPU Jaunpur'], bio:'Mrs. Kavita Rai uses maps, models and educational trips to make Geography engaging.', colors:['#2c5f2e','#5a9e5d'], photo:'' },
  { category:'arts', name:'Mr. Umesh Chandra Yadav', role:'Lecturer', subject:'Economics', classes:'Class 11 – 12', experience:'7 Years', education:['M.A. (Economics) — Allahabad University','B.Ed., NET Qualified'], bio:'Mr. Umesh Chandra Yadav explains economic principles through real-world examples and case studies.', colors:['#5c3a1a','#c48b4b'], photo:'' },
  { category:'arts', name:'Mrs. Anita Pathak', role:'Senior Lecturer', subject:'Sanskrit', classes:'Class 6 – 10', experience:'20 Years', education:['M.A. (Sanskrit) — BHU Varanasi','B.Ed. — Lucknow University','Sahitya Ratna — Sanskrit Parishad'], bio:'Mrs. Anita Pathak blends classical texts with practical grammar. Her students achieve exceptional scores.', colors:['#5c1a3a','#b84b8e'], photo:'' },
  { category:'arts', name:'Mr. Vinay Kumar Gupta', role:'Lecturer', subject:'Social Science', classes:'Class 6 – 8', experience:'8 Years', education:['M.A. (Political Science) — Allahabad University','B.Ed., UPTET Qualified'], bio:'Mr. Vinay Kumar Gupta instils civic sense through debates, discussions and community projects.', colors:['#3a1a5c','#7b4bc4'], photo:'' },
  { category:'arts', name:'Mr. Pramod Kumar Chauhan', role:'Lecturer', subject:'Fine Arts & Drawing', classes:'Class 1 – 10', experience:'14 Years', education:['B.F.A. — Banaras Hindu University','B.Ed. — VBSPU Jaunpur'], bio:'Mr. Pramod Kumar Chauhan nurtures creativity through art exhibitions and competitions.', colors:['#5c1a1a','#c44b4b'], photo:'' },
  { category:'primary', name:'Mrs. Savita Dubey', role:'Primary Teacher', subject:'All Subjects', classes:'Class 1 – 2', experience:'10 Years', education:['B.A. — VBSPU Jaunpur','D.El.Ed., CTET Qualified'], bio:'Mrs. Savita Dubey specialises in early childhood education using play-based methods.', colors:['#5c1a3a','#b84b8e'], photo:'' },
  { category:'primary', name:'Mrs. Rina Singh', role:'Primary Teacher', subject:'Science & Maths', classes:'Class 3 – 4', experience:'8 Years', education:['B.Sc. — VBSPU Jaunpur','D.El.Ed., CTET Qualified'], bio:'Mrs. Rina Singh fosters curiosity and logical thinking through hands-on science activities.', colors:['#1a4a5c','#4b9ec4'], photo:'' },
  { category:'primary', name:'Mr. Prakash Tiwari', role:'Primary Teacher', subject:'Hindi & English', classes:'Class 5', experience:'6 Years', education:['B.A. — Allahabad University','B.Ed., UPTET Qualified'], bio:'Mr. Prakash Tiwari bridges the gap between primary and middle school with strong language foundations.', colors:['#3d3d1a','#9e9e4b'], photo:'' },
  { category:'primary', name:'Mrs. Pooja Mishra', role:'Kindergarten Teacher', subject:'Play-based Learning', classes:'KG / Nursery', experience:'7 Years', education:['B.A. — VBSPU Jaunpur','NTT, Montessori Certified'], bio:'Mrs. Pooja Mishra is a certified Montessori educator for the college\'s youngest learners.', colors:['#5c1a3a','#b84b8e'], photo:'' },
  { category:'primary', name:'Mrs. Geeta Rani', role:'Kindergarten Teacher', subject:'Play-based Learning', classes:'KG / Nursery', experience:'9 Years', education:['B.A. — Gorakhpur University','NTT, CTET Qualified'], bio:'Mrs. Geeta Rani designs engaging activities to develop motor and cognitive skills in young children.', colors:['#2c5f2e','#5a9e5d'], photo:'' },
  { category:'primary', name:'Mr. Sunil Kumar', role:'Primary Teacher', subject:'Hindi & EVS', classes:'Class 1 – 3', experience:'5 Years', education:['B.A. — VBSPU Jaunpur','D.El.Ed. Qualified'], bio:'Mr. Sunil Kumar uses storytelling, rhymes and visual aids for Hindi and Environmental Science.', colors:['#3a1a5c','#7b4bc4'], photo:'' },
  { category:'admin', name:'Mr. Ravi Shankar Pandey', role:'Office Superintendent', subject:'Administration', classes:'Office', experience:'15 Years', education:['B.Com. — VBSPU Jaunpur','PGDCA — IGNOU'], bio:'Mr. Ravi Shankar Pandey manages all administrative records, student enrollment and government correspondence.', colors:['#5c3a1a','#c48b4b'], photo:'' },
  { category:'admin', name:'Mrs. Seema Agarwal', role:'Accounts Officer', subject:'Finance & Accounts', classes:'Office', experience:'12 Years', education:['M.Com. — Allahabad University','CPA Certified'], bio:'Mrs. Seema Agarwal oversees all financial transactions, fee collection, budgeting and annual audits.', colors:['#1a4a5c','#4b9ec4'], photo:'' },
  { category:'admin', name:'Mr. Ajay Shukla', role:'Librarian', subject:'Library & Information', classes:'All Classes', experience:'10 Years', education:['M.Lib.Sc. — BHU Varanasi','B.A. — VBSPU Jaunpur'], bio:'Mr. Ajay Shukla manages a library of 5,000+ books and actively promotes reading culture.', colors:['#3d3d1a','#9e9e4b'], photo:'' },
  { category:'admin', name:'Mr. Hemant Lal Yadav', role:'Lab Technician', subject:'Science Laboratory', classes:'Class 9 – 12', experience:'8 Years', education:['B.Sc. — VBSPU Jaunpur','DMLT Certified'], bio:'Mr. Hemant Lal Yadav ensures the Science laboratory is fully equipped, safe and well-maintained.', colors:['#2c5f2e','#5a9e5d'], photo:'' },
  { category:'admin', name:'Mrs. Lata Tripathi', role:'Counselor & Welfare Officer', subject:'Student Counseling', classes:'All Classes', experience:'11 Years', education:['M.A. (Psychology) — Allahabad University','B.Ed. — Lucknow University'], bio:'Mrs. Lata Tripathi provides emotional and academic counselling to students and coordinates wellness activities.', colors:['#5c1a3a','#b84b8e'], photo:'' },
];

/* ═══════════════════════════════════════════════════════
   FIRESTORE — SEED DEFAULT DATA (if collection is empty)
═══════════════════════════════════════════════════════ */
async function seedDefaultIfEmpty() {
  const snap = await getDocs(collection(db, STAFF_COL));
  if (!snap.empty) return; // already has data
  showToast('Pehli baar data load ho raha hai...', 'info');
  for (const m of DEFAULT_STAFF) {
    await addDoc(collection(db, STAFF_COL), { ...m, createdAt: serverTimestamp() });
  }
}

/* ═══════════════════════════════════════════════════════
   FIRESTORE — REAL-TIME LISTENER
═══════════════════════════════════════════════════════ */
function startRealtimeListener() {
  showPageLoader(true);
  const q = query(collection(db, STAFF_COL), orderBy("createdAt", "asc"));
  onSnapshot(q, (snapshot) => {
    allStaff = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    renderAll(activeFilter);
    showPageLoader(false);
  }, (err) => {
    console.error("Firestore listener error:", err);
    showPageLoader(false);
    showToast('Data load nahi hua. Internet check karein.', 'error');
  });
}

/* ═══════════════════════════════════════════════════════
   FIREBASE STORAGE — UPLOAD PHOTO
═══════════════════════════════════════════════════════ */
async function uploadPhoto(file, staffId) {
  if (!file) return '';
  try {
    const ext  = file.name.split('.').pop();
    const path = `staff-photos/${staffId}_${Date.now()}.${ext}`;
    const sRef = storageRef(storage, path);
    const snap = await uploadBytes(sRef, file);
    const url  = await getDownloadURL(snap.ref);
    return url;
  } catch (err) {
    console.error("Photo upload error:", err);
    showToast('Photo upload nahi hui. Firestore Storage rules check karein.', 'error');
    return '';
  }
}

/* ═══════════════════════════════════════════════════════
   FIRESTORE — ADD MEMBER
═══════════════════════════════════════════════════════ */
async function addMemberToFirestore(data, photoFile) {
  try {
    // Add doc first to get ID
    const docRef = await addDoc(collection(db, STAFF_COL), {
      ...data, photo: '', createdAt: serverTimestamp()
    });
    // Upload photo if provided
    if (photoFile) {
      const url = await uploadPhoto(photoFile, docRef.id);
      if (url) await updateDoc(docRef, { photo: url });
    }
    return true;
  } catch (err) {
    console.error("Add member error:", err);
    return false;
  }
}

/* ═══════════════════════════════════════════════════════
   FIRESTORE — UPDATE MEMBER
═══════════════════════════════════════════════════════ */
async function updateMemberInFirestore(id, data, photoFile) {
  try {
    const docReference = doc(db, STAFF_COL, id);
    let photoUrl = data.photo || '';
    if (photoFile) {
      photoUrl = await uploadPhoto(photoFile, id);
    }
    await updateDoc(docReference, { ...data, photo: photoUrl });
    return true;
  } catch (err) {
    console.error("Update error:", err);
    return false;
  }
}

/* ═══════════════════════════════════════════════════════
   FIRESTORE — DELETE MEMBER
═══════════════════════════════════════════════════════ */
async function deleteMemberFromFirestore(id, name) {
  if (!confirm(`"${name}" ko hamesha ke liye delete karein?`)) return;
  try {
    await deleteDoc(doc(db, STAFF_COL, id));
    showToast(`🗑 ${name} delete ho gaye.`, 'error');
    renderManageList();
  } catch (err) {
    console.error("Delete error:", err);
    showToast('Delete nahi hua. Dobara try karein.', 'error');
  }
}

/* ═══════════════════════════════════════════════════════
   AVATAR SVG (fallback if no photo)
═══════════════════════════════════════════════════════ */
function avatarSVG(name, c1, c2) {
  const initials = String(name||'').trim().split(/\s+/).map(w=>w[0]).join('').substring(0,2).toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>
    <defs><linearGradient id='gx${initials}' x1='0%' y1='0%' x2='100%' y2='100%'>
      <stop offset='0%' stop-color='${c1}'/><stop offset='100%' stop-color='${c2}'/>
    </linearGradient></defs>
    <rect width='300' height='300' fill='url(#gx${initials})'/>
    <circle cx='150' cy='110' r='52' fill='rgba(255,255,255,0.10)'/>
    <text x='150' y='128' dominant-baseline='middle' text-anchor='middle'
      font-family='Georgia,serif' font-size='46' font-weight='bold'
      fill='rgba(255,255,255,0.95)'>${initials}</text>
    <ellipse cx='150' cy='262' rx='80' ry='36' fill='rgba(255,255,255,0.07)'/>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function getPhoto(m) {
  return (m.photo && m.photo.startsWith('http')) ? m.photo : avatarSVG(m.name, m.colors[0], m.colors[1]);
}

/* ═══════════════════════════════════════════════════════
   ESCAPE HTML
═══════════════════════════════════════════════════════ */
function escH(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ═══════════════════════════════════════════════════════
   PAGE LOADER
═══════════════════════════════════════════════════════ */
function showPageLoader(show) {
  let loader = document.getElementById('team-page-loader');
  if (show) {
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'team-page-loader';
      loader.style.cssText = `position:fixed;inset:0;background:rgba(249,246,240,0.9);z-index:8000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;transition:opacity 0.4s;`;
      loader.innerHTML = `<div class="tl-spin"></div><p style="font-size:14px;color:var(--text-light);">Faculty data load ho rahi hai...</p>`;
      document.body.appendChild(loader);
    }
    loader.style.opacity = '1'; loader.style.pointerEvents = 'all';
  } else {
    if (loader) { loader.style.opacity = '0'; loader.style.pointerEvents = 'none'; setTimeout(() => loader?.remove(), 400); }
  }
}

/* ═══════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════ */
function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.animation = 'toastOut 0.4s ease forwards'; setTimeout(() => t.remove(), 400); }, 3000);
}

/* ═══════════════════════════════════════════════════════
   CARD BUILDERS
═══════════════════════════════════════════════════════ */
function leaderCardHTML(m) {
  const eduHTML = (m.education||[]).map(e=>`<li>${escH(e)}</li>`).join('');
  return `
  <div class="leader-card" onclick="openModal('${m.id}')">
    <div class="leader-img-wrap">
      <img src="${getPhoto(m)}" alt="${escH(m.name)}" loading="lazy">
      <div class="leader-role-badge">${escH(m.role)}</div>
    </div>
    <div class="leader-info">
      <div class="leader-name">${escH(m.name)}</div>
      <div class="info-3col">
        <div class="i3-block"><div class="i3-icon">🎭</div><div class="i3-label">Role</div><div class="i3-val">${escH(m.role)}</div></div>
        <div class="i3-block"><div class="i3-icon">📚</div><div class="i3-label">Subject</div><div class="i3-val">${escH(m.subject)}</div></div>
        <div class="i3-block"><div class="i3-icon">🏫</div><div class="i3-label">Classes</div><div class="i3-val">${escH(m.classes)}</div></div>
      </div>
      <div class="edu-section">
        <div class="edu-label">🎓 Education & Qualifications</div>
        <ul class="edu-list">${eduHTML}</ul>
      </div>
      <button class="leader-detail-btn" onclick="event.stopPropagation();openModal('${m.id}')">View Full Profile <span>→</span></button>
    </div>
  </div>`;
}

function facultyCardHTML(m, delay) {
  return `
  <div class="faculty-card" onclick="openModal('${m.id}')" style="transition-delay:${delay}ms">
    <div class="faculty-img-wrap">
      <img src="${getPhoto(m)}" alt="${escH(m.name)}" loading="lazy">
      <div class="subject-tag">${escH(m.subject)}</div>
    </div>
    <div class="faculty-info">
      <div class="faculty-name">${escH(m.name)}</div>
      <div class="fac-3row">
        <div class="f3-row"><span class="f3-icon">🎭</span><div class="f3-content"><span class="f3-lbl">Role</span><span class="f3-val">${escH(m.role)}</span></div></div>
        <div class="f3-row"><span class="f3-icon">🎓</span><div class="f3-content"><span class="f3-lbl">Education</span><span class="f3-val">${escH((m.education||[''])[0])}</span></div></div>
        <div class="f3-row"><span class="f3-icon">🏫</span><div class="f3-content"><span class="f3-lbl">Classes</span><span class="f3-val">${escH(m.classes)}</span></div></div>
      </div>
      <button class="faculty-view-btn" onclick="event.stopPropagation();openModal('${m.id}')">Full Profile</button>
    </div>
  </div>`;
}

/* ═══════════════════════════════════════════════════════
   RENDER ALL
═══════════════════════════════════════════════════════ */
function renderAll(filter = 'all') {
  activeFilter = filter;
  const total = allStaff.length;
  const el = document.getElementById('stat-total');
  if (el) el.textContent = total + '+';

  // Leaders
  const leaders = allStaff.filter(m => m.category === 'leadership');
  const lg = document.getElementById('leadershipGrid');
  if (lg) lg.innerHTML = leaders.length
    ? leaders.map(leaderCardHTML).join('')
    : '<p style="color:var(--text-light);text-align:center;padding:20px 0;">Koi leadership member nahi hai abhi.</p>';

  // Faculty
  const pool = allStaff.filter(m => m.category !== 'leadership');
  const list = filter === 'all' ? pool : pool.filter(m => m.category === filter);
  const grid = document.getElementById('facultyGrid');
  const noR  = document.getElementById('noResults');
  if (!list.length) { if (grid) grid.innerHTML = ''; if (noR) noR.style.display = 'block'; return; }
  if (noR) noR.style.display = 'none';
  if (grid) {
    grid.innerHTML = list.map((m,i) => facultyCardHTML(m,(i%8)*55)).join('');
    requestAnimationFrame(() => {
      document.querySelectorAll('.faculty-card').forEach((c,i) =>
        setTimeout(() => c.classList.add('visible'), i*55));
    });
  }
}

/* ═══════════════════════════════════════════════════════
   DETAIL MODAL
═══════════════════════════════════════════════════════ */
window.openModal = function(id) {
  const m = allStaff.find(s => s.id === id);
  if (!m) return;
  const eduHTML = (m.education||[]).map(e=>`<li>${escH(e)}</li>`).join('');
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-top" style="background:linear-gradient(135deg,${m.colors[0]},${m.colors[1]})">
      <img class="modal-avatar" src="${getPhoto(m)}" alt="${escH(m.name)}">
      <div class="modal-identity">
        <div class="modal-name">${escH(m.name)}</div>
        <div class="modal-role-tag">${escH(m.role)}</div>
        <div class="modal-exp">${escH(m.experience||'')} Experience</div>
      </div>
    </div>
    <div class="modal-body">
      <div class="modal-3grid">
        <div class="m3-block"><div class="m3-icon">🎭</div><div class="m3-label">Role</div><div class="m3-val">${escH(m.role)}</div></div>
        <div class="m3-block"><div class="m3-icon">📚</div><div class="m3-label">Subject</div><div class="m3-val">${escH(m.subject)}</div></div>
        <div class="m3-block"><div class="m3-icon">🏫</div><div class="m3-label">Classes</div><div class="m3-val">${escH(m.classes)}</div></div>
      </div>
      <div class="modal-detail-row">
        <div class="modal-icon">🎓</div>
        <div class="modal-detail-text"><strong>Education & Qualifications</strong><ul class="modal-edu-list">${eduHTML}</ul></div>
      </div>
      <div class="modal-detail-row">
        <div class="modal-icon">💬</div>
        <div class="modal-detail-text"><strong>About</strong><span>${escH(m.bio||'')}</span></div>
      </div>
    </div>`;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
};

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ═══════════════════════════════════════════════════════
   FILTERS
═══════════════════════════════════════════════════════ */
function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderAll(btn.dataset.filter);
      document.querySelector('.faculty-section')?.scrollIntoView({ behavior:'smooth', block:'start' });
    });
  });
}

/* ═══════════════════════════════════════════════════════
   PARTICLES + HEADER
═══════════════════════════════════════════════════════ */
function initParticles() {
  const c = document.getElementById('particles'); if (!c) return;
  for (let i=0;i<22;i++) {
    const p = document.createElement('div'); p.className = 'particle';
    const sz = Math.random()*60+12;
    p.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random()*100}%;animation-duration:${Math.random()*12+8}s;animation-delay:${Math.random()*-12}s;`;
    c.appendChild(p);
  }
}

function initHeader() {
  window.addEventListener('scroll', () => {
    const h = document.getElementById('main-header');
    if (h) h.style.boxShadow = window.scrollY>40 ? '0 4px 24px rgba(43,31,10,0.12)' : '0 2px 20px rgba(43,31,10,0.06)';
  });
  document.getElementById('hamburger')?.addEventListener('click', () => {
    document.getElementById('mobile-nav')?.classList.toggle('open');
  });
}

function initScrollAnimations() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold:0.08 });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
}

/* ═══════════════════════════════════════════════════════
   ADMIN — LOGIN / LOGOUT
═══════════════════════════════════════════════════════ */
function openAdminOverlay() {
  document.getElementById('adminOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (!adminLoggedIn) showAdminLogin(); else showAdminManager();
}
function closeAdminOverlay() {
  document.getElementById('adminOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
function showAdminLogin() {
  document.getElementById('adminLoginScreen').style.display = 'block';
  document.getElementById('adminManagerScreen').style.display = 'none';
  const p = document.getElementById('adminPwdInput');
  if (p) { p.value=''; setTimeout(()=>p.focus(),300); }
  const e = document.getElementById('adminErr'); if (e) e.textContent='';
}
function showAdminManager() {
  document.getElementById('adminLoginScreen').style.display = 'none';
  document.getElementById('adminManagerScreen').style.display = 'block';
  renderManageList();
}
function doAdminLogin() {
  const pwd = document.getElementById('adminPwdInput')?.value;
  if (pwd === ADMIN_PASSWORD) { adminLoggedIn = true; showAdminManager(); }
  else {
    const err = document.getElementById('adminErr');
    if (err) err.textContent = '❌ Galat password! Dobara try karein.';
    const inp = document.getElementById('adminPwdInput');
    if (inp) { inp.value=''; inp.focus(); }
  }
}

/* ═══════════════════════════════════════════════════════
   ADMIN TABS
═══════════════════════════════════════════════════════ */
function initAdminTabs() {
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      const which = tab.dataset.tab;
      document.getElementById('tabAdd').style.display    = which==='add'    ? 'block' : 'none';
      document.getElementById('tabManage').style.display = which==='manage' ? 'block' : 'none';
      if (which==='manage') renderManageList();
    });
  });
}

/* ═══════════════════════════════════════════════════════
   EDUCATION ROW HELPERS
═══════════════════════════════════════════════════════ */
window.addEduRow = function(containerId, value='') {
  const list = document.getElementById(containerId); if (!list) return;
  const row = document.createElement('div'); row.className = 'edu-input-row';
  row.innerHTML = `<input type="text" class="admin-input edu-item-input" placeholder="e.g. M.A. — BHU Varanasi" value="${escH(value)}">
    <button class="edu-remove-btn" onclick="removeEduRow(this)" tabindex="-1">✕</button>`;
  list.appendChild(row);
};
window.removeEduRow = function(btn) {
  const list = btn.closest('.edu-input-list');
  if (list && list.children.length > 1) btn.closest('.edu-input-row').remove();
  else showToast('Kam se kam ek qualification zaroori hai!', 'error');
};
function getEduValues(containerId) {
  return [...document.querySelectorAll(`#${containerId} .edu-item-input`)].map(i=>i.value.trim()).filter(Boolean);
}

/* ═══════════════════════════════════════════════════════
   COLOR PRESETS
═══════════════════════════════════════════════════════ */
function initColorPresets(c1Id, c2Id, scope) {
  const container = scope || document;
  container.querySelectorAll('.color-preset').forEach(p => {
    p.addEventListener('click', () => {
      container.querySelectorAll('.color-preset').forEach(x => x.classList.remove('selected'));
      p.classList.add('selected');
      const c1 = document.getElementById(c1Id); const c2 = document.getElementById(c2Id);
      if (c1) c1.value = p.dataset.c1; if (c2) c2.value = p.dataset.c2;
    });
  });
  container.querySelector('.color-preset')?.classList.add('selected');
}

/* ═══════════════════════════════════════════════════════
   PHOTO UPLOAD SETUP
═══════════════════════════════════════════════════════ */
function setupPhotoUpload(inputId, previewId, placeholderId) {
  const input = document.getElementById(inputId); if (!input) return;
  input.addEventListener('change', () => {
    const file = input.files[0]; if (!file) return;
    if (file.size > 3*1024*1024) { showToast('Photo 3MB se chhoti honi chahiye!', 'error'); input.value=''; return; }
    const reader = new FileReader();
    reader.onload = e => {
      const prev = document.getElementById(previewId);
      const ph   = document.getElementById(placeholderId);
      if (prev) { prev.src=e.target.result; prev.style.display='block'; }
      if (ph)   ph.style.display='none';
    };
    reader.readAsDataURL(file);
  });
}

/* ═══════════════════════════════════════════════════════
   CLEAR ADD FORM
═══════════════════════════════════════════════════════ */
function clearAddForm() {
  ['f-name','f-role','f-subject','f-classes','f-exp','f-bio'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value='';
  });
  document.getElementById('f-cat').value='science';
  document.getElementById('f-c1').value='#6b3a0a';
  document.getElementById('f-c2').value='#c9973a';
  const pi=document.getElementById('photoInput'); if(pi) pi.value='';
  const pp=document.getElementById('photoPreview'); if(pp) pp.style.display='none';
  const pph=document.getElementById('photoPlaceholder'); if(pph) pph.style.display='flex';
  const list=document.getElementById('eduInputList');
  if(list){ list.innerHTML=''; addEduRow('eduInputList'); }
  document.querySelectorAll('#tabAdd .color-preset').forEach(p=>p.classList.remove('selected'));
  document.querySelector('#tabAdd .color-preset')?.classList.add('selected');
}

/* ═══════════════════════════════════════════════════════
   ADD MEMBER
═══════════════════════════════════════════════════════ */
async function doAddMember() {
  const name    = document.getElementById('f-name')?.value.trim();
  const role    = document.getElementById('f-role')?.value.trim();
  const subject = document.getElementById('f-subject')?.value.trim();
  const cat     = document.getElementById('f-cat')?.value;
  if (!name || !role || !subject || !cat) {
    showToast('Name, Role, Subject aur Category zaroori hain!', 'error'); return;
  }

  const btn = document.getElementById('addMemberBtn');
  btn.disabled=true; btn.textContent='⏳ Saving...';

  const photoFile = document.getElementById('photoInput')?.files[0] || null;
  const data = {
    category: cat, name, role, subject,
    classes:    document.getElementById('f-classes')?.value.trim()||'',
    experience: document.getElementById('f-exp')?.value.trim()||'',
    bio:        document.getElementById('f-bio')?.value.trim()||'',
    education:  getEduValues('eduInputList'),
    colors: [document.getElementById('f-c1')?.value||'#6b3a0a', document.getElementById('f-c2')?.value||'#c9973a'],
    photo: '',
  };

  const ok = await addMemberToFirestore(data, photoFile);
  if (ok) {
    showToast(`✅ ${name} add ho gaye!`);
    clearAddForm();
  } else {
    showToast('❌ Error! Dobara try karein.', 'error');
  }
  btn.disabled=false;
  btn.innerHTML=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Save Member`;
}

/* ═══════════════════════════════════════════════════════
   MANAGE LIST
═══════════════════════════════════════════════════════ */
function renderManageList(filterCat='all') {
  let list = allStaff;
  if (filterCat !== 'all') list = list.filter(m => m.category === filterCat);
  const el  = document.getElementById('adminMemberList');
  const cnt = document.getElementById('manageCount');
  if (cnt) cnt.textContent = list.length + ' members';
  if (!el) return;
  if (!list.length) { el.innerHTML='<p style="text-align:center;color:var(--text-light);padding:32px;">Koi member nahi mila.</p>'; return; }
  el.innerHTML = list.map(m=>`
    <div class="admin-member-row">
      <img class="amr-avatar" src="${getPhoto(m)}" alt="${escH(m.name)}">
      <div class="amr-info">
        <div class="amr-name">${escH(m.name)}</div>
        <div class="amr-meta">${escH(m.role)} · ${escH(CAT_LABELS[m.category]||m.category)}</div>
      </div>
      <div class="amr-actions">
        <button class="amr-edit-btn" onclick="openEditModal('${m.id}')">✏️ Edit</button>
        <button class="amr-del-btn" onclick="deleteMemberFromFirestore('${m.id}','${escH(m.name)}')">🗑 Delete</button>
      </div>
    </div>
  `).join('');
}

// Make delete accessible globally (called from innerHTML)
window.deleteMemberFromFirestore = deleteMemberFromFirestore;

/* ═══════════════════════════════════════════════════════
   EDIT MODAL
═══════════════════════════════════════════════════════ */
window.openEditModal = function(id) {
  const m = allStaff.find(s => s.id === id);
  if (!m) return;

  const eduRows = (m.education||['']).map(e=>`
    <div class="edu-input-row">
      <input type="text" class="admin-input edu-item-input" value="${escH(e)}">
      <button class="edu-remove-btn" onclick="removeEduRow(this)" tabindex="-1">✕</button>
    </div>`).join('');

  const colorOpts = [
    ['#6b3a0a','#c9973a'],['#1a3a5c','#2e7bc4'],['#2c5f2e','#5a9e5d'],
    ['#5c1a1a','#c44b4b'],['#3a1a5c','#7b4bc4'],['#5c1a3a','#b84b8e'],
    ['#3d3d1a','#9e9e4b'],['#1a4a5c','#4b9ec4']
  ].map(([c1,c2])=>
    `<div class="color-preset${m.colors[0]===c1?' selected':''}" data-c1="${c1}" data-c2="${c2}" style="background:linear-gradient(135deg,${c1},${c2})"></div>`
  ).join('');

  document.getElementById('editFormScroll').innerHTML = `
    <div class="admin-photo-section">
      <div class="photo-preview-wrap">
        <div class="photo-placeholder" id="editPhotoPlaceholder" style="display:${m.photo?'none':'flex'}">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <span>Photo</span>
        </div>
        <img id="editPhotoPreview" src="${m.photo||''}" alt="" style="display:${m.photo?'block':'none'};width:100%;height:100%;object-fit:cover;">
      </div>
      <div>
        <label class="photo-upload-btn" for="editPhotoInput">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Change Photo
        </label>
        <input type="file" id="editPhotoInput" accept="image/*" style="display:none;">
        <p class="photo-hint">New photo choose karein (Firebase Storage mein save hogi)</p>
      </div>
    </div>
    <div class="admin-form-grid">
      <div class="admin-field"><label>Full Name *</label><input type="text" id="ef-name" class="admin-input" value="${escH(m.name)}"></div>
      <div class="admin-field"><label>Role *</label><input type="text" id="ef-role" class="admin-input" value="${escH(m.role)}"></div>
      <div class="admin-field"><label>Subject *</label><input type="text" id="ef-subject" class="admin-input" value="${escH(m.subject)}"></div>
      <div class="admin-field"><label>Classes</label><input type="text" id="ef-classes" class="admin-input" value="${escH(m.classes)}"></div>
      <div class="admin-field"><label>Experience</label><input type="text" id="ef-exp" class="admin-input" value="${escH(m.experience||'')}"></div>
      <div class="admin-field"><label>Category *</label>
        <select id="ef-cat" class="admin-input admin-select">
          ${['leadership','science','arts','primary','admin'].map(c=>
            `<option value="${c}"${m.category===c?' selected':''}>${CAT_LABELS[c]}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="admin-field full-width">
      <label>Education & Qualifications</label>
      <div class="edu-input-list" id="editEduList">${eduRows}</div>
      <button class="edu-add-btn" onclick="addEduRow('editEduList')">+ Add Another Qualification</button>
    </div>
    <div class="admin-field full-width" style="margin-top:14px;">
      <label>Bio / About</label>
      <textarea id="ef-bio" class="admin-input admin-textarea" rows="4">${escH(m.bio||'')}</textarea>
    </div>
    <div class="admin-field full-width" style="margin-top:14px;">
      <label>Theme Color</label>
      <div class="color-picker-row">${colorOpts}</div>
      <input type="hidden" id="ef-c1" value="${m.colors[0]}">
      <input type="hidden" id="ef-c2" value="${m.colors[1]}">
    </div>
    <div class="admin-form-actions" style="margin-top:20px;">
      <button class="admin-btn-primary" id="editSaveBtn" onclick="doSaveEdit('${m.id}')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        Save Changes
      </button>
      <button class="admin-btn-secondary" onclick="closeEditModal()">Cancel</button>
    </div>`;

  // Color preset events
  const editScroll = document.getElementById('editFormScroll');
  editScroll.querySelectorAll('.color-preset').forEach(p => {
    p.addEventListener('click', () => {
      editScroll.querySelectorAll('.color-preset').forEach(x=>x.classList.remove('selected'));
      p.classList.add('selected');
      document.getElementById('ef-c1').value = p.dataset.c1;
      document.getElementById('ef-c2').value = p.dataset.c2;
    });
  });

  setupPhotoUpload('editPhotoInput','editPhotoPreview','editPhotoPlaceholder');
  document.getElementById('editOverlay').classList.add('open');
};

window.closeEditModal = function() {
  document.getElementById('editOverlay').classList.remove('open');
};

window.doSaveEdit = async function(id) {
  const name    = document.getElementById('ef-name')?.value.trim();
  const role    = document.getElementById('ef-role')?.value.trim();
  const subject = document.getElementById('ef-subject')?.value.trim();
  if (!name || !role || !subject) { showToast('Name, Role, Subject zaroori hain!', 'error'); return; }

  const btn = document.getElementById('editSaveBtn');
  btn.disabled=true; btn.textContent='⏳ Saving...';

  const photoFile = document.getElementById('editPhotoInput')?.files[0]||null;
  const oldMember = allStaff.find(s=>s.id===id)||{};

  const data = {
    name, role, subject,
    classes:    document.getElementById('ef-classes')?.value.trim()||'',
    experience: document.getElementById('ef-exp')?.value.trim()||'',
    bio:        document.getElementById('ef-bio')?.value.trim()||'',
    category:   document.getElementById('ef-cat')?.value||'science',
    education:  getEduValues('editEduList'),
    colors: [document.getElementById('ef-c1')?.value||'#6b3a0a', document.getElementById('ef-c2')?.value||'#c9973a'],
    photo: oldMember.photo||'',
  };

  const ok = await updateMemberInFirestore(id, data, photoFile);
  if (ok) {
    showToast(`✅ ${name} update ho gaye!`);
    closeEditModal();
    renderManageList(document.getElementById('manageFilterCat')?.value||'all');
  } else {
    showToast('❌ Update nahi hua. Dobara try karein.', 'error');
  }
  btn.disabled=false;
  btn.innerHTML=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Save Changes`;
};

/* ═══════════════════════════════════════════════════════
   INJECT REQUIRED STYLES
═══════════════════════════════════════════════════════ */
function injectStyles() {
  if (document.getElementById('team-extra-styles')) return;
  const s = document.createElement('style');
  s.id = 'team-extra-styles';
  s.textContent = `
    .tl-spin { width:48px;height:48px;border:4px solid rgba(201,151,58,0.2);border-top-color:#c9973a;border-radius:50%;animation:tl-rotate 0.9s linear infinite; }
    @keyframes tl-rotate { to { transform:rotate(360deg); } }
    .toast { position:fixed;bottom:90px;right:28px;z-index:9999;background:linear-gradient(135deg,#2b1f0a,#3d2e10);color:#fff;padding:14px 22px;border-radius:14px;font-size:14px;font-weight:500;box-shadow:0 8px 32px rgba(0,0,0,0.3);border-left:4px solid #c9973a;animation:toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;max-width:300px;font-family:'DM Sans',sans-serif; }
    .toast-success { border-left-color:#27ae60; }
    .toast-error   { border-left-color:#c0392b; }
    .toast-info    { border-left-color:#3498db; }
    @keyframes toastIn  { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
    @keyframes toastOut { from{opacity:1} to{opacity:0;transform:translateX(40px)} }
  `;
  document.head.appendChild(s);
}

/* ═══════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  injectStyles();
  initParticles();
  initHeader();
  initFilters();
  initScrollAnimations();
  initAdminTabs();
  initColorPresets('f-c1','f-c2');
  setupPhotoUpload('photoInput','photoPreview','photoPlaceholder');

  // Add edu btn
  document.getElementById('eduAddBtn')?.addEventListener('click', () => addEduRow('eduInputList'));

  // Detail modal
  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('modalOverlay')?.addEventListener('click', e => {
    if (e.target===document.getElementById('modalOverlay')) closeModal();
  });

  // Admin open/close
  document.getElementById('adminFloatBtn')?.addEventListener('click', openAdminOverlay);
  document.getElementById('adminClose')?.addEventListener('click', closeAdminOverlay);
  document.getElementById('adminOverlay')?.addEventListener('click', e => {
    if (e.target===document.getElementById('adminOverlay')) closeAdminOverlay();
  });

  // Login
  document.getElementById('adminLoginBtn')?.addEventListener('click', doAdminLogin);
  document.getElementById('adminPwdInput')?.addEventListener('keydown', e => { if (e.key==='Enter') doAdminLogin(); });

  // Logout
  document.getElementById('adminLogoutBtn')?.addEventListener('click', () => { adminLoggedIn=false; showAdminLogin(); });

  // Add
  document.getElementById('addMemberBtn')?.addEventListener('click', doAddMember);
  document.getElementById('clearFormBtn')?.addEventListener('click', clearAddForm);

  // Manage filter
  document.getElementById('manageFilterCat')?.addEventListener('change', e => renderManageList(e.target.value));

  // Edit modal close
  document.getElementById('editClose')?.addEventListener('click', closeEditModal);
  document.getElementById('editOverlay')?.addEventListener('click', e => {
    if (e.target===document.getElementById('editOverlay')) closeEditModal();
  });

  // Escape
  document.addEventListener('keydown', e => {
    if (e.key==='Escape') { closeModal(); closeAdminOverlay(); closeEditModal(); }
  });

  // Start Firebase
  await seedDefaultIfEmpty(); // seed only if empty
  startRealtimeListener();    // real-time updates
});
