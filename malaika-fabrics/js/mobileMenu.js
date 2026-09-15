/**
 * Mobile Navigation Menu Logic
 */
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.querySelector('.nav__mobile-toggle');
  const navActions = document.querySelector('.nav__actions');

  if (!toggleBtn || !navActions) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    navActions.classList.toggle('nav__actions--open');
  });

  // Close menu when a link is clicked
  const navLinks = navActions.querySelectorAll('.nav__link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.setAttribute('aria-expanded', 'false');
      navActions.classList.remove('nav__actions--open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggleBtn.contains(e.target) && !navActions.contains(e.target)) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      navActions.classList.remove('nav__actions--open');
    }
  });
});
