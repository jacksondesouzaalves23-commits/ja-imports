/* ==========================================================================
   JA imports — camada de movimento
   Rolagem suave (Lenis), 3D e animações ligadas ao scroll (GSAP + ScrollTrigger),
   cursor e inclinação 3D das fotos. Sem as bibliotecas, o site continua
   funcionando e a vitrine 3D corre sozinha.
   ========================================================================== */
(() => {
  const html = document.documentElement;
  const C = window.JA;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fino = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const brl = (v) => "R$ " + Number(v).toLocaleString("pt-BR");

  /* ==========================================================================
     VITRINE 3D — fotos correndo numa curva, com a câmera por dentro do cilindro
     (as das pontas ficam grandes e anguladas, as do centro ao fundo)
     ========================================================================== */
  const g3d = $(".g3d");
  const G = g3d && C ? (() => {
    const roda = $(".g3d__roda", g3d), cena = $(".g3d__cena", g3d);
    const col = (p) => C.colecoes[p.colecao];
    const conj = C.produtos.find((p) => p.fotosPorCor);
    const ov = C.produtos.filter((p) => p.colecao === "oversize" && p.foto);
    const so = C.produtos.filter((p) => p.colecao === "soft");
    const prod = [];
    while (ov.length || so.length) { if (ov.length) prod.push(ov.shift()); if (so.length) prod.push(so.shift()); }
    const item = (p) => ({ href: `${col(p).pagina}#${p.id}`, src: `${p.foto}-${p.larguras[0]}.webp`, w: p.w, h: p.h, alt: p.alt, nome: p.nome, info: `${col(p).nome} · ${brl(p.preco ?? col(p).preco)}` });
    const look = (cor) => ({ href: `${col(conj).pagina}#${conj.id}`, src: `${conj.fotosPorCor[cor]}-${conj.larguras[0]}.webp`, w: conj.w, h: conj.h, alt: conj.alt, nome: conj.nome, info: `Oversize · ${brl(conj.preco ?? col(conj).preco)} · ${cor}` });
    const lista = prod.map(item);
    if (conj) { lista.splice(0, 0, look("Vermelho")); lista.splice(7, 0, look("Branco")); lista.splice(15, 0, look("Verde")); }

    const RZ = [-6, 4, -2.5, 7, -4.5, 2, -7, 5, -1.5, 3.5, -5, 6];
    const DY = [-5, 8, -10, 3, 10, -4, 6, -9, 1, 7, -7, 4];
    const SC = [1, 0.9, 1.08, 0.94, 1.04, 0.88, 1.1, 0.96];
    roda.innerHTML = lista.map((it, i) => {
      const retrato = it.h > it.w;
      return `<a class="g3d__item" href="${it.href}" style="--k:${retrato ? 0.74 : 1}" data-i="${i}">
        <span class="tilt" style="--ar:${it.w}/${it.h}"><img src="${it.src}" width="${it.w}" height="${it.h}" alt="${it.alt.replace(/"/g, "&quot;")}" loading="lazy" decoding="async"></span>
      </a>`;
    }).join("");
    const itens = $$(".g3d__item", roda);
    const nEl = $(".g3d__n", g3d), nomeEl = $(".g3d__nome", g3d);
    $(".g3d__total", g3d).textContent = " / " + String(lista.length).padStart(2, "0");

    const st = { a: 0, P: 1000, R: 1000, passo: 22, lim: 50, vh: innerHeight / 100, atual: -1 };
    const medir = () => {
      const W = innerWidth;
      st.P = W < 700 ? 640 : W < 1100 ? 860 : 1000;
      st.R = st.P;
      cena.style.setProperty("--P", st.P + "px");
      const w = itens[0].offsetWidth || 260;
      st.passo = (2 * Math.atan((w * 0.7) / st.R) * 180) / Math.PI;
      st.lim = (Math.atan((W / 2 + w) / st.P) * 180) / Math.PI + 10;
      st.vh = innerHeight / 100;
    };
    const inicio = () => -st.passo * 0.5;
    const fim = () => (lista.length - 1.5) * st.passo;
    const render = () => {
      let perto = 0, menor = 1e9;
      itens.forEach((el, i) => {
        const th = i * st.passo - st.a;
        const abs = Math.abs(th);
        if (abs < menor) { menor = abs; perto = i; }
        if (abs > st.lim) { if (!el.hidden) el.hidden = true; return; }
        if (el.hidden) el.hidden = false;
        el.style.transform = `rotateY(${(-th).toFixed(3)}deg) translateZ(${-st.R}px) translate(-50%,-50%) translateY(${(DY[i % 12] * st.vh).toFixed(1)}px) rotate(${RZ[i % 12]}deg) scale(${SC[i % 8]})`;
      });
      if (perto !== st.atual) {
        st.atual = perto;
        nEl.textContent = String(perto + 1).padStart(2, "0");
        nomeEl.textContent = `${lista[perto].nome} — ${lista[perto].info}`;
      }
    };
    medir(); st.a = inicio(); render();
    addEventListener("resize", () => { medir(); render(); });
    return { st, medir, render, inicio, fim, cena, roda, total: lista.length };
  })() : null;

  /* ==========================================================================
     SOBRE — retrato sem fundo com camisas em órbita (passam atrás e na frente)
     ========================================================================== */
  const palco = $(".palco");
  const O = palco && C ? (() => {
    const orbita = $(".palco__orbita", palco), pessoa = $(".palco__pessoa", palco);
    const ids = ["jordan-jumpman", "lacoste-croco", "nike-air", "diesel-oval-d", "philipp-plein-wings", "boss-holografica", "chicago-bulls", "tommy-since-1985"];
    const prods = ids.map((id) => C.produtos.find((p) => p.id === id)).filter(Boolean);
    orbita.insertAdjacentHTML("beforeend", prods.map((p) =>
      `<span class="palco__item" style="--ar:${p.w}/${p.h}"><img src="assets/img/orbita/${p.id}-180.webp" srcset="assets/img/orbita/${p.id}-180.webp 180w, assets/img/orbita/${p.id}-320.webp 320w" sizes="(min-width:900px) 200px, 90px" width="${p.w}" height="${p.h}" alt="" decoding="async" fetchpriority="low"></span>`).join(""));
    const itens = $$(".palco__item", orbita);
    const st = { a: -22, giro: 0, abre: 1, R: 180 };
    const medir = () => {
      const w = pessoa.offsetWidth || 280;
      const largo = innerWidth >= 900;   // no computador a órbita é menor para não cobrir o texto
      st.R = Math.round(w * (largo ? 0.58 : 0.64));
      orbita.style.setProperty("--R", st.R + "px");
      orbita.style.setProperty("--cw", Math.round(Math.min(st.R * (largo ? 0.52 : 0.6), innerWidth * 0.25)) + "px");
    };
    const render = () => {
      itens.forEach((el, i) => {
        const th = st.a + st.giro + (i * 360) / itens.length;
        const rad = (th * Math.PI) / 180;
        const vira = -th + Math.sin(rad) * 34;   // a peça vira um pouco enquanto dá a volta
        el.style.transform = `rotateY(${th.toFixed(2)}deg) translateZ(${(st.R * st.abre).toFixed(1)}px) rotateY(${vira.toFixed(2)}deg) rotateX(14deg) translate(-50%,-50%)`;
        el.style.opacity = Math.min(1, st.abre * 1.4).toFixed(3);
      });
    };
    medir(); render();
    addEventListener("resize", () => { medir(); render(); });
    return { st, medir, render };
  })() : null;

  if (!window.gsap || !window.ScrollTrigger) {
    html.classList.add("sem-gsap");
    // sem a biblioteca: a vitrine 3D corre sozinha, devagar
    if (G && !reduz) { const gira = () => { G.st.a += 0.06; if (G.st.a > G.fim()) G.st.a = G.inicio(); G.render(); requestAnimationFrame(gira); }; requestAnimationFrame(gira); }
    return;
  }
  const gsap = window.gsap, ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);
  html.classList.add("com-gsap");

  /* ---------- títulos com letras separadas (Oversize / Soft) ---------- */
  $$("[data-split]").forEach((t) => {
    const txt = t.textContent.trim();
    t.setAttribute("aria-label", txt);
    t.innerHTML = [...txt].map((ch) => `<span class="ch" aria-hidden="true">${ch}</span>`).join("");
    t.classList.add("is-split");
  });

  if (reduz) return; // movimento reduzido: tudo parado e visível

  ST.config({ ignoreMobileResize: true });

  /* ---------- rolagem suave (só mouse/trackpad; no toque fica a rolagem nativa) ---------- */
  if (window.Lenis && fino) {
    const lenis = new window.Lenis({ lerp: 0.085, anchors: true });
    window.jaLenis = lenis;
    lenis.on("scroll", ST.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    html.classList.add("lenis");
  }

  /* ---------- títulos das coleções: letras viram em 3D ---------- */
  $$("[data-split]").forEach((t) => {
    gsap.from($$(".ch", t), {
      yPercent: 105, rotationX: -95, opacity: 0, transformPerspective: 700, transformOrigin: "50% 100%",
      duration: 1.3, ease: "expo.out", stagger: 0.05, delay: 0.15
    });
    gsap.to(t, { yPercent: 22, scale: 0.92, opacity: 0.12, ease: "none",
      scrollTrigger: { trigger: t, start: "top 18%", end: "bottom -60%", scrub: true } });
  });

  /* ---------- HERO 3D ---------- */
  const hero = $(".hero");
  if (hero) {
    const stage = $(".hero__stage", hero);
    const fotos = $$(".ph3d", hero);
    fotos.forEach((el) => gsap.set(el, { z: +el.dataset.z || 0 }));

    if (fino) {
      const rx = gsap.quickTo(stage, "rotationX", { duration: 1.1, ease: "power3" });
      const ry = gsap.quickTo(stage, "rotationY", { duration: 1.1, ease: "power3" });
      hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 11);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
      });
      hero.addEventListener("pointerleave", () => { rx(0); ry(0); });
    }

    // ao rolar, as fotos voam para fora e na direção da câmera
    const sai = gsap.timeline({ scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.7 } });
    fotos.forEach((el) => {
      const ph = el.parentElement;
      const dx = (ph.offsetLeft + ph.offsetWidth / 2) / stage.offsetWidth - 0.5;
      const dy = (ph.offsetTop + ph.offsetHeight / 2) / stage.offsetHeight - 0.5;
      sai.to(el, { xPercent: dx * 190, yPercent: dy * 120 - 30, z: (+el.dataset.z || 0) + 560,
        rotation: dx * 28, opacity: 0, ease: "power2.in" }, 0);
    });
    sai.to($(".hero__copy", hero), { yPercent: -35, opacity: 0, ease: "power1.in" }, 0);
  }

  /* ---------- letreiro de marcas: acelera e inclina com a velocidade do scroll ---------- */
  const linhas = $$(".marquee__row");
  if (linhas.length) {
    const loops = linhas.map((row, k) => gsap.fromTo(row, { xPercent: k % 2 ? -50 : 0 },
      { xPercent: k % 2 ? 0 : -50, ease: "none", duration: 42 + k * 8, repeat: -1 }));
    let alvo = 1, skew = 0;
    const setSkew = gsap.quickSetter(linhas, "skewX", "deg");
    ST.create({
      trigger: ".marquee", start: "top bottom", end: "bottom top",
      onUpdate(self) {
        const v = self.getVelocity();
        alvo = self.direction * (1 + Math.min(Math.abs(v) / 260, 7));
        skew = gsap.utils.clamp(-9, 9, -v / 220);
      }
    });
    gsap.ticker.add(() => {
      loops.forEach((l) => l.timeScale(l.timeScale() + (alvo - l.timeScale()) * 0.08));
      alvo += (Math.sign(alvo || 1) - alvo) * 0.04;
      skew *= 0.9; setSkew(skew);
    });
  }

  /* ---------- VITRINE 3D: a rolagem empurra as fotos pela curva ---------- */
  if (G) {
    const trilho = g3d.parentElement;
    const porGrau = () => (innerWidth < 700 ? 5.5 : 7);   // pixels de rolagem por grau de giro
    const ajusta = () => { G.medir(); trilho.style.height = Math.round(innerHeight + (G.fim() - G.inicio()) * porGrau()) + "px"; };
    ajusta();
    ST.addEventListener("refreshInit", ajusta);
    gsap.fromTo(G.st, { a: () => G.inicio() }, {
      a: () => G.fim(), ease: "none", onUpdate: G.render,
      scrollTrigger: { trigger: trilho, start: "top top", end: "bottom bottom", scrub: 1.1, invalidateOnRefresh: true,
        onUpdate: (self) => g3d.classList.toggle("is-rolando", self.progress > 0.02) }
    });
    // o título de fundo se afasta enquanto a vitrine corre
    gsap.fromTo($(".g3d__fundo", g3d), { scale: 1.08 }, { scale: 0.86, opacity: 0.35, ease: "none",
      scrollTrigger: { trigger: trilho, start: "top top", end: "bottom bottom", scrub: true } });
    // com o mouse, a câmera olha um pouco para os lados
    if (fino) {
      g3d.addEventListener("pointermove", (e) => {
        gsap.to(G.roda, { "--gy": ((e.clientX / innerWidth) - 0.5) * -6 + "deg", "--gx": ((e.clientY / innerHeight) - 0.5) * 4 + "deg",
          duration: 1.2, ease: "power3", overwrite: "auto" });
      });
    }
  }

  /* ---------- coleções: as cartas se abrem em leque ao entrar ---------- */
  $$(".colecao").forEach((c) => {
    const cards = $$(".deck-card", c);
    gsap.from(cards, {
      xPercent: (i) => [45, -45, 0][i] ?? 0, yPercent: 26, rotationY: (i) => [38, -38, 0][i] ?? 0,
      rotation: (i) => [10, -10, 0][i] ?? 0, z: -260, opacity: 0, ease: "power2.out",
      scrollTrigger: { trigger: c, start: "top 92%", end: "top 38%", scrub: 0.8 }
    });
  });

  /* ---------- frase que acende palavra por palavra ---------- */
  $$("[data-palavras]").forEach((p) => {
    const palavras = p.textContent.trim().split(/\s+/);
    p.setAttribute("aria-label", p.textContent.trim());
    p.innerHTML = palavras.map((w) => `<span class="w" aria-hidden="true">${w}</span>`).join(" ");
    gsap.fromTo($$(".w", p), { opacity: 0.13 }, { opacity: 1, ease: "none", stagger: 0.1,
      scrollTrigger: { trigger: p, start: "top 82%", end: "bottom 45%", scrub: 0.6 } });
  });

  /* ---------- entradas em 3D: cartões de produto e destaques ---------- */
  const entra3d = (sel) => {
    const els = $$(sel); if (!els.length) return;
    gsap.set(els, { opacity: 0, y: 110, rotationX: -24, transformPerspective: 1100, transformOrigin: "50% 0%" });
    ST.batch(els, { start: "top 94%", once: true,
      onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, rotationX: 0, duration: 1.25, ease: "expo.out", stagger: 0.12, overwrite: true,
        clearProps: "transform,transformPerspective" }) });
  };
  entra3d(".vitrine .produto");
  entra3d(".destaques .mini");

  // destaques: cada coluna rola numa velocidade
  $$(".mini__media").forEach((m, i) => {
    const d = 30 + (i % 3) * 28;
    gsap.fromTo(m, { y: d }, { y: -d, ease: "none", scrollTrigger: { trigger: m, start: "top bottom", end: "bottom top", scrub: true } });
  });

  /* ---------- SOBRE: a rolagem gira as camisas e move o retrato em 3D ---------- */
  if (O) {
    const mundo = $(".palco__mundo", palco), figura = $(".palco__pessoa img", palco);
    const mono = $(".palco__mono", palco), nome = $(".palco__nome", palco);
    const passos = $$(".palco__passos li", palco), cont = $(".palco__n", palco);
    const prog = { p: 0 };
    let atual = -1;
    const aplica = () => {
      const p = prog.p;
      O.st.a = -22 + p * 540;                       // uma volta e meia durante a rolagem
      O.render();
      gsap.set(figura, { rotationY: -14 + 28 * p, scale: 0.94 + 0.1 * p, transformOrigin: "50% 100%" });
      gsap.set(mono, { scale: 0.92 + 0.34 * p, y: 30 - 90 * p });
      gsap.set(nome, { xPercent: 6 - 46 * p });
      const k = Math.min(passos.length - 1, Math.floor(p * passos.length));
      if (k !== atual) {
        atual = k;
        passos.forEach((li, i) => li.classList.toggle("is-on", i === k));
        cont.textContent = "0" + (k + 1);
      }
    };
    ST.addEventListener("refreshInit", () => { O.medir(); O.render(); });
    gsap.to(prog, { p: 1, ease: "none", onUpdate: aplica,
      scrollTrigger: { trigger: palco, start: "top top", end: "bottom bottom", scrub: 0.8 } });
    aplica();
    // mesmo parado, as camisas continuam girando devagar (só enquanto a cena aparece)
    let visivel = true;
    new IntersectionObserver(([en]) => { visivel = en.isIntersecting; }).observe(palco);
    gsap.ticker.add((t, dt) => { if (!visivel) return; O.st.giro += dt * 0.006; O.render(); });
    // entrada: o retrato sobe e as camisas se abrem a partir dele
    const espera = html.classList.contains("sem-intro") ? 0 : 1.3;
    gsap.from(figura, { yPercent: 12, opacity: 0, duration: 1.4, ease: "expo.out", delay: espera + 0.15 });
    gsap.from(O.st, { abre: 0, duration: 1.9, ease: "expo.out", delay: espera + 0.35, onUpdate: O.render });
    if (fino) {
      palco.addEventListener("pointermove", (e) => {
        gsap.to(mundo, { rotationY: (e.clientX / innerWidth - 0.5) * 12, rotationX: -(e.clientY / innerHeight - 0.5) * 6,
          duration: 1.1, ease: "power3", overwrite: "auto" });
      });
    }
  }

  /* ---------- Sobre: os cortes de vídeo se abrem em leque ---------- */
  const cortes = $$(".corte");
  if (cortes.length) {
    gsap.from(cortes, {
      xPercent: (i) => (1.5 - i) * 95, rotationY: (i) => (i - 1.5) * -34, z: -300, opacity: 0, ease: "power2.out",
      scrollTrigger: { trigger: ".cortes", start: "top 90%", end: "top 32%", scrub: 0.8 }
    });
  }

  /* ---------- rodapé: monograma gigante sobe ---------- */
  const mega = $(".footer__mega");
  if (mega) gsap.fromTo(mega, { yPercent: 40, opacity: 0.2 }, { yPercent: 0, opacity: 1, ease: "none",
    scrollTrigger: { trigger: ".site-footer", start: "top bottom", end: "bottom bottom", scrub: true } });

  /* ---------- só no computador: cursor, inclinação 3D e botões magnéticos ---------- */
  if (fino) {
    // cursor
    const cur = document.createElement("div");
    cur.className = "cursor"; cur.setAttribute("aria-hidden", "true");
    cur.innerHTML = '<span class="cursor__ring"><span class="cursor__txt"></span></span>';
    document.body.appendChild(cur);
    html.classList.add("has-cursor");
    const txt = $(".cursor__txt", cur);
    const cx = gsap.quickTo(cur, "x", { duration: 0.35, ease: "power3" });
    const cy = gsap.quickTo(cur, "y", { duration: 0.35, ease: "power3" });
    addEventListener("pointermove", (e) => { cx(e.clientX); cy(e.clientY); cur.classList.add("is-on"); }, { passive: true });
    document.documentElement.addEventListener("pointerleave", () => cur.classList.remove("is-on"));
    document.addEventListener("pointerover", (e) => {
      const t = e.target.closest(".produto__foto, .tilt, .g3d__item, a, button, label");
      let modo = "", rotulo = "";
      if (t) {
        if (t.matches(".produto__foto")) rotulo = "Ampliar";
        else if (t.matches(".g3d__item") || (t.matches(".tilt") && t.closest("a")) || t.matches("a.tilt")) rotulo = "Ver";
        modo = rotulo ? "is-label" : "is-link";
      }
      cur.className = "cursor is-on " + modo;
      txt.textContent = rotulo;
    });

    // inclinação 3D + brilho seguindo o mouse
    let atual = null, ev = null, pedido = 0;
    const solta = (t) => { t.classList.remove("is-tilting"); t.style.setProperty("--rx", "0deg"); t.style.setProperty("--ry", "0deg"); };
    const passo = () => {
      pedido = 0;
      const t = ev.target.closest ? ev.target.closest(".tilt") : null;
      if (atual && atual !== t) solta(atual);
      atual = t; if (!t) return;
      const r = t.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width, py = (ev.clientY - r.top) / r.height;
      t.classList.add("is-tilting");
      t.style.setProperty("--ry", ((px - 0.5) * 16).toFixed(2) + "deg");
      t.style.setProperty("--rx", ((0.5 - py) * 13).toFixed(2) + "deg");
      t.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
      t.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
    };
    document.addEventListener("pointermove", (e) => { ev = e; if (!pedido) pedido = requestAnimationFrame(passo); }, { passive: true });

    // botões magnéticos
    $$(".actions .btn, .site-header .social a").forEach((b) => {
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        gsap.to(b, { "--mx": ((e.clientX - r.left) / r.width - 0.5) * 16 + "px", "--my": ((e.clientY - r.top) / r.height - 0.5) * 12 + "px", duration: 0.4, ease: "power3" });
      });
      b.addEventListener("pointerleave", () => gsap.to(b, { "--mx": "0px", "--my": "0px", duration: 0.7, ease: "elastic.out(1, .4)" }));
    });
  }

  // as fotos mudam a altura da página ao carregar: recalcula as posições
  addEventListener("load", () => ST.refresh());
})();
