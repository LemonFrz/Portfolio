/* ─── main.js ─── */

// ── Header Scroll State
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
}, { passive: true });

// ── Scroll Reveal Observer
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Interactive Lightbox Modal with HD Zoom & Pan Controls ──
const createLightbox = () => {
  const modal = document.createElement('div');
  modal.id = 'lightbox-modal';
  
  modal.innerHTML = `
    <div class="lb-controls">
      <button id="lb-zoom-out" title="Zoom Out">-</button>
      <input type="range" id="lb-slider" min="1" max="5" step="0.05" value="1" />
      <button id="lb-zoom-in" title="Zoom In">+</button>
      <span id="lb-scale-text">100%</span>
      <button id="lb-reset" title="Reset Zoom">RESET</button>
      <button id="lb-close" title="Close (Esc)">&times;</button>
    </div>
    <div class="lb-stage">
      <div class="lb-img-wrap">
        <img id="lb-img" src="" alt="Exhibit preview" draggable="false" />
      </div>
    </div>
    <div class="lb-hint">Use slider, buttons or scroll wheel to zoom • Drag to pan photo</div>
  `;
  document.body.appendChild(modal);

  const img = modal.querySelector('#lb-img');
  const slider = modal.querySelector('#lb-slider');
  const scaleText = modal.querySelector('#lb-scale-text');
  const btnZoomIn = modal.querySelector('#lb-zoom-in');
  const btnZoomOut = modal.querySelector('#lb-zoom-out');
  const btnReset = modal.querySelector('#lb-reset');
  const btnClose = modal.querySelector('#lb-close');
  const stage = modal.querySelector('.lb-stage');

  let scale = 1;
  let baseWidth = 0;
  let isDragging = false;
  let startX = 0, startY = 0;
  let scrollLeft = 0, scrollTop = 0;

  const calculateBaseWidth = () => {
    img.style.maxWidth = '85vw';
    img.style.maxHeight = '75vh';
    img.style.width = 'auto';
    baseWidth = img.getBoundingClientRect().width;
    updateZoom();
  };

  const updateZoom = () => {
    if (baseWidth > 0) {
      img.style.maxWidth = 'none';
      img.style.maxHeight = 'none';
      img.style.width = `${baseWidth * scale}px`;
    }
    slider.value = scale;
    scaleText.textContent = `${Math.round(scale * 100)}%`;
    stage.style.cursor = scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default';
    img.style.cursor = scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in';
  };

  const setScale = (newScale) => {
    scale = Math.min(Math.max(newScale, 1), 5);
    updateZoom();
  };

  const openLightbox = (src, alt) => {
    img.src = src;
    img.alt = alt || 'Exhibit preview';
    scale = 1;
    modal.classList.add('active');
    
    if (img.complete) {
      calculateBaseWidth();
    } else {
      img.onload = calculateBaseWidth;
    }
    stage.scrollTop = 0;
    stage.scrollLeft = 0;
  };

  const closeLightbox = () => {
    modal.classList.remove('active');
    scale = 1;
  };

  // Slider control
  slider.addEventListener('input', (e) => setScale(parseFloat(e.target.value)));

  // Button controls
  btnZoomIn.addEventListener('click', (e) => { e.stopPropagation(); setScale(scale + 0.5); });
  btnZoomOut.addEventListener('click', (e) => { e.stopPropagation(); setScale(scale - 0.5); });
  btnReset.addEventListener('click', (e) => { 
    e.stopPropagation(); 
    setScale(1); 
    stage.scrollTop = 0;
    stage.scrollLeft = 0;
  });
  btnClose.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });

  // Scroll wheel zoom
  stage.addEventListener('wheel', (e) => {
    if (!modal.classList.contains('active')) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    setScale(scale + delta);
  }, { passive: false });

  // Drag to pan when zoomed
  stage.addEventListener('mousedown', (e) => {
    if (scale <= 1) return;
    if (e.target.closest('.lb-controls')) return;
    isDragging = true;
    startX = e.pageX - stage.offsetLeft;
    startY = e.pageY - stage.offsetTop;
    scrollLeft = stage.scrollLeft;
    scrollTop = stage.scrollTop;
    updateZoom();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - stage.offsetLeft;
    const y = e.pageY - stage.offsetTop;
    const walkX = (x - startX) * 1.5;
    const walkY = (y - startY) * 1.5;
    stage.scrollLeft = scrollLeft - walkX;
    stage.scrollTop = scrollTop - walkY;
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      updateZoom();
    }
  });

  // Click photo toggles zoom (1x <-> 2.5x) if not dragging
  let clickTime = 0;
  img.addEventListener('mousedown', () => { clickTime = Date.now(); });
  img.addEventListener('click', (e) => {
    e.stopPropagation();
    if (Date.now() - clickTime > 200) return; // ignore drag releases
    setScale(scale > 1.1 ? 1 : 2.5);
  });

  // Close modal when clicking backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target === stage) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  window.addEventListener('resize', () => {
    if (modal.classList.contains('active')) {
      calculateBaseWidth();
    }
  });

  // Attach lightbox trigger to exhibit images
  document.querySelectorAll('.exhibit-img').forEach(image => {
    image.style.cursor = 'zoom-in';
    image.addEventListener('click', () => openLightbox(image.src, image.alt));
  });
};

document.addEventListener('DOMContentLoaded', createLightbox);
