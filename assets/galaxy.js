// ============================================================
// Holocron Academy — Galaxy Map (Cinematic v2)
// - Smaller, realistic planet with atmospheric rim
// - Nebula clouds (purple, teal, pink) for depth
// - Side-lit ship silhouettes with gradient hulls
// - Fixed hover behavior (no transform glitch)
// ============================================================

(function () {
  const mount = document.getElementById('galaxy-map');
  if (!mount) return;

  const progress = window.HolocronProgress;

  // ---------------- Mission nodes ----------------
  const NODES = [
    // Trials — capital ships & stations
    { id: 'trial-1', type: 'trial',
      title: 'Trial I · The Basic Model', subtitle: 'Netflix · 2005',
      description: 'Build your first operating model and six-line cash flow. The foundation of everything.',
      href: 'trial-1.html',
      x: 50, y: 42, size: 'hero', shape: 'dreadnought' },
    { id: 'trial-2', type: 'trial',
      title: 'Trial II · Integrated Statements', subtitle: 'Ideko',
      description: 'Three statements that tie. Income statement, balance sheet, and cash flow — linked, balanced, audited.',
      href: 'trial-2.html',
      x: 18, y: 30, size: 'large', shape: 'capital-ship' },
    { id: 'trial-3', type: 'trial',
      title: 'Trial III · Comparable Companies', subtitle: 'Fortune Brands · B',
      description: 'Peer selection, multiples, triangulating a valuation from the market\u2019s verdict.',
      href: 'trial-3.html',
      x: 82, y: 30, size: 'large', shape: 'capital-ship' },
    { id: 'trial-4', type: 'trial',
      title: 'Trial IV · Venture Capital', subtitle: 'Fortune Brands · C',
      description: 'Pre-money, post-money, dilution, waterfalls. Value an early-stage company.',
      href: 'trial-4.html',
      x: 28, y: 14, size: 'medium', shape: 'station' },
    { id: 'trial-5', type: 'trial',
      title: 'Trial V · M&A', subtitle: 'Deal Modeling',
      description: 'Accretion, dilution, synergies. Two companies become one.',
      href: 'trial-5.html',
      x: 72, y: 14, size: 'medium', shape: 'station' },
    { id: 'trial-6', type: 'trial',
      title: 'Trial VI · Leveraged Buyouts', subtitle: 'The Final Trial',
      description: 'Debt schedules, returns waterfalls, the IRR hurdle. The final trial.',
      href: 'trial-6.html',
      x: 50, y: 10, size: 'medium', shape: 'station' },
    // Accounting missions — fighter squadron
    { id: 'accounting-1', type: 'accounting',
      title: 'Accounting Assault', subtitle: 'Financial Statements & Articulation',
      description: 'The three statements and how they link. PE/IB-grade accounting, without the debit/credit weeds.',
      href: 'accounting-1.html',
      x: 10, y: 72, size: 'small', shape: 'fighter' },
    { id: 'accounting-2', type: 'accounting',
      title: 'Working Capital Wars', subtitle: 'NWC, Receivables, Inventory',
      description: 'How working capital consumes cash as businesses grow.',
      href: 'accounting-2.html',
      x: 24, y: 80, size: 'small', shape: 'fighter' },
    { id: 'accounting-3', type: 'accounting',
      title: 'Quality of Earnings', subtitle: 'Adjustments & Scrutiny',
      description: 'One-time items, normalized EBITDA, what a QoE report actually does.',
      href: 'accounting-3.html',
      x: 40, y: 76, size: 'small', shape: 'fighter' },
    { id: 'accounting-4', type: 'accounting',
      title: 'D&A Deep Dive', subtitle: 'Depreciation, Amortization, PP&E',
      description: 'Useful lives, asset schedules, the interplay between CapEx and D&A.',
      href: 'accounting-4.html',
      x: 60, y: 76, size: 'small', shape: 'fighter' },
    { id: 'accounting-5', type: 'accounting',
      title: 'Debt & Interest', subtitle: 'Schedules, Covenants, Cash Sweeps',
      description: 'Term loans, revolvers, amortization schedules, how debt moves through a model.',
      href: 'accounting-5.html',
      x: 76, y: 80, size: 'small', shape: 'fighter' },
    { id: 'accounting-6', type: 'accounting',
      title: 'Tax & NOLs', subtitle: 'Effective Rates, Carryforwards',
      description: 'Effective vs. statutory, deferred taxes, NOL carryforwards in LBO/M&A contexts.',
      href: 'accounting-6.html',
      x: 90, y: 72, size: 'small', shape: 'fighter' },
  ];

  // ---------------- SVG defs (gradients, filters) ----------------
  const defs = `
    <defs>
      <!-- Realistic planet -->
      <radialGradient id="planetGrad" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stop-color="#5a4838" stop-opacity="1"/>
        <stop offset="35%" stop-color="#2a2218" stop-opacity="1"/>
        <stop offset="75%" stop-color="#0a0804" stop-opacity="1"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="1"/>
      </radialGradient>
      <radialGradient id="planetRim" cx="50%" cy="50%" r="50%">
        <stop offset="94%" stop-color="transparent"/>
        <stop offset="97%" stop-color="rgba(200,140,90,0.4)"/>
        <stop offset="99%" stop-color="rgba(255,180,120,0.25)"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>

      <!-- Nebula clouds -->
      <radialGradient id="nebulaPurple" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="rgba(130,70,180,0.28)"/>
        <stop offset="45%" stop-color="rgba(90,50,140,0.10)"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <radialGradient id="nebulaTeal" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="rgba(60,160,200,0.22)"/>
        <stop offset="50%" stop-color="rgba(40,120,170,0.08)"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <radialGradient id="nebulaPink" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="rgba(220,100,150,0.18)"/>
        <stop offset="55%" stop-color="rgba(180,60,120,0.05)"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>

      <!-- Sun -->
      <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="rgba(255,240,200,0.65)"/>
        <stop offset="40%" stop-color="rgba(255,220,160,0.18)"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>

      <!-- Ship hull lighting (lit top, dark bottom) -->
      <linearGradient id="hullLight" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#4a5468"/>
        <stop offset="45%" stop-color="#2a3448"/>
        <stop offset="100%" stop-color="#0a0e18"/>
      </linearGradient>
      <linearGradient id="hullMid" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#2a3448"/>
        <stop offset="100%" stop-color="#0a0e18"/>
      </linearGradient>
      <linearGradient id="hullDeep" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#18212f"/>
        <stop offset="100%" stop-color="#04060a"/>
      </linearGradient>

      <filter id="glowGreen" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
  `;

  // ---------------- Backdrop (nebulas, sun, planet) ----------------
  const backdrop = `
    <!-- Nebula clouds (back layer) -->
    <ellipse cx="180" cy="130" rx="380" ry="120" fill="url(#nebulaPurple)"/>
    <ellipse cx="780" cy="180" rx="340" ry="140" fill="url(#nebulaTeal)"/>
    <ellipse cx="500" cy="70" rx="300" ry="60" fill="url(#nebulaPink)"/>
    <ellipse cx="850" cy="380" rx="200" ry="100" fill="url(#nebulaPurple)" opacity="0.6"/>

    <!-- Distant sun (upper left, provides lighting direction) -->
    <circle cx="95" cy="75" r="45" fill="url(#sunGlow)"/>
    <circle cx="95" cy="75" r="2.2" fill="#fff6d5"/>

    <!-- Planet (smaller, more realistic, lower) -->
    <circle cx="500" cy="870" r="580" fill="url(#planetGrad)"/>
    <circle cx="500" cy="870" r="580" fill="url(#planetRim)"/>
    <!-- Terminator line (day/night border) -->
    <ellipse cx="300" cy="700" rx="200" ry="60" fill="rgba(120,80,55,0.08)"/>
  `;

  // ---------------- Ship shape library ----------------
  function shapeHero(state) {
    const engineColor = state === 'completed' ? '#c4f29a' : state === 'locked' ? '#3a4560' : '#9ace60';
    return `
      <g class="ship-sm hero-ship" transform="scale(0.5)">
        <!-- Multi-layer engine glow -->
        <ellipse cx="-95" cy="0" rx="65" ry="24" fill="${engineColor}" opacity="0.15"/>
        <ellipse cx="-85" cy="0" rx="48" ry="15" fill="${engineColor}" opacity="0.3"/>
        <ellipse cx="-75" cy="0" rx="25" ry="8" fill="${engineColor}" opacity="0.55"/>
        <!-- Main hull (long sleek wedge) -->
        <path d="M -75 -10 L 100 -2 L 140 4 L 100 10 L -75 20 Z"
              fill="url(#hullLight)" stroke="#030508" stroke-width="0.4"/>
        <!-- Dark shadow underside -->
        <path d="M -75 20 L 140 4 L 140 6 L 100 12 L -75 22 Z" fill="url(#hullDeep)"/>
        <!-- Middle deck -->
        <path d="M -55 -20 L 75 -11 L 100 -2 L -55 -8 Z"
              fill="url(#hullMid)" stroke="#030508" stroke-width="0.3"/>
        <!-- Upper deck (stepped) -->
        <path d="M -30 -30 L 50 -20 L 75 -11 L -30 -20 Z" fill="#12192a"/>
        <path d="M -10 -38 L 30 -30 L 50 -20 L -10 -28 Z" fill="#0a0f1a"/>
        <!-- Command tower -->
        <path d="M -40 -52 L 0 -52 L 5 -38 L -45 -38 Z" fill="#060a14"/>
        <rect x="-32" y="-60" width="22" height="8" fill="#04060c"/>
        <!-- Bridge windows (lit) -->
        <circle cx="-28" cy="-56" r="0.7" fill="#fff6c0"/>
        <circle cx="-22" cy="-56" r="0.7" fill="#fff6c0"/>
        <circle cx="-16" cy="-56" r="0.7" fill="#fff6c0"/>
        <!-- Antenna spire -->
        <line x1="-22" y1="-60" x2="-22" y2="-76" stroke="#3a4560" stroke-width="0.7"/>
        <line x1="-27" y1="-70" x2="-17" y2="-70" stroke="#3a4560" stroke-width="0.4"/>
        <circle cx="-22" cy="-76" r="0.6" fill="${engineColor}" opacity="0.9"/>
        <!-- Engine array with bright cores -->
        <g transform="translate(-75, 0)">
          <circle cx="0" cy="-10" r="3.2" fill="${engineColor}"/>
          <circle cx="0" cy="-3" r="3.2" fill="${engineColor}"/>
          <circle cx="0" cy="4" r="3.2" fill="${engineColor}"/>
          <circle cx="0" cy="11" r="3.2" fill="${engineColor}"/>
          <circle cx="0" cy="-10" r="1.3" fill="#fff"/>
          <circle cx="0" cy="-3" r="1.3" fill="#fff"/>
          <circle cx="0" cy="4" r="1.3" fill="#fff"/>
          <circle cx="0" cy="11" r="1.3" fill="#fff"/>
        </g>
        <!-- Paneling (detail lines) -->
        <line x1="-20" y1="-1" x2="90" y2="1" stroke="#030508" stroke-width="0.3" opacity="0.7"/>
        <line x1="-20" y1="12" x2="90" y2="8" stroke="#030508" stroke-width="0.3" opacity="0.7"/>
        <line x1="30" y1="-16" x2="30" y2="15" stroke="#030508" stroke-width="0.25" opacity="0.5"/>
        <line x1="60" y1="-8" x2="60" y2="12" stroke="#030508" stroke-width="0.25" opacity="0.5"/>
        <!-- Running lights -->
        <circle cx="0" cy="3" r="0.45" fill="${engineColor}" opacity="0.9"/>
        <circle cx="40" cy="2" r="0.45" fill="${engineColor}" opacity="0.9"/>
        <circle cx="85" cy="2" r="0.45" fill="#fff6c0" opacity="0.9"/>
        <circle cx="20" cy="15" r="0.3" fill="#fff6c0" opacity="0.6"/>
        <circle cx="65" cy="10" r="0.3" fill="#fff6c0" opacity="0.6"/>
      </g>
    `;
  }

  function shapeCapitalShip(state) {
    const engineColor = state === 'completed' ? '#c4f29a' : state === 'locked' ? '#3a4560' : '#9ace60';
    return `
      <g class="ship-sm" transform="scale(0.45)">
        <ellipse cx="-60" cy="0" rx="38" ry="13" fill="${engineColor}" opacity="0.18"/>
        <ellipse cx="-52" cy="0" rx="22" ry="7" fill="${engineColor}" opacity="0.4"/>
        <path d="M -45 -6 L 65 -1 L 90 3 L 65 7 L -45 13 Z"
              fill="url(#hullLight)" stroke="#030508" stroke-width="0.3"/>
        <path d="M -45 13 L 90 3 L 90 5 L 65 9 L -45 14 Z" fill="url(#hullDeep)"/>
        <path d="M -30 -14 L 45 -6 L 65 -1 L -30 -4 Z" fill="url(#hullMid)"/>
        <path d="M -15 -22 L 28 -14 L 45 -6 L -15 -14 Z" fill="#0c1322"/>
        <path d="M -28 -32 L 2 -32 L 6 -22 L -30 -22 Z" fill="#06090f"/>
        <rect x="-20" y="-38" width="14" height="6" fill="#040609"/>
        <circle cx="-16" cy="-35" r="0.45" fill="#fff6c0"/>
        <circle cx="-12" cy="-35" r="0.45" fill="#fff6c0"/>
        <line x1="-14" y1="-38" x2="-14" y2="-48" stroke="#3a4560" stroke-width="0.5"/>
        <g transform="translate(-45, 2)">
          <circle cx="0" cy="-6" r="2.3" fill="${engineColor}"/>
          <circle cx="0" cy="0" r="2.3" fill="${engineColor}"/>
          <circle cx="0" cy="6" r="2.3" fill="${engineColor}"/>
          <circle cx="0" cy="-6" r="0.95" fill="#fff"/>
          <circle cx="0" cy="0" r="0.95" fill="#fff"/>
          <circle cx="0" cy="6" r="0.95" fill="#fff"/>
        </g>
        <circle cx="15" cy="2" r="0.35" fill="${engineColor}" opacity="0.9"/>
        <circle cx="50" cy="2" r="0.35" fill="#fff6c0" opacity="0.9"/>
      </g>
    `;
  }

  function shapeStation(state) {
    const accent = state === 'completed' ? '#c4f29a' : state === 'locked' ? '#3a4560' : '#9ace60';
    return `
      <g class="ship-sm" transform="scale(0.6)">
        <ellipse cx="0" cy="0" rx="34" ry="13" fill="none" stroke="#4a5c7a" stroke-width="1.5" opacity="0.9"/>
        <ellipse cx="0" cy="0" rx="34" ry="13" fill="none" stroke="${accent}" stroke-width="0.3" opacity="0.5"/>
        <ellipse cx="0" cy="0" rx="22" ry="8" fill="none" stroke="#2a3448" stroke-width="1" opacity="0.7"/>
        <circle cx="0" cy="0" r="11" fill="url(#hullLight)" stroke="#030508" stroke-width="0.5"/>
        <circle cx="0" cy="0" r="6" fill="#060a14"/>
        <circle cx="0" cy="0" r="2.5" fill="${accent}" opacity="0.9"/>
        <circle cx="0" cy="0" r="1" fill="#fff" opacity="0.85"/>
        <circle cx="-34" cy="0" r="1.5" fill="${accent}"/>
        <circle cx="34" cy="0" r="1.5" fill="${accent}"/>
        <circle cx="0" cy="-13" r="1" fill="#fff6c0"/>
        <circle cx="0" cy="13" r="1" fill="#fff6c0"/>
        <rect x="-20" y="-16" width="5" height="12" fill="#06090f" stroke="#1a2030" stroke-width="0.4"/>
        <line x1="-17.5" y1="-15" x2="-17.5" y2="-5" stroke="#1a2030" stroke-width="0.2"/>
        <rect x="15" y="4" width="5" height="12" fill="#06090f" stroke="#1a2030" stroke-width="0.4"/>
        <line x1="17.5" y1="5" x2="17.5" y2="15" stroke="#1a2030" stroke-width="0.2"/>
      </g>
    `;
  }

  function shapeFighter(state) {
    const glow = state === 'completed' ? '#c4f29a' : state === 'locked' ? '#3a4560' : '#9ace60';
    return `
      <g class="ship-sm" transform="scale(1.3)">
        <ellipse cx="-17" cy="0" rx="5" ry="1.6" fill="${glow}" opacity="0.4"/>
        <path d="M -10 -3 L 14 -3 L 18 0 L 14 3 L -10 3 Z"
              fill="url(#hullLight)" stroke="#030508" stroke-width="0.3"/>
        <rect x="-14" y="-1.8" width="6" height="3.6" fill="#0a0e18"/>
        <path d="M -8 -2 L -18 -11 L -14 -9 L -4 -4 Z" fill="#1a2030" stroke="#030508" stroke-width="0.2"/>
        <path d="M -8 2 L -18 11 L -14 9 L -4 4 Z" fill="#1a2030" stroke="#030508" stroke-width="0.2"/>
        <line x1="-17" y1="-10" x2="-10" y2="-5" stroke="${glow}" stroke-width="0.5"/>
        <line x1="-17" y1="10" x2="-10" y2="5" stroke="${glow}" stroke-width="0.5"/>
        <ellipse cx="5" cy="-0.2" rx="4.5" ry="1.5" fill="#2a3f5a" opacity="0.85"/>
        <ellipse cx="5" cy="-0.5" rx="3" ry="0.8" fill="#4a6fa5" opacity="0.6"/>
        <circle cx="-14" cy="0" r="2" fill="${glow}"/>
        <circle cx="-14" cy="0" r="0.9" fill="#fff"/>
        <circle cx="17" cy="0" r="0.5" fill="#fff6c0"/>
      </g>
    `;
  }

  function getNodeSvg(node, state) {
    switch (node.shape) {
      case 'dreadnought':   return shapeHero(state);
      case 'capital-ship':  return shapeCapitalShip(state);
      case 'station':       return shapeStation(state);
      case 'fighter':       return shapeFighter(state);
      default:              return shapeCapitalShip(state);
    }
  }

  function getMissionState(id) {
    return progress.getMission(id).status || 'locked';
  }

  // ---------------- Render ----------------
  function render() {
    const nodeMarkup = NODES.map(node => {
      const state = getMissionState(node.id);
      const interactive = state !== 'locked';
      const filter = (state === 'completed' || state === 'in-progress') ? 'filter:url(#glowGreen)' : '';
      const ringSize = node.size === 'hero' ? 100 : node.size === 'large' ? 60 : node.size === 'medium' ? 45 : 28;
      return `
        <g class="mission-node mission-${state} ${interactive ? 'clickable' : 'locked'}"
           data-id="${node.id}"
           transform="translate(${node.x * 10}, ${node.y * 5})"
           style="${filter}">
          ${getNodeSvg(node, state)}
          ${state === 'completed' ? `<circle cx="0" cy="0" r="${ringSize}" fill="none" stroke="rgba(154,206,96,0.35)" stroke-width="1" class="completion-ring"/>` : ''}
        </g>
      `;
    }).join('');

    mount.innerHTML = `
      <svg class="galaxy-svg" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        ${defs}
        ${backdrop}
        ${nodeMarkup}
      </svg>
      <div id="node-hover-card" class="node-hover-card"></div>
    `;

    bindEvents();
  }

  // ---------------- Events (fixed-position hover card) ----------------
  function bindEvents() {
    const hoverCard = document.getElementById('node-hover-card');
    const nodes = mount.querySelectorAll('.mission-node');

    nodes.forEach(nodeEl => {
      const id = nodeEl.dataset.id;
      const nodeData = NODES.find(n => n.id === id);
      const state = getMissionState(id);

      nodeEl.addEventListener('mouseenter', () => showHover(nodeData, state, nodeEl, hoverCard));
      nodeEl.addEventListener('mouseleave', () => hoverCard.classList.remove('visible'));

      if (state !== 'locked') {
        nodeEl.addEventListener('click', () => { window.location.href = nodeData.href; });
        nodeEl.style.cursor = 'pointer';
      } else {
        nodeEl.style.cursor = 'not-allowed';
      }
    });
  }

  function showHover(nodeData, state, nodeEl, hoverCard) {
    const m = progress.getMission(nodeData.id);
    const statusLabel =
      state === 'completed' ? 'COMPLETED' :
      state === 'in-progress' ? 'IN PROGRESS' :
      state === 'unlocked' ? 'READY' : 'LOCKED';
    const statusColor =
      state === 'completed' ? 'var(--jedi)' :
      state === 'in-progress' ? 'var(--amber)' :
      state === 'unlocked' ? 'var(--jedi)' : 'var(--ink-faint)';

    let progressLine = '';
    if (m.quizScore != null) progressLine += `<div class="card-metric">Best quiz: <span style="color:var(--jedi)">${m.quizScore}%</span></div>`;
    if (m.bestGrade != null) progressLine += `<div class="card-metric">Best grade: <span style="color:var(--jedi)">${m.bestGrade}%</span></div>`;
    if ((m.lessonsRead || []).length > 0) progressLine += `<div class="card-metric">Lessons read: <span style="color:var(--jedi)">${m.lessonsRead.length}</span></div>`;

    hoverCard.innerHTML = `
      <div class="card-type">${nodeData.type === 'trial' ? 'MODELING TRIAL' : 'ACCOUNTING MISSION'}</div>
      <div class="card-title">${nodeData.title}</div>
      <div class="card-sub">${nodeData.subtitle}</div>
      <div class="card-desc">${nodeData.description}</div>
      ${progressLine ? `<div class="card-progress">${progressLine}</div>` : ''}
      <div class="card-status" style="color:${statusColor}">${statusLabel} ${state !== 'locked' ? '· Click to enter' : ''}</div>
    `;

    // Position card at fixed offset from node's on-screen position
    const mapRect = mount.getBoundingClientRect();
    const nodeRect = nodeEl.getBoundingClientRect();
    const cardWidth = 320;
    const cardHeight = 220;
    const nodeCenterX = nodeRect.left - mapRect.left + nodeRect.width / 2;
    const nodeCenterY = nodeRect.top - mapRect.top + nodeRect.height / 2;

    // Default: place card to the right of node
    let left = nodeCenterX + nodeRect.width / 2 + 20;
    let top = nodeCenterY - cardHeight / 2;

    // Flip to left if would overflow right edge
    if (left + cardWidth > mapRect.width - 10) {
      left = nodeCenterX - nodeRect.width / 2 - cardWidth - 20;
    }
    // Clamp top
    if (top < 10) top = 10;
    if (top + cardHeight > mapRect.height - 10) top = mapRect.height - cardHeight - 10;

    hoverCard.style.left = `${left}px`;
    hoverCard.style.top = `${top}px`;
    hoverCard.classList.add('visible');
  }

  render();

  // Re-render on progress changes or when returning to tab
  window.addEventListener('storage', (e) => { if (e.key === 'holocron.progress.v1') render(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
})();
