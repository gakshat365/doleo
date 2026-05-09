/**
 * repel.js
 * ─────────────────────────────────────────────────────────────
 * "No" button behaviour on the forgive screen:
 *   • Actively flees the cursor/finger at all times (not just after games).
 *   • Stays strictly inside the .forgive-card boundaries.
 *   • If somehow clicked → impostor toast → thank-you screen.
 *
 * "Yes / I Forgive You" button:
 *   • Grows in font-size every second until it nearly fills the screen.
 */

let _repelListenerAttached = false;
let _yesGrowTimer          = null;
let _yesFontRem            = 1.1;   // starting size (rem)
const YES_MAX_REM          = 14;    // grows to this before stopping
const YES_GROW_STEP        = 0.28;  // rem added per tick
const YES_GROW_INTERVAL_MS = 600;   // ms between growth ticks

/* ── Public: start everything ── */
function activateRepelMode() {
  _startNoRepel();
  _startYesGrow();
}

/* ── Public: stop everything (cleanup) ── */
function stopRepelMode() {
  clearInterval(_yesGrowTimer);
  _yesGrowTimer = null;
  if (_repelListenerAttached) {
    document.removeEventListener('mousemove', _onMouseMove);
    document.removeEventListener('touchmove', _onTouchMove);
    _repelListenerAttached = false;
  }
  // Reset No button position
  const nb = document.getElementById('btn-no');
  if (nb) {
    nb.style.position  = '';
    nb.style.transform = '';
    nb.style.left      = '';
    nb.style.top       = '';
    nb.style.margin    = '';
    nb.style.zIndex    = '';
  }
}

/* ────────────────────────────────────────────────
   NO BUTTON — flee + impostor click
──────────────────────────────────────────────── */
function _startNoRepel() {
  if (_repelListenerAttached) return;
  _repelListenerAttached = true;

  document.addEventListener('mousemove', _onMouseMove);
  document.addEventListener('touchmove', _onTouchMove, { passive: false });

  // Wire the impostor click (replaces any prior handler)
  const nb = document.getElementById('btn-no');
  if (nb) {
    // Clone to strip old listeners, then re-add
    const fresh = nb.cloneNode(true);
    nb.parentNode.replaceChild(fresh, nb);
    fresh.addEventListener('click', _onImpostorClick);
  }
}

function _onImpostorClick() {
  _showImpostorToast();
  setTimeout(() => showThankyou(), 1400);
}

function _showImpostorToast() {
  let toast = document.getElementById('impostor-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'impostor-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = "Oops! That was an impostor 🫣 It's actually an 'I Forgive You' button!";
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1300);
}

function _onMouseMove(e) { _repelNo(e.clientX, e.clientY); }
function _onTouchMove(e)  { _repelNo(e.touches[0].clientX, e.touches[0].clientY); }

function _repelNo(mx, my) {
  const nb   = document.getElementById('btn-no');
  const card = document.querySelector('.forgive-card');
  if (!nb || !card) return;

  const nbR   = nb.getBoundingClientRect();
  const cardR = card.getBoundingClientRect();

  // Cursor position relative to card
  const relMx = mx - cardR.left;
  const relMy = my - cardR.top;

  // Button center relative to card
  const relCx = nbR.left - cardR.left + nbR.width  / 2;
  const relCy = nbR.top  - cardR.top  + nbR.height / 2;

  const dx = relMx - relCx;
  const dy = relMy - relCy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  const TRIGGER = 180;
  if (dist > TRIGGER || dist === 0) return;

  const force = 200;
  let nx = (nbR.left - cardR.left) - (dx / dist) * force;
  let ny = (nbR.top  - cardR.top)  - (dy / dist) * force;

  // Clamp strictly inside the card using absolute coords
  const minX = 0;
  const maxX = cardR.width  - nbR.width;
  const minY = 0;
  const maxY = cardR.height - nbR.height;

  nx = Math.max(minX, Math.min(maxX, nx));
  ny = Math.max(minY, Math.min(maxY, ny));

  nb.style.position = 'absolute';
  nb.style.left     = nx + 'px';
  nb.style.top      = ny + 'px';
  nb.style.margin   = '0';
  nb.style.zIndex   = '50';
}

/* ────────────────────────────────────────────────
   YES BUTTON — grow to fill the screen
──────────────────────────────────────────────── */
function _startYesGrow() {
  clearInterval(_yesGrowTimer);
  const yb = document.getElementById('btn-yes');
  if (!yb) return;

  // Ensure it starts from current or base size
  _yesFontRem = parseFloat(yb.style.fontSize) || 1.1;

  _yesGrowTimer = setInterval(() => {
    _yesFontRem = Math.min(_yesFontRem + YES_GROW_STEP, YES_MAX_REM);
    yb.style.fontSize  = _yesFontRem + 'rem';
    yb.style.padding   = `${Math.min(_yesFontRem * 6, 40)}px ${Math.min(_yesFontRem * 14, 100)}px`;
    yb.style.zIndex    = '200';
    yb.style.position  = 'relative';

    if (_yesFontRem >= YES_MAX_REM) clearInterval(_yesGrowTimer);
  }, YES_GROW_INTERVAL_MS);
}
