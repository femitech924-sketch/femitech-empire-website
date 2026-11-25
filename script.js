const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

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
  emptyProjects.hidden = visible !== 0;
}));

document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
  const select = document.querySelector('select[name="service"]');
  select.value = link.dataset.service;
}));

const form = document.getElementById('project-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  const fields = [...form.querySelectorAll('input, select, textarea')];
  let valid = true;
  fields.forEach(field => {
    const error = field.parentElement.querySelector('.error');
    error.textContent = '';
    field.classList.remove('invalid');
    let message = '';
    if (!field.value.trim()) message = 'This field is required.';
    else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) message = 'Please enter a valid email address.';
    if (message) {
      valid = false;
      field.classList.add('invalid');
      error.textContent = message;
    }
  });
  const status = form.querySelector('.form-success');
  status.textContent = '';
  if (!valid) {
    form.querySelector('.invalid').focus();
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
  status.textContent = 'Your inquiry is ready. WhatsApp will open so you can send it to our team.';
  window.open(`https://wa.me/2348155918065?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});

const chatTrigger = document.getElementById('chat-trigger');
const chatPanel = document.getElementById('chat-panel');
const chatClose = document.getElementById('chat-close');
function toggleChat(open) {
  chatPanel.hidden = !open;
  chatTrigger.setAttribute('aria-expanded', String(open));
  chatTrigger.querySelector('.chat-label').textContent = open ? 'CLOSE ASSISTANT' : 'AI ASSISTANT';
}
chatTrigger.addEventListener('click', () => toggleChat(chatPanel.hidden));
chatClose.addEventListener('click', () => toggleChat(false));

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

// Progressive scroll reveals; keep content visible if observers are unavailable or delayed.
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
  window.setTimeout(() => revealTargets.forEach(element => element.classList.add('is-visible')), 2400);
})();

// Build the Selected Works gallery inside the existing projects section.
(() => {
  const projectSection = document.querySelector('#projects');
  if (!projectSection) return;

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = 'selected-works.css';
  document.head.append(stylesheet);

  // Poster artwork is shown until the real, separately supplied service clips are connected.
  // No video source URLs are fabricated; source elements are added only after clips exist.
  const servicePreviews = [
    ['Graphics Design', 'assets/file_0000000029b48210ac82bbed2769c0e3.png'],
    ['Website Design', 'assets/file_00000000733c81f4b21dc0990f3012a0.png'],
    ['Video Editing', 'assets/file_00000000b5e481f4b728194098b1818d.png'],
    ['AI Content Creation', 'assets/file_00000000e6d48210acc3e4a6afa0f53e.png'],
    ['Digital Ads', 'assets/file_00000000f7c081f4990cbb176b6b0177.png'],
    ['Jingles & Promo Videos', 'assets/file_00000000b5e481f4b728194098b1818d.png']
  ];
  const servicePreviewStyles = document.createElement('style');
  servicePreviewStyles.textContent = '.service-preview{position:relative;display:block;width:100%;height:104px;margin:12px 0 16px;overflow:hidden;border:1px solid rgba(126,164,236,.28);background:#0b1730}.service-preview video{display:block;width:100%;height:100%;object-fit:cover;object-position:center}.service-preview:after{position:absolute;inset:auto 0 0;height:35%;content:"";pointer-events:none;background:linear-gradient(transparent,rgba(5,13,28,.32))}@media(max-width:760px){.service-preview{height:clamp(100px,32vw,160px)}}';
  document.head.append(servicePreviewStyles);

  const serviceCards = [...document.querySelectorAll('.service-grid .service-card')];
  servicePreviews.forEach(([serviceName, posterPath]) => {
    const card = serviceCards.find(item => item.querySelector('h3')?.textContent.trim() === serviceName);
    if (!card || card.querySelector('.service-preview')) return;

    const frame = document.createElement('div');
    frame.className = 'service-preview';
    const video = document.createElement('video');
    video.className = 'service-preview-video';
    video.dataset.servicePreview = serviceName;
    video.poster = posterPath;
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = 'none';
    video.setAttribute('aria-label', `${serviceName} video preview`);
    frame.append(video);
    card.querySelector('.service-icon')?.after(frame);
  });

  // If sources are subsequently supplied, only load/play them near the viewport and
  // never autoplay for visitors who request reduced motion. Empty videos stay on poster.
  const previewVideos = [...document.querySelectorAll('.service-preview-video')];
  const hasSource = video => Boolean(video.currentSrc || video.src || video.querySelector('source[src]'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const playVisibleVideo = video => {
    if (hasSource(video) && !reducedMotion.matches) video.play().catch(() => {});
  };
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) playVisibleVideo(video);
      else video.pause();
    }), { rootMargin: '120px 0px', threshold: 0.1 });
    previewVideos.forEach(video => videoObserver.observe(video));
  } else {
    previewVideos.forEach(playVisibleVideo);
  }
  reducedMotion.addEventListener?.('change', () => previewVideos.forEach(video => {
    if (reducedMotion.matches) video.pause();
    else playVisibleVideo(video);
  }));

  const items = [
    { title: 'Graphics Design', category: 'Graphics Design', description: 'Distinctive visual identities and thoughtful graphic work, built to make every brand memorable.', image: 'assets/file_0000000029b48210ac82bbed2769c0e3.png' },
    { title: 'Website Design', category: 'Website Design', description: 'Modern digital experiences that bring ideas online with clarity, character and purpose.', image: 'assets/file_00000000733c81f4b21dc0990f3012a0.png' },
    { title: 'Video Editing', category: 'Video Editing', description: 'Polished visual stories shaped to hold attention and bring a message to life.', image: 'assets/file_00000000b5e481f4b728194098b1818d.png' },
    { title: 'AI Content Creation', category: 'AI Content Creation', description: 'Imaginative AI-assisted content exploring new creative possibilities and visual directions.', image: 'assets/file_00000000e6d48210acc3e4a6afa0f53e.png' },
    { title: 'Digital Ads', category: 'Digital Ads', description: 'Campaign-ready advertising creative designed to make the message stand out.', image: 'assets/file_00000000f7c081f4990cbb176b6b0177.png' },
    { title: 'Book Design', category: 'Book Design', description: 'Carefully composed covers and book visuals that invite readers into the story.', image: 'assets/file_00000000fb4481f4891e6a6072ab4ece.png' }
  ];
  const overviewImage = 'assets/file_00000000150081f49564f2117a2cad8d.png';
  const gallery = document.createElement('div');
  gallery.className = 'selected-works';
  gallery.innerHTML = `
    <div class="selected-overview">
      <button class="selected-image-button selected-overview-image" type="button" data-preview-src="${overviewImage}" data-preview-alt="FEMITECH EMPIRE Selected Works overview">
        <img src="${overviewImage}" alt="FEMITECH EMPIRE creative portfolio overview" loading="lazy" decoding="async">
        <span class="selected-image-hint">VIEW PROJECT ↗</span>
      </button>
      <div class="selected-overview-copy"><span class="selected-eyebrow">FEMITECH EMPIRE / CREATIVE PORTFOLIO</span><h3>Ideas, made<br><span>visible.</span></h3><p>A closer look at the creative work we do across design, digital experiences, motion and publishing.</p><span class="selected-index">SELECTED WORKS <b> / 2026</b></span></div>
    </div>
    <div class="selected-heading"><div><span class="selected-eyebrow">A RANGE OF CREATIVE DISCIPLINES</span><h3>Explore our work.</h3></div><p>Six ways we help ideas take shape and make an impact.</p></div>
    <div class="selected-filters" role="group" aria-label="Filter selected works"><button class="selected-filter is-active" type="button" data-work-filter="All">ALL WORK</button>${items.map(item => `<button class="selected-filter" type="button" data-work-filter="${item.category}">${item.category.toUpperCase()}</button>`).join('')}</div>
    <div class="selected-grid">${items.map((item, index) => `<article class="selected-work-card" data-work-category="${item.category}" style="--work-delay:${index * 70}ms"><button class="selected-image-button selected-card-image" type="button" data-preview-src="${item.image}" data-preview-alt="${item.title} portfolio preview"><img src="${item.image}" alt="${item.title} portfolio work" loading="lazy" decoding="async"><span class="selected-image-hint">VIEW PROJECT ↗</span><span class="selected-card-number">0${index + 1}</span></button><div class="selected-card-copy"><span class="selected-card-category">${item.category}</span><h4>${item.title}</h4><p>${item.description}</p></div></article>`).join('')}</div>
    <dialog class="selected-preview" aria-label="Portfolio image preview"><button class="selected-preview-close" type="button" aria-label="Close image preview">×</button><img alt="" src=""><p></p></dialog>`;

  const sectionTop = projectSection.querySelector('.section-top');
  if (sectionTop) {
    sectionTop.innerHTML = '<div><span class="selected-eyebrow">03 / SELECTED WORK</span><h2>MADE TO MAKE<br><span>AN IMPACT.</span></h2></div><p>A considered collection of creative work across six disciplines. Select an image for a closer look.</p>';
  }
  const legacyFilters = projectSection.querySelector('.filters');
  projectSection.insertBefore(gallery, legacyFilters || projectSection.querySelector('.live-project'));

  const filterControls = [...gallery.querySelectorAll('[data-work-filter]')];
  const cards = [...gallery.querySelectorAll('.selected-work-card')];
  filterControls.forEach(control => control.addEventListener('click', () => {
    filterControls.forEach(button => button.classList.toggle('is-active', button === control));
    cards.forEach(card => { card.hidden = control.dataset.workFilter !== 'All' && card.dataset.workCategory !== control.dataset.workFilter; });
  }));

  const preview = gallery.querySelector('.selected-preview');
  const previewImage = preview.querySelector('img');
  const previewCaption = preview.querySelector('p');
  gallery.querySelectorAll('[data-preview-src]').forEach(button => button.addEventListener('click', () => {
    previewImage.src = button.dataset.previewSrc;
    previewImage.alt = button.dataset.previewAlt;
    previewCaption.textContent = button.dataset.previewAlt;
    preview.showModal();
  }));
  preview.querySelector('.selected-preview-close').addEventListener('click', () => preview.close());
  preview.addEventListener('click', event => { if (event.target === preview) preview.close(); });
  preview.addEventListener('close', () => { previewImage.removeAttribute('src'); });

  const galleryRevealTargets = gallery.querySelectorAll('.selected-overview, .selected-heading, .selected-work-card');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
    }), { threshold: 0.12 });
    galleryRevealTargets.forEach(element => revealObserver.observe(element));
    window.setTimeout(() => galleryRevealTargets.forEach(element => element.classList.add('is-visible')), 3000);
  } else {
    galleryRevealTargets.forEach(element => element.classList.add('is-visible'));
  }
})();
