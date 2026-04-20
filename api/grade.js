// ============================================================
// /api/grade.js — Holocron Academy grading serverless function
//
// Runs on Vercel. Receives a base64-encoded .xlsx, reads key
// output cells from the Netflix Trial I model, compares against
// the answer key, calls the Anthropic API for Yoda-voice
// feedback, and returns structured JSON.
//
// Required env var (set in Vercel dashboard):
//   ANTHROPIC_API_KEY
// ============================================================

import * as XLSX from 'xlsx';
import Anthropic from '@anthropic-ai/sdk';

// Vercel: expand body limit (default 1MB) for base64-encoded xlsx uploads
export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } },
};

// ------------------------------------------------------------
// Trial I — Netflix answer key.
// Rows/cells match the blank template students downloaded.
// Values are the expected computed results for Base case.
// ------------------------------------------------------------
const TRIAL_1_TARGETS = {
  sheet: 'Model',
  years: ['2006E', '2007E', '2008E', '2009E', '2010E'],
  yearColumns: ['E', 'F', 'G', 'H', 'I'],
  metrics: [
    { name: 'Total Revenue',       row: 70,  values: [911999071, 1101315836, 1283099411, 1423340962, 1505616401] },
    { name: 'Gross Margin',        row: 86,  values: [384822166,  465324623,  542397428,  595724874,  619136905] },
    { name: 'EBIT',                row: 103, values: [72201664,   108089281,  147633819,  184581360,  194267304] },
    { name: 'Net Income',          row: 114, values: [50670531,   73997483,   99701432,   123717334,  130013198] },
    { name: 'EPS',                 row: 119, values: [0.7470,     1.0636,     1.3981,     1.6936,     1.7384] },
    { name: 'EBITDA',              row: 124, values: [191700664,  239619281,  286091819,  327623360,  338705304] },
    { name: 'Cash Flow (CFF)',     row: 129, values: [63609000,   84685992,   113193954,  134521074,  136995987] },
    { name: 'Free Cash Flow',      row: 131, values: [59869550,   80946542,   109454504,  130781624,  133256537] },
  ],
};

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
function readCellValue(ws, ref) {
  const cell = ws[ref];
  if (!cell) return null;
  // SheetJS: cell.v is the value; cell.t is type; cell.f is formula (if any)
  // If the student saved with cached values (Excel always does), .v is populated.
  if (cell.t === 'e') return { error: cell.w || cell.v || '#ERR' }; // Excel error
  const v = cell.v;
  if (v === undefined || v === null) return null;
  if (typeof v === 'number') return v;
  const parsed = Number(v);
  return isNaN(parsed) ? null : parsed;
}

function cellsMatch(expected, actual) {
  if (actual === null || actual === undefined) return false;
  if (typeof actual === 'object' && actual.error) return false;
  if (expected === 0) return Math.abs(actual) < 1;
  // 2% relative tolerance for reasonable rounding / scenario drift
  const rel = Math.abs((actual - expected) / expected);
  return rel <= 0.02;
}

function formatNumber(v, metricName) {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'object' && v.error) return v.error;
  if (metricName === 'EPS') return v.toFixed(3);
  if (Math.abs(v) >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
  if (Math.abs(v) >= 1_000) return (v / 1_000).toFixed(1) + 'K';
  return v.toFixed(2);
}

function gradeTrial1(workbook) {
  const ws = workbook.Sheets[TRIAL_1_TARGETS.sheet];
  if (!ws) {
    throw new Error(`Worksheet "${TRIAL_1_TARGETS.sheet}" not found. Did you rename the tab?`);
  }

  const cellChecks = [];
  let passCount = 0;
  let totalCount = 0;

  for (const metric of TRIAL_1_TARGETS.metrics) {
    for (let yi = 0; yi < TRIAL_1_TARGETS.years.length; yi++) {
      const col = TRIAL_1_TARGETS.yearColumns[yi];
      const year = TRIAL_1_TARGETS.years[yi];
      const ref = `${col}${metric.row}`;
      const expected = metric.values[yi];
      const actual = readCellValue(ws, ref);
      const pass = cellsMatch(expected, actual);

      cellChecks.push({
        metric: metric.name,
        year,
        cell: ref,
        expected: formatNumber(expected, metric.name),
        actual: formatNumber(actual, metric.name),
        pass,
      });
      totalCount++;
      if (pass) passCount++;
    }
  }

  const percent = Math.round((passCount / totalCount) * 100);

  return {
    score: passCount,
    total: totalCount,
    percent,
    cellChecks,
  };
}

