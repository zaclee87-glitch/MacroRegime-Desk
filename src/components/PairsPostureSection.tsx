import React, { useState } from 'react';
import { Shield, GitCompareArrows } from 'lucide-react';
import { CLUSTER_REFERENCE_MAP } from '../data/referenceBaseline';
import { MacroReport } from '../types/macro';

interface PairsPostureSectionProps {
  section4: MacroReport['section4'];
}

export function PairsPostureSection({ section4 }: PairsPostureSectionProps) {
  const [showRefMap, setShowRefMap] = useState(false);

  return (
    <section id="section-pairs" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <h2 className="text-xl font-semibold tracking-tight text-slate-100">
          04. Smart Pairs, Portfolio Posture &amp; Rate Sensitivity
        </h2>
        <button
          type="button"
          onClick={() => setShowRefMap((v) => !v)}
          className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-[#0f172a] border border-slate-700 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
        >
          {showRefMap ? 'Hide Reference Map' : 'Inspect 8-Cluster Reference Map'}
        </button>
      </div>

      {/* Optional Expandable Reference Map */}
      {showRefMap && (
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100">
              8-Cluster Correlation &amp; Watchlist Reference Map
            </h3>
            <span className="text-xs text-slate-400">Static Correlation Relationships</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0b111b] text-slate-400 font-medium">
                  <th className="py-2.5 px-3 whitespace-nowrap">Cluster</th>
                  <th className="py-2.5 px-3">Moves Together</th>
                  <th className="py-2.5 px-3">Moves Opposite</th>
                  <th className="py-2.5 px-3">Neutral / Independent</th>
                  <th className="py-2.5 px-3">Main Driver</th>
                  <th className="py-2.5 px-3">Sample Tickers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {CLUSTER_REFERENCE_MAP.map((ref) => (
                  <tr key={ref.code} className="hover:bg-[#131d2f]">
                    <td className="py-2.5 px-3 font-medium text-slate-100">
                      <div>{ref.code}. {ref.name}</div>
                      <div className="font-mono text-slate-400">{ref.proxies}</div>
                    </td>
                    <td className="py-2.5 px-3 text-emerald-400">{ref.positiveCorr}</td>
                    <td className="py-2.5 px-3 text-rose-400">{ref.inverseCorr}</td>
                    <td className="py-2.5 px-3 text-slate-400">{ref.neutralOrthogonal}</td>
                    <td className="py-2.5 px-3 text-slate-300">{ref.coreDriver}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400 leading-snug">
                      {ref.sampleTickers.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2-3 Month Portfolio Posture */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-1.5">
          <div className="text-xs font-medium text-slate-400">Stock Exposure</div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {section4.portfolioPosture.netEquityTilt}
          </p>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-1.5">
          <div className="text-xs font-medium text-slate-400">Style Tilt</div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {section4.portfolioPosture.factorTilt}
          </p>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-1.5">
          <div className="text-xs font-medium text-slate-400">Commodity Tilt</div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {section4.portfolioPosture.commodityTilt}
          </p>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-1.5">
          <div className="text-xs font-medium text-slate-400">Cash &amp; Hedge Level</div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {section4.portfolioPosture.hedgeCashPosture}
          </p>
        </div>
      </div>

      {/* Top 3 Pairs & Top 2 Hedges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-100">
              Top 3 Long / Short Pairs
            </h3>
            <GitCompareArrows className="w-4 h-4 text-slate-500" />
          </div>
          <div className="divide-y divide-slate-800">
            {section4.topPairs.map((pair, idx) => (
              <div key={idx} className="py-3.5 first:pt-0 last:pb-0 space-y-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="text-sm font-semibold text-slate-100">
                    {idx + 1}. {pair.title}
                  </h4>
                  <div className="text-xs font-mono text-slate-400 tabular-nums">
                    Score Gap: {pair.scoreSpread} · Ratio: {pair.ratioProxy}
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <span className="font-semibold text-slate-200">Plain-English Thesis: </span>
                  {pair.causalThesis}
                </p>
                <p className="text-xs text-amber-400 leading-relaxed">
                  <span className="font-semibold">What Proves It Wrong: </span>
                  {pair.invalidation}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-100">Top 2 Portfolio Hedges</h3>
            <Shield className="w-4 h-4 text-slate-500" />
          </div>
          <div className="space-y-4">
            {section4.macroHedges.map((hedge, idx) => (
              <div key={idx} className="space-y-1">
                <h4 className="text-xs font-semibold text-slate-100">
                  {idx + 1}. {hedge.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">{hedge.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real Yield (DFII10) Impact Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100">
            Real Yield (DFII10) Impact Table
          </h3>
          <span className="text-xs font-mono text-slate-400">Impact if inflation-adjusted rates rise</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0b111b] text-slate-400 font-medium">
                <th className="py-2.5 px-3.5">Cluster</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Proxy</th>
                <th className="py-2.5 px-3">Impact When Real Yields Rise</th>
                <th className="py-2.5 px-3.5">1-Line Plain-English Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {section4.realYieldSensitivity.map((row, idx) => (
                <tr key={`${row.proxy}-${idx}`} className="hover:bg-[#131d2f] transition-colors">
                  <td className="py-2.5 px-3.5 font-medium text-slate-100">
                    {row.cluster}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-400 whitespace-nowrap">
                    {row.proxy}
                  </td>
                  <td
                    className={`py-2.5 px-3 font-semibold ${
                      row.sensitivityTier === 'high-negative'
                        ? 'text-rose-400'
                        : row.sensitivityTier === 'moderate-negative'
                          ? 'text-amber-400'
                          : row.sensitivityTier === 'positive'
                            ? 'text-emerald-400'
                            : 'text-slate-300'
                    }`}
                  >
                    {row.sensitivityLabel}
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-300 leading-snug">{row.channel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
