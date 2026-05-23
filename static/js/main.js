
(function() {
  const services = [
    { icon: '🌐', title: 'Websites',              desc: 'Professional, branded websites that represent your business and convert visitors into customers.' },
    { icon: '🖥️', title: 'Portals',               desc: 'Custom admin portals and dashboards so you always know what\'s happening in your business.' },
    { icon: '⚙️', title: 'Workflow Systems',       desc: 'Replace manual processes with systems that track, remind, and report automatically.' },
    { icon: '🤖', title: 'Automation',             desc: 'Save hours every week by automating the repetitive tasks that slow your team down.' },
    { icon: '🚀', title: 'Onboarding Systems',     desc: 'Structured digital onboarding flows that get clients, members, or staff up to speed fast.' },
    { icon: '👥', title: 'Customer Management',    desc: 'Purpose-built CRM tools tailored to how your business actually operates day to day.' },
    { icon: '💳', title: 'Scheduling & Payments',  desc: 'Integrated booking and payment systems that work seamlessly for you and your customers.' },
    { icon: '✨', title: 'Branded Experiences',    desc: 'Polished digital products that reflect your brand and leave a lasting impression.' },
  ];

  const canvas  = document.getElementById('globeCanvas');
  const ctx     = canvas.getContext('2d');
  const gcIcon  = document.getElementById('gcIcon');
  const gcTitle = document.getElementById('gcTitle');
  const gcDesc  = document.getElementById('gcDesc');

  const N = services.length;
  let W, H, cx, cy, R;

  function resize() {
    const scene = canvas.parentElement;
    W = canvas.width  = scene.offsetWidth;
    H = canvas.height = scene.offsetHeight;
    cx = W / 2; cy = H / 2;
    R  = Math.min(W, H) * 0.41;
  }
  resize();
  window.addEventListener('resize', resize);

  // Each point has its OWN elliptical orbit with unique tilt, size, and speed.
  // This gives the "imaginary orbit" feel — each one traces its own path.
  // Timing is controlled separately: every 7s the activeIdx advances,
  // and whichever point is active gets highlighted right where it is.

  const STEP_MS = 7000;
  let activeIdx    = 0;
  let highlightIdx = -1;
  let lastStep     = performance.now();
  let lastFrame    = performance.now();

  // Each point has its own elliptical orbit with unique tilt, size, and speed
  const orbits = services.map((_, i) => ({
    rx:    R * (0.72 + (i % 3) * 0.10),
    ry:    R * (0.28 + (i % 4) * 0.07),
    tilt:  (i / N) * Math.PI * 0.9,
    angle: (i / N) * Math.PI * 2,
    speed: 0.00018 + (i % 3) * 0.00004,
  }));

  function setHighlight(idx) {
    if (idx === highlightIdx) return;
    highlightIdx = idx;
    const s = services[idx];
    gcIcon.style.opacity = gcTitle.style.opacity = gcDesc.style.opacity = '0';
    setTimeout(() => {
      gcIcon.textContent  = s.icon;
      gcTitle.textContent = s.title;
      gcDesc.textContent  = s.desc;
      gcIcon.style.opacity = gcTitle.style.opacity = gcDesc.style.opacity = '1';
    }, 220);
  }

  function draw() {
    const now = performance.now();
    const dt  = now - lastFrame;
    lastFrame = now;

    // advance active index every 7 seconds
    if (now - lastStep >= STEP_MS) {
      activeIdx = (activeIdx + 1) % N;
      lastStep  = now;
      setHighlight(activeIdx);
    }

    // advance each orbit independently
    orbits.forEach(o => { o.angle += o.speed * dt; });

    ctx.clearRect(0, 0, W, H);

    // pronounced glow behind center circle
    const cGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 230);
    cGlow.addColorStop(0,    'rgba(55,138,221,0.60)');
    cGlow.addColorStop(0.35, 'rgba(55,138,221,0.35)');
    cGlow.addColorStop(0.70, 'rgba(55,138,221,0.12)');
    cGlow.addColorStop(1,    'transparent');
    ctx.beginPath(); ctx.arc(cx, cy, 230, 0, Math.PI * 2);
    ctx.fillStyle = cGlow; ctx.fill();

    // large outer circle
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(55,138,221,0.28)';
    ctx.lineWidth   = 1.5; ctx.stroke();



    // compute screen positions
    const pts = orbits.map((o, i) => {
      const lx    = Math.cos(o.angle) * o.rx;
      const ly    = Math.sin(o.angle) * o.ry;
      const px    = cx + lx * Math.cos(o.tilt) - ly * Math.sin(o.tilt);
      const py    = cy + lx * Math.sin(o.tilt) + ly * Math.cos(o.tilt);
      const depth = (Math.sin(o.angle) * Math.cos(o.tilt) + 1) / 2;
      return { px, py, depth, angle: o.angle, i };
    });

    // paint back-to-front
    pts.sort((a, b) => a.depth - b.depth).forEach(({ px, py, depth, angle, i }) => {
      const isActive = i === activeIdx;
      const svc = services[i];

      // active glow halos
      if (isActive) {
        ctx.beginPath(); ctx.arc(px, py, 16, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(55,138,221,0.12)'; ctx.fill();
        ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(55,138,221,0.24)'; ctx.fill();
      }

      // dot
      const dotR = isActive ? 7 : 3 + depth * 2.5;
      ctx.beginPath(); ctx.arc(px, py, dotR, 0, Math.PI * 2);
      if (isActive) {
        ctx.fillStyle   = '#378ADD';
        ctx.shadowColor = 'rgba(55,138,221,1)';
        ctx.shadowBlur  = 20;
      } else {
        ctx.fillStyle  = `rgba(133,183,235,${0.3 + depth * 0.55})`;
        ctx.shadowBlur = 0;
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      // label
      const label    = svc.title;
      const fontSize = isActive ? 14 : 10 + depth * 2;
      ctx.font       = `${isActive ? 700 : 400} ${fontSize}px 'Syne', sans-serif`;

      // offset label to the side of the dot
      const dx = px - cx;
      const labelOffsetX = dx >= 0 ? dotR + 8 : -(ctx.measureText(label).width + dotR + 8);
      const lx2 = px + labelOffsetX;
      const ly2 = py + fontSize * 0.36;

      if (isActive) {
        // pill with border highlight
        ctx.textAlign = 'left';
        const tw  = ctx.measureText(label).width;
        const pad = 8;
        ctx.fillStyle = 'rgba(2,27,51,0.92)';
        ctx.beginPath();
        ctx.roundRect(lx2 - pad, ly2 - fontSize, tw + pad * 2, fontSize + pad + 2, 6);
        ctx.fill();
        ctx.strokeStyle = 'rgba(55,138,221,0.6)';
        ctx.lineWidth   = 1.5;
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.fillText(label, lx2, ly2);
      } else {
        ctx.textAlign = 'left';
        ctx.fillStyle = `rgba(181,212,244,${0.3 + depth * 0.5})`;
        ctx.fillText(label, lx2, ly2);
      }
    });

    requestAnimationFrame(draw);
  }

  // init
  setHighlight(0);
  draw();
})();

// counter animation
function animateCount(el, target, suffix, duration) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.round(start) + suffix;
    if (start >= target) clearInterval(timer);
  }, 16);
}

