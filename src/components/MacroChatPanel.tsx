import React, { useRef, useState } from 'react';
import {
  Send,
  FileText,
  Sparkles,
  Loader2,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { DEFAULT_MACRO_PROMPT, INITIAL_REFERENCE_REPORT } from '../data/referenceBaseline';
import { ChatMessage, MacroReport } from '../types/macro';

interface MacroChatPanelProps {
  messages: ChatMessage[];
  reports: MacroReport[];
  activeReportId: string;
  isLoading: boolean;
  onSelectReport: (reportId: string) => void;
  onSubmitPrompt: (prompt: string, mode: 'auto' | 'force-scan' | 'follow-up') => Promise<void>;
  onDeleteReport: (reportId: string) => void;
}

export function MacroChatPanel({
  messages,
  reports,
  activeReportId,
  isLoading,
  onSelectReport,
  onSubmitPrompt,
  onDeleteReport,
}: MacroChatPanelProps) {
  const [input, setInput] = useState('');
  const [forceFullScan, setForceFullScan] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput('');
    await onSubmitPrompt(trimmed, forceFullScan ? 'force-scan' : 'auto');
  };

  const handleInsertTemplate = () => {
    setInput(DEFAULT_MACRO_PROMPT);
    setForceFullScan(true);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <aside className="flex flex-col h-full bg-[#0d1522] border-r border-slate-800">
      {/* Panel Header & Saved Reports Switcher */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-100">App Chat &amp; Prompt Runner</h2>
          <span className="text-[11px] font-mono text-slate-400">
            {reports.length} {reports.length === 1 ? 'report' : 'reports'}
          </span>
        </div>

        {/* Report History Selector */}
        <div className="space-y-1.5 max-h-36 overflow-y-auto">
          {reports.map((rep) => {
            const isActive = rep.id === activeReportId;
            return (
              <div
                key={rep.id}
                className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md border text-xs transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-slate-100 border-slate-600'
                    : 'bg-[#0b111b] text-slate-400 border-slate-800 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectReport(rep.id)}
                  className="flex-1 text-left min-w-0"
                >
                  <div className="font-medium truncate">{rep.section1.regimeName}</div>
                  <div
                    className={`text-[11px] font-mono truncate ${
                      isActive ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {rep.sourceLabel} · {new Date(rep.createdAt).toLocaleDateString()}
                  </div>
                </button>
                {reports.length > 1 && rep.id !== INITIAL_REFERENCE_REPORT.id && (
                  <button
                    type="button"
                    onClick={() => onDeleteReport(rep.id)}
                    aria-label="Delete report"
                    className={`p-1 rounded hover:bg-white/10 shrink-0 ${
                      isActive ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-rose-400'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0b111b]">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const previewText =
            msg.content.length > 240
              ? `${msg.content.slice(0, 240).trim()}... (${msg.content.length.toLocaleString()} chars)`
              : msg.content;
          return (
            <div
              key={msg.id}
              className={`rounded-lg p-3 text-xs leading-relaxed border ${
                isUser
                  ? 'bg-sky-950/50 text-slate-100 border-sky-800/60 ml-4'
                  : msg.isError
                    ? 'bg-rose-950/40 text-rose-300 border-rose-800/60 mr-2'
                    : 'bg-[#0f172a] text-slate-200 border-slate-800 mr-2'
              }`}
            >
              <div
                className={`flex items-center justify-between gap-2 text-[11px] font-mono mb-1 ${
                  isUser ? 'text-sky-300/80' : 'text-slate-500'
                }`}
              >
                <span>{isUser ? 'Prompt Input' : 'Strategist Desk'}</span>
                <span>{msg.timestamp}</span>
              </div>
              <div className="whitespace-pre-wrap break-words">{previewText}</div>
              {msg.reportId && msg.reportId !== activeReportId && (
                <button
                  type="button"
                  onClick={() => onSelectReport(msg.reportId!)}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-sky-400 hover:underline"
                >
                  <FileText className="w-3 h-3" />
                  <span>Display on Dashboard</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-3.5 mr-2 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-100">
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              <span>Running Live Web-Grounded Macro Analysis...</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Querying FRED, TradingEconomics, Reuters, Investing.com &amp; Lipper flows, then structuring all 7 dashboard sections.
            </p>
          </div>
        )}
      </div>

      {/* Composer */}
      <form onSubmit={handleSend} className="p-3.5 border-t border-slate-800 bg-[#0d1522] space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleInsertTemplate}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-200 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded transition-colors whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Insert Macro Prompt</span>
          </button>

          <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={forceFullScan}
              onChange={(e) => setForceFullScan(e.target.checked)}
              className="rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-0"
            />
            <span>Full 7-Section Scan</span>
          </label>
        </div>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={4}
          placeholder="Paste your Macro Prompt here, paste a completed 7-section report to visualize, or ask a follow-up question..."
          className="w-full text-xs bg-[#0b111b] border border-slate-700 rounded-md p-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 resize-y"
        />

        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-slate-500 font-mono">
            Ctrl/Cmd + Enter to run
          </span>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-950 bg-slate-100 rounded-md hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Run Prompt</span>
          </button>
        </div>

        {/* Grounding Notice */}
        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
          <span>Web Search Grounded · Plain-Text Sources</span>
          <span>No URLs / No Citations</span>
        </div>
      </form>
    </aside>
  );
}
