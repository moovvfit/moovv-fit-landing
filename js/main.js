// =============================================
// Moovv Landing Page JavaScript
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // =============================================
  // Navigation
  // =============================================
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Mobile nav toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: position, behavior: 'smooth' });
      }
    });
  });

  // Hero Track Button Tracking
  const trackPainBtn = document.getElementById('trackPain');
  const trackBetterBtn = document.getElementById('trackBetter');

  if (trackPainBtn) {
    trackPainBtn.addEventListener('click', () => {
      if (window.posthog) {
        posthog.capture('hero_track_click', { track: 'pain' });
      }
    });
  }

  if (trackBetterBtn) {
    trackBetterBtn.addEventListener('click', () => {
      if (window.posthog) {
        posthog.capture('hero_track_click', { track: 'better_movement' });
      }
    });
  }

  // =============================================
  // Hero Subtitle Rotation
  // =============================================
  const heroSubtitle = document.getElementById('heroSubtitle');
  const heroMediaSlides = document.querySelectorAll('.hero-media-slide');
  const heroMediaCaptions = document.querySelectorAll('.hero-device-caption');
  const heroMediaVideos = document.querySelectorAll('.hero-media-slide video');

  const subtitles = [
    "moovv.fit gives you a daily mobility plan — built by AI, backed by physiotherapists — so you can heal pain, prevent injury, and move better in everything you do.",
    "From back pain at your desk to a stuck deadlift at the gym — your body's mobility is one problem. Moovv solves it, daily.",
    "A personal mobility coach in your pocket. AI-built plans, physiotherapist-designed, adapted to your body — every single day."
  ];

  let currentSubtitle = 0;
  let currentHeroMedia = 0;

  function syncHeroMediaPlayback(activeIndex) {
    heroMediaVideos.forEach((video) => {
      video.pause();
      video.currentTime = 0;
    });

    const activeSlide = heroMediaSlides[activeIndex];
    const activeVideo = activeSlide ? activeSlide.querySelector('video') : null;

    if (activeVideo) {
      activeVideo.play().catch(() => {
        // Ignore autoplay failures and keep the poster visible.
      });
    }
  }

  function updateHeroMedia() {
    if (heroMediaSlides.length === 0) {
      return;
    }

    heroMediaSlides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentHeroMedia);
    });

    heroMediaCaptions.forEach((caption, index) => {
      caption.classList.toggle('active', index === currentHeroMedia);
    });

    syncHeroMediaPlayback(currentHeroMedia);
    currentHeroMedia = (currentHeroMedia + 1) % heroMediaSlides.length;
  }

  function rotateSubtitles() {
    currentSubtitle = (currentSubtitle + 1) % subtitles.length;

    if (heroSubtitle) {
      heroSubtitle.style.opacity = '0';
      setTimeout(() => {
        heroSubtitle.textContent = subtitles[currentSubtitle];
        heroSubtitle.style.opacity = '1';
      }, 300);
    }
  }

  if (heroSubtitle) {
    heroSubtitle.style.transition = 'opacity 0.3s ease';
    setInterval(rotateSubtitles, 5000);
  }

  if (heroMediaSlides.length > 0) {
    updateHeroMedia();
    setInterval(updateHeroMedia, 5000);
  }


  // =============================================
  // How It Works - Train Carousel
  // =============================================
  const screensWrapper = document.getElementById('screensWrapper');
  const howTitle = document.getElementById('howTitle');
  const howSubtitle = document.getElementById('howSubtitle');

  const howSteps = [
    { screen: 'images/Screen1_HR.jpg',
      title: 'Tell us what you want to fix',
      subtitle: 'Pain, stiffness, or a movement you can\'t do' },
    { screen: 'images/Screen2_HR.jpg',
      title: 'Show us where',
      subtitle: 'Tap your body to mark the spot' },
    { screen: 'images/Screen3_HR.jpg',
      title: 'A 5-minute mobility check',
      subtitle: 'We see what\'s tight, weak, or compensating' },
    { screen: 'images/Screen4_HR.jpg',
      title: 'Your plan, your pace',
      subtitle: '10-15 min a day, built around your body' },
    { screen: 'images/Screen5_HR.jpg',
      title: 'Move better, every day',
      subtitle: 'Guided routines that adapt as you progress' }
  ];

  let trackX = 0;
  let currentFocusCard = null;
  let animationId = null;

  function initHowWorksCarousel() {
    if (!screensWrapper) {
      setTimeout(initHowWorksCarousel, 100);
      return;
    }

    screensWrapper.innerHTML = '';
    
    // Create enough cards to fill screen multiple times for smooth infinite loop
    for (let i = 0; i < 4; i++) {
      howSteps.forEach((step, index) => {
        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'train-card';
        cardWrapper.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = step.screen;
        img.alt = step.title;
        
        cardWrapper.appendChild(img);
        screensWrapper.appendChild(cardWrapper);
      });
    }

    if (howTitle) howTitle.style.transition = 'opacity 0.2s ease';
    if (howSubtitle) howSubtitle.style.transition = 'opacity 0.2s ease';

    if(animationId) cancelAnimationFrame(animationId);
    animateTrain();
  }

  function animateTrain() {
    trackX -= 1.2; // Adjust speed here
    
    const firstCard = screensWrapper.firstElementChild;
    if (firstCard) {
      const rect = firstCard.getBoundingClientRect();
      if (rect.right < 0) {
        screensWrapper.appendChild(firstCard);
        // Add the width of the card + the flex gap (30px matches CSS)
        trackX += firstCard.offsetWidth + 30;
      }
    }
    
    screensWrapper.style.transform = `translate3d(${trackX}px, 0, 0)`;
    
    // Find center item
    const centerX = window.innerWidth / 2;
    let closestCard = null;
    let minDistance = Infinity;
    
    Array.from(screensWrapper.children).forEach(card => {
      const cardRect = card.getBoundingClientRect();
      // Skip cards totally offscreen
      if(cardRect.right < 0 || cardRect.left > window.innerWidth) return;
      
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(centerX - cardCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestCard = card;
      }
    });

    if (closestCard && closestCard !== currentFocusCard) {
      if (currentFocusCard) currentFocusCard.classList.remove('in-focus');
      closestCard.classList.add('in-focus');
      currentFocusCard = closestCard;
      
      const index = parseInt(closestCard.dataset.index);
      const step = howSteps[index];
      
      if (howTitle) {
        howTitle.style.opacity = '0';
        setTimeout(() => {
          howTitle.textContent = step.title;
          howTitle.style.opacity = '1';
        }, 200);
      }
      if (howSubtitle) {
        howSubtitle.style.opacity = '0';
        setTimeout(() => {
          howSubtitle.textContent = step.subtitle;
          howSubtitle.style.opacity = '1';
        }, 200);
      }
    }
    
    animationId = requestAnimationFrame(animateTrain);
  }

  setTimeout(initHowWorksCarousel, 100);


  // =============================================
  // FAQ Accordion
  // =============================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(faq => {
          faq.classList.remove('active');
          const q = faq.querySelector('.faq-question');
          if (q) q.setAttribute('aria-expanded', 'false');
        });
        if (!isActive) {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });





  // =============================================
  // Scroll Animations
  // =============================================
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(
    '.feature-col, .how-text, .story-carousel-wrapper, .science-content, .science-image, .cta-content, .cta-phone, .faq-list'
  ).forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });
});
