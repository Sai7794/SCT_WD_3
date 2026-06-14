(function() {
  class ConfettiParticle {
    constructor(canvasWidth, canvasHeight) {
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * -canvasHeight - 20; // Start offscreen
      this.size = Math.random() * 8 + 6;
      this.color = this.getRandomColor();
      this.speedX = Math.random() * 4 - 2;
      this.speedY = Math.random() * 5 + 4;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 4 - 2;
      this.opacity = 1;
      this.decay = Math.random() * 0.005 + 0.002;
    }

    getRandomColor() {
      const colors = [
        '#FF5964', // Red-Orange
        '#35A7FF', // Bright Blue
        '#38618C', // Navy
        '#FFC857', // Golden Yellow
        '#00C9A7', // Emerald
        '#845EC2', // Purple
        '#FF96AD'  // Pink
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;
      this.opacity -= this.decay;
      
      // Add slight wind-like oscillation
      this.speedX += Math.sin(this.y / 30) * 0.05;

      return this.opacity > 0 && this.y < this.canvasHeight + 10;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      
      // Alternate between drawing rectangles and circles
      if (this.size % 2 === 0) {
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      ctx.restore();
    }
  }

  class ConfettiEffect {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.active = false;
      this.resizeCanvas = this.resizeCanvas.bind(this);
      
      window.addEventListener('resize', this.resizeCanvas);
      this.resizeCanvas();
    }

    resizeCanvas() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    start(durationMs = 4000) {
      if (!this.canvas) return;
      this.active = true;
      this.particles = [];
      
      // Initial burst
      this.spawnParticles(100);
      
      // Continuous trickle
      const interval = setInterval(() => {
        if (!this.active) {
          clearInterval(interval);
          return;
        }
        this.spawnParticles(5);
      }, 100);

      // Stop spawning after duration
      setTimeout(() => {
        clearInterval(interval);
        setTimeout(() => {
          this.stop();
        }, 2000); // Allow remaining particles to fall off
      }, durationMs);

      this.animate();
    }

    spawnParticles(count) {
      for (let i = 0; i < count; i++) {
        this.particles.push(new ConfettiParticle(this.canvas.width, this.canvas.height));
      }
    }

    stop() {
      this.active = false;
      if (this.ctx && this.canvas) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      this.particles = [];
    }

    animate() {
      if (!this.active) return;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.particles = this.particles.filter(particle => {
        const keep = particle.update();
        if (keep) {
          particle.draw(this.ctx);
        }
        return keep;
      });

      if (this.particles.length > 0 || this.active) {
        requestAnimationFrame(() => this.animate());
      }
    }
  }

  window.ConfettiEffect = ConfettiEffect;
})();
