import { CLUSTER_REFERENCE_MAP } from '../data/referenceBaseline';
import {
  ClusterAnalysis,
  CombinedVerdictTier,
  ConflictStatus,
  EarningsRiskLevel,
  MacroReport,
  StockEvaluationRow,
  StockWatchlistItem,
} from '../types/macro';

const EXTRA_TICKER_CLUSTER_MAP: Record<string, string> = {
  AAPL: 'C1',
  TSM: 'C1',
  QQQ: 'C1',
  ARM: 'C1',
  SMCI: 'C1',
  DELL: 'C1',
  ORCL: 'C2',
  MSFT: 'C2',
  ADBE: 'C2',
  INTU: 'C2',
  SHOP: 'C2',
  GOOGL: 'C3',
  GOOG: 'C3',
  META: 'C3',
  AMZN: 'C3',
  SPOT: 'C3',
  UBER: 'C3',
  ABNB: 'C3',
  HD: 'C3',
  LOW: 'C3',
  MCD: 'C3',
  PEP: 'C4',
  KR: 'C4',
  MRK: 'C5',
  JNJ: 'C5',
  PFE: 'C5',
  BMY: 'C5',
  REGN: 'C5',
  GE: 'C6',
  ETN: 'C6',
  HON: 'C6',
  URI: 'C6',
  SLB: 'C7',
  COP: 'C7',
  EOG: 'C7',
  NEM: 'C7',
  SCCO: 'C7',
  GS: 'C8',
  SCHW: 'C8',
  AXP: 'C8',
  COF: 'C8',
  SOFI: 'C8',
  COIN: 'C8',
  SPY: 'BROAD',
  VOO: 'BROAD',
  IVV: 'BROAD',
  DIA: 'BROAD',
  IWM: 'BROAD',
  RSP: 'BROAD',
  MRVL: 'C1',
  CDNS: 'C1',
  ASML: 'C1',
  NBIS: 'C1',
  IONQ: 'C1',
  IREN: 'C1',
  FTNT: 'C2',
  NOW: 'C2',
  PANW: 'C2',
  PLTR: 'C2',
  NFLX: 'C3',
  VRT: 'C6',
  CEG: 'C6',
  MTZ: 'C6',
  RKLB: 'C6',
  XOM: 'C7',
  GLD: 'C7',
  MP: 'C7',
  COST: 'C4',
  WMT: 'C4',
  NU: 'C8',
  HOOD: 'C8',
  IBIT: 'C8',
};

export interface ParsedWatchlistEntry {
  symbol: string;
  exchangeOverride?: string;
}

export const DEFAULT_WATCHLIST_STRING =
  'SPY, QQQ, AAPL, AMZN, GOOGL, META, MSFT, NVDA, TSM, CDNS, ASML, MRVL, AVGO, ETN, VRT, CEG, FTNT, NOW, NFLX, PANW, PLTR, NU, MA, V, JNJ, ISRG, UNH, LLY, COST, XOM, WMT, IBIT, GLD, MTZ, NBIS, RKLB, HOOD, MP, IONQ, IREN';

/**
 * Parse raw user input (comma, newline, space, or semicolon separated) into clean unique entries,
 * supporting optional EXCHANGE:TICKER format (e.g. NYSE:IONQ).
 */
export function parseWatchlistEntries(raw: string): ParsedWatchlistEntry[] {
  const seen = new Set<string>();
  const entries: ParsedWatchlistEntry[] = [];
  const tokens = raw
    .toUpperCase()
    .split(/[\s,;\n\r\t]+/)
    .map((t) => t.replace(/^\$/, '').trim())
    .filter(Boolean);

  for (const token of tokens) {
    const colonIdx = token.indexOf(':');
    if (colonIdx > 0) {
      const ex = token.slice(0, colonIdx).trim();
      const sym = token.slice(colonIdx + 1).trim();
      if (/^[A-Z]{2,12}$/.test(ex) && /^[A-Z0-9]{1,6}(?:[.-][A-Z0-9]{1,3})?$/.test(sym)) {
        if (!seen.has(sym)) {
          seen.add(sym);
          entries.push({ symbol: sym, exchangeOverride: ex });
        }
      }
    } else if (/^[A-Z0-9]{1,6}(?:[.-][A-Z0-9]{1,3})?$/.test(token)) {
      if (!seen.has(token)) {
        seen.add(token);
        entries.push({ symbol: token });
      }
    }
  }

  return entries;
}

