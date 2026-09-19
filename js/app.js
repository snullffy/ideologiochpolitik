(function () {
  const App = {
    route: "home",
    menuOpen: false,
    practiceIds: null,
    practiceLabel: "",
    modeState: null
  };

  const IDEOLOGY_CHOICES = ["Liberalism", "Konservatism", "Socialism"];
  const RR_CHOICES = ["Riksdagen", "Regeringen"];
  const LEVEL_CHOICES = ["Staten", "Region", "Kommun"];

  function navigate(route, options) {
    options = options || {};
    App.route = route;
    App.menuOpen = false;
    if (!options.keepPractice && !options.resume) {
      App.practiceIds = null;
      App.practiceLabel = "";
    }
    if (options.practiceIds) {
      App.practiceIds = options.practiceIds.slice();
      App.practiceLabel = options.practiceLabel || "Utvalt urval";
    }
    if (!options.resume) App.modeState = null;
    location.hash = route;
    render();
    window.scrollTo(0, 0);
  }

  function saveResume(extra) {
    store.setSession(
      Object.assign(
        {
          mode: App.route,
          practiceIds: App.practiceIds,
          practiceLabel: App.practiceLabel
        },
        extra || {}
      )
    );
  }

  function resumeSession() {
    const session = store.data.lastSession;
    if (!session || !session.mode) return;
    App.practiceIds = session.practiceIds || null;
    App.practiceLabel = session.practiceLabel || "";
    App.modeState = session.modeState || null;
    if (session.mode === "exam" && store.data.activeExam) {
      App.modeState = store.data.activeExam;
    }
    App.route = session.mode;
    location.hash = session.mode;
    render();
  }

  function hardButton(id) {
    const pressed = store.isHard(id);
    return (
      '<button type="button" class="btn btn-warn" data-action="hard" aria-pressed="' +
      (pressed ? "true" : "false") +
      '">' +
      (pressed ? "Sparad som svår" : "Markera som svårt") +
      "</button>"
    );
  }

  function bindHard(root, id) {
    on(root, '[data-action="hard"]', "click", function () {
      store.toggleHard(id);
      const button = root.querySelector('[data-action="hard"]');
      const pressed = store.isHard(id);
      setPressed(button, pressed);
      button.textContent = pressed ? "Sparad som svår" : "Markera som svårt";
    });
  }

  function practiceBanner() {
    if (!App.practiceIds) return "";
    return (
      '<div class="banner">' +
      escapeHtml(App.practiceLabel) +
      " · " +
      App.practiceIds.length +
      " begrepp</div>"
    );
  }

  function filterByPractice(list) {
    if (!App.practiceIds || !App.practiceIds.length) return list.slice();
    const set = {};
    App.practiceIds.forEach(function (id) {
      set[id] = true;
    });
    const filtered = list.filter(function (item) {
      return set[item.concept || item.id];
    });
    return filtered.length ? filtered : list.slice();
  }

  function layout(inner) {
    const nav = NAV_ITEMS.map(function (item) {
      const active = App.route === item.id ? " active" : "";
      return (
        '<button type="button" class="nav-btn' +
        active +
        '" data-nav="' +
        item.id +
        '">' +
        escapeHtml(item.label) +
        "</button>"
      );
    }).join("");

    return (
      '<div class="app">' +
      '<div class="backdrop' +
      (App.menuOpen ? " show" : "") +
      '" data-action="close-menu"></div>' +
      '<aside class="sidebar' +
      (App.menuOpen ? " open" : "") +
      '">' +
      '<div class="brand"><div class="brand-title">Ideologi &amp; politik</div>' +
      '<div class="brand-sub">Samhällskunskap nivå 1 · TE26</div></div>' +
      '<nav class="nav">' +
      nav +
      "</nav>" +
      '<div class="side-foot">Valspecial<br>Aktiv återkallning · Teknikprogrammet</div>' +
      "</aside>" +
      '<div class="main">' +
      '<header class="topbar">' +
      '<button class="menu-toggle" data-action="menu" aria-label="Öppna meny"><span></span><span></span><span></span></button>' +
      '<div class="topbar-title">Ideologi &amp; politik</div>' +
      "</header>" +
      '<main class="content">' +
      inner +
      "</main></div></div>"
    );
  }

  function bindShell() {
    document.querySelectorAll("[data-nav]").forEach(function (button) {
      button.addEventListener("click", function () {
        navigate(button.getAttribute("data-nav"));
      });
    });
    on(document, "[data-action='menu']", "click", function () {
      App.menuOpen = !App.menuOpen;
      render();
    });
    on(document, "[data-action='close-menu']", "click", function () {
      App.menuOpen = false;
      render();
    });
  }

  function modeCard(route, title, desc) {
    return (
      '<button type="button" class="mode-link" data-go="' +
      route +
      '"><strong>' +
      escapeHtml(title) +
      "</strong><span>" +
      escapeHtml(desc) +
      "</span></button>"
    );
  }

  function renderHome() {
    const mastered = masteredCount();
    const last = store.data.lastResult;
    const session = store.data.lastSession;
    const weak = getWeakConcepts().slice(0, 6);
    const hard = store.data.hardIds
      .map(conceptById)
      .filter(Boolean)
      .concat(
        getWeakConcepts().filter(function (c) {
          return store.data.hardIds.indexOf(c.id) === -1;
        })
      );
    const uniqueHard = uniqueIds(hard.map(function (c) { return c.id; }))
      .map(conceptById)
      .filter(Boolean)
      .slice(0, 6);

    const cells = CONCEPTS.map(function (c) {
      return '<span class="progress-cell' + (isMastered(c.id) ? " on" : "") + '"></span>';
    }).join("");

    let lastHtml = '<p class="empty">Inget prov gjort ännu.</p>';
    if (last) {
      lastHtml =
        '<p class="result-score" style="font-size:2rem">' +
        last.score +
        " / " +
        last.total +
        "</p>" +
        '<p class="meta">' +
        last.percent +
        "% · " +
        escapeHtml(formatDate(last.date)) +
        "</p>" +
        '<div class="btn-row">' +
        '<button class="btn" data-go="results">Visa resultat</button>' +
        (last.missedIds && last.missedIds.length
          ? '<button class="btn btn-secondary" data-action="practice-missed">Träna på det jag hade fel på</button>'
          : "") +
        "</div>";
    }

    let continueHtml = "";
    if (session && session.mode && session.mode !== "home" && session.mode !== "results") {
      continueHtml =
        '<button class="btn btn-secondary" data-action="resume">Fortsätt: ' +
        escapeHtml(MODE_TITLES[session.mode] || "där du slutade") +
        "</button>";
    }

    const weakHtml = weak.length
      ? '<ul class="list">' +
        weak
          .map(function (c) {
            const s = store.getStat(c.id);
            return (
              "<li><span class=\"en\">" +
              escapeHtml(c.name) +
              "</span><span class=\"sv\">" +
              s.incorrect +
              " fel · " +
              s.correct +
              " rätt</span></li>"
            );
          })
          .join("") +
        "</ul>"
      : '<p class="empty">Träna först så visas det du bör repetera här.</p>';

    const hardHtml = uniqueHard.length
      ? '<ul class="list">' +
        uniqueHard
          .map(function (c) {
            const s = store.getStat(c.id);
            return (
              "<li><span class=\"en\">" +
              escapeHtml(c.name) +
              "</span><span class=\"sv\">" +
              s.incorrect +
              " fel</span></li>"
            );
          })
          .join("") +
        "</ul>"
      : '<p class="empty">Inga begrepp är markerade som svåra ännu.</p>';

    return (
      '<p class="page-kicker">Samhällskunskap nivå 1 · Teknikprogrammet TE26</p>' +
      "<h1>Ideologi &amp; politik</h1>" +
      '<p class="lead">Valspecial. Träna så att du kan förklara, jämföra och använda begreppen – inte bara känna igen dem.</p>' +
      '<div class="grid-2">' +
      '<section class="card">' +
      "<h2>Framsteg</h2>" +
      '<div class="stat-row">' +
      '<div class="stat"><strong>' +
      mastered +
      " / " +
      CONCEPTS.length +
      "</strong><span>Begrepp som sitter</span></div>" +
      '<div class="stat"><strong>' +
      store.data.answeredCount +
      "</strong><span>Genomförda frågor</span></div>" +
      '<div class="stat"><strong>' +
      store.accuracy() +
      "%</strong><span>Rätt procent</span></div>" +
      "</div>" +
      '<div class="progress-track" aria-hidden="true">' +
      cells +
      "</div>" +
      '<div class="btn-row">' +
      '<button class="btn" data-go="learn">Lär dig</button>' +
      continueHtml +
      "</div>" +
      "</section>" +
      '<section class="card">' +
      "<h2>Senaste resultat</h2>" +
      lastHtml +
      "</section>" +
      "</div>" +
      '<div class="grid-modes">' +
      modeCard("learn", "Lär dig", "Korta avsnitt. Tänk själv innan förklaringen visas.") +
      modeCard("flashcards", "Flashcards", "Begrepp, förklaringar eller blandat läge.") +
      modeCard("begrepp", "Träna begrepp", "Matchning, luckor och flerval.") +
      modeCard("train", "Testa dig", "Blandad träning med omedelbar återkoppling.") +
      modeCard("compare", "Jämför ideologier", "Skriv och jämför liberalism, konservatism och socialism.") +
      modeCard("hard", "Mina svåra frågor", "Repetera det som inte sitter än.") +
      modeCard("exam", "Slutprov", "40 frågor. Ingen hjälp under tiden.") +
      modeCard("riksdag", "Riksdag & regering", "Träna skillnaden tills den sitter.") +
      "</div>" +
      '<div class="grid-2">' +
      '<section class="card">' +
      "<h2>Vad du bör träna på</h2>" +
      weakHtml +
      (weak.length
        ? '<div class="btn-row"><button class="btn btn-secondary" data-action="practice-weak">Träna svaga områden</button></div>'
        : "") +
      "</section>" +
      '<section class="card">' +
      "<h2>Svåra begrepp</h2>" +
      hardHtml +
      '<div class="btn-row"><button class="btn btn-secondary" data-go="hard">Öppna mina svåra</button></div>' +
      "</section>" +
      "</div>"
    );
  }

  function bindHome(root) {
    on(root, "[data-go]", "click", function (event) {
      navigate(event.currentTarget.getAttribute("data-go"));
    });
    on(root, "[data-action='resume']", "click", function () {
      resumeSession();
    });
    on(root, "[data-action='practice-missed']", "click", function () {
      const ids = store.data.lastResult && store.data.lastResult.missedIds;
      if (!ids || !ids.length) return;
      navigate("train", { practiceIds: ids, practiceLabel: "Träna på det jag hade fel på", keepPractice: true });
    });
    on(root, "[data-action='practice-weak']", "click", function () {
      const ids = getWeakConcepts().map(function (c) { return c.id; });
      navigate("train", { practiceIds: ids, practiceLabel: "Smart repetition", keepPractice: true });
    });
  }

  function ensureLearnState() {
    if (App.modeState && App.modeState.type === "learn") return App.modeState;
    App.modeState = { type: "learn", index: 0, revealed: false };
    return App.modeState;
  }

  function renderLearn() {
    const state = ensureLearnState();
    const item = LEARN[state.index];
    saveResume({ modeState: state });
    const answer = state.revealed
      ? '<div class="answer-block"><div class="label">Förklaring</div><p class="body-text">' +
        escapeHtml(item.explain) +
        "</p></div>"
      : '<div class="think-box"><div class="label">Förklara med egna ord</div><p class="body-text">' +
        escapeHtml(item.think) +
        '</p><p class="meta" style="margin-top:10px">Tänk först. Visa inte förklaringen förrän du har försökt.</p></div>';

    return (
      '<div class="study-head"><div><p class="page-kicker">Lär dig</p><h1>' +
      escapeHtml(item.title) +
      "</h1></div><div class=\"meta\">" +
      (state.index + 1) +
      " / " +
      LEARN.length +
      "</div></div>" +
      '<section class="word-card"><p class="body-text">' +
      escapeHtml(item.body) +
      "</p>" +
      answer +
      "</section>" +
      '<div class="toolbar"><div class="btn-row">' +
      '<button class="btn btn-secondary" data-action="prev"' +
      (state.index === 0 ? " disabled" : "") +
      ">Föregående</button>" +
      '<button class="btn btn-secondary" data-action="next"' +
      (state.index === LEARN.length - 1 ? " disabled" : "") +
      ">Nästa</button></div>" +
      '<div class="btn-row"><button class="btn" data-action="toggle">' +
      (state.revealed ? "Dölj förklaring" : "Visa förklaring") +
      "</button></div></div>"
    );
  }

  function bindLearn() {
    const state = App.modeState;
    on(document, "[data-action='toggle']", "click", function () {
      state.revealed = !state.revealed;
      render();
    });
    on(document, "[data-action='prev']", "click", function () {
      if (state.index === 0) return;
      state.index -= 1;
      state.revealed = false;
      render();
    });
    on(document, "[data-action='next']", "click", function () {
      if (state.index === LEARN.length - 1) return;
      state.index += 1;
      state.revealed = false;
      render();
    });
  }

  function cardSides(card, direction) {
    if (direction === "def") {
      return { frontLabel: "Förklaring", front: card.back, backLabel: "Begrepp", back: card.name };
    }
    if (direction === "mix") {
      const defFirst = hashStr(card.id + direction) % 2 === 0;
      return defFirst
        ? { frontLabel: "Förklaring", front: card.back, backLabel: "Begrepp", back: card.name }
        : { frontLabel: "Begrepp", front: card.name, backLabel: "Förklaring", back: card.back };
    }
    return { frontLabel: "Begrepp", front: card.name, backLabel: "Förklaring", back: card.back };
  }

  function hashStr(s) {
    var h = 0;
    for (var i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  function ensureFlashState() {
    if (App.modeState && App.modeState.type === "flash") return App.modeState;
    const cards = shuffle(filterByPractice(FLASHCARDS));
    App.modeState = {
      type: "flash",
      index: 0,
      flipped: false,
      direction: "term",
      order: cards.map(function (c) { return c.id; })
    };
    return App.modeState;
  }

  function renderFlashcards() {
    const state = ensureFlashState();
    const cards = state.order.map(conceptById).filter(Boolean).map(function (c) {
      return { id: c.id, name: c.name, back: c.def, topic: c.topic };
    });
    if (!cards.length) return '<p class="empty">Inga kort att visa.</p>';
    const card = cards[state.index];
    const sides = cardSides(card, state.direction);
    saveResume({ modeState: state });

    return (
      practiceBanner() +
      '<div class="study-head"><div><p class="page-kicker">Flashcards</p><h1>Vänd kortet</h1></div>' +
      '<div class="meta">' +
      (state.index + 1) +
      " / " +
      cards.length +
      "</div></div>" +
      '<div class="segment" role="group" aria-label="Riktning">' +
      '<button data-dir="term" class="' +
      (state.direction === "term" ? "active" : "") +
      '">Begrepp → förklaring</button>' +
      '<button data-dir="def" class="' +
      (state.direction === "def" ? "active" : "") +
      '">Förklaring → begrepp</button>' +
      '<button data-dir="mix" class="' +
      (state.direction === "mix" ? "active" : "") +
      '">Blandat</button></div>' +
      '<div class="flip-wrap" style="margin-top:16px"><button type="button" class="flip' +
      (state.flipped ? " is-flipped" : "") +
      '" data-action="flip"><div class="flip-inner">' +
      '<div class="flip-face"><div class="label">' +
      escapeHtml(sides.frontLabel) +
      '</div><p class="prompt">' +
      escapeHtml(sides.front) +
      '</p><p class="flip-hint">Klicka för att vända</p></div>' +
      '<div class="flip-face flip-back"><div class="label">' +
      escapeHtml(sides.backLabel) +
      '</div><p class="prompt" style="font-size:1.35rem">' +
      escapeHtml(sides.back) +
      "</p></div></div></button></div>" +
      '<div class="toolbar"><div class="btn-row">' +
      '<button class="btn btn-secondary" data-action="prev">Föregående</button>' +
      '<button class="btn btn-secondary" data-action="next">Nästa</button>' +
      '<button class="btn btn-secondary" data-action="shuffle">Blanda</button></div>' +
      '<div class="btn-row">' +
      hardButton(card.id) +
      "</div></div>"
    );
  }

  function bindFlashcards(root) {
    const state = App.modeState;
    const n = state.order.length;
    const id = state.order[state.index];
    bindHard(root, id);
    on(root, "[data-action='flip']", "click", function () {
      state.flipped = !state.flipped;
      render();
    });
    on(root, "[data-dir]", "click", function (event) {
      state.direction = event.currentTarget.getAttribute("data-dir");
      state.flipped = false;
      render();
    });
    on(root, "[data-action='prev']", "click", function () {
      state.index = (state.index - 1 + n) % n;
      state.flipped = false;
      render();
    });
    on(root, "[data-action='next']", "click", function () {
      state.index = (state.index + 1) % n;
      state.flipped = false;
      render();
    });
    on(root, "[data-action='shuffle']", "click", function () {
      state.order = shuffle(state.order);
      state.index = 0;
      state.flipped = false;
      render();
    });
  }

  function renderBegrepp() {
    return (
      '<p class="page-kicker">Begrepp</p><h1>Träna begrepp</h1>' +
      '<p class="lead">Samma innehåll, tre sätt att återkalla det.</p>' +
      '<div class="grid-modes">' +
      modeCard("match", "Begreppsmatchning", "Para ihop begrepp med rätt förklaring. Ordningen blandas varje gång.") +
      modeCard("fill", "Fyll i luckan", "Skriv in det saknade begreppet.") +
      modeCard("which", "Vilket begrepp beskrivs?", "Läs en beskrivning och välj rätt term.") +
      "</div>"
    );
  }

  function bindGo(root) {
    on(root, "[data-go]", "click", function (event) {
      navigate(event.currentTarget.getAttribute("data-go"), App.practiceIds ? { practiceIds: App.practiceIds, practiceLabel: App.practiceLabel, keepPractice: true } : {});
    });
  }

  function ensureMatchState() {
    if (App.modeState && App.modeState.type === "match") return App.modeState;
    const pool = weighted(filterByPractice(MATCH_PAIRS)).slice(0, 6);
    App.modeState = {
      type: "match",
      pairs: pool,
      left: shuffle(pool.map(function (p) { return p.id; })),
      right: shuffle(pool.map(function (p) { return p.id; })),
      selectedLeft: null,
      selectedRight: null,
      locked: {},
      done: 0
    };
    return App.modeState;
  }

  function pairById(id) {
    return MATCH_PAIRS.find(function (p) { return p.id === id; });
  }

  function renderMatch() {
    const state = ensureMatchState();
    saveResume({ modeState: state });
    const total = state.pairs.length;
    const leftHtml = state.left
      .map(function (id) {
        const p = pairById(id);
        const cls = state.locked[id] ? " locked" : state.selectedLeft === id ? " selected" : "";
        return (
          '<button type="button" class="match-item' +
          cls +
          '" data-left="' +
          id +
          '"' +
          (state.locked[id] ? " disabled" : "") +
          ">" +
          escapeHtml(p.left) +
          "</button>"
        );
      })
      .join("");
    const rightHtml = state.right
      .map(function (id) {
        const p = pairById(id);
        const cls = state.locked[id] ? " locked" : state.selectedRight === id ? " selected" : "";
        return (
          '<button type="button" class="match-item' +
          cls +
          '" data-right="' +
          id +
          '"' +
          (state.locked[id] ? " disabled" : "") +
          ">" +
          escapeHtml(p.right) +
          "</button>"
        );
      })
      .join("");

    return (
      practiceBanner() +
      '<div class="study-head"><div><p class="page-kicker">Matchning</p><h1>Para ihop</h1></div>' +
      '<div class="meta">' +
      state.done +
      " / " +
      total +
      "</div></div>" +
      '<div class="match-board"><div class="match-col"><h3>Begrepp</h3>' +
      leftHtml +
      '</div><div class="match-col"><h3>Förklaringar</h3>' +
      rightHtml +
      "</div></div>" +
      (state.done === total
        ? '<div class="feedback good" style="margin-top:16px">Alla par är rätt. <p>Kör en ny omgång för att blanda om.</p></div>'
        : "") +
      '<div class="btn-row"><button class="btn btn-secondary" data-action="restart">Ny omgång</button></div>'
    );
  }

  function bindMatch(root) {
    const state = App.modeState;

    function tryMatch() {
      if (!state.selectedLeft || !state.selectedRight) return;
      const ok = state.selectedLeft === state.selectedRight;
      store.record(state.selectedLeft, ok);
      if (ok) {
        state.locked[state.selectedLeft] = true;
        state.done += 1;
        state.selectedLeft = null;
        state.selectedRight = null;
        render();
        return;
      }
      const leftBtn = root.querySelector('[data-left="' + state.selectedLeft + '"]');
      const rightBtn = root.querySelector('[data-right="' + state.selectedRight + '"]');
      if (leftBtn) leftBtn.classList.add("wrong");
      if (rightBtn) rightBtn.classList.add("wrong");
      const a = state.selectedLeft;
      const b = state.selectedRight;
      state.selectedLeft = null;
      state.selectedRight = null;
      setTimeout(function () {
        if (App.modeState !== state) return;
        const lb = document.querySelector('[data-left="' + a + '"]');
        const rb = document.querySelector('[data-right="' + b + '"]');
        if (lb) lb.classList.remove("wrong", "selected");
        if (rb) rb.classList.remove("wrong", "selected");
      }, 450);
    }

    on(root, "[data-left]", "click", function (event) {
      state.selectedLeft = event.currentTarget.getAttribute("data-left");
      Array.prototype.forEach.call(root.querySelectorAll("[data-left]"), function (btn) {
        btn.classList.toggle("selected", btn.getAttribute("data-left") === state.selectedLeft && !state.locked[state.selectedLeft]);
      });
      tryMatch();
    });
    on(root, "[data-right]", "click", function (event) {
      state.selectedRight = event.currentTarget.getAttribute("data-right");
      Array.prototype.forEach.call(root.querySelectorAll("[data-right]"), function (btn) {
        btn.classList.toggle("selected", btn.getAttribute("data-right") === state.selectedRight && !state.locked[state.selectedRight]);
      });
      tryMatch();
    });
    on(root, "[data-action='restart']", "click", function () {
      App.modeState = null;
      render();
    });
  }

  function quizNav(state, total) {
    return (
      '<div class="toolbar"><div class="btn-row">' +
      '<button class="btn btn-secondary" data-action="prev"' +
      (state.index === 0 ? " disabled" : "") +
      ">Föregående</button>" +
      '<button class="btn" data-action="next"' +
      (state.index >= total - 1 ? " disabled" : "") +
      ">Nästa</button></div></div>"
    );
  }

  function bindQuizNav(total) {
    const state = App.modeState;
    on(document, "[data-action='prev']", "click", function () {
      if (state.index === 0) return;
      state.index -= 1;
      render();
    });
    on(document, "[data-action='next']", "click", function () {
      if (state.index >= total - 1) return;
      state.index += 1;
      render();
    });
  }

  function feedbackBox(ok, answer, explain) {
    return (
      '<div class="feedback ' +
      (ok ? "good" : "bad") +
      '"><strong>' +
      (ok ? "Rätt" : "Fel") +
      "</strong>" +
      (ok ? "" : '<p>Rätt svar: <span class="correct-answer">' + escapeHtml(answer) + "</span></p>") +
      (explain ? "<p>" + escapeHtml(explain) + "</p>" : "") +
      "</div>"
    );
  }

  function ensureFillState() {
    if (App.modeState && App.modeState.type === "fill") return App.modeState;
    const items = weighted(filterByPractice(FILL));
    App.modeState = { type: "fill", index: 0, items: items, answers: {}, results: {} };
    return App.modeState;
  }

  function renderFill() {
    const state = ensureFillState();
    const item = state.items[state.index];
    const result = state.results[item.id];
    saveResume({ modeState: state });
    const shown = result
      ? item.text.replace("__________", '<mark>' + escapeHtml(result.given || item.answer) + "</mark>")
      : item.text.replace("__________", "______");

    return (
      practiceBanner() +
      '<div class="study-head"><div><p class="page-kicker">Fyll i luckan</p><h1>Skriv begreppet</h1></div>' +
      '<div class="meta">' +
      (state.index + 1) +
      " / " +
      state.items.length +
      "</div></div>" +
      '<section class="word-card"><p class="blank-sentence">' +
      shown +
      "</p>" +
      (result
        ? feedbackBox(result.ok, item.answer, item.explain)
        : '<form class="field"><label class="sr-only" for="fill-in">Svar</label><input id="fill-in" name="answer" autocomplete="off" placeholder="Skriv svaret här"><div class="btn-row"><button class="btn" type="submit">Rätta</button></div></form>') +
      "</section>" +
      '<div class="toolbar"><div class="btn-row"></div><div class="btn-row">' +
      hardButton(item.concept) +
      "</div></div>" +
      quizNav(state, state.items.length)
    );
  }

  function bindFill(root) {
    const state = App.modeState;
    const item = state.items[state.index];
    bindHard(root, item.concept);
    bindQuizNav(state.items.length);
    const form = root.querySelector("form");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const given = form.answer.value;
      const ok = isCorrectAnswer(given, item.accepted);
      state.results[item.id] = { ok: ok, given: given };
      store.record(item.concept, ok);
      render();
    });
  }

  function prepareWhich(list) {
    return weighted(filterByPractice(list)).map(function (q) {
      return Object.assign({}, q, { shuffled: shuffle(q.options.slice()) });
    });
  }

  function ensureWhichState() {
    if (App.modeState && App.modeState.type === "which") return App.modeState;
    App.modeState = { type: "which", index: 0, items: prepareWhich(WHICH), results: {} };
    return App.modeState;
  }

  function renderMcList(kicker, title, state, item, options, result, extra) {
    const buttons = options
      .map(function (opt) {
        var cls = "choice";
        if (result) {
          if (opt === item.answer) cls += " correct";
          else if (opt === result.given && !result.ok) cls += " incorrect";
        }
        return (
          '<button type="button" class="' +
          cls +
          '" data-choice="' +
          escapeHtml(opt) +
          '"' +
          (result ? " disabled" : "") +
          ">" +
          escapeHtml(opt) +
          "</button>"
        );
      })
      .join("");

    return (
      practiceBanner() +
      '<div class="study-head"><div><p class="page-kicker">' +
      escapeHtml(kicker) +
      "</p><h1>" +
      escapeHtml(title) +
      "</h1></div><div class=\"meta\">" +
      (state.index + 1) +
      " / " +
      state.items.length +
      "</div></div>" +
      (extra || "") +
      '<section class="word-card"><p class="prompt" style="font-size:1.45rem">' +
      escapeHtml(item.prompt || item.statement) +
      '</p><div class="choices' +
      (options.length === 3 ? " cols-3" : "") +
      '">' +
      buttons +
      "</div>" +
      (result ? feedbackBox(result.ok, item.answer, item.explain) : "") +
      "</section>" +
      '<div class="toolbar"><div class="btn-row"></div><div class="btn-row">' +
      hardButton(item.concept) +
      "</div></div>" +
      quizNav(state, state.items.length)
    );
  }

  function bindMc(root, getOptions) {
    const state = App.modeState;
    const item = state.items[state.index];
    bindHard(root, item.concept);
    bindQuizNav(state.items.length);
    on(root, "[data-choice]", "click", function (event) {
      if (state.results[item.id]) return;
      const given = event.currentTarget.getAttribute("data-choice");
      const ok = given === item.answer;
      state.results[item.id] = { ok: ok, given: given };
      store.record(item.concept, ok);
      render();
    });
  }

  function renderWhich() {
    const state = ensureWhichState();
    const item = state.items[state.index];
    saveResume({ modeState: state });
    return renderMcList("Vilket begrepp?", "Välj rätt term", state, item, item.shuffled, state.results[item.id]);
  }

  function ensureIdeoState() {
    if (App.modeState && App.modeState.type === "ideo") return App.modeState;
    App.modeState = { type: "ideo", index: 0, items: weighted(filterByPractice(IDEOLOGY_Q)), results: {} };
    return App.modeState;
  }

  function renderIdeologier() {
    const state = ensureIdeoState();
    const item = state.items[state.index];
    saveResume({ modeState: state });
    return renderMcList(
      "Vilken ideologi?",
      "Identifiera idén",
      state,
      { prompt: item.statement, answer: item.answer, concept: item.concept, id: item.id, explain: "Frågan testar ideologins grundidé. Personer och partier inom samma tradition kan skilja sig åt i detaljer." },
      IDEOLOGY_CHOICES,
      state.results[item.id]
    );
  }

  function ensureCompareState() {
    if (App.modeState && App.modeState.type === "compare") return App.modeState;
    App.modeState = { type: "compare", index: 0, items: COMPARE.slice(), results: {} };
    return App.modeState;
  }

  function renderWriteLike(kicker, title, state, item, result, placeholder) {
    const points = item.points
      .map(function (p) {
        return "<li>" + escapeHtml(p) + "</li>";
      })
      .join("");
    const after = result
      ? '<div class="feedback ' +
        (result.ok ? "good" : "bad") +
        '"><strong>Vad ett bra svar bör innehålla</strong><ul class="points">' +
        points +
        "</ul><p><strong>Modellförklaring</strong></p><p>" +
        escapeHtml(item.model) +
        "</p></div>"
      : '<form class="field"><label class="sr-only" for="write-in">Svar</label><textarea id="write-in" name="answer" placeholder="' +
        escapeHtml(placeholder) +
        '"></textarea><div class="btn-row"><button class="btn" type="submit">Visa modellförklaring</button></div></form>';

    return (
      practiceBanner() +
      '<div class="study-head"><div><p class="page-kicker">' +
      escapeHtml(kicker) +
      "</p><h1>" +
      escapeHtml(title) +
      "</h1></div><div class=\"meta\">" +
      (state.index + 1) +
      " / " +
      state.items.length +
      "</div></div>" +
      '<section class="word-card"><p class="prompt" style="font-size:1.4rem">' +
      escapeHtml(item.prompt) +
      "</p>" +
      after +
      "</section>" +
      '<div class="toolbar"><div class="btn-row"></div><div class="btn-row">' +
      hardButton(item.concept) +
      "</div></div>" +
      quizNav(state, state.items.length)
    );
  }

  function bindWriteLike(root, keywordsOf) {
    const state = App.modeState;
    const item = state.items[state.index];
    bindHard(root, item.concept);
    bindQuizNav(state.items.length);
    const form = root.querySelector("form");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const given = form.answer.value;
      const keys = keywordsOf ? keywordsOf(item) : item.keywords || item.points;
      const ok = keywordHit(given, keys);
      state.results[item.id] = { ok: ok, given: given };
      store.record(item.concept, ok);
      render();
    });
  }

  function renderCompare() {
    const state = ensureCompareState();
    const item = state.items[state.index];
    saveResume({ modeState: state });
    return renderWriteLike("Jämför ideologier", item.title, state, item, state.results[item.id], "Skriv en jämförelse med egna ord.");
  }

  function chainHtml() {
    return (
      '<div class="card" style="margin-bottom:16px"><div class="label">Struktur</div><div class="chain">' +
      '<div class="chain-step"><strong>Folket</strong><span>Väljer representanter</span></div>' +
      '<div class="chain-arrow">nedåt</div>' +
      '<div class="chain-step"><strong>Riksdagen</strong><span>Beslutar om lagar och budget</span></div>' +
      '<div class="chain-arrow">nedåt</div>' +
      '<div class="chain-step"><strong>Regeringen</strong><span>Styr landet och genomför beslut</span></div></div></div>'
    );
  }

  function ensureRiksdagState() {
    if (App.modeState && App.modeState.type === "riksdag") return App.modeState;
    App.modeState = { type: "riksdag", index: 0, items: weighted(filterByPractice(RIKSDAG_Q)), results: {} };
    return App.modeState;
  }

  function renderRiksdag() {
    const state = ensureRiksdagState();
    const item = state.items[state.index];
    saveResume({ modeState: state });
    return renderMcList("Riksdag eller regering", "Vem gör vad?", state, item, RR_CHOICES, state.results[item.id], chainHtml());
  }

  function ensureDemoState() {
    if (App.modeState && App.modeState.type === "demo") return App.modeState;
    App.modeState = {
      type: "demo",
      index: 0,
      items: weighted(filterByPractice(DEMOCRACY_Q)).map(function (q) {
        return Object.assign({}, q, { shuffled: shuffle(q.options.slice()) });
      }),
      results: {}
    };
    return App.modeState;
  }

  function renderDemokrati() {
    const state = ensureDemoState();
    const item = state.items[state.index];
    saveResume({ modeState: state });
    return renderMcList("Demokrati eller diktatur", "Känn igen egenskapen", state, item, item.shuffled, state.results[item.id]);
  }

  function ensureLevelState() {
    if (App.modeState && App.modeState.type === "level") return App.modeState;
    App.modeState = { type: "level", index: 0, items: weighted(filterByPractice(LEVEL_Q)), results: {} };
    return App.modeState;
  }

  function renderNivaer() {
    const state = ensureLevelState();
    const item = state.items[state.index];
    saveResume({ modeState: state });
    const extra =
      '<div class="card" style="margin-bottom:16px"><div class="grid-modes" style="margin-top:0">' +
      '<div><strong>Staten</strong><p class="meta">Nationell politik, riksdag, regering, Sveriges lagar</p></div>' +
      '<div><strong>Regionen</strong><p class="meta">Bland annat sjukvård och kollektivtrafik. Regionfullmäktige.</p></div>' +
      '<div><strong>Kommunen</strong><p class="meta">Bland annat grundskola, förskola och äldreomsorg. Kommunfullmäktige.</p></div>' +
      "</div></div>";
    return renderMcList("Politiska nivåer", "Vems ansvar?", state, item, LEVEL_CHOICES, state.results[item.id], extra);
  }

  function ensureValState() {
    if (App.modeState && App.modeState.type === "val") return App.modeState;
    const mc = ELECTION_Q.map(function (q) {
      return Object.assign({}, q, { shuffled: shuffle(q.options.slice()) });
    });
    App.modeState = { type: "val", index: 0, items: shuffle(filterByPractice(mc)), results: {} };
    return App.modeState;
  }

  function renderValsystem() {
    const state = ensureValState();
    const item = state.items[state.index];
    saveResume({ modeState: state });
    const facts =
      '<div class="card" style="margin-bottom:16px"><div class="stat-row" style="margin-top:0">' +
      '<div class="stat"><strong>349</strong><span>Ledamöter i riksdagen</span></div>' +
      '<div class="stat"><strong>4 %</strong><span>Normal spärr i hela landet</span></div>' +
      '<div class="stat"><strong>4 år</strong><span>Mellan allmänna val</span></div></div>' +
      '<p class="meta" style="margin-top:12px">Proportionella val: mandaten ska ungefär motsvara röstandelen.</p></div>';
    return renderMcList("Valsystemet", "Siffror och innebörd", state, item, item.shuffled, state.results[item.id], facts);
  }

  function ensureScenarioState() {
    if (App.modeState && App.modeState.type === "scenario") return App.modeState;
    App.modeState = { type: "scenario", index: 0, items: shuffle(filterByPractice(SCENARIO)), results: {} };
    return App.modeState;
  }

  function renderScenario() {
    const state = ensureScenarioState();
    const item = state.items[state.index];
    saveResume({ modeState: state });
    return renderWriteLike("Scenario", "Tillämpa kunskapen", state, item, state.results[item.id], "Förklara vad som gäller i situationen.");
  }

  function ensureWriteState() {
    if (App.modeState && App.modeState.type === "write") return App.modeState;
    App.modeState = { type: "write", index: 0, items: shuffle(filterByPractice(WRITE_Q)), results: {} };
    return App.modeState;
  }

  function renderWrite() {
    const state = ensureWriteState();
    const item = state.items[state.index];
    saveResume({ modeState: state });
    return renderWriteLike("Skrivsvar", "Förklara med egna ord", state, item, state.results[item.id], "Skriv ditt svar innan du tittar på modellförklaringen.");
  }

  function renderTrain() {
    return (
      practiceBanner() +
      '<p class="page-kicker">Träna</p><h1>Välj hur du vill testa dig</h1>' +
      '<p class="lead">Blanda format. Svaret kommer efter att du har försökt.</p>' +
      '<div class="grid-modes">' +
      modeCard("mix", "Blandat pass", "Tolv frågor från hela området, med smart repetition.") +
      modeCard("which", "Vilket begrepp?", "Beskrivning mot term.") +
      modeCard("fill", "Fyll i luckan", "Skriv begreppet.") +
      modeCard("ideologier", "Vilken ideologi?", "Känn igen liberalism, konservatism och socialism.") +
      modeCard("compare", "Jämför ideologier", "Skriv jämförelser på gymnasienivå.") +
      modeCard("riksdag", "Riksdag eller regering?", "Vem gör vad?") +
      modeCard("demokrati", "Demokrati eller diktatur?", "Känn igen egenskaper.") +
      modeCard("nivaer", "Politiska nivåer", "Para ansvar med stat, region eller kommun.") +
      modeCard("valsystem", "Valsystemet", "349, 4 procent, 4 år och proportionella val.") +
      modeCard("scenario", "Scenariofrågor", "Tillämpa kunskapen i en situation.") +
      modeCard("write", "Skrivsvar", "Förklara med bedömningspunkter och modell.") +
      modeCard("match", "Matchning", "Begrepp mot förklaring.") +
      "</div>"
    );
  }

  function buildMixItems() {
    const banks = []
      .concat(
        filterByPractice(WHICH).map(function (q) {
          return { kind: "mc", concept: q.concept, id: q.id, prompt: q.prompt, answer: q.answer, options: shuffle(q.options.slice()), explain: conceptById(q.concept) ? conceptById(q.concept).def : "" };
        })
      )
      .concat(
        filterByPractice(IDEOLOGY_Q).map(function (q) {
          return { kind: "mc", concept: q.concept, id: q.id, prompt: q.statement, answer: q.answer, options: IDEOLOGY_CHOICES.slice(), explain: "Grundidé inom ideologin, inte att alla inom traditionen tycker likadant." };
        })
      )
      .concat(
        filterByPractice(RIKSDAG_Q).map(function (q) {
          return { kind: "mc", concept: q.concept, id: q.id, prompt: q.prompt, answer: q.answer, options: RR_CHOICES.slice(), explain: q.explain };
        })
      )
      .concat(
        filterByPractice(LEVEL_Q).map(function (q) {
          return { kind: "mc", concept: q.concept, id: q.id, prompt: q.prompt, answer: q.answer, options: LEVEL_CHOICES.slice(), explain: "Staten: nationell politik. Region: sjukvård och kollektivtrafik. Kommun: skola, förskola, äldreomsorg." };
        })
      )
      .concat(
        filterByPractice(ELECTION_Q).map(function (q) {
          return { kind: "mc", concept: q.concept, id: q.id, prompt: q.prompt, answer: q.answer, options: shuffle(q.options.slice()), explain: q.explain };
        })
      )
      .concat(
        filterByPractice(FILL).map(function (q) {
          return { kind: "fill", concept: q.concept, id: q.id, prompt: q.text, answer: q.answer, accepted: q.accepted, explain: q.explain };
        })
      );
    return weighted(banks).slice(0, 12);
  }

  function ensureMixState() {
    if (App.modeState && App.modeState.type === "mix") return App.modeState;
    App.modeState = { type: "mix", index: 0, items: buildMixItems(), results: {} };
    return App.modeState;
  }

  function renderMix() {
    const state = ensureMixState();
    const item = state.items[state.index];
    const result = state.results[item.id];
    saveResume({ modeState: state });
    if (item.kind === "fill") {
      const shown = result
        ? item.prompt.replace("__________", "<mark>" + escapeHtml(result.given || item.answer) + "</mark>")
        : item.prompt.replace("__________", "______");
      return (
        practiceBanner() +
        '<div class="study-head"><div><p class="page-kicker">Blandat pass</p><h1>Testa dig</h1></div><div class="meta">' +
        (state.index + 1) +
        " / " +
        state.items.length +
        "</div></div>" +
        '<section class="word-card"><p class="blank-sentence">' +
        shown +
        "</p>" +
        (result
          ? feedbackBox(result.ok, item.answer, item.explain)
          : '<form class="field"><label class="sr-only" for="fill-in">Svar</label><input id="fill-in" name="answer" autocomplete="off"><div class="btn-row"><button class="btn" type="submit">Rätta</button></div></form>') +
        "</section>" +
        '<div class="toolbar"><div class="btn-row"></div><div class="btn-row">' +
        hardButton(item.concept) +
        "</div></div>" +
        quizNav(state, state.items.length)
      );
    }
    return renderMcList("Blandat pass", "Testa dig", state, item, item.options, result);
  }

  function bindMix(root) {
    const state = App.modeState;
    const item = state.items[state.index];
    bindHard(root, item.concept);
    bindQuizNav(state.items.length);
    if (item.kind === "fill") {
      const form = root.querySelector("form");
      if (!form) return;
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        const given = form.answer.value;
        const ok = isCorrectAnswer(given, item.accepted);
        state.results[item.id] = { ok: ok, given: given };
        store.record(item.concept, ok);
        render();
      });
      return;
    }
    on(root, "[data-choice]", "click", function (event) {
      if (state.results[item.id]) return;
      const given = event.currentTarget.getAttribute("data-choice");
      const ok = given === item.answer;
      state.results[item.id] = { ok: ok, given: given };
      store.record(item.concept, ok);
      render();
    });
  }

  function hardList() {
    const fromMark = store.data.hardIds.slice();
    const fromStats = CONCEPTS.filter(function (c) {
      const s = store.getStat(c.id);
      return s.incorrect > 0;
    }).sort(function (a, b) {
      return store.getStat(b.id).incorrect - store.getStat(a.id).incorrect;
    }).map(function (c) { return c.id; });
    return uniqueIds(fromMark.concat(fromStats));
  }

  function renderHard() {
    const ids = hardList();
    if (!ids.length) {
      return (
        '<p class="page-kicker">Mina svåra</p><h1>Mina svåra områden</h1>' +
        '<p class="empty">Inget är markerat som svårt ännu. Använd Markera som svårt under träningen, eller svara fel ett par gånger så samlas begreppen här.</p>' +
        '<div class="btn-row"><button class="btn" data-go="train">Gå till träning</button></div>'
      );
    }
    const rows = ids
      .map(function (id) {
        const c = conceptById(id);
        const s = store.getStat(id);
        return (
          "<li><span class=\"en\">" +
          escapeHtml(c ? c.name : id) +
          '</span><span class="sv">' +
          s.incorrect +
          " fel" +
          (store.isHard(id) ? " · markerad" : "") +
          "</span></li>"
        );
      })
      .join("");
    return (
      '<p class="page-kicker">Mina svåra</p><h1>Mina svåra områden</h1>' +
      '<p class="lead">Appen tar de begrepp du har markerat eller ofta svarat fel på.</p>' +
      '<section class="card"><ul class="list">' +
      rows +
      '</ul><div class="btn-row"><button class="btn" data-action="train-hard">Träna på mina svårigheter</button></div></section>'
    );
  }

  function bindHardPage(root) {
    bindGo(root);
    on(root, "[data-action='train-hard']", "click", function () {
      const ids = hardList();
      navigate("mix", { practiceIds: ids, practiceLabel: "Mina svårigheter", keepPractice: true });
    });
  }

  function takeN(list, n) {
    return shuffle(list.slice()).slice(0, n);
  }

  function buildExam() {
    const part1 = takeN(WHICH, 10).map(function (q) {
      return { section: "begrepp", kind: "mc", id: q.id, concept: q.concept, topic: q.topic, prompt: q.prompt, answer: q.answer, options: shuffle(q.options.slice()) };
    });
    const part2 = takeN(IDEOLOGY_Q, 10).map(function (q) {
      return { section: "ideologi", kind: "mc", id: q.id, concept: q.concept, topic: "ideologi", prompt: q.statement, answer: q.answer, options: IDEOLOGY_CHOICES.slice() };
    });
    const politik = []
      .concat(
        RIKSDAG_Q.map(function (q) {
          return { section: "politik", kind: "mc", id: q.id, concept: q.concept, topic: "riksdag", prompt: q.prompt, answer: q.answer, options: RR_CHOICES.slice() };
        })
      )
      .concat(
        ELECTION_Q.map(function (q) {
          return { section: "politik", kind: "mc", id: q.id, concept: q.concept, topic: q.topic, prompt: q.prompt, answer: q.answer, options: shuffle(q.options.slice()) };
        })
      )
      .concat(
        DEMOCRACY_Q.map(function (q) {
          return { section: "politik", kind: "mc", id: q.id, concept: q.concept, topic: q.topic, prompt: q.prompt, answer: q.answer, options: shuffle(q.options.slice()) };
        })
      )
      .concat(
        LEVEL_Q.map(function (q) {
          return { section: "politik", kind: "mc", id: q.id, concept: q.concept, topic: "niva", prompt: q.prompt, answer: q.answer, options: LEVEL_CHOICES.slice() };
        })
      );
    const part3 = takeN(politik, 10);
    const part4 = takeN(SCENARIO, 5).map(function (q) {
      return { section: "scenario", kind: "write", id: q.id, concept: q.concept, topic: q.topic, prompt: q.prompt, points: q.points, model: q.model, keywords: q.points };
    });
    const part5 = takeN(WRITE_Q, 5).map(function (q) {
      return { section: "write", kind: "write", id: q.id, concept: q.concept, topic: q.topic, prompt: q.prompt, points: q.points, model: q.model, keywords: q.keywords };
    });
    return part1.concat(part2, part3, part4, part5);
  }

  function sectionLabel(section) {
    if (section === "begrepp") return "Del 1 – Begrepp";
    if (section === "ideologi") return "Del 2 – Ideologier";
    if (section === "politik") return "Del 3 – Svensk politik";
    if (section === "scenario") return "Del 4 – Tillämpning";
    return "Del 5 – Förklara";
  }

  function ensureExamState() {
    if (App.modeState && App.modeState.type === "exam") return App.modeState;
    if (store.data.activeExam && store.data.activeExam.type === "exam") {
      App.modeState = store.data.activeExam;
      return App.modeState;
    }
    App.modeState = { type: "exam", started: false, index: 0, items: [], answers: {} };
    return App.modeState;
  }

  function persistExam() {
    store.setExam(App.modeState);
    saveResume({ modeState: App.modeState });
  }

  function gradeExam(state) {
    var score = 0;
    const missed = [];
    const byTopic = {};
    Object.keys(TOPICS).forEach(function (t) {
      byTopic[t] = { score: 0, total: 0 };
    });
    state.items.forEach(function (item) {
      const given = state.answers[item.id];
      var ok = false;
      if (item.kind === "mc") ok = given === item.answer;
      else ok = keywordHit(given || "", item.keywords || item.points || []);
      if (ok) score += 1;
      else missed.push(item.concept);
      store.record(item.concept, ok);
      const topic = item.topic || (conceptById(item.concept) && conceptById(item.concept).topic) || "begrepp";
      if (!byTopic[topic]) byTopic[topic] = { score: 0, total: 0 };
      byTopic[topic].total += 1;
      if (ok) byTopic[topic].score += 1;
    });
    const result = {
      score: score,
      total: state.items.length,
      percent: percent(score, state.items.length),
      date: new Date().toISOString(),
      missedIds: uniqueIds(missed),
      byTopic: byTopic,
      items: state.items.map(function (item) {
        return {
          id: item.id,
          prompt: item.prompt,
          kind: item.kind,
          answer: item.answer || "",
          given: state.answers[item.id] || "",
          ok: item.kind === "mc" ? state.answers[item.id] === item.answer : keywordHit(state.answers[item.id] || "", item.keywords || item.points || []),
          model: item.model || "",
          points: item.points || [],
          concept: item.concept,
          topic: item.topic
        };
      })
    };
    store.setResult(result);
    App.modeState = null;
    navigate("results");
  }

  function renderExam() {
    const state = ensureExamState();
    if (!state.started) {
      const resume = store.data.activeExam && store.data.activeExam.started;
      return (
        '<p class="page-kicker">Prov</p><h1>Slutprov</h1>' +
        '<p class="lead">40 frågor. Ingen hjälp, inga förklaringar och ingen rättning förrän du är klar.</p>' +
        '<section class="card"><ul class="list">' +
        "<li><span class=\"en\">Del 1 – Begrepp</span><span class=\"sv\">10 frågor</span></li>" +
        "<li><span class=\"en\">Del 2 – Ideologier</span><span class=\"sv\">10 frågor</span></li>" +
        "<li><span class=\"en\">Del 3 – Svensk politik</span><span class=\"sv\">10 frågor</span></li>" +
        "<li><span class=\"en\">Del 4 – Tillämpning</span><span class=\"sv\">5 scenariofrågor</span></li>" +
        "<li><span class=\"en\">Del 5 – Förklara</span><span class=\"sv\">5 skrivsvar</span></li>" +
        '</ul><div class="exam-note" style="margin-top:16px">Svar sparas lokalt. Du kan fortsätta om sidan laddas om, men du får inte se facit förrän provet är inlämnat.</div>' +
        '<div class="btn-row">' +
        (resume
          ? '<button class="btn" data-action="continue-exam">Fortsätt påbörjat prov</button><button class="btn btn-secondary" data-action="new-exam">Starta om</button>'
          : '<button class="btn" data-action="start-exam">Starta provet</button>') +
        "</div></section>"
      );
    }

    const item = state.items[state.index];
    persistExam();
    const given = state.answers[item.id] || "";
    let body = "";
    if (item.kind === "mc") {
      body =
        '<div class="choices">' +
        item.options
          .map(function (opt) {
            return (
              '<button type="button" class="choice' +
              (given === opt ? " selected" : "") +
              '" data-choice="' +
              escapeHtml(opt) +
              '">' +
              escapeHtml(opt) +
              "</button>"
            );
          })
          .join("") +
        "</div>";
    } else {
      body =
        '<form class="field"><label class="sr-only" for="exam-write">Svar</label><textarea id="exam-write" name="answer" placeholder="Skriv ditt svar. Du får modellförklaring efter inlämning.">' +
        escapeHtml(given) +
        '</textarea><div class="btn-row"><button class="btn btn-secondary" type="submit">Spara svaret</button></div></form>';
    }

    const last = state.index === state.items.length - 1;
    return (
      '<div class="exam-note">' +
      escapeHtml(sectionLabel(item.section)) +
      " · Ingen hjälp under provet</div>" +
      '<div class="study-head"><div><p class="page-kicker">Prov</p><h1>Fråga ' +
      (state.index + 1) +
      "</h1></div><div class=\"meta\">" +
      (state.index + 1) +
      " / " +
      state.items.length +
      "</div></div>" +
      '<section class="word-card"><p class="prompt" style="font-size:1.35rem">' +
      escapeHtml(item.prompt) +
      "</p>" +
      body +
      "</section>" +
      '<div class="toolbar"><div class="btn-row">' +
      '<button class="btn btn-secondary" data-action="prev"' +
      (state.index === 0 ? " disabled" : "") +
      ">Föregående</button>" +
      (last
        ? '<button class="btn" data-action="submit-exam">Lämna in provet</button>'
        : '<button class="btn" data-action="next">Nästa</button>') +
      "</div></div>"
    );
  }

  function bindExam(root) {
    const state = App.modeState;
    on(root, "[data-action='start-exam']", "click", function () {
      state.started = true;
      state.index = 0;
      state.items = buildExam();
      state.answers = {};
      persistExam();
      render();
    });
    on(root, "[data-action='continue-exam']", "click", function () {
      App.modeState = store.data.activeExam;
      render();
    });
    on(root, "[data-action='new-exam']", "click", function () {
      store.setExam(null);
      App.modeState = { type: "exam", started: true, index: 0, items: buildExam(), answers: {} };
      persistExam();
      render();
    });
    if (!state || !state.started) return;
    const item = state.items[state.index];

    function saveCurrentAnswer() {
      const form = root.querySelector("form");
      if (form && form.answer) state.answers[item.id] = form.answer.value;
    }

    on(root, "[data-choice]", "click", function (event) {
      state.answers[item.id] = event.currentTarget.getAttribute("data-choice");
      persistExam();
      render();
    });
    const form = root.querySelector("form");
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        state.answers[item.id] = form.answer.value;
        persistExam();
        if (state.index < state.items.length - 1) {
          state.index += 1;
          persistExam();
        }
        render();
      });
    }
    on(root, "[data-action='prev']", "click", function () {
      if (state.index === 0) return;
      saveCurrentAnswer();
      state.index -= 1;
      persistExam();
      render();
    });
    on(root, "[data-action='next']", "click", function () {
      if (state.index >= state.items.length - 1) return;
      saveCurrentAnswer();
      state.index += 1;
      persistExam();
      render();
    });
    on(root, "[data-action='submit-exam']", "click", function () {
      saveCurrentAnswer();
      gradeExam(state);
    });
  }

  function renderResults() {
    const last = store.data.lastResult;
    if (!last) {
      return (
        '<p class="page-kicker">Resultat</p><h1>Inget resultat ännu</h1>' +
        '<p class="empty">Gör slutprovet för att se poäng per område.</p>' +
        '<div class="btn-row"><button class="btn" data-go="exam">Till provet</button></div>'
      );
    }
    const topics = Object.keys(TOPICS)
      .map(function (key) {
        const row = last.byTopic && last.byTopic[key];
        if (!row || !row.total) return "";
        const pct = percent(row.score, row.total);
        return (
          '<div class="topic-row"><span>' +
          escapeHtml(TOPICS[key]) +
          "</span><div class=\"bar\"><i style=\"width:" +
          pct +
          '%"></i></div><span class="meta">' +
          row.score +
          " / " +
          row.total +
          "</span></div>"
        );
      })
      .join("");

    const missed = (last.missedIds || []).map(conceptById).filter(Boolean);
    const trainMore = missed.length
      ? "<h2 style=\"margin-top:22px\">Träna mer på</h2><ul class=\"list\">" +
        missed
          .map(function (c) {
            return "<li><span class=\"en\">" + escapeHtml(c.name) + "</span><span class=\"sv\">" + escapeHtml(TOPICS[c.topic] || "") + "</span></li>";
          })
          .join("") +
        "</ul>"
      : '<p class="empty">Inga tydliga luckor den här gången.</p>';

    const review = (last.items || [])
      .filter(function (item) { return !item.ok; })
      .slice(0, 12)
      .map(function (item) {
        return (
          '<li><span class="en">' +
          escapeHtml(item.prompt) +
          '</span><span class="sv">' +
          escapeHtml(item.answer || "se modell") +
          "</span></li>"
        );
      })
      .join("");

    return (
      '<p class="page-kicker">Resultat</p><h1>Ditt resultat</h1>' +
      '<section class="card"><p class="result-score">' +
      last.score +
      " / " +
      last.total +
      '</p><p class="result-pct">' +
      last.percent +
      '%</p><p class="meta">' +
      escapeHtml(formatDate(last.date)) +
      "</p>" +
      "<h2 style=\"margin-top:24px\">Per område</h2>" +
      topics +
      trainMore +
      (missed.length
        ? '<div class="btn-row"><button class="btn" data-action="practice-missed">Träna på det jag hade fel på</button></div>'
        : "") +
      "</section>" +
      (review
        ? '<section class="card" style="margin-top:16px"><h2>Frågor att titta på</h2><ul class="list">' +
          review +
          "</ul></section>"
        : "")
    );
  }

  function bindResults(root) {
    bindGo(root);
    on(root, "[data-action='practice-missed']", "click", function () {
      const ids = store.data.lastResult && store.data.lastResult.missedIds;
      if (!ids || !ids.length) return;
      navigate("mix", { practiceIds: ids, practiceLabel: "Träna på det jag hade fel på", keepPractice: true });
    });
  }

  function renderPage() {
    switch (App.route) {
      case "learn":
        return renderLearn();
      case "flashcards":
        return renderFlashcards();
      case "begrepp":
        return renderBegrepp();
      case "match":
        return renderMatch();
      case "fill":
        return renderFill();
      case "which":
        return renderWhich();
      case "ideologier":
        return renderIdeologier();
      case "compare":
        return renderCompare();
      case "riksdag":
        return renderRiksdag();
      case "demokrati":
        return renderDemokrati();
      case "valsystem":
        return renderValsystem();
      case "nivaer":
        return renderNivaer();
      case "train":
        return renderTrain();
      case "mix":
        return renderMix();
      case "scenario":
        return renderScenario();
      case "write":
        return renderWrite();
      case "hard":
        return renderHard();
      case "exam":
        return renderExam();
      case "results":
        return renderResults();
      default:
        return renderHome();
    }
  }

  function bindPage(root) {
    switch (App.route) {
      case "home":
        bindHome(root);
        break;
      case "learn":
        bindLearn();
        break;
      case "flashcards":
        bindFlashcards(root);
        break;
      case "begrepp":
      case "train":
        bindGo(root);
        break;
      case "match":
        bindMatch(root);
        break;
      case "fill":
        bindFill(root);
        break;
      case "which":
      case "ideologier":
      case "riksdag":
      case "demokrati":
      case "valsystem":
      case "nivaer":
        bindMc(root);
        break;
      case "compare":
      case "scenario":
      case "write":
        bindWriteLike(root);
        break;
      case "mix":
        bindMix(root);
        break;
      case "hard":
        bindHardPage(root);
        break;
      case "exam":
        bindExam(root);
        break;
      case "results":
        bindResults(root);
        break;
      default:
        bindHome(root);
    }
  }

  function render() {
    const root = document.getElementById("app");
    root.innerHTML = layout(renderPage());
    bindShell();
    bindPage(root);
  }

  function boot() {
    const hash = location.hash.replace("#", "");
    if (hash && (MODE_TITLES[hash] || hash === "mix" || hash === "match" || hash === "fill" || hash === "which" || hash === "scenario" || hash === "write" || hash === "results")) {
      App.route = hash;
    }
    const session = store.data.lastSession;
    if (session && session.mode === App.route) {
      App.modeState = session.modeState || null;
      App.practiceIds = session.practiceIds || null;
      App.practiceLabel = session.practiceLabel || "";
    }
    if (App.route === "exam" && store.data.activeExam) {
      App.modeState = store.data.activeExam;
    }
    window.addEventListener("hashchange", function () {
      const next = location.hash.replace("#", "") || "home";
      if (next === App.route) return;
      App.route = next;
      App.menuOpen = false;
      App.modeState = null;
      const sess = store.data.lastSession;
      if (sess && sess.mode === App.route) App.modeState = sess.modeState || null;
      if (App.route === "exam" && store.data.activeExam) App.modeState = store.data.activeExam;
      render();
    });
    render();
  }

  boot();
})();
