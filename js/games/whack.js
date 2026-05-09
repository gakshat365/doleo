/**
 * whack.js
 * Whack-a-Heart – tap broken hearts 💔, avoid love hearts 💖.
 * Score is secretly capped at 28 so the target of 30 is unreachable.
 */

function startWhack() {
  showScreen('screen-whack');

  const grid      = document.getElementById('whack-grid');
  const overlay   = document.getElementById('whack-overlay');
  const startBtn  = document.getElementById('whack-start-btn');
  const endPanel  = document.getElementById('whack-end');
  const backTop   = document.getElementById('whack-back-top');

  // Reset
  overlay.style.display = 'flex';
  document.getElementById('whack-overlay-msg').textContent = 'Whack 💔  Avoid 💖';
  startBtn.textContent = 'Start 🔨';
  endPanel.classList.add('hidden');
  backTop.classList.remove('hidden');

  const CELLS   = 12;
  let score = 0, lives = 3, timeLeft = 30;
  let moleIval = null, timerIval = null, running = false;

  // Build grid
  grid.innerHTML = '';
  const cells = [];
  for (let i = 0; i < CELLS; i++) {
    const cell = document.createElement('div');
    cell.className = 'whack-cell';
    cell.innerHTML = '<span class="mole"></span>';
    grid.appendChild(cell);
    cells.push(cell);
  }

  function updateHUD() {
    document.getElementById('whack-score').textContent = score;
    document.getElementById('whack-timer').textContent = timeLeft;
    document.getElementById('whack-lives').textContent = lives;
  }

  function popMole(idx, type) {
    const cell = cells[idx];
    if (cell.classList.contains('active')) return;
    cell.querySelector('.mole').textContent = type;
    cell.classList.add('active');
    cell.dataset.type = type;
    setTimeout(() => {
      cell.classList.remove('active');
      cell.dataset.type = '';
    }, 850);
  }

  function spawnBatch() {
    const count = 2 + Math.floor(Math.random() * 3);
    const idxs  = new Set();
    while (idxs.size < count) idxs.add(Math.floor(Math.random() * CELLS));
    idxs.forEach(i => {
      const type = Math.random() < 0.68 ? '💔' : '💖';
      popMole(i, type);
    });
  }

  function floatText(cell, text, color) {
    const el = document.createElement('div');
    el.textContent = text;
    el.style.cssText = `position:absolute;top:0;left:50%;transform:translateX(-50%);
      color:${color};font-weight:700;font-size:1rem;pointer-events:none;
      animation:heart-fly 1s ease forwards;z-index:20;white-space:nowrap;`;
    cell.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }

  function handleHit(cell) {
    if (!running) return;
    if (!cell.classList.contains('active')) return;
    const type = cell.dataset.type;
    cell.classList.remove('active');
    cell.dataset.type = '';

    if (type === '💔') {
      score = Math.min(score + 1, 28); // secret cap – never reach 30
      floatText(cell, '+1', '#ff4d88');
    } else if (type === '💖') {
      lives--;
      floatText(cell, '💔 oops!', '#ff0000');
      if (lives <= 0) endGame(false);
    }
    updateHUD();
  }

  cells.forEach(cell => {
    cell.addEventListener('click', () => handleHit(cell));
    cell.addEventListener('touchstart', e => { e.preventDefault(); handleHit(cell); }, { passive: false });
  });

  function endGame() {
    running = false;
    clearInterval(moleIval);
    clearInterval(timerIval);
    cells.forEach(c => { c.classList.remove('active'); c.dataset.type = ''; });

    recordGamePlayed();
    markGamePlayed('whack'); // mark as played so hub can track
    endPanel.classList.remove('hidden');
    backTop.classList.add('hidden');

    const msg = lives <= 0
      ? `Oof! No lives left 💀 Score: ${score}/30 — You just can't beat me 😈`
      : `Time's up! Score: ${score}/30 — So close... yet so far 😏`;
    document.getElementById('whack-end-msg').textContent = msg;
    wirePostGame('whack-forgive-btn', 'whack-back');
  }

  startBtn.onclick = () => {
    overlay.style.display = 'none';
    running   = true;
    score = 0; lives = 3; timeLeft = 30;
    updateHUD();
    moleIval  = setInterval(spawnBatch, 750);
    timerIval = setInterval(() => {
      timeLeft--;
      updateHUD();
      if (timeLeft <= 0) endGame();
    }, 1000);
  };

  backTop.onclick = () => {
    running = false;
    clearInterval(moleIval);
    clearInterval(timerIval);
    lockGame('whack');   // ← locks whack permanently
    _returnToHub();
  };
}
