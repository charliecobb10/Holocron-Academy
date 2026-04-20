// Trial I — Quiz Questions
// 10 mixed-format questions testing concepts from the Basic Financial Models note.
// Each question has one correct answer. "feedback" = Yoda-voice explanation.

window.TRIAL_1_QUIZ = [
  {
    q: "You're building an operating model for a cruise line. Which is the most appropriate primary revenue driver?",
    opts: [
      "Market share of total global vacation spending",
      "Number of ships × passenger capacity × utilization × average ticket price",
      "Projected GDP growth × industry penetration rate",
      "Historical five-year revenue CAGR extrapolated forward"
    ],
    correct: 1,
    feedback: "When volume depends on physical assets deployed — ships, stores, aircraft — the model begins with asset count and ramp-up, not market share. Judge, you must, what drives the business. A cruise line without ships, nothing it is."
  },
  {
    q: "The course note describes three common approaches to projecting COGS. Which of the following is NOT one of them?",
    opts: [
      "Projecting gross margin percentage directly",
      "Modeling cost per unit multiplied by unit sales",
      "Splitting COGS into commodity-exposed and non-commodity buckets",
      "Regressing historical COGS against prior-year R&D expense"
    ],
    correct: 3,
    feedback: "Three approaches, there are: margin-direct, cost-per-unit, and commodity-split. R&D regression, useful it is not — unrelated, these things are. Remember: modeling choice follows business logic, not statistical fishing."
  },
  {
    q: "An expense category starts 2006 with a 50/50 fixed-variable split. Fixed costs grow with ~2.5% inflation; variable costs grow with sales at ~15%. By 2010, what is true about the ratio?",
    opts: [
      "Still 50/50 — the categorization doesn't change over time",
      "Variable has grown to a larger share, because sales outpaced inflation",
      "Fixed has grown to a larger share, because it compounds over more years",
      "Depends on the effective tax rate in the intervening years"
    ],
    correct: 1,
    feedback: "Yes. The initial split holds only in the first year. Grow at different rates, the two components do — so drift, the ratio must. Mindful of this, you will be, when forecasting several years forward."
  },
  {
    q: "A rapidly growing airline reports $117M of D&A and $1,124M of net CapEx in the same year. What does this tell you about modeling D&A for the forecast?",
    opts: [
      "Safe it is to assume D&A ≈ CapEx — a convenient simplification",
      "Model D&A as a flat percentage of revenue",
      "Build an explicit schedule: depreciate existing PP&E plus depreciate new CapEx by useful life",
      "Use a regression of D&A on EBITDA to project forward"
    ],
    correct: 2,
    feedback: "For a mature company — American Airlines, say — D&A ≈ CapEx works, yes. But for the rapidly growing — Jet Blue, this airline is — the assumption breaks. An explicit schedule you must build: old assets depreciate out, new CapEx depreciate in."
  },
  {
    q: "Among these operating expense categories, which is typically the MOST variable with sales?",
    opts: [
      "G&A (general and administrative)",
      "Marketing",
      "Legal expense",
      "Depreciation and amortization"
    ],
    correct: 1,
    feedback: "Marketing, strongly variable it tends to be — scales with sales volume directly. G&A, largely fixed. Legal, activity-driven but unrelated to sales. D&A, driven by CapEx history. Know your cost structure, you must."
  },
  {
    q: "In the six-line cash flow, the correct relationship between Cash Flow for Financing (CFF) and Free Cash Flow (FCF) is:",
    opts: [
      "CFF = FCF − After-tax Interest Expense",
      "CFF = FCF + Capital Expenditures",
      "FCF = CFF − Increase in Net Debt",
      "FCF = CFF + Taxes paid"
    ],
    correct: 0,
    feedback: "Correct. FCF is unlevered — available to all investors, before capital structure decisions. Subtract after-tax interest from FCF, CFF you get — the discretionary cash for debt paydown, dividends, or repurchases. Then add net-debt changes for FCFE."
  },
  {
    q: "Net Working Capital is correctly defined as:",
    opts: [
      "Current Assets minus Long-term Liabilities",
      "Cash + A/R + Inventory − Total Debt",
      "A/R + Inventory + Other Current Assets − A/P − Other Current Liabilities",
      "A/P + Accrued Liabilities − Cash"
    ],
    correct: 2,
    feedback: "The operating definition of working capital, this is — capital tied up in running the business. Cash and debt, excluded they are — those belong to the financing decision, not operations."
  },
  {
    q: "Netflix's Working Capital as a percent of Sales is approximately NEGATIVE 9%. What best explains why a subscription business can run negative NWC?",
    opts: [
      "Subscribers prepay — deferred revenue acts like an interest-free loan from customers",
      "Massive accounts-receivable balances offset inventory",
      "CapEx requirements are unusually high",
      "Interest income on cash balances reduces NWC"
    ],
    correct: 0,
    feedback: "Wise observation. Money from subscribers, Netflix collects in advance. A loan at zero interest, this effectively is — and grows with the business. A gift of working capital, you might say. Hmmm."
  },
  {
    q: "Which of these most accurately describes MAINTENANCE CapEx?",
    opts: [
      "Always zero for mature businesses",
      "A fixed percentage of revenue set by industry convention",
      "Approximately equal to depreciation expense, plus some inflation adjustment",
      "Equal to expansionary CapEx divided by two"
    ],
    correct: 2,
    feedback: "Maintenance CapEx replaces the worn and retired. Roughly equal to depreciation, it should be — at current replacement cost, meaning inflation-adjusted. Expansionary CapEx, the growth portion on top of that is."
  },
  {
    q: "In the Netflix model, the 'Base' case forecasts Netflix reaching 7.5% of DVD households by 2010, while 'Aggressive' reaches 11.0%. Holding all other assumptions equal, the Aggressive scenario will produce:",
    opts: [
      "Lower Revenue but higher EBIT margin",
      "Higher Revenue, higher EBITDA, and higher Cash Flow for Financing",
      "Higher Revenue but lower Net Income due to scaling costs",
      "Identical cash flow — penetration only shifts the revenue mix"
    ],
    correct: 1,
    feedback: "More subscribers, more revenue — and with variable costs scaling but meaningful fixed-cost leverage, more operating profit too. This, a sensitivity exercise you will run in the real model. Feel the leverage of scale, you will."
  }
];

// Yoda voice lines for various moments
window.YODA_LINES = {
  onLoadStudy: [
    "Read the codex, you must. Patience, the mark of a Jedi it is.",
    "Knowledge before action. The way of the model, this is."
  ],
  onPassQuiz: [
    "Strong in the force of finance, you have become.",
    "Ready, you are. The case awaits.",
    "Impressive. Most impressive. Hmmm."
  ],
  onFailQuiz: [
    "Clouded, your understanding still is. Return to the codex, you must.",
    "Much to learn, you still have. Rise again, you will.",
    "Fail, you have — but only if you stop, truly fail you do."
  ],
  grading: [
    "Reading your work, I am...",
    "Cell by cell, the model I examine...",
    "Hmm. Patience. Judgment, I form..."
  ]
};
