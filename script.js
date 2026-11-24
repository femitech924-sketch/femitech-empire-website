const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
      menuToggle.focus();
    }
  });
}

const filterButtons = document.querySelectorAll('.filter');
const projectCards = document.querySelectorAll('.project-card');
const emptyProjects = document.querySelector('.empty-projects');
filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const category = button.dataset.filter;
  let visible = 0;
  projectCards.forEach(card => {
    const show = category === 'All' || card.dataset.category === category;
    card.hidden = !show;
    if (show) visible++;
  });
  if (emptyProjects) emptyProjects.hidden = visible !== 0;
}));

document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
  const select = document.querySelector('select[name="service"]');
  if (select) select.value = link.dataset.service;
}));

const form = document.getElementById('project-form');
if (form) form.addEventListener('submit', event => {
  event.preventDefault();
  const fields = [...form.querySelectorAll('input, select, textarea')];
  let valid = true;
  fields.forEach(field => {
    const error = field.parentElement.querySelector('.error');
    if (error) error.textContent = '';
    field.classList.remove('invalid');
    let message = '';
    if (!field.value.trim()) message = 'This field is required.';
    else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) message = 'Please enter a valid email address.';
    if (message) {
      valid = false;
      field.classList.add('invalid');
      if (error) error.textContent = message;
    }
  });
  const status = form.querySelector('.form-success');
  if (status) status.textContent = '';
  if (!valid) {
    form.querySelector('.invalid')?.focus();
    return;
  }
  const data = new FormData(form);
  const message = [
    'Hello FEMITECH EMPIRE, I would like to make a project inquiry.',
    '',
    `Name: ${data.get('name')}`,
    `Email: ${data.get('email')}`,
    `Phone / WhatsApp: ${data.get('phone')}`,
    `Service: ${data.get('service')}`,
    `Project description: ${data.get('description')}`
  ].join('\n');
  if (status) status.textContent = 'Your inquiry is ready. WhatsApp will open so you can send it to our team.';
  window.open(`https://wa.me/2348155918065?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});

const chatTrigger = document.getElementById('chat-trigger');
const chatPanel = document.getElementById('chat-panel');
const chatClose = document.getElementById('chat-close');
function toggleChat(open) {
  if (!chatPanel || !chatTrigger) return;
  chatPanel.hidden = !open;
  chatTrigger.setAttribute('aria-expanded', String(open));
  const label = chatTrigger.querySelector('.chat-label');
  if (label) label.textContent = open ? 'CLOSE ASSISTANT' : 'AI ASSISTANT';
  if (open) chatClose?.focus();
  else chatTrigger.focus();
}
chatTrigger?.addEventListener('click', () => toggleChat(chatPanel.hidden));
chatClose?.addEventListener('click', () => toggleChat(false));

const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => observer.observe(section));
}

// Progressive scroll reveals; without observer support, content remains visible.
(() => {
  const revealTargets = document.querySelectorAll('.intro-grid, .pillars article, .service-card, .section-top, .project-card, .live-project, .book-card, .creative-copy, .creative-art, .process-grid article, .founder-copy, .contact-copy, .contact-form');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('reveal-ready');
  revealTargets.forEach((element, index) => {
    element.classList.add('reveal');
    element.style.transitionDelay = `${(index % 4) * 75}ms`;
  });
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  revealTargets.forEach(element => revealObserver.observe(element));
})();

// Progressive enhancement: the original design and controls still work if this fails to load.
(() => {
  const premiumStyles = document.createElement('link');
  premiumStyles.rel = 'stylesheet';
  premiumStyles.href = 'premium.css';
  document.head.appendChild(premiumStyles);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const tiltTargets = [...document.querySelectorAll('.project-card, .service-card')];
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  tiltTargets.forEach(card => {
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
    const reset = () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
      card.style.setProperty('--light-x', '50%');
      card.style.setProperty('--light-y', '0%');
    };
    card.addEventListener('pointermove', event => {
      if (reducedMotion.matches || (event.pointerType === 'mouse' && !finePointer.matches)) return;
      if (event.pointerType === 'touch' && event.buttons === 0) return;
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const px = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const py = clamp((event.clientY - rect.top) / rect.height, 0, 1);
      card.style.setProperty('--tilt-y', `${((px - .5) * 9).toFixed(2)}deg`);
      card.style.setProperty('--tilt-x', `${((.5 - py) * 7).toFixed(2)}deg`);
      card.style.setProperty('--light-x', `${(px * 100).toFixed(1)}%`);
      card.style.setProperty('--light-y', `${(py * 100).toFixed(1)}%`);
    }, { passive: true });
    card.addEventListener('pointerleave', reset, { passive: true });
    card.addEventListener('blur', reset, true);
  });

  // Open the existing project artwork in a controlled, keyboard-accessible 3D showcase.
  const dialog = document.createElement('dialog');
  dialog.className = 'project-showcase';
  dialog.setAttribute('aria-label', 'Project presentation');
  dialog.innerHTML = '<div class="showcase-shell"><header class="showcase-head"><div><p class="showcase-kicker"></p><h2 class="showcase-title"></h2></div><button class="showcase-close" type="button" aria-label="Close project presentation">×</button></header><div class="showcase-stage"><div class="showcase-object"><div class="showcase-art"></div></div></div><div class="showcase-copy"><p class="showcase-description"></p><p class="showcase-hint">Move or drag to explore the perspective</p></div></div>';
  document.body.appendChild(dialog);
  const closeButton = dialog.querySelector('.showcase-close');
  const stage = dialog.querySelector('.showcase-stage');
  const object = dialog.querySelector('.showcase-object');
  let returnFocus = null;
  let dragPointer = null;

  const setStageAngle = (x, y) => {
    object.style.setProperty('--stage-x', `${clamp(x, -10, 10).toFixed(2)}deg`);
    object.style.setProperty('--stage-y', `${clamp(y, -14, 14).toFixed(2)}deg`);
  };
  const openProject = card => {
    const artwork = card.querySelector('.project-art');
    const info = card.querySelector('.project-info');
    if (!artwork || !info) return;
    const title = info.querySelector('h3')?.textContent.trim() || 'Selected work';
    const category = card.dataset.category || 'Project';
    const description = info.querySelector('p')?.textContent.trim() || 'A selected creative direction by FEMITECH EMPIRE.';
    dialog.querySelector('.showcase-kicker').textContent = category;
    dialog.querySelector('.showcase-title').textContent = title;
    dialog.querySelector('.showcase-description').textContent = description;
    const artHost = dialog.querySelector('.showcase-art');
    artHost.replaceChildren(artwork.cloneNode(true));
    artHost.firstElementChild?.classList.remove('project-art');
    returnFocus = card;
    setStageAngle(2, -4);
    if (!dialog.open) dialog.showModal();
    closeButton.focus();
  };

  projectCards.forEach(card => {
    card.setAttribute('tabindex', card.hasAttribute('tabindex') ? card.getAttribute('tabindex') : '0');
    card.setAttribute('aria-haspopup', 'dialog');
    card.addEventListener('click', event => {
      if (event.target.closest('a, button')) return;
      event.preventDefault();
      openProject(card);
    });
    card.addEventListener('keydown', event => {
      if ((event.key === 'Enter' || event.key === ' ') && event.target === card) {
        event.preventDefault();
        openProject(card);
      }
    });
  });

  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    setStageAngle(0, 0);
    returnFocus?.focus();
  });
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && !finePointer.matches) return;
    dragPointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    stage.setPointerCapture?.(event.pointerId);
  });
  stage.addEventListener('pointermove', event => {
    if (!dialog.open || reducedMotion.matches) return;
    const rect = stage.getBoundingClientRect();
    if (dragPointer && dragPointer.id === event.pointerId) {
      const dx = event.clientX - dragPointer.x;
      const dy = event.clientY - dragPointer.y;
      dragPointer.x = event.clientX;
      dragPointer.y = event.clientY;
      const currentY = parseFloat(object.style.getPropertyValue('--stage-y')) || 0;
      const currentX = parseFloat(object.style.getPropertyValue('--stage-x')) || 0;
      setStageAngle(currentX - dy * .12, currentY + dx * .12);
      return;
    }
    if (event.pointerType !== 'mouse') return;
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    setStageAngle(-y * 9, x * 12);
  }, { passive: true });
  const endDrag = () => { dragPointer = null; };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  stage.addEventListener('pointerleave', () => {
    if (!dragPointer) setStageAngle(0, 0);
  });
})();
