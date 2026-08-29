/**
 * TRiSTAR - DIAMOND & LIQUID CHROME VISUAL ENGINE
 * Custom Canvas & Particle System for 3D Diamond Refractions, Chrome Lens Flares, and Sparkle Trails
 */

(function() {
  'use strict';

  // Initialize Canvas
  const canvas = document.getElementById('diamond-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  let mouseX = width / 2;
  let mouseY = height / 2;
  let targetMouseX = mouseX;
  let targetMouseY = mouseY;

  // Resize handler
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Track mouse
  window.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
    spawnSparkleTrail(e.clientX, e.clientY);
  });

  // Diamond Particle System
  const diamonds = [];
  const sparkleTrails = [];
  const diamondCount = Math.min(Math.floor(window.innerWidth / 22), 60);

  class DiamondShard {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 30;
      this.size = Math.random() * 8 + 4;
      this.speedY = Math.random() * 0.4 + 0.15;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.rot = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.pulseSpeed = Math.random() * 0.03 + 0.01;
      this.pulse = Math.random() * Math.PI;
      this.hue = Math.random() > 0.6 ? 195 : (Math.random() > 0.8 ? 45 : 210); // Cyan, Gold or Icy Blue
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX + (mouseX - width / 2) * 0.0003;
      this.rot += this.rotSpeed;
      this.pulse += this.pulseSpeed;

      if (this.y < -30 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);

      const currentOpacity = this.opacity * (0.6 + Math.sin(this.pulse) * 0.4);
      ctx.globalAlpha = currentOpacity;

      // Draw Diamond Polygon (Facet)
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.lineTo(this.size * 0.7, 0);
      ctx.lineTo(0, this.size);
      ctx.lineTo(-this.size * 0.7, 0);
      ctx.closePath();

      // Prismatic diamond gradient
      const grad = ctx.createLinearGradient(-this.size, -this.size, this.size, this.size);
      grad.addColorStop(0, `hsla(${this.hue}, 90%, 90%, 0.9)`);
      grad.addColorStop(0.5, `hsla(${this.hue}, 100%, 75%, 0.6)`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');

      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 0.75;
      ctx.stroke();

      // Diamond Inner Facet Line
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.lineTo(0, this.size);
      ctx.moveTo(-this.size * 0.7, 0);
      ctx.lineTo(this.size * 0.7, 0);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Sparkle Cross Flare on peak pulse
      if (Math.sin(this.pulse) > 0.7) {
        const flareSize = this.size * 2.2;
        ctx.beginPath();
        ctx.moveTo(-flareSize, 0);
        ctx.lineTo(flareSize, 0);
        ctx.moveTo(0, -flareSize);
        ctx.lineTo(0, flareSize);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, 85%, 0.7)`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  // Sparkle trail for cursor
  function spawnSparkleTrail(x, y) {
    if (sparkleTrails.length > 25) return;
    sparkleTrails.push({
      x: x + (Math.random() - 0.5) * 12,
      y: y + (Math.random() - 0.5) * 12,
      size: Math.random() * 5 + 3,
      life: 1.0,
      decay: Math.random() * 0.04 + 0.02,
      rot: Math.random() * Math.PI,
      hue: Math.random() > 0.5 ? 190 : 215
    });
  }

  // Populate diamonds
  for (let i = 0; i < diamondCount; i++) {
    diamonds.push(new DiamondShard());
  }

  // Render loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Smooth mouse lerp
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Draw ambient volumetric ambient light spots
    const radGrad = ctx.createRadialGradient(mouseX, mouseY, 10, mouseX, mouseY, 450);
    radGrad.addColorStop(0, 'rgba(56, 189, 248, 0.04)');
    radGrad.addColorStop(0.6, 'rgba(147, 51, 234, 0.015)');
    radGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, width, height);

    // Update & draw diamonds
    diamonds.forEach(d => {
      d.update();
      d.draw();
    });

    // Update & draw sparkle trail
    for (let i = sparkleTrails.length - 1; i >= 0; i--) {
      const s = sparkleTrails[i];
      s.life -= s.decay;
      if (s.life <= 0) {
        sparkleTrails.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rot);
      ctx.globalAlpha = s.life;

      // 4-point star sparkle
      const len = s.size * s.life;
      ctx.beginPath();
      ctx.moveTo(-len, 0);
      ctx.lineTo(len, 0);
      ctx.moveTo(0, -len);
      ctx.lineTo(0, len);
      ctx.strokeStyle = `hsla(${s.hue}, 100%, 85%, ${s.life})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Center bright core
      ctx.beginPath();
      ctx.arc(0, 0, s.size * 0.3 * s.life, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  animate();

  // 3D Tilt Effect on Cards
  const tiltElements = document.querySelectorAll('[data-tilt]');
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // Intro Dismissal & Sound
  window.dismissIntro = function() {
    const intro = document.getElementById('intro-overlay');
    if (intro) {
      // Trigger burst effect
      for (let i = 0; i < 35; i++) {
        spawnSparkleTrail(window.innerWidth / 2 + (Math.random() - 0.5) * 200, window.innerHeight / 2 + (Math.random() - 0.5) * 200);
      }
      intro.classList.add('dismissed');
      setTimeout(() => {
        intro.remove();
      }, 1000);
    }
  };

})();
