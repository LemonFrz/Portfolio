/* ─── main.js ─── */

// ── Year
document.getElementById('yr').textContent = new Date().getFullYear();

// ── Custom Cursor
const dot  = document.getElementById('curDot');
const ring = document.getElementById('curRing');

if (dot && ring) {
  document.addEventListener('mousemove', e => {
    dot.style.transform  = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
    ring.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
  });

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
}

// ── Header scroll state
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Scroll reveal
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
