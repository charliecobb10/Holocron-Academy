// ============================================================
// Holocron Academy — cinematic space backdrop
//
// Features:
//  • Parallax starfield (3 depth layers, varied star colors)
//  • Tiny distant crescent moon
//  • Ship flyover system — 3 original capital-ship silhouettes
//    drifting slowly across the void every 90-150 seconds
//
// All ship designs are original — classic sci-fi silhouettes only.
// Engine glows use the site's Jedi-green accent.
// ============================================================

(function () {
  const container = document.querySelector('.starfield');
  if (!container) return;

  // ---------------- Inject module CSS ----------------
  const css = `
    .starfield { overflow: hidden; }
    .starfield canvas { position: absolute; inset: 0; }
    .moon {
      position: absolute;
      width: 90px; height: 90px;
      opacity: 0.75;
      filter: drop-shadow(0 0 12px rgba(154, 206, 96, 0.15));
      pointer-events: none;
    }
    .ship-bay {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
    }
    .ship {
      position: absolute;
      left: 0;
      will-change: transform;
      opacity: 0.85;
      filter: drop-shadow(0 0 18px rgba(154, 206, 96, 0.12));
    }
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  // ---------------- Starfield canvas ----------------
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let stars = [];
  let W = 0, H = 0;

  // Star palette — mostly white with accents of warm amber, cool blue, faint green
  const starColors = [
    { r: 235, g: 240, b: 250 },
    { r: 235, g: 240, b: 250 },
    { r: 235, g: 240, b: 250 },
    { r: 235, g: 240, b: 250 },
    { r: 235, g: 240, b: 250 },
    { r: 235, g: 240, b: 250 },
    { r: 235, g: 240, b: 250 },
    { r: 245, g: 220, b: 170 },
    { r: 245, g: 220, b: 170 },
    { r: 190, g: 215, b: 240 },
    { r: 190, g: 215, b: 240 },
    { r: 200, g: 230, b: 180 },
  ];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const base = Math.min(450, Math.floor((W * H) / 4500));
    stars = [];
    for (let i = 0; i < base; i++) {
      const layer = i < base * 0.5 ? 0 : (i < base * 0.85 ? 1 : 2);
      const color = starColors[(Math.random() * starColors.length) | 0];
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: layer === 0 ? Math.random() * 0.7 + 0.2 :
           layer === 1 ? Math.random() * 1.1 + 0.4 :
                         Math.random() * 1.6 + 0.6,
        vy: layer === 0 ? Math.random() * 0.04 + 0.01 :
            layer === 1 ? Math.random() * 0.08 + 0.03 :
                          Math.random() * 0.12 + 0.06,
        a: layer === 0 ? Math.random() * 0.35 + 0.15 :
           layer === 1 ? Math.random() * 0.5 + 0.3 :
                         Math.random() * 0.6 + 0.5,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.025 + 0.008,
        color,
        layer,
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.y += s.vy;
      s.twinkle += s.twinkleSpeed;
      if (s.y > H) { s.y = -2; s.x = Math.random() * W; }
      const flicker = 0.7 + 0.3 * Math.sin(s.twinkle);
      const alpha = s.a * flicker;
      const { r, g, b } = s.color;
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      if (s.r > 1.2 && s.layer === 2) {
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.15})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(tick);

  // ---------------- Distant crescent moon ----------------
  const moonSvg = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="moonGrad" cx="32%" cy="38%" r="65%">
          <stop offset="0%" stop-color="#9aa5b8" stop-opacity="0.95"/>
          <stop offset="55%" stop-color="#4a5268" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#1a2230" stop-opacity="0.7"/>
        </radialGradient>
        <radialGradient id="moonTerminator" cx="75%" cy="50%" r="55%">
          <stop offset="0%" stop-color="#0a0e1a" stop-opacity="0"/>
          <stop offset="70%" stop-color="#0a0e1a" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="#0a0e1a" stop-opacity="0.85"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="42" fill="url(#moonGrad)"/>
      <circle cx="50" cy="50" r="42" fill="url(#moonTerminator)"/>
      <circle cx="38" cy="42" r="3.5" fill="#1a2230" opacity="0.35"/>
      <circle cx="45" cy="55" r="2" fill="#1a2230" opacity="0.3"/>
      <circle cx="32" cy="58" r="2.5" fill="#1a2230" opacity="0.35"/>
      <circle cx="50" cy="38" r="1.5" fill="#1a2230" opacity="0.3"/>
      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(154,206,96,0.12)" stroke-width="0.5"/>
    </svg>`;

  const moon = document.createElement('div');
  moon.className = 'moon';
  moon.innerHTML = moonSvg;
  const corners = [
    { top: '12%', right: '8%' },
    { top: '18%', left: '6%' },
    { bottom: '22%', right: '10%' },
  ];
  const pick = corners[(Math.random() * corners.length) | 0];
  Object.assign(moon.style, pick);
  container.appendChild(moon);

  // ---------------- Ship flyover system ----------------
  const shipBay = document.createElement('div');
  shipBay.className = 'ship-bay';
  container.appendChild(shipBay);

  const SHIPS = [
    {
      // Dreadnought: long layered wedge, command tower, engine array
      name: 'dreadnought',
      width: 520,
      svg: `
        <svg viewBox="0 0 600 140" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="30" cy="80" rx="55" ry="24" fill="rgba(154,206,96,0.22)"/>
          <ellipse cx="20" cy="80" rx="80" ry="12" fill="rgba(154,206,96,0.1)"/>
          <path d="M 55 60 L 540 78 L 580 82 L 540 86 L 55 100 Z"
                fill="#2a3448" stroke="#141a26" stroke-width="1"/>
          <path d="M 95 48 L 475 66 L 540 78 L 95 60 Z"
                fill="#1f2837" stroke="#0f1522" stroke-width="0.8"/>
          <path d="M 140 40 L 395 56 L 475 66 L 140 52 Z"
                fill="#1a2230" stroke="#0a0e18" stroke-width="0.7"/>
          <path d="M 110 20 L 170 20 L 180 40 L 100 40 Z" fill="#151c2a"/>
          <rect x="125" y="10" width="30" height="10" fill="#0f1420"/>
          <circle cx="132" cy="15" r="0.8" fill="#f5e9a0" opacity="0.9"/>
          <circle cx="140" cy="15" r="0.8" fill="#f5e9a0" opacity="0.9"/>
          <circle cx="148" cy="15" r="0.8" fill="#f5e9a0" opacity="0.9"/>
          <line x1="140" y1="10" x2="140" y2="0" stroke="#4a5568" stroke-width="1"/>
          <line x1="135" y1="3" x2="145" y2="3" stroke="#4a5568" stroke-width="0.5"/>
          <line x1="120" y1="10" x2="118" y2="2" stroke="#4a5568" stroke-width="0.7"/>
          <g transform="translate(55, 80)">
            <circle cx="0" cy="-14" r="4.5" fill="#c4f29a"/>
            <circle cx="0" cy="-5" r="4.5" fill="#c4f29a"/>
            <circle cx="0" cy="5" r="4.5" fill="#c4f29a"/>
            <circle cx="0" cy="14" r="4.5" fill="#c4f29a"/>
            <circle cx="0" cy="-14" r="2" fill="#ffffff" opacity="0.9"/>
            <circle cx="0" cy="-5" r="2" fill="#ffffff" opacity="0.9"/>
            <circle cx="0" cy="5" r="2" fill="#ffffff" opacity="0.9"/>
            <circle cx="0" cy="14" r="2" fill="#ffffff" opacity="0.9"/>
          </g>
          <circle cx="200" cy="78" r="0.7" fill="#c4f29a" opacity="0.8"/>
          <circle cx="280" cy="76" r="0.7" fill="#c4f29a" opacity="0.8"/>
          <circle cx="360" cy="74" r="0.7" fill="#c4f29a" opacity="0.8"/>
          <circle cx="440" cy="72" r="0.7" fill="#f5e9a0" opacity="0.7"/>
          <circle cx="220" cy="95" r="0.5" fill="#f5e9a0" opacity="0.6"/>
          <circle cx="340" cy="92" r="0.5" fill="#f5e9a0" opacity="0.6"/>
          <circle cx="460" cy="89" r="0.5" fill="#f5e9a0" opacity="0.6"/>
          <line x1="100" y1="70" x2="540" y2="80" stroke="#0a0e18" stroke-width="0.4" opacity="0.6"/>
          <line x1="100" y1="90" x2="540" y2="85" stroke="#0a0e18" stroke-width="0.4" opacity="0.6"/>
          <line x1="200" y1="55" x2="200" y2="98" stroke="#0a0e18" stroke-width="0.3" opacity="0.4"/>
          <line x1="320" y1="58" x2="320" y2="96" stroke="#0a0e18" stroke-width="0.3" opacity="0.4"/>
          <line x1="430" y1="62" x2="430" y2="92" stroke="#0a0e18" stroke-width="0.3" opacity="0.4"/>
        </svg>`,
    },
    {
      // Corvette: mid-sized curved hull, dorsal fin, twin nacelles
      name: 'corvette',
      width: 280,
      svg: `
        <svg viewBox="0 0 320 100" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="25" cy="55" rx="40" ry="14" fill="rgba(154,206,96,0.22)"/>
          <path d="M 40 48 C 40 30, 180 28, 260 42 L 295 50 L 260 58 C 180 72, 40 70, 40 52 Z"
                fill="#2a3448" stroke="#141a26" stroke-width="0.8"/>
          <path d="M 110 38 L 200 32 L 220 42 L 110 46 Z" fill="#1f2837"/>
          <ellipse cx="155" cy="30" rx="14" ry="5" fill="#1a2230"/>
          <rect x="153" y="22" width="4" height="8" fill="#1a2230"/>
          <ellipse cx="90" cy="68" rx="28" ry="6" fill="#1f2837"/>
          <ellipse cx="65" cy="68" rx="5" ry="3.5" fill="#c4f29a"/>
          <circle cx="285" cy="50" r="1.5" fill="#f5e9a0" opacity="0.8"/>
          <g transform="translate(40, 50)">
            <circle cx="0" cy="-4" r="3" fill="#c4f29a"/>
            <circle cx="0" cy="4" r="3" fill="#c4f29a"/>
            <circle cx="0" cy="-4" r="1.2" fill="#ffffff" opacity="0.9"/>
            <circle cx="0" cy="4" r="1.2" fill="#ffffff" opacity="0.9"/>
          </g>
          <circle cx="120" cy="50" r="0.6" fill="#c4f29a" opacity="0.7"/>
          <circle cx="180" cy="48" r="0.6" fill="#c4f29a" opacity="0.7"/>
          <circle cx="230" cy="46" r="0.6" fill="#f5e9a0" opacity="0.7"/>
          <line x1="80" y1="50" x2="260" y2="48" stroke="#0a0e18" stroke-width="0.3" opacity="0.5"/>
        </svg>`,
    },
    {
      // Heavy freighter: boxy utility vessel with cargo modules + antenna array
      name: 'freighter',
      width: 360,
      svg: `
        <svg viewBox="0 0 400 130" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="30" cy="75" rx="45" ry="18" fill="rgba(154,206,96,0.2)"/>
          <rect x="50" y="48" width="90" height="54" fill="#252e3f" stroke="#12182a" stroke-width="0.7"/>
          <rect x="58" y="55" width="22" height="18" fill="#1a2230"/>
          <rect x="84" y="55" width="22" height="18" fill="#1a2230"/>
          <rect x="110" y="55" width="22" height="18" fill="#1a2230"/>
          <rect x="58" y="77" width="22" height="18" fill="#1a2230"/>
          <rect x="84" y="77" width="22" height="18" fill="#1a2230"/>
          <rect x="110" y="77" width="22" height="18" fill="#1a2230"/>
          <rect x="140" y="60" width="80" height="32" fill="#2a3448" stroke="#141a26" stroke-width="0.7"/>
          <path d="M 220 52 L 340 58 L 365 70 L 365 80 L 340 92 L 220 98 Z"
                fill="#2a3448" stroke="#141a26" stroke-width="0.8"/>
          <ellipse cx="320" cy="56" rx="14" ry="5" fill="#1a2230"/>
          <circle cx="315" cy="56" r="0.6" fill="#f5e9a0" opacity="0.9"/>
          <circle cx="320" cy="56" r="0.6" fill="#f5e9a0" opacity="0.9"/>
          <circle cx="325" cy="56" r="0.6" fill="#f5e9a0" opacity="0.9"/>
          <line x1="180" y1="60" x2="180" y2="40" stroke="#4a5568" stroke-width="1"/>
          <line x1="175" y1="48" x2="185" y2="48" stroke="#4a5568" stroke-width="0.5"/>
          <line x1="195" y1="60" x2="195" y2="46" stroke="#4a5568" stroke-width="0.8"/>
          <line x1="170" y1="60" x2="168" y2="50" stroke="#4a5568" stroke-width="0.6"/>
          <g transform="translate(50, 75)">
            <rect x="-5" y="-15" width="5" height="8" fill="#c4f29a"/>
            <rect x="-5" y="-3" width="5" height="8" fill="#c4f29a"/>
            <rect x="-5" y="9" width="5" height="8" fill="#c4f29a"/>
          </g>
          <circle cx="250" cy="96" r="0.7" fill="#c4f29a" opacity="0.8"/>
          <circle cx="290" cy="97" r="0.7" fill="#c4f29a" opacity="0.8"/>
          <circle cx="330" cy="96" r="0.7" fill="#c4f29a" opacity="0.8"/>
          <circle cx="250" cy="55" r="0.5" fill="#f5e9a0" opacity="0.7"/>
          <circle cx="290" cy="54" r="0.5" fill="#f5e9a0" opacity="0.7"/>
        </svg>`,
    },
  ];

  function spawnShip() {
    const ship = SHIPS[(Math.random() * SHIPS.length) | 0];
    const reverse = Math.random() < 0.4;
    const el = document.createElement('div');
    el.className = 'ship';
    el.innerHTML = ship.svg;

    const scale = Math.min(1, window.innerWidth / 1600);
    const width = ship.width * scale;
    el.style.width = `${width}px`;
    el.style.height = 'auto';
    const top = (10 + Math.random() * 55);
    el.style.top = `${top}%`;

    shipBay.appendChild(el);

    const baseDuration = ship.name === 'dreadnought' ? 52000 :
                         ship.name === 'freighter'   ? 42000 : 36000;
    const duration = baseDuration + (Math.random() * 8000 - 4000);
    const offscreen = width + 80;

    const fromX = reverse ? window.innerWidth + offscreen : -offscreen;
    const toX   = reverse ? -offscreen : window.innerWidth + offscreen;
    const flip = reverse ? ' scaleX(-1)' : '';

    const anim = el.animate(
      [
        { transform: `translateX(${fromX}px)${flip}` },
        { transform: `translateX(${toX}px)${flip}` },
      ],
      { duration, easing: 'linear' }
    );
    anim.onfinish = () => el.remove();
  }

  // First ship 8-20s after load, then every 90-150s
  setTimeout(() => {
    spawnShip();
    schedule();
  }, 8000 + Math.random() * 12000);

  function schedule() {
    setTimeout(() => {
      spawnShip();
      schedule();
    }, 90000 + Math.random() * 60000);
  }
})();
