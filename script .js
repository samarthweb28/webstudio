document.addEventListener('DOMContentLoaded', () => {

  const panelsEl   = document.getElementById('panels');
  const panels     = Array.from(document.querySelectorAll('.panel'));
  const tabs       = Array.from(document.querySelectorAll('.tab'));
  const railDots   = Array.from(document.querySelectorAll('.rail-dot'));
  const footerLinks= Array.from(document.querySelectorAll('.footer-links a'));
  const mobileLinks= Array.from(document.querySelectorAll('.mobile-link'));
  const menuBtn    = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuBackdrop = document.getElementById('menuBackdrop');
  const yearEl     = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const isDesktop = () => window.matchMedia('(min-width: 769px)').matches;

  /* ---------- helper: go to a section ---------- */
  function goToSection(id){
    const target = document.getElementById(id);
    if (!target) return;
    if (isDesktop()){
      panelsEl.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  [...tabs, ...footerLinks, ...mobileLinks].forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      goToSection(link.dataset.target);
      closeMenu();
    });
  });

  railDots.forEach(dot => {
    dot.addEventListener('click', () => goToSection(dot.dataset.target));
  });

  /* ---------- hamburger menu ---------- */
  function openMenu(){
    mobileMenu.classList.add('is-open');
    menuBackdrop.classList.add('is-open');
    menuBtn.setAttribute('aria-expanded', 'true');
  }
  function closeMenu(){
    mobileMenu.classList.remove('is-open');
    menuBackdrop.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  function toggleMenu(){
    mobileMenu.classList.contains('is-open') ? closeMenu() : openMenu();
  }

  if (menuBtn){
    menuBtn.addEventListener('click', toggleMenu);
    menuBackdrop.addEventListener('click', closeMenu);
    window.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (isDesktop()) closeMenu(); });
  }

  /* ---------- convert vertical wheel scroll into horizontal (desktop only) ---------- */
  panelsEl.addEventListener('wheel', (e) => {
    if (!isDesktop()) return;
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    e.preventDefault();
    panelsEl.scrollLeft += e.deltaY;
  }, { passive: false });

  /* ---------- keyboard arrows (desktop) ---------- */
  window.addEventListener('keydown', (e) => {
    if (!isDesktop()) return;
    const currentIndex = panels.findIndex(p => p.id === activeId);
    if (e.key === 'ArrowRight' && currentIndex < panels.length - 1){
      goToSection(panels[currentIndex + 1].id);
    } else if (e.key === 'ArrowLeft' && currentIndex > 0){
      goToSection(panels[currentIndex - 1].id);
    }
  });

  /* ---------- active section tracking + reveal animation ---------- */
  let activeId = panels[0].id;

  const setActive = (id) => {
    activeId = id;
    tabs.forEach(t => t.classList.toggle('is-active', t.dataset.target === id));
    railDots.forEach(d => d.classList.toggle('is-active', d.dataset.target === id));
    mobileLinks.forEach(l => l.classList.toggle('is-active', l.dataset.target === id));
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const content = entry.target.querySelector('.panel-content');
      if (entry.isIntersecting){
        if (content) content.classList.add('in-view');
        if (entry.intersectionRatio > 0.55){
          setActive(entry.target.id);
        }
      }
    });
  }, {
    root: null, /* viewport intersection works for both horizontal (desktop) and vertical (mobile) layouts */
    threshold: [0, 0.55, 1]
  });

  panels.forEach(p => observer.observe(p));
});
