/**
 * gameHub.js
 * Manages the game selector screen, tracks played/locked games.
 *
 * Rules:
 *  - A game is "played" when it ends naturally OR the player presses Back.
 *  - A game is "locked" only when the player presses Back (can't re-enter).
 *  - Once ALL 3 games are played (any combination), returning to the hub
 *    triggers repel mode on the forgive screen.
 */

let gamesPlayed   = 0;
const lockedGames = new Set(); // locked via Back button — can't replay
const playedGames = new Set(); // completed at least once (locked OR finished)

/* ── Public API ── */

function recordGamePlayed() {
  gamesPlayed++;
}

function getGamesPlayed() { return gamesPlayed; }

/** Mark a game as "played" (called when it ends naturally). */
function markGamePlayed(gameId) {
  playedGames.add(gameId);
}

/** Lock a game permanently (called when player presses Back). */
function lockGame(gameId) {
  playedGames.add(gameId);   // also counts as played
  if (lockedGames.has(gameId)) return;
  lockedGames.add(gameId);
  recordGamePlayed();
  _updateGameButtons();
}

function isGameLocked(gameId) { return lockedGames.has(gameId); }

/** Returns true if all 3 games have been experienced at least once. */
function allGamesPlayed() {
  return playedGames.has('flappy') &&
         playedGames.has('rps')    &&
         playedGames.has('whack');
}

/* ── Internal helpers ── */

function _updateGameButtons() {
  document.querySelectorAll('.game-select-btn').forEach(btn => {
    const id = btn.dataset.game;
    if (lockedGames.has(id)) {
      btn.disabled = true;
      btn.classList.add('game-btn-locked');
      const span = btn.querySelector('span:last-child');
      if (span && !span.dataset.orig) {
        span.dataset.orig = span.textContent;
        span.textContent  = span.dataset.orig + '  🔒 Locked';
      }
    }
  });
}

function _returnToHub() {
  showScreen('screen-games');
  if (allGamesPlayed()) {
    // Short delay so the hub flashes briefly, then show forgive screen with repel
    setTimeout(() => {
      showScreen('screen-forgive');
      onForgiveScreenShown();
    }, 800);
  }
}

/* ── Init ── */

function initGameHub() {
  // Warning banner
  const card = document.querySelector('.games-card');
  if (card && !document.getElementById('game-hub-warning')) {
    const warn    = document.createElement('p');
    warn.id        = 'game-hub-warning';
    warn.className = 'game-hub-warn';
    warn.textContent = '⚠️ You can retry a game as many times as you want — but going back locks it forever!';
    const sub = card.querySelector('.games-sub');
    if (sub) sub.after(warn);
  }

  document.querySelectorAll('.game-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const game = btn.dataset.game;
      if (isGameLocked(game)) return;
      if (game === 'flappy') startFlappy();
      else if (game === 'rps')   startRPS();
      else if (game === 'whack') startWhack();
    });
  });
}

/**
 * Wires up the post-game "Forgive me" and "Try another game" buttons.
 * "Try another game" now uses _returnToHub() which checks allGamesPlayed().
 */
function wirePostGame(forgiveId, backId) {
  const forgiveBtn = document.getElementById(forgiveId);
  const backBtn    = document.getElementById(backId);
  if (forgiveBtn) forgiveBtn.onclick = () => showThankyou();
  if (backBtn)    backBtn.onclick    = () => _returnToHub();
}
