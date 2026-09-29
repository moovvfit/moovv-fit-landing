/* Moovv for Physios — landing page interactions */

// Nav background on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') navLinks.classList.remove('open');
});

// FAQ accordion
document.querySelectorAll('.faq-question').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach((i) => {
      i.classList.remove('active');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });
    if (!isActive) {
      item.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// Currency toggle (INR default)
const currencyButtons = document.querySelectorAll('.currency-btn');
currencyButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const currency = btn.dataset.currency;
    currencyButtons.forEach((b) => {
      const active = b === btn;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-inr]').forEach((price) => {
      price.textContent = price.dataset[currency];
    });
  });
});

// "book a demo" CTAs pre-select the demo intent in the form
const intentSelect = document.getElementById('intentSelect');
document.querySelectorAll('[data-intent="demo"]').forEach((el) => {
  el.addEventListener('click', () => {
    if (intentSelect) intentSelect.value = 'demo';
  });
});

// Onboarding form → Formspree (AJAX submit with inline success state)
const onboardForm = document.getElementById('onboardForm');
const formSuccess = document.getElementById('formSuccess');
if (onboardForm) {
  onboardForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = onboardForm.querySelector('.btn-form-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'sending…';

    try {
      const response = await fetch(onboardForm.action, {
        method: 'POST',
        body: new FormData(onboardForm),
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('Form submission failed');
      onboardForm.hidden = true;
      formSuccess.hidden = false;
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'request access';
      alert('Something went wrong — please try again, or email hello@moovv.fit.');
    }
  });
}
