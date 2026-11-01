'use strict';
const works = [
  {
    "title": "Орнамент на предплечье",
    "width": 1080,
    "height": 1440,
    "src": "assets/work-6.webp"
  },
  {
    "title": "Графика на шее",
    "width": 1080,
    "height": 1440,
    "src": "assets/work-2.webp"
  },
  {
    "title": "Паук",
    "width": 1080,
    "height": 1191,
    "src": "assets/work-4.webp"
  },
  {
    "title": "Линии на руке",
    "width": 1080,
    "height": 1441,
    "src": "assets/work-5.webp"
  },
  {
    "title": "Орнамент и бабочка",
    "width": 1280,
    "height": 1475,
    "src": "assets/work-3.webp"
  },
  {
    "title": "Надпись на предплечье",
    "width": 640,
    "height": 480,
    "src": "assets/work-1.webp"
  },
  {
    "title": "Ветка сакуры",
    "width": 640,
    "height": 427,
    "src": "assets/work-7.webp"
  }
];
const gallery = document.querySelector('#gallery');
const dialog = document.querySelector('#lightbox');
let activeIndex = 0;
let returnFocus;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let closeTimer;
function closeViewer() {
  if (!dialog.open || dialog.classList.contains('closing')) return;
  if (reducedMotion.matches) { dialog.close(); return; }
  dialog.classList.add('closing');
  closeTimer = window.setTimeout(() => { dialog.close(); dialog.classList.remove('closing'); }, 200);
}
function showWork(index) {
  if (!works.length) return;
  activeIndex = (index + works.length) % works.length;
  const work = works[activeIndex];
  const image = document.querySelector('#viewer-image');
  image.getAnimations().forEach(animation => animation.cancel());
  if (dialog.open && !reducedMotion.matches) image.animate([{ opacity: .15, transform: 'translateY(10px) scale(.985)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 330, easing: 'cubic-bezier(.2,.7,.3,1)' });
  document.querySelector('#viewer-image').src = work.src;
  document.querySelector('#viewer-image').alt = work.title;
  document.querySelector('#viewer-caption').textContent = work.title + ' · ' + (activeIndex + 1) + ' / ' + works.length;
}
works.forEach((work, index) => {
  const button = document.createElement('button');
  button.className = 'work';
  button.setAttribute('aria-label', 'Увеличить фото: ' + work.title);
  const frame = document.createElement('div'); frame.className = 'work-image';
  const img = document.createElement('img'); img.src = work.src; img.alt = work.title; img.width = work.width || 800; img.height = work.height || 1000; img.loading = 'lazy'; img.decoding = 'async';
  const icon = document.createElement('span'); icon.className = 'work-overlay'; icon.innerHTML = "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M6 18 18 6M6 6h12v12\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>"; icon.setAttribute('aria-hidden', 'true');
  frame.append(img, icon);
  const caption = document.createElement('span'); caption.className = 'work-caption';
  const title = document.createElement('span'); title.textContent = work.title;
  const type = document.createElement('small'); type.textContent = 'KKTATOO'; caption.append(title, type);
  button.append(frame, caption);
  button.addEventListener('click', () => { returnFocus = button; window.clearTimeout(closeTimer); dialog.classList.remove('closing'); showWork(index); dialog.showModal(); });
  gallery.append(button);
});
if (works.length) {
  const hero = document.querySelector('#hero-photo');
  hero.src = works[0].src; hero.alt = works[0].title;
} else { document.querySelector('.hero-photo').classList.add('logo-mode'); }
document.querySelector('.close-viewer').addEventListener('click', closeViewer);
document.querySelector('.viewer-prev').addEventListener('click', () => showWork(activeIndex - 1));
document.querySelector('.viewer-next').addEventListener('click', () => showWork(activeIndex + 1));
dialog.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') { e.preventDefault(); showWork(activeIndex - 1); } if (e.key === 'ArrowRight') { e.preventDefault(); showWork(activeIndex + 1); } });
dialog.addEventListener('click', e => { if (e.target === dialog) closeViewer(); });
dialog.addEventListener('close', () => { if (returnFocus) returnFocus.focus(); });

dialog.addEventListener('cancel', e => { e.preventDefault(); closeViewer(); });
dialog.addEventListener('close', () => { window.clearTimeout(closeTimer); dialog.classList.remove('closing'); });
const revealTargets = document.querySelectorAll('.section-heading, .work, .channel-link, .about-identity, .about-copy, .steps article, .contact-card');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
  }, { threshold: .08 });
  revealTargets.forEach((element, index) => { element.classList.add('reveal'); element.style.setProperty('--reveal-delay', (element.classList.contains('work') ? index % 3 * 65 : 0) + 'ms'); observer.observe(element); });
  reducedMotion.addEventListener('change', event => { if (event.matches) { observer.disconnect(); revealTargets.forEach(element => element.classList.add('is-visible')); } });
}
