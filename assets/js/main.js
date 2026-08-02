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

// ── Interactive HD Lightbox Preview with Classic Click-to-Zoom ──
const createLightbox = () => {
  const modal = document.createElement('div');
  modal.id = 'lightbox-modal';
  
  modal.innerHTML = `
    <button id="lb-close" title="Close (Esc)">&times;</button>
    <div class="lb-stage">
      <div class="lb-img-wrap">
        <img id="lb-img" src="" alt="Exhibit preview" />
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const img = modal.querySelector('#lb-img');
  const btnClose = modal.querySelector('#lb-close');
  const stage = modal.querySelector('.lb-stage');

  let isZoomed = false;

  const setZoom = (zoomed) => {
    isZoomed = zoomed;
    if (isZoomed) {
      img.classList.add('zoomed');
    } else {
      img.classList.remove('zoomed');
    }
  };

  const openLightbox = (src, alt) => {
    img.src = src;
    img.alt = alt || 'Exhibit preview';
    setZoom(false);
    modal.classList.add('active');
    stage.scrollTop = 0;
    stage.scrollLeft = 0;
  };

  const closeLightbox = () => {
    modal.classList.remove('active');
    setZoom(false);
  };

  // Toggle classic click-to-zoom
  img.addEventListener('click', (e) => {
    e.stopPropagation();
    setZoom(!isZoomed);
  });

  // Close controls
  btnClose.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });

  // Close on backdrop click
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
