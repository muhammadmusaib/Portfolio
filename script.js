/* ── CUSTOM CURSOR ── */
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animateCursor() {
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a, button, .why-card, .project-card, .cert-card, .tool-chip').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('expanded'); cursorRing.classList.add('expanded'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('expanded'); cursorRing.classList.remove('expanded'); });
});

/* ── SCROLL PROGRESS ── */
const scrollBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  scrollBar.style.width = pct + '%';
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
});

/* ── PARTICLES ── */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize(); window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W; this.y = Math.random() * H;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.35;
    this.speedY = (Math.random() - 0.5) * 0.35;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.6 ? '#00D4FF' : Math.random() > 0.5 ? '#7C6BFF' : '#00E5A0';
  }
  update() {
    this.x += this.speedX; this.y += this.speedY;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
  }
}

for (let i = 0; i < 90; i++) particles.push(new Particle());

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  // Draw connecting lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = '#00D4FF';
        ctx.globalAlpha = (1 - dist / 120) * 0.08;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  particles.forEach(p => { p.update(); p.draw(); });
  ctx.globalAlpha = 1;
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ── FADE UP OBSERVER ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

/* ── SKILL BARS ── */
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
        bar.classList.add('animated');
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('#skills').forEach(s => skillObserver.observe(s));

/* ── COUNTER ANIMATION ── */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(el => {
        const target = +el.dataset.target;
        const suffix = el.dataset.suffix || '';
        let start = 0;
        const duration = 1800;
        const t0 = performance.now();
        const update = (now) => {
          const p = Math.min((now - t0) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * ease) + suffix;
          if (p < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stats-bar').forEach(el => counterObserver.observe(el));

/* ── ACTIVATE PLACEHOLDER LINKS ──
   To activate a link: find the element below and change href="#" to your real URL,
   then remove the class "placeholder" from that element.
   Example: change
     <a href="#" class="project-link-btn github placeholder">
   to
     <a href="https://github.com/muhammadmusaib/your-repo" class="project-link-btn github">
*/
