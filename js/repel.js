/**
 * repel.js
 * Makes the "No" button flee from the mouse/finger after all 3 games.
 * Yes button grows until clicked.
 * Works on both desktop (mousemove) and mobile (touchmove on document).
 */

let repelActive = false;
let repelGrowInterval = null;

function activateRepelMode() {
  if (repelActive) return;
  repelActive = true;

  document.getElementById('forgive-question').textContent = 'Last chance... 💔';
  document.getElementById('forgive-sub').textContent = 'The yes button keeps growing 👀';
  document.getElementById('sad-emoji').textContent = '💀';
  showScreen('screen-forgive');

  const yb = document.getElementById('btn-yes');
  let grow = parseFloat(yb.style.fontSize) || 2.0;
  repelGrowInterval = setInterval(() => {
    grow = Math.min(grow + 0.18, 5.5);
    yb.style.fontSize = grow + 'rem';
  }, 700);

  // Desktop – mouse hover
  document.addEventListener('mousemove', _repelNoOnMove);
  // Mobile – finger drag anywhere on screen
  document.addEventListener('touchmove', _repelNoOnDocTouch, { passive: false });
}

function stopRepelMode() {
  if (!repelActive) return;
  repelActive = false;
  clearInterval(repelGrowInterval);
  document.removeEventListener('mousemove', _repelNoOnMove);
  document.removeEventListener('touchmove', _repelNoOnDocTouch);
  const nb = document.getElementById('btn-no');
  if (nb) {
    nb.style.position = '';
    nb.style.left     = '';
    nb.style.top      = '';
    nb.style.margin   = '';
    nb.style.zIndex   = '';
  }
}

function _repelNoOnMove(e) {
  _repelButton(e.clientX, e.clientY);
}

function _repelNoOnDocTouch(e) {
  // Don't prevent default here — allows page scroll; repel still works
  _repelButton(e.touches[0].clientX, e.touches[0].clientY);
}

function _repelButton(mx, my) {
  const nb = document.getElementById('btn-no');
  if (!nb) return;
  const r  = nb.getBoundingClientRect();
  const cx = r.left + r.width  / 2;
  const cy = r.top  + r.height / 2;
  const dx = mx - cx;
  const dy = my - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 160) {
    const force = 180;
    const nx    = r.left - (dx / dist) * force;
    const ny    = r.top  - (dy / dist) * force;
    const clampX = Math.max(0, Math.min(window.innerWidth  - r.width,  nx));
    const clampY = Math.max(0, Math.min(window.innerHeight - r.height, ny));
    nb.style.position = 'fixed';
    nb.style.left     = clampX + 'px';
    nb.style.top      = clampY + 'px';
    nb.style.margin   = '0';
    nb.style.zIndex   = '100';
  }
}
