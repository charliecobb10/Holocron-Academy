// ============================================================
// Holocron Academy — progress tracker (localStorage)
// No auth. Progress saves per-browser via window.localStorage.
// Exposes window.HolocronProgress with get/set/complete helpers.
// ============================================================

(function () {
  const KEY = 'holocron.progress.v1';

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return { ...defaultState(), ...parsed };
    } catch {
      return defaultState();
    }
  }

  function defaultState() {
    return {
      missions: {
        // trials (existing)
        'trial-1': { status: 'unlocked', quizScore: null, submitted: false, bestGrade: null },
        'trial-2': { status: 'locked' },
        'trial-3': { status: 'locked' },
        'trial-4': { status: 'locked' },
        'trial-5': { status: 'locked' },
        'trial-6': { status: 'locked' },
        // accounting missions (new)
        'accounting-1': { status: 'unlocked', quizScore: null, lessonsRead: [] },
        'accounting-2': { status: 'locked' },
        'accounting-3': { status: 'locked' },
        'accounting-4': { status: 'locked' },
        'accounting-5': { status: 'locked' },
        'accounting-6': { status: 'locked' },
      },
      firstVisit: Date.now(),
    };
  }

  function save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }

  function get() { return load(); }

  function getMission(id) {
    return load().missions[id] || { status: 'locked' };
  }

  function setMission(id, patch) {
    const state = load();
    state.missions[id] = { ...state.missions[id], ...patch };
    save(state);
    return state.missions[id];
  }

  function markQuizResult(id, score, total) {
    const pct = Math.round((score / total) * 100);
    const existing = getMission(id);
    const prevBest = existing.quizScore || 0;
    const newBest = Math.max(prevBest, pct);
    const passed = pct >= 70;
    setMission(id, {
      quizScore: newBest,
      quizLastAttempt: pct,
      status: passed ? 'completed' : (existing.status === 'completed' ? 'completed' : 'in-progress'),
    });
  }

  function markLessonRead(id, lessonKey) {
    const m = getMission(id);
    const lessons = new Set(m.lessonsRead || []);
    lessons.add(lessonKey);
    setMission(id, {
      lessonsRead: Array.from(lessons),
      status: m.status === 'locked' ? 'unlocked' : (m.status === 'completed' ? 'completed' : 'in-progress'),
    });
  }

  function markSubmitted(id, gradePct) {
    const m = getMission(id);
    const prev = m.bestGrade || 0;
    setMission(id, {
      submitted: true,
      bestGrade: Math.max(prev, gradePct),
      status: gradePct >= 70 ? 'completed' : 'in-progress',
    });
  }

  function reset() {
    localStorage.removeItem(KEY);
  }

  function exportData() {
    return JSON.stringify(load(), null, 2);
  }

  window.HolocronProgress = {
    get, getMission, setMission,
    markQuizResult, markLessonRead, markSubmitted,
    reset, exportData,
  };
})();
