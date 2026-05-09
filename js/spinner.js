/**
 * spinner.js
 * Spinning wheel theme selector.
 * Segments: Valentines, K-Pop, Gothic.
 * User spins, wheel lands on a theme, then continues.
 */

const WHEEL_SEGMENTS = [
  { theme: 'valentines', label: 'Lovers 💌',  color: '#ff4d88', color2: '#c4005a', textColor: '#fff' },
  { theme: 'gothic',     label: 'Gothic 🥀',  color: '#1a0030', color2: '#0a0010', textColor: '#d4b8ff' },
  { theme: 'kpop',       label: 'K-Pop 🎵',   color: '#9d4edd', color2: '#6a00cc', textColor: '#fff'   }
];

const SEG_COUNT   = WHEEL_SEGMENTS.length;
const SEG_ANGLE   = (2 * Math.PI) / SEG_COUNT;
const POINTER_DEG = Math.PI * 1.5; // top of wheel = 270°

let wheelAngle = 0;
let isSpinning  = false;
let hasSpun     = false;

/* ─────────────────────────────────────────
   INIT – called from main.js
───────────────────────────────────────── */
function initSpinner() {
  const canvas      = document.getElementById('wheel-canvas');
  const ctx         = canvas.getContext('2d');
  const spinBtn     = document.getElementById('btn-spin');
  const resultText  = document.getElementById('spin-result');
  const continueBtn = document.getElementById('btn-choose-theme');

  continueBtn.disabled = true;
  drawWheel(ctx, canvas.width / 2, canvas.height / 2, wheelAngle);

  spinBtn.addEventListener('click', () => {
    if (isSpinning) return;
    _doSpin(ctx, canvas, spinBtn, resultText, continueBtn);
  });
}

/* ─────────────────────────────────────────
   DRAW WHEEL
───────────────────────────────────────── */
function drawWheel(ctx, cx, cy, angle) {
  const r = cx - 6;
  ctx.clearRect(0, 0, cx * 2, cy * 2);

  WHEEL_SEGMENTS.forEach((seg, i) => {
    const startA = angle + i * SEG_ANGLE;
    const endA   = startA + SEG_ANGLE;
    const midA   = startA + SEG_ANGLE / 2;

    // Gradient fill for each segment
    const grd = ctx.createRadialGradient(cx, cy, 10, cx, cy, r);
    grd.addColorStop(0, seg.color2);
    grd.addColorStop(1, seg.color);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startA, endA);
    ctx.closePath();
    ctx.fillStyle = grd;
    ctx.fill();

    // Divider lines
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(midA);
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor  = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur   = 4;
    ctx.fillStyle    = seg.textColor;
    ctx.font         = 'bold 13px Quicksand, sans-serif';
    ctx.fillText(seg.label, r * 0.6, 0);
    ctx.restore();
  });

  // Outer ring
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth   = 4;
  ctx.stroke();

  // Centre circle (sits behind the SPIN button)
  const grad2 = ctx.createRadialGradient(cx, cy, 5, cx, cy, 40);
  grad2.addColorStop(0, 'rgba(255,255,255,0.18)');
  grad2.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.beginPath();
  ctx.arc(cx, cy, 40, 0, 2 * Math.PI);
  ctx.fillStyle   = grad2;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth   = 2;
  ctx.stroke();
}

/* ─────────────────────────────────────────
   SPIN ANIMATION
───────────────────────────────────────── */
function _doSpin(ctx, canvas, spinBtn, resultText, continueBtn) {
  isSpinning           = true;
  spinBtn.disabled     = true;
  continueBtn.disabled = true;
  continueBtn.classList.remove('pulse-anim');
  resultText.textContent = 'Spinning... 🌀';

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  // 5–8 full rotations + random offset
  const totalSpin  = (5 + Math.random() * 3) * 2 * Math.PI + Math.random() * 2 * Math.PI;
  const duration   = 3600 + Math.random() * 900;
  const startAngle = wheelAngle;
  const endAngle   = startAngle + totalSpin;
  const startTime  = performance.now();

  function easeOut(t) { return 1 - Math.pow(1 - t, 4); }

  function frame(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    wheelAngle = startAngle + totalSpin * easeOut(progress);
    drawWheel(ctx, cx, cy, wheelAngle);
    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      wheelAngle = endAngle;
      _onSpinEnd(ctx, cx, cy, spinBtn, resultText, continueBtn);
    }
  }

  requestAnimationFrame(frame);
}

/* ─────────────────────────────────────────
   DETERMINE WINNER
───────────────────────────────────────── */
function _getWinner(finalAngle) {
  const norm = ((POINTER_DEG - finalAngle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
  return Math.floor(norm / SEG_ANGLE) % SEG_COUNT;
}

/* ─────────────────────────────────────────
   POST-SPIN
───────────────────────────────────────── */
function _onSpinEnd(ctx, cx, cy, spinBtn, resultText, continueBtn) {
  const winIdx = _getWinner(wheelAngle);
  const winner = WHEEL_SEGMENTS[winIdx];

  applyTheme(winner.theme);
  drawWheel(ctx, cx, cy, wheelAngle); // redraw with fresh theme colours

  const NAMES = {
    valentines: 'Lovers & Valentines 💌',
    kpop:       'K-Pop Dreamy 🎵',
    gothic:     'Gothic Romance 🥀'
  };

  resultText.textContent   = `✨ Your vibe: ${NAMES[winner.theme]}!`;
  isSpinning               = false;
  hasSpun                  = true;
  spinBtn.disabled         = false;
  spinBtn.textContent      = 'Respin';
  continueBtn.disabled     = false;
  continueBtn.classList.add('pulse-anim');
}
