import React, { useMemo, useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import { MacroReport } from '../types/macro';
import { buildFullMarkdownReport } from '../utils/markdownReport';

interface MarkdownReportViewProps {
  report: MacroReport;
}

export function MarkdownReportView({ report }: MarkdownReportViewProps) {
  const [copied, setCopied] = useState(false);

  const markdown = useMemo(() => buildFullMarkdownReport(report), [report]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback ignored if blocked in iframe
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `macro-regime-report-${report.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0f172a] border border-slate-800 rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Complete 7-Section Markdown Output
            </h2>
            <p className="text-xs text-slate-400">
              {report.section1.verificationTimestamp}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-950 bg-slate-100 rounded-md hover:bg-white transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .md</span>
            </button>
          </div>
        </div>

        <pre className="p-5 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto bg-[#0b111b]">
          {markdown}
        </pre>
      </div>

      {report.sources.length > 0 && (
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-2.5">
          <h3 className="text-sm font-semibold text-slate-100">
            Sources Checked (Plain-Text Reference · {report.sources.length})
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {report.sources.map((src) => src.title).join(' · ')}
          </p>
        </div>
      )}
    </div>
  );
}
