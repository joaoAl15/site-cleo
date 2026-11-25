/* =========================================================
   Cleu Rodrigues · scripts do site
   ========================================================= */
(function () {
  "use strict";

  /* ===== CONFIGURAÇÃO: troque aqui ===== */
  var CONFIG = {
    whatsapp: "5562986056805",              // DDI + DDD + número, só dígitos
    telefone: "(62) 98605-6805",            // como aparece no site
    instagram: "https://www.instagram.com/cleu.rodrigues_",
    mapaLink: "https://maps.app.goo.gl/9KBSvyRT6KzCfkmV6",
    mapaCoord: "-16.9704801,-49.2262803"
  };

  /* Menu de serviços: [nome, preço]. Use null para "sob avaliação". */
  var MENU = [
    { t: "Epilação na cera", i: [
      ["Buço", 20], ["Queixo", 16], ["Nariz", 25], ["Rosto", 70],
      ["Axilas", 40], ["Braços completos", 56], ["Seios", 25], ["Entre seios", 16],
      ["Barriga", 42], ["Faixa", 15], ["Costas", 60], ["Virilha completa", 80],
      ["Lateral anal", 32], ["Nádegas", 45], ["Coxa", 58], ["Meia perna", 55], ["Pé", 25]
    ]},
    { t: "Sobrancelhas", i: [["Design personalizado", 60], ["Design personalizado + henna", 80]] },
    { t: "Clareamento", i: [["Clareamento corporal", null]] }
  ];

  var MSG = {
    geral: "Olá, Cleu! Vim pelo site e gostaria de reservar um horário.",
    duvida: "Olá, Cleu! Vim pelo site e tenho uma dúvida:"
  };
  /* ====================================== */

  var $ = function (id) { return document.getElementById(id); };
  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var wa = function (m) { return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(m); };
  var brl = function (n) { return n === null ? "sob avaliação" : "R$ " + n; };

  /* ---------- links de contato ---------- */
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.href = wa(MSG[a.dataset.wa] || MSG.geral);
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  });
  document.querySelectorAll("[data-ig]").forEach(function (a) { a.href = CONFIG.instagram; });
  $("tel").textContent = CONFIG.telefone;
  $("rota").href = CONFIG.mapaLink;
  $("ano").textContent = new Date().getFullYear();

  /* ---------- menu de serviços (montado com textContent, sem innerHTML) ---------- */
  var lista = $("lista");
  MENU.forEach(function (g, gi) {
    var box = document.createElement("div");
    box.className = "mgroup rv g" + gi;
    var h = document.createElement("h3");
    h.textContent = g.t;
    var small = document.createElement("small");
    small.textContent = g.i.length + (g.i.length > 1 ? " opções" : " opção");
    h.appendChild(small);
    box.appendChild(h);
    g.i.forEach(function (s, i) {
      var l = document.createElement("label"); l.className = "item";
      var c = document.createElement("input"); c.type = "checkbox"; c.dataset.g = gi; c.dataset.i = i;
      var nm = document.createElement("span"); nm.className = "nm"; nm.textContent = s[0];
      var ld = document.createElement("span"); ld.className = "ld"; ld.setAttribute("aria-hidden", "true");
      var pr = document.createElement("span"); pr.className = "pr"; pr.textContent = brl(s[1]);
      l.append(c, nm, ld, pr);
      box.appendChild(l);
    });
    lista.appendChild(box);
  });

  function marcados() {
    return Array.prototype.map.call(lista.querySelectorAll("input:checked"), function (c) {
      return MENU[c.dataset.g].i[c.dataset.i];
    });
  }
  function soma() {
    var m = marcados(), t = 0, aval = false;
    m.forEach(function (s) { if (s[1] === null) aval = true; else t += s[1]; });
    $("total").textContent = "R$ " + t + (aval ? " + avaliação" : "");
    $("qtd").textContent = m.length === 0 ? "Nenhum serviço selecionado"
      : m.length === 1 ? "1 serviço selecionado" : m.length + " serviços selecionados";
    return { t: t, a: aval, m: m };
  }
  lista.addEventListener("change", function () {
    soma();
    var el = $("total"); el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop");
  });

  function mensagem(nome, extra) {
    var r = soma();
    var txt = "Olá, Cleu! " + (nome ? "Meu nome é " + nome + ". " : "") + "Vim pelo site e quero reservar um horário.";
    if (r.m.length) {
      txt += "\n\nServiços:\n" + r.m.map(function (s) { return "• " + s[0] + " (" + brl(s[1]) + ")"; }).join("\n");
      txt += "\n\nTotal: R$ " + r.t + (r.a ? " + avaliação" : "");
    }
    return txt + (extra || "");
  }

  $("enviar").addEventListener("click", function () {
    window.open(wa(mensagem("")), "_blank", "noopener");
  });

  /* ---------- formulário de reserva ---------- */
  $("f").addEventListener("submit", function (e) {
    e.preventDefault();
    if ($("site").value) return;                      // honeypot preenchido = robô
    var nome = $("nome").value.trim();
    if (!nome) { $("err").textContent = "Escreva seu nome para a Cleu saber quem é."; $("nome").focus(); return; }
    $("err").textContent = "";
    var ex = "";
    if ($("dia").value) { var p = $("dia").value.split("-"); ex += "\n\nDia preferido: " + p[2] + "/" + p[1] + "/" + p[0]; }
    if ($("hora").value) ex += "\nHorário: " + $("hora").value;
    if ($("obs").value.trim()) ex += "\nObservações: " + $("obs").value.trim();
    window.open(wa(mensagem(nome.slice(0, 60), ex)), "_blank", "noopener");
  });

  /* ---------- mapa: só carrega quando a pessoa pede (mais leve e sem cookies do Google antes) ---------- */
  $("loadMap").addEventListener("click", function () {
    var f = document.createElement("iframe");
    f.title = "Localização do estúdio no Google Maps";
    f.loading = "lazy";
    f.referrerPolicy = "no-referrer-when-downgrade";
    f.src = "https://www.google.com/maps?q=" + CONFIG.mapaCoord + "&output=embed";
    $("map").replaceChildren(f);
  });

  /* ---------- conteúdo sensível ---------- */
  $("verSens").addEventListener("click", function () {
    var s = $("sens"); s.hidden = !s.hidden;
    this.firstChild.textContent = s.hidden ? "Ver resultados de virilha " : "Ocultar resultados de virilha ";
    this.setAttribute("aria-expanded", String(!s.hidden));
  });

  /* ---------- filtros da galeria ---------- */
  var fbtn = document.querySelectorAll(".filters button");
  fbtn.forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.dataset.f;
      fbtn.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      document.querySelectorAll("#gal .ba").forEach(function (fig) {
        fig.classList.toggle("hide", f !== "todos" && fig.dataset.c !== f);
      });
    });
  });

  /* ---------- menu mobile ---------- */
  var burger = $("burger"), body = document.body;
  function nav(open) {
    body.classList.toggle("nav-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.querySelector(".sr").textContent = open ? "Fechar menu" : "Abrir menu";
  }
  burger.addEventListener("click", function () { nav(!body.classList.contains("nav-open")); });
  document.querySelectorAll("#nav a").forEach(function (a) { a.addEventListener("click", function () { nav(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") nav(false); });

  /* ---------- cabeçalho + botão flutuante ---------- */
  var hdr = $("hdr"), wpp = $("wpp"), last = 0, menuOn = false;
  function onScroll() {
    var y = window.scrollY;
    hdr.classList.toggle("solid", y > 40);
    hdr.classList.toggle("up", y > last && y > 600 && !body.classList.contains("nav-open"));
    last = y;
    wpp.classList.toggle("show", y > 600 && !menuOn);   // some na tabela de valores para não cobrir o botão de reserva
  }
  new IntersectionObserver(function (es) { menuOn = es[0].isIntersecting; onScroll(); }, { threshold: 0.05 }).observe($("menu"));
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- revelação ao rolar ---------- */
  var alvos = document.querySelectorAll(".rv,.mask");
  if (RM || !("IntersectionObserver" in window)) {
    alvos.forEach(function (el) { el.classList.add("in"); });
  } else {
    /* Fotos com .mask começam recortadas (clip-path) e o navegador as trata como invisíveis.
       Por isso observamos o bloco em volta delas e ligamos a animação na foto. */
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        if (el.classList.contains("rv")) el.classList.add("in");
        el.querySelectorAll(":scope > .mask").forEach(function (m) { m.classList.add("in"); });
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    var vistos = new Set();
    alvos.forEach(function (el) {
      var t = el.classList.contains("mask") ? el.parentElement : el;
      if (!vistos.has(t)) { vistos.add(t); io.observe(t); }
    });
  }
})();
