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
    'Hello FEMITECH EMPIRE, I would like to make a project inquiry.', '',
    `Name: ${data.get('name')}`, `Email: ${data.get('email')}`,
    `Phone / WhatsApp: ${data.get('phone')}`, `Service: ${data.get('service')}`,
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
      if (entry.isIntersecting) navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => observer.observe(section));
}

// Progressive scroll reveals; without observer support, content remains visible.
(() => {
  const revealTargets = document.querySelectorAll('.intro-grid, .pillars article, .service-card, .section-top, .project-card, .live-project, .book-card, .creative-copy, .creative-art, .process-grid article, .founder-image, .founder-copy, .contact-copy, .contact-form');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('reveal-ready');
  revealTargets.forEach((element, index) => {
    element.classList.add('reveal');
    element.style.transitionDelay = `${(index % 4) * 75}ms`;
  });
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }), { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  revealTargets.forEach(element => revealObserver.observe(element));
})();

// Progressive enhancement: the original design and controls still work if this fails to load.
(() => {
  ['premium.css', 'experience.css'].forEach(href => {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = href;
    document.head.appendChild(style);
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const tiltTargets = [...document.querySelectorAll('.project-card, .service-card')];
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  tiltTargets.forEach(card => {
    const reset = () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
      card.style.setProperty('--light-x', '50%');
      card.style.setProperty('--light-y', '0%');
    };
    card.addEventListener('pointermove', event => {
      if (reducedMotion.matches || event.pointerType !== 'mouse' || !finePointer.matches) return;
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const px = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const py = clamp((event.clientY - rect.top) / rect.height, 0, 1);
      card.style.setProperty('--tilt-y', `${((px - .5) * 5).toFixed(2)}deg`);
      card.style.setProperty('--tilt-x', `${((.5 - py) * 4).toFixed(2)}deg`);
      card.style.setProperty('--light-x', `${(px * 100).toFixed(1)}%`);
      card.style.setProperty('--light-y', `${(py * 100).toFixed(1)}%`);
    }, { passive: true });
    card.addEventListener('pointerleave', reset, { passive: true });
    card.addEventListener('blur', reset, true);
  });

  // Existing project artwork is presented as-is in a keyboard-accessible showcase.
  const projectDialog = document.createElement('dialog');
  projectDialog.className = 'project-showcase';
  projectDialog.setAttribute('aria-label', 'Project presentation');
  projectDialog.innerHTML = '<div class="showcase-shell"><header class="showcase-head"><div><p class="showcase-kicker"></p><h2 class="showcase-title"></h2></div><button class="showcase-close" type="button" aria-label="Close project presentation">×</button></header><div class="showcase-stage"><div class="showcase-object"><div class="showcase-art"></div></div></div><div class="showcase-copy"><p class="showcase-description"></p><p class="showcase-hint">Move or drag to explore</p></div></div>';
  document.body.appendChild(projectDialog);
  const projectClose = projectDialog.querySelector('.showcase-close');
  const stage = projectDialog.querySelector('.showcase-stage');
  const object = projectDialog.querySelector('.showcase-object');
  let projectReturnFocus = null;
  let dragPointer = null;
  const setStageAngle = (x, y) => {
    object.style.setProperty('--stage-x', `${clamp(x, -10, 10).toFixed(2)}deg`);
    object.style.setProperty('--stage-y', `${clamp(y, -14, 14).toFixed(2)}deg`);
  };
  const openProject = card => {
    const artwork = card.querySelector('.project-art');
    const info = card.querySelector('.project-info');
    if (!artwork || !info) return;
    projectDialog.querySelector('.showcase-kicker').textContent = card.dataset.category || 'Project';
    projectDialog.querySelector('.showcase-title').textContent = info.querySelector('h3')?.textContent.trim() || 'Selected work';
    projectDialog.querySelector('.showcase-description').textContent = info.querySelector('p')?.textContent.trim() || 'A selected creative direction by FEMITECH EMPIRE.';
    const host = projectDialog.querySelector('.showcase-art');
    host.replaceChildren(artwork.cloneNode(true));
    host.firstElementChild?.classList.remove('project-art');
    projectReturnFocus = card;
    setStageAngle(2, -4);
    if (!projectDialog.open) projectDialog.showModal();
    projectClose.focus();
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
  projectClose.addEventListener('click', () => projectDialog.close());
  projectDialog.addEventListener('click', event => { if (event.target === projectDialog) projectDialog.close(); });
  projectDialog.addEventListener('close', () => { setStageAngle(0, 0); projectReturnFocus?.focus(); });
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && !finePointer.matches) return;
    dragPointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    stage.setPointerCapture?.(event.pointerId);
  });
  stage.addEventListener('pointermove', event => {
    if (!projectDialog.open || reducedMotion.matches) return;
    const rect = stage.getBoundingClientRect();
    if (dragPointer && dragPointer.id === event.pointerId) {
      const dx = event.clientX - dragPointer.x;
      const dy = event.clientY - dragPointer.y;
      dragPointer.x = event.clientX; dragPointer.y = event.clientY;
      setStageAngle((parseFloat(object.style.getPropertyValue('--stage-x')) || 0) - dy * .12, (parseFloat(object.style.getPropertyValue('--stage-y')) || 0) + dx * .12);
    } else if (event.pointerType === 'mouse' && rect.width && rect.height) {
      setStageAngle(-((event.clientY - rect.top) / rect.height - .5) * 9, ((event.clientX - rect.left) / rect.width - .5) * 12);
    }
  }, { passive: true });
  ['pointerup', 'pointercancel'].forEach(type => stage.addEventListener(type, () => { dragPointer = null; }));
  stage.addEventListener('pointerleave', () => { if (!dragPointer) setStageAngle(0, 0); });

  // Service previews are original CSS process illustrations, not invented client work.
  const serviceCards = [...document.querySelectorAll('.service-card')].slice(0, 3);
  const serviceCopy = [
    { title: 'Graphics Design', kind: 'graphics', intro: 'A visual identity takes shape through considered composition, type and detail.', request: 'Graphics Design' },
    { title: 'Website Design', kind: 'website', intro: 'From responsive structure to polished interface, each screen is designed with purpose.', request: 'Website Design' },
    { title: 'Video Editing', kind: 'video', intro: 'A story finds its rhythm through intentional cuts, transitions and finishing.', request: 'Video Editing' }
  ];
  const makeVisual = kind => {
    const visual = document.createElement('div');
    visual.className = `service-visual service-visual-${kind}`;
    visual.setAttribute('aria-hidden', 'true');
    if (kind === 'graphics') visual.innerHTML = '<span class="visual-index">FE / DESIGN STUDIO</span><div class="design-sheet"><i class="sheet-orbit"></i><small>FORM • TYPE • IMAGE</small><b>IDEAS<br>INTO<br>FORM.</b><span>CREATIVE DIRECTION / 01</span></div><div class="design-note">LAYOUT<br><b>01—03</b></div><i class="visual-rule"></i>';
    if (kind === 'website') visual.innerHTML = '<span class="visual-index">DIGITAL / RESPONSIVE</span><div class="interface-window"><div class="interface-bar"><i></i><i></i><i></i><span>YOUR DIGITAL SPACE</span></div><div class="interface-layout"><div class="interface-copy"><small>DESIGNED FOR PEOPLE</small><b>Make room<br>for what’s next.</b><i></i></div><div class="interface-block"></div><div class="interface-line"></div></div></div><div class="device-frame"><i></i><b></b><span></span></div>';
    if (kind === 'video') visual.innerHTML = '<span class="visual-index">POST / PRODUCTION</span><div class="film-preview"><div class="film-light"></div><small>SEQUENCE 01 / PREVIEW</small><b>STORIES<br>IN MOTION.</b><span class="film-play">▶</span></div><div class="timeline"><i></i><i></i><i></i><i></i><span></span></div><div class="timeline-time">00:18:24&nbsp;&nbsp; • &nbsp;&nbsp;01:02:10</div>';
    return visual;
  };
  const serviceDialog = document.createElement('dialog');
  serviceDialog.className = 'service-cinema';
  serviceDialog.setAttribute('aria-labelledby', 'service-cinema-title');
  serviceDialog.innerHTML = '<div class="cinema-shell"><header class="cinema-head"><div><p class="cinema-kicker">FEMITECH EMPIRE / CREATIVE STUDIO</p><h2 id="service-cinema-title"></h2></div><button class="cinema-close" type="button" aria-label="Close service presentation">×</button></header><div class="cinema-stage"><div class="cinema-media"></div></div><div class="cinema-foot"><p class="cinema-description"></p><a class="btn btn-primary cinema-request" href="#contact">REQUEST THIS SERVICE <span>↗</span></a></div></div>';
  document.body.appendChild(serviceDialog);
  const cinemaClose = serviceDialog.querySelector('.cinema-close');
  const cinemaMedia = serviceDialog.querySelector('.cinema-media');
  let serviceReturnFocus = null;
  let activeServiceVideo = null;
  const openService = (card, index) => {
    const item = serviceCopy[index];
    if (!item) return;
    serviceReturnFocus = card.querySelector('.service-preview-trigger');
    serviceDialog.querySelector('#service-cinema-title').textContent = item.title;
    serviceDialog.querySelector('.cinema-description').textContent = item.intro;
    const request = serviceDialog.querySelector('.cinema-request');
    request.href = '#contact';
    request.dataset.service = item.request;
    request.textContent = 'REQUEST THIS SERVICE ↗';
    cinemaMedia.replaceChildren();
    const videoSrc = card.dataset.serviceVideo || '';
    const posterSrc = card.dataset.servicePoster || '';
    const imageSequence = (card.dataset.serviceSequence || '').split(',').map(path => path.trim()).filter(Boolean);
    if (videoSrc) {
      const video = document.createElement('video');
      video.className = 'cinema-video';
      video.controls = true; video.playsInline = true; video.preload = 'metadata';
      if (posterSrc) video.poster = posterSrc;
      const source = document.createElement('source');
      source.src = videoSrc; source.type = /\.webm(?:$|\?)/i.test(videoSrc) ? 'video/webm' : 'video/mp4';
      video.append(source); cinemaMedia.append(video); activeServiceVideo = video;
      video.play().catch(() => { /* Keep native controls available if autoplay is blocked. */ });
    } else if (imageSequence.length) {
      const sequence = document.createElement('div'); sequence.className = 'service-sequence';
      imageSequence.forEach((src, position) => {
        const image = document.createElement('img'); image.src = src; image.alt = `${item.title} process frame ${position + 1}`; image.loading = 'lazy';
        sequence.append(image);
      });
      cinemaMedia.append(sequence);
    } else {
      cinemaMedia.append(makeVisual(item.kind));
    }
    if (!serviceDialog.open) serviceDialog.showModal();
    cinemaClose.focus();
  };
  serviceCards.forEach((card, index) => {
    const item = serviceCopy[index];
    if (!item) return;
    const anchor = card.querySelector('a[data-service]');
    if (!card.querySelector('.service-visual')) card.insertBefore(makeVisual(item.kind), anchor || card.querySelector('h3'));
    const trigger = document.createElement('button');
    trigger.type = 'button'; trigger.className = 'service-preview-trigger';
    trigger.setAttribute('aria-label', `Explore ${item.title} visual presentation`);
    trigger.innerHTML = 'EXPLORE THE PROCESS <span aria-hidden="true">↗</span>';
    if (anchor) anchor.insertAdjacentElement('beforebegin', trigger); else card.append(trigger);
    trigger.addEventListener('click', () => openService(card, index));
    card.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') card.classList.add('service-active'); });
    card.addEventListener('pointerleave', () => card.classList.remove('service-active'));
    card.addEventListener('focusin', () => card.classList.add('service-active'));
    card.addEventListener('focusout', event => { if (!card.contains(event.relatedTarget)) card.classList.remove('service-active'); });
  });
  cinemaClose.addEventListener('click', () => serviceDialog.close());
  serviceDialog.addEventListener('click', event => { if (event.target === serviceDialog) serviceDialog.close(); });
  serviceDialog.addEventListener('close', () => {
    activeServiceVideo?.pause(); activeServiceVideo = null;
    serviceReturnFocus?.focus();
  });
  serviceDialog.querySelector('.cinema-request').addEventListener('click', event => {
    const select = document.querySelector('select[name="service"]');
    if (select) select.value = event.currentTarget.dataset.service;
    serviceDialog.close();
  });

  // Customer login is a branded front-end entry panel; connect a real auth endpoint before accepting credentials.
  const loginAudioSource = ''; // Add a small, licensed ambience MP3/WebM here when available.
  const loginLink = document.createElement('a');
  loginLink.href = '#customer-login'; loginLink.className = 'customer-login-link'; loginLink.textContent = 'CUSTOMER LOGIN';
  loginLink.setAttribute('aria-haspopup', 'dialog');
  const navCta = nav?.querySelector('.nav-cta');
  if (nav && navCta) nav.insertBefore(loginLink, navCta);
  const loginDialog = document.createElement('dialog');
  loginDialog.className = 'customer-login';
  loginDialog.setAttribute('aria-labelledby', 'login-title');
  loginDialog.innerHTML = '<div class="login-shell"><button class="login-close" type="button" aria-label="Close customer login">×</button><div class="login-atmosphere" aria-hidden="true"><span class="login-orbit"></span><span class="login-grid"></span></div><div class="login-brand"><img src="assets/femitech-empire-logo.png" alt="FEMITECH EMPIRE"><span>PRIVATE CLIENT WORKSPACE</span></div><div class="login-welcome"><p class="cinema-kicker">A SPACE FOR WHAT WE BUILD TOGETHER</p><h2 id="login-title">WELCOME<br><span>BACK.</span></h2><p>Your creative workspace, ready when you are.</p></div><form class="login-form"><label for="workspace-email">EMAIL ADDRESS</label><input id="workspace-email" name="email" type="email" autocomplete="username" placeholder="you@example.com" required><label for="workspace-password">PASSWORD</label><input id="workspace-password" name="password" type="password" autocomplete="current-password" placeholder="Enter your password" required><button class="btn btn-primary" type="submit">ENTER WORKSPACE <span aria-hidden="true">↗</span></button><p class="login-status" role="status" aria-live="polite"></p><p class="login-help">Need access? <a href="mailto:femitech924@gmail.com?subject=Customer%20workspace%20access">Contact our team</a></p></form><button class="login-sound" type="button" aria-label="Sound unavailable until an ambience track is added" disabled> SOUND OFF <span>•</span></button><audio class="login-audio" loop preload="none" aria-hidden="true"></audio></div>';
  document.body.appendChild(loginDialog);
  const loginClose = loginDialog.querySelector('.login-close');
  const loginSound = loginDialog.querySelector('.login-sound');
  const loginAudio = loginDialog.querySelector('.login-audio');
  let loginReturnFocus = null;
  if (loginAudioSource) {
    loginAudio.src = loginAudioSource;
    loginSound.disabled = false;
    loginSound.setAttribute('aria-label', 'Turn login ambience on');
    try { loginSound.dataset.enabled = sessionStorage.getItem('femitech-login-sound') === 'on' ? 'true' : 'false'; } catch { loginSound.dataset.enabled = 'false'; }
  }
  const setLoginSound = async enabled => {
    if (!loginAudioSource) return;
    loginSound.dataset.enabled = String(enabled);
    loginAudio.volume = 0.12;
    loginSound.setAttribute('aria-label', enabled ? 'Mute login ambience' : 'Enable login ambience');
    loginSound.innerHTML = `${enabled ? 'SOUND ON' : 'SOUND OFF'} <span aria-hidden="true">•</span>`;
    try { sessionStorage.setItem('femitech-login-sound', enabled ? 'on' : 'off'); } catch { /* Session preference is optional. */ }
    if (enabled) { try { await loginAudio.play(); } catch { loginSound.dataset.enabled = 'false'; } }
    else loginAudio.pause();
  };
  loginSound.addEventListener('click', () => setLoginSound(loginSound.dataset.enabled !== 'true'));
  loginLink.addEventListener('click', event => {
    event.preventDefault(); loginReturnFocus = loginLink;
    loginDialog.showModal();
    loginDialog.querySelector('.login-shell').classList.remove('is-entered');
    requestAnimationFrame(() => requestAnimationFrame(() => loginDialog.querySelector('.login-shell').classList.add('is-entered')));
    if (loginAudioSource && loginSound.dataset.enabled === 'true') setLoginSound(true);
    window.setTimeout(() => loginDialog.querySelector('#workspace-email').focus(), reducedMotion.matches ? 0 : 650);
  });
  loginClose.addEventListener('click', () => loginDialog.close());
  loginDialog.addEventListener('click', event => { if (event.target === loginDialog) loginDialog.close(); });
  loginDialog.addEventListener('close', () => {
    loginAudio.pause(); loginAudio.currentTime = 0;
    loginDialog.querySelector('.login-shell').classList.remove('is-entered');
    loginReturnFocus?.focus();
  });
  loginDialog.querySelector('.login-form').addEventListener('submit', event => {
    event.preventDefault();
    loginDialog.querySelector('.login-status').textContent = 'Customer sign-in is not connected yet. Please contact our team to access your workspace.';
  });
})();
