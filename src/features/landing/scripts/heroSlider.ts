// Lógica interactiva del slider de tienda
export function initHeroSliders() {
  const sliders = document.querySelectorAll<HTMLElement>('[data-hero-slider]');

  sliders.forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll<HTMLElement>('[data-hero-slide]'));
    const dots = Array.from(slider.querySelectorAll<HTMLButtonElement>('[data-slider-dot]'));
    const prevBtn = slider.querySelector<HTMLButtonElement>('[data-slider-prev]');
    const nextBtn = slider.querySelector<HTMLButtonElement>('[data-slider-next]');

    if (slides.length <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      return;
    }

    let currentIndex = 0;
    let timer: number | undefined;

    function goTo(index: number) {
      slides[currentIndex]?.setAttribute('data-active', 'false');
      dots[currentIndex]?.setAttribute('data-active', 'false');

      currentIndex = (index + slides.length) % slides.length;

      slides[currentIndex]?.setAttribute('data-active', 'true');
      dots[currentIndex]?.setAttribute('data-active', 'true');
    }

    function startAuto() {
      stopAuto();
      timer = window.setInterval(() => goTo(currentIndex + 1), 6000);
    }

    function stopAuto() {
      if (timer) clearInterval(timer);
    }

    prevBtn?.addEventListener('click', () => {
      goTo(currentIndex - 1);
      startAuto();
    });

    nextBtn?.addEventListener('click', () => {
      goTo(currentIndex + 1);
      startAuto();
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goTo(idx);
        startAuto();
      });
    });

    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);

    startAuto();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroSliders);
} else {
  initHeroSliders();
}
