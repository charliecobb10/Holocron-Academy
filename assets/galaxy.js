// ============================================================
// Holocron Academy — Galaxy Map
// Interactive hero for the landing page.
// - Large planet curving below hero
// - Capital ship formation = six trials
// - Fighter squadron = accounting missions
// - Hover shows mission card, click navigates
// - Progress-aware: completed nodes glow green, locked dim
// ============================================================

(function () {
  const mount = document.getElementById('galaxy-map');
  if (!mount) return;

  const progress = window.HolocronProgress;

  // ---------------- Mission data ----------------
  // Each node has: id, type, title, subtitle, description, href, position
  const NODES = [
    // ============ SIX TRIALS — larger capital ships / planets / stations ============
    {
      id: 'trial-1', type: 'trial',
      title: 'Trial I · The Basic Model',
      subtitle: 'Netflix · 2005',
      description: 'Build your first operating model and six-line cash flow. The foundation of everything.',
      href: 'trial-1.html',
      // Featured capital ship at hero center
      x: 50, y: 42, size: 'hero', shape: 'dreadnought',
    },
    {
      id: 'trial-2', type: 'trial',
      title: 'Trial II · Integrated Statements',
      subtitle: 'Ideko',
      description: 'Three statements that tie. Income statement, balance sheet, and cash flow — linked, balanced, audited.',
      href: 'trial-2.html',
      x: 18, y: 30, size: 'large', shape: 'capital-ship',
    },
    {
      id: 'trial-3', type: 'trial',
      title: 'Trial III · Comparable Companies',
      subtitle: 'Fortune Brands · B',
      description: 'Peer selection, multiples, triangulating a valuation from the market\u2019s verdict.',
      href: 'trial-3.html',
      x: 82, y: 30, size: 'large', shape: 'capital-ship',
    },
    {
      id: 'trial-4', type: 'trial',
      title: 'Trial IV · Venture Capital',
      subtitle: 'Fortune Brands · C',
      description: 'Pre-money, post-money, dilution, waterfalls. Value an early-stage company.',
      href: 'trial-4.html',
      x: 28, y: 14, size: 'medium', shape: 'station',
    },
    {
      id: 'trial-5', type: 'trial',
      title: 'Trial V · M&A',
      subtitle: 'Deal Modeling',
      description: 'Accretion, dilution, synergies. Two companies become one.',
      href: 'trial-5.html',
      x: 72, y: 14, size: 'medium', shape: 'station',
    },
    {
      id: 'trial-6', type: 'trial',
      title: 'Trial VI · Leveraged Buyouts',
      subtitle: 'The Final Trial',
      description: 'Debt schedules, returns waterfalls, the IRR hurdle. The final trial.',
      href: 'trial-6.html',
      x: 50, y: 10, size: 'medium', shape: 'station',
    },

    // ============ ACCOUNTING MISSIONS — smaller fighters clustered lower ============
    {
      id: 'accounting-1', type: 'accounting',
      title: 'Accounting Assault',
      subtitle: 'Financial Statements & Articulation',
      description: 'The three statements and how they link. PE/IB-grade accounting, without the debit/credit weeds.',
      href: 'accounting-1.html',
      x: 10, y: 72, size: 'small', shape: 'fighter',
    },
    {
      id: 'accounting-2', type: 'accounting',
      title: 'Working Capital Wars',
      subtitle: 'NWC, Receivables, Inventory',
      description: 'How working capital consumes cash as businesses grow. A/R days, inventory turns, A/P stretch.',
      href: 'accounting-2.html',
      x: 24, y: 80, size: 'small', shape: 'fighter',
    },
    {
      id: 'accounting-3', type: 'accounting',
      title: 'Quality of Earnings',
      subtitle: 'Adjustments & Scrutiny',
      description: 'One-time items, normalized EBITDA, run-rate adjustments. What a QoE report actually does.',
      href: 'accounting-3.html',
      x: 40, y: 76, size: 'small', shape: 'fighter',
    },
    {
      id: 'accounting-4', type: 'accounting',
      title: 'D&A Deep Dive',
      subtitle: 'Depreciation, Amortization, PP&E',
      description: 'Useful lives, existing vs. new asset schedules, the interplay between CapEx and D&A.',
      href: 'accounting-4.html',
      x: 60, y: 76, size: 'small', shape: 'fighter',
    },
    {
      id: 'accounting-5', type: 'accounting',
      title: 'Debt & Interest',
      subtitle: 'Schedules, Covenants, Cash Sweeps',
      description: 'Term loans, revolvers, amortization schedules, how debt actually moves through a model.',
      href: 'accounting-5.html',
      x: 76, y: 80, size: 'small', shape: 'fighter',
    },
    {
      id: 'accounting-6', type: 'accounting',
      title: 'Tax & NOLs',
      subtitle: 'Effective Rates, Carryforwards',
      description: 'Effective vs. statutory, deferred taxes, NOL carryforwards in LBO and M&A contexts.',
      href: 'accounting-6.html',
      x: 90, y: 72, size: 'small', shape: 'fighter',
    },
  ];

  // ---------------- Build planet (background) ----------------
  const planet = `
    <defs>
      <radialGradient id="planetGrad" cx="35%" cy="30%" r="80%">
        <stop offset="0%" stop-color="#c19872" stop-opacity="0.9"/>
        <stop offset="30%" stop-color="#8a6240" stop-opacity="0.85"/>
        <stop offset="60%" stop-color="#4a3524" stop-opacity="0.8"/>
        <stop offset="85%" stop-color="#1d1410" stop-opacity="0.7"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.6"/>
      </radialGradient>
      <radialGradient id="planetAtm" cx="50%" cy="50%" r="50%">
        <stop offset="92%" stop-color="transparent"/>
        <stop offset="96%" stop-color="rgba(196,160,120,0.3)"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <filter id="planetBlur"><feGaussianBlur stdDeviation="0.6"/></filter>

      <!-- Glow filters for nodes -->
      <filter id="glowGreen" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="glowStrong" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>

      <!-- Star sun (light source — upper left) -->
      <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="rgba(255,240,200,0.6)"/>
        <stop offset="40%" stop-color="rgba(255,220,160,0.2)"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
    </defs>

    <!-- Distant sun / light source -->
    <circle cx="8%" cy="12%" r="60" fill="url(#sunGlow)" opacity="0.8"/>
    <circle cx="8%" cy="12%" r="2.5" fill="#fff6d5" opacity="0.9"/>

    <!-- Planet at bottom with heavy curvature — smaller, lower -->
    <circle cx="50%" cy="190%" r="110%" fill="url(#planetGrad)" filter="url(#planetBlur)"/>
    <circle cx="50%" cy="190%" r="110%" fill="url(#planetAtm)" opacity="0.4"/>
    <!-- planet rim highlight (sun side) -->
    <circle cx="50%" cy="190%" r="110%" fill="none" stroke="rgba(255,220,180,0.06)"
            stroke-width="2" stroke-dasharray="40 220" stroke-dashoffset="-100"/>
  `;

  // ---------------- Node shape library ----------------
  function shapeHero(state) {
    // Large, detailed capital ship — hero element
    const engineColor = state === 'completed' ? '#c4f29a' : state === 'locked' ? '#3a4560' : '#9ace60';
    return `
      <g class="ship-sm hero-ship" transform="scale(0.42)">
        <!-- ventral engine glow -->
        <ellipse cx="-80" cy="0" rx="42" ry="16" fill="${engineColor}" opacity="0.25"/>
        <ellipse cx="-95" cy="0" rx="55" ry="7" fill="${engineColor}" opacity="0.12"/>
        <!-- lower hull (elongated wedge, nose right) -->
        <path d="M -75 -12 L 118 3 L 140 6 L 118 9 L -75 22 Z"
              fill="#2a3448" stroke="#0a0e18" stroke-width="0.5"/>
        <!-- middle deck -->
        <path d="M -50 -22 L 85 -8 L 118 3 L -50 -10 Z" fill="#1e2736"/>
        <!-- upper deck -->
        <path d="M -25 -30 L 55 -18 L 85 -8 L -25 -22 Z" fill="#18212f"/>
        <!-- command tower -->
        <path d="M -40 -44 L -5 -44 L 2 -30 L -45 -30 Z" fill="#141b28"/>
        <rect x="-32" y="-52" width="18" height="8" fill="#0e1420"/>
        <!-- bridge lights -->
        <circle cx="-28" cy="-48" r="0.5" fill="#fff6c0"/>
        <circle cx="-23" cy="-48" r="0.5" fill="#fff6c0"/>
        <circle cx="-18" cy="-48" r="0.5" fill="#fff6c0"/>
        <!-- antennae -->
        <line x1="-23" y1="-52" x2="-23" y2="-62" stroke="#4a5568" stroke-width="0.6"/>
        <line x1="-27" y1="-58" x2="-19" y2="-58" stroke="#4a5568" stroke-width="0.3"/>
        <!-- engine array (rear = left) -->
        <g transform="translate(-75, 0)">
          <circle cx="0" cy="-8" r="3" fill="${engineColor}"/>
          <circle cx="0" cy="-2" r="3" fill="${engineColor}"/>
          <circle cx="0" cy="4" r="3" fill="${engineColor}"/>
          <circle cx="0" cy="10" r="3" fill="${engineColor}"/>
          <circle cx="0" cy="-8" r="1.2" fill="#fff"/>
          <circle cx="0" cy="-2" r="1.2" fill="#fff"/>
          <circle cx="0" cy="4" r="1.2" fill="#fff"/>
          <circle cx="0" cy="10" r="1.2" fill="#fff"/>
        </g>
        <!-- running lights along hull -->
        <circle cx="10" cy="2" r="0.4" fill="${engineColor}"/>
        <circle cx="50" cy="0" r="0.4" fill="${engineColor}"/>
        <circle cx="90" cy="1" r="0.4" fill="#fff6c0"/>
        <circle cx="20" cy="17" r="0.3" fill="#fff6c0"/>
        <circle cx="70" cy="14" r="0.3" fill="#fff6c0"/>
      </g>
    `;
  }

  function shapeCapitalShip(state) {
    // Medium capital ship
    const engineColor = state === 'completed' ? '#c4f29a' : state === 'locked' ? '#3a4560' : '#9ace60';
    return `
      <g class="ship-sm" transform="scale(0.5)">
        <ellipse cx="-50" cy="0" rx="28" ry="10" fill="${engineColor}" opacity="0.25"/>
        <path d="M -45 -8 L 70 2 L 88 4 L 70 6 L -45 14 Z" fill="#2a3448" stroke="#0a0e18" stroke-width="0.4"/>
        <path d="M -28 -15 L 55 -5 L 70 2 L -28 -6 Z" fill="#1e2736"/>
        <path d="M -15 -22 L 38 -12 L 55 -5 L -15 -15 Z" fill="#18212f"/>
        <path d="M -25 -30 L 0 -30 L 5 -22 L -28 -22 Z" fill="#141b28"/>
        <rect x="-18" y="-34" width="10" height="4" fill="#0e1420"/>
        <g transform="translate(-45, 3)">
          <circle cx="0" cy="-5" r="2" fill="${engineColor}"/>
          <circle cx="0" cy="0" r="2" fill="${engineColor}"/>
          <circle cx="0" cy="5" r="2" fill="${engineColor}"/>
          <circle cx="0" cy="-5" r="0.8" fill="#fff"/>
          <circle cx="0" cy="0" r="0.8" fill="#fff"/>
          <circle cx="0" cy="5" r="0.8" fill="#fff"/>
        </g>
        <circle cx="20" cy="1" r="0.3" fill="${engineColor}"/>
        <circle cx="50" cy="1" r="0.3" fill="#fff6c0"/>
      </g>
    `;
  }

  function shapeStation(state) {
    // Space station — smaller, geometric, orbital
    const accent = state === 'completed' ? '#c4f29a' : state === 'locked' ? '#3a4560' : '#9ace60';
    return `
      <g class="ship-sm" transform="scale(0.65)">
        <!-- outer ring -->
        <ellipse cx="0" cy="0" rx="32" ry="12" fill="none" stroke="#4a5c7a" stroke-width="1.5" opacity="0.85"/>
        <ellipse cx="0" cy="0" rx="22" ry="8" fill="none" stroke="#3a4560" stroke-width="1" opacity="0.6"/>
        <!-- core -->
        <circle cx="0" cy="0" r="10" fill="#252e3f" stroke="#141a26" stroke-width="0.8"/>
        <circle cx="0" cy="0" r="5" fill="#1a2230"/>
        <circle cx="0" cy="0" r="2" fill="${accent}" opacity="0.8"/>
        <!-- ring lights -->
        <circle cx="-32" cy="0" r="1.2" fill="${accent}"/>
        <circle cx="32" cy="0" r="1.2" fill="${accent}"/>
        <circle cx="0" cy="-12" r="0.8" fill="#fff6c0"/>
        <circle cx="0" cy="12" r="0.8" fill="#fff6c0"/>
        <!-- solar panels -->
        <rect x="-18" y="-14" width="4" height="10" fill="#1a2230" stroke="#141a26" stroke-width="0.3"/>
        <rect x="14" y="4" width="4" height="10" fill="#1a2230" stroke="#141a26" stroke-width="0.3"/>
      </g>
    `;
  }

  function shapeFighter(state) {
    // Small starfighter — accounting missions
    const glow = state === 'completed' ? '#c4f29a' : state === 'locked' ? '#3a4560' : '#9ace60';
    return `
      <g class="ship-sm" transform="scale(1.4)">
        <!-- cockpit nose -->
        <path d="M -8 -3 L 12 -3 L 16 0 L 12 3 L -8 3 Z" fill="#2a3448" stroke="#0a0e18" stroke-width="0.4"/>
        <!-- fuselage -->
        <rect x="-14" y="-1.5" width="8" height="3" fill="#1e2736"/>
        <!-- wings (swept back) -->
        <path d="M -10 -2 L -18 -9 L -6 -6 Z" fill="#1a2230"/>
        <path d="M -10 2 L -18 9 L -6 6 Z" fill="#1a2230"/>
        <!-- wing accents -->
        <line x1="-14" y1="-7" x2="-8" y2="-4" stroke="${glow}" stroke-width="0.4"/>
        <line x1="-14" y1="7" x2="-8" y2="4" stroke="${glow}" stroke-width="0.4"/>
        <!-- canopy -->
        <ellipse cx="4" cy="0" rx="4" ry="1.5" fill="#4a5c7a" opacity="0.6"/>
        <!-- engine glow -->
        <circle cx="-14" cy="0" r="2" fill="${glow}" opacity="0.7"/>
        <circle cx="-16" cy="0" r="1" fill="#fff"/>
      </g>
    `;
  }

  function getNodeSvg(node, state) {
    switch (node.shape) {
      case 'dreadnought': return shapeHero(state);
      case 'capital-ship': return shapeCapitalShip(state);
      case 'station': return shapeStation(state);
      case 'fighter': return shapeFighter(state);
      default: return shapeCapitalShip(state);
    }
  }

  function getMissionState(id) {
    const m = progress.getMission(id);
    return m.status || 'locked';
  }

  // ---------------- Render map ----------------
  function render() {
    const nodeMarkup = NODES.map(node => {
      const state = getMissionState(node.id);
      const interactive = state !== 'locked';
      const filter = state === 'completed' ? 'url(#glowGreen)' :
                     state === 'in-progress' ? 'url(#glowGreen)' : '';
      return `
        <g class="mission-node mission-${state} ${interactive ? 'clickable' : 'locked'}"
           data-id="${node.id}"
           transform="translate(${node.x * 10}, ${node.y * 5})"
           style="${filter ? `filter:${filter}` : ''}">
          ${getNodeSvg(node, state)}
          ${state === 'completed' ? `
            <circle cx="0" cy="0" r="${node.size === 'hero' ? 90 : node.size === 'large' ? 55 : node.size === 'medium' ? 40 : 22}"
                    fill="none" stroke="rgba(154,206,96,0.35)" stroke-width="1"
                    class="completion-ring"/>` : ''}
        </g>
      `;
    }).join('');

    mount.innerHTML = `
      <svg class="galaxy-svg" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        ${planet}
        ${nodeMarkup}
      </svg>
      <div id="node-hover-card" class="node-hover-card"></div>
    `;

    bindEvents();
  }

  // ---------------- Hover card + interaction ----------------
  let hoverCard;
  let currentHover = null;

  function bindEvents() {
    hoverCard = document.getElementById('node-hover-card');
    const nodes = mount.querySelectorAll('.mission-node');

    nodes.forEach(nodeEl => {
      const id = nodeEl.dataset.id;
      const nodeData = NODES.find(n => n.id === id);
      const state = getMissionState(id);

      nodeEl.addEventListener('mouseenter', (e) => showHover(nodeData, state, nodeEl));
      nodeEl.addEventListener('mouseleave', () => { currentHover = null; hoverCard.classList.remove('visible'); });
      nodeEl.addEventListener('mousemove', (e) => positionHover(e));

      if (state !== 'locked') {
        nodeEl.addEventListener('click', () => { window.location.href = nodeData.href; });
        nodeEl.style.cursor = 'pointer';
      } else {
        nodeEl.style.cursor = 'not-allowed';
      }
    });
  }

  function showHover(nodeData, state, nodeEl) {
    currentHover = nodeData.id;
    const m = progress.getMission(nodeData.id);
    const statusLabel =
      state === 'completed' ? 'COMPLETED' :
      state === 'in-progress' ? 'IN PROGRESS' :
      state === 'unlocked' ? 'READY' :
      'LOCKED';

    const statusColor =
      state === 'completed' ? 'var(--jedi)' :
      state === 'in-progress' ? 'var(--amber)' :
      state === 'unlocked' ? 'var(--jedi)' :
      'var(--ink-faint)';

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
    hoverCard.classList.add('visible');
  }

  function positionHover(e) {
    if (!currentHover) return;
    const rect = mount.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Position card to the right of cursor, flipping if near right edge
    const cardWidth = 320;
    const cardHeight = 200;
    let left = x + 20;
    let top = y - cardHeight / 2;
    if (left + cardWidth > rect.width - 20) left = x - cardWidth - 20;
    if (top < 10) top = 10;
    if (top + cardHeight > rect.height - 10) top = rect.height - cardHeight - 10;
    hoverCard.style.left = `${left}px`;
    hoverCard.style.top = `${top}px`;
  }

  render();

  // Re-render if progress changes (e.g., on return from a mission completion)
  window.addEventListener('storage', (e) => { if (e.key === 'holocron.progress.v1') render(); });
  // Also re-render when page becomes visible (user returns from a mission)
  document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
})();
