import React, { useState } from 'react';
import {
  ArrowRight,
  Calendar,
  AlertTriangle,
  Activity,
  ShieldCheck,
  CheckCircle2,
  PauseCircle,
  XCircle,
  Zap,
  TrendingUp,
  TrendingDown,
  Newspaper,
} from 'lucide-react';
import { BaselineMetric, LiveMarketTape, MacroReport } from '../types/macro';
import { ToneText } from './StatusIndicator';
import { LiveTapeStrip } from './LiveTapeStrip';

interface BaselineSectionProps {
  section1: MacroReport['section1'];
  liveTape?: LiveMarketTape | null;
  isTapeLoading?: boolean;
  onRefreshTape?: () => void;
}

type MetricCategoryFilter = 'all' | BaselineMetric['category'];

const CATEGORY_TABS: { key: MetricCategoryFilter; label: string }[] = [
  { key: 'all', label: 'All Series' },
  { key: 'rates', label: 'Rates & Credit' },
  { key: 'volatility', label: 'Vol & Breadth' },
  { key: 'fx', label: 'Currencies' },
  { key: 'commodities', label: 'Commodities' },
];

export function BaselineSection({
  section1,
  liveTape = null,
  isTapeLoading = false,
  onRefreshTape,
}: BaselineSectionProps) {
  const [categoryFilter, setCategoryFilter] = useState<MetricCategoryFilter>('all');

  const filteredMetrics =
    categoryFilter === 'all'
      ? section1.baselineMetrics
      : section1.baselineMetrics.filter((m) => m.category === categoryFilter);

  const highlightKeys: string[][] = [
    ['US10Y'],
    ['US02Y'],
    ['T10Y2Y', '10Y-2Y'],
    ['DFII10'],
    ['VIX'],
    ['DXY'],
  ];
  const keyTiles = highlightKeys
    .map(
      (aliases) =>
        aliases
          .map(
            (key) =>
              section1.baselineMetrics.find(
                (m) => m.ticker === key || m.ticker.startsWith(`${key} (`)
              ) ?? section1.baselineMetrics.find((m) => m.ticker.includes(key))
          )
          .find(Boolean)
    )
    .filter((m): m is BaselineMetric => Boolean(m));

  const hasBrief = Boolean(section1.weekInBrief?.trim());
  const bigMoves = Array.isArray(section1.bigMoves) ? section1.bigMoves : [];

  return (
    <section id="section-baseline" className="space-y-6">
      {/* Opening Recap: The Week in Brief & Big Moves */}
      {(hasBrief || bigMoves.length > 0) && (
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-5">
          {hasBrief && (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <Newspaper className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>The Week in Brief</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Rolling Past 7 Calendar Days
                </span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {section1.weekInBrief}
              </p>
            </div>
          )}

          {bigMoves.length > 0 && (
            <div className={hasBrief ? 'pt-4 border-t border-slate-800/80 space-y-3' : 'space-y-3'}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Big Moves (Outsized Swings)</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {bigMoves.length} highlighted {bigMoves.length === 1 ? 'outlier' : 'outliers'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {bigMoves.map((bm, idx) => {
                  const isUp = bm.direction === 'up';
                  const isDown = bm.direction === 'down';
                  const moveTone = isUp
                    ? 'text-emerald-400'
                    : isDown
                      ? 'text-rose-400'
                      : 'text-amber-400';
                  return (
                    <div
                      key={idx}
                      className="bg-[#0b111b] border border-slate-800 rounded-md p-3.5 flex flex-col justify-between gap-2"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {isUp ? (
                              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : isDown ? (
                              <TrendingDown className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            ) : (
                              <Activity className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            )}
                            <span className="text-xs font-semibold text-slate-100 truncate">
                              {bm.asset}
                            </span>
                          </div>
                          <span className={`text-xs font-mono font-semibold tabular-nums shrink-0 ${moveTone}`}>
                            {bm.moveLabel}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-mono text-slate-400">
                          <span className="text-slate-300">{bm.dateLabel}</span>
                          {bm.volatilityTag && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-amber-300/90">{bm.volatilityTag}</span>
                            </>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {bm.detail}
                        </p>
                      </div>

                      {bm.sourceDate && (
                        <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-800/60">
                          {bm.sourceDate}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col gap-2 border-b border-slate-800 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-slate-100">
            01. Live Macro, Fear &amp; Market Breadth Baseline
          </h2>
          <span className="text-xs font-mono text-slate-400">
            {section1.verificationTimestamp}
          </span>
        </div>
      </div>

      {onRefreshTape && (
        <LiveTapeStrip
          tape={liveTape}
          isLoading={isTapeLoading}
          onRefresh={onRefreshTape}
        />
      )}

      {/* Regime Classification & Causal Chain */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-xs font-medium text-slate-400">
            Market Regime in Plain English
          </div>
          <div className="text-xs font-mono text-slate-400">
            2–3 Month Horizon
          </div>
        </div>
        <h3 className="text-lg font-semibold text-slate-100 text-balance">
          {section1.regimeName}
        </h3>
        <div className="pt-1">
          <div className="text-xs font-medium text-slate-400 mb-2">
            Cause-and-Effect Chain
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {section1.causalChain.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="bg-[#0b111b] border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 leading-snug max-w-xs">
                  {step}
                </div>
                {idx < section1.causalChain.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Key Rates & Macro KPI Strip */}
      {keyTiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {keyTiles.map((metric, idx) => (
            <div
              key={`${metric.ticker}-${idx}`}
              className="bg-[#0f172a] border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between gap-1.5"
            >
              <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                <span className="truncate font-medium">{metric.asset}</span>
              </div>
              <div className="text-lg font-mono font-semibold text-slate-100 tabular-nums">
                {metric.latestClose}
              </div>
              <div className="text-xs font-mono text-slate-400 tabular-nums truncate" title={metric.change1W}>
                1W: {metric.change1W}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Quantitative Tape Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Live Market Numbers &amp; Plain-English Signals
            </h3>
          </div>
          <div className="flex items-center gap-1 bg-[#0b111b] border border-slate-800 p-1 rounded-md overflow-x-auto">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setCategoryFilter(tab.key)}
                className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 transition-colors ${
                  categoryFilter === tab.key
                    ? 'bg-slate-800 text-slate-100'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0b111b] text-slate-400 font-medium">
                <th className="py-2.5 px-3.5">Asset / Metric</th>
                <th className="py-2.5 px-2.5">Ticker</th>
                <th className="py-2.5 px-2.5 text-right">Latest Close / Yield</th>
                <th className="py-2.5 px-2.5 text-right">1W Change</th>
                <th className="py-2.5 px-2.5 text-right">1M Change</th>
                <th className="py-2.5 px-3.5">Plain-English Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredMetrics.map((row, idx) => (
                <tr key={`${row.ticker}-${idx}`} className="hover:bg-[#131d2f] transition-colors">
                  <td className="py-2.5 px-3.5 font-medium text-slate-100">
                    {row.asset}
                  </td>
                  <td className="py-2.5 px-2.5 font-mono text-slate-400">
                    {row.ticker}
                  </td>
                  <td className="py-2.5 px-2.5 font-mono font-semibold text-slate-100 text-right tabular-nums">
                    {row.latestClose}
                  </td>
                  <td className="py-2.5 px-2.5 font-mono text-slate-300 text-right tabular-nums">
                    {row.change1W}
                  </td>
                  <td className="py-2.5 px-2.5 font-mono text-slate-300 text-right tabular-nums">
                    {row.change1M}
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-300">
                    <div className="flex items-start gap-2">
                      <ToneText tone={row.tone} label="" />
                      <span className="leading-snug">{row.signal}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SPX Credit-Spread Gate (3-Check Go / Wait Filter) */}
      {section1.creditSpreadGate && (
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  SPX Credit-Spread Gate (3-Check Go / Wait Filter)
                </h3>
                <p className="text-[11px] text-slate-400">
                  High-level market regime filter for 25-DTE SPX bull put spreads
                </p>
              </div>
            </div>
            <div
              className={`flex items-center gap-1.5 text-sm font-mono font-semibold whitespace-nowrap shrink-0 ${
                section1.creditSpreadGate.verdict === 'go'
                  ? 'text-emerald-400'
                  : section1.creditSpreadGate.verdict === 'caution'
                    ? 'text-amber-400'
                    : 'text-rose-400'
              }`}
            >
              {section1.creditSpreadGate.verdict === 'go' && (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              {section1.creditSpreadGate.verdict === 'caution' && (
                <PauseCircle className="w-4 h-4 shrink-0" />
              )}
              {section1.creditSpreadGate.verdict === 'wait' && (
                <XCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{section1.creditSpreadGate.verdictLabel}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {section1.creditSpreadGate.checks.map((chk, idx) => {
              const statusTone =
                chk.status === 'pass'
                  ? 'text-emerald-400'
                  : chk.status === 'caution'
                    ? 'text-amber-400'
                    : 'text-rose-400';
              return (
                <div
                  key={idx}
                  className="bg-[#0b111b] border border-slate-800 rounded-md p-3.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-100">
                      {idx + 1}. {chk.name}
                    </span>
                    <span
                      className={`text-[11px] font-mono font-semibold uppercase tracking-wide shrink-0 ${statusTone}`}
                    >
                      {chk.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{chk.detail}</p>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
            <span className="font-semibold text-slate-100">Gate Takeaway: </span>
            {section1.creditSpreadGate.summary}
          </p>
        </div>
      )}

      {/* 7-Day Catalysts & 3 Fracture Points */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-100">
              7-Day News &amp; Upcoming Calendar
            </h3>
            <Calendar className="w-4 h-4 text-slate-500" />
          </div>
          <div className="space-y-3.5">
            {section1.catalysts.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-100">{cat.title}</span>
                  <span className="text-xs font-mono text-slate-400">{cat.sourceDate}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{cat.detail}</p>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-800">
            <div className="text-xs font-semibold text-slate-200 mb-1">
              Upcoming Events (Next 2–4 Weeks)
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              {section1.upcomingCalendar}
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-100">
              3 Active Fracture Points
            </h3>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="space-y-4">
            {section1.stressPoints.map((sp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-mono font-semibold text-amber-400">
                    0{idx + 1}.
                  </span>
                  <h4 className="text-sm font-semibold text-slate-100">{sp.title}</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{sp.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
