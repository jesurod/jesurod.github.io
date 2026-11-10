/**
 * Loss landscape background: relief-shaded potential field, topographic
 * contours, labeled critical points and particles running gradient descent.
 * A deterministic optimizer descends from the ridge to the global minimum as
 * the page scrolls, and the header readout reports its state.
 *
 * Everything that never changes is painted once into an offscreen layer, so
 * each animation frame only blits that layer and draws the particles.
 */

(function () {
  const canvas = document.getElementById('loss-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const staticLayer = document.createElement('canvas');
  const staticCtx = staticLayer.getContext('2d');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const MAX_PARTICLES = coarsePointer ? 12 : 24;
  const MAX_DPR = 2;
  const LABEL_MIN_WIDTH = 768;
  const CONTOUR_CELL = 14;
  const RELIEF_SCALE = 6;
  // Chosen so that the whole descent stays in the left margin, clear of the content.
  const TRAJECTORY_START = { x: 0.07, y: 0.92 };
  const MAX_PARTICLE_SPEED = 2.6;
  const TRAJECTORY_MIN_PROGRESS = 0.04;

  let width = 0;
  let height = 0;
  let mouse = { x: null, y: null, active: false };
  let particles = [];
  let contourPaths = [];
  let scrollPaused = false;
  let trajectory = [];
  let progress = TRAJECTORY_MIN_PROGRESS;

  // Minima and critical points, in viewport-normalized coordinates.
  const criticalPoints = [
    { x: 0.06, y: 0.34, type: 'global_min', label: 'Mínimo Global θ*', radius: 0.34, depth: 2.2, labelBelow: true },
    { x: 0.80, y: 0.26, type: 'local_min_1', label: 'Mínimo Local θ₁', radius: 0.24, depth: 1.6 },
    { x: 0.48, y: 0.65, type: 'saddle', label: 'Punto de Silla (Saddle)', radius: 0.26, depth: -1.2 },
    { x: 0.82, y: 0.78, type: 'local_min_2', label: 'Mínimo Local θ₂', radius: 0.22, depth: 1.4 },
    { x: 0.07, y: 0.9, type: 'ridge', label: 'Cresta de Pérdida', radius: 0.3, depth: -1.5, labelBelow: true },
  ];

  function resize() {
    // Measured from CSS so that mobile URL bar show/hide does not trigger a repaint.
    const nextWidth = canvas.clientWidth;
    const nextHeight = canvas.clientHeight;
    if (nextWidth === width && nextHeight === height) return;

    width = nextWidth;
    height = nextHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    [canvas, staticLayer].forEach((target) => {
      target.width = width * dpr;
      target.height = height * dpr;
    });
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    staticCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    generateContours();
    paintStaticLayer();
    renderStill();
  }

  // Multi-modal loss function f(nx, ny)
  function lossFunction(nx, ny) {
    let val = 0;
    for (const cp of criticalPoints) {
      const dx = nx - cp.x;
      const dy = ny - cp.y;
      const distSq = dx * dx + dy * dy;
      if (cp.depth > 0) {
        val -= cp.depth * Math.exp(-distSq * 18);
      } else {
        val += Math.abs(cp.depth) * Math.exp(-distSq * 14);
      }
    }
    const rx = (nx - 0.5) * 2;
    const ry = (ny - 0.5) * 2;
    val += 0.35 * (rx * rx + ry * ry);
    val += 0.15 * Math.sin(rx * 3.0 + ry * 2.2);
    return val;
  }

  // Numerical gradient (∂f/∂x, ∂f/∂y)
  function gradient(nx, ny) {
    const eps = 0.002;
    const fx1 = lossFunction(nx + eps, ny);
    const fx0 = lossFunction(nx - eps, ny);
    const fy1 = lossFunction(nx, ny + eps);
    const fy0 = lossFunction(nx, ny - eps);
    return {
      gx: (fx1 - fx0) / (2 * eps),
      gy: (fy1 - fy0) / (2 * eps)
    };
  }

  function interpolate(iso, val1, val2, p1, p2) {
    if (Math.abs(val2 - val1) < 0.0001) return p1;
    const t = (iso - val1) / (val2 - val1);
    return p1 + t * (p2 - p1);
  }

  // Marching squares over a coarse grid of the loss function.
  function generateContours() {
    contourPaths = [];
    const cols = Math.floor(width / CONTOUR_CELL) + 1;
    const rows = Math.floor(height / CONTOUR_CELL) + 1;
    const grid = [];

    for (let i = 0; i <= rows; i++) {
      grid[i] = [];
      const ny = i / rows;
      for (let j = 0; j <= cols; j++) {
        grid[i][j] = lossFunction(j / cols, ny);
      }
    }

    const levels = Array.from({ length: 25 }, (_, k) => -1.9 + 0.15 * k);
    const dx = width / cols;
    const dy = height / rows;

    levels.forEach((iso, levelIdx) => {
      const segments = [];
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const vTL = grid[i][j];
          const vTR = grid[i][j + 1];
          const vBR = grid[i + 1][j + 1];
          const vBL = grid[i + 1][j];

          const code = (vTL > iso ? 1 : 0) | (vTR > iso ? 2 : 0) | (vBR > iso ? 4 : 0) | (vBL > iso ? 8 : 0);
          if (code === 0 || code === 15) continue;

          const x0 = j * dx;
          const y0 = i * dy;
          const top = { x: interpolate(iso, vTL, vTR, x0, x0 + dx), y: y0 };
          const right = { x: x0 + dx, y: interpolate(iso, vTR, vBR, y0, y0 + dy) };
          const bottom = { x: interpolate(iso, vBL, vBR, x0, x0 + dx), y: y0 + dy };
          const left = { x: x0, y: interpolate(iso, vTL, vBL, y0, y0 + dy) };

          switch (code) {
            case 1: case 14: segments.push([left, top]); break;
            case 2: case 13: segments.push([top, right]); break;
            case 3: case 12: segments.push([left, right]); break;
            case 4: case 11: segments.push([right, bottom]); break;
            case 5: segments.push([left, top]); segments.push([right, bottom]); break;
            case 6: case 9:  segments.push([top, bottom]); break;
            case 7: case 8:  segments.push([left, bottom]); break;
            case 10: segments.push([top, right]); segments.push([left, bottom]); break;
          }
        }
      }

      // Every fourth level is an index contour, as on a topographic map.
      const isIndex = levelIdx % 4 === 0;
      const alpha = isIndex ? 0.3 : 0.11;
      let rgb = '245, 158, 11';
      if (iso < -0.8) {
        rgb = '56, 189, 248';
      } else if (iso < -0.2) {
        rgb = '16, 185, 129';
      } else if (iso < 0.3) {
        rgb = '148, 163, 184';
      }
      const strokeColor = `rgba(${rgb}, ${alpha})`;

      contourPaths.push({ iso, isIndex, rgb, segments, strokeColor });
    });
  }

  function paintHeatmap(target) {
    target.fillStyle = '#070a0f';
    target.fillRect(0, 0, width, height);

    target.save();
    target.globalCompositeOperation = 'screen';

    criticalPoints.forEach((cp) => {
      const cx = cp.x * width;
      const cy = cp.y * height;
      const r = cp.radius * Math.max(width, height);
      const grad = target.createRadialGradient(cx, cy, 0, cx, cy, r);

      if (cp.type === 'global_min') {
        grad.addColorStop(0, 'rgba(14, 165, 233, 0.28)');
        grad.addColorStop(0.35, 'rgba(2, 132, 199, 0.16)');
        grad.addColorStop(0.70, 'rgba(3, 105, 161, 0.06)');
        grad.addColorStop(1, 'rgba(7, 10, 15, 0)');
      } else if (cp.type === 'local_min_1') {
        grad.addColorStop(0, 'rgba(16, 185, 129, 0.24)');
        grad.addColorStop(0.40, 'rgba(13, 148, 136, 0.12)');
        grad.addColorStop(0.75, 'rgba(15, 118, 110, 0.04)');
        grad.addColorStop(1, 'rgba(7, 10, 15, 0)');
      } else if (cp.type === 'local_min_2') {
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
        grad.addColorStop(0.45, 'rgba(30, 64, 175, 0.10)');
        grad.addColorStop(1, 'rgba(7, 10, 15, 0)');
      } else if (cp.type === 'saddle') {
        grad.addColorStop(0, 'rgba(245, 158, 11, 0.25)');
        grad.addColorStop(0.35, 'rgba(225, 29, 72, 0.15)');
        grad.addColorStop(0.70, 'rgba(180, 83, 9, 0.05)');
        grad.addColorStop(1, 'rgba(7, 10, 15, 0)');
      } else if (cp.type === 'ridge') {
        grad.addColorStop(0, 'rgba(139, 92, 246, 0.18)');
        grad.addColorStop(0.45, 'rgba(99, 102, 241, 0.08)');
        grad.addColorStop(1, 'rgba(7, 10, 15, 0)');
      }

      target.fillStyle = grad;
      target.beginPath();
      target.arc(cx, cy, r, 0, Math.PI * 2);
      target.fill();
    });

    target.restore();
  }

  function paintGrid(target) {
    const gridStep = 80;
    target.strokeStyle = 'rgba(255, 255, 255, 0.018)';
    target.lineWidth = 1;
    target.beginPath();
    for (let x = 0; x < width; x += gridStep) {
      target.moveTo(x, 0);
      target.lineTo(x, height);
    }
    for (let y = 0; y < height; y += gridStep) {
      target.moveTo(0, y);
      target.lineTo(width, y);
    }
    target.stroke();
  }

  function paintContours(target) {
    contourPaths.forEach((path) => {
      target.beginPath();
      target.strokeStyle = path.strokeColor;
      target.lineWidth = path.isIndex ? 1 : 0.6;
      path.segments.forEach(([from, to]) => {
        target.moveTo(from.x, from.y);
        target.lineTo(to.x, to.y);
      });
      target.stroke();
    });

    if (width < LABEL_MIN_WIDTH) return;

    target.font = '9px "JetBrains Mono", monospace';
    contourPaths.forEach((path) => {
      if (!path.isIndex || path.segments.length === 0) return;
      const [anchor] = path.segments[Math.floor(path.segments.length * 0.37)];
      target.fillStyle = `rgba(${path.rgb}, 0.42)`;
      target.fillText(path.iso.toFixed(1).replace('-', '−'), anchor.x + 3, anchor.y - 2);
    });
  }

  // Hillshade: the slope of the loss surface lit from the top-left, computed
  // at low resolution and scaled up, since the relief varies smoothly.
  function paintRelief(target) {
    const columns = Math.ceil(width / RELIEF_SCALE);
    const rows = Math.ceil(height / RELIEF_SCALE);
    const relief = new ImageData(columns, rows);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const { gx, gy } = gradient(col / columns, row / rows);
        const shade = Math.max(-1, Math.min(1, (0.6 * gx + 0.7 * gy) * 0.16));
        const offset = (row * columns + col) * 4;
        const lit = shade > 0;

        relief.data[offset] = lit ? 190 : 0;
        relief.data[offset + 1] = lit ? 225 : 0;
        relief.data[offset + 2] = lit ? 255 : 0;
        relief.data[offset + 3] = Math.abs(shade) * (lit ? 34 : 120);
      }
    }

    const buffer = document.createElement('canvas');
    buffer.width = columns;
    buffer.height = rows;
    buffer.getContext('2d').putImageData(relief, 0, 0);

    target.imageSmoothingQuality = 'high';
    target.drawImage(buffer, 0, 0, width, height);
  }

  function paintCriticalPoints(target) {
    target.font = '10px "JetBrains Mono", monospace';

    criticalPoints.forEach((cp) => {
      const cx = (cp.marker || cp).x * width;
      const cy = (cp.marker || cp).y * height;
      const isMinimum = cp.depth > 0;

      target.beginPath();
      target.arc(cx, cy, 6, 0, Math.PI * 2);
      target.strokeStyle = isMinimum ? 'rgba(56, 189, 248, 0.4)' : 'rgba(245, 158, 11, 0.4)';
      target.lineWidth = 1;
      target.stroke();

      target.beginPath();
      target.arc(cx, cy, 2, 0, Math.PI * 2);
      target.fillStyle = isMinimum ? 'rgba(56, 189, 248, 0.8)' : 'rgba(245, 158, 11, 0.8)';
      target.fill();

      // On narrow screens the text column spans the viewport and labels would cross it.
      if (width < LABEL_MIN_WIDTH) return;

      // Plain map annotations, so that page text can pass over them.
      const textWidth = target.measureText(cp.label).width;
      const besideX = cx + 12 + textWidth > width ? cx - 12 - textWidth : cx + 12;
      const textX = cp.labelBelow ? Math.max(6, cx - textWidth / 2) : besideX;
      const textY = cp.labelBelow ? cy + 20 : cy + 3.5;
      target.fillStyle = isMinimum ? 'rgba(186, 230, 253, 0.5)' : 'rgba(254, 215, 170, 0.5)';
      target.fillText(cp.label, textX, textY);
    });
  }

  function paintStaticLayer() {
    paintHeatmap(staticCtx);
    paintRelief(staticCtx);
    paintGrid(staticCtx);
    paintContours(staticCtx);
    paintCriticalPoints(staticCtx);
  }

  function drawStaticLayer() {
    ctx.drawImage(staticLayer, 0, 0, width, height);
  }

  // Deterministic momentum descent in normalized coordinates, so the path is
  // the same on every screen.
  function buildTrajectory() {
    const lr = 0.0009;
    const momentum = 0.82;
    const points = [];
    let { x, y } = TRAJECTORY_START;
    let vx = 0;
    let vy = 0;
    let distance = 0;

    for (let step = 0; step < 600; step++) {
      points.push({ x, y, distance, loss: lossFunction(x, y) });

      const { gx, gy } = gradient(x, y);
      vx = momentum * vx - lr * gx;
      vy = momentum * vy - lr * gy;
      x += vx;
      y += vy;

      const speed = Math.hypot(vx, vy);
      distance += speed;
      if (speed < 2e-4 && step > 50) break;
    }

    // The quadratic bowl shifts the true minimum away from the well's centre.
    criticalPoints[0].marker = points[points.length - 1];

    return points;
  }

  function trajectoryHead() {
    const total = trajectory[trajectory.length - 1].distance;
    const target = progress * total;
    let index = 1;
    while (index < trajectory.length - 1 && trajectory[index].distance < target) index++;

    const from = trajectory[index - 1];
    const to = trajectory[index];
    const span = to.distance - from.distance || 1;
    const t = Math.max(0, Math.min(1, (target - from.distance) / span));

    return {
      index,
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
      loss: from.loss + (to.loss - from.loss) * t
    };
  }

  function drawTrajectory() {
    const head = trajectoryHead();
    const px = (point) => point.x * width;
    const py = (point) => point.y * height;

    ctx.save();
    ctx.beginPath();
    trajectory.forEach((point, i) => {
      if (i === 0) ctx.moveTo(px(point), py(point));
      else ctx.lineTo(px(point), py(point));
    });
    ctx.setLineDash([2, 6]);
    ctx.strokeStyle = 'rgba(241, 245, 249, 0.22)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    const start = trajectory[0];
    const end = trajectory[trajectory.length - 1];
    const stroke = ctx.createLinearGradient(px(start), py(start), px(end), py(end));
    stroke.addColorStop(0, 'rgba(245, 158, 11, 0.9)');
    stroke.addColorStop(1, 'rgba(56, 189, 248, 0.95)');

    ctx.beginPath();
    ctx.moveTo(px(start), py(start));
    for (let i = 1; i < head.index; i++) ctx.lineTo(px(trajectory[i]), py(trajectory[i]));
    ctx.lineTo(px(head), py(head));
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.75;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(px(head), py(head), 9, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(px(head), py(head), 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    updateReadout(head);
  }

  const readout = {
    curve: document.getElementById('hud-curve'),
    dot: document.getElementById('hud-dot'),
    iter: document.getElementById('hud-iter'),
    loss: document.getElementById('hud-loss')
  };
  let readoutIndex = -1;

  function curveCoordinates(point, index) {
    const losses = trajectory.map((p) => p.loss);
    const max = Math.max(...losses);
    const min = Math.min(...losses);
    return [
      (2 + 76 * index / (trajectory.length - 1)).toFixed(1),
      (2 + 16 * (max - point.loss) / (max - min)).toFixed(1)
    ];
  }

  function updateReadout(head) {
    if (!readout.curve || head.index === readoutIndex) return;

    if (readoutIndex === -1) {
      const path = trajectory.map((point, i) => `${i === 0 ? 'M' : 'L'}${curveCoordinates(point, i).join(' ')}`).join('');
      readout.curve.setAttribute('d', path);
    }
    readoutIndex = head.index;

    const [cx, cy] = curveCoordinates(trajectory[head.index], head.index);
    readout.dot.setAttribute('cx', cx);
    readout.dot.setAttribute('cy', cy);
    readout.iter.textContent = String(head.index).padStart(3, '0');
    readout.loss.textContent = `${head.loss >= 0 ? '+' : '−'}${Math.abs(head.loss).toFixed(3)}`;
  }

  function scrollTarget() {
    const range = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
    return TRAJECTORY_MIN_PROGRESS + (1 - TRAJECTORY_MIN_PROGRESS) * ratio;
  }

  function renderStill() {
    drawStaticLayer();
    drawTrajectory();
  }

  class GradientParticle {
    constructor(startX, startY) {
      this.reset(startX, startY);
    }

    reset(startX, startY) {
      this.x = startX !== undefined ? startX : Math.random() * width;
      this.y = startY !== undefined ? startY : Math.random() * height;
      this.vx = 0;
      this.vy = 0;
      this.history = [];
      this.maxHistory = 26;
      this.lr = 0.00045 + Math.random() * 0.0003;
      this.momentum = 0.90;
      this.age = 0;
      this.maxAge = 180 + Math.floor(Math.random() * 120);
      this.converged = false;
    }

    update() {
      this.age++;
      if (this.age > this.maxAge) {
        if (mouse.active && Math.random() < 0.6) {
          const spread = 70;
          this.reset(mouse.x + (Math.random() - 0.5) * spread, mouse.y + (Math.random() - 0.5) * spread);
        } else {
          this.reset();
        }
        return;
      }

      this.history.push({ x: this.x, y: this.y });
      if (this.history.length > this.maxHistory) {
        this.history.shift();
      }

      const nx = this.x / width;
      const ny = this.y / height;

      if (nx < 0 || nx > 1 || ny < 0 || ny > 1) {
        this.age = this.maxAge;
        return;
      }

      const grad = gradient(nx, ny);

      this.vx = this.momentum * this.vx - this.lr * (grad.gx * width);
      this.vy = this.momentum * this.vy - this.lr * (grad.gy * height);

      this.vx += (Math.random() - 0.5) * 0.12;
      this.vy += (Math.random() - 0.5) * 0.12;

      const particleSpeed = Math.hypot(this.vx, this.vy);
      if (particleSpeed > MAX_PARTICLE_SPEED) {
        this.vx *= MAX_PARTICLE_SPEED / particleSpeed;
        this.vy *= MAX_PARTICLE_SPEED / particleSpeed;
      }

      this.x += this.vx;
      this.y += this.vy;

      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed < 0.035 && this.age > 45) {
        this.converged = true;
      }
    }

    draw() {
      if (this.history.length < 2) return;

      ctx.beginPath();
      ctx.moveTo(this.history[0].x, this.history[0].y);
      for (let i = 1; i < this.history.length; i++) {
        ctx.lineTo(this.history[i].x, this.history[i].y);
      }
      ctx.lineTo(this.x, this.y);

      const lifeRatio = 1 - (this.age / this.maxAge);
      const rgb = this.converged ? '245, 158, 11' : '56, 189, 248';
      ctx.strokeStyle = `rgba(${rgb}, ${0.45 * lifeRatio})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, ${0.9 * lifeRatio})`;
      ctx.fill();
    }
  }

  function drawMouseGradient() {
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 14, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();

    const g = gradient(mouse.x / width, mouse.y / height);
    const vLen = Math.sqrt(g.gx * g.gx + g.gy * g.gy);
    if (vLen <= 0.001) return;

    const arrowLen = 30;
    const ax = mouse.x - (g.gx / vLen) * arrowLen;
    const ay = mouse.y - (g.gy / vLen) * arrowLen;

    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);
    ctx.lineTo(ax, ay);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(245, 158, 11, 0.85)';
    ctx.fillText('-∇L(θ)', ax + 5, ay + 3);
  }

  function tick() {
    requestAnimationFrame(tick);

    // An open drawer or modal blurs the canvas, so animating behind it is wasted work.
    if (document.body.classList.contains('overflow-hidden')) return;

    const target = scrollTarget();
    const moved = Math.abs(target - progress) > 1e-4;
    if (moved) progress += (target - progress) * (reducedMotion.matches ? 1 : 0.12);

    if (reducedMotion.matches || scrollPaused) {
      if (moved) renderStill();
      return;
    }

    drawStaticLayer();
    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });
    drawTrajectory();
    if (mouse.active && mouse.x !== null) drawMouseGradient();
  }

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120);
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;

    if (Math.random() < 0.25) {
      particles.push(new GradientParticle(mouse.x, mouse.y));
      if (particles.length > MAX_PARTICLES + 8) {
        particles.shift();
      }
    }
  });

  document.documentElement.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  if (coarsePointer) {
    let scrollTimer = null;
    window.addEventListener('scroll', () => {
      scrollPaused = true;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => { scrollPaused = false; }, 160);
    }, { passive: true });
  }

  trajectory = buildTrajectory();
  progress = scrollTarget();
  resize();
  for (let i = 0; i < MAX_PARTICLES; i++) {
    particles.push(new GradientParticle());
  }

  // The labels are drawn with a web font that may arrive after the first paint.
  document.fonts.ready.then(() => {
    paintStaticLayer();
    renderStill();
  });

  requestAnimationFrame(tick);
})();