/**
 * Parse raw user input into clean unique uppercase ticker symbols.
 */
export function parseTickerInput(raw: string): string[] {
  return parseWatchlistEntries(raw).map((e) => e.symbol);
}

/**
 * Resolve which MacroRegime cluster (C1-C8 or BROAD) a ticker belongs to.
 */
export function resolveClusterCodeForTicker(
  symbol: string,
  report: MacroReport,
  fallbackClusterId?: string
): string {
  const upper = symbol.toUpperCase();

  for (const cluster of report.section3.clusters) {
    if (
      cluster.favoredTickers.some((t) => t.toUpperCase() === upper) ||
      cluster.avoidTickers.some((t) => t.toUpperCase() === upper)
    ) {
      return cluster.id.toUpperCase();
    }
  }

  for (const ref of CLUSTER_REFERENCE_MAP) {
    if (ref.sampleTickers.some((t) => t.toUpperCase() === upper)) {
      return ref.code.toUpperCase();
    }
    if (ref.proxies.toUpperCase().split(/[,\s]+/).includes(upper)) {
      return ref.code.toUpperCase();
    }
  }

  if (EXTRA_TICKER_CLUSTER_MAP[upper]) {
    return EXTRA_TICKER_CLUSTER_MAP[upper];
  }

  if (fallbackClusterId) {
    const clean = fallbackClusterId.trim().toUpperCase();
    if (/^C[1-8]$/.test(clean) || clean === 'BROAD') {
      return clean;
    }
  }

  return '';
}

export function createEmptyWatchlistItem(
  symbol: string,
  report: MacroReport,
  exchangeOverride?: string
): StockWatchlistItem {
  const upper = symbol.toUpperCase();
  const resolvedClusterId = resolveClusterCodeForTicker(upper, report);

  return {
    symbol: upper,
    exchangeOverride,
    companyName: '',
    industry: '',
    mappedClusterId: resolvedClusterId,
    lastFetchedAt: null,
    fetchStatus: 'idle',
    fetchError: null,
    currentPrice: null,
    premarketPrice: null,
    premarketChangePct: null,
    premarketVolume: null,
    priceCurrency: 'USD',
    analystIntrinsicValue: null,
    valuationSource: '',
    forwardPe: null,
    trailingPe: null,
    pegRatio: null,
    evToEbitda: null,
    priceToSales: null,
    fcfYieldPct: null,
    evToSales: null,
    evToGrossProfit: null,
    priceToBook: null,
    grossMarginPct: null,
    rsi14: null,
    sma50: null,
    sma200: null,
    perf1W: null,
    perf1M: null,
    beta1Y: null,
    epsRevisionDir: null,
    epsRevisionNote: '',
    newsScore: null,
    newsBias: null,
    headlineCount: 0,
    oneLineTakeaway: '',
    plainTextSource: '',
    earningsDate: '',
    earningsWithinDays: null,
    catalystWarning: '',
    plainEnglishReason: '',
    recentHeadlines: [],
  };
}

function getMacroDirection(
  score: number | null
): 'bullish' | 'neutral' | 'bearish' | null {
  if (score === null) return null;
  if (score >= 2) return 'bullish';
  if (score <= -2) return 'bearish';
  return 'neutral';
}

function getNewsDirection(
  score: number | null,
  bias: StockWatchlistItem['newsBias']
): 'bullish' | 'neutral' | 'bearish' | null {
  if (score === null) return null;
  if (bias === 'bullish' || score >= 2) return 'bullish';
  if (bias === 'bearish' || score <= -2) return 'bearish';
  return 'neutral';
}

const COMPOUNDER_SYMBOLS = new Set([
  'AAPL', 'MSFT', 'GOOGL', 'GOOG', 'META', 'AMZN', 'NFLX', 'V', 'MA',
  'JNJ', 'ISRG', 'UNH', 'LLY', 'MRK', 'PFE', 'COST', 'WMT', 'PG', 'KO', 'PEP', 'BKNG', 'HD', 'LOW',
]);
const GROWTH_SYMBOLS = new Set([
  'PLTR', 'NOW', 'PANW', 'CRWD', 'FTNT', 'CDNS', 'NBIS', 'RKLB', 'IONQ', 'IREN', 'ORCL', 'ADBE', 'INTU', 'SHOP',
]);
const CYCLICAL_SYMBOLS = new Set([
  'NVDA', 'TSM', 'ASML', 'MRVL', 'AVGO', 'AMD', 'ETN', 'VRT', 'CEG', 'MTZ', 'XOM', 'MP', 'SLB', 'COP', 'EOG', 'FCX',
]);
const FINANCIAL_SYMBOLS = new Set(['NU', 'HOOD', 'JPM', 'GS', 'MS', 'BAC', 'C', 'USB', 'SCHW', 'COF', 'SOFI']);

