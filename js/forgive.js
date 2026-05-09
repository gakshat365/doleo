/**
 * forgive.js
 * "Will you forgive me?" screen.
 *
 * • "No" actively flees the cursor from the very first appearance.
 *   Clicking it (impostor) is handled by repel.js → goes to thank-you.
 * • "Yes / I Forgive You" grows continuously until almost full-screen.
 * • Text escalates each second to guilt-trip the player.
 */

const NO_ESCALATIONS = [
  { q: 'Really? 🥺',            sub: 'Are you sure about that...?',              emoji: '🥺' },
  { q: 'I am sowwyyy!! 😭',      sub: 'Please… I mean it with my whole heart 💕', emoji: '😭' },
  { q: 'Okay but like... 🙈',    sub: 'I really really really miss you',          emoji: '💔' },
  { q: 'Last chance? 🐥',        sub: 'My heart is literally breaking rn...',     emoji: '😤' },
];

let _escalationIdx = 0;
let _escalationTimer = null;

function resetForgiveScreen() {
  _escalationIdx = 0;
  clearInterval(_escalationTimer);

  document.getElementById('forgive-question').textContent = 'Will you forgive me?';
  document.getElementById('forgive-sub').textContent      = 'I messed up & I know it... 💔';
  document.getElementById('sad-emoji').textContent        = '🥺';

  const yb = document.getElementById('btn-yes');
  yb.style.fontSize = '1.1rem';
  yb.style.padding  = '';
  yb.style.position = '';
  yb.style.zIndex   = '';
  yb.textContent    = 'Yes 💗';

  const nb = document.getElementById('btn-no');
  nb.style.position  = '';
  nb.style.left      = '';
  nb.style.top       = '';
  nb.style.margin    = '';
  nb.style.zIndex    = '';
  nb.textContent     = 'No 🙅';
}

function initForgiveScreen() {
  // "Yes" always goes to thank-you
  document.getElementById('btn-yes').addEventListener('click', () => {
    stopRepelMode();
    showThankyou();
  });

  // Escalate guilt text every 4 seconds automatically
  _startEscalation();
}

/** Called when the forgive screen is shown (from main.js or _returnToHub) */
function onForgiveScreenShown() {
  resetForgiveScreen();
  _startEscalation();
  // Kick off repel + yes-grow immediately
  activateRepelMode();
}

function _startEscalation() {
  clearInterval(_escalationTimer);
  _escalationIdx = 0;
  _escalationTimer = setInterval(() => {
    if (_escalationIdx >= NO_ESCALATIONS.length) {
      clearInterval(_escalationTimer);
      return;
    }
    const step = NO_ESCALATIONS[_escalationIdx];
    document.getElementById('forgive-question').textContent = step.q;
    document.getElementById('forgive-sub').textContent      = step.sub;
    document.getElementById('sad-emoji').textContent        = step.emoji;
    _escalationIdx++;
  }, 4000);
}
