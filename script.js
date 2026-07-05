// ---- Count-up animation for credentials band ----
const countEls = Array.from(document.querySelectorAll('[data-count]'));

function writeCountFinal(el) {
  const target  = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const suffix   = el.dataset.suffix || '';
  el.textContent = target.toFixed(decimals) + suffix;
}

// Safety-net / no-JS fallback: write final values immediately.
countEls.forEach(writeCountFinal);

function animateCount(el) {
  const target   = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const suffix   = el.dataset.suffix || '';
  const duration = 1400;
  const startTime = performance.now();

  function tick(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = (target * eased).toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced && 'IntersectionObserver' in window && countEls.length) {
  const bandIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-count]').forEach(animateCount);
        bandIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  const band = document.querySelector('.band');
  if (band) bandIO.observe(band);
}

// ---- Nav scroll state ----
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---- Mobile menu ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

// ---- Scroll reveal (robust: never leaves content hidden) ----
const revealEls = Array.from(document.querySelectorAll('.reveal-up'));

function revealAll() {
  revealEls.forEach(el => el.classList.add('in-view'));
}

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // subtle stagger for siblings entering together
        const delay = Math.min(i * 60, 240);
        setTimeout(() => entry.target.classList.add('in-view'), delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  revealEls.forEach(el => io.observe(el));

  // Safety net: if anything is still hidden shortly after load, show it.
  window.addEventListener('load', () => setTimeout(revealAll, 2500));
} else {
  revealAll();
}

