// ---- Count-up animation for credentials band ----
const countEls = Array.from(document.querySelectorAll('[data-count]'));

function groupNum(str) {
  // add thousands separators to the integer part (e.g. 3000 -> 3,000)
  const parts = String(str).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

function writeCountFinal(el) {
  const target  = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const suffix   = el.dataset.suffix || '';
  el.textContent = groupNum(target.toFixed(decimals)) + suffix;
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
    el.textContent = groupNum((target * eased).toFixed(decimals)) + suffix;
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
const heroMast = document.querySelector('.hero--masthead');
const onScroll = () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 24);
  // Transparent (light) nav while the cinematic hero still fills the screen;
  // flips to solid parchment once its bottom passes under the bar.
  const overHero = heroMast ? y < (heroMast.offsetHeight - nav.offsetHeight - 8) : false;
  nav.classList.toggle('over-hero', overHero);
};
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });
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

// ---- About: draft the table plan on first entry (enhancement only — SVG is fully drawn by default) ----
(function () {
  const plan = document.querySelector('.about-plan-wrap');
  if (!plan) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { plan.classList.add('is-drawing'); io.unobserve(e.target); }
    });
  }, { threshold: 0.35 });
  io.observe(plan);
})();

// ---- Mobile only: fade WHO personas + journey steps up as they scroll into view ----
(function () {
  const mobile = window.matchMedia('(max-width: 900px)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!mobile) return;
  const els = Array.from(document.querySelectorAll('.who-slide, .j-panel'));
  if (!els.length) return;
  els.forEach(s => s.classList.add('m-reveal'));
  const showAll = () => els.forEach(s => s.classList.add('in-view'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    els.forEach(s => io.observe(s));
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

  const clamp01 = v => Math.max(0, Math.min(1, v));
  // Ease rendered progress toward the scroll target so a fast flick still steps
  // through every persona instead of jumping straight to the last one.
  let targetP = 0, renderP = 0, rafId = null;
  function draw(p) {
    setActive(Math.min(N - 1, Math.floor(p * N + 0.0001)));
    if (progressArc) progressArc.style.strokeDashoffset = String(1 - p);
  }
  function frame() {
    const d = targetP - renderP;
    if (Math.abs(d) < 0.0006) { renderP = targetP; draw(renderP); rafId = null; return; }
    renderP += d * 0.15;
    draw(renderP);
    rafId = requestAnimationFrame(frame);
  }
  function kick() {
    if (!pinned()) { setActive(current < 0 ? 0 : current); return; }
    const rect = scroll.getBoundingClientRect();
    const total = scroll.offsetHeight - window.innerHeight;
    targetP = clamp01(total > 0 ? (-rect.top) / total : 0);
    if (rafId === null) rafId = requestAnimationFrame(frame);
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

  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', () => { renderP = targetP; kick(); }, { passive: true });
  setActive(0);
  kick();
  renderP = targetP;   // snap first paint (no ease-in on load)
})();

// ---- Chapter progress rail ----
(function () {
  const rail = document.querySelector('.chapters');
  if (!rail) return;
  const fill = rail.querySelector('.chapters-fill');
  const links = Array.from(rail.querySelectorAll('.chapter'));
  const sections = links.map(a => document.querySelector(a.getAttribute('href')));
  const hero = document.querySelector('.hero--masthead');
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

  const visual = scroll.querySelector('.journey-visual');
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
  // Ease the rendered progress toward the scroll target so the floor always plays
  // THROUGH its stages — even on a fast flick that skips the raw scroll range.
  let targetP = 0, renderP = 0, rafId = null;
  function measure() {
    if (reduced() || !desktop()) { targetP = 1; return; }   // mobile/reduced: frozen final state
    const rect = scroll.getBoundingClientRect();
    const total = scroll.offsetHeight - window.innerHeight;
    targetP = clamp01(total > 0 ? (-rect.top) / total : 0);
  }
  function frame() {
    const d = targetP - renderP;
    if (Math.abs(d) < 0.0006) { renderP = targetP; render(renderP); rafId = null; return; }
    renderP += d * 0.15;
    render(renderP);
    rafId = requestAnimationFrame(frame);
  }
  function kick() { measure(); if (rafId === null) rafId = requestAnimationFrame(frame); }
  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', () => { cur = -1; lastP = -1; measure(); renderP = targetP; render(renderP); }, { passive: true });
  measure(); renderP = targetP; render(renderP);   // first paint lands directly, no ease-in
})();

// (Removed dead hero-parallax IIFE — it queried .mh-bg, which doesn't exist; the hero
//  uses .mh-photo with a CSS Ken Burns animation, so a JS transform would have fought it.)

// ---- Process: phone-only accordion (≤600px) ----
// Collapses step descriptions; tap title row to expand. Desktop untouched.
(function () {
  if (!window.matchMedia('(max-width: 600px)').matches) return;

  // SVG chevron (down arrow) injected into each step title row
  function chevronSVG() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 20 20');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', 'step-chevron');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '1.6');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('d', 'M5 8l5 5 5-5');
    svg.appendChild(path);
    return svg;
  }

  function toggleStep(step, open) {
    step.classList.toggle('is-open', open);
    const trigger = step.querySelector('[role="button"], button');
    if (trigger) trigger.setAttribute('aria-expanded', String(open));
  }

  function makeToggleable(step, triggerEl) {
    triggerEl.setAttribute('role', 'button');
    triggerEl.setAttribute('tabindex', '0');
    triggerEl.setAttribute('aria-expanded', 'false');
    triggerEl.appendChild(chevronSVG());

    triggerEl.addEventListener('click', function () {
      const isOpen = step.classList.contains('is-open');
      toggleStep(step, !isOpen);
    });

    triggerEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isOpen = step.classList.contains('is-open');
        toggleStep(step, !isOpen);
      }
    });
  }

  // ---- Part I: tenant steps (.tstep) ----
  // Each .tstep = .tstep-num + .tstep-body (h4 + p)
  // Wrap .tstep-num + h4 in a trigger div; leave p outside (it collapses via CSS)
  const tsteps = Array.from(document.querySelectorAll('.tstep'));
  tsteps.forEach(function (step, i) {
    const num = step.querySelector('.tstep-num');
    const body = step.querySelector('.tstep-body');
    if (!num || !body) return;

    const h4 = body.querySelector('h4');
    if (!h4) return;

    // Build trigger element containing num + h4
    const trigger = document.createElement('div');
    trigger.className = 'tstep-trigger';

    // Move num and h4 into the trigger
    step.insertBefore(trigger, num);
    trigger.appendChild(num);
    trigger.appendChild(h4);

    makeToggleable(step, trigger);

    // Open the first step in this track
    if (i === 0) toggleStep(step, true);
  });

  // ---- Part II: owner panels (.j-panel) ----
  // Each .j-panel = h4 (with ::before counter) + p
  const jpanels = Array.from(document.querySelectorAll('.j-panel'));
  jpanels.forEach(function (panel, i) {
    const h4 = panel.querySelector('h4');
    if (!h4) return;

    // Wrap h4 in a trigger div
    const trigger = document.createElement('div');
    trigger.className = 'j-panel-trigger';
    panel.insertBefore(trigger, h4);
    trigger.appendChild(h4);

    makeToggleable(panel, trigger);

    // Open the first owner panel
    if (i === 0) toggleStep(panel, true);
  });

  // ---- Part III: Who We Help personas (.who-slide) ----
  // .who-slide = .persona-eyebrow + .persona-h (title row) then .persona-lead + .persona-foot (collapse)
  const whoSlides = Array.from(document.querySelectorAll('.who-slide'));
  whoSlides.forEach(function (slide, i) {
    const eyebrow = slide.querySelector('.persona-eyebrow');
    const h = slide.querySelector('.persona-h');
    if (!eyebrow || !h) return;
    const trigger = document.createElement('div');
    trigger.className = 'who-trigger';
    const txt = document.createElement('div');
    txt.className = 'who-trigger-txt';
    eyebrow.parentNode.insertBefore(trigger, eyebrow);
    txt.appendChild(eyebrow);
    txt.appendChild(h);
    trigger.appendChild(txt);
    makeToggleable(slide, trigger);   // adds role/aria/keyboard + chevron
    if (i === 0) toggleStep(slide, true);
  });
})();
