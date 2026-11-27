import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowDownRight,
  ArrowUp,
  ArrowUpDown,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Minus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import {
  LiveMarketTape,
  MacroReport,
  StockEvaluationRow,
  StockWatchlistItem,
} from '../types/macro';
import {
  computeClusterMedianFwdPeMap,
  DEFAULT_WATCHLIST_STRING,
  evaluateStockRow,
  ParsedWatchlistEntry,
  parseWatchlistEntries,
} from '../utils/stockSentiment';
import { LiveTapeStrip } from './LiveTapeStrip';

interface StocksSentimentViewProps {
  activeReport: MacroReport;
  watchlist: StockWatchlistItem[];
  liveTape: LiveMarketTape | null;
  isTapeLoading: boolean;
  onRefreshTape: () => void;
  isBatchRefreshing: boolean;
  batchProgress: { done: number; total: number } | null;
  globalError: string | null;
  onSaveWatchlistEntries: (entries: ParsedWatchlistEntry[]) => { total: number; addedCount: number };
  onRemoveTicker: (symbol: string) => void;
  onClearAll: () => void;
  onRefreshTickers: (symbols: string[]) => void;
}

type FilterMode = 'all' | 'bullish' | 'neutral' | 'bearish' | 'conflicts' | 'divergence' | 'earnings' | 'pending';
type SortKey = 'order' | 'combined' | 'news' | 'alpha' | 'price' | 'intrinsic' | 'undervalued' | 'earnings' | 'updated';
type SortDir = 'asc' | 'desc';

