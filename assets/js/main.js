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

// ── Interactive Lightbox Modal with Zoom & Slider Controls ──
const createLightbox = () => {
  const modal = document.createElement('div');
  modal.id = 'lightbox-modal';
  
  modal.innerHTML = `
    <div class="lb-controls">
      <button id="lb-zoom-out" title="Zoom Out">-</button>
      <input type="range" id="lb-slider" min="1" max="4" step="0.1" value="1" />
      <button id="lb-zoom-in" title="Zoom In">+</button>
      <span id="lb-scale-text">100%</span>
      <button id="lb-reset" title="Reset Zoom">RESET</button>
      <button id="lb-close" title="Close (Esc)">&times;</button>
    </div>
    <div class="lb-stage">
      <img id="lb-img" src="" alt="Exhibit preview" />
    </div>
    <div class="lb-hint">Click image to toggle zoom • Scroll / Drag to pan</div>
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
  let translateX = 0;
  let translateY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  const updateTransform = () => {
    img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    slider.value = scale;
    scaleText.textContent = `${Math.round(scale * 100)}%`;
    img.style.cursor = scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in';
  };

  const setScale = (newScale) => {
    scale = Math.min(Math.max(newScale, 1), 4);
    if (scale === 1) {
      translateX = 0;
      translateY = 0;
    }
    updateTransform();
  };

  const openLightbox = (src, alt) => {
    img.src = src;
    img.alt = alt || 'Exhibit preview';
    setScale(1);
    modal.classList.add('active');
  };

  const closeLightbox = () => {
    modal.classList.remove('active');
    setScale(1);
  };

  // Slider control
  slider.addEventListener('input', (e) => setScale(parseFloat(e.target.value)));

  // Button controls
  btnZoomIn.addEventListener('click', (e) => { e.stopPropagation(); setScale(scale + 0.5); });
  btnZoomOut.addEventListener('click', (e) => { e.stopPropagation(); setScale(scale - 0.5); });
  btnReset.addEventListener('click', (e) => { e.stopPropagation(); setScale(1); });
  btnClose.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });

  // Click photo to toggle zoom (1x <-> 2.2x)
  img.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isDragging) return;
    setScale(scale > 1.1 ? 1 : 2.2);
  });

  // Mouse wheel zoom
  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    setScale(scale + delta);
  }, { passive: false });

  // Drag / Pan logic when zoomed in
  stage.addEventListener('mousedown', (e) => {
    if (e.target === img && scale > 1) {
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      img.style.cursor = 'grabbing';
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateTransform();
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      updateTransform();
    }
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

  // Attach lightbox trigger to exhibit images
  document.querySelectorAll('.exhibit-img').forEach(image => {
    image.style.cursor = 'zoom-in';
    image.addEventListener('click', () => openLightbox(image.src, image.alt));
  });
};

document.addEventListener('DOMContentLoaded', createLightbox);
