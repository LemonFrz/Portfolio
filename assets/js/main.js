/* ─── main.js ─── */

// ── Year
document.getElementById('yr').textContent = new Date().getFullYear();

// ── Custom Pointer Cursor (Zero Delay / Instant Tracking)
const customCursor = document.getElementById('customCursor');

if (customCursor) {
  window.addEventListener('mousemove', e => {
    // Instant 1:1 position update with zero transition delay
    customCursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
  }, { passive: true });

  document.querySelectorAll('a, button, input, .lb-card').forEach(el => {
    el.addEventListener('mouseenter', () => customCursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => customCursor.classList.remove('hover'));
  });

  document.addEventListener('mouseleave', () => { customCursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { customCursor.style.opacity = '1'; });
}

// ── Header Scroll State
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
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