// ------------------------------------------------------------
// Claude API call — generate Yoda-voice feedback
// ------------------------------------------------------------
async function getYodaFeedback(gradeResult) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Gracefully fall back to a canned response if no API key configured yet
    return {
      yodaVerdict: canned(gradeResult.percent),
      overallAssessment: `You scored ${gradeResult.score} of ${gradeResult.total} (${gradeResult.percent}%) on the cell-by-cell check. Set ANTHROPIC_API_KEY in Vercel to unlock personalized feedback from Master Yoda.`,
      strengths: [],
      improvements: [],
    };
  }

  // Build a compact summary for the model
  const passing = gradeResult.cellChecks.filter(c => c.pass);
  const failing = gradeResult.cellChecks.filter(c => !c.pass);

  // Group failures by metric for pattern detection
  const failuresByMetric = {};
  for (const c of failing) {
    if (!failuresByMetric[c.metric]) failuresByMetric[c.metric] = [];
    failuresByMetric[c.metric].push(`${c.year} (${c.cell}): expected ${c.expected}, got ${c.actual}`);
  }

  const passByMetric = {};
  for (const c of passing) {
    passByMetric[c.metric] = (passByMetric[c.metric] || 0) + 1;
  }

  const summary = [
    `Student scored ${gradeResult.score}/${gradeResult.total} cells correct (${gradeResult.percent}%).`,
    ``,
    `METRICS PASSING (out of 5 forecast years each):`,
    ...Object.keys(passByMetric).map(m => `  - ${m}: ${passByMetric[m]}/5 years correct`),
    ``,
    `METRICS WITH ERRORS:`,
    ...Object.entries(failuresByMetric).map(([m, errs]) => `  - ${m}: ${errs.length} failures\n     ${errs.slice(0, 2).join('\n     ')}`),
  ].join('\n');

  const anthropic = new Anthropic({ apiKey });

  const systemPrompt = `You are Master Yoda from Star Wars, but you are teaching financial modeling at a Stanford-caliber academy. You speak in Yoda's signature object-subject-verb inverted syntax ("Strong with the force, you are", "Patience, you must have", "Hmmm"). You are WISE and KIND — a master teacher who gives specific, actionable pedagogical feedback. You are NOT silly or cartoonish. You give real substantive critique of a student's financial model while maintaining Yoda's voice.

You must respond ONLY with valid JSON matching this exact schema — no preamble, no markdown code fences:
{
  "yodaVerdict": "A 3-4 sentence Yoda-voice review of their work. Specific about what they did well and what needs work. End with an encouraging or wise line.",
  "overallAssessment": "A 2-3 sentence assessment IN PLAIN ENGLISH (not Yoda voice). Direct pedagogical feedback about the quality of the work.",
  "strengths": ["specific plain-English bullet", "another specific bullet"],
  "improvements": ["specific plain-English bullet about what to fix", "another specific bullet"]
}

Rules:
- yodaVerdict must be Yoda voice (inverted syntax, "hmmm", etc.)
- overallAssessment, strengths, improvements must be PLAIN ENGLISH — clear, actionable feedback from a finance teacher
- Make bullets specific to the actual metrics that passed/failed
- If a whole metric line failed, suggest what likely went wrong (e.g., if Revenue is wrong across all years, the market model or pricing calc is off)
- If only one year of a metric fails, suggest a one-year formula issue (e.g., 2006 only — might be using wrong base year)
- 2-4 strengths and 2-4 improvements`;

  const userMessage = `Here are the grading results for a student's Trial I submission (Netflix operating model and six-line cash flow for 2006E–2010E):

${summary}

Generate the feedback JSON.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1200,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const text = response.content[0].text.trim();
  // Strip any accidental code fences
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // If parsing fails, return the raw text as the verdict
    return {
      yodaVerdict: text,
      overallAssessment: `You scored ${gradeResult.score}/${gradeResult.total}.`,
      strengths: [],
      improvements: [],
    };
  }
}

function canned(pct) {
  if (pct >= 90) return "Exceptional, your work is. Strong with the financial force, you have become. Proud, I am.";
  if (pct >= 70) return "Solid foundation, you have built. Refinements needed, yes — but on the path, you are. Continue you must.";
  if (pct >= 40) return "Effort, I see. But clouded, your model still is. Return to the codex, and the trial again attempt.";
  return "Difficult, this was. But learn from errors, every Jedi must. Rise again, and stronger you will become.";
}

// ------------------------------------------------------------
// Main handler
// ------------------------------------------------------------
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileBase64, trial } = req.body || {};
    if (!fileBase64) {
      return res.status(400).json({ error: 'Missing fileBase64 in request body' });
    }
    if (trial && Number(trial) !== 1) {
      return res.status(400).json({ error: 'Only Trial 1 grading is currently implemented' });
    }

    const buffer = Buffer.from(fileBase64, 'base64');
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(413).json({ error: 'File too large (max 10MB)' });
    }

    let workbook;
    try {
      workbook = XLSX.read(buffer, { type: 'buffer' });
    } catch (e) {
      return res.status(400).json({ error: `Could not read the .xlsx file. ${e.message}` });
    }

    const grade = gradeTrial1(workbook);
    const yoda = await getYodaFeedback(grade);

    return res.status(200).json({
      ...grade,
      ...yoda,
    });
  } catch (err) {
    console.error('Grade handler error:', err);
    return res.status(500).json({
      error: err.message || 'Unexpected grading error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }
}
