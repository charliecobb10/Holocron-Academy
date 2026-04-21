// ============================================================
// Accounting Mission Controller
// Shared logic for all accounting missions.
// Expects the page to load a data file that sets window.ACCOUNTING_DATA
// ============================================================

(function() {
  const data = window.ACCOUNTING_DATA;
  if (!data) return;
  const progress = window.HolocronProgress;

  const state = {
    view: 'overview',       // 'overview' | 'lesson' | 'quiz' | 'result'
    currentLesson: 0,
    quizIdx: 0,
    quizAnswers: [],
  };

  const root = document.getElementById('mission-root');

  function renderOverview() {
    const m = progress.getMission(data.id);
    const lessonsRead = (m.lessonsRead || []).length;
    const totalLessons = data.lessons.length;
    const quizBest = m.quizScore;

    root.innerHTML = `
      <div class="mission-layout">
        <aside class="mission-sidebar">
          <div class="eyebrow">Mission Outline</div>
          <div class="sidebar-progress">
            <div class="sidebar-row">
              <span>Lessons read</span>
              <span class="jedi-text">${lessonsRead} / ${totalLessons}</span>
            </div>
            <div class="sidebar-row">
              <span>Best quiz score</span>
              <span class="jedi-text">${quizBest != null ? quizBest + '%' : '—'}</span>
            </div>
          </div>

          <div class="sidebar-sep"></div>
          <div class="sidebar-title">Briefings</div>
          ${data.lessons.map((l, i) => `
            <button class="sidebar-btn ${(m.lessonsRead || []).includes(l.key) ? 'read' : ''}"
                    data-lesson="${i}">
              <span class="sidebar-num">${String(i+1).padStart(2,'0')}</span>
              ${l.title}
            </button>
          `).join('')}

          <div class="sidebar-sep"></div>
          <div class="sidebar-title">Evaluation</div>
          <button class="sidebar-btn quiz-btn" data-quiz>
            <span class="sidebar-num">QZ</span>
            Trial of Knowledge
          </button>
        </aside>

        <div class="mission-main">
          <div class="eyebrow">Briefing · Accounting Mission</div>
          <h2>${data.title}</h2>
          <div class="mission-sub">${data.subtitle}</div>

          <div class="yoda-quote mt-3" style="max-width:700px;">
            ${data.yodaIntro || 'Accounting, the language of business it is. Without it, model you cannot. Hmmm.'}
            <cite>— Master Yoda</cite>
          </div>

          <div class="divider"></div>

          <div class="mission-intro">
            <p class="lede">This mission is not about debits and credits. You already know that language, or you don't need to. This is about financial statement articulation — the linking logic a PE or IB analyst must have internalized cold.</p>

            <div class="eyebrow mt-4">What You'll Master</div>
            <ul style="list-style:none; padding:0; margin-top:1rem;">
              ${data.lessons.map(l => `
                <li style="padding:0.6rem 0 0.6rem 2rem; position:relative; color:var(--ink); font-size:0.95rem;"><span style="position:absolute; left:0; color:var(--jedi);">▸</span>${l.title.split(' — ')[1] || l.title}</li>
              `).join('')}
            </ul>

            <div class="mt-4 flex-row">
              <button class="btn" data-action="start-first">
                <span>Begin Briefing 01</span>
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none"><path d="M1 6h12m-4-4 4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg>
              </button>
              ${lessonsRead === totalLessons ? `
                <button class="btn btn-ghost" data-action="start-quiz"><span>Skip to Trial of Knowledge</span></button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
    bindNav();
  }

  function renderLesson() {
    const lesson = data.lessons[state.currentLesson];
    const m = progress.getMission(data.id);
    const isRead = (m.lessonsRead || []).includes(lesson.key);
    const isLast = state.currentLesson === data.lessons.length - 1;

    root.innerHTML = `
      <div class="mission-layout">
        ${sidebarHtml()}
        <div class="mission-main">
          <div class="lesson-meta">
            <span class="eyebrow">Briefing ${String(state.currentLesson + 1).padStart(2,'0')} of ${String(data.lessons.length).padStart(2,'0')}</span>
            ${isRead ? '<span class="read-badge">✓ Read</span>' : ''}
          </div>
          <h2 class="lesson-title">${lesson.title}</h2>

          <div class="lesson-body">${lesson.body}</div>

          <div class="lesson-footer">
            <button class="btn btn-ghost" data-action="prev-lesson" ${state.currentLesson === 0 ? 'disabled' : ''}>
              <span>← Previous</span>
            </button>
            <button class="btn" data-action="${isLast ? 'to-quiz' : 'next-lesson'}">
              <span>${isLast ? 'Begin Trial of Knowledge' : 'Mark Read & Continue →'}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Auto-mark lesson as read when displayed
    progress.markLessonRead(data.id, lesson.key);

    bindNav();
  }

  function sidebarHtml() {
    const m = progress.getMission(data.id);
    return `
      <aside class="mission-sidebar">
        <button class="sidebar-home" data-action="home">← Overview</button>
        <div class="sidebar-sep"></div>
        <div class="sidebar-title">Briefings</div>
        ${data.lessons.map((l, i) => `
          <button class="sidebar-btn ${state.view === 'lesson' && state.currentLesson === i ? 'active' : ''} ${(m.lessonsRead || []).includes(l.key) ? 'read' : ''}"
                  data-lesson="${i}">
            <span class="sidebar-num">${String(i+1).padStart(2,'0')}</span>
            ${l.title.split(' — ')[0]}
          </button>
        `).join('')}
        <div class="sidebar-sep"></div>
        <button class="sidebar-btn quiz-btn ${state.view === 'quiz' || state.view === 'result' ? 'active' : ''}" data-quiz>
          <span class="sidebar-num">QZ</span>
          Trial of Knowledge
        </button>
      </aside>
    `;
  }

  function renderQuiz() {
    if (state.quizIdx >= data.quiz.length) return renderResults();

    const q = data.quiz[state.quizIdx];
    const letters = ['A', 'B', 'C', 'D', 'E'];
    const correctSoFar = state.quizAnswers.filter(a => a.correct).length;

    root.innerHTML = `
      <div class="mission-layout">
        ${sidebarHtml()}
        <div class="mission-main">
          <div class="eyebrow">Trial of Knowledge</div>
          <h2>${data.title} — Final Assessment</h2>

          <div class="quiz-progress mt-3">
            <span>Question ${state.quizIdx + 1} of ${data.quiz.length}</span>
            <span>${correctSoFar} correct so far</span>
          </div>
          <div class="quiz-bar"><div class="quiz-bar-fill" style="width:${(state.quizIdx/data.quiz.length)*100}%"></div></div>

          <div class="quiz-question">${q.q}</div>
          <div class="quiz-options">
            ${q.opts.map((o, i) => `
              <button class="quiz-option" data-opt="${i}">
                <span class="letter">${letters[i]}</span><span>${o}</span>
              </button>
            `).join('')}
          </div>
          <div class="quiz-feedback" id="mission-fb"></div>
          <div id="next-row" style="display:none;">
            <button class="btn" data-action="next-q">
              <span>${state.quizIdx === data.quiz.length - 1 ? 'See Result' : 'Next Question'}</span>
            </button>
          </div>
          <div class="quiz-footer-links">
            <button type="button" class="link-btn" data-action="restart-quiz">↺ Restart Quiz</button>
            <button type="button" class="link-btn" data-action="home">← Back to Briefings</button>
          </div>
        </div>
      </div>
    `;
    bindNav();
  }

  function handleAnswer(picked) {
    const q = data.quiz[state.quizIdx];
    const isCorrect = picked === q.correct;
    state.quizAnswers[state.quizIdx] = { picked, correct: isCorrect };

    document.querySelectorAll('.quiz-option').forEach((b, i) => {
      b.disabled = true;
      if (i === q.correct) b.classList.add('correct');
      else if (i === picked) b.classList.add('incorrect');
    });

    const fb = document.getElementById('mission-fb');
    fb.className = 'quiz-feedback visible' + (isCorrect ? '' : ' wrong');
    fb.innerHTML = `
      <strong style="font-style:normal; color:${isCorrect ? 'var(--jedi)' : 'var(--crimson)'}; letter-spacing:0.1em; text-transform:uppercase; font-size:0.75rem; font-family:var(--mono);">
        ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
      </strong><br><br>${q.feedback}
    `;
    document.getElementById('next-row').style.display = 'block';
  }

  function renderResults() {
    const correct = state.quizAnswers.filter(a => a.correct).length;
    const total = data.quiz.length;
    const pct = Math.round((correct / total) * 100);
    const passed = pct >= 70;

    progress.markQuizResult(data.id, correct, total);

    const verdict = passed
      ? (correct === total
          ? "Perfect assessment, this is. Strong with the accounting force, you have become. Proud, I am."
          : "Passed, you have. Solid foundation. Continue training, you must — but ready for the next assault, you are.")
      : "Struggled, you have. Return to the briefings, review the concepts. Retry, you shall — stronger you will be.";

    root.innerHTML = `
      <div class="mission-layout">
        ${sidebarHtml()}
        <div class="mission-main">
          <div class="quiz-results">
            <div class="eyebrow">Assessment Complete</div>
            <div class="quiz-score">${correct}<span class="out-of">/${total}</span></div>
            <p class="dim" style="margin-bottom: 1.5rem;">${pct}% · ${passed ? 'Passed' : 'Below passing threshold — need 70%'}</p>
            <div class="yoda-quote" style="text-align:left; max-width:620px; margin:2rem auto;">
              ${verdict}
              <cite>— Master Yoda</cite>
            </div>
            <div class="flex-row" style="justify-content:center;">
              <button class="btn" data-action="retry-quiz"><span>Retake the Trial</span></button>
              <a href="index.html" class="btn btn-ghost"><span>Return to the Galaxy</span></a>
            </div>
          </div>
        </div>
      </div>
    `;
    bindNav();
  }

  // ---------------- Event routing ----------------
  function bindNav() {
    // Lesson buttons in sidebar
    root.querySelectorAll('[data-lesson]').forEach(el => {
      el.addEventListener('click', () => {
        state.currentLesson = parseInt(el.dataset.lesson);
        state.view = 'lesson';
        renderLesson();
        window.scrollTo(0, 0);
      });
    });

    // Quiz sidebar button
    root.querySelectorAll('[data-quiz]').forEach(el => {
      el.addEventListener('click', () => startQuiz());
    });

    // Action buttons
    root.querySelectorAll('[data-action]').forEach(el => {
      const action = el.dataset.action;
      el.addEventListener('click', () => {
        switch (action) {
          case 'home':
            state.view = 'overview';
            renderOverview();
            window.scrollTo(0, 0);
            break;
          case 'start-first':
            state.currentLesson = 0;
            state.view = 'lesson';
            renderLesson();
            window.scrollTo(0, 0);
            break;
          case 'start-quiz':
          case 'to-quiz':
            startQuiz();
            break;
          case 'next-lesson':
            state.currentLesson++;
            renderLesson();
            window.scrollTo(0, 0);
            break;
          case 'prev-lesson':
            if (state.currentLesson > 0) {
              state.currentLesson--;
              renderLesson();
              window.scrollTo(0, 0);
            }
            break;
          case 'next-q':
            state.quizIdx++;
            renderQuiz();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            break;
          case 'restart-quiz':
            if (confirm('Restart the quiz from Question 1?')) {
              state.quizIdx = 0;
              state.quizAnswers = [];
              renderQuiz();
            }
            break;
          case 'retry-quiz':
            startQuiz();
            break;
        }
      });
    });

    // Quiz option clicks
    root.querySelectorAll('.quiz-option').forEach(el => {
      el.addEventListener('click', () => handleAnswer(parseInt(el.dataset.opt)));
    });
  }

  function startQuiz() {
    state.view = 'quiz';
    state.quizIdx = 0;
    state.quizAnswers = [];
    renderQuiz();
    window.scrollTo(0, 0);
  }

  // Initial render
  renderOverview();
})();
