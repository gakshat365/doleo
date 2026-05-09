/**
 * theme.js
 * Manages theme switching and tsParticles initialization.
 */

const THEME_CONFIGS = {
  valentines: { particleColor: '#ff4d88', shape: 'char' },
  kpop:       { particleColor: '#c77dff', shape: 'circle' },
  gothic:     { particleColor: '#7b00cc', shape: 'circle' }
};

let currentTheme = 'valentines';
let particleInstance = null;

function applyTheme(theme) {
  currentTheme = theme;
  document.body.className = theme;
  document.querySelectorAll('.theme-btn').forEach(btn =>
    btn.classList.toggle('selected', btn.dataset.theme === theme)
  );
  initParticles(theme);
}

function initParticles(theme) {
  const cfg = THEME_CONFIGS[theme];
  if (particleInstance) { particleInstance.destroy(); particleInstance = null; }

  const shapeConfig = cfg.shape === 'char'
    ? { type: 'char', options: { char: { value: '❤', font: 'Verdana', style: '', weight: '400' } } }
    : { type: 'circle' };

  tsParticles.load('tsparticles', {
    background: { color: { value: 'transparent' } },
    particles: {
      number: { value: 36, density: { enable: true, area: 800 } },
      color: { value: cfg.particleColor },
      shape: shapeConfig,
      opacity: { value: 0.45, random: true },
      size: { value: cfg.shape === 'char' ? 13 : 4, random: true },
      move: { enable: true, speed: 1.2, direction: 'top', outModes: { default: 'out' } }
    },
    detectRetina: true
  }).then(inst => { particleInstance = inst; });
}

function getCurrentTheme() { return currentTheme; }
