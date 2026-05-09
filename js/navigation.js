/**
 * navigation.js
 * Single responsibility: show/hide screens with transitions.
 */

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) requestAnimationFrame(() => el.classList.add('active'));
}
