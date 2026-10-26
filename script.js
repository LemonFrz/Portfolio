/* ═══════════════════════════════════════════════
   LEMON1G STUDIO — script.js
   Gallery renderer, Filters, Lightbox, Scroll reveals,
   Header state, Mobile menu, Copy email, Grid overlay
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Reduced Motion Check ── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Works Data Array ── */
  const works = [
    {
      number: '01',
      category: 'FEATURED DESIGN',
      filterCategory: 'Graphic Design',
      title: 'Timeless Meets Now',
      description: 'A typography-driven automotive piece pairing bold modern lettering with classic script.',
      image: 'assets/images/Modern x Classics.webp',
      fallback: 'assets/images/Modern x Classics.png',
      filename: 'Modern_x_Classics.PNG',
      alt: 'Modern x Classics typography poster combining bold and classic automotive lettering',
      width: 1600,
      height: 1000,
      specs: [
        { key: 'Category', value: 'Graphic Design' },
        { key: 'Software', value: 'Photoshop' },
        { key: 'Style', value: 'Editorial Typography' }
      ]
    },
    {
      number: '02',
      category: 'VIRTUAL PHOTO',
      filterCategory: 'Virtual Photography',
      title: 'Autumn in Tokyo City',
      description: 'A virtual photograph capturing the warm glow of autumn in Tokyo City, taken in Forza Horizon 6.',
      image: 'assets/images/RX7_Savanna.webp',
      fallback: 'assets/images/RX7_Savanna.png',
      filename: 'RX7_Savanna.PNG',
      alt: 'Virtual photograph of a car in autumn Tokyo City from Forza Horizon 6',
      width: 1920,
      height: 1080,
      specs: [
        { key: 'Category', value: 'Virtual Photography' },
        { key: 'Location', value: 'FH6 Japan, Tokyo City' },
        { key: 'Tone', value: 'Warm' }
      ]
    },
    {
      number: '03',
      category: 'POSTER DESIGN',
      filterCategory: 'Poster Design',
      title: 'RX7 Savanna',
      description: 'A minimalistic poster that pairs clean typography with the iconic silhouette of the Mazda RX-7 Savanna.',
      image: 'assets/images/RX7_SAVANNA_Poster.webp',
      fallback: 'assets/images/RX7_SAVANNA_Poster.png',
      filename: 'RX7_SAVANNA_Poster.PNG',
      alt: 'Minimalist poster design featuring the Mazda RX-7 Savanna with bold typography',
      width: 900,
      height: 1200,
      specs: [
        { key: 'Category', value: 'Poster Design' },
        { key: 'Style', value: 'Minimalistic Poster' },
        { key: 'Car', value: 'Mazda RX-7 Savanna' }
      ]
    }
  ];

  let currentFilter = 'all';

  /* ── Gallery Renderer ── */
  function renderGallery(filter = 'all') {
    currentFilter = filter;
    const feed = document.getElementById('gallery-feed');
    if (!feed) return;

    const filteredWorks = works.filter(w => filter === 'all' || w.filterCategory === filter);

    if (filteredWorks.length === 0) {
      feed.innerHTML = `
        <div class="gallery-empty">
          <p>No works found in this category.</p>
          <button type="button" class="btn-reset-filter" onclick="window._resetFilter()">SHOW ALL WORKS</button>
        </div>
      `;
      return;
    }

    feed.innerHTML = filteredWorks.map((work, i) => {
      const globalIndex = works.indexOf(work);
      return `
        <article class="exhibit-card reveal visible" data-delay="${i % 3}">
          <figure class="exhibit-frame-wrap">
            <div class="frame-bar">
              <div class="frame-dots">
                <span class="frame-dot frame-dot--dark"></span>
                <span class="frame-dot frame-dot--grey"></span>
                <span class="frame-dot frame-dot--lemon"></span>
              </div>
              <span class="frame-filename">${work.filename}</span>
            </div>
            <div class="frame-viewport" data-index="${globalIndex}">
              <img
                src="${work.image}"
                onerror="this.onerror=null;this.src='${work.fallback}'"
                alt="${work.alt}"
                width="${work.width}"
                height="${work.height}"
                loading="${i === 0 ? 'eager' : 'lazy'}"
                class="exhibit-img"
              />
            </div>
          </figure>
          <div class="exhibit-info">
            <div class="exhibit-label">NO. ${work.number} / ${work.category}</div>
            <h3 class="exhibit-title">${work.title}</h3>
            <p class="exhibit-desc">${work.description}</p>
            <dl class="exhibit-specs">
              ${work.specs.map(s => `
                <div class="spec-row">
                  <dt class="spec-key">${s.key}</dt>
                  <dd class="spec-val">${s.value}</dd>
                </div>
              `).join('')}
            </dl>
          </div>
        </article>
      `;
    }).join('');

    initLightboxTriggers();
    initScrollReveal();
  }

  /* ── Gallery Filters ── */
  function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.dataset.filter;
        renderGallery(filter);
      });
    });

    window._resetFilter = function () {
      const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
      if (allBtn) allBtn.click();
    };
  }

  /* ── Lightbox ── */
  let currentIndex = 0;

  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const img = lightbox.querySelector('.lightbox-img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const counter = lightbox.querySelector('.lightbox-counter');
    const titleEl = document.getElementById('lightbox-title');
    const numEl = document.getElementById('lightbox-number');
    const catEl = document.getElementById('lightbox-category');

    function openLightbox(index) {
      currentIndex = index;
      updateLightboxImage();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function updateLightboxImage() {
      const work = works[currentIndex];
      if (!work) return;

      img.src = work.image;
      img.alt = work.alt;

      if (counter) {
        counter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(works.length).padStart(2, '0')}`;
      }
      if (titleEl) {
        titleEl.textContent = work.title;
      }
      if (numEl) {
        numEl.textContent = work.number;
      }
      if (catEl) {
        catEl.textContent = work.category;
      }
    }

    function navigate(direction) {
      currentIndex = (currentIndex + direction + works.length) % works.length;
      updateLightboxImage();
    }

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));

    /* Close on backdrop click */
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-stage')) {
        closeLightbox();
      }
    });

    /* Keyboard controls */
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigate(-1);
          break;
        case 'ArrowRight':
          navigate(1);
          break;
      }
    });

    /* Expose open function */
    window._openLightbox = openLightbox;
  }

  function initLightboxTriggers() {
    document.querySelectorAll('.frame-viewport').forEach((viewport) => {
      viewport.addEventListener('click', () => {
        const index = parseInt(viewport.dataset.index, 10);
        if (window._openLightbox) {
          window._openLightbox(index);
        }
      });
    });
  }

  /* ── Header Scroll State ── */
  function initHeaderScroll() {
    const header = document.getElementById('site-header');
    if (!header) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          header.classList.toggle('scrolled', window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── Mobile Navigation Toggle ── */
  function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const header = document.getElementById('site-header');
    const menu = document.getElementById('nav-mobile-menu');
    if (!toggle || !header || !menu) return;

    function toggleMenu(forceClose = false) {
      const isOpen = menu.classList.contains('active');
      const shouldOpen = forceClose ? false : !isOpen;

      menu.classList.toggle('active', shouldOpen);
      header.classList.toggle('menu-open', shouldOpen);
      toggle.setAttribute('aria-expanded', String(shouldOpen));
      menu.setAttribute('aria-hidden', String(!shouldOpen));
    }

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    /* Close on mobile link click */
    menu.querySelectorAll('.nav-mobile-link').forEach(link => {
      link.addEventListener('click', () => toggleMenu(true));
    });

    /* Close on Escape */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        toggleMenu(true);
      }
    });

    /* Close on click outside header and menu */
    document.addEventListener('click', (e) => {
      if (menu.classList.contains('active') && !menu.contains(e.target) && !header.contains(e.target)) {
        toggleMenu(true);
      }
    });
  }

  /* ── Copy Email to Clipboard ── */
  function initCopyEmail() {
    const copyBtn = document.getElementById('copy-email-btn');
    const statusEl = document.getElementById('copy-status');
    if (!copyBtn || !statusEl) return;

    const email = 'lemon.1gram@gmail.com';

    copyBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          /* Fallback for older browsers */
          const input = document.createElement('input');
          input.value = email;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          document.body.removeChild(input);
        }

        copyBtn.classList.add('copied');
        statusEl.textContent = 'COPIED! ✓';

        setTimeout(() => {
          copyBtn.classList.remove('copied');
          statusEl.textContent = 'COPY';
        }, 2200);
      } catch (err) {
        console.warn('Copy email failed:', err);
      }
    });
  }

  /* ── Scroll Reveal ── */
  function initScrollReveal() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('visible');
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
  }

  /* ── Grid Overlay Debug Toggle (G key) ── */
  function initGridOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'grid-overlay';
    overlay.id = 'grid-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    const inner = document.createElement('div');
    inner.className = 'grid-overlay-inner';
    for (let i = 0; i < 12; i++) {
      inner.appendChild(document.createElement('div'));
    }
    overlay.appendChild(inner);
    document.body.appendChild(overlay);

    document.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea, select')) return;
      if (e.key.toLowerCase() === 'g' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        overlay.classList.toggle('active');
      }
    });
  }

  /* ── Smooth Scroll for anchor links ── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
    initGalleryFilters();
    initLightbox();
    initHeaderScroll();
    initMobileNav();
    initCopyEmail();
    initGridOverlay();
    initSmoothScroll();

    /* Reveal hero elements */
    document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible'));
  });

})();

