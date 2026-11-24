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

// Progressive scroll reveals; content stays visible when observers are unavailable.
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