// ---- Mobile only: reveal WHO personas as they scroll into view ----
(function () {
  const mobile = window.matchMedia('(max-width: 900px)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!mobile) return;
  const slides = Array.from(document.querySelectorAll('.who-slide'));
  if (!slides.length) return;
  slides.forEach(s => s.classList.add('who-reveal'));
  const showAll = () => slides.forEach(s => s.classList.add('in-view'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    slides.forEach(s => io.observe(s));
    window.addEventListener('load', () => setTimeout(showAll, 2500));  // safety net
  } else {
    showAll();
  }
})();

// ---- Who We Help: scroll-pinned persona dial ----
(function () {
  const scroll = document.querySelector('.who-scroll');
  if (!scroll) return;
  const points = Array.from(document.querySelectorAll('.dial-point'));
  const slides = Array.from(document.querySelectorAll('.who-slide'));
  const progressArc = document.querySelector('.dial-progress');
  const N = slides.length;
  if (!N) return;
  let current = -1;

  const pinned = () =>
    window.matchMedia('(min-width: 901px)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setActive(i) {
    if (i === current) return;
    current = i;
    points.forEach((p, k) => {
      const on = k === i;
      p.classList.toggle('is-active', on);
      p.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
  }

  function update() {
    if (!pinned()) { setActive(current < 0 ? 0 : current); return; }
    const rect = scroll.getBoundingClientRect();
    const total = scroll.offsetHeight - window.innerHeight;
    let p = total > 0 ? (-rect.top) / total : 0;
    p = Math.max(0, Math.min(1, p));
    setActive(Math.min(N - 1, Math.floor(p * N + 0.0001)));
    if (progressArc) progressArc.style.strokeDashoffset = String(1 - p);
  }

  points.forEach((pt, i) => {
    pt.addEventListener('click', () => {
      if (!pinned()) { setActive(i); slides[i].scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      const rect = scroll.getBoundingClientRect();
      const wrapTop = rect.top + window.scrollY;
      const total = scroll.offsetHeight - window.innerHeight;
      window.scrollTo({ top: wrapTop + ((i + 0.5) / N) * total, behavior: 'smooth' });
    });
  });

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(() => { update(); ticking = false; }); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  setActive(0);
  update();
})();

// ---- Chapter progress rail ----
(function () {
  const rail = document.querySelector('.chapters');
  if (!rail) return;
  const fill = rail.querySelector('.chapters-fill');
  const links = Array.from(rail.querySelectorAll('.chapter'));
  const sections = links.map(a => document.querySelector(a.getAttribute('href')));
  const hero = document.querySelector('.hero');
  // dark-background sections the fixed rail passes over — switch to light ink there
  const darkSections = ['.band', '.cta'].map(s => document.querySelector(s)).filter(Boolean);
  function update() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (fill) fill.style.height = (p * 100) + '%';
    // reveal the rail only after the first screen (hero) is scrolled past
    const showAt = hero ? Math.max(hero.offsetHeight - 160, 240) : window.innerHeight * 0.8;
    rail.classList.toggle('is-visible', window.scrollY > showAt);
    const mid = window.scrollY + window.innerHeight * 0.4;
    let idx = 0;
    sections.forEach((s, i) => { if (s && s.offsetTop <= mid) idx = i; });
    links.forEach((a, i) => a.classList.toggle('is-active', i === idx));
    // is the rail currently overlapping a dark section?
    const railY = window.scrollY + window.innerHeight / 2;
    let onDark = false;
    darkSections.forEach(s => { const top = s.offsetTop; if (railY >= top && railY < top + s.offsetHeight) onDark = true; });
    rail.classList.toggle('on-dark', onDark);
  }
  let t = false;
  window.addEventListener('scroll', () => { if (!t) { requestAnimationFrame(() => { update(); t = false; }); t = true; } }, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
})();

// ---- Raw-space → asset: pinned journey ----
(function () {
  const scroll = document.querySelector('.journey-scroll');
  if (!scroll) return;
  const nums = Array.from(scroll.querySelectorAll('.j-nums li'));
  const fill = scroll.querySelector('.j-fill');
  const panels = Array.from(scroll.querySelectorAll('.j-panel'));
  const layers = Array.from(scroll.querySelectorAll('.fl-layer, .env-layer'));
  const sun = scroll.querySelector('.env-sun');
  const stageName = scroll.querySelector('.floor-stage-name');
  const N = 6;
  const names = ['Bare shell', 'Tenant secured', 'Fitted out', 'Lease signed', 'Occupied & earning', 'Pre-leased asset'];

  const readout = scroll.querySelector('.journey-readout');
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = () => window.matchMedia('(min-width: 901px)').matches;

  let cur = -1, lastP = -1;
  function render(p) {
    const stage = Math.min(N - 1, Math.floor(p * N + 0.0001));
    if (fill) fill.style.width = (stage / (N - 1) * 100) + '%';
    // the floor + environment evolve continuously across the scroll
    if (p !== lastP) {
      lastP = p;
      layers.forEach(ly => ly.classList.toggle('is-on', p >= +ly.dataset.at));
      if (sun) {                                   // sun arcs up from the horizon (east → peak)
        const rise = Math.max(0, Math.min(1, (p - 0.06) / 0.86));
        const a = rise * Math.PI / 2;
        sun.style.opacity = rise <= 0 ? '0' : String(0.4 + rise * 0.6);
        sun.style.transform = 'translate(' + (-Math.cos(a) * 150).toFixed(1) + 'px, ' + ((1 - Math.sin(a)) * 300).toFixed(1) + 'px)';
      }
    }
    if (stage === cur) return;
    cur = stage;
    nums.forEach((li, i) => { li.classList.toggle('is-active', i === stage); li.classList.toggle('is-done', i < stage); });
    panels.forEach((pl, i) => pl.classList.toggle('is-active', i === stage));
    if (stageName) stageName.textContent = names[stage];
  }

  const clamp01 = v => Math.max(0, Math.min(1, v));
  function update() {
    if (reduced()) { render(1); return; }          // static, fully built
    if (desktop()) {                                // pinned full-section scroll
      const rect = scroll.getBoundingClientRect();
      const total = scroll.offsetHeight - window.innerHeight;
      render(clamp01(total > 0 ? (-rect.top) / total : 0));
      return;
    }
    // mobile: diagram is sticky; steps scroll past a read line beneath it
    if (!readout) { render(1); return; }
    const r = readout.getBoundingClientRect();
    const readLine = window.innerHeight * 0.62;
    render(clamp01(r.height > 0 ? (readLine - r.top) / r.height : 0));
  }
  let ticking = false;
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(() => { update(); ticking = false; }); ticking = true; } }, { passive: true });
  window.addEventListener('resize', () => { cur = -1; lastP = -1; update(); }, { passive: true });
  update();
})();
