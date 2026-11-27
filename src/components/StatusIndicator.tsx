import React from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { Tone } from '../types/macro';

export function ToneText({
  tone,
  label,
}: {
  tone: Tone | 'strong-bullish' | 'strong-bearish';
  label: string;
}) {
  if (tone === 'bullish' || tone === 'strong-bullish') {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
        <span aria-hidden="true">🟢</span>
        <span>{label}</span>
      </span>
    );
  }
  if (tone === 'bearish' || tone === 'strong-bearish') {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium text-rose-400">
        <span aria-hidden="true">🔴</span>
        <span>{label}</span>
      </span>
    );
  }
  if (tone === 'reversing') {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium text-amber-400">
        <span aria-hidden="true">🔄</span>
        <span>{label}</span>
      </span>
    );
  }
  if (tone === 'warning') {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium text-amber-400">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>{label}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 font-medium text-slate-400">
      <span aria-hidden="true">⏸️</span>
      <span>{label}</span>
    </span>
  );
}

export function MomentumLabel({
  direction,
  label,
}: {
  direction: 'improving' | 'stable' | 'deteriorating';
  label: string;
}) {
  if (direction === 'improving') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
        <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
        <span>{label}</span>
      </span>
    );
  }
  if (direction === 'deteriorating') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400">
        <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
        <span>{label}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
      <Minus className="w-3.5 h-3.5 shrink-0" />
      <span>{label}</span>
    </span>
  );
}

export function ReversalBadgeText({ tag }: { tag: string }) {
  const isPeaking = tag.toLowerCase().includes('peaking');
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-mono font-medium ${
        isPeaking ? 'text-rose-400' : 'text-emerald-400'
      }`}
    >
      <RefreshCw className="w-3 h-3 shrink-0" />
      <span>[{tag}]</span>
    </span>
  );
}
