import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { ClusterAnalysis, MacroReport } from '../types/macro';
import { MomentumLabel, ToneText } from './StatusIndicator';

interface ClusterDashboardSectionProps {
  section3: MacroReport['section3'];
}

type BiasFilter = 'all' | 'bullish' | 'neutral' | 'bearish';

export function ClusterDashboardSection({ section3 }: ClusterDashboardSectionProps) {
  const sortedClusters = useMemo(
    () => [...section3.clusters].sort((a, b) => a.rank - b.rank),
    [section3.clusters]
  );

  const [selectedId, setSelectedId] = useState<string>(sortedClusters[0]?.id ?? 'C5');
  const [biasFilter, setBiasFilter] = useState<BiasFilter>('all');
  const [tickerQuery, setTickerQuery] = useState('');

  const selectedCluster: ClusterAnalysis | undefined =
    sortedClusters.find((c) => c.id === selectedId) ?? sortedClusters[0];

  const filteredClusters = useMemo(() => {
    return sortedClusters.filter((c) => {
      if (biasFilter === 'bullish' && c.score < 2) return false;
      if (biasFilter === 'neutral' && (c.score < -1 || c.score > 1)) return false;
      if (biasFilter === 'bearish' && c.score > -2) return false;
      if (tickerQuery.trim()) {
        const q = tickerQuery.trim().toLowerCase();
        const haystack = [
          c.id,
          c.name,
          c.primaryEtf,
          ...c.favoredTickers,
          ...c.avoidTickers,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [sortedClusters, biasFilter, tickerQuery]);

  return (
    <section id="section-clusters" className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-100">
            03. 8-Cluster Scoreboard, Trends &amp; Watchlist Focus
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Scored -8 to +8 across Macro Fit (A), Trend (B), Earnings (C), and Money Flows (D)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={tickerQuery}
              onChange={(e) => setTickerQuery(e.target.value)}
              placeholder="Filter ticker or ETF..."
              aria-label="Filter clusters by ticker or ETF"
              className="pl-8 pr-3 py-1.5 text-xs bg-[#0f172a] border border-slate-800 rounded-md text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 w-44"
            />
          </div>
          <div className="flex items-center gap-1 bg-[#0f172a] border border-slate-800 p-1 rounded-md">
            {(
              [
                { key: 'all', label: 'All 8' },
                { key: 'bullish', label: 'Bullish' },
                { key: 'neutral', label: 'Neutral' },
                { key: 'bearish', label: 'Bearish' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setBiasFilter(tab.key)}
                className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 transition-colors ${
                  biasFilter === tab.key
                    ? 'bg-slate-800 text-slate-100'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Full-Width 8-Cluster Ranking Table (Zero Cut-off) */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100">8-Cluster Ranking Table</h3>
          <span className="text-xs text-slate-400">
            Showing {filteredClusters.length} of {sortedClusters.length} · Click any row to inspect
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0b111b] text-slate-400 font-medium">
                <th className="py-2.5 px-3.5">Rank &amp; Cluster</th>
                <th className="py-2.5 px-2.5 whitespace-nowrap">Primary ETF</th>
                <th className="py-2.5 px-2.5 whitespace-nowrap">Score &amp; Bias</th>
                <th className="py-2.5 px-3">Momentum &amp; Lifecycle Stage</th>
                <th className="py-2.5 px-3.5">2–3M Trading Stance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredClusters.map((c, idx) => {
                const isSelected = selectedCluster?.id === c.id;
                const displayName = c.name.replace(new RegExp(`^${c.id}\\s*:\\s*`, 'i'), '');
                return (
                  <tr
                    key={`${c.id}-${c.rank}-${idx}`}
                    onClick={() => setSelectedId(c.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#152033]' : 'hover:bg-[#131d2f]'
                    }`}
                  >
                    <td className="py-2.5 px-3.5 font-medium text-slate-100">
                      <span className="font-mono text-slate-500 mr-1.5">{c.rank}.</span>
                      <span className="font-mono font-semibold text-slate-300 mr-1">{c.id}:</span>
                      <span>{displayName}</span>
                    </td>
                    <td className="py-2.5 px-2.5 font-mono text-slate-300 whitespace-nowrap">
                      {c.primaryEtf}
                    </td>
                    <td className="py-2.5 px-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-semibold text-slate-100 tabular-nums w-6">
                          {c.score > 0 ? `+${c.score}` : c.score}
                        </span>
                        <ToneText tone={c.bias} label={c.biasLabel} />
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <MomentumLabel direction={c.momentumDirection} label={c.momentumLabel} />
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {c.lifecycleStage}
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-300 leading-snug">{c.tradingView}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diverging Conviction Spectrum + Deep-Dive Inspector Split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Diverging Bar Visualization */}
        <div className="xl:col-span-4 bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-100">Conviction Spectrum (-8 to +8)</span>
            <span className="font-mono text-slate-500">Select</span>
          </div>

          <div className="space-y-2">
            {sortedClusters.map((c, idx) => {
              const isSelected = selectedCluster?.id === c.id;
              const pct = (Math.abs(c.score) / 8) * 50;
              const isPos = c.score >= 0;
              const displayName = c.name.replace(new RegExp(`^${c.id}\\s*:\\s*`, 'i'), '');
              return (
                <button
                  key={`${c.id}-${c.rank}-${idx}`}
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full text-left rounded-md px-2.5 py-2 transition-colors border ${
                    isSelected
                      ? 'bg-[#152033] border-slate-600'
                      : 'bg-[#0b111b] border-transparent hover:bg-[#131d2f]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-mono font-semibold text-slate-400 w-5 shrink-0">
                        {c.id}
                      </span>
                      <span className="font-medium text-slate-100 truncate">{displayName}</span>
                      <span className="font-mono text-slate-500 shrink-0">{c.primaryEtf}</span>
                    </div>
                    <span
                      className={`font-mono font-semibold tabular-nums shrink-0 ${
                        c.score >= 2
                          ? 'text-emerald-400'
                          : c.score <= -2
                            ? 'text-rose-400'
                            : 'text-slate-300'
                      }`}
                    >
                      {c.score > 0 ? `+${c.score}` : c.score}
                    </span>
                  </div>
                  <div className="relative h-2 bg-slate-800 rounded-sm overflow-hidden">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-600 z-10" />
                    <div
                      className={`absolute top-0 bottom-0 transition-all ${
                        c.score >= 2
                          ? 'bg-emerald-500'
                          : c.score <= -2
                            ? 'bg-rose-500'
                            : 'bg-amber-400'
                      }`}
                      style={{
                        left: isPos ? '50%' : `${50 - pct}%`,
                        width: `${pct}%`,
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Focused Cluster Deep-Dive Inspector */}
        {selectedCluster && (
          <div className="xl:col-span-8 bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="font-mono font-semibold text-slate-200">
                    Rank #{selectedCluster.rank} · {selectedCluster.id}
                  </span>
                  <span aria-hidden="true">/</span>
                  <span className="font-mono">{selectedCluster.primaryEtf}</span>
                  <span aria-hidden="true">/</span>
                  <span className="font-mono">{selectedCluster.lifecycleStage}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-100">
                  {selectedCluster.name.replace(new RegExp(`^${selectedCluster.id}\\s*:\\s*`, 'i'), '')} ({selectedCluster.primaryEtf})
                </h3>
              </div>

              <div className="text-right">
                <div className="text-[11px] text-slate-400">Total Score</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl font-mono font-semibold text-slate-100 tabular-nums">
                    {selectedCluster.score > 0 ? `+${selectedCluster.score}` : selectedCluster.score}
                  </span>
                  <ToneText tone={selectedCluster.bias} label={selectedCluster.biasLabel} />
                </div>
              </div>
            </div>

            {/* 4-Factor Breakdown Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(
                [
                  { label: 'A. Macro Regime Fit', val: selectedCluster.factorBreakdown.a },
                  { label: 'B. Trend & Inflection', val: selectedCluster.factorBreakdown.b },
                  { label: 'C. Earnings Revisions', val: selectedCluster.factorBreakdown.c },
                  { label: 'D. Money Flows', val: selectedCluster.factorBreakdown.d },
                ] as const
              ).map((f) => (
                <div key={f.label} className="bg-[#0b111b] border border-slate-800 rounded-md p-3">
                  <div className="text-[11px] text-slate-400">{f.label}</div>
                  <div
                    className={`text-base font-mono font-semibold tabular-nums mt-0.5 ${
                      f.val > 0 ? 'text-emerald-400' : f.val < 0 ? 'text-rose-400' : 'text-slate-300'
                    }`}
                  >
                    {f.val > 0 ? `+${f.val}` : f.val} / ±2
                  </div>
                </div>
              ))}
            </div>

            {/* Chart Snapshot & Latest Catalyst */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-100">Chart Snapshot</div>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {selectedCluster.technicalContext}
                </p>
                <div className="text-xs font-semibold text-slate-100 pt-2">
                  Latest Catalyst (Past 7 Days)
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {selectedCluster.verifiedCatalyst}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-100">
                  Sub-Groups
                </div>
                <div className="divide-y divide-slate-800 border border-slate-800 rounded-md bg-[#0b111b]">
                  {selectedCluster.subClusters.map((sc, i) => (
                    <div key={`${sc.name}-${i}`} className="px-3 py-2 flex items-start justify-between gap-3 text-xs">
                      <div className="font-medium text-slate-100 shrink-0">
                        <ToneText tone={sc.status} label={sc.name} />
                      </div>
                      <span className="text-slate-400 text-right">{sc.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trading Focus & Watchlist Names */}
            <div className="pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <div className="font-semibold text-slate-100 mb-1">Trading Focus &amp; Watchlist Names</div>
                <p className="text-slate-400 leading-relaxed">
                  <span className="font-medium text-slate-200">{selectedCluster.tradingView}.</span>{' '}
                  {selectedCluster.clusterRationale}
                </p>
              </div>
              <div>
                <div className="font-semibold text-emerald-400 mb-1.5">Favor</div>
                <div className="font-mono text-xs text-emerald-300 leading-relaxed">
                  {selectedCluster.favoredTickers.join(' · ')}
                </div>
              </div>
              <div>
                <div className="font-semibold text-rose-400 mb-1.5">Avoid / Short</div>
                <div className="font-mono text-xs text-rose-300 leading-relaxed">
                  {selectedCluster.avoidTickers.join(' · ')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Ticker-Picking Summary Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-slate-100">
            Quick Ticker-Picking Summary
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0b111b] text-slate-400 font-medium">
                <th className="py-2.5 px-3.5 whitespace-nowrap">Cluster</th>
                <th className="py-2.5 px-3">2–3M Stance &amp; Conviction</th>
                <th className="py-2.5 px-3">Plain-English Reason (1-Line)</th>
                <th className="py-2.5 px-3">Watchlist Names to Favor</th>
                <th className="py-2.5 px-3.5">Watchlist Names to Avoid / Short</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredClusters.map((c, idx) => (
                <tr key={`${c.id}-${c.rank}-${idx}`} className="hover:bg-[#131d2f] transition-colors">
                  <td className="py-2.5 px-3.5 font-mono font-semibold text-slate-100 whitespace-nowrap">
                    {c.id} ({c.primaryEtf})
                  </td>
                  <td className="py-2.5 px-3">
                    <ToneText tone={c.bias} label={`${c.stanceSummary} (${c.conviction})`} />
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 leading-snug">{c.clusterRationale}</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-400 leading-snug">
                    {c.favoredTickers.join(', ')}
                  </td>
                  <td className="py-2.5 px-3.5 font-mono text-rose-400 leading-snug">
                    {c.avoidTickers.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
