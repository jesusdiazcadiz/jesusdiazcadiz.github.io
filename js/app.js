/* Jesús Díaz Cádiz · CV web · comportamiento */
(function () {
  'use strict';

  const raiz = document.documentElement;
  const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Tema claro / oscuro ---- */
  const CLAVE_TEMA = 'jdc-tema';
  function aplicarTema(t) {
    if (t === 'claro') raiz.setAttribute('data-tema', 'claro');
    else raiz.removeAttribute('data-tema');
  }
  let temaGuardado = null;
  try { temaGuardado = localStorage.getItem(CLAVE_TEMA); } catch (e) {}
  if (temaGuardado) aplicarTema(temaGuardado);
  else if (window.matchMedia('(prefers-color-scheme: light)').matches) aplicarTema('claro');

  document.getElementById('tema').addEventListener('click', function () {
    const nuevo = raiz.hasAttribute('data-tema') ? 'oscuro' : 'claro';
    aplicarTema(nuevo);
    try { localStorage.setItem(CLAVE_TEMA, nuevo); } catch (e) {}
  });

  /* ---- Navegación: fondo al hacer scroll + enlace activo ---- */
  const nav = document.getElementById('nav');
  const enlaces = Array.from(document.querySelectorAll('.nav__links a'));
  const secciones = enlaces.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  function alScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    const y = window.scrollY + window.innerHeight * 0.35;
    let actual = null;
    for (const s of secciones) if (s.offsetTop <= y) actual = s;
    enlaces.forEach(a => a.classList.toggle('activo', actual && a.getAttribute('href') === '#' + actual.id));
  }
  window.addEventListener('scroll', alScroll, { passive: true });
  alScroll();

  /* ---- Menú móvil ---- */
  const burger = document.getElementById('burger');
  const links = document.getElementById('navlinks');
  burger.addEventListener('click', () => links.classList.toggle('abierto'));
  links.addEventListener('click', e => { if (e.target.tagName === 'A') links.classList.remove('abierto'); });

  /* ---- Aparición progresiva ---- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducir) {
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  /* ---- Máquina de escribir en el rol ---- */
  const frases = [
    'Manager IT',
    'Administrador de sistemas en red',
    'Infraestructura y soluciones',
    'IA aplicada al trabajo diario'
  ];
  const maquina = document.getElementById('maquina');
  if (maquina && !reducir) {
    let i = 0, pos = frases[0].length, borrando = false;
    function paso() {
      const f = frases[i];
      if (!borrando) {
        pos++;
        maquina.textContent = f.slice(0, pos);
        if (pos >= f.length) { borrando = true; return setTimeout(paso, 2200); }
        return setTimeout(paso, 55 + Math.random() * 40);
      }
      pos--;
      maquina.textContent = f.slice(0, pos);
      if (pos <= 0) { borrando = false; i = (i + 1) % frases.length; return setTimeout(paso, 350); }
      setTimeout(paso, 28);
    }
    setTimeout(() => { borrando = true; paso(); }, 2600);
  }

  /* ---- Terminal que teclea sola ---- */
  const term = document.getElementById('terminal');
  if (term) {
    const P = '<span class="p">jesus@sevilla</span><span class="o">:~$</span> ';
    const guion = [
      { cmd: 'whoami', out: ['<span class="c">Manager IT · Administrador de sistemas en red</span>'] },
      { cmd: 'uptime', out: ['<span class="o">14+ años en IT · 3 sedes · 11 servidores · 0 fines de semana sin copias</span>'] },
      { cmd: 'ls proyectos/', out: ['<span class="d">autocobro/</span>  <span class="d">replicacion_sql/</span>  <span class="d">vpn_wireguard/</span>', '<span class="d">ia_manuales/</span>  <span class="d">veeam/</span>  <span class="d">rendimiento_erp/</span>'] },
      { cmd: 'systemctl status infraestructura', out: ['<span class="ok">● active (running)</span> <span class="o">desde feb. 2022</span>'] },
      { cmd: 'cat contacto.txt', out: ['<span class="c">jesusdiazcadiz@gmail.com · Sevilla</span>'] }
    ];
    let html = '';
    function escribir(texto, cb) {
      let k = 0;
      (function tic() {
        k++;
        term.innerHTML = html + P + esc(texto.slice(0, k)) + '<span class="cur"></span>';
        if (k < texto.length) setTimeout(tic, reducir ? 0 : 45 + Math.random() * 50);
        else setTimeout(cb, reducir ? 0 : 350);
      })();
    }
    function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
    function ejecutar(n) {
      if (n >= guion.length) {
        term.innerHTML = html + P + '<span class="cur"></span>';
        return;
      }
      const g = guion[n];
      escribir(g.cmd, () => {
        html += P + esc(g.cmd) + '\n' + g.out.join('\n') + '\n';
        term.innerHTML = html + P + '<span class="cur"></span>';
        setTimeout(() => ejecutar(n + 1), reducir ? 0 : 500);
      });
    }
    setTimeout(() => ejecutar(0), reducir ? 0 : 1400);
  }

  /* ---- Red de nodos de fondo en la portada ---- */
  const lienzo = document.getElementById('red');
  if (lienzo && !reducir) {
    const ctx = lienzo.getContext('2d');
    let W, H, nodos = [], raf;
    const hero = lienzo.parentElement;

    function color() {
      return raiz.hasAttribute('data-tema') ? '5,150,105' : '52,211,153';
    }
    function redimensionar() {
      W = lienzo.width = hero.clientWidth;
      H = lienzo.height = hero.clientHeight;
      const n = Math.min(90, Math.floor((W * H) / 16000));
      nodos = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
        r: 1 + Math.random() * 1.5
      }));
    }
    let raton = { x: -9999, y: -9999 };
    hero.addEventListener('mousemove', e => {
      const b = lienzo.getBoundingClientRect();
      raton = { x: e.clientX - b.left, y: e.clientY - b.top };
    });
    hero.addEventListener('mouseleave', () => { raton = { x: -9999, y: -9999 }; });

    function dibujar() {
      ctx.clearRect(0, 0, W, H);
      const c = color();
      const D = 130;
      for (let i = 0; i < nodos.length; i++) {
        const a = nodos[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;
        for (let j = i + 1; j < nodos.length; j++) {
          const b = nodos[j];
          const dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
          if (d < D) {
            ctx.strokeStyle = 'rgba(' + c + ',' + (0.22 * (1 - d / D)) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const dr = Math.hypot(a.x - raton.x, a.y - raton.y);
        if (dr < 160) {
          ctx.strokeStyle = 'rgba(' + c + ',' + (0.35 * (1 - dr / 160)) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(raton.x, raton.y); ctx.stroke();
        }
        ctx.fillStyle = 'rgba(' + c + ',0.7)';
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(dibujar);
    }
    redimensionar();
    dibujar();
    window.addEventListener('resize', () => { cancelAnimationFrame(raf); redimensionar(); dibujar(); });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf); else dibujar();
    });
  }

  /* ---- Descargar CV (imprimir a PDF) ---- */
  document.getElementById('imprimir').addEventListener('click', function () {
    reveals.forEach(el => el.classList.add('visible'));
    setTimeout(() => window.print(), 50);
  });

  /* ---- Año del pie ---- */
  document.getElementById('anio').textContent = new Date().getFullYear();
})();
