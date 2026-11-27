import React, { useEffect, useMemo, useState } from 'react';
import { MessageSquare, PanelLeftClose, PanelLeftOpen, Play } from 'lucide-react';
import { DEFAULT_MACRO_PROMPT, INITIAL_REFERENCE_REPORT } from './data/referenceBaseline';
import { ChatMessage, LiveMarketTape, MacroReport, StockWatchlistItem } from './types/macro';
import { summarizeReportForChat } from './utils/markdownReport';
import {
  createEmptyWatchlistItem,
  DEFAULT_WATCHLIST_STRING,
  ParsedWatchlistEntry,
  parseWatchlistEntries,
} from './utils/stockSentiment';
import { BaselineSection } from './components/BaselineSection';
import { CommoditiesSection } from './components/CommoditiesSection';
import { ClusterDashboardSection } from './components/ClusterDashboardSection';
import { PairsPostureSection } from './components/PairsPostureSection';
import { RotationMatrixSection } from './components/RotationMatrixSection';
import { MarkdownReportView } from './components/MarkdownReportView';
import { MacroChatPanel } from './components/MacroChatPanel';
import { StocksSentimentView } from './components/StocksSentimentView';

const STORAGE_REPORTS_KEY = 'macroregime_reports_v2';
const STORAGE_MESSAGES_KEY = 'macroregime_messages_v2';
const STORAGE_WATCHLIST_KEY = 'macroregime_watchlist_v2';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init-1',
    role: 'assistant',
    content:
      'Loaded the Concise Plain-English Reference Baseline across all 7 sections. Click "Insert Macro Prompt" or paste your prompt into the chat to run a live web-grounded scan with plain-text sources and zero URLs or bracketed citations.',
    timestamp: 'Baseline Ready',
    reportId: INITIAL_REFERENCE_REPORT.id,
    mode: 'baseline',
  },
];

function normalizeClusterCode(id: string, name: string): string {
  const rawId = String(id ?? '').trim().toUpperCase();
  const nameMatch = String(name ?? '').match(/\b(C[1-8])\b/i);
  if (nameMatch) {
    const code = nameMatch[1].toUpperCase();
    if (!/^C[1-8]$/.test(rawId) || rawId !== code) {
      return code;
    }
  }
  const idMatch = rawId.match(/C[1-8]/);
  return idMatch ? idMatch[0] : rawId;
}

function dedupeItems<T>(items: T[], getKey: (item: T, idx: number) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  items.forEach((item, idx) => {
    const k = getKey(item, idx);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(item);
    }
  });
  return out;
}

function isValidSpxGate(gate: MacroReport['section1']['creditSpreadGate']): boolean {
  if (!gate || !Array.isArray(gate.checks) || gate.checks.length === 0) return false;
  const text = gate.checks
    .map((c) => `${String(c?.name ?? '')} ${String(c?.detail ?? '')}`)
    .join(' ')
    .toLowerCase();
  return /\b(vix|vix3m|vvix|spx|200\s*dma|20\s*dma|term\s*structure)\b/.test(text);
}

