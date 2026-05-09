/**
 * forgive.js
 * Handles the "Will you forgive me?" screen logic —
 * escalating No iterations, growing Yes button.
 */

const NO_ITERATIONS = [
  { q: 'Really? 🥺',            sub: 'Are you sure about that...?',              emoji: '🥺' },
  { q: 'I am sowwyyy!! 😭',      sub: 'Please… I mean it with my whole heart 💕', emoji: '😭' },
  { q: 'Okay but like... 🙈',    sub: 'I really really really miss you',          emoji: '💔' },
  { q: 'Last chance? 🐥',        sub: 'My heart is literally breaking rn...',     emoji: '😤' }
];

let noCount = 0;
let yesFontSize = 1.1;

function resetForgiveScreen() {
  noCount = 0;
  yesFontSize = 1.1;
  document.getElementById('forgive-question').textContent = 'Will you forgive me?';
  document.getElementById('forgive-sub').textContent = 'I messed up & I know it... 💔';
  document.getElementById('sad-emoji').textContent = '🥺';
  const yb = document.getElementById('btn-yes');
  const nb = document.getElementById('btn-no');
  yb.style.fontSize = '1.1rem';
  yb.textContent = 'Yes 💗';
  nb.style.fontSize = '1rem';
  nb.textContent = 'No 🙅';
}

function initForgiveScreen() {
  document.getElementById('btn-yes').addEventListener('click', () => showThankyou());

  document.getElementById('btn-no').addEventListener('click', function () {
    if (noCount < NO_ITERATIONS.length) {
      const step = NO_ITERATIONS[noCount];
      document.getElementById('forgive-question').textContent = step.q;
      document.getElementById('forgive-sub').textContent = step.sub;
      document.getElementById('sad-emoji').textContent = step.emoji;

      yesFontSize += 0.3;
      document.getElementById('btn-yes').style.fontSize = yesFontSize + 'rem';

      if (noCount === NO_ITERATIONS.length - 1) {
        this.textContent = 'No still 😠';
      }
      noCount++;
    } else {
      // All iterations exhausted → go to games
      document.getElementById('forgive-question').textContent = 'Fine... 😤';
      document.getElementById('forgive-sub').textContent = "Wanna still click no? Let's play a game 🎮";
      setTimeout(() => showScreen('screen-games'), 1100);
    }
  });
}
