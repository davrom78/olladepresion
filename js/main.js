// Calendar modal
function openCalModal(){
  document.getElementById('calModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  // Lazy load Elfsight solo al abrir
  if(!document.querySelector('script[src*="elfsightcdn"]')){
    const s = document.createElement('script');
    s.src = 'https://elfsightcdn.com/platform.js';
    s.async = true;
    document.body.appendChild(s);
  }
}
function closeCalModal(){
  document.getElementById('calModal').classList.remove('open');
  document.body.style.overflow = '';
}

// Navbar scroll effect
const nav = document.getElementById('nav');
if(nav){
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// Scroll reveals
const io = new IntersectionObserver(es => {
  es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('v'); io.unobserve(e.target); } });
}, { threshold:.1, rootMargin:'0px 0px -30px 0px' });
document.querySelectorAll('.r').forEach(el => io.observe(el));

// Comparison bars animation
const barIO = new IntersectionObserver(es => {
  es.forEach(e => {
    if(e.isIntersecting){
      e.target.querySelectorAll('.cb-bar-new').forEach(b => {
        requestAnimationFrame(() => requestAnimationFrame(() => b.classList.add('go')));
      });
      barIO.unobserve(e.target);
    }
  });
}, { threshold:.25 });
document.querySelectorAll('.comp-bars').forEach(el => barIO.observe(el));

// Testimonial carousel dots
(function(){
  const track = document.getElementById('testiTrack');
  const nav = document.getElementById('testiNav');
  if(!track || !nav) return;
  const cards = track.querySelectorAll('.tc');
  const total = cards.length;
  function buildDots(){
    nav.innerHTML = '';
    const dotCount = Math.max(1, total - Math.round(track.offsetWidth / (cards[0].offsetWidth + 20)) + 1);
    for(let i = 0; i < Math.min(dotCount, 10); i++){
      const d = document.createElement('button');
      d.className = 'testi-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Testimonio ' + (i + 1));
      d.addEventListener('click', () => {
        cards[i].scrollIntoView({ behavior:'smooth', block:'nearest', inline:'start' });
      });
      nav.appendChild(d);
    }
  }
  buildDots();
  window.addEventListener('resize', buildDots);
  track.addEventListener('scroll', () => {
    const cardW = cards[0].offsetWidth + 20;
    const idx = Math.round(track.scrollLeft / cardW);
    nav.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
  });

  // Auto-scroll testimonials
  let autoScroll;
  function startAutoScroll(){
    autoScroll = setInterval(() => {
      const cardW = track.querySelector('.tc').offsetWidth + 20;
      const maxScroll = track.scrollWidth - track.offsetWidth;
      if(track.scrollLeft >= maxScroll - 10){
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: cardW, behavior: 'smooth' });
      }
    }, 4000);
  }
  startAutoScroll();
  track.addEventListener('pointerdown', () => clearInterval(autoScroll));
  track.addEventListener('pointerup', () => startAutoScroll());
})();

// Before/After slider for upgrade section
(function(){
  const slider = document.getElementById('upgSlider');
  const after = document.getElementById('upgSliderAfter');
  const handle = document.getElementById('upgSliderHandle');
  if(!slider || !after || !handle) return;

  function setPosition(pct){
    pct = Math.min(100, Math.max(0, pct));
    after.style.clipPath = `inset(0 0 0 ${pct}%)`;
    handle.style.left = `${pct}%`;
  }
  setPosition(50);

  let dragging = false;
  function pctFromEvent(e){
    const rect = slider.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    return (x / rect.width) * 100;
  }
  function onMove(e){
    if(!dragging) return;
    setPosition(pctFromEvent(e));
  }
  slider.addEventListener('pointerdown', e => { dragging = true; setPosition(pctFromEvent(e)); });
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', () => { dragging = false; });
  slider.addEventListener('touchstart', e => { dragging = true; setPosition(pctFromEvent(e)); }, { passive: true });
  slider.addEventListener('touchmove', onMove, { passive: true });
  slider.addEventListener('touchend', () => { dragging = false; });
})();
