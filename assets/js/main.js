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

// ── Image Lightbox Modal ──
const createLightbox = () => {
  const modal = document.createElement('div');
  modal.id = 'lightbox-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(4, 5, 8, 0.92);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    padding: 2rem;
  `;

  const img = document.createElement('img');
  img.style.cssText = `
    max-width: 90vw;
    max-height: 85vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 0 50px rgba(0,0,0,0.8), 0 0 30px rgba(255, 230, 0, 0.15);
    border: 1px solid rgba(255, 230, 0, 0.2);
    transform: scale(0.95);
    transition: transform 0.3s ease;
  `;

  modal.appendChild(img);
  document.body.appendChild(modal);

  const openLightbox = (src, alt) => {
    img.src = src;
    img.alt = alt || 'Exhibit preview';
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
    img.style.transform = 'scale(1)';
  };

  const closeLightbox = () => {
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    img.style.transform = 'scale(0.95)';
  };

  modal.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  document.querySelectorAll('.exhibit-img').forEach(image => {
    image.style.cursor = 'zoom-in';
    image.addEventListener('click', () => {
      openLightbox(image.src, image.alt);
    });
  });
};

document.addEventListener('DOMContentLoaded', createLightbox);
