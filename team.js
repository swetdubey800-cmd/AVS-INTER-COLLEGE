/* ============================================================
   TEAM.JS — AVS Inter College | 30 Staff Members
   3 real leaders (Vinod Kumar Singh, Vinay Kumar Singh, Ashish Kumar Singh)
   + 27 supporting faculty/staff
   ============================================================ */

/* ── SVG Avatar Generator ── */
function avatarSVG(name, bg1, bg2) {
  const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>
    <defs>
      <linearGradient id='g${initials}' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' stop-color='${bg1}'/>
        <stop offset='100%' stop-color='${bg2}'/>
      </linearGradient>
      <pattern id='pd${initials}' width='18' height='18' patternUnits='userSpaceOnUse'>
        <circle cx='2' cy='2' r='1.2' fill='rgba(255,255,255,0.07)'/>
      </pattern>
    </defs>
    <rect width='300' height='300' fill='url(#g${initials})'/>
    <rect width='300' height='300' fill='url(#pd${initials})'/>
    <circle cx='150' cy='110' r='60' fill='rgba(255,255,255,0.10)'/>
    <circle cx='150' cy='110' r='48' fill='rgba(255,255,255,0.09)'/>
    <text x='150' y='128' dominant-baseline='middle' text-anchor='middle'
      font-family='Georgia,serif' font-size='44' font-weight='bold'
      fill='rgba(255,255,255,0.96)'>${initials}</text>
    <ellipse cx='150' cy='265' rx='80' ry='38' fill='rgba(255,255,255,0.08)'/>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/* ══════════════════════════════════════════════════════════
   STAFF DATA  ← Edit name / role / subject / classes /
                  education / experience / bio / colors
                  Replace getAvatar(m) with real photo path later
   ══════════════════════════════════════════════════════════ */
const STAFF = [

  /* ───────── LEADERSHIP ───────── */
  {
    id: 1, category: 'leadership',
    name: 'Shri Vinod Kumar Singh',
    role: 'Founder',
    subject: 'Mathematics',
    classes: 'Class 6 – 12',
    education: [
      'M.Sc. (Mathematics) — Banaras Hindu University',
      'B.Ed. — Lucknow University',
      'LL.B. — Allahabad University',
    ],
    experience: '30+ Years',
    bio: 'Shri Vinod Kumar Singh founded AVS Inter College in 1995 with a mission to bring quality education to rural Jaunpur. A dedicated Mathematics teacher, he personally teaches senior classes and has shaped the institution\'s vision for over three decades.',
    colors: ['#6b3a0a', '#c9973a'],
  },
  {
    id: 2, category: 'leadership',
    name: 'Shri Vinay Kumar Singh',
    role: 'Principal',
    subject: 'Academic Leadership',
    classes: 'All Classes',
    education: [
      'M.A. (Education) — Allahabad University',
      'B.Ed. — Lucknow University',
      'CTET Qualified',
    ],
    experience: '22 Years',
    bio: 'Shri Vinay Kumar Singh leads AVS Inter College with integrity and deep commitment to student welfare. Under his principalship the college has achieved outstanding UP Board results and significant growth year on year.',
    colors: ['#1a3a5c', '#2e7bc4'],
  },
  {
    id: 3, category: 'leadership',
    name: 'Shri Ashish Kumar Singh',
    role: 'Director',
    subject: 'Physics',
    classes: 'Class 9 – 12',
    education: [
      'M.Sc. (Physics) — Banaras Hindu University',
      'B.Ed. — Allahabad University',
      'NET Qualified — CSIR',
    ],
    experience: '18 Years',
    bio: 'Shri Ashish Kumar Singh oversees the strategic direction and academic standards of AVS Inter College. A distinguished Physics educator, he combines administrative excellence with hands-on classroom teaching.',
    colors: ['#2c5f2e', '#5a9e5d'],
  },

  /* ───────── SCIENCE FACULTY ───────── */
  {
    id: 4, category: 'science',
    name: 'Mr. Suresh Kumar Mishra',
    role: 'Senior Lecturer',
    subject: 'Physics',
    classes: 'Class 9 – 12',
    education: [
      'M.Sc. (Physics) — Allahabad University',
      'B.Ed. — VBSPU Jaunpur',
      'UPTET Qualified',
    ],
    experience: '14 Years',
    bio: 'Mr. Suresh Mishra is celebrated for breaking complex Physics topics into simple, relatable ideas. His practical-oriented teaching produces consistent board toppers.',
    colors: ['#1a3a5c', '#4a8fc4'],
  },
  {
    id: 5, category: 'science',
    name: 'Mrs. Rekha Gupta',
    role: 'Senior Lecturer',
    subject: 'Chemistry',
    classes: 'Class 9 – 12',
    education: [
      'M.Sc. (Chemistry) — BHU Varanasi',
      'B.Ed. — Lucknow University',
    ],
    experience: '12 Years',
    bio: 'Mrs. Rekha Gupta heads the Chemistry laboratory and makes chemical reactions come alive through demonstration-based teaching and hands-on experiments.',
    colors: ['#5c3a1a', '#c48b4b'],
  },
  {
    id: 6, category: 'science',
    name: 'Mr. Ashok Kumar Pandey',
    role: 'Lecturer',
    subject: 'Biology',
    classes: 'Class 9 – 12',
    education: [
      'M.Sc. (Botany) — Gorakhpur University',
      'B.Ed. — VBSPU Jaunpur',
    ],
    experience: '9 Years',
    bio: 'Mr. Ashok Pandey teaches Biology with emphasis on diagrams, lab work and conceptual depth. His students consistently rank among top scorers in board exams.',
    colors: ['#2c5f2e', '#5a9e5d'],
  },
  {
    id: 7, category: 'science',
    name: 'Mr. Devendra Kumar Singh',
    role: 'Senior Lecturer',
    subject: 'Mathematics',
    classes: 'Class 6 – 12',
    education: [
      'M.Sc. (Mathematics) — Allahabad University',
      'B.Ed. — VBSPU Jaunpur',
      'UPTET Qualified',
    ],
    experience: '16 Years',
    bio: 'Mr. Devendra Singh is the cornerstone of the Maths department. His step-by-step approach and dedicated doubt sessions have earned him immense popularity among students.',
    colors: ['#3a1a5c', '#7b4bc4'],
  },
  {
    id: 8, category: 'science',
    name: 'Mrs. Sunita Verma',
    role: 'Lecturer',
    subject: 'Mathematics',
    classes: 'Class 6 – 10',
    education: [
      'M.Sc. (Mathematics) — BHU Varanasi',
      'B.Ed., CTET Qualified',
    ],
    experience: '8 Years',
    bio: 'Mrs. Sunita Verma makes Mathematics enjoyable through interactive activities and visual methods, especially for middle and high school students.',
    colors: ['#5c1a1a', '#c44b4b'],
  },
  {
    id: 9, category: 'science',
    name: 'Mr. Rajeev Srivastava',
    role: 'Lecturer',
    subject: 'Computer Science',
    classes: 'Class 6 – 12',
    education: [
      'MCA — IGNOU New Delhi',
      'B.Ed. — Lucknow University',
    ],
    experience: '10 Years',
    bio: 'Mr. Rajeev Srivastava heads the Computer Lab. He teaches programming fundamentals, MS Office and digital literacy, bringing modern skills to every student.',
    colors: ['#1a4a5c', '#4b9ec4'],
  },
  {
    id: 10, category: 'science',
    name: 'Mr. Kuldeep Soni',
    role: 'Lecturer',
    subject: 'General Science',
    classes: 'Class 6 – 8',
    education: [
      'B.Sc. (PCM) — VBSPU Jaunpur',
      'B.Ed., UPTET Qualified',
    ],
    experience: '7 Years',
    bio: 'Mr. Kuldeep Soni builds strong science foundations in middle school students through experiments, models and activity-based learning.',
    colors: ['#3a1a5c', '#7b4bc4'],
  },
  {
    id: 11, category: 'science',
    name: 'Mrs. Nisha Yadav',
    role: 'Lecturer',
    subject: 'Biology',
    classes: 'Class 6 – 10',
    education: [
      'M.Sc. (Zoology) — Gorakhpur University',
      'B.Ed. — VBSPU Jaunpur',
    ],
    experience: '6 Years',
    bio: 'Mrs. Nisha Yadav brings biology to life with charts, models and field-based learning. She also mentors students for competitive exams alongside board studies.',
    colors: ['#2c5f2e', '#5a9e5d'],
  },

  /* ───────── ARTS FACULTY ───────── */
  {
    id: 12, category: 'arts',
    name: 'Mr. Shyam Narayan Tripathi',
    role: 'Senior Lecturer',
    subject: 'Hindi',
    classes: 'Class 6 – 12',
    education: [
      'M.A. (Hindi) — Allahabad University',
      'B.Ed., NET Qualified',
      'Sahitya Ratna — UP Government',
    ],
    experience: '18 Years',
    bio: 'Mr. Tripathi is a celebrated Hindi educator and accomplished poet. His classes blend literary depth with grammar precision, producing outstanding board results year after year.',
    colors: ['#5c1a1a', '#c44b4b'],
  },
  {
    id: 13, category: 'arts',
    name: 'Mrs. Meera Shukla',
    role: 'Lecturer',
    subject: 'English',
    classes: 'Class 6 – 12',
    education: [
      'M.A. (English) — BHU Varanasi',
      'B.Ed. — Lucknow University',
    ],
    experience: '11 Years',
    bio: 'Mrs. Meera Shukla runs a special English communication programme for senior students, focusing on spoken fluency, essay writing and grammar mastery.',
    colors: ['#1a3a5c', '#2e7bc4'],
  },
  {
    id: 14, category: 'arts',
    name: 'Mr. Ramakant Dubey',
    role: 'Lecturer',
    subject: 'History & Civics',
    classes: 'Class 9 – 12',
    education: [
      'M.A. (History) — Allahabad University',
      'B.Ed. — VBSPU Jaunpur',
    ],
    experience: '13 Years',
    bio: 'Mr. Ramakant Dubey brings history alive through storytelling, timelines and contextual analysis. His students consistently excel in Social Science board examinations.',
    colors: ['#3d3d1a', '#9e9e4b'],
  },
  {
    id: 15, category: 'arts',
    name: 'Mrs. Kavita Rai',
    role: 'Lecturer',
    subject: 'Geography',
    classes: 'Class 9 – 12',
    education: [
      'M.A. (Geography) — Gorakhpur University',
      'B.Ed. — VBSPU Jaunpur',
    ],
    experience: '9 Years',
    bio: 'Mrs. Kavita Rai uses maps, models and educational trips to make Geography engaging and relatable for senior secondary students.',
    colors: ['#2c5f2e', '#5a9e5d'],
  },
  {
    id: 16, category: 'arts',
    name: 'Mr. Umesh Chandra Yadav',
    role: 'Lecturer',
    subject: 'Economics',
    classes: 'Class 11 – 12',
    education: [
      'M.A. (Economics) — Allahabad University',
      'B.Ed., NET Qualified',
    ],
    experience: '7 Years',
    bio: 'Mr. Umesh Chandra Yadav explains economic principles through real-world examples and case studies, making Intermediate Economics highly relatable.',
    colors: ['#5c3a1a', '#c48b4b'],
  },
  {
    id: 17, category: 'arts',
    name: 'Mrs. Anita Pathak',
    role: 'Senior Lecturer',
    subject: 'Sanskrit',
    classes: 'Class 6 – 10',
    education: [
      'M.A. (Sanskrit) — BHU Varanasi',
      'B.Ed. — Lucknow University',
      'Sahitya Ratna — Sanskrit Parishad',
    ],
    experience: '20 Years',
    bio: 'Mrs. Anita Pathak blends classical texts with practical grammar. The most senior language faculty member, her students achieve exceptional scores in Sanskrit board exams.',
    colors: ['#5c1a3a', '#b84b8e'],
  },
  {
    id: 18, category: 'arts',
    name: 'Mr. Vinay Kumar Gupta',
    role: 'Lecturer',
    subject: 'Social Science',
    classes: 'Class 6 – 8',
    education: [
      'M.A. (Political Science) — Allahabad University',
      'B.Ed., UPTET Qualified',
    ],
    experience: '8 Years',
    bio: 'Mr. Vinay Kumar Gupta instils civic sense through debates, discussions and community projects, making Social Science genuinely impactful for junior students.',
    colors: ['#3a1a5c', '#7b4bc4'],
  },
  {
    id: 19, category: 'arts',
    name: 'Mr. Pramod Kumar Chauhan',
    role: 'Lecturer',
    subject: 'Fine Arts & Drawing',
    classes: 'Class 1 – 10',
    education: [
      'B.F.A. — Banaras Hindu University',
      'B.Ed. — VBSPU Jaunpur',
    ],
    experience: '14 Years',
    bio: 'Mr. Pramod Kumar Chauhan nurtures creativity through art exhibitions and competitions. His students have won multiple district-level and state-level awards.',
    colors: ['#5c1a1a', '#c44b4b'],
  },

  /* ───────── PRIMARY FACULTY ───────── */
  {
    id: 20, category: 'primary',
    name: 'Mrs. Savita Dubey',
    role: 'Primary Teacher',
    subject: 'All Subjects',
    classes: 'Class 1 – 2',
    education: [
      'B.A. — VBSPU Jaunpur',
      'D.El.Ed., CTET Qualified',
    ],
    experience: '10 Years',
    bio: 'Mrs. Savita Dubey specialises in early childhood education. Her play-based methods create a joyful and effective learning environment for youngest students.',
    colors: ['#5c1a3a', '#b84b8e'],
  },
  {
    id: 21, category: 'primary',
    name: 'Mrs. Rina Singh',
    role: 'Primary Teacher',
    subject: 'Science & Maths',
    classes: 'Class 3 – 4',
    education: [
      'B.Sc. — VBSPU Jaunpur',
      'D.El.Ed., CTET Qualified',
    ],
    experience: '8 Years',
    bio: 'Mrs. Rina Singh fosters curiosity and logical thinking through hands-on science activities and interactive math games for primary students.',
    colors: ['#1a4a5c', '#4b9ec4'],
  },
  {
    id: 22, category: 'primary',
    name: 'Mr. Prakash Tiwari',
    role: 'Primary Teacher',
    subject: 'Hindi & English',
    classes: 'Class 5',
    education: [
      'B.A. — Allahabad University',
      'B.Ed., UPTET Qualified',
    ],
    experience: '6 Years',
    bio: 'Mr. Prakash Tiwari bridges the gap between primary and middle school, ensuring students have strong language foundations before entering Class 6.',
    colors: ['#3d3d1a', '#9e9e4b'],
  },
  {
    id: 23, category: 'primary',
    name: 'Mrs. Pooja Mishra',
    role: 'Kindergarten Teacher',
    subject: 'Play-based Learning',
    classes: 'KG / Nursery',
    education: [
      'B.A. — VBSPU Jaunpur',
      'NTT, Montessori Certified',
    ],
    experience: '7 Years',
    bio: 'Mrs. Pooja Mishra is a certified Montessori educator who creates stimulating, nurturing environments for the college\'s youngest learners.',
    colors: ['#5c1a3a', '#b84b8e'],
  },
  {
    id: 24, category: 'primary',
    name: 'Mrs. Geeta Rani',
    role: 'Kindergarten Teacher',
    subject: 'Play-based Learning',
    classes: 'KG / Nursery',
    education: [
      'B.A. — Gorakhpur University',
      'NTT, CTET Qualified',
    ],
    experience: '9 Years',
    bio: 'Mrs. Geeta Rani designs engaging activities to develop motor and cognitive skills in young children, making early learning truly joyful and memorable.',
    colors: ['#2c5f2e', '#5a9e5d'],
  },
  {
    id: 25, category: 'primary',
    name: 'Mr. Sunil Kumar',
    role: 'Primary Teacher',
    subject: 'Hindi & EVS',
    classes: 'Class 1 – 3',
    education: [
      'B.A. — VBSPU Jaunpur',
      'D.El.Ed. Qualified',
    ],
    experience: '5 Years',
    bio: 'Mr. Sunil Kumar uses storytelling, rhymes and visual aids to make Hindi and Environmental Science engaging for junior primary students.',
    colors: ['#3a1a5c', '#7b4bc4'],
  },

  /* ───────── ADMINISTRATION ───────── */
  {
    id: 26, category: 'admin',
    name: 'Mr. Ravi Shankar Pandey',
    role: 'Office Superintendent',
    subject: 'Administration',
    classes: 'Office',
    education: [
      'B.Com. — VBSPU Jaunpur',
      'PGDCA — IGNOU',
    ],
    experience: '15 Years',
    bio: 'Mr. Ravi Shankar Pandey manages all administrative records, student enrollment and government correspondence with efficiency and precision.',
    colors: ['#5c3a1a', '#c48b4b'],
  },
  {
    id: 27, category: 'admin',
    name: 'Mrs. Seema Agarwal',
    role: 'Accounts Officer',
    subject: 'Finance & Accounts',
    classes: 'Office',
    education: [
      'M.Com. — Allahabad University',
      'CPA Certified',
    ],
    experience: '12 Years',
    bio: 'Mrs. Seema Agarwal oversees all financial transactions, fee collection, budgeting and annual audits for the institution.',
    colors: ['#1a4a5c', '#4b9ec4'],
  },
  {
    id: 28, category: 'admin',
    name: 'Mr. Ajay Shukla',
    role: 'Librarian',
    subject: 'Library & Information',
    classes: 'All Classes',
    education: [
      'M.Lib.Sc. — BHU Varanasi',
      'B.A. — VBSPU Jaunpur',
    ],
    experience: '10 Years',
    bio: 'Mr. Ajay Shukla manages a library of 5,000+ books and actively promotes reading culture and research habits among all students.',
    colors: ['#3d3d1a', '#9e9e4b'],
  },
  {
    id: 29, category: 'admin',
    name: 'Mr. Hemant Lal Yadav',
    role: 'Lab Technician',
    subject: 'Science Laboratory',
    classes: 'Class 9 – 12',
    education: [
      'B.Sc. — VBSPU Jaunpur',
      'DMLT Certified',
    ],
    experience: '8 Years',
    bio: 'Mr. Hemant Lal Yadav ensures the Science laboratory is fully equipped, safe and well-maintained for all practical sessions throughout the year.',
    colors: ['#2c5f2e', '#5a9e5d'],
  },
  {
    id: 30, category: 'admin',
    name: 'Mrs. Lata Tripathi',
    role: 'Counselor & Welfare Officer',
    subject: 'Student Counseling',
    classes: 'All Classes',
    education: [
      'M.A. (Psychology) — Allahabad University',
      'B.Ed. — Lucknow University',
    ],
    experience: '11 Years',
    bio: 'Mrs. Lata Tripathi provides emotional and academic counselling to students and coordinates all health, wellness and welfare activities across the college.',
    colors: ['#5c1a3a', '#b84b8e'],
  },
];

/* ══════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════ */

function getAvatar(m) {
  /* Replace with:  return m.photo || avatarSVG(m.name, m.colors[0], m.colors[1]);
     after adding photo paths to STAFF data */
  return avatarSVG(m.name, m.colors[0], m.colors[1]);
}

/* ══════════════════════════════════════════════════════
   LEADER CARD  (large, 3-info-section below photo)
   ══════════════════════════════════════════════════════ */
function leaderCardHTML(m) {
  const eduHTML = m.education.map(e => `<li>${e}</li>`).join('');
  return `
  <div class="leader-card" onclick="openModal(${m.id})">
    <div class="leader-img-wrap">
      <img src="${getAvatar(m)}" alt="${m.name}" loading="lazy">
      <div class="leader-role-badge">${m.role}</div>
    </div>
    <div class="leader-info">
      <div class="leader-name">${m.name}</div>

      <div class="info-3col">
        <div class="i3-block">
          <div class="i3-icon">🎭</div>
          <div class="i3-label">Role</div>
          <div class="i3-val">${m.role}</div>
        </div>
        <div class="i3-block">
          <div class="i3-icon">📚</div>
          <div class="i3-label">Subject</div>
          <div class="i3-val">${m.subject}</div>
        </div>
        <div class="i3-block">
          <div class="i3-icon">🏫</div>
          <div class="i3-label">Classes</div>
          <div class="i3-val">${m.classes}</div>
        </div>
      </div>

      <div class="edu-section">
        <div class="edu-label">🎓 Education & Qualification</div>
        <ul class="edu-list">${eduHTML}</ul>
      </div>

      <button class="leader-detail-btn" onclick="event.stopPropagation();openModal(${m.id})">
        View Full Profile <span>→</span>
      </button>
    </div>
  </div>`;
}

/* ══════════════════════════════════════════════════════
   FACULTY CARD  (compact, 3 info rows below photo)
   ══════════════════════════════════════════════════════ */
function facultyCardHTML(m, delay) {
  return `
  <div class="faculty-card" onclick="openModal(${m.id})" style="transition-delay:${delay}ms">
    <div class="faculty-img-wrap">
      <img src="${getAvatar(m)}" alt="${m.name}" loading="lazy">
      <div class="subject-tag">${m.subject}</div>
    </div>
    <div class="faculty-info">
      <div class="faculty-name">${m.name}</div>
      <div class="fac-3row">
        <div class="f3-row">
          <span class="f3-icon">🎭</span>
          <div class="f3-content">
            <span class="f3-lbl">Role</span>
            <span class="f3-val">${m.role}</span>
          </div>
        </div>
        <div class="f3-row">
          <span class="f3-icon">🎓</span>
          <div class="f3-content">
            <span class="f3-lbl">Education</span>
            <span class="f3-val">${m.education[0]}</span>
          </div>
        </div>
        <div class="f3-row">
          <span class="f3-icon">🏫</span>
          <div class="f3-content">
            <span class="f3-lbl">Classes</span>
            <span class="f3-val">${m.classes}</span>
          </div>
        </div>
      </div>
      <button class="faculty-view-btn" onclick="event.stopPropagation();openModal(${m.id})">Full Profile</button>
    </div>
  </div>`;
}

/* ══════════════════════════════════════════════════════
   RENDER
   ══════════════════════════════════════════════════════ */
function renderLeaders() {
  const leaders = STAFF.filter(m => m.category === 'leadership');
  document.getElementById('leadershipGrid').innerHTML = leaders.map(leaderCardHTML).join('');
}

function renderFaculty(filter = 'all') {
  const pool = STAFF.filter(m => m.category !== 'leadership');
  const list = filter === 'all' ? pool : pool.filter(m => m.category === filter);
  const grid = document.getElementById('facultyGrid');
  const noR  = document.getElementById('noResults');
  if (!list.length) { grid.innerHTML = ''; noR.style.display = 'block'; return; }
  noR.style.display = 'none';
  grid.innerHTML = list.map((m, i) => facultyCardHTML(m, (i % 8) * 55)).join('');
  requestAnimationFrame(() => {
    document.querySelectorAll('.faculty-card').forEach((c, i) =>
      setTimeout(() => c.classList.add('visible'), i * 55));
  });
}

/* ══════════════════════════════════════════════════════
   MODAL
   ══════════════════════════════════════════════════════ */
function openModal(id) {
  const m = STAFF.find(s => s.id === id);
  if (!m) return;
  const eduHTML = m.education.map(e => `<li>${e}</li>`).join('');
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-top" style="background:linear-gradient(135deg,${m.colors[0]},${m.colors[1]})">
      <img class="modal-avatar" src="${getAvatar(m)}" alt="${m.name}">
      <div class="modal-identity">
        <div class="modal-name">${m.name}</div>
        <div class="modal-role-tag">${m.role}</div>
        <div class="modal-exp">${m.experience} of Experience</div>
      </div>
    </div>
    <div class="modal-body">
      <div class="modal-3grid">
        <div class="m3-block">
          <div class="m3-icon">🎭</div>
          <div class="m3-label">Role</div>
          <div class="m3-val">${m.role}</div>
        </div>
        <div class="m3-block">
          <div class="m3-icon">📚</div>
          <div class="m3-label">Subject</div>
          <div class="m3-val">${m.subject}</div>
        </div>
        <div class="m3-block">
          <div class="m3-icon">🏫</div>
          <div class="m3-label">Classes</div>
          <div class="m3-val">${m.classes}</div>
        </div>
      </div>
      <div class="modal-detail-row">
        <div class="modal-icon">🎓</div>
        <div class="modal-detail-text">
          <strong>Education & Qualifications</strong>
          <ul class="modal-edu-list">${eduHTML}</ul>
        </div>
      </div>
      <div class="modal-detail-row">
        <div class="modal-icon">💬</div>
        <div class="modal-detail-text">
          <strong>About</strong>
          <span>${m.bio}</span>
        </div>
      </div>
    </div>`;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════════════════════
   FILTERS
   ══════════════════════════════════════════════════════ */
function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderFaculty(btn.dataset.filter);
      document.querySelector('.faculty-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ══════════════════════════════════════════════════════
   COUNTER ANIMATION
   ══════════════════════════════════════════════════════ */
function animateCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = +el.dataset.target;
    const label  = el.closest('.stat-item')?.querySelector('.stat-label')?.textContent || '';
    const suffix = label.includes('%') ? '%' : '+';
    let cur = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur + (cur === target ? suffix : '');
      if (cur >= target) clearInterval(t);
    }, 22);
  });
}

/* ══════════════════════════════════════════════════════
   SCROLL OBSERVER
   ══════════════════════════════════════════════════════ */
function initScrollAnimations() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        if (e.target.classList.contains('stats-strip')) animateCounters();
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-up, .stats-strip').forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════════════════
   PARTICLES
   ══════════════════════════════════════════════════════ */
function initParticles() {
  const c = document.getElementById('particles');
  if (!c) return;
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const sz = Math.random() * 60 + 12;
    p.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random()*100}%;animation-duration:${Math.random()*12+8}s;animation-delay:${Math.random()*-12}s;`;
    c.appendChild(p);
  }
}

/* ══════════════════════════════════════════════════════
   HEADER
   ══════════════════════════════════════════════════════ */
function initHeader() {
  window.addEventListener('scroll', () => {
    const h = document.getElementById('main-header');
    if (h) h.style.boxShadow = window.scrollY > 40 ? '0 4px 24px rgba(43,31,10,0.12)' : '0 2px 20px rgba(43,31,10,0.06)';
  });
  document.getElementById('hamburger')?.addEventListener('click', () => {
    document.getElementById('mobile-nav')?.classList.toggle('open');
  });
}

/* ══════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initHeader();
  renderLeaders();
  renderFaculty('all');
  initFilters();
  initScrollAnimations();

  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('modalOverlay')?.addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  document.querySelectorAll('.leadership-section .section-inner, .faculty-section .section-inner, .filter-section .section-inner')
    .forEach(el => el.classList.add('fade-up'));
});
