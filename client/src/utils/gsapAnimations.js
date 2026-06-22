import gsap from 'gsap';

/* ═══════════════════════════════════════════════════════
   EVENTIFY — GSAP ANIMATION UTILITIES
   ═══════════════════════════════════════════════════════ */

/**
 * Animate a page container on mount — fade in + slide up
 */
export const animatePageEnter = (containerRef) => {
  if (!containerRef?.current) return;
  gsap.fromTo(
    containerRef.current,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
  );
};

/**
 * Stagger-reveal grid items (cards) one by one
 */
export const animateStaggerCards = (selector, containerRef) => {
  if (!containerRef?.current) return;
  const cards = containerRef.current.querySelectorAll(selector);
  if (!cards.length) return;
  gsap.fromTo(
    cards,
    { opacity: 0, y: 50, scale: 0.95 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out',
    }
  );
};

/**
 * Hero section entrance animation
 */
export const animateHero = (elements) => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  if (elements.title) {
    tl.fromTo(elements.title, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 });
  }
  if (elements.subtitle) {
    tl.fromTo(elements.subtitle, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.5');
  }
  if (elements.search) {
    tl.fromTo(elements.search, { opacity: 0, y: 20, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.5 }, '-=0.3');
  }
  if (elements.filters) {
    tl.fromTo(elements.filters, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2');
  }
  return tl;
};

/**
 * Animate a form card entrance — scale up from 0.92 with blur effect
 */
export const animateFormEntrance = (cardRef) => {
  if (!cardRef?.current) return;
  gsap.fromTo(
    cardRef.current,
    { opacity: 0, scale: 0.92, y: 30 },
    { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.4)' }
  );
};

/**
 * Navbar entrance — slides in from top
 */
export const animateNavbar = (navRef) => {
  if (!navRef?.current) return;
  gsap.fromTo(
    navRef.current,
    { y: -80, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.1 }
  );
};

/**
 * 3D tilt effect on hover for cards
 * Attach to onMouseMove and onMouseLeave
 */
export const handle3DTilt = (e, cardElement) => {
  if (!cardElement) return;
  const rect = cardElement.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateX = ((y - centerY) / centerY) * -4;
  const rotateY = ((x - centerX) / centerX) * 4;

  gsap.to(cardElement, {
    rotateX,
    rotateY,
    transformPerspective: 1000,
    duration: 0.3,
    ease: 'power2.out',
  });
};

export const reset3DTilt = (cardElement) => {
  if (!cardElement) return;
  gsap.to(cardElement, {
    rotateX: 0,
    rotateY: 0,
    duration: 0.5,
    ease: 'power3.out',
  });
};

/**
 * Animated number counter
 */
export const animateCounter = (element, targetValue, duration = 1.5) => {
  if (!element) return;
  const obj = { val: 0 };
  gsap.to(obj, {
    val: targetValue,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = Math.round(obj.val);
    },
  });
};

/**
 * Animate blobs with random floating
 */
export const animateBlobs = (containerRef) => {
  if (!containerRef?.current) return;
  const blobs = containerRef.current.querySelectorAll('.glow-blob');
  blobs.forEach((blob, i) => {
    gsap.to(blob, {
      x: `random(-50, 50)`,
      y: `random(-40, 40)`,
      scale: `random(0.9, 1.15)`,
      duration: `random(6, 10)`,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.5,
    });
  });
};

/**
 * Button hover magnetic effect — subtle follow cursor
 */
export const magneticButton = (buttonEl, strength = 0.3) => {
  if (!buttonEl) return { destroy: () => {} };

  const handleMove = (e) => {
    const rect = buttonEl.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(buttonEl, {
      x: x * strength,
      y: y * strength,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleLeave = () => {
    gsap.to(buttonEl, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
  };

  buttonEl.addEventListener('mousemove', handleMove);
  buttonEl.addEventListener('mouseleave', handleLeave);

  return {
    destroy: () => {
      buttonEl.removeEventListener('mousemove', handleMove);
      buttonEl.removeEventListener('mouseleave', handleLeave);
    },
  };
};
