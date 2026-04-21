/* MAKHUZA EDUCATIONAL CONSULTANTS — Interactions · v1.0 · 2026 */
(function(){
  'use strict';
  const $  = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));

  // NAV scroll state + mobile
  const nav = $('.nav'), navToggle = $('.nav-toggle'), navMobile = $('.nav-mobile');
  const onScroll = () => { if (nav) nav.classList.toggle('scrolled', window.scrollY > 12); };
  window.addEventListener('scroll', onScroll, {passive: true});
  onScroll();
  if (navToggle){
    navToggle.addEventListener('click', () => {
      const open = navToggle.classList.toggle('open');
      if (navMobile) navMobile.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('.nav-mobile a').forEach(a => a.addEventListener('click', () => {
      navToggle.classList.remove('open'); navMobile && navMobile.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  // REVEAL
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }});
  }, {threshold: 0.12, rootMargin: '0px 0px -40px 0px'});
  $$('.reveal').forEach(el => io.observe(el));

  // HERO CAROUSEL
  const carousel = $('.carousel');
  if (carousel){
    const slides = $$('.carousel-slide', carousel);
    const dots = $$('.carousel-dot', carousel);
    const numEl = $('.carousel-num', carousel);
    const capText = $('.carousel-caption-text', carousel);
    const capData = slides.map(s => ({eyebrow: s.dataset.eyebrow || '', title: s.dataset.title || ''}));
    let idx = 0, timer = null;
    const DURATION = 6000;
    const goTo = (n) => {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('active', i === idx));
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      if (numEl) numEl.textContent = String(idx+1).padStart(2,'0') + ' / ' + String(slides.length).padStart(2,'0');
      if (capText && capData[idx]){
        capText.innerHTML = `<span class="cap-eyebrow">${capData[idx].eyebrow}</span><h3 class="cap-title">${capData[idx].title}</h3>`;
      }
    };
    const advance = () => goTo(idx + 1);
    const restart = () => { clearInterval(timer); timer = setInterval(advance, DURATION); };
    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); restart(); }));
    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', restart);
    goTo(0);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) restart();
  }

  // COUNTERS
  const countEls = $$('[data-count]');
  if (countEls.length){
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const duration = parseInt(el.dataset.duration || '1800', 10);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const start = performance.now();
        const step = (now) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, {threshold: 0.5});
    countEls.forEach(el => cio.observe(el));
  }

  // MAGNETIC
  $$('.magnetic').forEach(el => {
    const strength = 0.18;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width/2);
      const y = e.clientY - (r.top  + r.height/2);
      el.style.transform = `translate(${x*strength}px, ${y*strength}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  // PRICING TABS
  const tabs = $$('.pricing-tab');
  if (tabs.length){
    tabs.forEach(t => t.addEventListener('click', () => {
      tabs.forEach(x => x.classList.toggle('active', x === t));
      $$('.pricing-panel').forEach(p => p.classList.toggle('active', p.id === t.dataset.tab));
    }));
  }

  // FAQ
  $$('.faq-q').forEach(q => q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    if (!item) return;
    const open = item.classList.contains('open');
    $$('.faq-item').forEach(i => i.classList.remove('open'));
    if (!open) item.classList.add('open');
  }));

  // FOOTER YEAR
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  // CONTACT FORM
  const form = $('#contact-form');
  if (form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      const original = btn.innerHTML;
      btn.innerHTML = '<span>Sending…</span>';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = '<span>Message sent ✓</span>';
        form.reset();
        setTimeout(() => { btn.innerHTML = original; btn.disabled = false; }, 3500);
      }, 900);
    });
  }
})();
