export type Tone = 'bullish' | 'bearish' | 'reversing' | 'neutral' | 'warning';

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface BaselineMetric {
  asset: string;
  ticker: string;
  category: 'rates' | 'volatility' | 'fx' | 'commodities';
  latestClose: string;
  change1W: string;
  change1M: string;
  signal: string;
  tone: Tone;
}

export interface CatalystItem {
  title: string;
  detail: string;
  sourceDate: string;
}

export interface StressPoint {
  title: string;
  detail: string;
}

export interface BigMoveItem {
  asset: string;
  direction: 'up' | 'down' | 'volatile';
  moveLabel: string;
  dateLabel: string;
  volatilityTag: string;
  detail: string;
  sourceDate: string;
}

export interface CreditSpreadGateCheck {
  name: string;
  status: 'pass' | 'caution' | 'fail';
  detail: string;
}

export interface CreditSpreadGate {
  verdict: 'go' | 'caution' | 'wait';
  verdictLabel: string;
  summary: string;
  checks: CreditSpreadGateCheck[];
}

export interface CommodityRow {
  name: string;
  ticker: string;
  lastPrice: string;
  change1W: string;
  change1M: string;
  technicalPosture: string;
  rsiValue: number | null;
  viewBias: 'bullish' | 'bearish' | 'reversing' | 'neutral';
  viewLabel: string;
  conviction: string;
  driver: string;
}

export interface CommodityRationale {
  title: string;
  bias: 'bullish' | 'bearish' | 'reversing' | 'neutral';
  body: string;
  equityTransmission: string;
}

export interface SubClusterTag {
  name: string;
  status: 'bullish' | 'neutral' | 'bearish' | 'reversing';
  note: string;
}

export interface ClusterAnalysis {
  id: string; // e.g., 'C5'
  rank: number;
  name: string;
  primaryEtf: string;
  score: number; // -8 to +8
  bias: 'strong-bullish' | 'bullish' | 'neutral' | 'bearish' | 'strong-bearish';
  biasLabel: string;
  momentumDirection: 'improving' | 'stable' | 'deteriorating';
  momentumLabel: string;
  lifecycleStage: string;
  tradingView: string;
  factorBreakdown: {
    a: number;
    b: number;
    c: number;
    d: number;
  };
  technicalContext: string;
  rsiValue: number | null;
  rating1D: string;
  verifiedCatalyst: string;
  subClusters: SubClusterTag[];
  clusterRationale: string;
  favoredTickers: string[];
  avoidTickers: string[];
  stanceSummary: string;
  conviction: string;
}

export interface LongShortPair {
  title: string;
  longLeg: string;
  shortLeg: string;
  scoreSpread: string;
  ratioProxy: string;
  causalThesis: string;
  invalidation: string;
}

export interface RealYieldSensitivityRow {
  cluster: string;
  proxy: string;
  sensitivityTier: 'high-negative' | 'moderate-negative' | 'neutral' | 'positive' | 'bifurcated';
  sensitivityLabel: string;
  channel: string;
}

export interface MatrixPick {
  id: string;
  category: 'bullish' | 'bearish' | 'reversing';
  index: number;
  reversalTag?: 'Troughing' | 'Peaking';
  subIndustry: string;
  clusterCode: string;
  proxies: string;
  macroTrigger: string;
  conviction: string;
}

export interface TacticalCapsule {
  id: string;
  category: 'bullish' | 'bearish' | 'reversing';
  number: number;
  title: string;
  clusterCode: string;
  reversalTag?: string;
  thesis: string;
  leadingIndicators: string;
  pairOffsetInvalidation: string;
}

export interface KillSwitch {
  number: number;
  category: string;
  triggerCondition: string;
  prescribedAction: string;
}

