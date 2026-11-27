import { ClusterReferenceDefinition, MacroReport } from '../types/macro';

export const CLUSTER_REFERENCE_MAP: ClusterReferenceDefinition[] = [
  {
    code: 'C1',
    name: 'Tech Hardware, Semis & DC Infra',
    proxies: 'SMH, SOXX',
    positiveCorr: '2 (Software), 3 (Discretionary), 6 (Industrials/Grid)',
    inverseCorr: '4 (Staples), 5 (Healthcare)',
    neutralOrthogonal: '7 (Commodities/Energy), 8 (Financials/Banks)',
    whatItIs: 'Chip designers, foundries, memory, WFE tools, servers, switches, optics, racks, and quantum hardware',
    coreDriver: 'Hyperscale AI CapEx, fab construction schedules, silicon cycle, risk-on liquidity',
    sampleTickers: [
      'AVGO', 'MRVL', 'NVDA', 'INTC', 'MCHP', 'QCOM', 'AMD', 'HPQ', 'STX', 'MU', 'P', 'WDC',
      'ASML', 'AEHR', 'WOLF', 'AMAT', 'ICHR', 'KLAC', 'LRCX', 'VRT', 'CSCO', 'TEL', 'ANET',
      'CIEN', 'COHR', 'FLEX', 'JBL', 'QUBT', 'RGTI', 'IONQ', 'IBM', 'QBTS',
    ],
  },
  {
    code: 'C2',
    name: 'Enterprise Software, Cloud & Cyber',
    proxies: 'IGV, WCLD',
    positiveCorr: '1 (Hardware/Semis), 3 (Digital Media)',
    inverseCorr: '4 (Staples), 7 (Commodities/Energy), 8 (Banks/Value)',
    neutralOrthogonal: '5 (Healthcare), 6 (Industrials/Grid)',
    whatItIs: 'Enterprise cloud platforms, SaaS, databases, observability, and cybersecurity architectures',
    coreDriver: '10-Yr real yields, corporate IT software budgets, ARR expansion, cloud seat migration',
    sampleTickers: [
      'FTNT', 'NOW', 'PANW', 'PLTR', 'RBRK', 'DBX', 'DOCU', 'OTEX', 'S', 'CRM', 'CRWD',
      'RNG', 'TEAM', 'ZS', 'CRWV', 'FSLY', 'RXT', 'SNOW', 'NBIS', 'AKAM', 'DDOG', 'MDB', 'NET',
    ],
  },
  {
    code: 'C3',
    name: 'Cyclical Discretionary & Media',
    proxies: 'XLY, XLC',
    positiveCorr: '1 (Tech Hardware), 6 (Logistics/Auto), 8 (FinTech/Payments)',
    inverseCorr: '4 (Staples), 5 (Healthcare), 7 (in supply shocks)',
    neutralOrthogonal: '2 (Enterprise Software)',
    whatItIs: 'Discretionary retail, autos/EVs, travel/lodging, streaming, gaming, digital ads, and telecom',
    coreDriver: 'Household real income, consumer credit/savings, discretionary ad spend, leisure travel',
    sampleTickers: [
      'BKNG', 'AAP', 'KSS', 'MGA', 'NKE', 'RIVN', 'SBUX', 'W', 'GM', 'APTV', 'AZO', 'BWA',
      'CMG', 'DECK', 'ORLY', 'RCL', 'SN', 'TJX', 'TSLA', 'NFLX', 'AMC', 'LUMN', 'RBLX',
      'SNAP', 'VZ', 'WBD', 'CMCSA', 'DIS', 'EA', 'T', 'TMUS', 'TTWO',
    ],
  },
  {
    code: 'C4',
    name: 'Defensive Consumer Staples',
    proxies: 'XLP, VDC',
    positiveCorr: '5 (Healthcare), Regulated Utilities (in 6)',
    inverseCorr: '1 (Tech Hardware), 2 (Software), 3 (Discretionary)',
    neutralOrthogonal: '7 (Commodities), 8 (Financials)',
    whatItIs: 'Essential consumer staples — packaged food, beverages, personal care, household essentials, supermarkets',
    coreDriver: 'Inelastic volume demand, pricing power over CPI, recession flight-to-safety flows',
    sampleTickers: ['COST', 'WMT', 'EL', 'KHC', 'STZ', 'TGT', 'WBA', 'CL', 'GIS', 'KO', 'MDLZ', 'MNST', 'PG'],
  },
  {
    code: 'C5',
    name: 'Defensive Healthcare & MedTech',
    proxies: 'XLV, IHI',
    positiveCorr: '4 (Staples), Regulated Utilities (in 6)',
    inverseCorr: '1 (Tech Hardware), 3 (Discretionary), 6 (Industrials)',
    neutralOrthogonal: '7 (Commodities), 8 (Banks)',
    whatItIs: 'Surgical devices, implants, diagnostics, life science tools, hospital networks, managed care payers, commercial biopharma',
    coreDriver: 'Inelastic clinical necessity, insured lives volume, aging demographics, surgical procedure growth',
    sampleTickers: [
      'LLY', 'BIIB', 'BLUI', 'ALNY', 'AMGN', 'INSM', 'VRTX', 'ISRG', 'UNH', 'DXCM', 'BAX',
      'BDX', 'DGX', 'HUM', 'TDOC', 'THC', 'ABT', 'BSX', 'DHR', 'HCA', 'IDXX', 'MCK', 'MDT', 'UHS',
    ],
  },
  {
    code: 'C6',
    name: 'Industrials, Grid & Capital Goods',
    proxies: 'XLI, XLU, PAVE',
    positiveCorr: '3 (Discretionary), 7 (Commodities), 8 (Banks/Credit)',
    inverseCorr: '2 (Software via rates), 4 (Staples), 5 (Healthcare)',
    neutralOrthogonal: '1 (Tech Hardware - except cooling/power overlap)',
    whatItIs: 'Heavy machinery, automation, freight/logistics, aerospace/defense, grid power distribution, EPC contractors, and power utilities',
    coreDriver: 'ISM Manufacturing PMI, physical infrastructure capex, power grid megawatt load growth, commercial aero backlog',
    sampleTickers: [
      'FDX', 'JBHT', 'RHI', 'ROK', 'UPS', 'CAT', 'CTAS', 'DE', 'EXPD', 'PH', 'SAIA', 'UNP',
      'VRSK', 'BA', 'LMT', 'NOC', 'RTX', 'ETN', 'RUN', 'HUBB', 'PWR', 'CEG', 'PCG', 'BE', 'NEE', 'VST',
    ],
  },
  {
    code: 'C7',
    name: 'Commodities, Energy & Materials',
    proxies: 'XLE, XLB',
    positiveCorr: '6 (Industrials), 8 (Banks in rate hikes)',
    inverseCorr: '2 (Software duration), 3 (Travel/Air), 4 (Cost-push drag)',
    neutralOrthogonal: '1 (Tech Hardware), 5 (Healthcare)',
    whatItIs: 'Upstream oil and gas (E&P), midstream pipelines, refining, oilfield services, copper/gold mining, chemicals, steel',
    coreDriver: 'OPEC+ supply policy, crude/gas crack spreads, geopolitical risk, global industrial capex, copper electrification',
    sampleTickers: [
      'XOM', 'HAL', 'MPC', 'NFE', 'OXY', 'RIG', 'BKR', 'CVX', 'DVN', 'TPL', 'TRGP', 'WMB',
      'CLF', 'DOW', 'MHK', 'APD', 'CRH', 'CSTM', 'ECL', 'FCX', 'LIN',
    ],
  },
  {
    code: 'C8',
    name: 'Financials, Banks & Transaction Rails',
    proxies: 'XLF, KRE, IPAY',
    positiveCorr: '3 (Consumer Spend), 6 (Industrials), 7 (in rising rates)',
    inverseCorr: '2 (Duration Tech), 4 (Staples), 5 (Healthcare)',
    neutralOrthogonal: '1 (Tech Hardware)',
    whatItIs: 'Money center banks, regional banks, investment banks, private equity asset managers, and payment networks',
    coreDriver: 'Yield curve 2s10s slope, net interest margins (NIM), credit spreads, M&A deal velocity, nominal global transaction volume',
    sampleTickers: [
      'BX', 'FLG', 'KEY', 'LNC', 'TROW', 'MS', 'BAC', 'C', 'GS', 'JPM', 'KKR', 'MTB',
      'MA', 'V', 'AFRM', 'PYPL', 'FI',
    ],
  },
];

