// Scroll-locked frame sequence engine for the hero (Draftly.space style)
(function(){
  const FRAME_COUNT = 241;
  const FRAME_PATH = i => `assets/frames/frame_${String(i).padStart(4,'0')}.webp`;

  const pinArea = document.querySelector('.hero-pin-area');
  const canvas = document.getElementById('heroCanvas');
  if(!pinArea || !canvas) return;
  const ctx = canvas.getContext('2d');

  const images = new Array(FRAME_COUNT);
  let loadedCount = 0;
  let currentFrame = 1;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resizeCanvas(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    drawFrame(currentFrame);
  }

  function drawImageCover(img){
    const cw = canvas.width, ch = canvas.height;
    const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    if(!iw || !ih) return;
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale, dh = ih * scale;
    const dx = (cw - dw) / 2, dy = (ch - dh) / 2;
    ctx.clearRect(0,0,cw,ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function drawFrame(n){
    const img = images[n - 1];
    if(img && img.complete && img.naturalWidth){
      drawImageCover(img);
    }
  }

  function loadFrame(n){
    if(images[n - 1]) return images[n - 1];
    const img = new Image();
    img.src = FRAME_PATH(n);
    img.onload = () => {
      loadedCount++;
      if(n === currentFrame) drawFrame(n);
    };
    images[n - 1] = img;
    return img;
  }

  // Load first frame immediately, then stream the rest in background.
  loadFrame(1);
  let preloadIndex = 2;
  function preloadBatch(){
    let n = 0;
    while(preloadIndex <= FRAME_COUNT && n < 6){
      loadFrame(preloadIndex);
      preloadIndex++;
      n++;
    }
    if(preloadIndex <= FRAME_COUNT){
      (window.requestIdleCallback || ((fn)=>setTimeout(fn,50)))(preloadBatch);
    }
  }
  (window.requestIdleCallback || ((fn)=>setTimeout(fn,50)))(preloadBatch);

  function getProgress(){
    const rect = pinArea.getBoundingClientRect();
    const total = pinArea.offsetHeight - window.innerHeight;
    if(total <= 0) return 0;
    const scrolled = -rect.top;
    return Math.min(1, Math.max(0, scrolled / total));
  }

  let ticking = false;
  function onScroll(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(()=>{
      const progress = getProgress();
      const frameNum = Math.min(FRAME_COUNT, Math.max(1, Math.round(progress * (FRAME_COUNT - 1)) + 1));
      if(frameNum !== currentFrame || !images[currentFrame-1]){
        currentFrame = frameNum;
        if(!images[currentFrame - 1]) loadFrame(currentFrame);
        drawFrame(currentFrame);
      }
      const heroInner = document.querySelector('.hero-inner');
      if(heroInner){
        heroInner.style.opacity = String(Math.max(0, 1 - progress * 2.2));
      }
      ticking = false;
    });
  }

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('scroll', onScroll, { passive: true });
  resizeCanvas();
  onScroll();
})();
