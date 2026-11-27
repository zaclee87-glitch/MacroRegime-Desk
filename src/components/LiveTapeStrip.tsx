import React from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import { LiveMarketTape } from '../types/macro';

interface LiveTapeStripProps {
  tape: LiveMarketTape | null;
  isLoading: boolean;
  onRefresh: () => void;
}

function fmtSigned(val: number | null, suffix = '%'): string {
  if (val === null || !Number.isFinite(val)) return '—';
  return `${val > 0 ? '+' : ''}${val.toFixed(2)}${suffix}`;
}

export function LiveTapeStrip({ tape, isLoading, onRefresh }: LiveTapeStripProps) {
  const vixTone =
    !tape || tape.vixRegime === 'unknown'
      ? 'text-slate-300'
      : tape.vixRegime === 'calm'
        ? 'text-emerald-400'
        : tape.vixRegime === 'normal'
          ? 'text-sky-400'
          : tape.vixRegime === 'elevated'
            ? 'text-amber-400'
            : 'text-rose-400';

  const breadthTone =
    !tape || tape.breadth1W === null
      ? 'text-slate-300'
      : tape.breadth1W >= 0.4
        ? 'text-emerald-400'
        : tape.breadth1W <= -0.4
          ? 'text-amber-400'
          : 'text-slate-200';

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-lg px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <div className="inline-flex items-center gap-1.5 text-slate-400 font-medium">
          <Activity className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>Live TradingView Tape</span>
        </div>

        {/* VIX Fear Gauge */}
        <div className="flex items-baseline gap-2 tabular-nums">
          <span className="text-slate-500">VIX</span>
          <span className={`font-mono font-semibold ${vixTone}`}>
            {tape?.vix.last !== null && tape?.vix.last !== undefined
              ? tape.vix.last.toFixed(2)
              : '—'}
          </span>
          {tape?.vix.perf1W !== null && tape?.vix.perf1W !== undefined && (
            <span className="font-mono text-[11px] text-slate-400">
              (1W {fmtSigned(tape.vix.perf1W)})
            </span>
          )}
          {tape?.vixLabel && tape.vixRegime !== 'unknown' && (
            <span className={`text-[11px] font-medium ${vixTone}`}>
              · {tape.vixLabel}
            </span>
          )}
        </div>

        {/* US10Y */}
        <div className="flex items-baseline gap-1.5 tabular-nums">
          <span className="text-slate-500">US10Y</span>
          <span className="font-mono font-semibold text-slate-100">
            {tape?.us10y.last !== null && tape?.us10y.last !== undefined
              ? `${tape.us10y.last.toFixed(2)}%`
              : '—'}
          </span>
          {tape?.us10y.perf1W !== null && tape?.us10y.perf1W !== undefined && (
            <span className="font-mono text-[11px] text-slate-400">
              (1W {fmtSigned(tape.us10y.perf1W)})
            </span>
          )}
        </div>

        {/* DXY */}
        <div className="flex items-baseline gap-1.5 tabular-nums">
          <span className="text-slate-500">DXY</span>
          <span className="font-mono font-semibold text-slate-100">
            {tape?.dxy.last !== null && tape?.dxy.last !== undefined
              ? tape.dxy.last.toFixed(2)
              : '—'}
          </span>
          {tape?.dxy.perf1W !== null && tape?.dxy.perf1W !== undefined && (
            <span className="font-mono text-[11px] text-slate-400">
              (1W {fmtSigned(tape.dxy.perf1W)})
            </span>
          )}
        </div>

        {/* SPY */}
        <div className="flex items-baseline gap-1.5 tabular-nums">
          <span className="text-slate-500">SPY</span>
          <span className="font-mono font-semibold text-slate-100">
            {tape?.spy.last !== null && tape?.spy.last !== undefined
              ? tape.spy.last.toFixed(2)
              : '—'}
          </span>
          {tape?.spy.perf1W !== null && tape?.spy.perf1W !== undefined && (
            <span
              className={`font-mono text-[11px] ${
                tape.spy.perf1W >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              (1W {fmtSigned(tape.spy.perf1W)})
            </span>
          )}
        </div>

        {/* Breadth: RSP vs SPY */}
        <div className="flex items-baseline gap-1.5 tabular-nums">
          <span className="text-slate-500">Breadth (RSP−SPY)</span>
          <span className={`font-mono font-semibold ${breadthTone}`}>
            {tape ? fmtSigned(tape.breadth1W, 'pp') : '—'}
          </span>
          {tape?.breadthLabel && tape.breadth1W !== null && (
            <span className="text-[11px] text-slate-400">
              · {tape.breadthLabel}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={isLoading}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-300 bg-[#0b111b] border border-slate-700 rounded hover:bg-slate-800 hover:text-white disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
      >
        <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
        <span>{isLoading ? 'Updating...' : 'Live Tape'}</span>
      </button>
    </div>
  );
}