function sanitizeMacroReport(rep: MacroReport): MacroReport {
  const clusters = Array.isArray(rep.section3?.clusters)
    ? dedupeItems(
        rep.section3.clusters.map((c, idx) => ({
          ...c,
          id: normalizeClusterCode(c.id, c.name) || `C${idx + 1}`,
        })),
        (c) => c.id
      )
    : [];

  const validGate = isValidSpxGate(rep.section1?.creditSpreadGate)
    ? rep.section1.creditSpreadGate
    : undefined;

  return {
    ...rep,
    section1: {
      ...rep.section1,
      creditSpreadGate: validGate,
      baselineMetrics: Array.isArray(rep.section1?.baselineMetrics)
        ? dedupeItems(
            rep.section1.baselineMetrics,
            (m, idx) => String(m.ticker || m.asset || idx).trim().toUpperCase()
          )
        : [],
    },
    section2: {
      ...rep.section2,
      commodities: Array.isArray(rep.section2?.commodities)
        ? dedupeItems(
            rep.section2.commodities,
            (c, idx) => String(c.ticker || c.name || idx).trim().toUpperCase()
          )
        : [],
    },
    section3: {
      ...rep.section3,
      clusters,
    },
    section4: {
      ...rep.section4,
      realYieldSensitivity: Array.isArray(rep.section4?.realYieldSensitivity)
        ? dedupeItems(
            rep.section4.realYieldSensitivity,
            (r, idx) => `${String(r.cluster || '').trim()}-${String(r.proxy || idx).trim().toUpperCase()}`
          )
        : [],
    },
    section5: {
      ...rep.section5,
      matrixPicks: Array.isArray(rep.section5?.matrixPicks)
        ? dedupeItems(rep.section5.matrixPicks, (p, idx) => String(p.id || `pick-${idx}`).trim().toLowerCase())
        : [],
    },
    section6: {
      ...rep.section6,
      capsules: Array.isArray(rep.section6?.capsules)
        ? dedupeItems(rep.section6.capsules, (c, idx) => String(c.id || `cap-${idx}`).trim().toLowerCase())
        : [],
    },
    section7: {
      ...rep.section7,
      killSwitches: Array.isArray(rep.section7?.killSwitches)
        ? dedupeItems(rep.section7.killSwitches, (ks, idx) => String(ks.number ?? idx + 1))
        : [],
    },
  };
}

function isCompleteMacroReport(r: unknown): r is MacroReport {
  if (!r || typeof r !== 'object') return false;
  const rep = r as Partial<MacroReport>;
  return (
    Array.isArray(rep.section1?.baselineMetrics) &&
    rep.section1.baselineMetrics.length >= 6 &&
    Array.isArray(rep.section2?.commodities) &&
    rep.section2.commodities.length >= 3 &&
    Array.isArray(rep.section3?.clusters) &&
    rep.section3.clusters.length >= 8 &&
    Array.isArray(rep.section5?.matrixPicks) &&
    rep.section5.matrixPicks.length >= 15 &&
    Array.isArray(rep.section6?.capsules) &&
    rep.section6.capsules.length >= 12 &&
    Array.isArray(rep.section7?.killSwitches) &&
    rep.section7.killSwitches.length >= 4
  );
}

const BASELINE_VERSION_KEY = 'macroregime_baseline_ver';
const CURRENT_BASELINE_VERSION = 'nov-25-2026-v2';

