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
    
    // Prevent background scrolling when menu is open
    if (!isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close menu when a link is clicked
  const navLinks = navActions.querySelectorAll('.nav__link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.setAttribute('aria-expanded', 'false');
      navActions.classList.remove('nav__actions--open');
      document.body.style.overflow = '';
    });
  });
});
