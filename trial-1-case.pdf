// Animated starfield — drifts slowly, parallax layers
(function() {
  const container = document.querySelector('.starfield');
  if (!container) return;

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let stars = [];
  let W = 0, H = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const density = Math.min(220, Math.floor((W * H) / 9000));
    stars = [];
    for (let i = 0; i < density; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.2,
        vy: (Math.random() * 0.3 + 0.05),
        a: Math.random() * 0.6 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
      });
    }
  }

  function tick(t) {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.y += s.vy;
      s.twinkle += 0.02;
      if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
      const alpha = s.a * (0.6 + 0.4 * Math.sin(s.twinkle));
      ctx.fillStyle = `rgba(200, 220, 180, ${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      if (s.r > 0.9) {
        ctx.fillStyle = `rgba(154, 206, 96, ${alpha * 0.3})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(tick);
})();