export const DEFAULT_MACRO_PROMPT = `# PROMPT: Concise Global Macro, Commodity, 8-Cluster & 5-5-5 Rotation Scanner

## CRITICAL FORMATTING & SOURCE RULES (READ FIRST)
- **NO BRACKETED CITATIONS OR LINKS:** Never output URLs, web links, markdown hyperlinks, footnotes, or bracketed citation numbers like \`[1]\`, \`[2]\`, \`[9]\`, or \`[[9]]\` anywhere in your response.
- **PLAIN-TEXT SOURCES ONLY:** Name sources and verified dates in plain text only—for example: \`(Source: Reuters, Nov 12)\` or \`per FRED\`.
- **LAYMAN TERMS & PLAIN ENGLISH:** Write clearly so an everyday investor can easily follow without a Wall Street background. Whenever you use technical jargon or acronyms (e.g., *2s10s spread, DFII10 real yield, HY OAS, Copper/Gold ratio, 50/200 DMA, 14-day RSI, VIX/VIX3M contango vs backwardation, VVIX, ATR*), briefly explain what it means in plain words right next to it (e.g., *"HY OAS of 3.2 percent, meaning the extra interest risky companies pay over safe government bonds"*).
- **KEEP IT CONCISE & SCANNABLE:** Avoid walls of text. Use short bullet points, clean tables, and punchy 1–2 sentence takeaways.
- **NO GUESSING:** Analyze the REAL, LIVE MARKET as of TODAY. Never invent numbers, dates, volatility multiples, or catalysts. Write \`"N/A (not publicly indexed)"\` for any unavailable metric.

---

## ROLE & OBJECTIVE
You are a Chief Global Macro Strategist running a tactical long/short fund (2 to 3 month horizon). Deliver a concise, data-grounded top-down roadmap for TODAY'S live market:
1. Open with a punchy **The week in brief** and **Big moves** recap spotlighting the dominant market story and any statistically outsized daily swings from the rolling past 7 calendar days.
2. Build a verified snapshot of rates, volatility, market breadth, currencies, and commodities, plus a simple 3-Check SPX Credit-Spread Gate (Go / Caution / Wait).
3. Give a clear 2–3 month directional call and plain-English rationale for key commodities (Oil, Gold, Copper, plus Natural Gas / Silver where relevant) and explain which stock groups win or lose.
4. Score and rank my 8 broad stock clusters using 1-week vs 1-month trends, earnings revisions, and money flows, then highlight which **Sample Tickers** from my watchlist fit best or should be avoided.
5. Map out correlation-aware Long/Short pairs, portfolio posture, and rate sensitivity.
6. Deliver 5 BULLISH, 5 BEARISH, and 5 REVERSING / INFLECTING sub-industries using the 5-5-5 Icon Matrix.

Do NOT write deep single-company stock reports or complex options trade structures (keep the SPX credit-spread check strictly to the 3 high-level volatility and trend filters). Stay top-down, using my Sample Tickers only to flag which types of stocks inside each cluster fit the current environment.

---

## DATA & CATALYST CHECKLIST (MANDATORY)

### 1. Live Market Numbers (1-Week and 1-Month Changes)
Pull latest-close data via **FRED**, **TradingEconomics**, **Investing.com**, **TradingView**, **Barchart**, **Cboe**, **StockAnalysis**, and **MacroRadar / MetalCharts / The Trading Tools**:
- **Rates & Fed Policy:**
  - \`US10Y\` (10-Yr Treasury yield) & \`US02Y\` (2-Yr Treasury yield): Last yield, 1W & 1M change in basis points (bps; 100 bps = 1 percent).
  - Curve Spread (\`10Y minus 2Y\`): Spread in bps (today vs 1W ago).
  - 10Y Real Yield (\`DFII10\` or \`TIP\` — interest rate after inflation): Level and 1W/1M direction.
  - Next Fed Meeting Expectations (**CME FedWatch** / **Reuters**).
- **Fear, SPX Trend, Breadth & Credit Health:**
  - \`VIX\` (30-day stock fear gauge), \`VIX3M\` (3-month stock fear gauge), and \`VIX / VIX3M Ratio\` (term structure: below 0.95 = calm contango; above 1.00 = panic backwardation), plus 1W trend.
  - \`VVIX\` (volatility of VIX — measures how violently fear is swinging: below 110 = steady; above 120 = gap-down risk) and \`MOVE\` Index (bond volatility, if available).
  - \`SPX\` (S&P 500 Index): Last price, 1W/1M %, position vs \`20-day\` and \`200-day DMA\`, \`14-day RSI\`, and recent daily stabilization (whether selling pressure is easing or printing fresh multi-day lows).
  - Market Breadth (\`RSP\` equal-weight vs \`SPY\` S&P 500, or \`IWM\` small caps vs \`QQQ\` tech): 1W and 1M relative move (shows whether rallies are broad or just big tech).
  - Credit Risk Appetite (\`FRED:BAMLH0A0HYM2\` High Yield OAS and \`HYG\` vs \`LQD\`): 1W and 1M direction.
- **Currencies & Commodities:**
  - \`DXY\` (U.S. Dollar Index) and \`USDJPY\`: Last price, 1W % and 1M % change.
  - \`UKOIL\` (Brent) and \`USOIL\` (WTI): Price per barrel, 1W/1M %, position vs \`50-day\` and \`200-day\` average prices (\`DMA\`), and \`14-day RSI\` (momentum gauge: above 70 = stretched high, below 30 = washed out).
  - \`XAUUSD\` (Gold) and \`XAGUSD\` (Silver, if relevant): Price per ounce, 1W/1M %, vs \`50/200 DMA\`, \`14-day RSI\`.
  - \`HG1!\` (Copper): Price, 1W/1M %, vs \`50/200 DMA\`, \`14-day RSI\`, plus **Copper/Gold Ratio** direction (rising = growth optimism; falling = defensive caution).
  - \`NG1!\` (Natural Gas) and \`DBC\` / \`BCOM\` (Broad Commodities, if relevant): Price, 1W/1M %.
- **The 8 Primary Cluster ETFs:**
  - \`SMH\`, \`IGV\`, \`XLY\`, \`XLP\`, \`XLV\`, \`XLI\`, \`XLE\`, \`XLF\` *(also check \`SOXX\`, \`WCLD\`, \`XLC\`, \`KRE\`, \`XLU\`, \`XLB\`, \`IPAY\` if sub-groups are splitting away)*.
  - For each primary ETF, retrieve: (1) Latest price and latest session move (or pre-market gap only if U.S. pre-market is open), (2) 1W % and 1M % change, (3) position vs \`10/20\`, \`50\`, and \`200 DMA\` plus \`14-day RSI\`, and (4) TradingView / Investing.com 1-Day and 1-Week technical rating.

### 2. Recent News, Outliers & Flows (Rolling Past 7 Calendar Days Only)
Search **Reuters**, **Bloomberg**, **CNBC**, **MarketWatch**, **Seeking Alpha**, **StockAnalysis**, **EIA / OPEC / World Gold Council / LME**, and **ETF.com / BofA / Lipper flow summaries** from the rolling past 7 calendar days for:
- **Outsized Single-Day Moves (for "The week in brief" and "Big moves"):** Scan major stock indexes (\`SPX\`, \`SPY\`, \`QQQ\`, \`IWM\`), Treasury yields (\`US10Y\`, \`US02Y\`), key currencies (\`DXY\`, \`USDJPY\`), commodities (\`Oil\`, \`Gold\`, \`Copper\`, \`Natural Gas\`), and the 8 Cluster ETFs for any unusually large 1-day swing over the rolling past 7 calendar days. Record the exact day/date, exact % or bps move, plain-English catalyst(s), and—by checking the asset's \`14-day or 20-day ATR%\` (average daily trading range) or average daily move via TradingView/Barchart—note approximately how many times its usual daily move it was (e.g., *"about 3.4 times its usual daily swing"*). Never invent a multiple; if baseline daily volatility is unavailable, state verified historical context instead (e.g., *"its sharpest 1-day drop since Oct"*).
- Major economic reports, central bank comments, geopolitical shocks, and big market-leader moves exceeding 1.5 percent.
- Commodity supply/demand news (OPEC+ output, EIA oil/gas inventories, refining margins, central bank gold buying, China stimulus/factory data, copper supply tightness).
- Earnings guidance shifts, spending plans, and fund flows inside each cluster.
- *Always state the source name and exact verified date (within the past 7 calendar days) in plain text.*

### 3. Reversal Detection Rule (1W vs 1M Check)
To catch early turning points instead of chasing old trends:
- **Reversal Bullish (Bottoming):** 1M return is negative, 1W return is positive (exceeding +1.5 percent), price holds or reclaims the \`10/20 DMA\` above major \`200 DMA\` or key floor support, and \`14-day RSI\` turns up from below 40 (or above 45). Score Factor B as \`(Tactical Reversal +1)\` and label Lifecycle: \`Accumulation / Troughing\`.
- **Reversal Bearish (Topping):** 1M return is positive, 1W return is negative (below -1.5 percent), price drops below the \`10/20 DMA\` on heavy volume, and \`14-day RSI\` rolls down from above 65–70. Score Factor B as \`(Tactical Peaking -1)\` and label Lifecycle: \`Distribution / Peaking\`.

---

## VISUAL SYNTAX & SAFETY RULES (STRICT)
- **Mandatory Status Icons:**
  - 🟢 Bullish / Outperforming / Overweight
  - 🔴 Bearish / Underperforming / Underweight
  - 🔄 Reversing / Inflecting
  - 📈 Improving Momentum
  - ⏸️ Stable Momentum / Neutral
  - 📉 Deteriorating Momentum
  - ⚠️ Major Risk Tripwires / Kill-Switches
- **No Bare Angle Brackets:** NEVER use \`<\` or \`>\` anywhere in your output. Write "greater than", "less than", "above", "below", "exceeding", or "prior to".
- **No Dollar Signs (\`$\`):** NEVER use the \`$\` symbol anywhere. Write currency in words or ISO codes (e.g., "USD 100", "USD 85/bbl", "dollars"). Use \`->\` instead of unicode arrows.
- **Clean Formatting:** Keep table cells short and crisp. Use standard markdown tables and bullets only.

---

## MY 8-CLUSTER FRAMEWORK, CORRELATIONS & WATCHLIST (REFERENCE MAP)

| Cluster | Positive Correlation | Inverse Correlation | Neutral / Independent | What it is | Core driver | Sample Tickers |
|:---|:---|:---|:---|:---|:---|:---|
| 1. TECH HARDWARE, SEMIS & DC INFRA (\`SMH\`, \`SOXX\`) | 2 (Software), 3 (Discretionary), 6 (Industrials/Grid) | 4 (Staples), 5 (Healthcare) | 7 (Commodities/Energy), 8 (Financials/Banks) | Chip designers, foundries, memory, WFE tools, servers, switches, optics, racks, and quantum hardware | Hyperscale AI CapEx, fab construction schedules, silicon cycle, risk-on liquidity | AVGO, MRVL, NVDA, INTC, MCHP, QCOM, AMD, HPQ, STX, MU, P, WDC, ASML, AEHR, WOLF, AMAT, ICHR, KLAC, LRCX, VRT, CSCO, TEL, ANET, CIEN, COHR, FLEX, JBL, QUBT, RGTI, IONQ, IBM, QBTS |
| 2. ENTERPRISE SOFTWARE, CLOUD & CYBER (\`IGV\`, \`WCLD\`) | 1 (Hardware/Semis), 3 (Digital Media) | 4 (Staples), 7 (Commodities/Energy), 8 (Banks/Value) | 5 (Healthcare), 6 (Industrials/Grid) | Enterprise cloud platforms, SaaS, databases, observability, and cybersecurity architectures | 10-Yr real yields, corporate IT software budgets, ARR expansion, cloud seat migration | FTNT, NOW, PANW, PLTR, RBRK, DBX, DOCU, OTEX, S, CRM, CRWD, RNG, TEAM, ZS, CRWV, FSLY, RXT, SNOW, NBIS, AKAM, DDOG, MDB, NET |
| 3. CYCLICAL DISCRETIONARY & MEDIA (\`XLY\`, \`XLC\`) | 1 (Tech Hardware), 6 (Logistics/Auto), 8 (FinTech/Payments) | 4 (Staples), 5 (Healthcare), 7 (in supply shocks) | 2 (Enterprise Software) | Discretionary retail, autos/EVs, travel/lodging, streaming, gaming, digital ads, and telecom | Household real income, consumer credit/savings, discretionary ad spend, leisure travel | BKNG, AAP, KSS, MGA, NKE, RIVN, SBUX, W, GM, APTV, AZO, BWA, CMG, DECK, ORLY, RCL, SN, TJX, TSLA, NFLX, AMC, LUMN, RBLX, SNAP, VZ, WBD, CMCSA, DIS, EA, T, TMUS, TTWO |
| 4. DEFENSIVE CONSUMER STAPLES (\`XLP\`, \`VDC\`) | 5 (Healthcare), Regulated Utilities (in 6) | 1 (Tech Hardware), 2 (Software), 3 (Discretionary) | 7 (Commodities), 8 (Financials) | Essential consumer staples — packaged food, beverages, personal care, household essentials, supermarkets | Inelastic volume demand, pricing power over CPI, recession flight-to-safety flows | COST, WMT, EL, KHC, STZ, TGT, WBA, CL, GIS, KO, MDLZ, MNST, PG |
| 5. DEFENSIVE HEALTHCARE & MEDTECH (\`XLV\`, \`IHI\`) | 4 (Staples), Regulated Utilities (in 6) | 1 (Tech Hardware), 3 (Discretionary), 6 (Industrials) | 7 (Commodities), 8 (Banks) | Surgical devices, implants, diagnostics, life science tools, hospital networks, managed care payers, commercial biopharma | Inelastic clinical necessity, insured lives volume, aging demographics, surgical procedure growth | LLY, BIIB, BLUI, ALNY, AMGN, INSM, VRTX, ISRG, UNH, DXCM, BAX, BDX, DGX, HUM, TDOC, THC, ABT, BSX, DHR, HCA, IDXX, MCK, MDT, UHS |
| 6. INDUSTRIALS, GRID & CAPITAL GOODS (\`XLI\`, \`XLU\`, \`PAVE\`) | 3 (Discretionary), 7 (Commodities), 8 (Banks/Credit) | 2 (Software via rates), 4 (Staples), 5 (Healthcare) | 1 (Tech Hardware - except cooling/power overlap) | Heavy machinery, automation, freight/logistics, aerospace/defense, grid power distribution, EPC contractors, and power utilities | ISM Manufacturing PMI, physical infrastructure capex, power grid megawatt load growth, commercial aero backlog | FDX, JBHT, RHI, ROK, UPS, CAT, CTAS, DE, EXPD, PH, SAIA, UNP, VRSK, BA, LMT, NOC, RTX, ETN, RUN, HUBB, PWR, CEG, PCG, BE, NEE, VST |
| 7. COMMODITIES, ENERGY & MATERIALS (\`XLE\`, \`XLB\`) | 6 (Industrials), 8 (Banks in rate hikes) | 2 (Software duration), 3 (Travel/Air), 4 (Cost-push drag) | 1 (Tech Hardware), 5 (Healthcare) | Upstream oil and gas (E&P), midstream pipelines, refining, oilfield services, copper/gold mining, chemicals, steel | OPEC+ supply policy, crude/gas crack spreads, geopolitical risk, global industrial capex, copper electrification | XOM, HAL, MPC, NFE, OXY, RIG, BKR, CVX, DVN, TPL, TRGP, WMB, CLF, DOW, MHK, APD, CRH, CSTM, ECL, FCX, LIN |
| 8. FINANCIALS, BANKS & TRANSACTION RAILS (\`XLF\`, \`KRE\`, \`IPAY\`) | 3 (Consumer Spend), 6 (Industrials), 7 (in rising rates) | 2 (Duration Tech), 4 (Staples), 5 (Healthcare) | 1 (Tech Hardware) | Money center banks, regional banks, investment banks, private equity asset managers, and payment networks | Yield curve 2s10s slope, net interest margins (NIM), credit spreads, M&A deal velocity, nominal global transaction volume | BX, FLG, KEY, LNC, TROW, MS, BAC, C, GS, JPM, KKR, MTB, MA, V, AFRM, PYPL, FI |

### Sub-Cluster Breakdown Reference
- **C1 (\`SMH\`):** Foundry/AI Silicon, Memory/Storage, Semi-Cap Equipment, Networking/Optics, Quantum/Edge Hardware
- **C2 (\`IGV\`):** Cybersecurity, Cloud/DevOps & Data, Application SaaS, AI Platforms/Agents
- **C3 (\`XLY\`):** Specialty/Value Retail, Autos/EVs, Travel/Hospitality, Streaming/Gaming/Digital Ads & Telecom (\`XLC\`)
- **C4 (\`XLP\`):** Big-Box/Grocery, Beverages/Snacks, Household/Personal Care
- **C5 (\`XLV\`):** Large-Cap Pharma/Biopharma, MedTech Devices, Managed Care/Hospitals, Life Science Tools
- **C6 (\`XLI\`):** Aerospace & Defense, Electrical Grid/Power Utilities (\`XLU\`), Heavy Machinery/Automation, Freight/Logistics
- **C7 (\`XLE\`):** Integrated Oil/E&P, Refining/Midstream/Services, Copper/Industrial Metals (\`XLB\`), Gold/Precious Miners, Chemicals/Materials
- **C8 (\`XLF\`):** Money Center & Investment Banks, Regional Banks (\`KRE\`), Payment Rails/Fintech (\`IPAY\`), Private Credit/Asset Managers

---

## SCORING RULES (PARENT CLUSTERS ONLY)
Score each cluster from -8 to +8 by summing 4 factors (-2 to +2 each):
- **A. Macro Fit (-2 to +2):** Do current interest rates, commodity costs, dollar, and credit spreads help or hurt?
- **B. Price Trend & Turning Points (-2 to +2):** Position vs 50/200 DMA, short-term 10/20 DMA reclaim or break, RSI, and 1W vs 1M speed. *(Anti-Lag Rule: If below 50 DMA after a dip, but holding support with 1W return exceeding +1.5 percent and rising RSI, score 0 or +1—not negative.)*
- **C. Earnings & Guidance (-2 to +2):** Recent profit beats/misses, spending outlook, and Wall Street estimate revisions.
- **D. Money Flows & Positioning (-2 to +2):** ETF relative strength, institutional buying/selling, and whether a trade is overcrowded.

### Score Bands, Lifecycle & Momentum Speed
- **Bands:** +5 to +8: 🟢 Strong Bullish | +2 to +4: 🟢 Bullish | -1 to +1: ⏸️ Neutral / Inflecting | -4 to -2: 🔴 Bearish | -8 to -5: 🔴 Strong Bearish
- **Lifecycle:** \`Accumulation / Troughing\` | \`Markup / Expansion\` | \`Distribution / Peaking\` | \`Markdown / Capitulation\`
- **Speed (1W vs 1M):** 📈 \`Improving\` (1W beating 1M pace) | ⏸️ \`Stable\` | 📉 \`Deteriorating\` (1W breaking below 1M pace)

---

## DIVERSIFICATION RULES FOR THE 5-5-5 MATRIX
- Exactly 15 distinct sub-industries: 5 Bullish, 5 Bearish, 5 Reversing.
- Tag Reversing picks explicitly as \`[Reversing Bullish: Troughing]\` or \`[Reversing Bearish: Peaking]\`.
- Cover at least 5 distinct market sectors and at least 5 of the 8 clusters.
- No more than 2 picks may rely on the exact same macro driver.

---

## REQUIRED OUTPUT STRUCTURE

### The week in brief
Write 1 to 2 punchy sentences summarizing what truly drove markets over the rolling past 7 calendar days, highlighting the single most defining market-wide move (exact asset/ticker, exact % or bps move, exact day and date, and—if verified against its usual daily swing / ATR—how many times its typical move it was, plus plain-text source). Keep it completely grounded in live data.

### Big moves
List 1 to 4 crisp, plain-English bullet points (depending on how many genuine outliers occurred) highlighting the most notable outsized daily swings across commodities, rates, currencies, stock indexes, or the 8 clusters over the rolling past 7 calendar days. Format each bullet cleanly in this style:
- **[Asset / Ticker]** [rose/fell] [X.X percent or X bps] on [plain-English drivers/catalysts] on [Day DD Mon], [about X.X times its usual daily move if verified from ATR/average swing — otherwise state verified historical context such as its sharpest 1-day move since Month] (Source: [Plain-text Source, Date]).
*(If markets were unusually quiet with no outsized volatility spikes, explicitly state that daily volatility stayed muted and highlight the week's largest relative mover instead.)*

### 1. Live Macro, Fear & Market Breadth Baseline
- **Data Table:** Print today's exact date and a clean table of: \`US10Y\`, \`US02Y\`, \`10Y-2Y Spread\`, \`DFII10 (10Y Real)\`, \`HY OAS\`, \`HYG vs LQD\`, \`VIX\`, \`VIX3M\`, \`VIX / VIX3M Ratio\`, \`VVIX\`, \`MOVE\`, \`SPX (vs 20/200 DMA)\`, \`RSP vs SPY\`, \`DXY\`, \`USDJPY\`, \`Brent/WTI\`, \`Gold\`, \`Copper\`, \`Natural Gas\` (if relevant), and \`Copper/Gold Ratio\` (Last Price/Yield, 1W Change, 1M Change, Plain-English Signal).
- **SPX Credit-Spread Gate (3-Check Go / Wait Filter for Selling Bull Put Spreads):** Give a tight 3-bullet \`Pass / Caution / Fail\` readout in plain English:
  1. **VIX Term Structure (\`VIX\` vs \`VIX3M\`):** Pass if \`VIX\` is below \`VIX3M\` (ratio below 1.00, calm contango); Fail if inverted above 1.00 (panic mode).
  2. **Fear Stability (\`VVIX\` & Daily Swings):** Pass if \`VVIX\` is below 110–115 and \`SPX\` has stabilized for 1–2 sessions; Fail if \`VVIX\` exceeds 120 or \`SPX\` is making fresh daily lows.
  3. **SPX Trend Support (\`200 DMA\` & \`20 DMA\`):** Pass if \`SPX\` is above its \`200 DMA\` or reclaiming its \`20 DMA\` on a higher low; Caution/Fail if slicing below the \`200 DMA\`.
  - **Gate Verdict:** State 🟢 \`GO\` (Normal Size), ⏸️ \`CAUTION\` (Half Size / Wider Cushion), or 🔴 \`WAIT\` (Stand Aside) in 1 sentence.
- **7-Day News & Upcoming Calendar:** Key macro prints, big movers, CME FedWatch rate odds, and major events over the next 2–4 weeks (plain-text source + date).
- **Market Regime in Plain English:** Name the regime and trace the cause-and-effect chain (\`Main Driver -> Rates/Dollar/Fear Reaction -> Where Money Flows\`).
- **3 Active Fracture Points:** Top 3 macro risks in plain English and which clusters get hit hardest.

### 2. Commodity Complex Outlook (Oil, Gold, Copper & Key Cross-Commodities)
Give a clear 2–3 month view grounded in verified prices and recent supply/demand news:
- **Summary Table:**
  | Commodity & Ticker | Last Price (1W / 1M %) | Chart Posture (vs 50/200 DMA & RSI) | 2–3M View & Conviction (🟢/🔴/🔄/⏸️) | Main Driver (Plain English) |
  Cover: **Crude Oil (\`USOIL\` / \`UKOIL\`)**, **Gold (\`XAUUSD\`)**, **Copper (\`HG1!\`)**, plus **Natural Gas (\`NG1!\`)** and **Silver (\`XAGUSD\`)** (or Broad Commodities) if relevant.
- **Short Rationales & Stock Impact (2–3 crisp sentences each for Oil, Gold, Copper; 1–2 sentences for Gas/Silver):**
  - Explain the supply/demand and macro reason simply.
  - State what the **Copper/Gold Ratio** says about economic growth vs safety demand, and name which of the **8 Clusters** win or lose.

### 3. 8-Cluster Scoreboard, Trends & Watchlist Focus
First, rank all 8 clusters from highest to lowest score:
| Rank & Cluster | Primary ETF | Score (-8 to +8) & Bias | Momentum & Lifecycle Stage | 2–3M Trading Stance |

Below the table, give a tight block for each cluster (**max 110 words per cluster**):
- **Scores:** \`A (Macro) | B (Trend) | C (Earnings) | D (Flows)\`
- **Chart Snapshot:** Last Price, 1W vs 1M %, vs \`10/20\`, \`50\`, \`200 DMA\`, \`14d RSI\`, and 1D/1W Technical Rating.
- **Latest Catalyst (Past 7 Days):** 1 concise sentence with plain-text source and date.
- **Sub-Groups:** Tag each sub-cluster (🟢, ⏸️, 🔴, 🔄) with a 3–6 word plain-English driver; flag any split from the parent cluster.
- **Trading Focus & Watchlist Names:** State your 2–3 month stance (\`Overweight / Long\`, \`Selective Long\`, \`Neutral / Pairs Only\`, \`Underweight / Sell Rallies\`, \`Short\`), confirm it aligns with the Correlation Map, and name which **Sample Tickers** from my list fit best vs which to avoid.

Finish Section 3 with a **Quick Ticker-Picking Summary Table**:
| Cluster | 2–3M Stance & Conviction | Plain-English Reason (1-Line) | Watchlist Names to Favor | Watchlist Names to Avoid / Short |

### 4. Smart Pairs, Portfolio Posture & Rate Sensitivity
- **2–3 Month Portfolio Mix:** Recommended overall stock exposure (Net Long / Balanced / Defensive), style tilt (e.g., Cyclical Value vs Rate-Sensitive Tech), commodity tilt, and cash/hedge level.
- **Top 3 Long/Short Pairs:** Built directly from Inverse Correlations in the Reference Map (include score gap, ETF ratio like \`XLV/IGV\`, plain-English thesis, and what proves it wrong).
- **Top 2 Portfolio Hedges:** Best offsets using bonds, currencies, volatility, or commodities.
- **Real Yield (\`DFII10\`) Impact Table:** Rate each of the 8 clusters (\`High Negative / Moderate Negative / Neutral / Positive\`) if inflation-adjusted rates rise, plus the 1-line plain-English reason *(no made-up percentage impact guesses)*.

### 5. The 5-5-5 Macro Rotation Master Matrix

| Category | Sub-Industry & Cluster | ETF / Leaders | Main Macro Trigger (Plain English) | Conviction (H/M/L) |
|:---|:---|:---|:---|:---|
| 🟢 Bullish 1–5 | | | | |
| 🔴 Bearish 1–5 | | | | |
| 🔄 Reversing 1–5 | *(Tag \`[Reversing Bullish: Troughing]\` or \`[Reversing Bearish: Peaking]\`)* | | | |

### 6. The 15 Sub-Industry Quick Cards
For each of the 15 picks (**under 60 words each**—do not repeat matrix columns):
- **Why Money Is Moving:** Plain-English 2–3 month reason (noting rate/commodity ties).
- **2 Signals to Watch:** Specific real metrics or tickers to track.
- **Pair Offset & Exit Tripwire:** Matching hedge from the matrix and what breaks the idea.

### 7. 4 Systemic Kill-Switches (What Breaks This Entire Playbook)
Give 4 exact numerical tripwires prefixed with ⚠️:
1. ⚠️ **Rates / Credit:** Exact level on \`US10Y\` or \`HY OAS\`.
2. ⚠️ **Fear / Breadth:** Exact level on \`VIX\` or \`HYG/LQD\`.
3. ⚠️ **Commodities / Dollar:** Exact level on \`Brent\`, \`Gold\`, \`Copper\`, or \`USDJPY\`.
4. ⚠️ **Correlation Breakdown:** Exact panic condition where opposite assets drop together (e.g., stocks, bonds, and gold all falling sharply on the same day).

---
## FINAL PRE-OUTPUT CHECK
Before displaying your response:
1. Verify there are **ZERO** URLs, **ZERO** markdown links, and **ZERO** bracketed citation numbers (\`[1]\`, \`[2]\`, \`[[9]]\`, etc.). Use plain-text sources only, such as \`(Source: Reuters, Nov 12)\`.
2. Verify there are **ZERO** bare \`<\`, \`>\`, or \`$\` symbols anywhere in the output.
3. Verify **The week in brief**, **Big moves**, and **SPX Credit-Spread Gate** use only real, verified dates, moves, catalysts, volatility levels, and trend numbers.`;

