/**
 * flappy.js
 * Flappy Bird – goal is to score 5, but the game cheats so it's impossible.
 * Going Back locks this game permanently in the hub.
 */

function startFlappy() {
  showScreen('screen-flappy');

  const overlay    = document.getElementById('flappy-overlay');
  const overlayMsg = document.getElementById('flappy-overlay-msg');
  const startBtn   = document.getElementById('flappy-start-btn');
  const scoreEl    = document.getElementById('flappy-score');
  const backBtn    = document.getElementById('flappy-back');
  const canvas     = document.getElementById('flappy-canvas');
  const ctx        = canvas.getContext('2d');

  // Update instructions dynamically
  const instrEl = document.querySelector('#screen-flappy .game-instructions');
  const isMobile = 'ontouchstart' in window;
  if (instrEl) instrEl.innerHTML = isMobile
    ? 'Tap anywhere to flap &nbsp;|&nbsp; Score <b>5</b> to win! 😈'
    : 'Press <kbd>Space</kbd> / Click to flap &nbsp;|&nbsp; Score <b>5</b> to win! 😈';

  overlay.style.display  = 'flex';
  scoreEl.textContent    = '0';
  overlayMsg.textContent = 'Score 5 to beat me... if you can 😏';
  startBtn.textContent   = 'Start 🐦';

  // Reset start button to normal (not "Forgive" from a previous run)
  startBtn.onclick = null;

  const W = canvas.width;
  const H = canvas.height;

  const THEME_SKIN = {
    valentines: { bird: '💌', pipe: '🌹', bg: '#2d0018', pipeColor: '#5c0028' },
    kpop:       { bird: '🎵', pipe: '🌸', bg: '#0d001f', pipeColor: '#4a0050' },
    gothic:     { bird: '🦇', pipe: '🥀', bg: '#000000', pipeColor: '#2a0050' }
  };

  let skin;
  let bird, pipes, score, frame, running, rafId;
  let hasStarted = false; // true once player has pressed Start at least once

  function getSkin() { return THEME_SKIN[getCurrentTheme()] || THEME_SKIN.valentines; }

  function init() {
    skin    = getSkin();
    bird    = { x: 80, y: H / 2, vy: 0, r: 18 };
    pipes   = [];
    score   = 0;
    frame   = 0;
    running = false;
    scoreEl.textContent = '0';
  }

  function flap() {
    if (!running) { running = true; loop(); }
    bird.vy = -7;
  }

  function spawnPipe() {
    const gap  = 155;
    const topH = 60 + Math.random() * (H - gap - 120);
    pipes.push({ x: W + 30, topH, gap, scored: false });
  }

  function drawEmoji(emoji, x, y, size) {
    ctx.font      = size + 'px serif';
    ctx.textAlign = 'center';
    ctx.fillText(emoji, x, y + size * 0.4);
  }

  function loop() {
    if (!running) return;
    rafId = requestAnimationFrame(loop);

    ctx.fillStyle = skin.bg;
    ctx.fillRect(0, 0, W, H);

    // Bird physics
    bird.vy += 0.44;
    bird.y  += bird.vy;

    if (bird.y > H - bird.r || bird.y < bird.r) {
      endGame('Oops! You crashed! 💥\nForgiving me would\'ve been easier 😇');
      return;
    }

    // Pipes
    if (frame % 90 === 0) spawnPipe();

    // ── CHEAT at score 4: next incoming pipe gets an impossible gap ──
    if (score >= 4) {
      const incoming = pipes.find(p => p.x > bird.x && !p.scored);
      if (incoming) {
        incoming.topH = H * 0.75; // force bird into ceiling or floor
        incoming.gap  = 30;       // near-impossible gap
      }
    }

    for (const p of pipes) {
      p.x -= 2.6;
      ctx.fillStyle = skin.pipeColor;
      ctx.fillRect(p.x, 0, 38, p.topH);
      ctx.fillRect(p.x, p.topH + p.gap, 38, H);
      drawEmoji(skin.pipe, p.x + 19, p.topH - 24, 24);
      drawEmoji(skin.pipe, p.x + 19, p.topH + p.gap + 2, 24);

      // Collision
      if (bird.x + bird.r > p.x && bird.x - bird.r < p.x + 38) {
        if (bird.y - bird.r < p.topH || bird.y + bird.r > p.topH + p.gap) {
          endGame('SO close to 5! But not quite 😈\nMaybe just forgive me?');
          return;
        }
      }
      // Score point
      if (!p.scored && p.x + 38 < bird.x) {
        p.scored = true;
        score++;
        scoreEl.textContent = score;
      }
    }
    pipes = pipes.filter(p => p.x > -50);

    drawEmoji(skin.bird, bird.x, bird.y, 30);
    frame++;
  }

  function endGame(msg) {
    running = false;
    cancelAnimationFrame(rafId);
    cleanup();
    markGamePlayed('flappy'); // counts as played regardless of how it ended

    overlayMsg.textContent = msg;
    startBtn.textContent   = '🔄 Try Again';
    overlay.style.display  = 'flex';

    // Wire "Try Again" to restart fresh
    startBtn.onclick = () => {
      overlay.style.display = 'none';
      window.addEventListener('keydown',    onKey);
      canvas.addEventListener('click',      onTap);
      canvas.addEventListener('touchstart', onTouch, { passive: false });
      init();
      flap();
    };

    _showForgiveOption();
  }

  function _showForgiveOption() {
    let f = document.getElementById('flappy-forgive-inline');
    if (!f) {
      f = document.createElement('button');
      f.id        = 'flappy-forgive-inline';
      f.className = 'cta-btn';
      f.style.cssText = 'margin-top:12px;font-size:0.95rem;padding:10px 24px;';
      overlay.appendChild(f);
    }
    f.textContent = 'Forgive me instead? 💖';
    f.onclick     = () => showThankyou();
    f.style.display = 'block';
  }

  // Event handlers
  function onKey(e)   { if (e.code === 'Space') { e.preventDefault(); flap(); } }
  function onTap(e)   { flap(); }
  function onTouch(e) { e.preventDefault(); flap(); } // instant on mobile

  function cleanup() {
    window.removeEventListener('keydown',   onKey);
    canvas.removeEventListener('click',     onTap);
    canvas.removeEventListener('touchstart', onTouch);
  }

  startBtn.onclick = () => {
    hasStarted = true;
    overlay.style.display = 'none';
    window.addEventListener('keydown',    onKey);
    canvas.addEventListener('click',      onTap);
    canvas.addEventListener('touchstart', onTouch, { passive: false });
    init();
    flap();
  };

  // Back button → LOCK this game + return to hub
  backBtn.onclick = () => {
    running = false;
    cancelAnimationFrame(rafId);
    cleanup();
    lockGame('flappy');
    _returnToHub();
  };

  init();
}
