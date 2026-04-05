/* =============================================
   AVS INTER COLLEGE — CONTACT PAGE JS
   contact.js
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ==========================================
     1. HAMBURGER / MOBILE NAV
     ========================================== */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      mobileNav.classList.toggle('open');

      // Animate hamburger to X
      const spans = hamburger.querySelectorAll('span');
      if (mobileNav.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity  = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    // Close on nav link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  /* ==========================================
     2. STICKY HEADER SHADOW
     ========================================== */
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', function () {
    if (header) {
      header.style.boxShadow = window.scrollY > 10
        ? '0 4px 32px rgba(0,0,0,0.25)'
        : '0 2px 24px rgba(0,0,0,0.18)';
    }
  });

  /* ==========================================
     3. FADE-UP SCROLL ANIMATION
     ========================================== */
  const fadeEls = document.querySelectorAll('.fade-up');

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => observer.observe(el));

  /* ==========================================
     4. CONTACT FORM VALIDATION & SUBMIT
     ========================================== */
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');

  if (form) {
    // Real-time validation — clear error on input
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.addEventListener('input', function () {
        const fg = el.closest('.form-group');
        if (fg && fg.classList.contains('error')) {
          fg.classList.remove('error');
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Reset all errors
      form.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('error'));

      let valid = true;

      // Validate Name
      const nameVal = document.getElementById('name').value.trim();
      if (!nameVal || nameVal.length < 2) {
        document.getElementById('fg-name').classList.add('error');
        valid = false;
      }

      // Validate Phone
      const phoneVal = document.getElementById('phone').value.trim().replace(/\s/g, '');
      const phoneRegex = /^(\+91|0)?[6-9]\d{9}$/;
      if (!phoneVal || !phoneRegex.test(phoneVal)) {
        document.getElementById('fg-phone').classList.add('error');
        valid = false;
      }

      // Validate Email (optional but must be valid format if filled)
      const emailVal = document.getElementById('email').value.trim();
      if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        document.getElementById('fg-email').classList.add('error');
        valid = false;
      }

      // Validate Purpose
      const purposeVal = document.getElementById('purpose').value;
      if (!purposeVal) {
        document.getElementById('fg-purpose').classList.add('error');
        valid = false;
      }

      // Validate Message
      const messageVal = document.getElementById('message').value.trim();
      if (!messageVal || messageVal.length < 10) {
        document.getElementById('fg-message').classList.add('error');
        valid = false;
      }

      // Scroll to first error
      if (!valid) {
        const firstError = form.querySelector('.form-group.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        shakeButton(submitBtn);
        return;
      }

      // Simulate submission
      submitBtn.classList.add('loading');
      submitBtn.querySelector('.btn-text').textContent = 'Sending';
      submitBtn.disabled = true;

      setTimeout(function () {
        // Hide form fields, show success
        form.querySelectorAll('.form-group, .form-row, .btn-submit').forEach(el => {
          el.style.display = 'none';
        });
        successMsg.classList.add('show');
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1800);
    });
  }

  // Shake animation for invalid submit
  function shakeButton(btn) {
    btn.style.animation = 'shake 0.5s ease';
    btn.addEventListener('animationend', function () {
      btn.style.animation = '';
    }, { once: true });
  }

  // Inject shake keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-5px); }
      80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);

  /* ==========================================
     5. FAQ ACCORDION
     ========================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;

    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(fi => {
        fi.classList.remove('open');
        fi.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ==========================================
     6. QUICK CARD — ADDRESS GOOGLE MAPS LINK
     ========================================== */
  const addressCard = document.querySelector('.qc-address');
  if (addressCard) {
    addressCard.style.cursor = 'pointer';
    addressCard.addEventListener('click', function () {
      window.open('https://maps.google.com/?q=Bhagwanpur+Jaunpur+Uttar+Pradesh', '_blank', 'noopener');
    });
  }

  /* ==========================================
     7. PHONE NUMBER FORMATTING
     ========================================== */
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      // Strip everything except digits and +
      let val = this.value.replace(/[^\d+]/g, '');

      // Add +91 prefix hint
      if (val.length > 0 && !val.startsWith('+') && !val.startsWith('0')) {
        if (val.length <= 10) {
          // Leave as typed
        }
      }
      this.value = val;
    });
  }

  /* ==========================================
     8. SMOOTH SCROLL FOR ANCHOR LINKS
     ========================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerHeight = document.getElementById('main-header')?.offsetHeight || 70;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ==========================================
     9. STAGGERED CARD ANIMATION
     ========================================== */
  const quickCards = document.querySelectorAll('.quick-card');
  quickCards.forEach(function (card, i) {
    card.style.transitionDelay = (i * 0.08) + 's';
  });

  /* ==========================================
     10. ACTIVE NAV LINK HIGHLIGHT
     ========================================== */
  const currentPath = window.location.pathname;
  document.querySelectorAll('nav a, .mobile-nav a').forEach(function (link) {
    if (currentPath.includes('contact') && link.href.includes('contact')) {
      link.classList.add('active');
    }
  });

});
// ================= EMAILJS ADD-ON (PASTE AT END) =================

// init emailjs
emailjs.init("UPi1opso9cEMTjoeA");

// override form submit
const form = document.getElementById('contactForm');

if (form) {

  form.addEventListener('submit', function (e) {

    // ⚠️ stop old submit logic
    e.stopImmediatePropagation();

    e.preventDefault();

    const submitBtn  = document.getElementById('submitBtn');
    const successMsg = document.getElementById('formSuccess');

    const nameVal = document.getElementById('name').value.trim();
    const phoneVal = document.getElementById('phone').value.trim();
    const emailVal = document.getElementById('email').value.trim();
    const purposeVal = document.getElementById('purpose').value;
    const messageVal = document.getElementById('message').value.trim();

    // basic validation (light)
    if (!nameVal || !phoneVal || !purposeVal || !messageVal) {
      return;
    }

    submitBtn.classList.add('loading');
    submitBtn.querySelector('.btn-text').textContent = 'Sending';
    submitBtn.disabled = true;

    emailjs.send("service_3fmamuh", "template_4k3x5bf", {
      name: nameVal,
      phone: phoneVal,
      email: emailVal,
      purpose: purposeVal,
      message: messageVal
    })
    .then(function () {

      form.querySelectorAll('.form-group, .form-row, .btn-submit').forEach(el => {
        el.style.display = 'none';
      });

      successMsg.classList.add('show');

    })
    .catch(function (error) {
      alert("Email failed");
      console.error(error);

      submitBtn.classList.remove('loading');
      submitBtn.querySelector('.btn-text').textContent = 'Send Message';
      submitBtn.disabled = false;
    });

  }, true); // ⚠️ capture mode = override
}