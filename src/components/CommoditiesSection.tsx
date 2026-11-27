import React from 'react';
import { MacroReport } from '../types/macro';
import { ToneText } from './StatusIndicator';

interface CommoditiesSectionProps {
  section2: MacroReport['section2'];
}

export function CommoditiesSection({ section2 }: CommoditiesSectionProps) {
  return (
    <section id="section-commodities" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <h2 className="text-xl font-semibold tracking-tight text-slate-100">
          02. Commodity Complex Outlook (Oil, Gold, Copper &amp; Key Cross-Commodities)
        </h2>
        <span className="text-xs font-mono text-slate-400">
          2–3 Month Directional View
        </span>
      </div>

      {/* Commodity Summary Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0b111b] text-slate-400 font-medium">
                <th className="py-2.5 px-3.5">Commodity &amp; Ticker</th>
                <th className="py-2.5 px-2.5 text-right">Last Price</th>
                <th className="py-2.5 px-2.5 text-right">1W / 1M %</th>
                <th className="py-2.5 px-3">Chart Posture (vs 50/200 DMA &amp; RSI)</th>
                <th className="py-2.5 px-3">2–3M View &amp; Conviction</th>
                <th className="py-2.5 px-3.5">Main Driver (Plain English)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {section2.commodities.map((c, idx) => (
                <tr key={`${c.ticker}-${idx}`} className="hover:bg-[#131d2f] transition-colors">
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <div className="font-semibold text-slate-100">{c.name}</div>
                    <div className="font-mono text-slate-400">{c.ticker}</div>
                  </td>
                  <td className="py-3 px-2.5 font-mono font-semibold text-slate-100 text-right tabular-nums">
                    {c.lastPrice}
                  </td>
                  <td className="py-3 px-2.5 font-mono text-slate-300 text-right tabular-nums">
                    {c.change1W} / {c.change1M}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    <div className="leading-snug">{c.technicalPosture}</div>
                    {c.rsiValue !== null && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              c.rsiValue <= 30
                                ? 'bg-amber-400'
                                : c.rsiValue >= 65
                                  ? 'bg-rose-400'
                                  : 'bg-slate-400'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, c.rsiValue))}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                          RSI {c.rsiValue}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <ToneText tone={c.viewBias} label={`${c.viewLabel} (${c.conviction})`} />
                  </td>
                  <td className="py-3 px-3.5 text-slate-300 leading-snug">{c.driver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Copper / Gold Ratio Signal Banner */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-baseline gap-2">
        <span className="text-xs font-semibold text-slate-100 whitespace-nowrap shrink-0">
          Copper / Gold Ratio Signal:
        </span>
        <span className="text-xs text-slate-300 leading-relaxed">
          {section2.copperGoldSignal}
        </span>
      </div>

      {/* Commodity Rationales & Stock Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {section2.rationales.map((rat, idx) => (
          <div
            key={idx}
            className="bg-[#0f172a] border border-slate-800 rounded-lg p-5 flex flex-col justify-between gap-3"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-100">{rat.title}</h3>
                <ToneText tone={rat.bias} label="" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{rat.body}</p>
            </div>
            <div className="pt-3 border-t border-slate-800 text-xs text-slate-300">
              <span className="font-semibold text-slate-100">Stock Impact: </span>
              <span>{rat.equityTransmission}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
