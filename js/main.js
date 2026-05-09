/**
 * main.js
 * Entry point – bootstraps theme, spinner, screens, and all feature modules.
 * Loaded last so all other scripts are already defined.
 */

(function init() {
  // 1. Apply default theme + particles
  applyTheme('valentines');

  // 2. Boot the first screen
  showScreen('screen-theme');

  // 3. Init the spinning wheel selector
  initSpinner();

  // 4. "Continue" button → forgive screen
  document.getElementById('btn-choose-theme').addEventListener('click', () => {
    showScreen('screen-forgive');
    onForgiveScreenShown();
  });

  // 5. Forgiveness screen interactions
  initForgiveScreen();

  // 6. Game hub buttons
  initGameHub();
})();

