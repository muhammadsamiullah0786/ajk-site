
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(()=> {
    const p = document.getElementById('preloader');
    if(p) p.style.opacity = '0';
    setTimeout(()=> p && (p.style.display='none'), 450);
    document.getElementById('year').textContent = new Date().getFullYear();
  }, 500);

  const hero = new Swiper('.hero-swiper', {
    loop: true,
    autoplay: { delay: 1000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    effect: 'fade',
    speed: 700,
    fadeEffect: { crossFade: true }
  });

  const services = new Swiper('.services-swiper', {
    slidesPerView: 1.05,
    spaceBetween: 14,
    loop: false,
    breakpoints: {
      480: { slidesPerView: 1.2 },
      640: { slidesPerView: 2.1 },
      900: { slidesPerView: 3.2 },
      1200: { slidesPerView: 4 }
    },
    pagination: { el: '.services-pagination', clickable: true }
  });

  const heroEl = document.querySelector('.hero-swiper');
  if(heroEl){
    heroEl.addEventListener('mouseenter', ()=> hero.autoplay.stop());
    heroEl.addEventListener('mouseleave', ()=> hero.autoplay.start());
  }

  const mobileBtn = document.getElementById('mobileMenuBtn');
  mobileBtn && mobileBtn.addEventListener('click', function(){
    const nav = document.querySelector('.nav');
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    if(nav) nav.style.display = expanded ? 'none' : 'flex';
  });

  const leadForm = document.getElementById('leadForm');
  const API_ENDPOINT = ''; // set to your backend URL if you have one

  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('formStatus');
    status.textContent = 'Submitting...';

    const formData = new FormData(leadForm);

    try {
      if(API_ENDPOINT){
        const res = await fetch(API_ENDPOINT, { method:'POST', body: formData });
        if(!res.ok) throw new Error('Network error');
        status.textContent = 'Thank you! We will contact you shortly.';
        leadForm.reset();
      } else {
        const plain = {};
        formData.forEach((v,k) => { plain[k] = v; });
        console.log('Lead (no-backend):', plain);
        status.textContent = 'Form captured locally (no backend). Check console or connect API.';
        leadForm.reset();
      }
    } catch (err){
      console.error(err);
      status.textContent = 'Submission failed. Try again later.';
    }
  });

});
