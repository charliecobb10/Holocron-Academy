# Holocron Academy

A Stanford-curriculum financial modeling academy, guided by Master Yoda. Six trials, from the first operating model to the full leveraged buyout. Each trial contains a lesson PDF, a ten-question quiz, a case, and a live AI-graded Excel submission.

**v1 scope:** Trial I (Netflix, 2005) is fully built end-to-end. Trials II–VI are scaffolded as "coming soon" with release roadmap.

---

## What's in the box

```
holocron-academy/
├── index.html              # Landing page
├── trial-1.html            # Trial I — Netflix (fully interactive)
├── trial-2.html … trial-6.html    # Scaffolded future trials
├── assets/
│   ├── styles.css          # Core stylesheet (dark Jedi theme)
│   ├── starfield.js        # Decorative animated starfield
│   ├── quiz.js             # Trial I quiz questions + Yoda lines
│   └── app.js              # Step navigation, quiz engine, upload + grading
├── downloads/
│   ├── trial-1-note.pdf    # Basic Financial Models lesson (22 pages)
│   ├── trial-1-case.pdf    # Netflix case (13 pages)
│   └── trial-1-template.xlsx   # Blank student template
├── api/
│   └── grade.js            # Vercel serverless grading function
├── vercel.json
├── package.json
└── .env.example
```

---

## Deploy to Vercel — 5 minutes

### 1. Get an Anthropic API key

- Go to [console.anthropic.com](https://console.anthropic.com/settings/keys)
- Create a key (free, starts with `sk-ant-`)
- Add $5 of credits under Billing. This covers hundreds of grading sessions.

### 2. Push to GitHub

```bash
cd holocron-academy
git init
git add .
git commit -m "Initial Holocron Academy build"

# Create an empty repo on github.com, then:
git remote add origin https://github.com/YOUR-USERNAME/holocron-academy.git
git push -u origin main
```

### 3. Deploy on Vercel

- Go to [vercel.com/new](https://vercel.com/new)
- Import your GitHub repo
- Leave framework preset as "Other" (it's a static site + serverless function — no build step needed)
- Before the first deploy, click **Environment Variables** and add:
  - Name: `ANTHROPIC_API_KEY`
  - Value: your `sk-ant-...` key
- Click **Deploy**

You'll get a URL like `https://holocron-academy-xxx.vercel.app`. That's your shareable link.

### 4. (Optional) Custom domain

In the Vercel dashboard, under your project → Settings → Domains, add a custom domain you own (e.g. `holocron.yourdomain.com`). Updates propagate in a few minutes.

---

## Local development

```bash
npm install
npm install -g vercel
vercel dev
```

Create a `.env.local` file with your `ANTHROPIC_API_KEY` for local grading to work.

---

## How grading works

When a student uploads a completed `.xlsx`:

1. The file is sent (base64-encoded) to `/api/grade`
2. The function reads the `Model` sheet and extracts **40 target cells**: 5 forecast years × 8 key metrics (Revenue, Gross Margin, EBIT, Net Income, EPS, EBITDA, CFF, FCF)
3. Each cell is compared against the answer key with a **2% relative tolerance** for rounding
4. The grade summary (pass/fail per cell, clustered by metric) is sent to the Claude API with a Yoda-voice system prompt
5. Claude returns structured JSON: Yoda-voice verdict, plain-English assessment, specific strengths and improvements
6. The frontend renders the full verdict card with a cell-by-cell table

**If the API key is missing** the grading still works — students get the cell-by-cell check and a canned Yoda quote. The AI feedback gracefully degrades.

### Model used

`claude-sonnet-4-6` — good balance of creative voice (Yoda syntax is harder than it looks) and cost. If you want to change it, see the `model` parameter in `api/grade.js`.

---

## Adding future trials

Each trial follows the same four-step pattern as Trial I. To add Trial II (Ideko):

1. Generate a blank template from `02_Ideko_v3.xlsx` by stripping formulas (see the script that built `trial-1-template.xlsx`)
2. Convert `02_Integrated_Financial_Statements_Note.pdf` and `02_Ideko_Case.pdf` into proper PDFs if they're still zip-wrapped scans
3. Write 10 new quiz questions in `assets/quiz.js` (add `TRIAL_2_QUIZ`)
4. Replace `trial-2.html` with a copy of `trial-1.html` adjusted for Ideko
5. Add a new answer-key block `TRIAL_2_TARGETS` in `api/grade.js` and branch on the `trial` parameter

---

## Notes

- Star Wars theming is original — no Lucasfilm logos, film stills, or licensed imagery are used
- Yoda character references are homage/educational use for a personal learning project
- Course material PDFs are the user's own files (Stanford GSB, copyright Board of Trustees of Leland Stanford Junior University); they're included as downloads so the site is self-contained
- The app stores no user data — all state lives in memory for the current session
