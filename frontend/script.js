// ===== CUSTOM CURSOR =====
document.addEventListener('mousemove', (e) => {
  document.body.style.setProperty('--cx', e.clientX + 'px');
  document.body.style.setProperty('--cy', e.clientY + 'px');
});

// ===== THEME TOGGLE =====
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');

// Load saved preference or default to dark
const savedTheme = localStorage.getItem('km-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateToggleUI(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('km-theme', next);
  updateToggleUI(next);
  // Restart particles with correct visibility
  updateParticleVisibility(next);
});

function updateToggleUI(theme) {
  if (theme === 'dark') {
    themeIcon.textContent = '☀️';
    themeLabel.textContent = 'Light';
  } else {
    themeIcon.textContent = '🌙';
    themeLabel.textContent = 'Dark';
  }
}

function updateParticleVisibility(theme) {
  const canvas = document.getElementById('particleCanvas');
  const bgCanvas = document.querySelector('.bg-canvas');
  if (theme === 'light') {
    bgCanvas.style.opacity = '0';
  } else {
    bgCanvas.style.opacity = '1';
  }
}

// Apply on load
updateParticleVisibility(savedTheme);

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== ROTATING HERO TEXT =====
const titles = [
  'AI/ML Engineer',
  'Full Stack Dev',
  'Gen AI Builder',
  'Problem Solver',
  'DSA Enthusiast'
];
let titleIndex = 0;
const rotatingEl = document.getElementById('rotatingText');

function rotateTitle() {
  if (!rotatingEl) return;
  rotatingEl.style.opacity = '0';
  setTimeout(() => {
    titleIndex = (titleIndex + 1) % titles.length;
    rotatingEl.textContent = titles[titleIndex];
    rotatingEl.style.opacity = '1';
  }, 300);
}
setInterval(rotateTitle, 2800);

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.4 + 0.1;
    this.color = Math.random() > 0.6 ? '#00f5c4' : Math.random() > 0.5 ? '#7b5ea7' : '#f0a500';
    this.life = 0;
    this.maxLife = Math.random() * 300 + 200;
    this.currentOpacity = 0;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life++;
    if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    const progress = this.life / this.maxLife;
    this.currentOpacity = this.opacity * Math.sin(progress * Math.PI);
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.currentOpacity;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 6;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 120; i++) {
  const p = new Particle();
  p.life = Math.random() * p.maxLife;
  particles.push(p);
}

function drawConnections() {
  const maxDist = 100;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / maxDist) * 0.08;
        ctx.strokeStyle = '#00f5c4';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animate);
}
animate();

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll(
  '.skill-category, .project-card, .edu-card, .vision-block, .contact-card, .section-header'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => observer.observe(el));

// Stagger delays
document.querySelectorAll('.project-card').forEach((card, i) => { card.dataset.delay = i * 120; });
document.querySelectorAll('.skill-category').forEach((el, i) => { el.dataset.delay = i * 100; });

// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) link.style.color = 'var(--accent)';
  });
});

// ===== 3D CARD TILT =====
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ===== CGPA BAR ANIMATION TRIGGER =====
const cgpaBar = document.querySelector('.cgpa-bar');
if (cgpaBar) {
  const barObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      cgpaBar.style.animation = 'barGrow 1.4s ease 0.2s both';
      barObserver.disconnect();
    }
  }, { threshold: 0.5 });
  barObserver.observe(cgpaBar);
}