function formatUpdatedAge(isoString: string | null): string {
  if (!isoString) return 'Pending';
  const ms = Date.now() - new Date(isoString).getTime();
  if (!Number.isFinite(ms) || ms < 0) return 'Just now';
  const mins = Math.floor(ms / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function serializeWatchlistToText(list: StockWatchlistItem[]): string {
  return list
    .map((item) => (item.exchangeOverride ? `${item.exchangeOverride}:${item.symbol}` : item.symbol))
    .join(', ');
}

export function StocksSentimentView({
  activeReport,
  watchlist,
  liveTape,
  isTapeLoading,
  onRefreshTape,
  isBatchRefreshing,
  batchProgress,
  globalError,
  onSaveWatchlistEntries,
  onRemoveTicker,
  onClearAll,
  onRefreshTickers,
}: StocksSentimentViewProps) {
  const [editorOpen, setEditorOpen] = useState(watchlist.length === 0);
  const [watchlistDraft, setWatchlistDraft] = useState(() => serializeWatchlistToText(watchlist));
  const [inputFeedback, setInputFeedback] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [sortKey, setSortKey] = useState<SortKey>('order');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSymbols, setExpandedSymbols] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setWatchlistDraft(serializeWatchlistToText(watchlist));
    if (watchlist.length === 0) {
      setEditorOpen(true);
    }
  }, [watchlist]);

  const toggleExpanded = (symbol: string) => {
    setExpandedSymbols((prev) => ({
      ...prev,
      [symbol]: !prev[symbol],
    }));
  };

  const handleSortHeader = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      // Default ascending for Watchlist Order (#), A-Z, Most Undervalued (lowest negative % first), and Soonest Earnings
      if (key === 'order' || key === 'alpha' || key === 'undervalued' || key === 'earnings') {
        setSortDir('asc');
      } else {
        setSortDir('desc');
      }
    }
  };

  const us10yYield = liveTape?.us10y.last ?? null;

  const clusterMedianFwdPeMap = useMemo(
    () => computeClusterMedianFwdPeMap(watchlist, activeReport),
    [watchlist, activeReport]
  );

  const evaluatedRows = useMemo(
    () =>
      watchlist.map((item) =>
        evaluateStockRow(item, activeReport, us10yYield, clusterMedianFwdPeMap)
      ),
    [watchlist, activeReport, us10yYield, clusterMedianFwdPeMap]
  );

  const watchlistOrderMap = useMemo(() => {
    const map = new Map<string, number>();
    watchlist.forEach((item, index) => {
      map.set(item.symbol.toUpperCase(), index);
    });
    return map;
  }, [watchlist]);

  const stats = useMemo(() => {
    const total = evaluatedRows.length;
    const refreshedRows = evaluatedRows.filter((r) => r.item.newsScore !== null);
    const refreshed = refreshedRows.length;
    const bullish = evaluatedRows.filter(
      (r) => r.verdictTier === 'strong-bullish' || r.verdictTier === 'bullish'
    ).length;
    const bearish = evaluatedRows.filter(
      (r) => r.verdictTier === 'strong-bearish' || r.verdictTier === 'bearish'
    ).length;
    const mixed = evaluatedRows.filter((r) => r.verdictTier === 'mixed').length;
    const conflicts = evaluatedRows.filter(
      (r) =>
        r.conflictStatus === 'conflict-bull-news' ||
        r.conflictStatus === 'conflict-bear-news'
    ).length;
    const divergences = evaluatedRows.filter(
      (r) => r.priceNewsDivergence !== 'none'
    ).length;
    const earningsImminent = evaluatedRows.filter(
      (r) => r.earningsRiskLevel === 'imminent'
    ).length;
    const earningsUpcoming = evaluatedRows.filter(
      (r) => r.earningsRiskLevel === 'upcoming'
    ).length;
    const pending = total - refreshed;

    // Watchlist Pulse across refreshed tickers (60% News Sentiment + 40% Macro Fit normalized to -1.00 .. +1.00)
    let pulseSum = 0;
    let newsSum = 0;
    let betaSum = 0;
    let betaCount = 0;
    for (const r of refreshedRows) {
      const normNews = (r.item.newsScore ?? 0) / 10;
      const normMacro = r.macroScore !== null ? r.macroScore / 8 : normNews;
      pulseSum += normNews * 0.6 + normMacro * 0.4;
      newsSum += normNews;
      if (typeof r.item.beta1Y === 'number' && Number.isFinite(r.item.beta1Y)) {
        betaSum += r.item.beta1Y;
        betaCount += 1;
      }
    }
    const marketPulse = refreshed > 0 ? Number((pulseSum / refreshed).toFixed(2)) : null;
    const avgNews = refreshed > 0 ? Number((newsSum / refreshed).toFixed(2)) : null;
    const avgBeta = betaCount > 0 ? Number((betaSum / betaCount).toFixed(2)) : null;

    const broadMacroPulse =
      activeReport.section3.clusters.length > 0
        ? Number(
            (
              activeReport.section3.clusters.reduce((acc, c) => acc + c.score, 0) /
              (activeReport.section3.clusters.length * 8)
            ).toFixed(2)
          )
        : null;

    const pulseLabel =
      marketPulse === null
        ? 'Awaiting Refresh'
        : marketPulse >= 0.35
          ? 'Strong Risk-On'
          : marketPulse >= 0.1
            ? 'Cautiously Bullish'
            : marketPulse <= -0.35
              ? 'Risk-Off / Defensive'
              : marketPulse <= -0.1
                ? 'Cautiously Bearish'
                : 'Mixed / Neutral';

    const latestRun =
      evaluatedRows
        .map((r) => r.item.lastFetchedAt)
        .filter((d): d is string => Boolean(d))
        .sort()
        .pop() ?? null;

    return {
      total,
      refreshed,
      bullish,
      bearish,
      mixed,
      conflicts,
      divergences,
      earningsImminent,
      earningsUpcoming,
      pending,
      latestRun,
      marketPulse,
      avgNews,
      avgBeta,
      broadMacroPulse,
      pulseLabel,
    };
  }, [evaluatedRows, activeReport]);

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = evaluatedRows.filter((row) => {
      if (filterMode === 'bullish') {
        if (row.item.newsBias !== 'bullish') return false;
      } else if (filterMode === 'neutral') {
        if (row.item.newsBias !== 'neutral') return false;
      } else if (filterMode === 'bearish') {
        if (row.item.newsBias !== 'bearish') return false;
      } else if (filterMode === 'conflicts') {
        if (
          row.conflictStatus !== 'conflict-bull-news' &&
          row.conflictStatus !== 'conflict-bear-news'
        ) {
          return false;
        }
      } else if (filterMode === 'divergence') {
        if (row.priceNewsDivergence === 'none') return false;
      } else if (filterMode === 'earnings') {
        if (
          row.earningsRiskLevel !== 'imminent' &&
          row.earningsRiskLevel !== 'upcoming'
        ) {
          return false;
        }
      } else if (filterMode === 'pending') {
        if (row.item.newsScore !== null) return false;
      }

      if (!q) return true;
      return (
        row.item.symbol.toLowerCase().includes(q) ||
        row.item.companyName.toLowerCase().includes(q) ||
        row.item.industry.toLowerCase().includes(q) ||
        row.clusterCode.toLowerCase().includes(q) ||
        row.clusterName.toLowerCase().includes(q) ||
        row.item.plainEnglishReason.toLowerCase().includes(q)
      );
    });

    const dir = sortDir === 'asc' ? 1 : -1;
    const compareNullable = (a: number | null, b: number | null): number => {
      if (a === null && b === null) return 0;
      if (a === null) return 1;
      if (b === null) return -1;
      return (a - b) * dir;
    };

    return [...filtered].sort((a, b) => {
      if (sortKey === 'order') {
        const aIdx = watchlistOrderMap.get(a.item.symbol.toUpperCase()) ?? 0;
        const bIdx = watchlistOrderMap.get(b.item.symbol.toUpperCase()) ?? 0;
        return (aIdx - bIdx) * dir;
      }
      if (sortKey === 'alpha') {
        return a.item.symbol.localeCompare(b.item.symbol) * dir;
      }
      if (sortKey === 'news') {
        return compareNullable(a.item.newsScore, b.item.newsScore);
      }
      if (sortKey === 'price') {
        return compareNullable(a.item.currentPrice, b.item.currentPrice);
      }
      if (sortKey === 'intrinsic') {
        return compareNullable(a.item.analystIntrinsicValue, b.item.analystIntrinsicValue);
      }
      if (sortKey === 'undervalued') {
        return compareNullable(a.valuationDiffPct, b.valuationDiffPct);
      }
      if (sortKey === 'earnings') {
        return compareNullable(a.item.earningsWithinDays, b.item.earningsWithinDays);
      }
      if (sortKey === 'updated') {
        const aTs = a.item.lastFetchedAt ? new Date(a.item.lastFetchedAt).getTime() : null;
        const bTs = b.item.lastFetchedAt ? new Date(b.item.lastFetchedAt).getTime() : null;
        return compareNullable(aTs, bTs);
      }
      return compareNullable(a.combinedScore, b.combinedScore);
    });
  }, [evaluatedRows, watchlistOrderMap, filterMode, sortKey, sortDir, searchQuery]);

  const handleSaveWatchlist = (e: React.FormEvent) => {
    e.preventDefault();
    const entries = parseWatchlistEntries(watchlistDraft);
    if (entries.length === 0) {
      setInputFeedback('Enter valid stock ticker symbols (e.g. SPY, QQQ, NYSE:IONQ, NVDA).');
      return;
    }
    const { total, addedCount } = onSaveWatchlistEntries(entries);
    setEditorOpen(false);
    setInputFeedback(
      addedCount > 0
        ? `Saved ${total} tickers (${addedCount} new). Click Refresh Watchlist to load TradingView quotes & news.`
        : `Saved ${total} tickers in watchlist.`
    );
  };

  const handleResetDefault = () => {
    setWatchlistDraft(DEFAULT_WATCHLIST_STRING);
    const entries = parseWatchlistEntries(DEFAULT_WATCHLIST_STRING);
    onSaveWatchlistEntries(entries);
    setInputFeedback(`Reset watchlist to ${entries.length} default tickers. Click Refresh Watchlist to load.`);
  };

  const pulsePct =
    stats.marketPulse !== null ? Math.min(50, Math.abs(stats.marketPulse) * 50) : 0;

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-slate-100">
            Custom Stocks Sentiment
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span>Active Regime: {activeReport.section1.regimeName}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{stats.total} custom tickers</span>
            <span aria-hidden="true">·</span>
            <span>TradingView Scanner &amp; Live Wires (12 stories)</span>
            {stats.latestRun && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono">last run {formatUpdatedAge(stats.latestRun)}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {watchlist.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              disabled={isBatchRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-[#0f172a] border border-slate-700 rounded-md hover:bg-slate-800 hover:text-rose-400 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear List</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => onRefreshTickers(watchlist.map((w) => w.symbol))}
            disabled={watchlist.length === 0 || isBatchRefreshing}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-100 bg-sky-950/70 border border-sky-700/70 rounded-md hover:bg-sky-900/70 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isBatchRefreshing ? 'animate-spin' : ''}`}
            />
            <span>
              {isBatchRefreshing && batchProgress
                ? `Refreshing ${batchProgress.done}/${batchProgress.total}...`
                : 'Refresh Watchlist'}
            </span>
          </button>
        </div>
      </div>

      {/* Collapsible Edit Watchlist Dropdown (Sentiment Watch Style) */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-lg">
        <button
          type="button"
          onClick={() => setEditorOpen((v) => !v)}
          className="w-full px-4 py-2.5 flex items-center justify-between gap-3 text-left text-xs font-medium text-slate-200 hover:text-white transition-colors"
        >
          <span className="inline-flex items-center gap-2">
            {editorOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>Edit watchlist ({stats.total} tickers)</span>
          </span>
          <span className="text-[11px] text-slate-500">
            {editorOpen ? 'Collapse editor' : 'Click to add, edit, or force EXCHANGE:TICKER'}
          </span>
        </button>

        {editorOpen && (
          <form onSubmit={handleSaveWatchlist} className="px-4 pb-4 pt-1 border-t border-slate-800/80 space-y-3">
            <p className="text-xs text-slate-400">
              Comma or newline separated. Use <span className="font-mono text-slate-300">EXCHANGE:TICKER</span> (e.g.{' '}
              <span className="font-mono text-slate-300">NYSE:IONQ</span>) to force an exchange. Saved in this browser.
            </p>
            <textarea
              rows={4}
              value={watchlistDraft}
              onChange={(e) => setWatchlistDraft(e.target.value)}
              placeholder="SPY, QQQ, GOOGL, AAPL, AMZN, META, MSFT, TSM, NVDA..."
              className="w-full px-3 py-2.5 text-xs font-mono text-slate-100 placeholder:text-slate-500 bg-[#0b111b] border border-slate-700 rounded-md focus:outline-none focus:border-sky-500 resize-y leading-relaxed"
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="submit"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-slate-100 rounded-md hover:bg-white transition-colors whitespace-nowrap shrink-0"
              >
                Save watchlist
              </button>
              <button
                type="button"
                onClick={handleResetDefault}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-300 bg-[#0b111b] border border-slate-700 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
              >
                Reset to default
              </button>
            </div>
          </form>
        )}

        {inputFeedback && (
          <div className="px-4 py-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs text-slate-300">
            <span>{inputFeedback}</span>
            <button
              type="button"
              onClick={() => setInputFeedback(null)}
              className="text-slate-500 hover:text-slate-200"
              aria-label="Dismiss note"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {globalError && (
        <div className="bg-rose-950/40 border border-rose-800/70 rounded-lg px-4 py-3 flex items-center gap-2.5 text-xs text-rose-300">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{globalError}</span>
        </div>
      )}

      {/* Live Market Fear & Breadth Tape (TradingView) */}
      <LiveTapeStrip
        tape={liveTape}
        isLoading={isTapeLoading}
        onRefresh={onRefreshTape}
      />

      {/* 4-Card Top Summary Strip featuring Watchlist Pulse vs Broad Macro + Beta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Market Pulse Score */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
            <span>Market Pulse</span>
            <span className="font-mono text-[11px] text-slate-500 tabular-nums">
              {stats.avgBeta !== null ? `Beta ${stats.avgBeta.toFixed(2)}x` : ''}
              {stats.avgBeta !== null && stats.broadMacroPulse !== null ? ' · ' : ''}
              {stats.broadMacroPulse !== null
                ? `Macro ${stats.broadMacroPulse > 0 ? `+${stats.broadMacroPulse.toFixed(2)}` : stats.broadMacroPulse.toFixed(2)}`
                : ''}
            </span>
          </div>
          <div className="flex items-baseline gap-2 font-mono tabular-nums">
            <span
              className={`text-lg font-semibold ${
                stats.marketPulse === null
                  ? 'text-slate-400'
                  : stats.marketPulse >= 0.1
                    ? 'text-emerald-400'
                    : stats.marketPulse <= -0.1
                      ? 'text-rose-400'
                      : 'text-amber-400'
              }`}
            >
              {stats.marketPulse === null
                ? '—'
                : `${stats.marketPulse > 0 ? '+' : ''}${stats.marketPulse.toFixed(2)}`}
            </span>
            <span className="text-xs font-sans font-semibold text-slate-200">
              {stats.pulseLabel}
            </span>
          </div>
          <div className="relative h-1.5 bg-slate-800 rounded-xs overflow-hidden">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-600 z-10" />
            {stats.marketPulse !== null && (
              <div
                className={`absolute top-0 bottom-0 ${
                  stats.marketPulse >= 0.1
                    ? 'bg-emerald-400'
                    : stats.marketPulse <= -0.1
                      ? 'bg-rose-400'
                      : 'bg-amber-400'
                }`}
                style={{
                  left: stats.marketPulse >= 0 ? '50%' : `${50 - pulsePct}%`,
                  width: `${Math.max(4, pulsePct)}%`,
                }}
              />
            )}
          </div>
          <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-slate-400 tabular-nums">
            <div>
              <span className="text-emerald-400">{stats.bullish} Bull</span>
              <span className="text-slate-600 mx-1">·</span>
              <span>{stats.mixed} Mixed</span>
              <span className="text-slate-600 mx-1">·</span>
              <span className="text-rose-400">{stats.bearish} Bear</span>
            </div>
            <span className="font-sans text-slate-500">Watchlist slant · 60/40</span>
          </div>
        </div>

        {/* Card 2: Watchlist Coverage */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-1">
          <div className="text-xs text-slate-400">Watchlist Coverage</div>
          <div className="text-lg font-mono font-semibold text-slate-100 tabular-nums">
            {stats.refreshed} / {stats.total} refreshed
          </div>
          <div className="text-xs text-slate-500">
            {stats.pending > 0
              ? `${stats.pending} awaiting refresh`
              : 'All tickers loaded from TradingView'}
          </div>
        </div>

        {/* Card 3: Macro vs News Conflicts */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-1">
          <div className="text-xs text-slate-400">Macro vs. News Conflicts</div>
          <div
            className={`text-lg font-mono font-semibold tabular-nums ${
              stats.conflicts > 0 ? 'text-amber-400' : 'text-slate-100'
            }`}
          >
            {stats.conflicts} {stats.conflicts === 1 ? 'conflict' : 'conflicts'}
          </div>
          <div className="text-xs text-slate-500">
            {stats.conflicts > 0
              ? 'News diverges from macro regime'
              : 'No opposing macro/news signals'}
          </div>
        </div>

        {/* Card 4: Earnings Risk Window */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-1">
          <div className="text-xs text-slate-400">Earnings Risk Window</div>
          <div
            className={`text-lg font-mono font-semibold tabular-nums ${
              stats.earningsImminent > 0 ? 'text-amber-400' : 'text-slate-100'
            }`}
          >
            {stats.earningsImminent} within 14 days
          </div>
          <div className="text-xs text-slate-500">
            {stats.earningsUpcoming} more within 30 days
          </div>
        </div>
      </div>

      {/* Empty State */}
      {watchlist.length === 0 ? (
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-10 text-center space-y-3">
          <h2 className="text-base font-semibold text-slate-100">
            No Custom Tickers Added Yet
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-lg mx-auto">
            Paste your watchlist into the editor above and click Save watchlist, or click Reset to default to load the 40 default tickers.
          </p>
        </div>
      ) : (
        <>
          {/* Filter Tabs & Search Input (Sort dropdown removed; click table column headers to sort) */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1 p-1 bg-[#0f172a] border border-slate-800 rounded-md">
              {(
                [
                  { id: 'all', label: `All (${stats.total})` },
                  { id: 'bullish', label: 'Bullish' },
                  { id: 'neutral', label: 'Neutral' },
                  { id: 'bearish', label: 'Bearish' },
                  { id: 'conflicts', label: `Conflicts (${stats.conflicts})` },
                  { id: 'divergence', label: `Price≠News (${stats.divergences})` },
                  {
                    id: 'earnings',
                    label: `Earnings (${stats.earningsImminent + stats.earningsUpcoming})`,
                  },
                  { id: 'pending', label: `Pending (${stats.pending})` },
                ] as { id: FilterMode; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterMode(tab.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 transition-colors ${
                    filterMode === tab.id
                      ? 'bg-slate-800 text-slate-100'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter ticker or industry..."
                className="pl-8 pr-3 py-1.5 text-xs bg-[#0f172a] border border-slate-800 rounded-md text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 w-56"
              />
            </div>
          </div>

          {/* Main Dark Data Table with Clickable Sortable Headers & Inline Dropdown Headlines */}
          <div className="bg-[#0b111b] border border-slate-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#0f172a] text-slate-400 font-medium">
                    <SortableHeader
                      label="#"
                      colKey="order"
                      activeKey={sortKey}
                      dir={sortDir}
                      onSort={handleSortHeader}
                      align="center"
                    />
                    <SortableHeader
                      label="Ticker"
                      colKey="alpha"
                      activeKey={sortKey}
                      dir={sortDir}
                      onSort={handleSortHeader}
                    />
                    <SortableHeader
                      label="Sentiment"
                      colKey="news"
                      activeKey={sortKey}
                      dir={sortDir}
                      onSort={handleSortHeader}
                    />
                    <SortableHeader
                      label="Rating / Macro"
                      colKey="combined"
                      activeKey={sortKey}
                      dir={sortDir}
                      onSort={handleSortHeader}
                    />
                    <SortableHeader
                      label="Price"
                      colKey="price"
                      activeKey={sortKey}
                      dir={sortDir}
                      onSort={handleSortHeader}
                      align="right"
                    />
                    <SortableHeader
                      label="Intrinsic"
                      colKey="intrinsic"
                      activeKey={sortKey}
                      dir={sortDir}
                      onSort={handleSortHeader}
                      align="right"
                    />
                    <SortableHeader
                      label="Over/Under"
                      colKey="undervalued"
                      activeKey={sortKey}
                      dir={sortDir}
                      onSort={handleSortHeader}
                      align="right"
                    />
                    <SortableHeader
                      label="Industry / Earn"
                      colKey="earnings"
                      activeKey={sortKey}
                      dir={sortDir}
                      onSort={handleSortHeader}
                    />
                    <th className="py-2.5 px-3 min-w-[320px]">Rationale</th>
                    <SortableHeader
                      label="Updated"
                      colKey="updated"
                      activeKey={sortKey}
                      dir={sortDir}
                      onSort={handleSortHeader}
                      align="right"
                    />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-10 px-4 text-center text-slate-400">
                        No tickers match the current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row, idx) => {
                      const isExpanded = Boolean(expandedSymbols[row.item.symbol]);
                      const isLoadingRow = row.item.fetchStatus === 'loading';
                      const sentimentPct =
                        row.item.newsScore !== null
                          ? (Math.abs(row.item.newsScore) / 10) * 50
                          : 0;
                      const isPosSentiment = (row.item.newsScore ?? 0) >= 0;
                      const displayedNewsCount =
                        row.item.recentHeadlines.length || row.item.headlineCount;

                      return (
                        <React.Fragment key={row.item.symbol}>
                          <tr
                            onClick={() => toggleExpanded(row.item.symbol)}
                            className={`cursor-pointer transition-colors ${
                              isExpanded
                                ? 'bg-[#111a29]'
                                : 'hover:bg-[#101827]'
                            }`}
                          >
                            {/* # + Dropdown Chevron */}
                            <td className="py-3.5 px-2.5 align-top text-center font-mono text-slate-500 tabular-nums whitespace-nowrap">
                              <div className="inline-flex items-center gap-1">
                                {isExpanded ? (
                                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                                )}
                                <span>
                                  {(watchlistOrderMap.get(row.item.symbol.toUpperCase()) ?? idx) + 1}
                                </span>
                              </div>
                            </td>

                            {/* Ticker & Cluster + Beta */}
                            <td className="py-3.5 px-2.5 align-top whitespace-nowrap">
                              <div className="font-mono font-semibold text-slate-100 text-[13px]">
                                {row.item.symbol}
                              </div>
                              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                                {row.clusterCode || 'UNMAPPED'}
                                {row.primaryEtf &&
                                row.primaryEtf !== 'SPY' &&
                                row.primaryEtf !== row.item.symbol
                                  ? ` · ${row.primaryEtf}`
                                  : ''}
                              </div>
                              {typeof row.item.beta1Y === 'number' && (
                                <div className="text-[10px] font-mono text-slate-500 mt-0.5 tabular-nums">
                                  Beta {row.item.beta1Y.toFixed(2)}x
                                </div>
                              )}
                              {row.watchlistStance === 'favored' && (
                                <div className="text-[11px] font-medium text-emerald-400 mt-0.5">
                                  Favored
                                </div>
                              )}
                              {row.watchlistStance === 'avoid' && (
                                <div className="text-[11px] font-medium text-rose-400 mt-0.5">
                                  Avoid / Short
                                </div>
                              )}
                            </td>

                            {/* Sentiment Bar + Score + 1W Price Confirmation */}
                            <td className="py-3.5 px-2.5 align-top tabular-nums whitespace-nowrap">
                              {isLoadingRow ? (
                                <div className="space-y-1.5 py-0.5">
                                  <div className="h-1.5 w-16 bg-slate-800 rounded animate-pulse" />
                                  <div className="h-3 w-10 bg-slate-800 rounded animate-pulse" />
                                </div>
                              ) : row.item.newsScore !== null ? (
                                <div className="w-24 space-y-1">
                                  <div className="relative h-1.5 w-20 bg-slate-800 rounded-xs overflow-hidden">
                                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-600 z-10" />
                                    <div
                                      className={`absolute top-0 bottom-0 ${
                                        row.item.newsScore >= 2
                                          ? 'bg-emerald-400'
                                          : row.item.newsScore <= -2
                                            ? 'bg-rose-400'
                                            : 'bg-amber-400'
                                      }`}
                                      style={{
                                        left: isPosSentiment ? '50%' : `${50 - sentimentPct}%`,
                                        width: `${Math.max(4, sentimentPct)}%`,
                                      }}
                                    />
                                  </div>
                                  <div
                                    className={`font-mono font-semibold text-xs ${
                                      row.item.newsScore >= 2
                                        ? 'text-emerald-400'
                                        : row.item.newsScore <= -2
                                          ? 'text-rose-400'
                                          : 'text-amber-400'
                                    }`}
                                  >
                                    {row.item.newsScore > 0
                                      ? `+${(row.item.newsScore / 10).toFixed(2)}`
                                      : (row.item.newsScore / 10).toFixed(2)}
                                  </div>
                                  {typeof row.item.perf1W === 'number' && (
                                    <div
                                      className={`text-[10px] font-mono ${
                                        row.item.perf1W >= 0 ? 'text-slate-400' : 'text-rose-400/90'
                                      }`}
                                    >
                                      1W {row.item.perf1W > 0 ? `+${row.item.perf1W.toFixed(1)}%` : `${row.item.perf1W.toFixed(1)}%`}
                                    </div>
                                  )}
                                  {row.priceNewsDivergence !== 'none' && (
                                    <div className="text-[10px] font-medium text-amber-400">
                                      {row.priceNewsDivergence === 'bull-news-drop'
                                        ? 'News+ / Price−'
                                        : 'News− / Price+'}
                                    </div>
                                  )}
                                </div>
                              ) : row.item.fetchStatus === 'error' ? (
                                <span className="text-rose-400 font-medium">Error</span>
                              ) : (
                                <span className="text-slate-500">Pending</span>
                              )}
                            </td>

                            {/* Rating / Combined Verdict + Macro Fit + Conflict */}
                            <td className="py-3.5 px-2.5 align-top whitespace-nowrap space-y-1">
                              {isLoadingRow ? (
                                <div className="h-4 w-20 bg-slate-800 rounded animate-pulse" />
                              ) : (
                                <>
                                  <VerdictText
                                    tier={row.verdictTier}
                                    label={row.verdictLabel}
                                    score={row.combinedScore}
                                  />
                                  <div className="text-[11px] font-mono text-slate-400 tabular-nums">
                                    Macro{' '}
                                    {row.macroScore !== null
                                      ? row.macroScore > 0
                                        ? `+${row.macroScore}`
                                        : row.macroScore
                                      : 'N/A'}
                                    /8
                                  </div>
                                  {(row.conflictStatus === 'conflict-bull-news' ||
                                    row.conflictStatus === 'conflict-bear-news') && (
                                    <div className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400">
                                      <AlertTriangle className="w-3 h-3 shrink-0" />
                                      <span>Conflict</span>
                                    </div>
                                  )}
                                </>
                              )}
                            </td>

                            {/* Current Price + RSI & 50/200 DMA Timing */}
                            <td className="py-3.5 px-2.5 align-top text-right tabular-nums whitespace-nowrap">
                              {isLoadingRow ? (
                                <div className="h-3.5 w-14 bg-slate-800 rounded animate-pulse ml-auto" />
                              ) : row.item.currentPrice !== null ? (
                                <div>
                                  <div className="font-mono font-semibold text-slate-100">
                                    {row.item.currentPrice.toFixed(2)}
                                  </div>
                                  {typeof row.item.premarketPrice === 'number' &&
                                    typeof row.item.premarketChangePct === 'number' && (
                                      <div
                                        className={`text-[10px] font-mono mt-0.5 ${
                                          row.item.premarketChangePct > 0.05
                                            ? 'text-emerald-400'
                                            : row.item.premarketChangePct < -0.05
                                              ? 'text-rose-400'
                                              : 'text-slate-400'
                                        }`}
                                      >
                                        PM {row.item.premarketPrice.toFixed(2)} (
                                        {row.item.premarketChangePct > 0 ? '+' : ''}
                                        {row.item.premarketChangePct.toFixed(1)}%)
                                      </div>
                                    )}
                                  {(typeof row.item.rsi14 === 'number' || row.dmaLabel) && (
                                    <div
                                      className={`text-[10px] font-mono mt-0.5 ${
                                        row.rsiZone === 'oversold'
                                          ? 'text-emerald-400'
                                          : row.rsiZone === 'overbought'
                                            ? 'text-amber-400'
                                            : 'text-slate-500'
                                      }`}
                                    >
                                      {typeof row.item.rsi14 === 'number'
                                        ? `RSI ${Math.round(row.item.rsi14)}`
                                        : ''}
                                      {typeof row.item.rsi14 === 'number' && row.dmaLabel ? ' · ' : ''}
                                      {row.dmaLabel}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-600">—</span>
                              )}
                            </td>

                            {/* Analyst Intrinsic Value + Fwd P/E + Matched Multiple + EY-10Y */}
                            <td className="py-3.5 px-2.5 align-top text-right tabular-nums whitespace-nowrap">
                              {isLoadingRow ? (
                                <div className="h-3.5 w-14 bg-slate-800 rounded animate-pulse ml-auto" />
                              ) : (
                                <div>
                                  <div className="font-mono text-slate-200">
                                    {row.item.analystIntrinsicValue !== null
                                      ? row.item.analystIntrinsicValue.toFixed(2)
                                      : <span className="text-slate-600">—</span>}
                                  </div>
                                  {typeof row.item.forwardPe === 'number' ? (
                                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                                      Fwd P/E {row.item.forwardPe.toFixed(1)}x
                                    </div>
                                  ) : typeof row.item.priceToSales === 'number' ? (
                                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                                      P/S {row.item.priceToSales.toFixed(1)}x
                                    </div>
                                  ) : null}
                                  {row.matchedMetricLabel && (
                                    <div
                                      className={`text-[10px] font-mono mt-0.5 ${
                                        row.matchedMetricTone === 'bullish'
                                          ? 'text-emerald-400'
                                          : row.matchedMetricTone === 'warning'
                                            ? 'text-amber-400'
                                            : 'text-slate-400'
                                      }`}
                                    >
                                      {row.matchedMetricLabel}
                                    </div>
                                  )}
                                  {row.eyMinus10yPct !== null && (
                                    <div
                                      className={`text-[10px] font-mono mt-0.5 ${
                                        row.eyMinus10yPct >= 0.5
                                          ? 'text-emerald-400'
                                          : row.eyMinus10yPct <= -1.5
                                            ? 'text-amber-400'
                                            : 'text-slate-500'
                                      }`}
                                    >
                                      EY-10Y {row.eyMinus10yPct > 0 ? `+${row.eyMinus10yPct.toFixed(1)}%` : `${row.eyMinus10yPct.toFixed(1)}%`}
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* % Over/Under Valued */}
                            <td className="py-3.5 px-2.5 align-top text-right tabular-nums whitespace-nowrap">
                              {isLoadingRow ? (
                                <div className="h-3.5 w-16 bg-slate-800 rounded animate-pulse ml-auto" />
                              ) : row.valuationDiffPct !== null ? (
                                <ValuationText
                                  diffPct={row.valuationDiffPct}
                                  status={row.valuationStatus}
                                />
                              ) : (
                                <span className="text-slate-600">—</span>
                              )}
                            </td>

                            {/* Industry, Earnings & EPS Revision Direction */}
                            <td className="py-3.5 px-2.5 align-top max-w-[180px]">
                              <div className="text-slate-300 leading-snug">
                                {row.item.industry || row.clusterName || '—'}
                              </div>
                              {row.item.earningsDate &&
                                row.item.earningsDate !== 'N/A (not scheduled)' && (
                                  <div
                                    className={`text-[11px] font-mono mt-1 ${
                                      row.earningsRiskLevel === 'imminent'
                                        ? 'text-amber-400 font-semibold'
                                        : 'text-slate-500'
                                    }`}
                                  >
                                    {row.earningsRiskLevel === 'imminent'
                                      ? `Earnings ${row.item.earningsWithinDays}d`
                                      : `Earn ${row.item.earningsDate}`}
                                  </div>
                                )}
                              {(row.item.epsRevisionDir === 'up' || row.item.epsRevisionDir === 'down') && (
                                <div
                                  className={`text-[10px] font-mono font-medium mt-0.5 ${
                                    row.item.epsRevisionDir === 'up'
                                      ? 'text-emerald-400'
                                      : 'text-rose-400'
                                  }`}
                                >
                                  {row.item.epsRevisionDir === 'up' ? 'EPS Rev ↑' : 'EPS Rev ↓'}
                                </div>
                              )}
                            </td>

                            {/* In-Depth Rationale */}
                            <td className="py-3.5 px-3 align-top max-w-[480px]">
                              {isLoadingRow ? (
                                <div className="space-y-1.5 py-0.5">
                                  <div className="h-3.5 w-full bg-slate-800 rounded animate-pulse" />
                                  <div className="h-3.5 w-5/6 bg-slate-800 rounded animate-pulse" />
                                  <div className="h-3.5 w-2/3 bg-slate-800 rounded animate-pulse" />
                                </div>
                              ) : row.item.fetchStatus === 'error' ? (
                                <div className="text-rose-400 leading-relaxed">
                                  {row.item.fetchError || 'Lookup failed. Retry row.'}
                                </div>
                              ) : row.item.plainEnglishReason ? (
                                <p className="text-slate-300 leading-relaxed">
                                  {row.item.plainEnglishReason}
                                </p>
                              ) : (
                                <span className="text-slate-500">
                                  Click Refresh to load TradingView stories, analyst target &amp; rationale.
                                </span>
                              )}
                            </td>

                            {/* Updated + Row Actions */}
                            <td
                              className="py-3.5 px-2.5 align-top text-right whitespace-nowrap"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="inline-flex items-center gap-1.5">
                                <span className="font-mono text-[11px] text-slate-500 mr-1">
                                  {formatUpdatedAge(row.item.lastFetchedAt)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onRefreshTickers([row.item.symbol])}
                                  disabled={isLoadingRow || isBatchRefreshing}
                                  title={`Refresh ${row.item.symbol}`}
                                  aria-label={`Refresh ${row.item.symbol}`}
                                  className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded disabled:opacity-40 transition-colors"
                                >
                                  <RefreshCw
                                    className={`w-3.5 h-3.5 ${isLoadingRow ? 'animate-spin' : ''}`}
                                  />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onRemoveTicker(row.item.symbol)}
                                  disabled={isLoadingRow}
                                  title={`Remove ${row.item.symbol}`}
                                  aria-label={`Remove ${row.item.symbol}`}
                                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/50 rounded disabled:opacity-40 transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Inline Expandable Dropdown: Clickable Material Headlines & Macro/Earnings Brief */}
                          {isExpanded && (
                            <tr className="bg-[#0e1624] border-t border-slate-800/70">
                              <td colSpan={10} className="px-6 py-4">
                                <div className="space-y-4">
                                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-3">
                                    <div className="space-y-1">
                                      <div className="text-xs font-semibold text-slate-200">
                                        Material Headlines for {row.item.symbol} ({displayedNewsCount})
                                      </div>
                                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                                        <span>{row.item.companyName || row.item.symbol}</span>
                                        <span aria-hidden="true">·</span>
                                        <span>
                                          Cluster {row.clusterCode} ({row.macroBiasLabel})
                                        </span>
                                        {row.item.valuationSource && (
                                          <>
                                            <span aria-hidden="true">·</span>
                                            <span>{row.item.valuationSource}</span>
                                          </>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-[11px]">
                                      <ConflictText
                                        status={row.conflictStatus}
                                        label={row.conflictLabel}
                                      />
                                      <span className="font-mono text-slate-400">
                                        Earnings: {row.item.earningsDate || 'Pending'}
                                        {row.item.earningsWithinDays !== null
                                          ? ` (${row.item.earningsWithinDays}d)`
                                          : ''}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 bg-[#0b111b] border border-slate-800/80 rounded-md p-3 text-[11px] tabular-nums">
                                    <div>
                                      <div className="text-slate-500">Fwd P/E vs {row.clusterCode}</div>
                                      <div className="font-mono font-semibold text-slate-200 mt-0.5">
                                        {typeof row.item.forwardPe === 'number'
                                          ? `${row.item.forwardPe.toFixed(1)}x`
                                          : '—'}{' '}
                                        {row.relFwdPeVsClusterPct !== null ? (
                                          <span
                                            className={`font-normal ${
                                              row.relFwdPeVsClusterPct <= -10
                                                ? 'text-emerald-400'
                                                : row.relFwdPeVsClusterPct >= 15
                                                  ? 'text-amber-400'
                                                  : 'text-slate-400'
                                            }`}
                                          >
                                            ({row.relFwdPeVsClusterPct > 0 ? '+' : ''}
                                            {row.relFwdPeVsClusterPct.toFixed(0)}% vs {row.clusterMedianFwdPe}x)
                                          </span>
                                        ) : (
                                          <span className="text-slate-500 font-normal">
                                            / {typeof row.item.trailingPe === 'number' ? `${row.item.trailingPe.toFixed(1)}x` : '—'}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-slate-500">FCF Yield / EY−10Y</div>
                                      <div className="font-mono font-semibold text-slate-200 mt-0.5">
                                        {typeof row.item.fcfYieldPct === 'number'
                                          ? `${row.item.fcfYieldPct.toFixed(1)}%`
                                          : '—'}{' '}
                                        <span
                                          className={`font-normal ${
                                            row.eyMinus10yPct === null
                                              ? 'text-slate-500'
                                              : row.eyMinus10yPct >= 0.5
                                                ? 'text-emerald-400'
                                                : row.eyMinus10yPct <= -1.5
                                                  ? 'text-amber-400'
                                                  : 'text-slate-400'
                                          }`}
                                        >
                                          · {row.eyMinus10yPct !== null ? `${row.eyMinus10yPct > 0 ? '+' : ''}${row.eyMinus10yPct.toFixed(1)}%` : '—'}
                                        </span>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-slate-500">EV/EBITDA · EV/GP · P/B</div>
                                      <div className="font-mono font-semibold text-slate-200 mt-0.5">
                                        {typeof row.item.evToEbitda === 'number'
                                          ? `${row.item.evToEbitda.toFixed(1)}x`
                                          : '—'}{' '}
                                        <span className="text-slate-500 font-normal">
                                          · {typeof row.item.evToGrossProfit === 'number' ? `${row.item.evToGrossProfit.toFixed(1)}x` : typeof row.item.evToSales === 'number' ? `S ${row.item.evToSales.toFixed(1)}x` : '—'}
                                          {typeof row.item.priceToBook === 'number' ? ` · ${row.item.priceToBook.toFixed(1)}x` : ''}
                                        </span>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-slate-500">14d RSI / 50·200d</div>
                                      <div
                                        className={`font-mono font-semibold mt-0.5 ${
                                          row.rsiZone === 'oversold'
                                            ? 'text-emerald-400'
                                            : row.rsiZone === 'overbought'
                                              ? 'text-amber-400'
                                              : 'text-slate-200'
                                        }`}
                                      >
                                        {typeof row.item.rsi14 === 'number'
                                          ? `${row.item.rsi14.toFixed(1)}`
                                          : '—'}{' '}
                                        <span className="text-slate-500 font-normal">
                                          {row.dmaLabel || ''}
                                        </span>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-slate-500">1W / 1M / PM Price</div>
                                      <div className="font-mono font-semibold mt-0.5">
                                        <span
                                          className={
                                            typeof row.item.perf1W === 'number'
                                              ? row.item.perf1W >= 0
                                                ? 'text-emerald-400'
                                                : 'text-rose-400'
                                              : 'text-slate-400'
                                          }
                                        >
                                          {typeof row.item.perf1W === 'number'
                                            ? `${row.item.perf1W > 0 ? '+' : ''}${row.item.perf1W.toFixed(1)}%`
                                            : '—'}
                                        </span>
                                        <span className="text-slate-500 font-normal">
                                          {' / '}
                                          {typeof row.item.perf1M === 'number'
                                            ? `${row.item.perf1M > 0 ? '+' : ''}${row.item.perf1M.toFixed(1)}%`
                                            : '—'}
                                        </span>
                                        {typeof row.item.premarketChangePct === 'number' && (
                                          <span
                                            className={`font-normal ${
                                              row.item.premarketChangePct > 0.05
                                                ? 'text-emerald-400'
                                                : row.item.premarketChangePct < -0.05
                                                  ? 'text-rose-400'
                                                  : 'text-slate-400'
                                            }`}
                                          >
                                            {' · '}PM{' '}
                                            {row.item.premarketChangePct > 0 ? '+' : ''}
                                            {row.item.premarketChangePct.toFixed(2)}%
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-slate-500">1Y Beta / EPS Rev</div>
                                      <div className="font-mono font-semibold text-slate-200 mt-0.5">
                                        {typeof row.item.beta1Y === 'number'
                                          ? `${row.item.beta1Y.toFixed(2)}x`
                                          : '—'}{' '}
                                        <span
                                          className={
                                            row.item.epsRevisionDir === 'up'
                                              ? 'text-emerald-400'
                                              : row.item.epsRevisionDir === 'down'
                                                ? 'text-rose-400'
                                                : 'text-slate-500 font-normal'
                                          }
                                        >
                                          · {row.item.epsRevisionDir === 'up'
                                            ? 'Rev ↑'
                                            : row.item.epsRevisionDir === 'down'
                                              ? 'Rev ↓'
                                              : row.item.epsRevisionDir === 'flat'
                                                ? 'Flat'
                                                : '—'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs text-slate-400">
                                    <div>
                                      <span className="font-semibold text-slate-200">
                                        Macro Alignment:{' '}
                                      </span>
                                      <span>{row.conflictDetail}</span>
                                    </div>
                                    <div>
                                      <span className="font-semibold text-slate-200">
                                        EPS Revisions (60–90d):{' '}
                                      </span>
                                      <span
                                        className={
                                          row.item.epsRevisionDir === 'up'
                                            ? 'text-emerald-400'
                                            : row.item.epsRevisionDir === 'down'
                                              ? 'text-rose-400'
                                              : ''
                                        }
                                      >
                                        {row.item.epsRevisionNote || 'No explicit EPS revision catalyst indexed.'}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="font-semibold text-slate-200">
                                        Catalyst Check:{' '}
                                      </span>
                                      <span
                                        className={
                                          row.earningsRiskLevel === 'imminent'
                                            ? 'text-amber-400 font-medium'
                                            : ''
                                        }
                                      >
                                        {row.item.catalystWarning || 'No imminent binary event inside 14 days.'}
                                      </span>
                                    </div>
                                  </div>

                                  {row.item.recentHeadlines.length === 0 ? (
                                    <div className="text-xs text-slate-500 py-2">
                                      {row.item.fetchStatus === 'loading'
                                        ? 'Loading TradingView news stories...'
                                        : 'Click Refresh on this row to pull TradingView material headlines.'}
                                    </div>
                                  ) : (
                                    <div className="divide-y divide-slate-800/70">
                                      {row.item.recentHeadlines.map((h, hIdx) => {
                                        const scoreVal =
                                          typeof h.sentimentScore === 'number'
                                            ? h.sentimentScore
                                            : h.impact === 'bullish'
                                              ? 0.35
                                              : h.impact === 'bearish'
                                                ? -0.35
                                                : 0.0;
                                        const formattedScore = `${
                                          scoreVal > 0 ? '+' : ''
                                        }${scoreVal.toFixed(2)}`;
                                        return (
                                          <div
                                            key={hIdx}
                                            className="py-2.5 flex items-start gap-4 text-xs"
                                          >
                                            <span
                                              className={`font-mono font-semibold w-12 shrink-0 tabular-nums ${
                                                scoreVal >= 0.15
                                                  ? 'text-emerald-400'
                                                  : scoreVal <= -0.15
                                                    ? 'text-rose-400'
                                                    : 'text-slate-400'
                                              }`}
                                            >
                                              {formattedScore}
                                            </span>
                                            <div className="space-y-0.5 min-w-0">
                                              {h.url ? (
                                                <a
                                                  href={h.url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  onClick={(e) => e.stopPropagation()}
                                                  className="inline-flex items-center gap-1.5 text-slate-200 hover:text-sky-300 hover:underline underline-offset-4 leading-snug transition-colors"
                                                >
                                                  <span>{h.headline}</span>
                                                  <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                                                </a>
                                              ) : (
                                                <div className="text-slate-200 leading-snug">
                                                  {h.headline}
                                                </div>
                                              )}
                                              <div className="text-[11px] text-slate-500">
                                                {h.sourceDate}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SortableHeader({
  label,
  colKey,
  activeKey,
  dir,
  onSort,
  align = 'left',
}: {
  label: string;
  colKey: SortKey;
  activeKey: SortKey;
  dir: SortDir;
  onSort: (key: SortKey) => void;
  align?: 'left' | 'right' | 'center';
}) {
  const isActive = activeKey === colKey;
  const alignCls =
    align === 'right' ? 'text-right' : align === 'center' ? 'text-center w-12' : 'text-left';
  return (
    <th className={`py-2.5 px-2.5 whitespace-nowrap ${alignCls}`}>
      <button
        type="button"
        onClick={() => onSort(colKey)}
        className={`inline-flex items-center gap-1 hover:text-slate-100 transition-colors whitespace-nowrap ${
          isActive ? 'text-slate-100 font-semibold' : 'text-slate-400'
        }`}
      >
        <span>{label}</span>
        {isActive ? (
          dir === 'asc' ? (
            <ArrowUp className="w-3 h-3 text-sky-400 shrink-0" />
          ) : (
            <ArrowDown className="w-3 h-3 text-sky-400 shrink-0" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 text-slate-600 shrink-0" />
        )}
      </button>
    </th>
  );
}

function VerdictText({
  tier,
  label,
  score,
}: {
  tier: StockEvaluationRow['verdictTier'];
  label: string;
  score: number | null;
}) {
  const scorePrefix =
    score !== null ? `${score > 0 ? `+${score}` : score} · ` : '';

  if (tier === 'strong-bullish' || tier === 'bullish') {
    return (
      <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 whitespace-nowrap">
        <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
        <span className="tabular-nums">
          {scorePrefix}
          {label}
        </span>
      </span>
    );
  }
  if (tier === 'strong-bearish' || tier === 'bearish') {
    return (
      <span className="inline-flex items-center gap-1 font-semibold text-rose-400 whitespace-nowrap">
        <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
        <span className="tabular-nums">
          {scorePrefix}
          {label}
        </span>
      </span>
    );
  }
  if (tier === 'mixed') {
    return (
      <span className="inline-flex items-center gap-1 font-medium text-amber-400 whitespace-nowrap">
        <Minus className="w-3.5 h-3.5 shrink-0" />
        <span className="tabular-nums">
          {scorePrefix}
          {label}
        </span>
      </span>
    );
  }
  return <span className="text-slate-500 whitespace-nowrap">{label}</span>;
}

function ConflictText({
  status,
  label,
}: {
  status: StockEvaluationRow['conflictStatus'];
  label: string;
}) {
  if (status === 'conflict-bull-news' || status === 'conflict-bear-news') {
    return (
      <span className="inline-flex items-center gap-1.5 font-semibold text-amber-400">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
        <span>{label}</span>
      </span>
    );
  }
  if (status === 'aligned-bullish') {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
        <span>{label}</span>
      </span>
    );
  }
  if (status === 'aligned-bearish') {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium text-rose-400">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
        <span>{label}</span>
      </span>
    );
  }
  if (status === 'aligned-neutral') {
    return <span className="text-slate-300 font-medium">{label}</span>;
  }
  return <span className="text-slate-500">{label}</span>;
}

function ValuationText({
  diffPct,
  status,
}: {
  diffPct: number;
  status: StockEvaluationRow['valuationStatus'];
}) {
  const formatted = `${diffPct > 0 ? '+' : ''}${diffPct.toFixed(1)}%`;
  if (status === 'undervalued') {
    return (
      <span className="font-mono font-semibold text-emerald-400">
        {formatted} <span className="text-[11px] font-sans font-medium">Under</span>
      </span>
    );
  }
  if (status === 'overvalued') {
    return (
      <span className="font-mono font-semibold text-rose-400">
        {formatted} <span className="text-[11px] font-sans font-medium">Over</span>
      </span>
    );
  }
  return (
    <span className="font-mono font-medium text-slate-300">
      {formatted} <span className="text-[11px] font-sans text-slate-500">Fair</span>
    </span>
  );
}
