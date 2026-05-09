/**
 * rps.js
 * Rock Paper Scissors – CPU always cheats and wins.
 * Packed with cheeky flirty messages.
 */

const RPS_CHEEKY = [
  "This is a sign you should forgive me 💌",
  "Look, you're just making it worse for yourself 😌",
  "Do you not want me anymore? 🥺",
  "I know you still love me 💕",
  "The universe is literally siding with me rn ✨",
  "You keep trying... it's kinda cute 🙈",
  "Forgiveness > RPS, just saying 😇",
  "My heart hurts every time you play 💔",
  "Is this your way of spending time with me? 😏",
  "You'd win more by just saying yes 🌹",
  "Still here... that means something 🤍",
  "Even fate wants you to forgive me 🌙",
  "Every round you lose, I fall more in love 😘",
  "Can't you see? We're meant to be 💫"
];

const RPS_EMOJI = { rock: '🪨', paper: '📄', scissors: '✂️' };
const RPS_BEATS = { rock: 'paper', paper: 'scissors', scissors: 'rock' };

function startRPS() {
  showScreen('screen-rps');

  // Reset UI
  document.getElementById('rps-user-score').textContent = '0';
  document.getElementById('rps-cpu-score').textContent  = '0';
  document.getElementById('rps-round').textContent      = '1';
  document.getElementById('rps-user-choice').textContent = '❓';
  document.getElementById('rps-cpu-choice').textContent  = '❓';
  document.getElementById('rps-result-msg').textContent  = '';
  document.getElementById('rps-cheeky-msg').textContent  = '';
  document.getElementById('rps-buttons').classList.remove('hidden');
  document.getElementById('rps-end').classList.add('hidden');
  document.getElementById('rps-back-top').classList.remove('hidden');

  let round = 1, userW = 0, cpuW = 0;
  const MAX = 5;
  let usedCheeky = [];

  function randomCheeky() {
    if (usedCheeky.length === RPS_CHEEKY.length) usedCheeky = [];
    const pool = RPS_CHEEKY.filter((_, i) => !usedCheeky.includes(i));
    const idx  = Math.floor(Math.random() * pool.length);
    const realIdx = RPS_CHEEKY.indexOf(pool[idx]);
    usedCheeky.push(realIdx);
    return pool[idx];
  }

  function pickHandlers() {
    document.querySelectorAll('.rps-pick-btn').forEach(btn => {
      btn.onclick = () => {
        if (round > MAX) return;

        const user = btn.dataset.pick;
        const cpu  = RPS_BEATS[user]; // cheat – always beat user

        const ud = document.getElementById('rps-user-choice');
        const cd = document.getElementById('rps-cpu-choice');
        ud.textContent = RPS_EMOJI[user];
        cd.textContent = RPS_EMOJI[cpu];
        ud.classList.add('shake'); cd.classList.add('shake');
        setTimeout(() => { ud.classList.remove('shake'); cd.classList.remove('shake'); }, 600);

        cpuW++;
        document.getElementById('rps-result-msg').textContent = 'I win again! 😏';
        document.getElementById('rps-cheeky-msg').textContent = randomCheeky();
        document.getElementById('rps-user-score').textContent = userW;
        document.getElementById('rps-cpu-score').textContent  = cpuW;
        round++;
        document.getElementById('rps-round').textContent = Math.min(round, MAX);

        if (round > MAX) {
          setTimeout(() => {
            document.getElementById('rps-buttons').classList.add('hidden');
            document.getElementById('rps-back-top').classList.add('hidden');
            document.getElementById('rps-end').classList.remove('hidden');
            document.getElementById('rps-end-msg').textContent =
              `Final: You ${userW} – Me ${cpuW}. Told ya I'd win 😈`;
            recordGamePlayed();
            markGamePlayed('rps');

            // Wire end-screen buttons
            document.getElementById('rps-forgive-btn').onclick = () => showThankyou();

            document.getElementById('rps-replay-btn').onclick = () => startRPS();

            document.getElementById('rps-goback-btn').onclick = () => {
              lockGame('rps'); // applies strikethrough on hub button
              _returnToHub();
            };
          }, 700);
        }
      };
    });
  }

  pickHandlers();
  // Back (top, mid-game) → LOCK this game + return to hub
  document.getElementById('rps-back-top').onclick = () => {
    lockGame('rps');
    _returnToHub();
  };
}