export const INITIAL_REFERENCE_REPORT: MacroReport = {
  id: 'ref-concise-nov-25-2026-v2',
  createdAt: '2026-11-25T08:42:00-08:00',
  sourceLabel: 'Reference Baseline',
  promptSnippet: 'Concise Global Macro, Commodity, 8-Cluster & 5-5-5 Rotation Scanner',
  rawMarkdown: '',
  sources: [],
  section1: {
    weekInBrief:
      'Wall Street endured violent whipsaws over the past seven days as fears of December Federal Reserve rate hikes, persistent 3.5 percent inflation, and doubts over artificial-intelligence spending collided with dramatic single-stock news, pulling the S&P 500 (SPX) down 1.90 percent on the week to 7,201.09 (Source: Morningstar and Portfolio Terminal, Nov 24). The defining session was Monday, Nov 23, when SPX surged 4.73 percent (+327 points) to 7,237.17 — its largest one-day gain since April 2025 and roughly 2.2 times its recent elevated daily trading range (ATR) of about 2.1 percent — after Nvidia reinstated Jensen Huang as CEO, only for semiconductor stocks to slide back sharply on Tuesday (Source: Saxo Bank and Trader Markus, Nov 24).',
    bigMoves: [
      {
        asset: 'Nvidia (NVDA) & Semis (SMH)',
        direction: 'volatile',
        moveLabel: '+31.48% / +15.03% -> -5.86% / -7.26%',
        dateLabel: 'Mon Nov 23 – Tue Nov 24',
        volatilityTag: 'SMH ~5.1x / NVDA ~3.7x typical daily ATR',
        detail:
          'Nvidia reinstated Jensen Huang as CEO following an 11-day ouster, driving NVDA to its biggest gain in over two decades before reversing Tuesday after ADI (-17.37%) and HPE (-16.31%) slumped post-earnings.',
        sourceDate: 'Source: TradingKey, Macroaxis, and ChartingLens, Nov 24–25',
      },
      {
        asset: 'S&P 500 (SPX) & Copper (HG1!)',
        direction: 'down',
        moveLabel: 'SPX -3.70% | HG1! -20.2% off peak',
        dateLabel: 'Fri, Nov 20',
        volatilityTag: 'SPX ~1.8x ATR; worst week since Apr 2025',
        detail:
          'SPX fell to 6,910.39 and Copper entered a bear market (USD 5.485/lb) on forced tech liquidation, a failed Anthropic IPO bounce, and 95%+ odds of a December Fed rate hike.',
        sourceDate: 'Source: AP, Canadian Mining Report, and Real Investment Advice, Nov 20–24',
      },
      {
        asset: 'US Natural Gas (NG1!)',
        direction: 'up',
        moveLabel: '+6.06% (Dec) / +15.30% (Jan)',
        dateLabel: 'Tue, Nov 24',
        volatilityTag: 'Sharpest rally of the month',
        detail:
          'A US cold snap pushed lower-48 heating demand to an eight-month high of 96.9 bcf/day amid short-covering.',
        sourceDate: 'Source: CME Group, Barchart, and CappNotes, Nov 24–25',
      },
      {
        asset: 'Silver (XAGUSD) & Gold (XAUUSD)',
        direction: 'down',
        moveLabel: '-5.22% (USD 40.79) / -2.25% (USD 3,552.50)',
        dateLabel: 'Tue, Nov 24',
        volatilityTag: 'Hawkish Fed & BoC inflation shock',
        detail:
          'Precious metals tumbled after NY Fed President John Williams warned inflation is "simply too high" and the Bank of Canada flagged broadening price pressures.',
        sourceDate: 'Source: Mitrade and Gold Stock Canada, Nov 24–25',
      },
    ],
    verificationTimestamp: 'Wednesday, November 25, 2026 (Latest US Close: Tuesday, Nov 24, 2026)',
    baselineMetrics: [
      { asset: 'US 10Y Treasury Yield', ticker: 'US10Y', category: 'rates', latestClose: '4.91%', change1W: '-19 bps', change1M: '-9 bps', signal: 'Still near 5%, keeping borrowing costs heavy (US Treasury, Nov 24)', tone: 'warning' },
      { asset: 'US 2Y Treasury Yield', ticker: 'US02Y', category: 'rates', latestClose: '4.63%', change1W: '-17 bps', change1M: '-5 bps', signal: 'Reflects near-certain Dec Fed hike pricing (US Treasury, Nov 24)', tone: 'warning' },
      { asset: '10Y minus 2Y Spread', ticker: '10Y-2Y Spread', category: 'rates', latestClose: '+28 bps', change1W: '-2 bps', change1M: '-4 bps', signal: 'Barely positive; flat curve limits bank lending margins (US Treasury, Nov 24)', tone: 'neutral' },
      { asset: '10Y Real Yield', ticker: 'DFII10', category: 'rates', latestClose: '2.77% (Nov 20)', change1W: '-12 bps', change1M: '+10 bps', signal: 'Interest rate after inflation near 18-yr highs, pressuring tech (FRED, Nov 20)', tone: 'bearish' },
      { asset: 'High Yield Credit Spread', ticker: 'HY OAS', category: 'rates', latestClose: '3.52% (Nov 19)', change1W: '+32 bps', change1M: '+34 bps', signal: 'Extra interest risky firms pay over Treasuries is widening (FRED, Nov 19)', tone: 'warning' },
      { asset: 'Junk vs IG Corp Bonds', ticker: 'HYG vs LQD', category: 'rates', latestClose: 'USD 76.43 / 103.79', change1W: '-0.52% / +0.86%', change1M: '-0.93% / -0.57%', signal: 'Investors prefer safer corporate bonds over junk debt (Investing.com, Nov 24)', tone: 'neutral' },
      { asset: '30-Day Stock Fear', ticker: 'VIX', category: 'volatility', latestClose: '26.36', change1W: '+0.90 pts', change1M: '+6.91 pts', signal: 'Elevated fear; jumped near 29.3 in early Nov 25 futures (Cboe, Nov 24)', tone: 'bearish' },
      { asset: '3-Month Stock Fear', ticker: 'VIX3M', category: 'volatility', latestClose: '25.47', change1W: '+0.49 pts', change1M: '+4.99 pts', signal: 'Longer-dated fear remains high above 25 (TradeFlags, Nov 24)', tone: 'warning' },
      { asset: 'VIX Term Structure', ticker: 'VIX / VIX3M Ratio', category: 'volatility', latestClose: '1.035', change1W: '+0.016', change1M: '+0.085', signal: 'Panic backwardation (above 1.00); near-term fear exceeds 3M (TradeFlags, Nov 24)', tone: 'bearish' },
      { asset: 'Volatility of VIX', ticker: 'VVIX', category: 'volatility', latestClose: '114.07', change1W: '-7.21 pts', change1M: '+4.37 pts', signal: 'Fear itself is swinging sharply above 110 comfort zone (PropTraderz, Nov 24)', tone: 'warning' },
      { asset: 'Bond Volatility', ticker: 'MOVE', category: 'volatility', latestClose: '106.3 (Nov 20)', change1W: '+10.3 pts', change1M: '+6.1 pts', signal: 'Treasury market swings remain elevated above 100 (ICE BofA, Nov 20)', tone: 'warning' },
      { asset: 'S&P 500 Index', ticker: 'SPX', category: 'volatility', latestClose: '7,201.09 (RSI 41)', change1W: '-1.90%', change1M: '-5.00%', signal: '3.7% below 20 DMA (7,477) and 2.2% below 200 DMA (7,361) (Dow Jones, Nov 24)', tone: 'bearish' },
      { asset: 'Equal vs Cap-Weight S&P', ticker: 'RSP vs SPY', category: 'volatility', latestClose: 'USD 213.96 / 718.78', change1W: '-0.68% / -1.56%', change1M: '-1.19% / -5.42%', signal: 'Average stock beating mega-cap tech by +4.23 pp over 1M (Investing.com, Nov 24)', tone: 'bullish' },
      { asset: 'US Dollar Index', ticker: 'DXY', category: 'fx', latestClose: '103.81', change1W: '+0.10%', change1M: '+2.12%', signal: 'Near 19-month highs, tightening global liquidity (Investing.com / OCBC, Nov 25)', tone: 'warning' },
      { asset: 'Dollar vs Yen', ticker: 'USDJPY', category: 'fx', latestClose: '159.22', change1W: '-0.09%', change1M: '+1.49%', signal: 'Hovering just under Tokyo\'s 160 intervention line (Trading Economics, Nov 25)', tone: 'warning' },
      { asset: 'Brent / WTI Crude', ticker: 'UKOIL / USOIL', category: 'commodities', latestClose: 'USD 90.89 / 81.52', change1W: '-0.7% / -1.2%', change1M: '-20.7% / -21.3%', signal: 'Surplus worries outweigh Hormuz tanker attacks (DTN / Investing.com, Nov 24)', tone: 'neutral' },
      { asset: 'Spot Gold', ticker: 'XAUUSD', category: 'commodities', latestClose: 'USD 3,552.50/oz', change1W: '-5.67%', change1M: '-12.59%', signal: 'Testing critical USD 3,500 floor on strong USD and Fed hikes (Mitrade, Nov 24)', tone: 'reversing' },
      { asset: 'COMEX Copper', ticker: 'HG1!', category: 'commodities', latestClose: 'USD 5.48/lb', change1W: '-6.06%', change1M: '-18.60%', signal: 'In bear market (down 20% from Sep peak) on AI/China doubts (Investing.com, Nov 24)', tone: 'bearish' },
      { asset: 'Natural Gas', ticker: 'NG1!', category: 'commodities', latestClose: 'USD 3.47 Dec / 3.65 Jan', change1W: 'Contract roll', change1M: '+20.32% (Jan)', signal: 'Cold US weather and record LNG feedgas lift prices (CME / Admiral, Nov 24)', tone: 'bullish' },
      { asset: 'Copper / Gold Ratio', ticker: 'HG1! / XAUUSD', category: 'commodities', latestClose: '~1.54', change1W: 'Falling', change1M: 'Falling', signal: 'Copper falling faster than Gold flags growth anxiety (MEDGE, Nov 19–24)', tone: 'warning' },
    ],
    creditSpreadGate: {
      verdict: 'wait',
      verdictLabel: 'WAIT — Stand Aside',
      summary:
        'All three filters fail; stay out of short put spreads until VIX drops below VIX3M and SPX reclaims 7,361.',
      checks: [
        {
          name: 'VIX Term Structure (VIX vs VIX3M)',
          status: 'fail',
          detail:
            'VIX (26.36) sits above VIX3M (25.47), keeping the ratio inverted at 1.035 (panic backwardation above 1.00, meaning traders pay extra for immediate crash protection).',
        },
        {
          name: 'Fear Stability (VVIX & Daily Swings)',
          status: 'fail',
          detail:
            'VVIX (how violently fear itself moves) stands at 114.07 (above the 110 steady ceiling), SPX has fallen in 8 of the past 9 sessions, and Wednesday futures are sliding another 1.4 percent.',
        },
        {
          name: 'SPX Trend Support (200 DMA & 20 DMA)',
          status: 'fail',
          detail:
            'SPX (7,201.09) remains 2.2 percent below its 200-day average (7,361) and 3.7 percent below its 20-day average (7,477), failing to confirm a higher-low base.',
        },
      ],
    },
    catalysts: [
      {
        title: 'Fed Policy & Inflation Pressure',
        detail: 'October FOMC minutes (Nov 18) showed "almost all" officials expect more hikes; NY Fed\'s Williams called ~3.5 percent PCE "simply too high" (Nov 23). CME FedWatch prices 95% to 97% odds of a 25 bps hike (to 4.00%–4.25%) at the Dec 8–9 FOMC and ~63% for another hike on Jan 27.',
        sourceDate: 'Source: Reuters and Vanguard/moomoo, Nov 24–25',
      },
      {
        title: 'Macro & 16-Country Tariff Shock',
        detail: 'US Conference Board Consumer Confidence jumped to 103.3 on Nov 24 (highest since Jan 2025), while Flash Composite PMI dipped to a four-month low of 54.6 and Philly Fed slumped to 6.3. Overnight (Nov 25), Reuters reported the Trump administration is preparing broad replacement tariffs on 16 major trading partners.',
        sourceDate: 'Source: OCBC and Reuters, Nov 25',
      },
    ],
    upcomingCalendar: 'Today (Nov 25, 8:30 AM ET): Oct PCE Inflation (3.8% headline / 3.2% core est.), Q3 GDP 2nd estimate, jobless claims & Deere (DE) earnings · Nov 26–27: Thanksgiving holiday (early close Fri) · Nov 29: OPEC+ meeting · Dec 8–9: FOMC Rate Decision & Projections.',
    regimeName: 'Late-Cycle Hawkish Tightening & AI Valuation Unwind',
    causalChain: [
      'Sticky inflation (above 3.5%) + renewed tariff threats force Fed to keep hiking rates',
      'US10Y holds near 5% with DFII10 real yields near 2.8% and DXY near 104',
      'Capital flees crowded, debt-heavy AI tech and industrial metals',
      'Money rotates into cash-rich defensive Healthcare, Staples, and select Financials',
    ],
    stressPoints: [
      {
        title: 'AI Credit & Capex Contagion',
        detail: 'High-yield spreads (HY OAS 3.52%) hide severe cracks in lowest-rated debt (CCC spreads above 13.1%) and AI infrastructure bonds (CoreWeave 5-year CDS above 1,240 bps) — hits Cluster 1 (Semis/DC Infra) and Cluster 2 (Software) hardest (Source: Alphio AI and PortfolioAnalyst, Nov 16–24).',
      },
      {
        title: 'Tariff Shock + Fed Over-Tightening',
        detail: 'New tariffs on 16 nations risk reigniting goods inflation right as manufacturing slows (Philly Fed 6.3) — squeezes Cluster 6 (Industrials), Cluster 3 (Discretionary), and Cluster 7 (Copper/Materials) (Source: Reuters and Velocity, Nov 19–25).',
      },
      {
        title: 'Middle East Tanker Escalation vs Yen Intervention',
        detail: 'Fresh Hormuz mine/projectile attacks (Nov 24) alongside USDJPY testing 160 risk sudden energy spikes or forced yen carry-trade unwinds — whipsaws Cluster 7 (Energy) and global liquidity in Cluster 1 (Tech) (Source: DTN and IC Markets, Nov 24–25).',
      },
    ],
  },
  section2: {
    commodities: [
      {
        name: 'WTI Crude',
        ticker: 'USOIL',
        lastPrice: 'USD 81.52/bbl',
        change1W: '-1.2%',
        change1M: '-21.3%',
        technicalPosture: 'Below 50 DMA (90.13); near/above 200 DMA (77.27); RSI oversold (~35)',
        rsiValue: 35,
        viewBias: 'neutral',
        viewLabel: 'Neutral / Range-Bound',
        conviction: 'Med',
        driver: 'Rising Gulf exports & US stock builds offset Hormuz tanker attacks',
      },
      {
        name: 'Brent Crude',
        ticker: 'UKOIL',
        lastPrice: 'USD 90.89/bbl',
        change1W: '-0.7%',
        change1M: '-20.7%',
        technicalPosture: 'Below 50 DMA & 200 DMA (~91.4–98.5); RSI ~37 (weak)',
        rsiValue: 37,
        viewBias: 'neutral',
        viewLabel: 'Neutral / Range-Bound',
        conviction: 'Med',
        driver: 'Q4 IEA surplus (1.7 mb/d) battles Middle East supply risk',
      },
      {
        name: 'Gold',
        ticker: 'XAUUSD',
        lastPrice: 'USD 3,552.50/oz',
        change1W: '-5.7%',
        change1M: '-12.6%',
        technicalPosture: 'Well below 50 & 200 DMA; RSI 23–31 (deeply oversold)',
        rsiValue: 27,
        viewBias: 'reversing',
        viewLabel: 'Troughing / Accumulate',
        conviction: 'Med',
        driver: 'Forced cash-raising & USD near 104 testing USD 3,500 support',
      },
      {
        name: 'Copper',
        ticker: 'HG1!',
        lastPrice: 'USD 5.48/lb',
        change1W: '-6.1%',
        change1M: '-18.6%',
        technicalPosture: '~16.8% below 50 DMA & 14.8% below 200 DMA; RSI 23–42',
        rsiValue: 32,
        viewBias: 'bearish',
        viewLabel: 'Bearish',
        conviction: 'High',
        driver: 'AI data-center capex doubts & soft China demand trump physical tightness',
      },
      {
        name: 'Natural Gas',
        ticker: 'NG1!',
        lastPrice: 'USD 3.47 Dec / 3.65 Jan',
        change1W: 'Contract roll',
        change1M: '+20.3% (Jan)',
        technicalPosture: 'Above 200 DMA (+14.6%); Daily RSI ~54 (healthy)',
        rsiValue: 54,
        viewBias: 'bullish',
        viewLabel: 'Bullish',
        conviction: 'Med',
        driver: 'Early US/EU cold snap & record LNG exports tightening winter storage',
      },
      {
        name: 'Silver',
        ticker: 'XAGUSD',
        lastPrice: 'USD 40.79/oz',
        change1W: '-11.2%',
        change1M: '-26.3%',
        technicalPosture: 'Steeply below 50 & 200 DMA; RSI ~17–29 (washed out)',
        rsiValue: 23,
        viewBias: 'bearish',
        viewLabel: 'Bearish / Volatile',
        conviction: 'Med',
        driver: 'Hit doubly by high real rates and copper-led industrial selloff',
      },
    ],
    rationales: [
      {
        title: 'Crude Oil (USOIL / UKOIL — Neutral / Range-Bound)',
        bias: 'neutral',
        body: 'Oil is trapped in a tug-of-war: physical Gulf flows recovered to 9.1 mb/d in Q3 and US EIA crude/gasoline inventories posted surprise builds (+3.4M and +5.2M bbl, Nov 18), while four tankers were struck in the Strait of Hormuz on Nov 24 ahead of the Nov 29 OPEC+ meeting (Source: Reuters and DTN, Nov 18–24).',
        equityTransmission: 'Winner: Cluster 7 midstream pipelines/refiners; Neutral/Drag: upstream oil drillers until Brent reclaims USD 95.',
      },
      {
        title: 'Gold (XAUUSD — Troughing / Accumulate)',
        bias: 'reversing',
        body: 'Gold\'s 12.6 percent monthly drop reflects high real yields (2.77%), a strong dollar (DXY ~104), and forced liquidation to cover tech margin calls, even as central banks (e.g., Poland hitting 700 tonnes) keep buying ~60 tonnes/month (Source: World Gold Council and GoldSilver, Nov 5–20).',
        equityTransmission: 'A hold above USD 3,500 sets up a tactical bounce for Cluster 7 gold miners (GDX) once Fed hike odds peak.',
      },
      {
        title: 'Copper (HG1!) & Cross-Commodities (Bearish Copper / Bullish Gas)',
        bias: 'bearish',
        body: 'Copper entered a bear market (-20% off September highs) as AI data-center power worries and unwinding US tariff stockpiles crushed futures, despite record Chinese Yangshan physical import premiums (Source: Mining.com and Canadian Mining Report, Nov 23–25). Surging Natural Gas aids gas pipelines while Silver tracks industrial weakness.',
        equityTransmission: 'Hurts Cluster 6 (Industrials) and Cluster 7 (Base Metals) while favoring Cluster 5 (Healthcare) and Cluster 4 (Staples); aids Cluster 7 gas midstream (WMB, TRGP).',
      },
    ],
    copperGoldSignal: 'The falling Copper/Gold Ratio (~1.54) warns of slowing global manufacturing, hurting Cluster 6 (Industrials) and Cluster 7 (Base Metals) while favoring defensive Cluster 5 (Healthcare) and Cluster 4 (Staples).',
  },
  section3: {
    clusters: [
      {
        id: 'C5',
        rank: 1,
        name: 'Healthcare & MedTech',
        primaryEtf: 'XLV',
        score: 7,
        bias: 'strong-bullish',
        biasLabel: 'Strong Bullish',
        momentumDirection: 'improving',
        momentumLabel: 'Improving',
        lifecycleStage: 'Markup & Expansion',
        tradingView: 'Overweight / Long',
        factorBreakdown: { a: 2, b: 1, c: 2, d: 2 },
        technicalContext: 'USD 184.72 (+2.95% Nov 24); 1W -0.28% (pre-Tue), 1M +3.03%; reclaimed 50 DMA (183.14) and 200 DMA (182.78); 14d RSI rebounding from 45; Barchart 80% Buy.',
        rsiValue: 45,
        rating1D: '80% Buy',
        verifiedCatalyst: 'Sanofi agreed to acquire Insmed (INSM, +14.13%) for USD 41 billion cash on Nov 24, lifting XBI +6.56% (Source: Reuters, Nov 24).',
        subClusters: [
          { name: 'Pharma / Bio', status: 'bullish', note: 'M&A wave' },
          { name: 'MedTech', status: 'reversing', note: 'Rebounding' },
          { name: 'Managed Care', status: 'neutral', note: 'Rate-immune, policy watch' },
          { name: 'Life Tools', status: 'reversing', note: 'Agilent beat +4.3%' },
        ],
        clusterRationale: 'M&A wave + recession-proof cash flows draw AI-exit money (inverse to SMH).',
        favoredTickers: ['LLY', 'AMGN', 'VRTX', 'INSM', 'ISRG', 'BSX', 'DHR'],
        avoidTickers: ['HUM', 'TDOC'],
        stanceSummary: 'Overweight',
        conviction: 'High',
      },
      {
        id: 'C4',
        rank: 2,
        name: 'Consumer Staples',
        primaryEtf: 'XLP',
        score: 6,
        bias: 'strong-bullish',
        biasLabel: 'Strong Bullish',
        momentumDirection: 'improving',
        momentumLabel: 'Improving',
        lifecycleStage: 'Markup & Expansion',
        tradingView: 'Overweight / Long',
        factorBreakdown: { a: 2, b: 2, c: 1, d: 1 },
        technicalContext: 'USD 91.88 (+1.66% Nov 24); 1W ~+0.5%, 1M +2.40% (pre-Tue); above 50 DMA (91.47) and 200 DMA (88.70); 14d RSI rebounding ~55–60 (weekly near 70); Investing.com 1D Strong Buy.',
        rsiValue: 58,
        rating1D: 'Strong Buy',
        verifiedCatalyst: 'Walmart beat Q3 revenue (USD 188.8B) and raised FY27 guidance for the third time (Source: CNBC, Nov 19).',
        subClusters: [
          { name: 'Big-Box / Grocery', status: 'bullish', note: 'Traffic gains' },
          { name: 'Beverages / Snacks', status: 'neutral', note: 'Stretched valuation' },
          { name: 'Household / Personal Care', status: 'neutral', note: 'Pricing power steady' },
        ],
        clusterRationale: 'Persistent inflation & raised retail guidance anchor safety (inverse to SMH/IGV).',
        favoredTickers: ['WMT', 'COST', 'KO', 'PG'],
        avoidTickers: ['WBA', 'EL'],
        stanceSummary: 'Overweight',
        conviction: 'High',
      },
      {
        id: 'C8',
        rank: 3,
        name: 'Financials & Rails',
        primaryEtf: 'XLF',
        score: 2,
        bias: 'bullish',
        biasLabel: 'Bullish',
        momentumDirection: 'stable',
        momentumLabel: 'Stable',
        lifecycleStage: 'Accumulation & Troughing',
        tradingView: 'Selective Long (Banks)',
        factorBreakdown: { a: 1, b: 0, c: 1, d: 0 },
        technicalContext: 'USD 56.11 (+0.83% Nov 24); 1W -1.68%, 1M +0.38%; below 50 DMA (57.65), testing 200 DMA (56.74); 14d RSI ~47; Barchart 40% Buy. (KRE USD 69.76, +0.32%).',
        rsiValue: 47,
        rating1D: '40% Buy',
        verifiedCatalyst: 'Trump pledged Saturday (Nov 21) to join Democrats in pushing a 10% credit-card interest rate cap, while Moody\'s affirmed banks enter 2027 strong (Source: Stock Analysis, Nov 24).',
        subClusters: [
          { name: 'Money Center Banks', status: 'bullish', note: 'Higher yields' },
          { name: 'Regional Banks (KRE)', status: 'neutral', note: 'CRE tightening' },
          { name: 'Payment Rails (IPAY)', status: 'bearish', note: 'Card-cap risk' },
          { name: 'Private Credit', status: 'bearish', note: 'NDFI loan scrutiny' },
        ],
        clusterRationale: 'High rates help big banks; card-cap threats and credit scrutiny hurt payments & alts.',
        favoredTickers: ['JPM', 'GS', 'MS', 'BAC'],
        avoidTickers: ['AFRM', 'PYPL', 'BX', 'KKR'],
        stanceSummary: 'Selective Long',
        conviction: 'Med',
      },
      {
        id: 'C3',
        rank: 4,
        name: 'Discretionary & Media',
        primaryEtf: 'XLY',
        score: 1,
        bias: 'neutral',
        biasLabel: 'Neutral / Inflecting',
        momentumDirection: 'improving',
        momentumLabel: 'Improving',
        lifecycleStage: 'Accumulation & Troughing',
        tradingView: 'Neutral / Selective Retail',
        factorBreakdown: { a: -1, b: 1, c: 1, d: 0 },
        technicalContext: 'USD 117.72 (+0.68% Nov 24); 1W +0.53%, 1M +4.08%; above 20 DMA (114.16), 50 DMA (115.35), and 200 DMA; 14d RSI ~48–50. (XLC USD 104.45, +0.82%).',
        rsiValue: 49,
        rating1D: 'Neutral',
        verifiedCatalyst: 'US Consumer Confidence jumped to 103.3 on Nov 24 and Abercrombie raised guidance, though new tariff threats loom (Source: OCBC and Reuters, Nov 24–25).',
        subClusters: [
          { name: 'Value / Specialty Retail', status: 'reversing', note: 'Holiday demand' },
          { name: 'Autos / EVs', status: 'bearish', note: 'Tariff & rate drag' },
          { name: 'Travel / Cruise', status: 'neutral', note: 'Oil off highs vs Middle East risk' },
          { name: 'Telecom / Media (XLC)', status: 'neutral', note: 'T +2.6% FCC ruling' },
        ],
        clusterRationale: 'Strong confidence lifts value retail; tariffs & rates hit autos.',
        favoredTickers: ['TJX', 'ORLY', 'AZO', 'BKNG', 'TMUS'],
        avoidTickers: ['TSLA', 'RIVN', 'NKE', 'SNAP', 'WBD'],
        stanceSummary: 'Neutral',
        conviction: 'Low',
      },
      {
        id: 'C7',
        rank: 5,
        name: 'Commodities & Energy',
        primaryEtf: 'XLE',
        score: -1,
        bias: 'neutral',
        biasLabel: 'Neutral / Inflecting',
        momentumDirection: 'improving',
        momentumLabel: 'Improving (1W bounce)',
        lifecycleStage: 'Troughing',
        tradingView: 'Neutral / Sub-Sector Pairs',
        factorBreakdown: { a: 0, b: -1, c: 1, d: -1 },
        technicalContext: 'USD 60.45 (+0.97% Nov 24); 1W -1.37%, 1M -12.81%; below 20/50 DMA (61.24 / 62.92), holding near 200 DMA (59.77); 14d RSI ~26–33 (oversold); 1D Strong Sell. (XLB USD 50.17, +0.54%).',
        rsiValue: 30,
        rating1D: 'Strong Sell',
        verifiedCatalyst: 'EIA reported surprise +3.4M bbl crude and +5.2M bbl gas builds on Nov 18, offsetting Nov 24 Hormuz tanker attacks (Source: Reuters and DTN, Nov 18–24).',
        subClusters: [
          { name: 'Midstream / Gas', status: 'bullish', note: 'Cold snap +15% gas' },
          { name: 'Integrated / E&P', status: 'neutral', note: 'Hormuz floor vs surplus' },
          { name: 'Copper / Materials (XLB)', status: 'bearish', note: 'Copper -18.6% 1M' },
          { name: 'Gold Miners', status: 'reversing', note: 'Oversold washout' },
        ],
        clusterRationale: 'Cold weather lifts gas; surplus caps oil & AI slump hits copper.',
        favoredTickers: ['WMB', 'TRGP', 'MPC', 'LIN'],
        avoidTickers: ['FCX', 'CLF', 'DOW', 'RIG'],
        stanceSummary: 'Neutral',
        conviction: 'Med',
      },
      {
        id: 'C2',
        rank: 6,
        name: 'Software & Cyber',
        primaryEtf: 'IGV',
        score: -3,
        bias: 'bearish',
        biasLabel: 'Bearish',
        momentumDirection: 'improving',
        momentumLabel: 'Improving (1W stabilizing)',
        lifecycleStage: 'Troughing',
        tradingView: 'Pairs Only (Long Cyber / Short SaaS)',
        factorBreakdown: { a: -2, b: -1, c: 0, d: 0 },
        technicalContext: 'USD 95.35 (+0.09% Nov 24); 1W -0.41%, 1M -13.78%; holding 10/20 DMA (94.2–95.1), below 50 DMA (97.07) and 200 DMA (103.43); 14d RSI 47.8; 1D Strong Sell. (WCLD USD 40.51).',
        rsiValue: 47.8,
        rating1D: 'Strong Sell',
        verifiedCatalyst: 'Anthropic\'s USD 81.3B IPO slipped below its USD 83 offer price (Nov 24), extending software valuation anxiety (Source: CappNotes, Nov 24).',
        subClusters: [
          { name: 'Cybersecurity', status: 'reversing', note: 'Resilient AI defense budgets' },
          { name: 'Cloud / Data', status: 'neutral', note: 'Stabilizing' },
          { name: 'Application SaaS', status: 'bearish', note: 'AI seat fears' },
          { name: 'AI Platforms', status: 'bearish', note: 'Multiple compression' },
        ],
        clusterRationale: 'High real yields & seat fears hurt SaaS; cyber holds firm (inverse to XLP/XLV).',
        favoredTickers: ['PANW', 'CRWD', 'FTNT', 'PLTR'],
        avoidTickers: ['CRM', 'DOCU', 'DBX', 'RXT'],
        stanceSummary: 'Pairs Only',
        conviction: 'Med',
      },
      {
        id: 'C6',
        rank: 7,
        name: 'Industrials & Grid',
        primaryEtf: 'XLI',
        score: -3,
        bias: 'bearish',
        biasLabel: 'Bearish',
        momentumDirection: 'deteriorating',
        momentumLabel: 'Deteriorating',
        lifecycleStage: 'Markdown',
        tradingView: 'Underweight / Sell Rallies',
        factorBreakdown: { a: -1, b: -2, c: 0, d: 0 },
        technicalContext: 'USD 161.61 (-0.53% Nov 24); 1W -1.93% (pre-Tue), 1M -1.31% (pre-Tue); below 20 DMA (165.39), 50 DMA (167.74), and 200 DMA (167.63); 14d RSI ~38–44; 1D Strong Sell. (XLU USD 43.40).',
        rsiValue: 41,
        rating1D: 'Strong Sell',
        verifiedCatalyst: 'Philly Fed plunged to 6.3 and 38 of 41 local data-center ballot measures were rejected, ahead of Deere earnings today (Source: Velocity and Tipswatch, Nov 20–22).',
        subClusters: [
          { name: 'Aero & Defense', status: 'bullish', note: 'Kinetic conflict backlog' },
          { name: 'Grid / Power (XLU)', status: 'neutral', note: 'Rate drag vs load growth' },
          { name: 'Heavy Machinery', status: 'bearish', note: 'PMI cooling' },
          { name: 'Freight / Logistics', status: 'bearish', note: 'Tariff risk' },
        ],
        clusterRationale: 'Cooling factories & tariff fears outweigh defense strength.',
        favoredTickers: ['RTX', 'LMT', 'NOC', 'PWR'],
        avoidTickers: ['FDX', 'UPS', 'JBHT', 'RUN'],
        stanceSummary: 'Underweight',
        conviction: 'Med',
      },
      {
        id: 'C1',
        rank: 8,
        name: 'Tech HW & Semis',
        primaryEtf: 'SMH',
        score: -6,
        bias: 'strong-bearish',
        biasLabel: 'Strong Bearish',
        momentumDirection: 'deteriorating',
        momentumLabel: 'Deteriorating',
        lifecycleStage: 'Markdown',
        tradingView: 'Underweight / Short Bounces',
        factorBreakdown: { a: -2, b: -2, c: 0, d: -2 },
        technicalContext: 'USD 426.75 (-7.26% Nov 24); 1W -7.14%, 1M -19.05%; below 20 DMA (442.19), 50 DMA (457.51), and 200 DMA (508.16); Barchart 72% Strong Sell. (SOXX USD 128.62, -8.27%).',
        rsiValue: null,
        rating1D: '72% Strong Sell',
        verifiedCatalyst: 'Tuesday\'s chip rout (NVDA -5.9%, MU -13.8%, ADI -17.4%, HPE -16.3%) erased half of Monday\'s Huang-return squeeze (Source: Portfolio Terminal, Nov 24).',
        subClusters: [
          { name: 'Foundry / AI Silicon', status: 'bearish', note: 'SEC / China overhang' },
          { name: 'Memory / Storage', status: 'bearish', note: 'MU breakdown' },
          { name: 'Semi-Cap', status: 'bearish', note: 'China export curbs' },
          { name: 'Networking / DC HW', status: 'bearish', note: 'HPE / debt stress' },
          { name: 'Quantum', status: 'bearish', note: 'High-beta bleed' },
        ],
        clusterRationale: 'Probes, AI-debt stress & margin unwinds break trend (inverse to XLV/XLP).',
        favoredTickers: ['AVGO', 'KLAC'],
        avoidTickers: ['MU', 'AMD', 'INTC', 'WOLF', 'RGTI', 'QUBT'],
        stanceSummary: 'Short Bounces',
        conviction: 'High',
      },
    ],
  },
  section4: {
    portfolioPosture: {
      netEquityTilt: 'Defensive / Low-Beta Net Exposure (40–50% Net Long) — keep gross risk muted while VIX exceeds 25 and Fed hikes loom.',
      factorTilt: 'Tilt sharply toward Defensive Quality & Cash-Flow Value (XLV, XLP, money-center XLF) over Rate-Sensitive Growth & Cyclicals (SMH, IGV, XLI).',
      commodityTilt: 'Selective Natural Gas / Oversold Gold exposure near USD 3,500 support while avoiding Copper/Base Metals.',
      hedgeCashPosture: 'Hold 15–20% Cash / Short-Term T-Bills (yielding ~4%) plus SGOV/LQD vs HYG credit hedges.',
    },
    topPairs: [
      {
        title: 'Long XLV (C5, +7) / Short SMH (C1, -6)',
        longLeg: 'C5 (XLV)',
        shortLeg: 'C1 (SMH)',
        scoreSpread: '+13 pts',
        ratioProxy: 'XLV / SMH',
        causalThesis: 'Captures institutional rotation out of crowded, debt-heavy AI hardware into M&A-backed pharma/medtech.',
        invalidation: 'Fed abruptly pivots dovish and SMH reclaims its 50 DMA (458).',
      },
      {
        title: 'Long XLP (C4, +6) / Short IGV (C2, -3)',
        longLeg: 'C4 (XLP)',
        shortLeg: 'C2 (IGV)',
        scoreSpread: '+9 pts',
        ratioProxy: 'XLP / IGV',
        causalThesis: 'Pairs inflation-resilient staple giants (WMT, COST) against high-multiple SaaS hurt by 2.8% real yields and AI seat fears.',
        invalidation: 'DFII10 drops below 2.3% and IGV reclaims 100.',
      },
      {
        title: 'Long XLF (Money Center Banks, +2) / Short XLI (Freight & Machinery, -3)',
        longLeg: 'C8 (XLF)',
        shortLeg: 'C6 (XLI)',
        scoreSpread: '+5 pts',
        ratioProxy: 'XLF / XLI',
        causalThesis: 'Profits from sticky 4.9% yields supporting bank interest income while tariff threats and PMI cooling weigh on industrial shippers.',
        invalidation: 'HY OAS surges above 4.25% (credit crunch) or US tariffs are canceled.',
      },
    ],
    macroHedges: [
      {
        title: 'Long SGOV / Short-Duration Treasuries (or LQD vs Short HYG)',
        detail: 'Earns ~4%+ yield without long-bond duration risk while protecting against widening junk/AI credit spreads.',
      },
      {
        title: 'Long Gold (XAUUSD / GLD near USD 3,500 support) or USD/JPY Put Spreads',
        detail: 'Cushions against sudden geopolitical escalation in Hormuz or a sharp Bank of Japan intervention below 160.',
      },
    ],
    realYieldSensitivity: [
      { cluster: 'C1: Tech HW & Semis', proxy: 'SMH', sensitivityTier: 'high-negative', sensitivityLabel: 'High Negative', channel: 'Higher real discount rates crush distant AI growth valuations and raise DC debt costs' },
      { cluster: 'C2: Software & Cyber', proxy: 'IGV', sensitivityTier: 'high-negative', sensitivityLabel: 'High Negative', channel: 'Long-duration software cash flows reprice sharply lower when risk-free real yields climb' },
      { cluster: 'C3: Discretionary', proxy: 'XLY', sensitivityTier: 'moderate-negative', sensitivityLabel: 'Moderate Negative', channel: 'Higher real borrowing costs squeeze auto loans, housing, and middle-income spending' },
      { cluster: 'C4: Consumer Staples', proxy: 'XLP', sensitivityTier: 'neutral', sensitivityLabel: 'Neutral / Slight Negative', channel: 'Everyday demand stays steady, though dividend yields face competition from 4.6%–4.9% Treasuries' },
      { cluster: 'C5: Healthcare', proxy: 'XLV', sensitivityTier: 'neutral', sensitivityLabel: 'Neutral', channel: 'Clinical necessity and cash-funded pharma M&A insulate earnings from rate swings' },
      { cluster: 'C6: Industrials & Grid', proxy: 'XLI', sensitivityTier: 'moderate-negative', sensitivityLabel: 'Moderate Negative', channel: 'Higher financing costs slow capital equipment upgrades and regulated utility returns' },
      { cluster: 'C7: Commodities & Energy', proxy: 'XLE', sensitivityTier: 'bifurcated', sensitivityLabel: 'Moderate Negative (Metals) / Neutral (Oil)', channel: 'Stronger real yields boost USD and raise the opportunity cost of holding non-yielding Gold/Copper' },
      { cluster: 'C8: Financials & Banks', proxy: 'XLF', sensitivityTier: 'bifurcated', sensitivityLabel: 'Positive (Banks) / Negative (FinTech)', channel: 'Big banks earn more on cash reserves and loans; high-multiple payment fintechs de-rate' },
    ],
  },
  section5: {
    matrixPicks: [
      { id: 'b1', category: 'bullish', index: 1, subIndustry: 'Large-Cap Pharma & Bio', clusterCode: 'C5', proxies: 'XLV / LLY, MRK, VRTX', macroTrigger: 'USD 41B Sanofi-Insmed buyout & defensive cash-flow rotation', conviction: 'High' },
      { id: 'b2', category: 'bullish', index: 2, subIndustry: 'Big-Box & Grocery Staples', clusterCode: 'C4', proxies: 'XLP / WMT, COST', macroTrigger: 'Sticky 3.5% inflation & WMT beat/raise driving safety bids', conviction: 'High' },
      { id: 'b3', category: 'bullish', index: 3, subIndustry: 'Money Center & Inv. Banks', clusterCode: 'C8', proxies: 'XLF / JPM, GS, MS', macroTrigger: '95%+ Fed hike odds & ~4.9% yields lifting net interest income', conviction: 'Med' },
      { id: 'b4', category: 'bullish', index: 4, subIndustry: 'Midstream & Gas Infra', clusterCode: 'C7', proxies: 'XLE / WMB, TRGP', macroTrigger: 'US/EU cold snap spiking nat-gas + fee-based oil surplus shield', conviction: 'Med' },
      { id: 'b5', category: 'bullish', index: 5, subIndustry: 'Aerospace & Defense Primes', clusterCode: 'C6', proxies: 'XLI / RTX, LMT, NOC', macroTrigger: 'Active Hormuz/Red Sea tanker attacks locking in defense budgets', conviction: 'Med' },
      { id: 's1', category: 'bearish', index: 1, subIndustry: 'Memory & Analog Semis', clusterCode: 'C1', proxies: 'SMH / MU, STX, WDC', macroTrigger: 'AI capex doubts & earnings punishment (ADI -17%, MU -14%)', conviction: 'High' },
      { id: 's2', category: 'bearish', index: 2, subIndustry: 'Leveraged DC & Server HW', clusterCode: 'C1', proxies: 'SMH / HPE, VRT, SMCI', macroTrigger: 'AI-debt credit distress (CoreWeave CDS greater than 1,240 bps)', conviction: 'High' },
      { id: 's3', category: 'bearish', index: 3, subIndustry: 'Copper & Base Metals', clusterCode: 'C7', proxies: 'XLB / FCX', macroTrigger: 'Copper -18.6% 1M bear market on China weakness & AI slowdown', conviction: 'High' },
      { id: 's4', category: 'bearish', index: 4, subIndustry: 'Heavy Machinery & Freight', clusterCode: 'C6', proxies: 'XLI / FDX, UPS, CAT', macroTrigger: 'Cooling US factories (Philly Fed 6.3) & 16-nation tariff threat', conviction: 'Med' },
      { id: 's5', category: 'bearish', index: 5, subIndustry: 'High-Multiple App SaaS', clusterCode: 'C2', proxies: 'IGV / CRM, TEAM, DOCU', macroTrigger: '2.8% real yields & AI seat-cannibalization fears (CRM -9.5%)', conviction: 'Med' },
      { id: 'r1', category: 'reversing', index: 1, reversalTag: 'Troughing', subIndustry: 'Cybersecurity', clusterCode: 'C2', proxies: 'CIBR / PANW, CRWD, FTNT', macroTrigger: '1W stabilization as AI cyberattacks protect IT security spend', conviction: 'Med' },
      { id: 'r2', category: 'reversing', index: 2, reversalTag: 'Troughing', subIndustry: 'Value & Apparel Retail', clusterCode: 'C3', proxies: 'XLY / TJX, ANF, ORLY', macroTrigger: 'Jump in consumer confidence (103.3) lifting value-focused retail', conviction: 'Med' },
      { id: 'r3', category: 'reversing', index: 3, reversalTag: 'Troughing', subIndustry: 'MedTech & Life Tools', clusterCode: 'C5', proxies: 'IHI / ISRG, BSX, DHR', macroTrigger: 'Rebounding from early-Nov rate dip on steady surgical/lab demand', conviction: 'Med' },
      { id: 'r4', category: 'reversing', index: 4, reversalTag: 'Troughing', subIndustry: 'Gold & Precious Miners', clusterCode: 'C7', proxies: 'GDX / XAUUSD', macroTrigger: 'Oversold washout (RSI ~23) testing USD 3,500 central-bank floor', conviction: 'Low' },
      { id: 'r5', category: 'reversing', index: 5, reversalTag: 'Peaking', subIndustry: 'Payment Rails & Consumer Credit', clusterCode: 'C8', proxies: 'IPAY / V, MA, AFRM, PYPL', macroTrigger: '1W rollover on Trump\'s 10% credit-card rate cap push & subprime tightening', conviction: 'Med' },
    ],
  },
  section6: {
    capsules: [
      { id: 'b1', category: 'bullish', number: 1, title: 'Large-Cap Pharma & Bio (XLV / LLY, MRK, VRTX)', clusterCode: 'C5', thesis: 'Patent-cliff urgency is driving cash M&A while AI outflows seek steady healthcare earnings insulated from Fed hikes.', leadingIndicators: 'XLV holding above its 200 DMA (182.78) and XBI follow-through post-Sanofi/Insmed deal.', pairOffsetInvalidation: 'Pair vs Short Memory Semis; exit if XLV closes below 178 on drug-pricing legislation.' },
      { id: 'b2', category: 'bullish', number: 2, title: 'Big-Box & Grocery Staples (XLP / WMT, COST)', clusterCode: 'C4', thesis: 'Consumers trading down under ~3.5% inflation boost membership-club scale, drawing defensive institutional cash.', leadingIndicators: 'XLP holding its 50 DMA (91.47) and holiday inventory clearance margins at WMT and COST.', pairOffsetInvalidation: 'Pair vs Short App SaaS; exit if XLP weekly RSI reverses sharply from 70 on a sudden risk-on surge.' },
      { id: 'b3', category: 'bullish', number: 3, title: 'Money Center & Inv. Banks (XLF / JPM, GS, MS)', clusterCode: 'C8', thesis: 'Higher-for-longer 4.9% yields and elevated market volatility sustain net interest income and trading-desk fees.', leadingIndicators: 'XLF reclaiming its 50 DMA (57.65) and HY OAS staying below 4.00 percent.', pairOffsetInvalidation: 'Pair vs Short Heavy Machinery/Freight; exit if the 10Y-2Y curve re-inverts below 0 bps.' },
      { id: 'b4', category: 'bullish', number: 4, title: 'Midstream & Gas Infra (XLE / WMB, TRGP)', clusterCode: 'C7', thesis: 'Cold US/EU weather and record LNG exports lift natural gas while fee-based pipelines sidestep crude oil surplus swings.', leadingIndicators: 'Henry Hub (NG1!) holding USD 3.40/MMBtu and weekly EIA gas storage draws.', pairOffsetInvalidation: 'Pair vs Short Copper Miners; exit if warm El Niño forecasts crush gas below USD 3.00.' },
      { id: 'b5', category: 'bullish', number: 5, title: 'Aerospace & Defense Primes (XLI / RTX, LMT, NOC)', clusterCode: 'C6', thesis: 'Active tanker attacks in Hormuz and Red Sea tensions force sustained allied replenishment independent of US manufacturing cycles.', leadingIndicators: 'Strait of Hormuz transit incidents and ITA/RTX relative strength vs XLI.', pairOffsetInvalidation: 'Pair vs Short Freight/Logistics; exit on a verified US-Iran ceasefire or Ukraine peace breakthrough.' },
      { id: 's1', category: 'bearish', number: 6, title: 'Memory & Analog Semis (SMH / MU, STX, WDC)', clusterCode: 'C1', thesis: 'Excessive AI-cycle optimism is deflating under 2.8% real yields, triggering violent de-grossing after ADI and MU drops.', leadingIndicators: 'SMH remaining below its 20 DMA (442) and Micron (MU) failing to reclaim USD 640.', pairOffsetInvalidation: 'Pair vs Long Pharma/Bio; cover shorts if SMH closes back above 460 on volume.' },
      { id: 's2', category: 'bearish', number: 7, title: 'Leveraged DC & Server HW (SMH / HPE, VRT, SMCI)', clusterCode: 'C1', thesis: 'Debt-funded AI buildouts face surging credit costs (HPE -16.3%, CoreWeave CDS greater than 1,240 bps) and local data-center rejections.', leadingIndicators: 'CoreWeave bond yields/CDS spreads and VRT/HPE relative performance.', pairOffsetInvalidation: 'Pair vs Long Big-Box Staples; exit if DFII10 real yields plunge below 2.30 percent.' },
      { id: 's3', category: 'bearish', number: 8, title: 'Copper & Base Metals (XLB / FCX)', clusterCode: 'C7', thesis: 'Bear-market drop in copper (-18.6% 1M) reflects fading AI power hype, strong USD, and weak Chinese industrial demand.', leadingIndicators: 'HG1! staying below USD 5.60/lb and LME warehouse inventory builds.', pairOffsetInvalidation: 'Pair vs Long Midstream Gas; cover if Beijing unveils major fiscal stimulus and HG1! reclaims USD 5.80.' },
      { id: 's4', category: 'bearish', number: 9, title: 'Heavy Machinery & Freight (XLI / FDX, UPS, CAT)', clusterCode: 'C6', thesis: 'Slowing factory orders (Philly Fed 6.3) and new 16-nation tariff threats compress global freight and equipment margins.', leadingIndicators: 'XLI below its 200 DMA (167.63) and today\'s Deere (DE) guidance reaction.', pairOffsetInvalidation: 'Pair vs Long Money Center Banks; exit if US tariffs are delayed and XLI reclaims 168.' },
      { id: 's5', category: 'bearish', number: 10, title: 'High-Multiple App SaaS (IGV / CRM, TEAM, DOCU)', clusterCode: 'C2', thesis: 'Sticky real yields punish expensive software multiples while AI-agent disruption (ANT IPO stumble) threatens traditional per-seat pricing.', leadingIndicators: 'IGV resistance at its 50 DMA (97.07) and Anthropic (ANT) price action below USD 83.', pairOffsetInvalidation: 'Pair vs Long Cybersecurity; cover shorts if IGV breaks above 100 on falling yields.' },
      { id: 'r1', category: 'reversing', number: 11, reversalTag: 'Reversing Bullish: Troughing', title: 'Cybersecurity (CIBR / PANW, CRWD, FTNT)', clusterCode: 'C2', thesis: 'Unlike seat-based SaaS, security budgets remain mandatory amid AI-linked cyberattack threats, stabilizing PANW/CRWD after 1M software selling.', leadingIndicators: 'CIBR vs IGV ratio making fresh highs and CRWD holding USD 205.', pairOffsetInvalidation: 'Pair vs Short App SaaS; exit if CIBR breaks its 200 DMA or enterprise IT budgets freeze.' },
      { id: 'r2', category: 'reversing', number: 12, reversalTag: 'Reversing Bullish: Troughing', title: 'Value & Apparel Retail (XLY / TJX, ANF, ORLY)', clusterCode: 'C3', thesis: 'Consumer confidence jumping to 103.3 and falling gasoline prices support off-price and specialty apparel (XLY +4.1% 1M) over autos.', leadingIndicators: 'XLY holding its 50 DMA (115.35) and holiday Black Friday foot-traffic updates.', pairOffsetInvalidation: 'Pair vs Short Payment Rails; exit if broad retail tariffs immediately target apparel imports.' },
      { id: 'r3', category: 'reversing', number: 13, reversalTag: 'Reversing Bullish: Troughing', title: 'MedTech & Life Tools (IHI / ISRG, BSX, DHR)', clusterCode: 'C5', thesis: 'After lagging on rate spikes, surgical procedure and lab demand (A +4.3% beat) is attracting catch-up defensive inflows.', leadingIndicators: 'IHI reclaiming its 50 DMA and ISRG/BSX holding Nov 24 breakout gains.', pairOffsetInvalidation: 'Pair vs Short Leveraged DC Hardware; exit if XLV loses 178 support.' },
      { id: 'r4', category: 'reversing', number: 14, reversalTag: 'Reversing Bullish: Troughing', title: 'Gold & Precious Miners (GDX / XAUUSD)', clusterCode: 'C7', thesis: 'Deeply oversold bullion (RSI 23–31) is testing USD 3,500 support as 10Y yields ease (-19 bps 1W) and central banks buy.', leadingIndicators: 'Spot gold holding USD 3,500/oz and DXY stalling below 104.20.', pairOffsetInvalidation: 'Pair vs Short Copper Miners; exit immediately on a daily gold close below USD 3,450.' },
      { id: 'r5', category: 'reversing', number: 15, reversalTag: 'Reversing Bearish: Peaking', title: 'Payment Rails & Consumer Credit (IPAY / V, MA, AFRM, PYPL)', clusterCode: 'C8', thesis: 'Bipartisan push for a 10% credit-card interest rate cap plus subprime bank lending tightening threaten card-network and BNPL margins.', leadingIndicators: 'IPAY failing near USD 46 and XLF put/call skew staying elevated.', pairOffsetInvalidation: 'Pair vs Long Value Retail; exit if congressional leaders formally shelve rate-cap legislation.' },
    ],
  },
  section7: {
    killSwitches: [
      {
        number: 1,
        category: 'Rates / Credit',
        triggerCondition: 'US10Y closes above 5.31 percent (new 52-week high) OR HY OAS spikes above 4.25 percent.',
        prescribedAction: 'Signals inflation is spiraling out of Fed control or AI/private-credit defaults are turning systemic; cut net equity exposure to 20% and move to T-Bills (SGOV).',
      },
      {
        number: 2,
        category: 'Fear / Breadth',
        triggerCondition: 'VIX closes above 35.0 with HYG/LQD ratio falling greater than 2.5 percent over 10 days.',
        prescribedAction: 'Signals forced volatility-target fund selling across all sectors, even defensives; raise cash to 40%+ and halt all relative-value equity pairs.',
      },
      {
        number: 3,
        category: 'Commodities / Dollar',
        triggerCondition: 'Brent surges above USD 105/bbl (Hormuz closure) OR USDJPY plunges below 153.0 (violent carry unwind).',
        prescribedAction: 'Either stagflation shock or global yen-funding margin call breaks defensive staples/banks; move long volatility (VIX calls) and short beta.',
      },
      {
        number: 4,
        category: 'Correlation Breakdown',
        triggerCondition: 'Systemic Liquidity Flush — SPX drops more than 2.5 percent, US10Y rises more than 12 bps (bond prices fall), and Gold falls more than 2.0 percent on the same day.',
        prescribedAction: 'Proves cash-only margin liquidation where no asset diversifies; move immediately to 100% T-Bills/cash until correlations normalize.',
      },
    ],
  },
};

