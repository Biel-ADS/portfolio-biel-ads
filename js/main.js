gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* preloader */
const preloader = document.getElementById('preloader');
const preloaderNum = document.getElementById('preloaderNum');
const counter = { val: 0 };

gsap.to(counter, {
  val: 100,
  duration: 1.8,
  ease: 'power2.inOut',
  onUpdate: () => { preloaderNum.textContent = Math.floor(counter.val); },
  onComplete: () => {
    gsap.to(preloader, {
      yPercent: -100,
      duration: 1,
      ease: 'power4.inOut',
      onComplete: () => { preloader.style.display = 'none'; }
    });
    playHeroReveal();
  }
});

/* custom cursor */
const cursor = document.getElementById('cursor');
let mouseX = 0, mouseY = 0, curX = 0, curY = 0;
window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
gsap.ticker.add(() => {
  curX += (mouseX - curX) * 0.18;
  curY += (mouseY - curY) * 0.18;
  gsap.set(cursor, { x: curX, y: curY });
});

document.querySelectorAll('.work-card').forEach((card) => {
  card.addEventListener('mouseenter', () => cursor.classList.add('hover-view'));
  card.addEventListener('mouseleave', () => cursor.classList.remove('hover-view'));
});
document.querySelectorAll('a, button').forEach((el) => {
  if (el.closest('.work-card')) return;
  el.addEventListener('mouseenter', () => cursor.classList.add('hover-link'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover-link'));
});

/* header hide on scroll down */
const header = document.getElementById('siteHeader');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (current > lastScroll && current > 200) header.classList.add('hide');
  else header.classList.remove('hide');
  lastScroll = current;
});

/* scroll progress bar */
const scrollProgress = document.getElementById('scrollProgress');
let progressTicking = false;
window.addEventListener('scroll', () => {
  if (progressTicking) return;
  progressTicking = true;
  requestAnimationFrame(() => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    progressTicking = false;
  });
});

/* hero reveal (triggered after preloader) */
function playHeroReveal() {
  const lines = document.querySelectorAll('.hero .reveal-line span');
  gsap.to(lines, {
    y: '0%',
    duration: 1.1,
    ease: 'power4.out',
    stagger: 0.08,
    delay: 0.1
  });
  gsap.fromTo('.hero-cta', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.7 });
}

/* generic scroll reveal for lines outside hero */
document.querySelectorAll('section:not(.hero) .reveal-line').forEach((line) => {
  gsap.to(line.querySelector('span'), {
    y: '0%',
    duration: 1,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: line,
      start: 'top 88%',
      toggleActions: 'play none none reverse'
    }
  });
});

/* work cards stagger reveal */
ScrollTrigger.batch('.work-card', {
  start: 'top 90%',
  onEnter: (els) => gsap.fromTo(els, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.12, overwrite: true }),
  once: true
});

/* service items reveal */
ScrollTrigger.batch('.service-item', {
  start: 'top 92%',
  onEnter: (els) => gsap.fromTo(els, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08, overwrite: true }),
  once: true
});

/* stat count-up */
document.querySelectorAll('.stat strong').forEach((el) => {
  if (!/^\d+[%+]?$/.test(el.textContent.trim())) return;
  const target = parseInt(el.textContent, 10);
  const suffix = el.textContent.replace(/[0-9]/g, '');
  const counterObj = { val: 0 };
  ScrollTrigger.create({
    trigger: el,
    start: 'top 90%',
    once: true,
    onEnter: () => {
      gsap.to(counterObj, {
        val: target,
        duration: 1.4,
        ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.floor(counterObj.val) + suffix; }
      });
    }
  });
});

/* lightbox */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src, caption) {
  lightboxImg.src = src;
  lightboxCaption.textContent = caption;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelectorAll('.work-card').forEach((card) => {
  const img = card.querySelector('.work-media img');
  if (!img) return;
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    const title = card.querySelector('.work-info h3')?.textContent || '';
    openLightbox(img.src, title);
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

/* filters */
const filterButtons = document.querySelectorAll('.filter-btn');
const workCards = document.querySelectorAll('.work-card');
filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    workCards.forEach((card) => {
      const show = filter === 'all' || card.dataset.cat === filter;
      if (show) {
        card.hidden = false;
        gsap.fromTo(card, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
      } else {
        card.hidden = true;
      }
    });
    ScrollTrigger.refresh();
  });
});

/* mobile menu toggle (simple nav reveal) */
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.querySelector('.main-nav');
menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  if (isOpen) {
    gsap.set(mainNav, { display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#0d0d0d', color: '#fff', justifyContent: 'center', alignItems: 'center', gap: 32, fontSize: '2rem', zIndex: 400 });
  } else {
    gsap.set(mainNav, { clearProps: 'all' });
  }
});

/* smooth internal nav links */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    gsap.to(window, { duration: 0.6, scrollTo: { y: target, offsetY: 0 }, ease: 'power2.out' });
    mainNav?.classList.remove('open');
    gsap.set(mainNav, { clearProps: 'all' });
  });
});
