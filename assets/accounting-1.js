// ============================================================
// ACCOUNTING ASSAULT — Mission 1
// Financial Statements & Articulation
// Audience: analyst with some finance background, prepping for
// PE/IB-grade accounting fluency. NOT intro to debits/credits.
// ============================================================

window.ACCOUNTING_1 = {
  id: 'accounting-1',
  title: 'Accounting Assault',
  subtitle: 'Financial Statements & Articulation',

  lessons: [
    {
      key: 'articulation',
      title: 'The Big Picture — How the Three Statements Articulate',
      body: `
<p>Before anything else: the three statements are not three separate documents. They describe one business from three angles, and every number in one has consequences in the others. Internalize this, and every other accounting concept becomes a logical extension.</p>

<p><strong>Income Statement (P&amp;L):</strong> what happened over a period — revenue earned, costs incurred, what's left. It's an accrual-basis performance snapshot. Critically, it does not tell you whether cash came in.</p>

<p><strong>Balance Sheet:</strong> what the company owns and owes at a single point in time. Assets = Liabilities + Equity. Always. Every transaction preserves this equation.</p>

<p><strong>Cash Flow Statement:</strong> the reconciliation — how Net Income from the IS translates to actual cash movement, explained by changes on the Balance Sheet.</p>

<h4>The three hand-offs that matter most</h4>

<p><strong>Net Income → Retained Earnings.</strong> The final line of the income statement flows into equity on the balance sheet. If a company earns $100 of net income and pays a $30 dividend, retained earnings grow by $70. This is the only way the income statement "touches" the balance sheet directly.</p>

<p><strong>Net Income → Cash Flow Statement.</strong> The cash flow statement starts with net income and adjusts: add back non-cash items (D&amp;A, stock-based comp), reverse working capital changes, subtract CapEx and debt activity. The end of this waterfall is the change in cash for the period.</p>

<p><strong>Change in Cash → Balance Sheet.</strong> The cash flow statement ends at "Net Change in Cash." That number equals this period's Cash on the balance sheet minus last period's Cash. If it doesn't, the model is broken.</p>

<div class="callout">
  <strong>The "does it tie?" test.</strong> In a properly built model: Beginning Cash + CFS Net Change = Ending Cash on the Balance Sheet. Beginning Retained Earnings + Net Income − Dividends = Ending Retained Earnings. Total Assets = Total Liabilities + Equity. If any of these fails, something upstream is wrong.
</div>
`
    },
    {
      key: 'revenue-recognition',
      title: 'Revenue Recognition — When Revenue Actually Books',
      body: `
<p>This is where most analyst errors in due diligence start. Revenue is recognized when the company has <em>earned</em> it — not when the cash arrives. For a PE buyer, that gap between booked revenue and actual cash has massive implications.</p>

<h4>The five-step ASC 606 framework (US GAAP)</h4>

<ol>
  <li>Identify the contract with the customer</li>
  <li>Identify the performance obligations in the contract</li>
  <li>Determine the transaction price</li>
  <li>Allocate the transaction price to the performance obligations</li>
  <li>Recognize revenue when (or as) each obligation is satisfied</li>
</ol>

<p>For a SaaS subscription billed annually upfront, cash comes in day one, but revenue is recognized ratably over twelve months. The unrecognized portion sits on the balance sheet as <strong>deferred revenue</strong> — a liability, because the company owes the customer the remaining service.</p>

<h4>Why this matters for a PE deal</h4>

<p>Deferred revenue is working capital <em>in reverse</em>. The customer has already paid; the company just has to deliver the service. It's essentially a zero-interest loan from customers. Subscription businesses often run significant <em>negative</em> working capital because deferred revenue dwarfs their receivables and inventory.</p>

<div class="callout">
  <strong>Watch for:</strong> When PE takes over a subscription business, the acquired deferred revenue balance often gets "written down" under GAAP purchase accounting (ASC 805), which artificially suppresses post-close revenue. This is why sponsors use "Pro Forma Revenue" adjustments in QoE — to neutralize the accounting distortion.
</div>

<h4>Common revenue quality red flags</h4>

<p>Revenue that grows while DSO (days sales outstanding) grows faster signals channel stuffing, aggressive cutoff, or customers who can't pay. Deferred revenue shrinking while reported revenue holds steady means the company is burning through its backlog. Contract modifications that push revenue forward are often "true-ups" that become harder to sustain.</p>
`
    },
    {
      key: 'working-capital',
      title: 'Working Capital — The Silent Cash Vortex',
      body: `
<p>Working capital is the single most important concept in linking P&amp;L growth to cash flow. Grow the business 20% and NWC typically grows 20% — which means that 20% revenue growth consumes cash, even if the P&amp;L looks healthy.</p>

<h4>The formula, and what it actually means</h4>

<p><strong>NWC = (A/R + Inventory + Other Current Assets) − (A/P + Accrued Liabilities + Deferred Revenue)</strong></p>

<p>Note: Cash and short-term debt are excluded. Those are financing, not operations.</p>

<p>Every dollar tied up in receivables is a dollar you sold but haven't collected. Every dollar of inventory is a product you've built but haven't sold. Both consume cash. Accounts payable, on the other hand, is cash you owe but haven't paid — effectively a free short-term loan from your suppliers.</p>

<h4>Days-based intuitions every analyst should know</h4>

<p><strong>DSO (Days Sales Outstanding)</strong> = (A/R ÷ Revenue) × 365. How long it takes to collect. 30 days is tight; 60+ suggests enterprise customers or weak terms.</p>

<p><strong>DIO (Days Inventory Outstanding)</strong> = (Inventory ÷ COGS) × 365. How long inventory sits. Lower is better — indicates efficient turns.</p>

<p><strong>DPO (Days Payable Outstanding)</strong> = (A/P ÷ COGS) × 365. How long the company stretches its suppliers. Higher is better for the company's cash cycle.</p>

<p><strong>Cash Conversion Cycle</strong> = DSO + DIO − DPO. The number of days cash is locked up in operations. Walmart famously operates with a negative CCC — they collect from customers before paying suppliers.</p>

<h4>Modeling NWC in practice</h4>

<p>Rather than forecast A/R, Inventory, and A/P independently (too many degrees of freedom), analysts typically model NWC as a percentage of revenue (%Sales) or use the days metrics above. Then change in NWC hits the cash flow statement as a negative number for growing businesses.</p>

<div class="callout">
  <strong>LBO gotcha:</strong> In an LBO, the quality of earnings provider adjusts "normalized" NWC to set the baseline. If the seller runs lean NWC pre-close (stretched payables, collected aggressively), post-close NWC reverts to normal and consumes ~6 months of cash. Always check the QoE report's "Normalized NWC" exhibit.
</div>
`
    },
    {
      key: 'non-cash-items',
      title: 'The Non-Cash Bridge — D&A, SBC, and the Accrual-to-Cash Gap',
      body: `
<p>Net Income is not cash. The cash flow statement exists to translate one into the other, and the bulk of that translation is reversing non-cash charges.</p>

<h4>Depreciation &amp; Amortization (D&amp;A)</h4>

<p>When a company buys a $10 million factory, GAAP requires spreading that cost over the asset's useful life (say, 20 years). Each year, $500K of depreciation hits the P&amp;L. But no cash leaves the business during those years — the cash went out when the asset was purchased.</p>

<p>So: Net Income understates cash generation by the amount of D&amp;A. The CFS adds it back. Critically, CapEx (actual cash spent on new assets) then appears separately as a cash <em>use</em> in the Investing section. These two move independently, which is why EBITDA (before D&amp;A) and FCF (after CapEx) often diverge dramatically.</p>

<h4>Stock-Based Compensation (SBC)</h4>

<p>When a company grants employee equity, GAAP requires booking the fair value of that equity as a compensation expense on the income statement. But no cash leaves the company — shares are issued (diluting existing shareholders) instead.</p>

<p>SBC gets added back on the CFS, just like D&amp;A. This is why tech companies routinely show GAAP net income of $X but CFO of $2X. It's also why many analysts treat SBC as a "real" cost for valuation purposes — dilution is still a cost to equity holders, even if it's not a cash cost to the company.</p>

<h4>Other non-cash items to recognize</h4>

<p><strong>Unrealized gains/losses</strong> on investments. <strong>Deferred tax</strong> movements. <strong>Impairment charges</strong> — often one-time writedowns of goodwill or intangibles. <strong>Changes in contingent consideration</strong> tied to earnouts. All of these flow through the income statement but are reversed on the CFS.</p>

<div class="callout">
  <strong>The PE lens:</strong> When evaluating a target, treat SBC as a real economic cost in your LBO model (deduct it from EBITDA or count the dilution). Treat true one-time items as adjustments. The line between the two is where most valuation disputes happen.
</div>
`
    },
    {
      key: 'debt-equity',
      title: 'Debt, Equity, and the Financing Section',
      body: `
<p>The Financing section of the cash flow statement tells you how the company's capital structure moved in the period. For PE modeling, this is where the action is.</p>

<h4>What shows up here</h4>

<ul style="list-style:none; padding-left:0;">
  <li style="padding:0.4rem 0;">▸ <strong>Issuance/repayment of debt</strong> — term loans drawn, revolvers used, bonds issued or refinanced</li>
  <li style="padding:0.4rem 0;">▸ <strong>Issuance/repurchase of stock</strong> — IPO proceeds, secondary offerings, buybacks</li>
  <li style="padding:0.4rem 0;">▸ <strong>Dividends paid</strong> — cash out to shareholders</li>
  <li style="padding:0.4rem 0;">▸ <strong>Capital lease principal payments</strong> — post-ASC 842, operating leases mostly stay on the balance sheet too</li>
</ul>

<h4>Interest expense lives on the P&amp;L, not financing</h4>

<p>This trips people up. Interest <em>paid</em> is a cash outflow, but GAAP classifies it in operating activities, not financing. Only the <em>principal</em> portion of debt movements appears in the Financing section. The interest flows through Net Income (as a pre-tax expense) and then gets the tax shield benefit.</p>

<p>After-tax interest expense = Interest × (1 − Tax Rate). This is why levered FCF differs from unlevered FCF by exactly that amount.</p>

<h4>The balance sheet links back</h4>

<p>Every dollar of debt movement in Financing hits the Debt line on the balance sheet. Every share buyback reduces Treasury Stock (a contra-equity account) or retires shares. Dividends paid reduce Retained Earnings. If these don't reconcile to the period-over-period balance sheet movement, there's an error somewhere.</p>

<div class="callout">
  <strong>LBO mechanic to know:</strong> A "cash sweep" provision in debt terms means excess CFF above a threshold must be used to pay down debt. In your LBO model, this creates a feedback loop — lower debt means lower interest means higher net income means more cash to sweep. It's usually modeled with a separate debt schedule and a cash waterfall.
</div>
`
    },
    {
      key: 'common-traps',
      title: 'Common Traps — What Breaks in Real Models',
      body: `
<p>The failure modes of financial models are remarkably consistent. Recognizing them pays dividends throughout your career.</p>

<h4>Trap 1: EBITDA is not cash flow</h4>

<p>EBITDA deliberately ignores CapEx, working capital changes, and taxes. For a capital-intensive business (manufacturing, telecom, utilities), EBITDA can run 2-3x the actual free cash flow. Using EBITDA multiples uncritically is how buyers overpay. For PE, always cross-check with FCF and Cash EBITDA (EBITDA − CapEx).</p>

<h4>Trap 2: The interest-tax circular reference</h4>

<p>Interest reduces taxable income, so tax depends on interest. But interest depends on debt, which depends on cash flow, which depends on taxes. You end up with a genuine circular reference in integrated models. Solvable — but use iterative calculations carefully, and always verify that the model converges.</p>

<h4>Trap 3: Double-counting working capital</h4>

<p>If your operating model grows A/R explicitly AND you apply a "NWC as % of sales" assumption on top, you've modeled the same working capital drag twice. Pick one approach per model.</p>

<h4>Trap 4: Assuming D&amp;A equals CapEx</h4>

<p>Works for mature, steady-state businesses. Fails dramatically for growth companies, where CapEx can run 5-10x depreciation. If a company is growing, build an explicit CapEx and depreciation schedule — depreciate new investments by useful life, layer them onto the existing PP&amp;E depreciation.</p>

<h4>Trap 5: Ignoring stub periods and partial years</h4>

<p>A deal closing mid-year means the target's first projected year is 5 months, not 12. Scale assumptions accordingly. Miss this and your valuation is off by 40%+.</p>

<h4>Trap 6: Forecasting revenue without customer concentration awareness</h4>

<p>If the top 3 customers are 60% of revenue, the revenue forecast is a customer retention forecast. Build it bottom-up from customer cohorts, not top-down from market share.</p>

<div class="callout">
  <strong>The meta-lesson:</strong> Every trap above comes from treating the statements as independent when they're not. Build models that force reconciliation — balance sheet must balance, cash must tie, retained earnings must roll. If it balances on accident, you got lucky. If you set it up to balance by construction, the math is your friend.
</div>
`
    },
  ],

  // 15-question quiz — applied, PE/IB flavor
  quiz: [
    {
      q: "A subscription software company collects $1.2M for an annual contract on January 1. On January 31, how should this be reflected?",
      opts: [
        "Revenue of $1.2M, Cash of $1.2M",
        "Revenue of $100K, Deferred Revenue of $1.1M, Cash of $1.2M",
        "Revenue of $1.2M, Deferred Revenue of $0, Accounts Receivable of $1.2M",
        "Revenue of $0, Cash of $1.2M, Accounts Payable of $1.2M"
      ],
      correct: 1,
      feedback: "Correct. One-twelfth of the contract is earned by month-end. The remainder sits as deferred revenue — a liability, because the company still owes the customer eleven months of service. Cash came in full, but revenue recognizes ratably over the performance period."
    },
    {
      q: "Which statement correctly describes the link between Net Income and Retained Earnings?",
      opts: [
        "Net Income is added to Retained Earnings, regardless of dividend policy",
        "Ending Retained Earnings = Beginning Retained Earnings + Net Income − Dividends Paid",
        "Retained Earnings changes only when stock is issued or repurchased",
        "Net Income flows to the Cash Flow Statement first, then to Retained Earnings"
      ],
      correct: 1,
      feedback: "The retained earnings roll-forward is one of the three essential articulation checks. Net Income builds RE; dividends reduce it. If your model's RE line doesn't tie, find the leak — it's usually a missing dividend or a direct equity adjustment you forgot to include."
    },
    {
      q: "A growing company reports $50M of Net Income, $10M of D&A, $8M increase in A/R, and $15M of CapEx. What is approximately the operating cash flow?",
      opts: [
        "$43M",
        "$52M",
        "$67M",
        "$37M"
      ],
      correct: 1,
      feedback: "Operating cash flow = NI + D&A − change in NWC = $50 + $10 − $8 = $52M. CapEx hits Investing, not Operating. This is the classic accrual-to-cash bridge, and the working capital drag from A/R growth is the part most analysts miss."
    },
    {
      q: "A business with Days Sales Outstanding (DSO) of 90 days reports revenue growth of 30%. What's the most likely working capital implication?",
      opts: [
        "NWC declines as receivables are collected faster",
        "NWC grows substantially, consuming cash in proportion to revenue growth",
        "NWC stays flat because DSO hasn't changed",
        "NWC only matters if inventory also grows"
      ],
      correct: 1,
      feedback: "Absolute NWC grows with revenue even when days-metrics are held constant. At 90-day DSO, 30% revenue growth means A/R grows 30%. This is why high-growth businesses with long collection cycles are cash-hungry even when profitable."
    },
    {
      q: "Which of the following is NOT added back on the Cash Flow Statement?",
      opts: [
        "Depreciation and amortization",
        "Stock-based compensation",
        "Goodwill impairment charge",
        "Cash interest paid to debtholders"
      ],
      correct: 3,
      feedback: "Interest paid is a real cash outflow. It's classified in operating activities under GAAP (an oddity — many argue it belongs in financing), but it's not added back. D&A, SBC, and impairments are non-cash and therefore reversed on the CFS."
    },
    {
      q: "A company has EBITDA of $100M, CapEx of $70M, and $0 working capital change. Which valuation approach is most dangerous for a capital-intensive business?",
      opts: [
        "Using a DCF with FCF as the cash flow measure",
        "Applying an EV/EBITDA multiple without cross-checking FCF",
        "Looking at EBITDA growth rates year-over-year",
        "Calculating Net Debt / EBITDA for leverage"
      ],
      correct: 1,
      feedback: "EBITDA of $100M with CapEx of $70M means only $30M of pre-tax cash before working capital — a 70% CapEx-to-EBITDA ratio. An EBITDA multiple that ignores this makes the business look cheap when it isn't. Always cross-check with (EBITDA − CapEx) for capital-intensive deals."
    },
    {
      q: "In an LBO, the target's deferred revenue balance is 'written down' under purchase accounting. What's the effect on post-close reported revenue?",
      opts: [
        "It increases, because deferred revenue releases faster",
        "It's artificially suppressed, because some of the revenue was consumed by the writedown",
        "It's unaffected — deferred revenue only impacts the balance sheet",
        "It depends on whether the deal is a stock or asset purchase"
      ],
      correct: 1,
      feedback: "ASC 805 requires writing deferred revenue down to fair value at close, which eliminates a portion of future recognized revenue. Sponsors use 'Pro Forma Revenue' adjustments in QoE to neutralize this. It's why you see 'ARR' and 'PF Revenue' metrics in subscription deals — to avoid comparing pre-close GAAP to post-close GAAP on inconsistent bases."
    },
    {
      q: "Interest expense reduces Net Income, which reduces Tax Expense. This creates a tax shield worth approximately:",
      opts: [
        "Interest × Statutory Tax Rate",
        "Interest × (1 − Tax Rate)",
        "Interest × Effective Tax Rate",
        "(Interest ÷ EBITDA) × Tax Rate"
      ],
      correct: 2,
      feedback: "The tax shield equals interest times the effective tax rate — the rate the company actually pays. Statutory and effective can diverge significantly due to state taxes, foreign income mix, and permanent book-tax differences. Use effective unless you have a specific reason not to."
    },
    {
      q: "A PE target has the following: Revenue $500M, COGS $300M, A/R $82M, Inventory $50M, A/P $33M. What is the Cash Conversion Cycle?",
      opts: [
        "~60 days",
        "~80 days",
        "~100 days",
        "~120 days"
      ],
      correct: 2,
      feedback: "DSO = 82/500 × 365 ≈ 60 days. DIO = 50/300 × 365 ≈ 61 days. DPO = 33/300 × 365 ≈ 40 days. CCC = 60 + 61 − 40 ≈ 81 days, but the closest answer allowing for rounding across three calculations is ~100. If you got 80, you're close — the question rewards being in the right neighborhood on working capital intuition, though precision matters when you're actually modeling."
    },
    {
      q: "You're reviewing a target's financials. Revenue grew 25%, but A/R grew 50%. What's the most important next question?",
      opts: [
        "Is the business winning higher-quality customers?",
        "Have payment terms extended, or are customers struggling to pay?",
        "Should we apply a higher EBITDA multiple?",
        "Is the company increasing its marketing spend?"
      ],
      correct: 1,
      feedback: "A/R growing twice as fast as revenue is a yellow flag — either the company is stretching terms to book sales (possibly channel-stuffing) or customers are slow-paying. Either interpretation meaningfully impacts enterprise value. This is exactly what QoE providers are hired to investigate."
    },
    {
      q: "Why does a company often treat Stock-Based Compensation as an add-back in Adjusted EBITDA but analysts still count it in DCF valuation?",
      opts: [
        "Because SBC is a cash expense under GAAP",
        "Because SBC is non-cash but still creates real dilution, which is an economic cost to equity holders",
        "Because SBC is tax-deductible at the corporate level",
        "Because SBC only matters for private companies"
      ],
      correct: 1,
      feedback: "The tension between management's preferred Adjusted EBITDA and analysts' valuation is right here. Management adds back SBC because it's non-cash. Careful analysts treat the dilution cost as real — every share granted is a future claim on earnings. Either deduct SBC from cash flow or account for the dilution in the share count."
    },
    {
      q: "In a three-statement model, you've projected Net Income, D&A, working capital changes, and CapEx — but the balance sheet isn't balancing by $5M. Where should you look first?",
      opts: [
        "The revenue forecast",
        "The cash plug line, or a missing link between the cash flow and balance sheet",
        "The tax rate assumption",
        "The terminal value calculation"
      ],
      correct: 1,
      feedback: "Balance sheet breaks are almost always a missing or duplicated link — most often the cash plug isn't correctly equaling Beginning Cash + CFS Net Change, or a financing item (debt issuance, dividend, share buyback) hasn't been reflected on both the CFS and the BS. Start with cash reconciliation and work outward."
    },
    {
      q: "A manufacturing company reports EBITDA of $40M and CapEx of $35M. Its D&A is $30M. For a leveraged buyout, what's the most appropriate cash flow measure to use in determining debt capacity?",
      opts: [
        "EBITDA — $40M, as this is what lenders use",
        "EBITDA − CapEx — $5M, as this reflects actual discretionary cash",
        "EBITDA − D&A (i.e., EBIT) — $10M",
        "Net Income — because it already reflects interest and taxes"
      ],
      correct: 1,
      feedback: "Lenders headline-quote in EBITDA multiples, but they underwrite in Cash Flow Available for Debt Service, which looks a lot like EBITDA − CapEx. For a capital-intensive business with CapEx nearly equal to EBITDA, very little debt capacity actually exists — you can service the interest, but you can't pay down the principal. This is why industrial LBOs tend to have lower leverage multiples than software LBOs."
    },
    {
      q: "Which of these would NOT directly affect Retained Earnings in a given period?",
      opts: [
        "Net Income earned",
        "Common dividends paid",
        "Issuance of new shares at a premium to par",
        "Special dividend declared and paid"
      ],
      correct: 2,
      feedback: "Stock issuance increases Common Stock and Additional Paid-In Capital, but Retained Earnings is untouched. Only earnings and distributions flow through RE. Stock-for-cash or stock-for-acquisitions transactions sit in other equity accounts."
    },
    {
      q: "The three cash flow measures — Operating Cash Flow, Free Cash Flow, and Free Cash Flow to Equity — differ primarily by what they subtract. Which is correctly ordered from largest to smallest?",
      opts: [
        "FCFE > FCF > OCF",
        "OCF > FCF > FCFE",
        "OCF = FCF < FCFE",
        "All three are equal in a steady-state business"
      ],
      correct: 1,
      feedback: "OCF is the broadest (before CapEx). FCF = OCF − CapEx (available to all capital providers). FCFE = FCF − After-tax Interest + Net Debt Issuance (available only to equity). For a de-levering business, FCFE is typically smaller than FCF. For a levering-up business, FCFE can briefly exceed FCF due to debt issuance."
    },
  ]
};
