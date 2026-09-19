const STORAGE_KEY = "sh1-ideologi-politik-te26-v1";

function defaultState() {
  return {
    version: 1,
    hardIds: [],
    conceptStats: {},
    lastSession: null,
    lastResult: null,
    activeExam: null,
    answeredCount: 0,
    correctCount: 0
  };
}

function defaultStat() {
  return { correct: 0, incorrect: 0, streak: 0, seen: 0 };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1) return defaultState();
    return Object.assign(defaultState(), parsed);
  } catch (e) {
    return defaultState();
  }
}

const store = {
  data: loadState(),

  persist: function () {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  },

  getStat: function (id) {
    if (!this.data.conceptStats[id]) this.data.conceptStats[id] = defaultStat();
    return this.data.conceptStats[id];
  },

  record: function (id, correct) {
    if (!id) return;
    const stat = this.getStat(id);
    stat.seen += 1;
    this.data.answeredCount += 1;
    if (correct) {
      stat.correct += 1;
      stat.streak += 1;
      this.data.correctCount += 1;
    } else {
      stat.incorrect += 1;
      stat.streak = 0;
      if (this.data.hardIds.indexOf(id) === -1 && stat.incorrect >= 2) {
        this.data.hardIds.push(id);
      }
    }
    this.persist();
  },

  toggleHard: function (id) {
    const i = this.data.hardIds.indexOf(id);
    if (i === -1) this.data.hardIds.push(id);
    else this.data.hardIds.splice(i, 1);
    this.persist();
    return this.isHard(id);
  },

  isHard: function (id) {
    return this.data.hardIds.indexOf(id) !== -1;
  },

  setSession: function (session) {
    this.data.lastSession = session;
    this.persist();
  },

  setResult: function (result) {
    this.data.lastResult = result;
    this.data.activeExam = null;
    this.persist();
  },

  setExam: function (exam) {
    this.data.activeExam = exam;
    this.persist();
  },

  accuracy: function () {
    if (!this.data.answeredCount) return 0;
    return Math.round((this.data.correctCount / this.data.answeredCount) * 100);
  }
};

function getStrength(stat) {
  if (!stat || stat.seen === 0) return 0;
  const attempts = stat.correct + stat.incorrect;
  const rate = attempts ? stat.correct / attempts : 0;
  return rate * 0.7 + Math.min(stat.streak, 4) * 0.05;
}

function isMastered(id) {
  const s = store.getStat(id);
  return s.correct >= 2 && s.correct > s.incorrect && s.streak >= 1;
}

function getWeakConcepts() {
  return CONCEPTS.filter(function (c) {
    const s = store.getStat(c.id);
    if (s.seen === 0) return false;
    return !isMastered(c.id) || s.incorrect >= s.correct;
  }).sort(function (a, b) {
    return getStrength(store.getStat(a.id)) - getStrength(store.getStat(b.id));
  });
}

function masteredCount() {
  return CONCEPTS.filter(function (c) { return isMastered(c.id); }).length;
}

function weighted(list) {
  return list
    .map(function (item) {
      const id = item.concept || item.id;
      const s = store.getStat(id);
      return { item: item, w: 1.3 - getStrength(s) + (s.seen === 0 ? 0.3 : 0) + Math.random() * 0.15 };
    })
    .sort(function (a, b) { return b.w - a.w; })
    .map(function (x) { return x.item; });
}
