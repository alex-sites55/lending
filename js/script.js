/* BLACKWOOD BARBERS: лёгкие нативные интеракции без зависимостей */
document.addEventListener('DOMContentLoaded', () => {
  // Local fallback is shown when the optional hero.mp4 has not been supplied.
  const heroVideo = document.querySelector('.hero__media video');
  const heroImage = document.querySelector('.hero__media img');
  if (heroImage) heroImage.src = 'img/hero.jpg';
  if (heroVideo) heroVideo.addEventListener('error', () => { heroVideo.style.display = 'none'; }, true);
  const preloader = document.querySelector('.preloader');
  window.addEventListener('load', () => setTimeout(() => preloader.classList.add('is-hidden'), 350));

  // Locations are a primary decision point for a network, so they sit right after the brand story.
  const locationsSection = document.querySelector('.locations');
  const aboutSection = document.querySelector('#about');
  if (locationsSection && aboutSection) aboutSection.after(locationsSection);
  const benefitsSection = document.querySelector('.benefits');
  const mastersSection = document.querySelector('#masters');
  if (benefitsSection && mastersSection) mastersSection.after(benefitsSection);
  const sectionNumbers = [
    ['.locations .section__label span', '02'], ['#services .section__label span', '03'],
    ['#masters .section__label span', '04'], ['.benefits .section__label span', '05'],
    ['#gallery .section__label span', '06'], ['.reviews .section__label span', '07'],
    ['#faq .section__label span', '08'], ['#contacts .section__label span', '09']
  ];
  sectionNumbers.forEach(([selector, number]) => { const label = document.querySelector(selector); if (label) label.textContent = number; });

  // A real, interactive Yandex Maps embed centred on the stated address.
  const map = document.querySelector('.map');
  if (map) map.innerHTML = `
    <iframe title="BLACKWOOD BARBERS на Яндекс Картах" loading="lazy" allowfullscreen
      src="https://yandex.ru/map-widget/v1/?ll=37.600129%2C55.757445&z=16&pt=37.600129%2C55.757445%2Cpm2am"></iframe>
    <a class="map__map-caption" href="https://yandex.ru/maps/?text=Москва%2C%20Большая%20Никитская%2C%2022" target="_blank" rel="noopener">Открыть в Яндекс Картах ↗</a>`;

  // One network, several spaces: the selected branch updates the live map.
  const branchData = {
    'Патриаршие': { phone: '+74951234567', masters: [['Алексей Белов', 'Ведущий барбер · 9 лет опыта', 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=900&q=85'], ['Максим Орлов', 'Барбер-стилист · 7 лет опыта', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&q=85'], ['Дмитрий Волков', 'Барбер · 5 лет опыта', 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=85']], prices: ['3 500 ₽', '5 500 ₽', '3 000 ₽', '2 500 ₽'] },
    'Москва-Сити': { phone: '+74951234568', masters: [['Илья Соколов', 'Топ-барбер · 11 лет опыта', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85'], ['Роман Ким', 'Барбер-стилист · 6 лет опыта', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=85'], ['Арсений Громов', 'Барбер · 4 года опыта', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85']], prices: ['4 200 ₽', '6 400 ₽', '3 600 ₽', '2 900 ₽'] },
    'Хамовники': { phone: '+74951234569', masters: [['Егор Смирнов', 'Ведущий барбер · 8 лет опыта', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=85'], ['Никита Морозов', 'Барбер-стилист · 5 лет опыта', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=900&q=85'], ['Тимур Алиев', 'Барбер · 4 года опыта', 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=900&q=85']], prices: ['3 800 ₽', '5 900 ₽', '3 300 ₽', '2 700 ₽'] }
  };
  const updateBranchOffer = card => {
    const branch = card.querySelector('.location-card__city')?.textContent.trim();
    const data = branchData[branch];
    if (!data) return;
    const mastersGrid = document.querySelector('.masters__grid');
    const servicesList = document.querySelector('.services__list');
    [mastersGrid, servicesList].forEach(element => element?.classList.add('is-switching'));
    window.setTimeout(() => {
      document.querySelectorAll('.master').forEach((master, index) => {
        const [name, role, image] = data.masters[index] || [];
        const title = master.querySelector('h3'), subtitle = master.querySelector('p');
        if (title) title.textContent = name;
        if (subtitle) subtitle.textContent = role;
        const portrait = master.querySelector('img');
        if (portrait && image) { portrait.src = image; portrait.alt = `${name}, ${role}`; }
      });
      document.querySelectorAll('.services__list article strong').forEach((price, index) => { price.textContent = data.prices[index] || price.textContent; });
      document.querySelectorAll('.branch-booking-link').forEach(link => { link.href = `tel:${data.phone}`; link.textContent = `Записаться — ${branch}`; });
      const primaryBooking = document.querySelector('.booking .btn');
      if (primaryBooking) { primaryBooking.href = `tel:${data.phone}`; primaryBooking.firstChild.textContent = `Записаться — ${branch} `; }
      [mastersGrid, servicesList].forEach(element => element?.classList.remove('is-switching'));
    }, 180);
  };
  const locationCards = document.querySelectorAll('.location-card');
  locationCards.forEach(card => {
    const branch = card.querySelector('.location-card__city')?.textContent.trim();
    const office = document.createElement('div');
    office.className = 'location-office';
    card.before(office); office.append(card);
    const bookingLink = document.createElement('a');
    bookingLink.className = 'location-card__booking branch-booking-link';
    bookingLink.href = `tel:${branchData[branch]?.phone || ''}`;
    bookingLink.innerHTML = `Записаться в ${branch} <span>↗</span>`;
    office.append(bookingLink);
  });
  locationCards.forEach(card => card.addEventListener('click', () => {
    locationCards.forEach(item => { item.classList.remove('is-active'); item.setAttribute('aria-pressed', 'false'); });
    card.classList.add('is-active');
    card.setAttribute('aria-pressed', 'true');
    const lat = card.dataset.lat, lon = card.dataset.lon, address = card.dataset.address;
    const mapFrame = map?.querySelector('iframe'), mapLink = map?.querySelector('.map__map-caption');
    if (mapFrame) mapFrame.src = `https://yandex.ru/map-widget/v1/?ll=${lon}%2C${lat}&z=16&pt=${lon}%2C${lat}%2Cpm2am`;
    if (mapLink) mapLink.href = `https://yandex.ru/maps/?text=${encodeURIComponent(address)}`;
    const addressLine = document.querySelector('.contacts address p');
    if (addressLine) addressLine.textContent = address;
    updateBranchOffer(card);
  }));
  if (locationCards[0]) updateBranchOffer(locationCards[0]);

  // Animate FAQ answers with a contained grid transition, retaining native semantics.
  document.querySelectorAll('.accordion details').forEach((item, index) => {
    const summary = item.querySelector('summary'), answer = item.querySelector('p');
    if (!summary || !answer) return;
    summary.setAttribute('aria-expanded', String(item.open));
    const wrapper = document.createElement('div');
    wrapper.className = 'faq-answer';
    answer.before(wrapper);
    wrapper.append(answer);
    item.addEventListener('toggle', () => {
      summary.setAttribute('aria-expanded', String(item.open));
      if (item.open) document.querySelectorAll('.accordion details[open]').forEach(other => { if (other !== item) other.open = false; });
    });
    item.style.transitionDelay = `${index * 45}ms`;
  });

  // A fine progress line makes long-form scrolling feel intentional.
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);

  // Mobile navigation
  const toggle = document.querySelector('.menu-toggle'), nav = document.querySelector('.nav');
  toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', open); });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }));

  // Reveal elements only when they enter the viewport.
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .14 });
  document.querySelectorAll('.reveal').forEach((item, index) => {
    item.style.transitionDelay = `${Math.min((index % 4) * 65, 195)}ms`;
    observer.observe(item);
  });

  // Count up statistics after their container is visible.
  const counterObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting) return; entry.target.querySelectorAll('[data-count]').forEach(el => {
    const target = Number(el.dataset.count), decimal = el.dataset.decimal === 'true', suffix = el.dataset.suffix || '', duration = 1600, start = performance.now();
    const step = now => { const p = Math.min((now - start) / duration, 1); const eased = 1 - Math.pow(1 - p, 3); const value = target * eased; el.textContent = (decimal ? value.toFixed(1) : Math.round(value).toLocaleString('ru-RU')) + suffix; if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }); counterObserver.unobserve(entry.target); }), { threshold: .5 });
  const stats = document.querySelector('.stats'); if (stats) counterObserver.observe(stats);

  // Cursor ambience and restrained hero parallax.
  const glow = document.querySelector('.cursor-glow'), heroMedia = document.querySelector('.hero__media');
  window.addEventListener('pointermove', e => { glow.style.left = `${e.clientX}px`; glow.style.top = `${e.clientY}px`; });
  window.addEventListener('scroll', () => {
    if (heroMedia) heroMedia.style.translate = `0 ${window.scrollY * .22}px`;
    document.querySelector('.header').classList.toggle('is-scrolled', window.scrollY > 30);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max ? (window.scrollY / max) * 100 : 0}%`;
  }, { passive: true });

  // Magnetic, but restrained, movement on the primary actions.
  if (window.matchMedia('(pointer:fine)').matches) document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mousemove', event => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      button.style.translate = `${x * 8}px ${y * 6}px`;
    });
    button.addEventListener('mouseleave', () => { button.style.translate = ''; });
  });

  // A subtle 3D card response, disabled for coarse pointers.
  if (window.matchMedia('(pointer:fine)').matches) document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => { const r = card.getBoundingClientRect(), x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5; card.style.transform = `perspective(800px) rotateX(${-y*4}deg) rotateY(${x*4}deg) translateY(-4px)`; });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });

  // Gallery lightbox with keyboard-friendly close behaviour.
  const lightbox = document.querySelector('.lightbox'), lightboxImg = lightbox.querySelector('img');
  document.querySelectorAll('.gallery-item').forEach(item => item.addEventListener('click', () => { lightboxImg.src = item.dataset.image; lightboxImg.alt = item.querySelector('img').alt; lightbox.classList.add('is-open'); lightbox.setAttribute('aria-hidden', 'false'); }));
  const closeLightbox = () => { lightbox.classList.remove('is-open'); lightbox.setAttribute('aria-hidden', 'true'); };
  lightbox.querySelector('button').addEventListener('click', closeLightbox); lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
});
