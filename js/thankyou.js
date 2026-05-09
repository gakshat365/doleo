/**
 * thankyou.js
 * Renders the thank-you screen with pixel-art animation.
 *
 * Scene:
 *   LEFT  – Guy doing a deep 🙇‍♂️ bow (animated frames)
 *   RIGHT – Girl standing in jeans + top
 */

function showThankyou() {
  stopRepelMode();
  showScreen('screen-thankyou');
  _startPixelArt();
  _burstHearts();
}

/* ─── Pixel-art renderer ─── */
function _startPixelArt() {
  const canvas = document.getElementById('pixel-canvas');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width;   // 320
  const H = canvas.height;  // 280
  const S = 7;              // cell size in px

  // Background colour per theme
  const BG = {
    valentines: '#2d0018',
    kpop:       '#0d001f',
    gothic:     '#000000'
  };
  // Accent colours per theme
  const ACCENT = {
    valentines: '#ff4d88',
    kpop:       '#c77dff',
    gothic:     '#c0002a'
  };

  const SKIN  = '#f4c2a1';
  const HAIR  = '#3d1f05';
  const SHIRT_GUY = '#1a6ef5';   // guy shirt – blue
  const PANTS_GUY = '#2a3d5c';   // guy trousers – dark navy
  // Girl colours
  const TOP_GIRL   = ACCENT[getCurrentTheme()] || '#ff4d88'; // theme-coloured top
  const JEANS_GIRL = '#1a3a6e';   // denim blue
  const SHOES      = '#2a2a2a';

  /* ── Helper: fill one pixel cell ── */
  function px(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * S, y * S, S - 1, S - 1);
  }

  /* ── GIRL – standing, jeans + top ── */
  function drawGirl() {
    const gx = 24; // grid column base

    // Hair (long)
    [[gx,3],[gx+1,3],[gx+2,3],[gx,4],[gx+2,4],[gx,5],[gx,6]].forEach(([x,y]) => px(x,y,HAIR));
    // Head
    [[gx,4],[gx+1,4],[gx+1,5],[gx+2,5]].forEach(([x,y]) => px(x,y,SKIN));
    px(gx+1,4,SKIN); px(gx+2,4,SKIN);
    px(gx,5,SKIN);   px(gx+1,5,SKIN);
    // Neck
    px(gx+1,6,SKIN);

    // Top (theme-coloured shirt, rows 7-11)
    for (let row = 7; row <= 11; row++) {
      for (let col = gx-1; col <= gx+3; col++) px(col, row, TOP_GIRL);
    }
    // Collar detail
    px(gx+1,7,'#fff3');

    // Arms (skin, along sides of top)
    for (let row = 7; row <= 10; row++) { px(gx-2,row,SKIN); px(gx+4,row,SKIN); }
    // Hands
    px(gx-2,11,SKIN); px(gx+4,11,SKIN);

    // Jeans (rows 12-19)
    for (let row = 12; row <= 19; row++) {
      for (let col = gx-1; col <= gx+3; col++) px(col, row, JEANS_GIRL);
    }
    // Jeans highlight seam
    for (let row = 12; row <= 19; row++) px(gx+1,row,'#1e4a8a');

    // Shoes (rows 20-21)
    for (let col = gx-1; col <= gx+1; col++) px(col,20,SHOES);
    for (let col = gx+2; col <= gx+3; col++) px(col,20,SHOES);
    px(gx-1,21,SHOES); px(gx,21,SHOES);
    px(gx+2,21,SHOES); px(gx+3,21,SHOES);
  }

  /* ── GUY – 🙇‍♂️ deep bow, animated ── */
  /*
   * bow = 0  → standing straight, slight tilt
   * bow = 1  → 45° forward
   * bow = 2  → 60° forward
   * bow = 3  → 90° full bow, head near floor
   */
  function drawGuy(bow) {
    // Standing legs are always vertical (col 8-10, rows 14-21)
    const legX = 8;
    for (let row = 14; row <= 21; row++) {
      px(legX,   row, PANTS_GUY);
      px(legX+1, row, PANTS_GUY);
      px(legX+2, row, PANTS_GUY);
    }
    // Shoes
    for (let col = legX-1; col <= legX+3; col++) px(col,21,SHOES);

    // Waist / hip block
    for (let col = legX-1; col <= legX+3; col++) px(col,13,PANTS_GUY);

    // Upper body bends forward based on bow level
    // bow=0: body rows 8-13 mostly vertical above waist
    // bow=3: body is nearly horizontal, head at far right
    const bodyColor = SHIRT_GUY;

    if (bow === 0) {
      // Upright-ish torso
      for (let row = 8; row <= 13; row++)
        for (let col = legX-1; col <= legX+2; col++) px(col, row, bodyColor);
      // Head above torso
      for (let col = legX; col <= legX+1; col++) { px(col,6,SKIN); px(col,7,SKIN); }
      px(legX-1,6,HAIR); px(legX+2,6,HAIR); px(legX,5,HAIR); px(legX+1,5,HAIR);
      // Arms at sides
      for (let row = 8; row <= 12; row++) { px(legX-2,row,SKIN); px(legX+3,row,SKIN); }

    } else if (bow === 1) {
      // 45° bow: torso diagonal
      for (let i = 0; i < 5; i++) {
        const col = legX - 1 + i;
        const row = 13 - i;
        px(col, row, bodyColor); px(col, row+1, bodyColor);
      }
      // Head at tip of torso
      const hx = legX + 4, hy = 9;
      px(hx,hy,SKIN); px(hx+1,hy,SKIN); px(hx,hy+1,SKIN); px(hx+1,hy+1,SKIN);
      px(hx,hy-1,HAIR); px(hx+1,hy-1,HAIR);
      // Arms hanging down
      for (let row = 12; row <= 15; row++) px(legX-1,row,SKIN);

    } else if (bow === 2) {
      // 70° bow: body more horizontal
      for (let i = 0; i < 7; i++) {
        const col = legX - 1 + i;
        const row = 13 - Math.round(i * 0.6);
        px(col, row, bodyColor); px(col, row+1, bodyColor);
      }
      // Head near floor
      const hx = legX + 6, hy = 10;
      px(hx,hy,SKIN); px(hx+1,hy,SKIN); px(hx,hy+1,SKIN); px(hx+1,hy+1,SKIN);
      px(hx,hy-1,HAIR); px(hx+1,hy-1,HAIR);
      // Arms reaching forward (toward girl)
      for (let col = legX + 7; col <= legX + 10; col++) px(col,12,SKIN);

    } else {
      // Full bow (bow=3): body horizontal, head touching floor
      for (let i = 0; i < 8; i++) {
        const col = legX - 1 + i;
        px(col, 13, bodyColor); px(col, 12, bodyColor);
      }
      // Head at far end, low
      const hx = legX + 7, hy = 13;
      px(hx,hy,SKIN); px(hx+1,hy,SKIN); px(hx,hy-1,SKIN); px(hx+1,hy-1,SKIN);
      // Hair draping down
      px(hx,hy+1,HAIR); px(hx+1,hy+1,HAIR); px(hx-1,hy,HAIR);
      // Arms fully forward on ground
      for (let col = legX + 8; col <= legX + 12; col++) px(col,14,SKIN);
    }
  }

  /* ── Ground line ── */
  function drawGround() {
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(0, 22 * S, W, 2);
  }

  /* ── Animation loop ── */
  const bowSequence = [0, 1, 2, 3, 3, 2, 1, 0]; // bow and return
  let frameIdx = 0;

  function render() {
    const bg = BG[getCurrentTheme()] || '#1a0012';
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    drawGround();
    drawGirl();
    drawGuy(bowSequence[frameIdx % bowSequence.length]);
    frameIdx++;
  }

  if (canvas._animInterval) clearInterval(canvas._animInterval);
  canvas._animInterval = setInterval(render, 380);
  render();
}

/* ─── Heart burst ─── */
function _burstHearts() {
  const container = document.getElementById('ty-hearts');
  container.innerHTML = '';
  const items = ['💖','💗','💕','💝','🌹','💌','✨','🌸','💘','🥰'];
  items.forEach((h, i) => {
    const span = document.createElement('span');
    span.textContent = h;
    span.className = 'heart-fly';
    span.style.animationDelay = (i * 0.1) + 's';
    container.appendChild(span);
  });
}
