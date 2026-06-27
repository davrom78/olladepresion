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
      e.target.querySelectorAll('.cb-new').forEach(b => {
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
})();
