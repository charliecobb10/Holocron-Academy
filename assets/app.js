// ============================================================
// Trial I — interactive controller
// Steps: 1) Study  2) Trial of Knowledge (quiz)  3) Case  4) Submit
// ============================================================

(function() {
  const state = {
    current: 1,
    studied: false,
    quizIdx: 0,
    quizAnswers: [],
    quizPassed: false,
    caseDownloaded: false,
    submitted: false,
  };

  // -------- Step navigation --------
  const tabs = document.querySelectorAll('.step-tab');
  const panels = document.querySelectorAll('.step-panel');

  function gotoStep(n) {
    // Guard: can't skip into a locked step
    if (!canAccess(n)) return;
    state.current = n;
    tabs.forEach(t => {
      const s = parseInt(t.dataset.step);
      t.classList.toggle('active', s === n);
      t.classList.toggle('done', s < n && isDone(s));
      t.classList.toggle('locked', !canAccess(s));
    });
    panels.forEach(p => {
      p.classList.toggle('active', parseInt(p.dataset.step) === n);
    });
    window.scrollTo({ top: document.querySelector('.steps-nav').offsetTop - 20, behavior: 'smooth' });
  }

  function canAccess(n) {
    if (n === 1) return true;
    if (n === 2) return state.studied;
    if (n === 3) return state.quizPassed;
    if (n === 4) return state.quizPassed && state.caseDownloaded;
    return false;
  }

  function isDone(n) {
    if (n === 1) return state.studied;
    if (n === 2) return state.quizPassed;
    if (n === 3) return state.caseDownloaded;
    if (n === 4) return state.submitted;
    return false;
  }

  tabs.forEach(t => t.addEventListener('click', () => {
    gotoStep(parseInt(t.dataset.step));
  }));

  // -------- Step 1: Study --------
  const studyBtn = document.getElementById('study-confirm');
  if (studyBtn) {
    studyBtn.addEventListener('click', () => {
      state.studied = true;
      gotoStep(2);
    });
  }

  // -------- Step 2: Quiz --------
  const QUIZ = window.TRIAL_1_QUIZ || [];
  const quizBox = document.getElementById('quiz-box');
  const resultsBox = document.getElementById('quiz-results');

  function renderQuestion() {
    if (state.quizIdx >= QUIZ.length) { return renderResults(); }
    const q = QUIZ[state.quizIdx];
    const letters = ['A', 'B', 'C', 'D', 'E'];
    quizBox.innerHTML = `
      <div class="quiz-progress">
        <span>Question ${state.quizIdx + 1} of ${QUIZ.length}</span>
        <span>${state.quizAnswers.filter(a => a.correct).length} correct so far</span>
      </div>
      <div class="quiz-bar"><div class="quiz-bar-fill" style="width:${((state.quizIdx)/QUIZ.length)*100}%"></div></div>
      <div class="quiz-question">${q.q}</div>
      <div class="quiz-options" id="opts">
        ${q.opts.map((o, i) => `
          <button class="quiz-option" data-i="${i}">
            <span class="letter">${letters[i]}</span><span>${o}</span>
          </button>
        `).join('')}
      </div>
      <div class="quiz-feedback" id="fb"></div>
      <div id="nextrow" style="display:none;"><button class="btn" id="next-q"><span>${state.quizIdx === QUIZ.length - 1 ? 'See Result' : 'Next Question'}</span></button></div>
    `;

    document.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => handleAnswer(btn));
    });
    document.getElementById('next-q').addEventListener('click', () => {
      state.quizIdx++;
      renderQuestion();
    });
  }

  function handleAnswer(btn) {
    const q = QUIZ[state.quizIdx];
    const picked = parseInt(btn.dataset.i);
    const isCorrect = picked === q.correct;
    state.quizAnswers[state.quizIdx] = { picked, correct: isCorrect };

    document.querySelectorAll('.quiz-option').forEach((b, i) => {
      b.disabled = true;
      if (i === q.correct) b.classList.add('correct');
      else if (i === picked) b.classList.add('incorrect');
    });

    const fb = document.getElementById('fb');
    fb.className = 'quiz-feedback visible' + (isCorrect ? '' : ' wrong');
    fb.innerHTML = `<strong style="font-style:normal;color:${isCorrect ? 'var(--jedi)' : 'var(--crimson)'};letter-spacing:0.1em;text-transform:uppercase;font-size:0.75rem;font-family:var(--mono);">${isCorrect ? '✓ Correct' : '✗ Incorrect'}</strong><br><br>${q.feedback}`;

    document.getElementById('nextrow').style.display = 'block';
  }

  function renderResults() {
    const correctCount = state.quizAnswers.filter(a => a.correct).length;
    const pct = Math.round((correctCount / QUIZ.length) * 100);
    const passed = correctCount >= 7;
    state.quizPassed = passed;

    const verdictQuote = passed
      ? (correctCount === QUIZ.length
          ? "Perfect, your understanding is. Proud, I am. To the case, you now advance."
          : "Passed, you have. Strong enough with the fundamentals, you are. Hmmm. Proceed, the case awaits.")
      : "Clouded, your understanding remains. Return to the codex, you must. Rise again, and the trial retake.";

    quizBox.innerHTML = `
      <div class="quiz-results">
        <div class="eyebrow">Trial Complete</div>
        <div class="quiz-score">${correctCount}<span class="out-of">/${QUIZ.length}</span></div>
        <p class="dim" style="margin-bottom:1.5rem;">${pct}% · ${passed ? 'Passed' : 'Try again — need 7 of 10 to advance'}</p>
        <div class="yoda-quote" style="text-align:left; max-width:620px; margin:2rem auto;">
          ${verdictQuote}
          <cite>— Master Yoda</cite>
        </div>
        <div class="flex-row" style="justify-content:center;">
          ${passed
            ? `<button class="btn" id="to-case"><span>Retrieve the Case</span><svg width="14" height="12" viewBox="0 0 14 12" fill="none"><path d="M1 6h12m-4-4 4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg></button>`
            : `<button class="btn" id="retry"><span>Retake the Trial</span></button>`
          }
          ${!passed ? `<a href="#" class="btn btn-ghost" onclick="document.querySelector('[data-step=\\'1\\']').click(); return false;"><span>Return to Codex</span></a>` : ''}
        </div>
      </div>
    `;

    const toCase = document.getElementById('to-case');
    if (toCase) toCase.addEventListener('click', () => gotoStep(3));

    const retry = document.getElementById('retry');
    if (retry) retry.addEventListener('click', () => {
      state.quizIdx = 0;
      state.quizAnswers = [];
      renderQuestion();
    });
  }

  if (quizBox) renderQuestion();

  // -------- Step 3: Case --------
  const caseDownloadBtns = document.querySelectorAll('[data-case-download]');
  const caseContinue = document.getElementById('case-continue');
  caseDownloadBtns.forEach(b => b.addEventListener('click', () => {
    // Mark downloaded as soon as user clicks either download link
    state.caseDownloaded = true;
    if (caseContinue) caseContinue.classList.remove('btn-disabled');
  }));
  if (caseContinue) {
    caseContinue.addEventListener('click', () => {
      if (state.caseDownloaded) gotoStep(4);
    });
  }

  // -------- Step 4: Submission --------
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  const fileChosen = document.getElementById('file-chosen');
  const submitBtn = document.getElementById('submit-btn');
  const gradingSpinner = document.getElementById('grading-spinner');
  const gradingStatus = document.getElementById('grading-status');
  const verdictBox = document.getElementById('verdict-box');
  let chosenFile = null;

  if (dropzone) {
    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('drag'); });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag'));
    dropzone.addEventListener('drop', e => {
      e.preventDefault();
      dropzone.classList.remove('drag');
      if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', e => {
      if (e.target.files[0]) setFile(e.target.files[0]);
    });
  }

  function setFile(f) {
    if (!f.name.match(/\.xlsx$/i)) {
      alert('The force requires .xlsx format, my young padawan.');
      return;
    }
    chosenFile = f;
    fileChosen.innerHTML = `
      <span>📄 ${f.name} <span class="faint">· ${(f.size/1024).toFixed(1)} KB</span></span>
      <button class="btn btn-ghost" style="padding:0.5rem 1rem;" id="clear-file"><span>Change</span></button>
    `;
    fileChosen.style.display = 'flex';
    document.getElementById('clear-file').addEventListener('click', () => {
      chosenFile = null;
      fileChosen.style.display = 'none';
      fileInput.value = '';
      submitBtn.classList.add('btn-disabled');
    });
    submitBtn.classList.remove('btn-disabled');
  }

  async function submitForGrading() {
    if (!chosenFile) return;

    dropzone.style.display = 'none';
    fileChosen.style.display = 'none';
    submitBtn.style.display = 'none';
    gradingSpinner.classList.add('active');

    const statuses = window.YODA_LINES.grading;
    let si = 0;
    gradingStatus.textContent = statuses[0];
    const cycle = setInterval(() => {
      si = (si + 1) % statuses.length;
      gradingStatus.textContent = statuses[si];
    }, 2200);

    try {
      // Read file as base64 for JSON-friendly transport
      const fileBase64 = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result.split(',')[1]);
        r.onerror = reject;
        r.readAsDataURL(chosenFile);
      });

      const res = await fetch('/api/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trial: 1, filename: chosenFile.name, fileBase64 })
      });
      clearInterval(cycle);

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Server returned ${res.status}`);
      }
      const result = await res.json();
      renderVerdict(result);
    } catch (err) {
      clearInterval(cycle);
      gradingSpinner.classList.remove('active');
      verdictBox.innerHTML = `
        <div class="verdict" style="border-left-color: var(--crimson);">
          <div class="verdict-header">
            <div class="verdict-title" style="color: var(--crimson);">The Force is Disturbed</div>
          </div>
          <p>The grader could not complete its task. Reason given:</p>
          <p class="mono" style="padding: 1rem; background: var(--void); margin: 1rem 0; color: var(--crimson); font-size:0.85rem; word-break: break-word;">${err.message}</p>
          <p class="dim">Most commonly, this means the grading API is not configured yet. Check that <code>ANTHROPIC_API_KEY</code> is set in Vercel's environment variables, and that the <code>/api/grade.js</code> function is deployed.</p>
          <div class="mt-3 flex-row">
            <button class="btn btn-ghost" onclick="location.reload()"><span>Try Again</span></button>
          </div>
        </div>
      `;
      verdictBox.style.display = 'block';
    }
  }

  function renderVerdict(result) {
    state.submitted = true;
    gradingSpinner.classList.remove('active');

    const { score, total, percent, cellChecks, yodaVerdict, overallAssessment, strengths, improvements } = result;
    const passed = percent >= 70;

    const checksTable = (cellChecks || []).map(c => `
      <tr>
        <td class="mono">${c.metric || ''}</td>
        <td class="mono">${c.year || ''}</td>
        <td class="mono">${c.cell || ''}</td>
        <td class="mono" style="text-align:right;">${c.expected ?? ''}</td>
        <td class="mono" style="text-align:right;">${c.actual ?? ''}</td>
        <td class="check ${c.pass ? 'pass' : 'fail'}">${c.pass ? '✓' : '✗'}</td>
      </tr>
    `).join('');

    verdictBox.innerHTML = `
      <div class="verdict">
        <div class="verdict-header">
          <div class="verdict-title">The Master's Judgment</div>
          <div class="verdict-grade">${score}<span class="pct">/${total}</span></div>
        </div>

        <div class="verdict-quote">
          ${yodaVerdict || 'Your work, received it has been.'}
          <cite style="display:block; margin-top:0.75rem; font-family:var(--mono); font-size:0.75rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--jedi); font-style:normal;">— Master Yoda</cite>
        </div>

        ${overallAssessment ? `
        <div class="verdict-section">
          <h4>Overall Assessment</h4>
          <p>${overallAssessment}</p>
        </div>` : ''}

        ${strengths && strengths.length ? `
        <div class="verdict-section">
          <h4>Strong With The Force</h4>
          <ul style="list-style:none; padding-left:0;">
            ${strengths.map(s => `<li style="padding:0.4rem 0 0.4rem 1.5rem; position:relative; color:var(--ink); font-size:0.95rem;"><span style="position:absolute; left:0; color:var(--jedi);">▸</span>${s}</li>`).join('')}
          </ul>
        </div>` : ''}

        ${improvements && improvements.length ? `
        <div class="verdict-section">
          <h4>Training, You Still Require</h4>
          <ul style="list-style:none; padding-left:0;">
            ${improvements.map(s => `<li style="padding:0.4rem 0 0.4rem 1.5rem; position:relative; color:var(--ink); font-size:0.95rem;"><span style="position:absolute; left:0; color:var(--amber);">▸</span>${s}</li>`).join('')}
          </ul>
        </div>` : ''}

        ${cellChecks && cellChecks.length ? `
        <div class="verdict-section">
          <h4>Cell-by-Cell Verification (${percent}% match)</h4>
          <div style="overflow-x:auto;">
            <table class="cell-check-table">
              <thead><tr><th>Metric</th><th>Year</th><th>Cell</th><th style="text-align:right;">Expected</th><th style="text-align:right;">Your Value</th><th style="text-align:center;">Check</th></tr></thead>
              <tbody>${checksTable}</tbody>
            </table>
          </div>
        </div>` : ''}

        <div class="flex-row mt-4" style="justify-content:space-between;">
          <button class="btn btn-ghost" onclick="location.reload()"><span>Submit Again</span></button>
          ${passed ? `<a href="index.html#trials" class="btn"><span>Return to the Archive</span></a>` : ''}
        </div>
      </div>
    `;
    verdictBox.style.display = 'block';
    window.scrollTo({ top: verdictBox.offsetTop - 40, behavior: 'smooth' });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      if (!submitBtn.classList.contains('btn-disabled')) submitForGrading();
    });
  }
})();