export interface MacroReport {
  id: string;
  createdAt: string;
  sourceLabel: string;
  promptSnippet: string;
  rawMarkdown: string;
  sources: GroundingSource[];
  section1: {
    weekInBrief?: string;
    bigMoves?: BigMoveItem[];
    verificationTimestamp: string;
    baselineMetrics: BaselineMetric[];
    creditSpreadGate?: CreditSpreadGate;
    catalysts: CatalystItem[];
    upcomingCalendar: string;
    regimeName: string;
    causalChain: string[];
    stressPoints: StressPoint[];
  };
  section2: {
    commodities: CommodityRow[];
    rationales: CommodityRationale[];
    copperGoldSignal: string;
  };
  section3: {
    clusters: ClusterAnalysis[];
  };
  section4: {
    portfolioPosture: {
      netEquityTilt: string;
      factorTilt: string;
      commodityTilt: string;
      hedgeCashPosture: string;
    };
    topPairs: LongShortPair[];
    macroHedges: { title: string; detail: string }[];
    realYieldSensitivity: RealYieldSensitivityRow[];
  };
  section5: {
    matrixPicks: MatrixPick[];
  };
  section6: {
    capsules: TacticalCapsule[];
  };
  section7: {
    killSwitches: KillSwitch[];
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  reportId?: string;
  isError?: boolean;
  mode?: 'live-search' | 'parsed-report' | 'follow-up' | 'baseline';
}

export interface ClusterReferenceDefinition {
  code: string;
  name: string;
  proxies: string;
  positiveCorr: string;
  inverseCorr: string;
  neutralOrthogonal: string;
  whatItIs: string;
  coreDriver: string;
  sampleTickers: string[];
}

export interface StockHeadlineItem {
  headline: string;
  sourceDate: string;
  impact: 'bullish' | 'bearish' | 'neutral';
  sentimentScore?: number;
  publisher?: string;
  ageLabel?: string;
  url?: string;
}

export interface LiveTapeQuote {
  symbol: string;
  label: string;
  last: number | null;
  changePct: number | null;
  perf1W: number | null;
  perf1M: number | null;
}

export interface LiveMarketTape {
  fetchedAt: string;
  vix: LiveTapeQuote;
  us10y: LiveTapeQuote;
  dxy: LiveTapeQuote;
  spy: LiveTapeQuote;
  rsp: LiveTapeQuote;
  breadth1W: number | null; // RSP 1W - SPY 1W
  breadth1M: number | null; // RSP 1M - SPY 1M
  vixRegime: 'calm' | 'normal' | 'elevated' | 'stress' | 'unknown';
  vixLabel: string;
  breadthLabel: string;
}

export interface StockWatchlistItem {
  symbol: string;
  exchangeOverride?: string;
  companyName: string;
  industry: string;
  mappedClusterId: string; // 'C1'..'C8', 'BROAD', or ''
  lastFetchedAt: string | null;
  fetchStatus: 'idle' | 'loading' | 'ready' | 'error';
  fetchError: string | null;
  currentPrice: number | null;
  premarketPrice?: number | null;
  premarketChangePct?: number | null;
  premarketVolume?: number | null;
  priceCurrency: string;
  analystIntrinsicValue: number | null; // Median analyst price target from TradingView
  valuationSource: string;
  forwardPe?: number | null; // Price / Next-FY EPS forecast
  trailingPe?: number | null;
  pegRatio?: number | null;
  evToEbitda?: number | null;
  priceToSales?: number | null;
  fcfYieldPct?: number | null;
  evToSales?: number | null;
  evToGrossProfit?: number | null;
  priceToBook?: number | null;
  grossMarginPct?: number | null;
  rsi14?: number | null;
  sma50?: number | null;
  sma200?: number | null;
  perf1W?: number | null;
  perf1M?: number | null;
  beta1Y?: number | null;
  epsRevisionDir?: 'up' | 'flat' | 'down' | 'unknown' | null;
  epsRevisionNote?: string;
  newsScore: number | null; // -10 to +10
  newsBias: 'bullish' | 'neutral' | 'bearish' | null;
  headlineCount: number;
  oneLineTakeaway: string;
  plainTextSource: string;
  earningsDate: string;
  earningsWithinDays: number | null;
  catalystWarning: string;
  plainEnglishReason: string;
  recentHeadlines: StockHeadlineItem[];
}

export type CombinedVerdictTier =
  | 'strong-bullish'
  | 'bullish'
  | 'mixed'
  | 'bearish'
  | 'strong-bearish'
  | 'pending';

export type ConflictStatus =
  | 'aligned-bullish'
  | 'aligned-bearish'
  | 'aligned-neutral'
  | 'conflict-bull-news'
  | 'conflict-bear-news'
  | 'pending';

export type EarningsRiskLevel = 'imminent' | 'upcoming' | 'clear' | 'unknown';

export interface StockEvaluationRow {
  item: StockWatchlistItem;
  clusterCode: string;
  clusterName: string;
  primaryEtf: string;
  macroScore: number | null; // -8 to +8
  macroBias: 'strong-bullish' | 'bullish' | 'neutral' | 'bearish' | 'strong-bearish' | null;
  macroBiasLabel: string;
  watchlistStance: 'favored' | 'avoid' | 'member' | 'unmapped';
  combinedScore: number | null; // -10 to +10
  verdictTier: CombinedVerdictTier;
  verdictLabel: string;
  conflictStatus: ConflictStatus;
  conflictLabel: string;
  conflictDetail: string;
  earningsRiskLevel: EarningsRiskLevel;
  valuationDiffPct: number | null; // ((currentPrice - analystIntrinsicValue) / analystIntrinsicValue) * 100
  valuationStatus: 'undervalued' | 'overvalued' | 'fair' | 'unknown';
  dmaStatus: 'above-all' | 'above-50' | 'above-200' | 'below-all' | 'unknown';
  dmaLabel: string;
  rsiZone: 'overbought' | 'oversold' | 'neutral' | 'unknown';
  priceNewsDivergence: 'bull-news-drop' | 'bear-news-rally' | 'none';
  businessStyle: 'compounder' | 'cyclical' | 'growth' | 'financial' | 'etf';
  matchedMetricLabel: string;
  matchedMetricTone: 'bullish' | 'neutral' | 'warning';
  eyMinus10yPct: number | null;
  clusterMedianFwdPe: number | null;
  relFwdPeVsClusterPct: number | null;
}

