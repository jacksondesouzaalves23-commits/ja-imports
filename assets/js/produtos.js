/* ==========================================================================
   JA imports — catálogo e contatos
   --------------------------------------------------------------------------
   É AQUI que você edita o site no dia a dia:
   - preço de cada coleção (ou de um produto específico, com "preco: 95")
   - número do WhatsApp e @ do Instagram
   - nomes, cores e ordem dos produtos (a ordem da lista = ordem na vitrine)
   - "destaque: true" coloca o produto na Home
   ========================================================================== */
window.JA = {
  loja: "JA imports",
  whatsapp: "5548988136549",              // 55 + DDD + número, só dígitos
  whatsappVisivel: "(48) 98813-6549",
  instagram: "jacksonofici4l",            // @ do Instagram (sem o @)
  cidade: "Santo Amaro da Imperatriz",
  uf: "SC",
  tamanhos: ["P", "M", "G", "GG"],

  colecoes: {
    oversize: { nome: "Oversize", preco: 90, pagina: "oversize.html" },
    soft:     { nome: "Soft",     preco: 80, pagina: "soft.html" }
  },

  // cor do círculo de seleção
  cores: {
    "Preto": "#141414", "Branco": "#F7F7F4", "Off White": "#EDE5D3", "Bege": "#D8C3A0",
    "Cinza": "#6F6F6C", "Vermelho": "#B4161F", "Verde": "#1F3D2D", "Verde Menta": "#A9CDBA",
    "Marinho": "#1B2234", "Marrom": "#6B3A25", "Amarelo": "#E7C12B"
  },

  produtos: [
    /* ---------------- OVERSIZE (R$ 90) ---------------- */
    { id: "jordan-jumpman", colecao: "oversize", nome: "Jordan Jumpman", destaque: true,
      cores: ["Preto", "Off White", "Cinza", "Vermelho"],
      foto: "assets/img/oversize/jordan-jumpman", larguras: [560, 974], w: 974, h: 800,
      arte: "assets/img/oversize/jordan-jumpman-arte.webp", arteW: 1200, arteH: 1200,
      alt: "Camiseta oversize Jordan preta e off white com Jumpman vermelho no peito e JORDAN nos ombros" },

    { id: "nike-air", colecao: "oversize", nome: "Nike Air", destaque: true,
      cores: ["Preto", "Bege"],
      foto: "assets/img/oversize/nike-air", larguras: [560, 974], w: 974, h: 800,
      arte: "assets/img/oversize/nike-air-arte.webp", arteW: 1200, arteH: 1200,
      alt: "Camiseta oversize Nike preta com NIKE laranja na vertical na frente e AIR com swoosh nas costas" },

    { id: "philipp-plein-wings", colecao: "oversize", nome: "Philipp Plein Wings", destaque: true,
      cores: ["Preto", "Verde", "Off White"],
      foto: "assets/img/oversize/philipp-plein-wings", larguras: [560, 950], w: 950, h: 800,
      arte: "assets/img/oversize/philipp-plein-wings-arte.webp", arteW: 1200, arteH: 1200,
      alt: "Camiseta oversize Philipp Plein preta com letreiro dourado na frente e asas douradas nas costas" },

    { id: "cruz-foi-por-nos", colecao: "oversize", nome: "Cruz Foi por Nós",
      cores: ["Off White", "Preto"],
      foto: "assets/img/oversize/cruz-foi-por-nos", larguras: [560, 974], w: 974, h: 800,
      arte: "assets/img/oversize/cruz-foi-por-nos-arte.webp", arteW: 1200, arteH: 1200,
      alt: "Camiseta oversize off white com cruz vermelha na frente e a frase Foi por nós nas costas" },

    { id: "conjunto-boss", colecao: "oversize", tipo: "Conjunto", nome: "Conjunto Boss Faixa",
      cores: ["Vermelho", "Verde", "Branco"],
      fotosPorCor: {
        "Vermelho": "assets/img/look/conjunto-boss-vermelho",
        "Verde": "assets/img/look/conjunto-boss-verde",
        "Branco": "assets/img/look/conjunto-boss-branco"
      },
      larguras: [600, 1086], w: 1086, h: 1448,
      alt: "Homem vestindo conjunto Boss de camiseta e bermuda com faixa BOSS nas mangas e nas laterais" },

    { id: "balenciaga-bear", colecao: "oversize", nome: "Balenciaga Bear",
      cores: ["Preto"],
      foto: "assets/img/oversize/balenciaga-bear", larguras: [560, 1000], w: 1000, h: 571,
      arte: "assets/img/oversize/balenciaga-bear-arte.webp", arteW: 1200, arteH: 1200,
      alt: "Camiseta oversize Balenciaga preta com logo pequeno na frente e urso de capuz vermelho nas costas" },

    { id: "chicago-bulls", colecao: "oversize", nome: "Chicago Bulls",
      cores: ["Branco", "Verde"],
      foto: "assets/img/oversize/chicago-bulls", larguras: [560, 974], w: 974, h: 800,
      arte: "assets/img/oversize/chicago-bulls-arte.webp", arteW: 1200, arteH: 1200,
      alt: "Camiseta oversize branca Chicago Bulls com touro vermelho e logo da NBA na manga" },

    { id: "lakers", colecao: "oversize", nome: "Lakers",
      cores: ["Branco", "Preto", "Cinza"],
      foto: "assets/img/oversize/lakers", larguras: [560, 974], w: 974, h: 800,
      arte: "assets/img/oversize/lakers-arte.webp", arteW: 1200, arteH: 1200,
      alt: "Camiseta oversize branca Lakers com letreiro roxo e swoosh da Nike" },

    { id: "nike-swoosh", colecao: "oversize", nome: "Nike Swoosh",
      cores: ["Vermelho", "Preto", "Cinza", "Branco"],
      foto: "assets/img/oversize/nike-swoosh", larguras: [560, 974], w: 974, h: 800,
      arte: "assets/img/oversize/nike-swoosh-arte.webp", arteW: 1200, arteH: 1200,
      alt: "Camiseta oversize Nike vermelha com swoosh pequeno na frente e NIKE grande preto nas costas" },

    { id: "burberry-classic", colecao: "oversize", nome: "Burberry Classic",
      cores: ["Vermelho", "Cinza"],
      foto: "assets/img/oversize/burberry-classic", larguras: [560, 974], w: 974, h: 800,
      arte: "assets/img/oversize/burberry-classic-arte.webp", arteW: 1200, arteH: 1200,
      alt: "Camiseta oversize Burberry vermelha com letreiro xadrez no peito" },

    { id: "coracao-e-mente", colecao: "oversize", nome: "Coração & Mente",
      cores: ["Branco", "Cinza", "Vermelho"],
      foto: "assets/img/oversize/coracao-e-mente", larguras: [560, 974], w: 974, h: 800,
      arte: "assets/img/oversize/coracao-e-mente-arte.webp", arteW: 1200, arteH: 1200,
      alt: "Camiseta oversize branca com desenho de cérebro ligado a um coração" },

    { id: "coroa-e-pomba", colecao: "oversize", nome: "Coroa & Pomba",
      cores: ["Preto"],
      foto: "assets/img/oversize/coroa-e-pomba", larguras: [560, 974], w: 974, h: 800,
      arte: "assets/img/oversize/coroa-e-pomba-arte.webp", arteW: 1200, arteH: 1200,
      alt: "Camiseta oversize preta com coroa, pomba e coroa de espinhos em traço branco nas costas" },

    { id: "puma", colecao: "oversize", nome: "Puma",
      cores: ["Preto", "Off White"],
      foto: "assets/img/oversize/puma", larguras: [560, 974], w: 974, h: 800,
      arte: "assets/img/oversize/puma-arte.webp", arteW: 1200, arteH: 1200,
      alt: "Camiseta oversize Puma preta com logo branco no peito" },

    /* ---------------- SOFT (R$ 80) ---------------- */
    { id: "lacoste-croco", colecao: "soft", nome: "Lacoste Croco", destaque: true,
      cores: ["Marinho"],
      foto: "assets/img/soft/lacoste-croco", larguras: [560, 768], w: 768, h: 858,
      arte: "assets/img/soft/lacoste-croco-arte.webp", arteW: 1200, arteH: 1262,
      alt: "Camiseta soft Lacoste azul marinho com crocodilo branco gigante e LACOSTE na frente" },

    { id: "diesel-oval-d", colecao: "soft", nome: "Diesel Oval D", destaque: true,
      cores: ["Vermelho", "Branco"],
      foto: "assets/img/soft/diesel-oval-d", larguras: [560, 750], w: 750, h: 678,
      arte: "assets/img/soft/diesel-oval-d-arte.webp", arteW: 1199, arteH: 1312,
      alt: "Camiseta soft Diesel vermelha com logo oval D em relevo no peito" },

    { id: "boss-holografica", colecao: "soft", nome: "Boss Holográfica", destaque: true,
      cores: ["Preto", "Branco"],
      foto: "assets/img/soft/boss-holografica", larguras: [560, 750], w: 750, h: 678,
      arte: "assets/img/soft/boss-holografica-arte.webp", arteW: 1199, arteH: 1312,
      alt: "Camiseta soft Boss preta com logo e faixa holográfica no peito" },

    { id: "tommy-since-1985", colecao: "soft", nome: "Tommy Since 1985",
      cores: ["Marinho", "Marrom", "Branco"],
      foto: "assets/img/soft/tommy-since-1985", larguras: [560, 750], w: 750, h: 678,
      arte: "assets/img/soft/tommy-since-1985-arte.webp", arteW: 1199, arteH: 1312,
      alt: "Camiseta soft Tommy Hilfiger escura com letreiro Since 1985 tom sobre tom" },

    { id: "porsche-boss", colecao: "soft", nome: "Porsche × Boss",
      cores: ["Preto", "Verde Menta"],
      foto: "assets/img/soft/porsche-boss", larguras: [560, 750], w: 750, h: 650,
      arte: "assets/img/soft/porsche-boss-arte.webp", arteW: 1199, arteH: 1312,
      alt: "Camiseta soft Boss preta com assinatura Porsche Boss no peito" },

    { id: "brooksfield-listra", colecao: "soft", nome: "Brooksfield Listra",
      cores: ["Preto", "Bege", "Branco", "Amarelo"],
      foto: "assets/img/soft/brooksfield-listra", larguras: [560, 750], w: 750, h: 648,
      arte: "assets/img/soft/brooksfield-listra-arte.webp", arteW: 1199, arteH: 1312,
      alt: "Camiseta soft Brooksfield preta com listra branca e vermelha no peito" },

    { id: "boss-monograma", colecao: "soft", nome: "Boss Monograma",
      cores: ["Preto", "Marinho"],
      foto: "assets/img/soft/boss-monograma", larguras: [560, 725], w: 725, h: 678,
      arte: "assets/img/soft/boss-monograma-arte.webp", arteW: 1199, arteH: 1312,
      alt: "Camiseta soft Boss preta com estampa de logos BOSS em toda a peça" },

    { id: "diesel-minimal", colecao: "soft", nome: "Diesel Minimal",
      cores: ["Preto", "Branco", "Off White", "Marinho", "Vermelho", "Cinza"],
      foto: "assets/img/soft/diesel-minimal", larguras: [560, 750], w: 750, h: 678,
      arte: "assets/img/soft/diesel-minimal-arte.webp", arteW: 1199, arteH: 1312,
      alt: "Camiseta soft Diesel preta lisa com DIESEL discreto no peito" },

    { id: "boss-essential", colecao: "soft", nome: "Boss Essential",
      cores: ["Cinza", "Branco"],
      foto: "assets/img/soft/boss-essential", larguras: [560, 750], w: 750, h: 678,
      arte: "assets/img/soft/boss-essential-arte.webp", arteW: 1199, arteH: 1312,
      alt: "Camiseta soft Boss cinza com logo BOSS discreto no peito" },

    { id: "brooksfield-logo", colecao: "soft", nome: "Brooksfield Logo",
      cores: ["Vermelho", "Branco"],
      foto: "assets/img/soft/brooksfield-logo", larguras: [560, 750], w: 750, h: 648,
      arte: "assets/img/soft/brooksfield-logo-arte.webp", arteW: 1199, arteH: 1312,
      alt: "Camiseta soft Brooksfield vermelha com BROOKSFIELD tom sobre tom no peito" },

    { id: "brooksfield-bordado", colecao: "soft", nome: "Brooksfield Bordado",
      cores: ["Vermelho"],
      foto: "assets/img/soft/brooksfield-bordado", larguras: [560, 768], w: 768, h: 858,
      arte: "assets/img/soft/brooksfield-bordado-arte.webp", arteW: 1200, arteH: 1262,
      alt: "Camiseta soft Brooksfield vermelha lisa com pato bordado no peito" }
  ]
};
