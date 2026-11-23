/* ==========================================================================
   JA imports — interações
   Vitrine, compra pelo WhatsApp, foto ampliada, cabeçalho, entradas e
   transição entre páginas. Os dados vêm de produtos.js (window.JA).
   ========================================================================== */
(() => {
  const C = window.JA;
  if (!C) return;

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const brl = (v) => "R$ " + Number(v).toLocaleString("pt-BR");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const wa = (msg) => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`;
  const ig = () => `https://www.instagram.com/${C.instagram}/`;
  const preco = (p) => p.preco ?? C.colecoes[p.colecao].preco;
  const tipo = (p) => p.tipo || "Camiseta";
  const nomeCompleto = (p) => `${tipo(p)} ${C.colecoes[p.colecao].nome} ${p.nome}`;
  const fotoBase = (p, cor) => (p.fotosPorCor ? p.fotosPorCor[cor] || Object.values(p.fotosPorCor)[0] : p.foto);
  const srcset = (base, larg) => larg.map((w) => `${base}-${w}.webp ${w}w`).join(", ");
  const TILTS = [-2.2, 1.7, -1.2, 2.5, -1.8, 1.1, -2.7, 0.9, 2, -1.4];

  /* ---------- links de contato (WhatsApp / Instagram / textos) ---------- */
  const msgGeral = `Olá, ${C.loja}! Vim pelo site e quero saber mais sobre as camisas.`;
  $$("[data-wa]").forEach((a) => (a.href = wa(a.dataset.wa || msgGeral)));
  $$("[data-ig]").forEach((a) => (a.href = ig()));
  $$("[data-ig-texto]").forEach((el) => (el.textContent = "@" + C.instagram));
  $$("[data-wa-texto]").forEach((el) => (el.textContent = C.whatsappVisivel));

  /* ---------- cabeçalho: some ao descer, volta ao subir ---------- */
  const header = $(".site-header");
  if (header) {
    let ultimo = scrollY, pedido = false;
    const atualiza = () => {
      const y = scrollY;
      header.classList.toggle("is-scrolled", y > 12);
      const desce = y > ultimo && y > 160;
      header.classList.toggle("is-hidden", desce && !header.contains(document.activeElement));
      ultimo = y; pedido = false;
    };
    addEventListener("scroll", () => { if (!pedido) { pedido = true; requestAnimationFrame(atualiza); } }, { passive: true });
    atualiza();
  }

  /* ---------- vitrine (Oversize / Soft) ---------- */
  const cartao = (p, i) => {
    const cor0 = p.cores[0];
    const base = fotoBase(p, cor0);
    const col = C.colecoes[p.colecao].nome;
    const cores = p.cores.map((c, k) => `
        <label class="swatch" title="${esc(c)}">
          <input type="radio" name="cor-${p.id}" value="${esc(c)}"${k === 0 ? " checked" : ""}>
          <span style="--c:${C.cores[c] || "#999"}" aria-hidden="true"></span><span class="sr">${esc(c)}</span>
        </label>`).join("");
    const tams = C.tamanhos.map((t) => `
        <label class="size"><input type="radio" name="tam-${p.id}" value="${t}"><span>${t}</span></label>`).join("");
    return `
    <article class="produto" id="${p.id}">
      <button class="produto__foto tilt" type="button" style="--r:${TILTS[i % TILTS.length]}deg; --ar:${p.w}/${p.h}" aria-label="Ampliar foto: ${esc(nomeCompleto(p))}">
        <img src="${base}-${p.larguras[0]}.webp" srcset="${srcset(base, p.larguras)}"
             sizes="(min-width:1120px) 30vw, (min-width:700px) 46vw, 92vw"
             width="${p.w}" height="${p.h}" alt="${esc(p.alt)}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
        <span class="produto__zoom" aria-hidden="true">+</span>
      </button>
      <div class="produto__info">
        <div>
          <p class="produto__col">${col}${p.tipo ? " · " + esc(p.tipo) : ""}</p>
          <h2 class="produto__nome">${esc(p.nome)}</h2>
        </div>
        <p class="produto__preco">${brl(preco(p))}</p>
      </div>
      <fieldset class="opcoes opcoes--cor">
        <legend>Cor: <b data-cor-nome>${esc(cor0)}</b></legend>
        <div class="chips">${cores}</div>
      </fieldset>
      <fieldset class="opcoes opcoes--tam">
        <legend>Tamanho</legend>
        <div class="chips">${tams}</div>
      </fieldset>
      <a class="btn btn--solid btn--block btn--wa" data-comprar target="_blank" rel="noopener" href="${wa(mensagem(p, cor0))}">
        <svg class="ic" aria-hidden="true"><use href="#i-wa"></use></svg>Comprar pelo WhatsApp
      </a>
      <p class="produto__aviso" role="status" aria-live="polite"></p>
    </article>`;
  };

  function mensagem(p, cor, tam) {
    return [
      `Olá, ${C.loja}! Quero comprar:`,
      "",
      `*${nomeCompleto(p)}*`,
      `Cor: ${cor}`,
      `Tamanho: ${tam || "(a definir)"}`,
      `Valor: ${brl(preco(p))}`,
      "",
      "Vi no site."
    ].join("\n");
  }

  const vitrine = $("#vitrine");
  if (vitrine) {
    const lista = C.produtos.filter((p) => p.colecao === vitrine.dataset.colecao);
    vitrine.innerHTML = lista.map(cartao).join("");
    $$("[data-qtd]").forEach((el) => (el.textContent = lista.length));

    vitrine.addEventListener("change", (e) => {
      const card = e.target.closest(".produto");
      if (!card) return;
      const p = lista.find((x) => x.id === card.id);
      const cor = $(`input[name="cor-${p.id}"]:checked`, card).value;
      const tam = $(`input[name="tam-${p.id}"]:checked`, card)?.value;
      $("[data-cor-nome]", card).textContent = cor;
      $("[data-comprar]", card).href = wa(mensagem(p, cor, tam));
      if (tam) {
        $(".opcoes--tam", card).classList.remove("is-erro");
        $(".produto__aviso", card).textContent = "";
      }
      if (e.target.name.startsWith("cor-") && p.fotosPorCor) trocaFoto(card, p, cor);
    });

    vitrine.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-comprar]");
      if (btn) {
        const card = btn.closest(".produto");
        if (!$(`input[name="tam-${card.id}"]:checked`, card)) {
          e.preventDefault();
          const grupo = $(".opcoes--tam", card);
          grupo.classList.remove("is-erro"); void grupo.offsetWidth; grupo.classList.add("is-erro");
          $(".produto__aviso", card).textContent = "Escolha um tamanho para continuar.";
          $("input", grupo).focus({ preventScroll: true });
        }
        return;
      }
      const foto = e.target.closest(".produto__foto");
      if (foto) {
        const card = foto.closest(".produto");
        const p = lista.find((x) => x.id === card.id);
        const cor = $(`input[name="cor-${p.id}"]:checked`, card).value;
        abreFoto(p, cor, foto);
      }
    });

    // schema.org (lista de produtos) a partir dos mesmos dados
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "ItemList",
      name: `${C.colecoes[vitrine.dataset.colecao].nome} — ${C.loja}`,
      itemListElement: lista.map((p, i) => ({
        "@type": "ListItem", position: i + 1,
        item: {
          "@type": "Product", name: nomeCompleto(p), description: p.alt,
          image: new URL(`${fotoBase(p, p.cores[0])}-${p.larguras.at(-1)}.webp`, location.href).href,
          brand: { "@type": "Brand", name: C.loja },
          offers: { "@type": "Offer", price: preco(p), priceCurrency: "BRL", url: new URL(`#${p.id}`, location.href).href }
        }
      }))
    });
    document.head.appendChild(ld);

    // chegou por um link da Home (ex.: oversize.html#jordan-jumpman)
    const alvo = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (alvo && alvo.classList.contains("produto")) {
      alvo.classList.add("is-alvo");
      requestAnimationFrame(() => alvo.scrollIntoView({ block: "start", behavior: reduz ? "auto" : "smooth" }));
    }
  }

  function trocaFoto(card, p, cor) {
    const img = $(".produto__foto img", card);
    const base = fotoBase(p, cor);
    const nova = new Image();
    nova.srcset = srcset(base, p.larguras); nova.sizes = img.sizes; nova.src = `${base}-${p.larguras[0]}.webp`;
    img.classList.add("is-swapping");
    const aplica = () => { img.srcset = nova.srcset; img.src = nova.src; img.classList.remove("is-swapping"); };
    (nova.decode ? nova.decode() : Promise.resolve()).then(aplica, aplica);
  }

  /* ---------- foto ampliada ---------- */
  const lb = $("#lightbox");
  let origem = null;
  function abreFoto(p, cor, de) {
    if (!lb || !lb.showModal) return;
    origem = de;
    const img = $("img", lb);
    if (p.fotosPorCor) {
      const base = fotoBase(p, cor);
      img.src = `${base}-${p.larguras.at(-1)}.webp`; img.width = p.w; img.height = p.h;
    } else {
      img.src = p.arte; img.width = p.arteW; img.height = p.arteH;
    }
    img.alt = p.fotosPorCor ? p.alt : `Arte completa: ${p.alt}, com as cores disponíveis`;
    $(".lightbox__nome", lb).textContent = `${C.colecoes[p.colecao].nome} · ${p.nome}`;
    lb.showModal();
    window.jaLenis?.stop();
  }
  if (lb) {
    lb.addEventListener("click", (e) => { if (e.target === lb || e.target.closest("[data-fechar]") || e.target.closest(".lightbox__fig") === null) lb.close(); });
    lb.addEventListener("close", () => { window.jaLenis?.start(); $("img", lb).removeAttribute("src"); origem?.focus({ preventScroll: true }); });
  }

  /* ---------- destaques da Home ---------- */
  const dest = $("#destaques");
  if (dest) {
    const lista = C.produtos.filter((p) => p.destaque).slice(0, 6);
    // intercala Oversize e Soft
    const ov = lista.filter((p) => p.colecao === "oversize"), so = lista.filter((p) => p.colecao === "soft");
    const mix = []; while (ov.length || so.length) { if (ov.length) mix.push(ov.shift()); if (so.length) mix.push(so.shift()); }
    dest.innerHTML = mix.map((p, i) => {
      const base = fotoBase(p, p.cores[0]);
      return `
      <a class="mini" href="${C.colecoes[p.colecao].pagina}#${p.id}">
        <span class="mini__media"><span class="tilt" style="--r:${TILTS[(i + 3) % TILTS.length]}deg; --ar:${p.w}/${p.h}">
          <img src="${base}-${p.larguras[0]}.webp" srcset="${srcset(base, p.larguras)}" sizes="(min-width:900px) 28vw, 46vw"
               width="${p.w}" height="${p.h}" alt="${esc(p.alt)}" loading="lazy" decoding="async">
        </span></span>
        <span class="mini__info"><span class="mini__nome">${esc(p.nome)}</span><span class="mini__preco">${brl(preco(p))}</span></span>
        <span class="mini__col">${C.colecoes[p.colecao].nome}</span>
      </a>`;
    }).join("");
  }
  $$("[data-preco]").forEach((el) => (el.textContent = brl(C.colecoes[el.dataset.preco].preco)));
  $$("[data-qtd-col]").forEach((el) => (el.textContent = C.produtos.filter((p) => p.colecao === el.dataset.qtdCol).length));

  /* ---------- entrada ao rolar ---------- */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduz) {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else reveals.forEach((el) => el.classList.add("is-in"));

  /* ---------- vídeo: toca só quando aparece ---------- */
  $$("video[data-auto]").forEach((v) => {
    if (reduz) return; // fica o pôster parado
    if (!("IntersectionObserver" in window)) return;
    new IntersectionObserver(([en]) => { en.isIntersecting ? v.play().catch(() => {}) : v.pause(); }, { threshold: 0.25 }).observe(v);
  });

  /* ---------- transição entre páginas (fallback sem View Transitions) ---------- */
  const temVT = CSS.supports && CSS.supports("view-transition-name: a") && "onpagereveal" in window;
  if (!temVT && !reduz) {
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[href]");
      if (!a || e.defaultPrevented || a.target || a.hasAttribute("download") || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash)) return;
      if (url.href === location.href) return;
      e.preventDefault();
      document.documentElement.classList.add("is-leaving");
      setTimeout(() => (location.href = url.href), 260);
    });
    addEventListener("pageshow", (e) => { if (e.persisted) document.documentElement.classList.remove("is-leaving"); });
  }
})();
