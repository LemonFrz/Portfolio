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

// ── Interactive Lightbox Modal with Physical Slider Controls ──
const createLightbox = () => {
  const modal = document.createElement('div');
  modal.id = 'lightbox-modal';
  
  modal.innerHTML = `
    <div class="lb-controls">
      <div class="lb-control-group">
        <span class="lb-label">ZOOM</span>
        <button id="lb-zoom-out" title="Zoom Out">-</button>
        <input type="range" id="lb-slider" min="1" max="5" step="0.05" value="1" />
        <button id="lb-zoom-in" title="Zoom In">+</button>
        <span id="lb-scale-text">100%</span>
      </div>
      <div class="lb-control-group">
        <span class="lb-label">PAN X</span>
        <input type="range" id="lb-pan-x" min="0" max="100" value="50" disabled />
      </div>
      <div class="lb-control-group">
        <span class="lb-label">PAN Y</span>
        <input type="range" id="lb-pan-y" min="0" max="100" value="50" disabled />
      </div>
      <button id="lb-reset" title="Reset Zoom & Pan">RESET</button>
      <button id="lb-close" title="Close (Esc)">&times;</button>
    </div>
    <div class="lb-stage">
      <div class="lb-img-wrap">
        <img id="lb-img" src="" alt="Exhibit preview" draggable="false" />
      </div>
    </div>
    <div class="lb-hint">Use physical sliders to adjust Zoom level, Pan X (horizontal), and Pan Y (vertical)</div>
  `;
  document.body.appendChild(modal);

  const img = modal.querySelector('#lb-img');
  const slider = modal.querySelector('#lb-slider');
  const panXSlider = modal.querySelector('#lb-pan-x');
  const panYSlider = modal.querySelector('#lb-pan-y');
  const scaleText = modal.querySelector('#lb-scale-text');
  const btnZoomIn = modal.querySelector('#lb-zoom-in');
  const btnZoomOut = modal.querySelector('#lb-zoom-out');
  const btnReset = modal.querySelector('#lb-reset');
  const btnClose = modal.querySelector('#lb-close');
  const stage = modal.querySelector('.lb-stage');

  let scale = 1;
  let baseWidth = 0;

  const calculateBaseWidth = () => {
    img.style.maxWidth = '85vw';
    img.style.maxHeight = '75vh';
    img.style.width = 'auto';
    baseWidth = img.getBoundingClientRect().width;
    updateZoom();
  };

  const updatePanSliders = () => {
    const maxScrollX = stage.scrollWidth - stage.clientWidth;
    const maxScrollY = stage.scrollHeight - stage.clientHeight;

    if (maxScrollX > 2) {
      panXSlider.disabled = false;
      panXSlider.value = (stage.scrollLeft / maxScrollX) * 100;
    } else {
      panXSlider.disabled = true;
      panXSlider.value = 50;
    }

    if (maxScrollY > 2) {
      panYSlider.disabled = false;
      panYSlider.value = (stage.scrollTop / maxScrollY) * 100;
    } else {
      panYSlider.disabled = true;
      panYSlider.value = 50;
    }
  };

  const updateZoom = () => {
    if (baseWidth > 0) {
      img.style.maxWidth = 'none';
      img.style.maxHeight = 'none';
      img.style.width = `${baseWidth * scale}px`;
    }
    slider.value = scale;
    scaleText.textContent = `${Math.round(scale * 100)}%`;

    // Allow browser layout to settle before updating pan sliders
    requestAnimationFrame(updatePanSliders);
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

  // Zoom Slider control
  slider.addEventListener('input', (e) => setScale(parseFloat(e.target.value)));

  // Pan Sliders control
  panXSlider.addEventListener('input', (e) => {
    const maxScrollX = stage.scrollWidth - stage.clientWidth;
    if (maxScrollX > 0) {
      stage.scrollLeft = (parseFloat(e.target.value) / 100) * maxScrollX;
    }
  });

  panYSlider.addEventListener('input', (e) => {
    const maxScrollY = stage.scrollHeight - stage.clientHeight;
    if (maxScrollY > 0) {
      stage.scrollTop = (parseFloat(e.target.value) / 100) * maxScrollY;
    }
  });

  // Sync pan sliders when scrolling container natively
  stage.addEventListener('scroll', updatePanSliders);

  // Button controls
  btnZoomIn.addEventListener('click', (e) => { e.stopPropagation(); setScale(scale + 0.5); });
  btnZoomOut.addEventListener('click', (e) => { e.stopPropagation(); setScale(scale - 0.5); });
  btnReset.addEventListener('click', (e) => { 
    e.stopPropagation(); 
    setScale(1); 
    stage.scrollTop = 0;
    stage.scrollLeft = 0;
    updatePanSliders();
  });
  btnClose.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });

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
    image.style.cursor = 'pointer';
    image.addEventListener('click', () => openLightbox(image.src, image.alt));
  });
};

document.addEventListener('DOMContentLoaded', createLightbox);
