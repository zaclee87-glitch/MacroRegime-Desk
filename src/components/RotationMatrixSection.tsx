import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { MacroReport, MatrixPick } from '../types/macro';
import { ReversalBadgeText, ToneText } from './StatusIndicator';

interface RotationMatrixSectionProps {
  section5: MacroReport['section5'];
  section6: MacroReport['section6'];
  section7: MacroReport['section7'];
}

type CategoryFilter = 'all' | 'bullish' | 'bearish' | 'reversing';

export function RotationMatrixSection({
  section5,
  section6,
  section7,
}: RotationMatrixSectionProps) {
  const [catFilter, setCatFilter] = useState<CategoryFilter>('all');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const filteredMatrix =
    catFilter === 'all'
      ? section5.matrixPicks
      : section5.matrixPicks.filter((m) => m.category === catFilter);

  const filteredCapsules =
    catFilter === 'all'
      ? section6.capsules
      : section6.capsules.filter((c) => c.category === catFilter);

  const handleRowClick = (pick: MatrixPick) => {
    setHighlightedId(pick.id);
    const el = document.getElementById(`capsule-${pick.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="space-y-10">
      {/* SECTION 5: 5-5-5 MASTER MATRIX */}
      <section id="section-matrix" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-100">
              05. The 5-5-5 Macro Rotation Master Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              15 distinct sub-industry picks across 5+ GICS sectors &amp; 5+ clusters · Click any row to jump to its tactical capsule
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[#0f172a] border border-slate-800 p-1 rounded-md">
            {(
              [
                { key: 'all', label: 'All 15' },
                { key: 'bullish', label: 'Bullish (5)' },
                { key: 'bearish', label: 'Bearish (5)' },
                { key: 'reversing', label: 'Reversing (5)' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setCatFilter(tab.key)}
                className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 transition-colors ${
                  catFilter === tab.key
                    ? 'bg-slate-800 text-slate-100'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0b111b] text-slate-400 font-medium">
                  <th className="py-2.5 px-3.5 whitespace-nowrap">Category</th>
                  <th className="py-2.5 px-3">Sub-Industry &amp; Cluster</th>
                  <th className="py-2.5 px-3">ETF / Leaders</th>
                  <th className="py-2.5 px-3">Main Macro Trigger (Plain English)</th>
                  <th className="py-2.5 px-3.5 text-right whitespace-nowrap">Conviction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredMatrix.map((pick, idx) => (
                  <tr
                    key={`${pick.id}-${idx}`}
                    onClick={() => handleRowClick(pick)}
                    className={`cursor-pointer transition-colors ${
                      highlightedId === pick.id ? 'bg-[#152033]' : 'hover:bg-[#131d2f]'
                    }`}
                  >
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <ToneText
                        tone={pick.category}
                        label={`${
                          pick.category === 'bullish'
                            ? 'Bullish'
                            : pick.category === 'bearish'
                              ? 'Bearish'
                              : 'Reversing'
                        } ${pick.index}`}
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap items-baseline gap-1.5">
                        {pick.category === 'reversing' && pick.reversalTag && (
                          <ReversalBadgeText
                            tag={
                              pick.reversalTag === 'Peaking'
                                ? 'Reversing Bearish: Peaking'
                                : 'Reversing Bullish: Troughing'
                            }
                          />
                        )}
                        <span className="font-semibold text-slate-100">{pick.subIndustry}</span>
                        <span className="font-mono text-slate-400">({pick.clusterCode})</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-300 leading-snug">
                      {pick.proxies}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 leading-snug">
                      {pick.macroTrigger}
                    </td>
                    <td className="py-2.5 px-3.5 font-mono font-semibold text-slate-100 text-right whitespace-nowrap">
                      {pick.conviction}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 6: 15 SUB-INDUSTRY QUICK CARDS */}
      <section id="section-capsules" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <h2 className="text-xl font-semibold tracking-tight text-slate-100">
            06. The 15 Sub-Industry Quick Cards
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Showing {filteredCapsules.length} of {section6.capsules.length} Quick Cards
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCapsules.map((cap, idx) => {
            const isHighlighted = highlightedId === cap.id;
            return (
              <div
                key={`${cap.id}-${idx}`}
                id={`capsule-${cap.id}`}
                className={`bg-[#0f172a] rounded-lg p-4 space-y-3 border transition-colors ${
                  isHighlighted ? 'border-sky-500' : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <ToneText
                        tone={cap.category}
                        label={`#${cap.number} · ${cap.clusterCode}`}
                      />
                      {cap.reversalTag && <ReversalBadgeText tag={cap.reversalTag} />}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-100">{cap.title}</h3>
                  </div>
                </div>

                <div className="space-y-2 text-xs leading-relaxed">
                  <p className="text-slate-300">
                    <span className="font-semibold text-slate-100">Why Money Is Moving: </span>
                    {cap.thesis}
                  </p>
                  <p className="text-slate-400">
                    <span className="font-semibold text-slate-200">2 Signals to Watch: </span>
                    <span className="font-mono text-[11px]">{cap.leadingIndicators}</span>
                  </p>
                  <p className="text-slate-300 pt-1.5 border-t border-slate-800">
                    <span className="font-semibold text-slate-100">Pair Offset &amp; Exit Tripwire: </span>
                    {cap.pairOffsetInvalidation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 7: 4 SYSTEMIC KILL-SWITCHES */}
      <section id="section-killswitches" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <h2 className="text-xl font-semibold tracking-tight text-slate-100">
              07. 4 Systemic Kill-Switches (What Breaks This Entire Playbook)
            </h2>
          </div>
          <span className="text-xs font-mono text-rose-400">
            Exact Numerical Tripwires
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {section7.killSwitches.map((ks, idx) => (
            <div
              key={`${ks.number}-${idx}`}
              className="bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                  <span aria-hidden="true">⚠️</span>
                  <span>
                    {ks.number}. {ks.category}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {ks.triggerCondition}
              </p>
              <div className="pt-2 border-t border-slate-800 text-xs text-rose-400 leading-relaxed">
                <span className="font-semibold">Action: </span>
                {ks.prescribedAction}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
