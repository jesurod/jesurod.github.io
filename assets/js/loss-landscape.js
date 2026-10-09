/**
 * Loss Landscape & Gradient Descent Interactive Visualizer
 * Aesthetic: Continuous Potential Field Heatmap + Visible Critical Point Markers & Names
 * Mathematical optimization manifold with labeled critical points (Global Min, Local Min, Saddle).
 */

(function () {
  const canvas = document.getElementById('loss-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let dpr = window.devicePixelRatio || 1;

  // Mouse interaction state
  let mouse = { x: null, y: null, active: false };
  let particles = [];
  const MAX_PARTICLES = 24;

  // Mathematical Minima & Critical Points with labels
  const criticalPoints = [
    { x: 0.22, y: 0.32, type: 'global_min', label: 'Mínimo Global θ*', radius: 0.28, depth: 2.2 },
    { x: 0.80, y: 0.26, type: 'local_min_1', label: 'Mínimo Local θ₁', radius: 0.24, depth: 1.6 },
    { x: 0.48, y: 0.65, type: 'saddle', label: 'Punto de Silla (Saddle)', radius: 0.26, depth: -1.2 },
    { x: 0.82, y: 0.78, type: 'local_min_2', label: 'Mínimo Local θ₂', radius: 0.22, depth: 1.4 },
    { x: 0.15, y: 0.82, type: 'ridge', label: 'Cresta de Pérdida', radius: 0.28, depth: -1.5 },
  ];

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
    generateContours();
  }

  // Multi-modal mathematical loss function: f(nx, ny)
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

  // Numerical gradient computation: ∇f = (∂f/∂x, ∂f/∂y)
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

  let contourPaths = [];

  function generateContours() {
    contourPaths = [];
    const cols = Math.floor(width / 34) + 1;
    const rows = Math.floor(height / 34) + 1;
    const grid = [];

    for (let i = 0; i <= rows; i++) {
      grid[i] = [];
      const ny = i / rows;
      for (let j = 0; j <= cols; j++) {
        const nx = j / cols;
        grid[i][j] = lossFunction(nx, ny);
      }
    }

    const levels = [-1.6, -1.3, -1.0, -0.7, -0.4, -0.15, 0.1, 0.35, 0.65, 0.95];
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

          const x0 = j * dx;
          const y0 = i * dy;

          const corners = [vTL > iso, vTR > iso, vBR > iso, vBL > iso];
          const code = (corners[0] ? 1 : 0) | (corners[1] ? 2 : 0) | (corners[2] ? 4 : 0) | (corners[3] ? 8 : 0);

          if (code === 0 || code === 15) continue;

          function interp(val1, val2, p1, p2) {
            if (Math.abs(val2 - val1) < 0.0001) return p1;
            const t = (iso - val1) / (val2 - val1);
            return p1 + t * (p2 - p1);
          }

          const top = { x: interp(vTL, vTR, x0, x0 + dx), y: y0 };
          const right = { x: x0 + dx, y: interp(vTR, vBR, y0, y0 + dy) };
          const bottom = { x: interp(vBL, vBR, x0, x0 + dx), y: y0 + dy };
          const left = { x: x0, y: interp(vTL, vBL, y0, y0 + dy) };

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

      let strokeColor;
      if (iso < -0.8) {
        strokeColor = 'rgba(56, 189, 248, 0.16)';
      } else if (iso < -0.2) {
        strokeColor = 'rgba(16, 185, 129, 0.13)';
      } else if (iso < 0.3) {
        strokeColor = 'rgba(148, 163, 184, 0.10)';
      } else {
        strokeColor = 'rgba(245, 158, 11, 0.14)';
      }

      contourPaths.push({ level: iso, index: levelIdx, segments, strokeColor });
    });
  }

  function drawGradientHeatmap() {
    ctx.fillStyle = '#070a0f';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    criticalPoints.forEach(cp => {
      const cx = cp.x * width;
      const cy = cp.y * height;
      const r = cp.radius * Math.max(width, height);

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);

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

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  // Draw critical point markers & labels (Preserved as requested)
  function drawCriticalPointAnnotations() {
    criticalPoints.forEach(cp => {
      const cx = cp.x * width;
      const cy = cp.y * height;

      // Halo ring
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.strokeStyle = cp.depth > 0 ? 'rgba(56, 189, 248, 0.45)' : 'rgba(245, 158, 11, 0.45)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = cp.depth > 0 ? 'rgba(56, 189, 248, 0.9)' : 'rgba(245, 158, 11, 0.9)';
      ctx.fill();

      // Label background pill
      const text = cp.label;
      ctx.font = '10px "JetBrains Mono", monospace';
      const textWidth = ctx.measureText(text).width;

      ctx.fillStyle = 'rgba(7, 10, 15, 0.65)';
      ctx.fillRect(cx + 10, cy - 8, textWidth + 8, 16);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.strokeRect(cx + 10, cy - 8, textWidth + 8, 16);

      // Label text
      ctx.fillStyle = cp.depth > 0 ? 'rgba(186, 230, 253, 0.85)' : 'rgba(254, 215, 170, 0.85)';
      ctx.fillText(text, cx + 14, cy + 4);
    });
  }

  // Particle optimizer
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

      this.x += this.vx;
      this.y += this.vy;

      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed < 0.035 && this.age > 45) {
        this.converged = true;
      }
    }

    draw(ctx) {
      if (this.history.length < 2) return;

      ctx.beginPath();
      ctx.moveTo(this.history[0].x, this.history[0].y);
      for (let i = 1; i < this.history.length; i++) {
        ctx.lineTo(this.history[i].x, this.history[i].y);
      }
      ctx.lineTo(this.x, this.y);

      const lifeRatio = 1 - (this.age / this.maxAge);
      ctx.strokeStyle = this.converged
        ? `rgba(245, 158, 11, ${0.45 * lifeRatio})`
        : `rgba(56, 189, 248, ${0.45 * lifeRatio})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = this.converged
        ? `rgba(245, 158, 11, ${0.9 * lifeRatio})`
        : `rgba(56, 189, 248, ${0.9 * lifeRatio})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < MAX_PARTICLES; i++) {
      particles.push(new GradientParticle());
    }
  }

  let animationFrameId;
  let isTabVisible = true;

  function render() {
    if (!isTabVisible) return;

    // 1. Heatmap Potential Field
    drawGradientHeatmap();

    // 2. Subtle Coordinate Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.018)';
    ctx.lineWidth = 1;
    const gridStep = 80;
    for (let x = 0; x < width; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 3. Contour Curves
    contourPaths.forEach((cp) => {
      ctx.beginPath();
      ctx.strokeStyle = cp.strokeColor;
      ctx.lineWidth = cp.index % 2 === 0 ? 1 : 0.7;

      for (let s = 0; s < cp.segments.length; s++) {
        const seg = cp.segments[s];
        ctx.moveTo(seg[0].x, seg[0].y);
        ctx.lineTo(seg[1].x, seg[1].y);
      }
      ctx.stroke();
    });

    // 4. Critical Point Labels & Halos
    drawCriticalPointAnnotations();

    // 5. Particles (SGD Trails)
    particles.forEach((p) => {
      p.update();
      p.draw(ctx);
    });

    // 6. Mouse Gradient Vector
    if (mouse.active && mouse.x !== null) {
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 14, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.stroke();

      const nx = mouse.x / width;
      const ny = mouse.y / height;
      const g = gradient(nx, ny);
      const vLen = Math.sqrt(g.gx * g.gx + g.gy * g.gy);
      if (vLen > 0.001) {
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
    }

    animationFrameId = requestAnimationFrame(render);
  }

  window.addEventListener('resize', resize);

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

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  document.addEventListener('visibilitychange', () => {
    isTabVisible = !document.hidden;
    if (isTabVisible) {
      render();
    } else {
      cancelAnimationFrame(animationFrameId);
    }
  });

  resize();
  initParticles();
  render();
})();