export default function App() {
  const [reports, setReports] = useState<MacroReport[]>(() => {
    try {
      const savedVer = localStorage.getItem(BASELINE_VERSION_KEY);
      const needsRefreshFocus = savedVer !== CURRENT_BASELINE_VERSION;
      if (needsRefreshFocus) {
        localStorage.setItem(BASELINE_VERSION_KEY, CURRENT_BASELINE_VERSION);
      }

      const saved = localStorage.getItem(STORAGE_REPORTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as MacroReport[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const migrated = dedupeItems(
            parsed
              .map((r) =>
                r.id === 'ref-concise-nov-25-2026' ||
                r.id === 'ref-concise-nov-23-2026' ||
                r.id === 'ref-concise-nov-14-2026' ||
                r.id === 'baseline-reference'
                  ? INITIAL_REFERENCE_REPORT
                  : r
              )
              .filter(isCompleteMacroReport)
              .map(sanitizeMacroReport),
            (r) => r.id
          );
          const others = migrated.filter((r) => r.id !== INITIAL_REFERENCE_REPORT.id);
          if (needsRefreshFocus || !migrated.some((r) => r.id === INITIAL_REFERENCE_REPORT.id)) {
            return [INITIAL_REFERENCE_REPORT, ...others];
          }
          if (migrated.length > 0) return migrated;
        }
      }
    } catch {
      // Ignore storage read failures
    }
    return [INITIAL_REFERENCE_REPORT];
  });

  const [activeReportId, setActiveReportId] = useState<string>(
    () => reports[0]?.id ?? INITIAL_REFERENCE_REPORT.id
  );

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MESSAGES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore storage read failures
    }
    return INITIAL_MESSAGES;
  });

  const [viewMode, setViewMode] = useState<'dashboard' | 'markdown' | 'stocks'>('dashboard');
  const [chatOpen, setChatOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [watchlist, setWatchlist] = useState<StockWatchlistItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_WATCHLIST_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved) as StockWatchlistItem[];
        if (Array.isArray(parsed)) {
          return parsed.map((item) => ({
            ...item,
            industry: item.industry || '',
            headlineCount: typeof item.headlineCount === 'number' ? item.headlineCount : 0,
            currentPrice: typeof item.currentPrice === 'number' ? item.currentPrice : null,
            priceCurrency: item.priceCurrency || 'USD',
            analystIntrinsicValue:
              typeof item.analystIntrinsicValue === 'number' ? item.analystIntrinsicValue : null,
            valuationSource: item.valuationSource || '',
            forwardPe: typeof item.forwardPe === 'number' ? item.forwardPe : null,
            trailingPe: typeof item.trailingPe === 'number' ? item.trailingPe : null,
            pegRatio: typeof item.pegRatio === 'number' ? item.pegRatio : null,
            evToEbitda: typeof item.evToEbitda === 'number' ? item.evToEbitda : null,
            priceToSales: typeof item.priceToSales === 'number' ? item.priceToSales : null,
            fcfYieldPct: typeof item.fcfYieldPct === 'number' ? item.fcfYieldPct : null,
            evToSales: typeof item.evToSales === 'number' ? item.evToSales : null,
            evToGrossProfit: typeof item.evToGrossProfit === 'number' ? item.evToGrossProfit : null,
            priceToBook: typeof item.priceToBook === 'number' ? item.priceToBook : null,
            grossMarginPct: typeof item.grossMarginPct === 'number' ? item.grossMarginPct : null,
            rsi14: typeof item.rsi14 === 'number' ? item.rsi14 : null,
            sma50: typeof item.sma50 === 'number' ? item.sma50 : null,
            sma200: typeof item.sma200 === 'number' ? item.sma200 : null,
            perf1W: typeof item.perf1W === 'number' ? item.perf1W : null,
            perf1M: typeof item.perf1M === 'number' ? item.perf1M : null,
            beta1Y: typeof item.beta1Y === 'number' ? item.beta1Y : null,
            epsRevisionDir: item.epsRevisionDir || null,
            epsRevisionNote: item.epsRevisionNote || '',
            fetchStatus: item.fetchStatus === 'loading' ? 'idle' : item.fetchStatus,
          }));
        }
      }
    } catch {
      // Ignore storage read failures
    }
    return parseWatchlistEntries(DEFAULT_WATCHLIST_STRING).map((entry) =>
      createEmptyWatchlistItem(entry.symbol, INITIAL_REFERENCE_REPORT, entry.exchangeOverride)
    );
  });
  const [isBatchRefreshing, setIsBatchRefreshing] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ done: number; total: number } | null>(null);
  const [stockGlobalError, setStockGlobalError] = useState<string | null>(null);
  const [liveTape, setLiveTape] = useState<LiveMarketTape | null>(null);
  const [isTapeLoading, setIsTapeLoading] = useState(false);

  const fetchLiveTape = async () => {
    setIsTapeLoading(true);
    try {
      const resp = await fetch('/api/market/tape');
      if (resp.ok) {
        const data = (await resp.json()) as LiveMarketTape;
        setLiveTape(data);
      }
    } catch {
      // Keep previous live tape if transient error occurs
    } finally {
      setIsTapeLoading(false);
    }
  };

  useEffect(() => {
    void fetchLiveTape();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify(reports));
    } catch {
      // Ignore storage quota errors
    }
  }, [reports]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(messages));
    } catch {
      // Ignore storage quota errors
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WATCHLIST_KEY, JSON.stringify(watchlist));
    } catch {
      // Ignore storage quota errors
    }
  }, [watchlist]);

  const activeReport = useMemo(
    () => reports.find((r) => r.id === activeReportId) ?? reports[0] ?? INITIAL_REFERENCE_REPORT,
    [reports, activeReportId]
  );

  const handleSaveWatchlistEntries = (entries: ParsedWatchlistEntry[]) => {
    const bySymbol = new Map<string, StockWatchlistItem>();
    for (const item of watchlist) {
      bySymbol.set(item.symbol.toUpperCase(), item);
    }

    let addedCount = 0;
    const nextList: StockWatchlistItem[] = [];
    for (const entry of entries) {
      const upper = entry.symbol.toUpperCase();
      const existing = bySymbol.get(upper);
      if (existing) {
        nextList.push({
          ...existing,
          exchangeOverride: entry.exchangeOverride,
        });
      } else {
        addedCount += 1;
        nextList.push(createEmptyWatchlistItem(upper, activeReport, entry.exchangeOverride));
      }
    }

    setWatchlist(nextList);
    setStockGlobalError(null);
    return { total: nextList.length, addedCount };
  };

  const handleRemoveWatchlistTicker = (symbol: string) => {
    const upper = symbol.toUpperCase();
    setWatchlist((prev) => prev.filter((item) => item.symbol.toUpperCase() !== upper));
  };

  const handleClearWatchlist = () => {
    setWatchlist([]);
    setStockGlobalError(null);
  };

  const handleRefreshWatchlistTickers = async (symbols: string[]) => {
    const uniqueSymbols = Array.from(new Set(symbols.map((s) => s.toUpperCase())));
    if (uniqueSymbols.length === 0) return;

    const overrideLookup = new Map<string, string>();
    for (const item of watchlist) {
      if (item.exchangeOverride) {
        overrideLookup.set(item.symbol.toUpperCase(), `${item.exchangeOverride}:${item.symbol.toUpperCase()}`);
      }
    }

    const isMulti = uniqueSymbols.length > 1;
    setStockGlobalError(null);
    if (isMulti) {
      setIsBatchRefreshing(true);
      setBatchProgress({ done: 0, total: uniqueSymbols.length });
      void fetchLiveTape();
    }

    const activeClustersPayload = activeReport.section3.clusters.map((c) => ({
      id: c.id,
      name: c.name,
      score: c.score,
      biasLabel: c.biasLabel,
    }));

    const BATCH_SIZE = 15;
    let completed = 0;

    try {
      for (let i = 0; i < uniqueSymbols.length; i += BATCH_SIZE) {
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 600));
        }
        const chunk = uniqueSymbols.slice(i, i + BATCH_SIZE);
        const requestTickers = chunk.map((sym) => overrideLookup.get(sym) ?? sym);

        setWatchlist((prev) =>
          prev.map((item) =>
            chunk.includes(item.symbol.toUpperCase())
              ? { ...item, fetchStatus: 'loading', fetchError: null }
              : item
          )
        );

        try {
          const response = await fetch('/api/stocks/sentiment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tickers: requestTickers,
              activeClusters: activeClustersPayload,
            }),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || `Request failed (${response.status})`);
          }

          const returnedStocks = Array.isArray(data.stocks) ? data.stocks : [];
          const bySymbol = new Map<string, typeof returnedStocks[number]>();
          for (const st of returnedStocks) {
            if (st?.symbol) {
              bySymbol.set(String(st.symbol).toUpperCase(), st);
            }
          }

          const fetchedAt = data.fetchedAt || new Date().toISOString();

          setWatchlist((prev) =>
            prev.map((item) => {
              const upper = item.symbol.toUpperCase();
              if (!chunk.includes(upper)) return item;
              const match = bySymbol.get(upper);
              if (!match) {
                return {
                  ...item,
                  fetchStatus: 'error',
                  fetchError: 'Ticker not returned by lookup. Retry this row.',
                };
              }
              return {
                ...item,
                companyName: match.companyName || item.companyName,
                industry: match.industry || item.industry || '',
                mappedClusterId: match.mappedClusterId || item.mappedClusterId,
                currentPrice:
                  typeof match.currentPrice === 'number' ? match.currentPrice : null,
                premarketPrice:
                  typeof match.premarketPrice === 'number' ? match.premarketPrice : null,
                premarketChangePct:
                  typeof match.premarketChangePct === 'number' ? match.premarketChangePct : null,
                premarketVolume:
                  typeof match.premarketVolume === 'number' ? match.premarketVolume : null,
                priceCurrency: match.priceCurrency || item.priceCurrency || 'USD',
                analystIntrinsicValue:
                  typeof match.analystIntrinsicValue === 'number'
                    ? match.analystIntrinsicValue
                    : null,
                valuationSource: match.valuationSource || '',
                forwardPe: typeof match.forwardPe === 'number' ? match.forwardPe : null,
                trailingPe: typeof match.trailingPe === 'number' ? match.trailingPe : null,
                pegRatio: typeof match.pegRatio === 'number' ? match.pegRatio : null,
                evToEbitda: typeof match.evToEbitda === 'number' ? match.evToEbitda : null,
                priceToSales: typeof match.priceToSales === 'number' ? match.priceToSales : null,
                fcfYieldPct: typeof match.fcfYieldPct === 'number' ? match.fcfYieldPct : null,
                evToSales: typeof match.evToSales === 'number' ? match.evToSales : null,
                evToGrossProfit:
                  typeof match.evToGrossProfit === 'number' ? match.evToGrossProfit : null,
                priceToBook: typeof match.priceToBook === 'number' ? match.priceToBook : null,
                grossMarginPct:
                  typeof match.grossMarginPct === 'number' ? match.grossMarginPct : null,
                rsi14: typeof match.rsi14 === 'number' ? match.rsi14 : null,
                sma50: typeof match.sma50 === 'number' ? match.sma50 : null,
                sma200: typeof match.sma200 === 'number' ? match.sma200 : null,
                perf1W: typeof match.perf1W === 'number' ? match.perf1W : null,
                perf1M: typeof match.perf1M === 'number' ? match.perf1M : null,
                beta1Y: typeof match.beta1Y === 'number' ? match.beta1Y : null,
                epsRevisionDir: match.epsRevisionDir || 'unknown',
                epsRevisionNote: match.epsRevisionNote || '',
                lastFetchedAt: fetchedAt,
                fetchStatus: 'ready',
                fetchError: null,
                newsScore: typeof match.newsScore === 'number' ? match.newsScore : 0,
                newsBias: match.newsBias || 'neutral',
                headlineCount:
                  typeof match.headlineCount === 'number' ? match.headlineCount : 0,
                oneLineTakeaway: match.oneLineTakeaway || '',
                plainTextSource: match.plainTextSource || '',
                earningsDate: match.earningsDate || 'N/A (not scheduled)',
                earningsWithinDays:
                  typeof match.earningsWithinDays === 'number' ? match.earningsWithinDays : null,
                catalystWarning: match.catalystWarning || '',
                plainEnglishReason: match.plainEnglishReason || '',
                recentHeadlines: Array.isArray(match.recentHeadlines) ? match.recentHeadlines : [],
              };
            })
          );
        } catch (err) {
          const errMessage =
            err instanceof Error ? err.message : 'Unable to fetch stock sentiment.';
          setWatchlist((prev) =>
            prev.map((item) =>
              chunk.includes(item.symbol.toUpperCase())
                ? { ...item, fetchStatus: 'error', fetchError: errMessage }
                : item
            )
          );
          if (isMulti) {
            setStockGlobalError(errMessage);
          }
        }

        completed += chunk.length;
        if (isMulti) {
          setBatchProgress({ done: Math.min(completed, uniqueSymbols.length), total: uniqueSymbols.length });
        }
      }
    } finally {
      setIsBatchRefreshing(false);
      setBatchProgress(null);
    }
  };

  const handleSubmitPrompt = async (
    prompt: string,
    mode: 'auto' | 'force-scan' | 'follow-up'
  ) => {
    const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `u-${uid()}`,
      role: 'user',
      content: prompt,
      timestamp: nowTime,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/macro/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          mode,
          activeReportSummary: summarizeReportForChat(activeReport),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Request failed (${response.status})`);
      }

      if (data.type === 'report' && data.report) {
        const newReport = sanitizeMacroReport(data.report as MacroReport);
        setReports((prev) => [newReport, ...prev.filter((r) => r.id !== newReport.id)]);
        setActiveReportId(newReport.id);
        setViewMode('dashboard');

        const assistantMsg: ChatMessage = {
          id: `a-${uid()}`,
          role: 'assistant',
          content: data.assistantMessage || 'Macro report generated and loaded into dashboard.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reportId: newReport.id,
          mode: data.mode,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        const sourcesText =
          Array.isArray(data.sources) && data.sources.length > 0
            ? `\n\nSources: ${data.sources.map((s: { title: string }) => s.title).slice(0, 3).join(' · ')}`
            : '';
        const assistantMsg: ChatMessage = {
          id: `a-${uid()}`,
          role: 'assistant',
          content: `${data.assistantMessage || 'No response.'}${sourcesText}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: 'follow-up',
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : 'Unable to complete macro analysis.';
      const errorMsg: ChatMessage = {
        id: `e-${uid()}`,
        role: 'assistant',
        content: errMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunLiveDefaultPrompt = () => {
    setChatOpen(true);
    handleSubmitPrompt(DEFAULT_MACRO_PROMPT, 'force-scan');
  };

  const handleDeleteReport = (reportId: string) => {
    setReports((prev) => {
      const next = prev.filter((r) => r.id !== reportId);
      if (activeReportId === reportId && next[0]) {
        setActiveReportId(next[0].id);
      }
      return next.length > 0 ? next : [INITIAL_REFERENCE_REPORT];
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b111b] text-slate-200">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-[#0d1522] border-b border-slate-800 px-6 py-3.5 flex items-center justify-between gap-8">
        <a
          href="#section-baseline"
          className="text-base font-display font-bold tracking-tight text-slate-100 whitespace-nowrap shrink-0"
        >
          MacroRegime Desk
        </a>

        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-400">
          <a
            href="#section-baseline"
            onClick={() => setViewMode('dashboard')}
            className="hover:text-slate-100 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
          >
            Baseline
          </a>
          <a
            href="#section-commodities"
            onClick={() => setViewMode('dashboard')}
            className="hover:text-slate-100 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
          >
            Commodities
          </a>
          <a
            href="#section-clusters"
            onClick={() => setViewMode('dashboard')}
            className="hover:text-slate-100 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
          >
            8-Cluster
          </a>
          <a
            href="#section-pairs"
            onClick={() => setViewMode('dashboard')}
            className="hover:text-slate-100 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
          >
            Pairs &amp; Posture
          </a>
          <a
            href="#section-matrix"
            onClick={() => setViewMode('dashboard')}
            className="hover:text-slate-100 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
          >
            5-5-5 Matrix
          </a>
        </nav>

        <div className="shrink-0">
          <button
            type="button"
            onClick={handleRunLiveDefaultPrompt}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-950 bg-slate-100 rounded-md hover:bg-white disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run Live Macro Scan</span>
          </button>
        </div>
      </header>

      {/* Main Split Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Left Sidebar: App Chat & Prompt Runner */}
        {chatOpen && (
          <div className="w-full lg:w-[370px] xl:w-[400px] lg:sticky lg:top-[57px] lg:h-[calc(100vh-57px)] shrink-0 z-20">
            <MacroChatPanel
              messages={messages}
              reports={reports}
              activeReportId={activeReport.id}
              isLoading={isLoading}
              onSelectReport={(id) => {
                setActiveReportId(id);
                setViewMode('dashboard');
              }}
              onSubmitPrompt={handleSubmitPrompt}
              onDeleteReport={handleDeleteReport}
            />
          </div>
        )}

        {/* Right Main Content Viewport */}
        <main className="flex-1 min-w-0">
          {/* Workspace Toolbar (Mode Switcher & Active Report Context) */}
          <div className="bg-[#0d1522] border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setChatOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 border border-slate-700 hover:bg-slate-800 hover:text-slate-100 rounded-md transition-colors whitespace-nowrap shrink-0"
              >
                {chatOpen ? (
                  <>
                    <PanelLeftClose className="w-3.5 h-3.5" />
                    <span>Hide Chat</span>
                  </>
                ) : (
                  <>
                    <PanelLeftOpen className="w-3.5 h-3.5" />
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open App Chat</span>
                  </>
                )}
              </button>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 min-w-0">
                <span className="font-semibold text-slate-100 truncate">
                  {activeReport.sourceLabel}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono truncate">
                  {activeReport.section1.verificationTimestamp}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-md shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('dashboard')}
                className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 transition-colors ${
                  viewMode === 'dashboard'
                    ? 'bg-slate-800 text-slate-100'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Dashboard View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('markdown')}
                className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 transition-colors ${
                  viewMode === 'markdown'
                    ? 'bg-slate-800 text-slate-100'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Markdown Output
              </button>
              <button
                type="button"
                onClick={() => setViewMode('stocks')}
                className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 transition-colors ${
                  viewMode === 'stocks'
                    ? 'bg-slate-800 text-slate-100'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Stocks Sentiment{watchlist.length > 0 ? ` (${watchlist.length})` : ''}
              </button>
            </div>
          </div>

          {/* Active Output Content */}
          <div
            className={`mx-auto px-6 py-8 ${
              viewMode === 'stocks' ? 'max-w-[1600px]' : 'max-w-[1280px]'
            }`}
          >
            {viewMode === 'markdown' ? (
              <MarkdownReportView report={activeReport} />
            ) : viewMode === 'stocks' ? (
              <StocksSentimentView
                activeReport={activeReport}
                watchlist={watchlist}
                liveTape={liveTape}
                isTapeLoading={isTapeLoading}
                onRefreshTape={fetchLiveTape}
                isBatchRefreshing={isBatchRefreshing}
                batchProgress={batchProgress}
                globalError={stockGlobalError}
                onSaveWatchlistEntries={handleSaveWatchlistEntries}
                onRemoveTicker={handleRemoveWatchlistTicker}
                onClearAll={handleClearWatchlist}
                onRefreshTickers={handleRefreshWatchlistTickers}
              />
            ) : (
              <div className="space-y-12">
                <BaselineSection
                  section1={activeReport.section1}
                  liveTape={liveTape}
                  isTapeLoading={isTapeLoading}
                  onRefreshTape={fetchLiveTape}
                />
                <CommoditiesSection section2={activeReport.section2} />
                <ClusterDashboardSection section3={activeReport.section3} />
                <PairsPostureSection section4={activeReport.section4} />
                <RotationMatrixSection
                  section5={activeReport.section5}
                  section6={activeReport.section6}
                  section7={activeReport.section7}
                />

                {/* Plain-Text Sources Footer */}
                {activeReport.sources.length > 0 && (
                  <footer className="border-t border-slate-800 pt-6 space-y-1.5">
                    <div className="text-xs font-semibold text-slate-200">
                      Sources Checked (Plain Text · {activeReport.sources.length})
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {activeReport.sources.map((src) => src.title).join(' · ')}
                    </p>
                  </footer>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