export function classifyBusinessStyle(
  symbol: string,
  clusterCode: string,
  item: StockWatchlistItem
): StockEvaluationRow['businessStyle'] {
  const upper = symbol.toUpperCase();
  if (
    clusterCode === 'BROAD' ||
    upper === 'GLD' ||
    upper === 'IBIT' ||
    /etf|exchange traded fund/i.test(item.industry)
  ) {
    return 'etf';
  }
  if (COMPOUNDER_SYMBOLS.has(upper)) return 'compounder';
  if (FINANCIAL_SYMBOLS.has(upper) || (clusterCode === 'C8' && upper !== 'V' && upper !== 'MA')) {
    return 'financial';
  }
  if (GROWTH_SYMBOLS.has(upper)) return 'growth';
  if (CYCLICAL_SYMBOLS.has(upper) || clusterCode === 'C1' || clusterCode === 'C6' || clusterCode === 'C7') {
    return 'cyclical';
  }
  if (clusterCode === 'C2') return 'growth';
  if (clusterCode === 'C4' || clusterCode === 'C5') return 'compounder';
  return 'compounder';
}

export function computeClusterMedianFwdPeMap(
  watchlist: StockWatchlistItem[],
  report: MacroReport
): Map<string, number> {
  const buckets = new Map<string, number[]>();
  for (const item of watchlist) {
    if (typeof item.forwardPe !== 'number' || !Number.isFinite(item.forwardPe) || item.forwardPe <= 0) {
      continue;
    }
    const code = resolveClusterCodeForTicker(item.symbol, report, item.mappedClusterId);
    if (!code || code === 'BROAD') continue;
    const arr = buckets.get(code) ?? [];
    arr.push(item.forwardPe);
    buckets.set(code, arr);
  }
  const medians = new Map<string, number>();
  for (const [code, vals] of buckets.entries()) {
    if (vals.length < 2) continue;
    const sorted = [...vals].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const med =
      sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    medians.set(code, Number(med.toFixed(1)));
  }
  return medians;
}