// scroll reveal — re-triggers every time element enters viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    } else {
      e.target.classList.remove('visible');
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// counter trigger when hero visible
const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    setTimeout(() => animateCount(document.getElementById('cnt-delegates'), 128, '', 1200), 600);
    setTimeout(() => animateCount(document.getElementById('cnt-onboard'), 84, '%', 1200), 700);
    setTimeout(() => animateCount(document.getElementById('cnt-pay'), 24, 'k', 1000), 800);
    heroObserver.disconnect();
  }
}, { threshold: 0.3 });
heroObserver.observe(document.getElementById('hero'));

// nav scroll effect
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.style.background = window.scrollY > 40
    ? 'rgba(2,27,51,0.97)'
    : 'rgba(2,27,51,0.85)';
});

// Rising line with animated nodes
(function() {
  const canvas = document.getElementById('ekgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  const descs = [
    'We talk through your goals, pain points, and what success looks like for your business.',
    'I design and develop your platform with clean, efficient code built around your workflow.',
    'We launch your platform, I provide support, and your business starts running smarter.',
  ];

  // Zigzag line — nodes sit exactly at the 3 peaks
  const linePoints = [
    { xf: 0.00, yf: 0.98 },
    { xf: 0.07, yf: 0.82 },
    { xf: 0.18, yf: 0.90 },
    { xf: 0.28, yf: 0.58 }, // peak 1 — node 0 (Discover)
    { xf: 0.38, yf: 0.80 },
    { xf: 0.48, yf: 0.88 },
    { xf: 0.57, yf: 0.38 }, // peak 2 — node 1 (Build)
    { xf: 0.66, yf: 0.58 },
    { xf: 0.74, yf: 0.68 },
    { xf: 0.86, yf: 0.12 }, // peak 3 — node 2 (Deliver)
    { xf: 0.93, yf: 0.16 },
    { xf: 1.00, yf: 0.06 },
  ];

  // nodes sit exactly at the peaks
  const nodes = [
    { xf: 0.28, yf: 0.58, step: 0 },
    { xf: 0.57, yf: 0.38, step: 1 },
    { xf: 0.86, yf: 0.12, step: 2 },
  ];

  let activeStep = 0;
  let lastStep   = performance.now();
  const STEP_MS  = 3000;
  // pulse animation per node
  const pulseR   = nodes.map(() => 0);
  const pulseA   = nodes.map(() => 0);

  function activate(i) {
    activeStep = i;
    for (let s = 0; s < 3; s++) {
      const el = document.getElementById('ekgstep-' + s);
      if (el) el.classList.toggle('active', s === i);
    }
    const desc = document.getElementById('ekgDesc');
    if (desc) {
      desc.style.opacity = '0';
      setTimeout(() => { desc.textContent = descs[i]; desc.style.opacity = '1'; }, 200);
    }
    // trigger pulse on active node
    pulseR[i] = 0;
    pulseA[i] = 1;
  }

  function draw() {
    const now = performance.now();
    if (now - lastStep >= STEP_MS) {
      activeStep = (activeStep + 1) % 3;
      activate(activeStep);
      lastStep = now;
    }

    ctx.clearRect(0, 0, W, H);

    const pts = nodes.map(n => ({ x: n.xf * W, y: n.yf * H, step: n.step }));
    const lpts = linePoints.map(p => ({ x: p.xf * W, y: p.yf * H }));

    // sharp angular line — straight segments like a stock chart
    ctx.beginPath();
    ctx.moveTo(lpts[0].x, lpts[0].y);
    for (let i = 1; i < lpts.length; i++) {
      ctx.lineTo(lpts[i].x, lpts[i].y);
    }
    ctx.strokeStyle = '#378ADD';
    ctx.lineWidth   = 3;
    ctx.lineJoin    = 'round';
    ctx.shadowColor = 'rgba(55,138,221,0.6)';
    ctx.shadowBlur  = 10;
    ctx.stroke();
    ctx.shadowBlur  = 0;

    // arrow tip at the end
    const last  = lpts[lpts.length - 1];
    const prev  = lpts[lpts.length - 2];
    const angle = Math.atan2(last.y - prev.y, last.x - prev.x);
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(last.x - 11 * Math.cos(angle - 0.4), last.y - 11 * Math.sin(angle - 0.4));
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(last.x - 11 * Math.cos(angle + 0.4), last.y - 11 * Math.sin(angle + 0.4));
    ctx.strokeStyle = '#378ADD'; ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(55,138,221,0.6)'; ctx.shadowBlur = 8;
    ctx.stroke(); ctx.shadowBlur = 0;

    // draw nodes
    pts.forEach((p, i) => {
      const isActive = i === activeStep;

      // animate pulse ring
      if (pulseA[i] > 0) {
        const pColor = i === 2 ? '255,216,77' : '55,138,221';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7 + pulseR[i], 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${pColor},${pulseA[i] * 0.6})`;
        ctx.lineWidth   = 1.5; ctx.stroke();
        pulseR[i] += 0.5;
        pulseA[i] -= 0.018;
        if (pulseA[i] < 0) { pulseA[i] = 0; pulseR[i] = 0; }
      }

      // outer ring for active
      if (isActive) {
        const rColor = i === 2 ? 'rgba(255,216,77,0.35)' : 'rgba(55,138,221,0.35)';
        ctx.beginPath(); ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
        ctx.strokeStyle = rColor;
        ctx.lineWidth = 1; ctx.stroke();
      }

      // filled circle
      ctx.beginPath(); ctx.arc(p.x, p.y, isActive ? 6 : 5, 0, Math.PI * 2);
      const isDeliver = i === 2;
      const nodeColor = isDeliver ? '#FFD84D' : '#378ADD';
      const glowColor = isDeliver ? 'rgba(255,216,77,0.8)' : 'rgba(55,138,221,1)';
      ctx.fillStyle   = isActive ? '#fff' : 'rgba(55,138,221,0.0)';
      ctx.strokeStyle = isActive ? nodeColor : (isDeliver ? 'rgba(255,216,77,0.7)' : 'rgba(133,183,235,0.7)');
      ctx.lineWidth   = isActive ? 2.5 : 1.5;
      if (isActive) { ctx.shadowColor = glowColor; ctx.shadowBlur = 18; }
      ctx.fill(); ctx.stroke();
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(draw);
  }

  activate(0);
  draw();
})();
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    e.target.style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
  }, 1200);
}