export function evaluateStockRow(
  item: StockWatchlistItem,
  report: MacroReport,
  us10yYield: number | null = null,
  clusterMedianFwdPeMap?: Map<string, number>
): StockEvaluationRow {
  const clusterCode = resolveClusterCodeForTicker(
    item.symbol,
    report,
    item.mappedClusterId
  );

  const isBroadIndex = clusterCode === 'BROAD';
  const matchedCluster: ClusterAnalysis | undefined = isBroadIndex
    ? undefined
    : report.section3.clusters.find((c) => c.id.toUpperCase() === clusterCode);
  const matchedRef = CLUSTER_REFERENCE_MAP.find(
    (r) => r.code.toUpperCase() === clusterCode
  );

  const rawName = isBroadIndex
    ? 'Broad US Equity Index'
    : matchedCluster?.name || matchedRef?.name || item.industry || 'Custom Ticker';
  const clusterName = clusterCode
    ? rawName.replace(new RegExp(`^${clusterCode}\\s*:\\s*`, 'i'), '')
    : rawName;
  const primaryEtf = isBroadIndex
    ? item.symbol
    : matchedCluster?.primaryEtf ||
      (matchedRef ? matchedRef.proxies.split(',')[0].trim() : 'N/A');

  const upper = item.symbol.toUpperCase();
  let watchlistStance: StockEvaluationRow['watchlistStance'] = 'unmapped';
  if (matchedCluster) {
    if (matchedCluster.favoredTickers.some((t) => t.toUpperCase() === upper)) {
      watchlistStance = 'favored';
    } else if (matchedCluster.avoidTickers.some((t) => t.toUpperCase() === upper)) {
      watchlistStance = 'avoid';
    } else {
      watchlistStance = 'member';
    }
  } else if (isBroadIndex) {
    watchlistStance = 'member';
  }

  // Broad equity indices compute average across all 8 macro clusters
  let macroScore: number | null = matchedCluster ? matchedCluster.score : null;
  let macroBias: StockEvaluationRow['macroBias'] = matchedCluster
    ? matchedCluster.bias
    : null;
  let macroBiasLabel = matchedCluster ? matchedCluster.biasLabel : 'Needs Refresh';

  if (isBroadIndex && report.section3.clusters.length > 0) {
    const avg =
      report.section3.clusters.reduce((acc, c) => acc + c.score, 0) /
      report.section3.clusters.length;
    macroScore = Math.round(avg);
    if (macroScore >= 2) {
      macroBias = 'bullish';
      macroBiasLabel = 'Net Risk-On';
    } else if (macroScore <= -2) {
      macroBias = 'bearish';
      macroBiasLabel = 'Net Defensive / Cautious';
    } else {
      macroBias = 'neutral';
      macroBiasLabel = 'Bifurcated / Rotation';
    }
  }

  // News evaluation
  const hasNews = item.newsScore !== null && item.fetchStatus !== 'idle';
  const macroDir = getMacroDirection(macroScore);
  const newsDir = getNewsDirection(item.newsScore, item.newsBias);

  // Compute combined score (-10 to +10) when news exists
  let combinedScore: number | null = null;
  let verdictTier: CombinedVerdictTier = 'pending';
  let verdictLabel = 'Pending Refresh';

  if (hasNews && item.newsScore !== null) {
    const normalizedMacro =
      macroScore !== null ? (macroScore / 8) * 10 : 0;

    const rawBlend =
      macroScore !== null
        ? item.newsScore * 0.6 + normalizedMacro * 0.4
        : item.newsScore;
    combinedScore = Math.max(-10, Math.min(10, Math.round(rawBlend)));

    if (combinedScore >= 5) {
      verdictTier = 'strong-bullish';
      verdictLabel = 'Strong Bullish';
    } else if (combinedScore >= 2) {
      verdictTier = 'bullish';
      verdictLabel = 'Bullish';
    } else if (combinedScore <= -5) {
      verdictTier = 'strong-bearish';
      verdictLabel = 'Strong Bearish';
    } else if (combinedScore <= -2) {
      verdictTier = 'bearish';
      verdictLabel = 'Bearish';
    } else {
      verdictTier = 'mixed';
      verdictLabel = 'Mixed / Watch';
    }
  }

  // Conflict detection between Macro Regime and Recent News
  let conflictStatus: ConflictStatus = 'pending';
  let conflictLabel = 'Pending News';
  let conflictDetail =
    'Click Refresh to fetch live TradingView pricing and 7-day headlines.';

  if (hasNews && item.newsScore !== null) {
    if (macroDir === 'bearish' && newsDir === 'bullish') {
      conflictStatus = 'conflict-bull-news';
      conflictLabel = 'Conflict: Bullish News vs Bearish Macro';
      conflictDetail = `${item.symbol} has positive recent news (${item.newsScore > 0 ? `+${item.newsScore}` : item.newsScore}), but sits inside a bearish cluster (${clusterCode || 'Sector'} macro score ${macroScore}). Keep sizing tighter because macro headwinds can fade rallies.`;
    } else if (macroDir === 'bullish' && newsDir === 'bearish') {
      conflictStatus = 'conflict-bear-news';
      conflictLabel = 'Conflict: Bearish News vs Bullish Macro';
      conflictDetail = `${item.symbol} sits inside a bullish macro cluster (${clusterCode || 'Sector'} score +${macroScore}), but recent headlines are negative (${item.newsScore}). Wait for news dust to settle before treating it as a macro buy.`;
    } else if (macroDir === 'bullish' && newsDir === 'bullish') {
      conflictStatus = 'aligned-bullish';
      conflictLabel = 'Aligned Bullish';
      conflictDetail = `Both the ${clusterCode} macro backdrop (+${macroScore}) and recent company news (+${item.newsScore}) point upward.`;
    } else if (macroDir === 'bearish' && newsDir === 'bearish') {
      conflictStatus = 'aligned-bearish';
      conflictLabel = 'Aligned Bearish';
      conflictDetail = `Both the ${clusterCode} macro backdrop (${macroScore}) and recent company news (${item.newsScore}) confirm downside pressure.`;
    } else {
      conflictStatus = 'aligned-neutral';
      conflictLabel = 'No Major Conflict';
      conflictDetail =
        macroScore !== null
          ? `Macro cluster (${macroScore > 0 ? `+${macroScore}` : macroScore}) and recent news (${item.newsScore > 0 ? `+${item.newsScore}` : item.newsScore}) are not sharply opposing each other.`
          : 'News sentiment evaluated; cluster mapping is neutral.';
    }
  }

  // Earnings risk classification
  let earningsRiskLevel: EarningsRiskLevel = 'unknown';
  if (item.earningsWithinDays !== null && Number.isFinite(item.earningsWithinDays)) {
    if (item.earningsWithinDays >= 0 && item.earningsWithinDays <= 14) {
      earningsRiskLevel = 'imminent';
    } else if (item.earningsWithinDays > 14 && item.earningsWithinDays <= 30) {
      earningsRiskLevel = 'upcoming';
    } else {
      earningsRiskLevel = 'clear';
    }
  } else if (item.earningsDate && !/not|n\/a|unknown|—/i.test(item.earningsDate)) {
    earningsRiskLevel = 'clear';
  }

  // Valuation calculation vs TradingView Analyst Median Intrinsic Value
  let valuationDiffPct: number | null = null;
  let valuationStatus: StockEvaluationRow['valuationStatus'] = 'unknown';
  if (
    typeof item.currentPrice === 'number' &&
    Number.isFinite(item.currentPrice) &&
    item.currentPrice > 0 &&
    typeof item.analystIntrinsicValue === 'number' &&
    Number.isFinite(item.analystIntrinsicValue) &&
    item.analystIntrinsicValue > 0
  ) {
    valuationDiffPct =
      ((item.currentPrice - item.analystIntrinsicValue) / item.analystIntrinsicValue) *
      100;
    if (valuationDiffPct <= -2) {
      valuationStatus = 'undervalued';
    } else if (valuationDiffPct >= 2) {
      valuationStatus = 'overvalued';
    } else {
      valuationStatus = 'fair';
    }
  }

  // Technical stretch: 14-day RSI & 50/200 DMA posture
  let dmaStatus: StockEvaluationRow['dmaStatus'] = 'unknown';
  let dmaLabel = '';
  const px = item.currentPrice;
  const s50 = item.sma50 ?? null;
  const s200 = item.sma200 ?? null;
  if (typeof px === 'number' && px > 0 && s50 !== null && s200 !== null) {
    if (px >= s50 && px >= s200) {
      dmaStatus = 'above-all';
      dmaLabel = '>50/200d';
    } else if (px >= s50 && px < s200) {
      dmaStatus = 'above-50';
      dmaLabel = '>50d <200d';
    } else if (px < s50 && px >= s200) {
      dmaStatus = 'above-200';
      dmaLabel = '<50d >200d';
    } else {
      dmaStatus = 'below-all';
      dmaLabel = '<50/200d';
    }
  } else if (typeof px === 'number' && px > 0 && s50 !== null) {
    dmaStatus = px >= s50 ? 'above-50' : 'below-all';
    dmaLabel = px >= s50 ? '>50d' : '<50d';
  }

  let rsiZone: StockEvaluationRow['rsiZone'] = 'unknown';
  if (typeof item.rsi14 === 'number' && Number.isFinite(item.rsi14)) {
    if (item.rsi14 >= 70) rsiZone = 'overbought';
    else if (item.rsi14 <= 30) rsiZone = 'oversold';
    else rsiZone = 'neutral';
  }

  // Price vs. News divergence: strong news contradicting meaningful 1W price move
  let priceNewsDivergence: StockEvaluationRow['priceNewsDivergence'] = 'none';
  if (
    hasNews &&
    item.newsScore !== null &&
    typeof item.perf1W === 'number' &&
    Number.isFinite(item.perf1W)
  ) {
    if (item.newsScore >= 3 && item.perf1W <= -3) {
      priceNewsDivergence = 'bull-news-drop';
    } else if (item.newsScore <= -3 && item.perf1W >= 3) {
      priceNewsDivergence = 'bear-news-rally';
    }
  }

  const businessStyle = classifyBusinessStyle(item.symbol, clusterCode, item);

  let matchedMetricLabel = '';
  let matchedMetricTone: StockEvaluationRow['matchedMetricTone'] = 'neutral';
  if (businessStyle === 'compounder') {
    if (typeof item.fcfYieldPct === 'number' && Number.isFinite(item.fcfYieldPct)) {
      matchedMetricLabel = `FCF ${item.fcfYieldPct.toFixed(1)}%`;
      matchedMetricTone =
        item.fcfYieldPct >= 3.5 ? 'bullish' : item.fcfYieldPct < 1.5 ? 'warning' : 'neutral';
    } else if (typeof item.evToEbitda === 'number' && Number.isFinite(item.evToEbitda)) {
      matchedMetricLabel = `EV/EBITDA ${item.evToEbitda.toFixed(1)}x`;
    }
  } else if (businessStyle === 'cyclical') {
    if (typeof item.evToEbitda === 'number' && Number.isFinite(item.evToEbitda)) {
      matchedMetricLabel = `EV/EBITDA ${item.evToEbitda.toFixed(1)}x`;
      matchedMetricTone =
        item.evToEbitda <= 14 ? 'bullish' : item.evToEbitda >= 26 ? 'warning' : 'neutral';
    } else if (typeof item.priceToBook === 'number' && Number.isFinite(item.priceToBook)) {
      matchedMetricLabel = `P/B ${item.priceToBook.toFixed(1)}x`;
    } else if (typeof item.evToSales === 'number' && Number.isFinite(item.evToSales)) {
      matchedMetricLabel = `EV/S ${item.evToSales.toFixed(1)}x`;
    }
  } else if (businessStyle === 'growth') {
    if (typeof item.evToGrossProfit === 'number' && Number.isFinite(item.evToGrossProfit)) {
      matchedMetricLabel = `EV/GP ${item.evToGrossProfit.toFixed(1)}x`;
      matchedMetricTone =
        item.evToGrossProfit <= 15 ? 'bullish' : item.evToGrossProfit >= 35 ? 'warning' : 'neutral';
    } else if (typeof item.evToSales === 'number' && Number.isFinite(item.evToSales)) {
      matchedMetricLabel = `EV/S ${item.evToSales.toFixed(1)}x`;
      matchedMetricTone =
        item.evToSales <= 8 ? 'bullish' : item.evToSales >= 20 ? 'warning' : 'neutral';
    } else if (typeof item.priceToSales === 'number' && Number.isFinite(item.priceToSales)) {
      matchedMetricLabel = `P/S ${item.priceToSales.toFixed(1)}x`;
    }
  } else if (businessStyle === 'financial') {
    if (typeof item.priceToBook === 'number' && Number.isFinite(item.priceToBook)) {
      matchedMetricLabel = `P/B ${item.priceToBook.toFixed(1)}x`;
      matchedMetricTone =
        item.priceToBook <= 1.8 ? 'bullish' : item.priceToBook >= 5 ? 'warning' : 'neutral';
    } else if (typeof item.fcfYieldPct === 'number' && Number.isFinite(item.fcfYieldPct)) {
      matchedMetricLabel = `FCF ${item.fcfYieldPct.toFixed(1)}%`;
    }
  }

  let eyMinus10yPct: number | null = null;
  if (
    businessStyle !== 'etf' &&
    typeof item.forwardPe === 'number' &&
    Number.isFinite(item.forwardPe) &&
    item.forwardPe > 0 &&
    typeof us10yYield === 'number' &&
    Number.isFinite(us10yYield) &&
    us10yYield > 0
  ) {
    eyMinus10yPct = Number((100 / item.forwardPe - us10yYield).toFixed(2));
  }

  const clusterMedianFwdPe =
    clusterCode && clusterMedianFwdPeMap?.has(clusterCode)
      ? (clusterMedianFwdPeMap.get(clusterCode) ?? null)
      : null;
  let relFwdPeVsClusterPct: number | null = null;
  if (
    clusterMedianFwdPe !== null &&
    clusterMedianFwdPe > 0 &&
    typeof item.forwardPe === 'number' &&
    Number.isFinite(item.forwardPe) &&
    item.forwardPe > 0
  ) {
    relFwdPeVsClusterPct = Number(
      (((item.forwardPe - clusterMedianFwdPe) / clusterMedianFwdPe) * 100).toFixed(1)
    );
  }

  return {
    item,
    clusterCode: clusterCode || 'CUSTOM',
    clusterName,
    primaryEtf,
    macroScore,
    macroBias,
    macroBiasLabel,
    watchlistStance,
    combinedScore,
    verdictTier,
    verdictLabel,
    conflictStatus,
    conflictLabel,
    conflictDetail,
    earningsRiskLevel,
    valuationDiffPct,
    valuationStatus,
    dmaStatus,
    dmaLabel,
    rsiZone,
    priceNewsDivergence,
    businessStyle,
    matchedMetricLabel,
    matchedMetricTone,
    eyMinus10yPct,
    clusterMedianFwdPe,
    relFwdPeVsClusterPct,
  };
}
