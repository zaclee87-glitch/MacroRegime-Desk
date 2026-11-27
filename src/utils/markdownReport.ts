import { MacroReport } from '../types/macro';

function statusEmoji(status: string): string {
  if (status === 'bullish' || status === 'strong-bullish') return '🟢';
  if (status === 'bearish' || status === 'strong-bearish') return '🔴';
  if (status === 'reversing') return '🔄';
  return '⏸️';
}

function momentumEmoji(dir: string): string {
  if (dir === 'improving') return '📈';
  if (dir === 'deteriorating') return '📉';
  return '⏸️';
}

export function cleanPlainOutput(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/gi, '$1')
    .replace(/\[\[?\d+(?:\s*,\s*\d+)*\]?\]/g, '')
    .replace(/https?:\/\/[^\s)>\]]+/gi, '')
    .replace(/\$\s*(\d)/g, 'USD $1')
    .replace(/\$/g, 'USD ')
    .replace(/</g, 'less than ')
    .replace(/(?<!-)>/g, 'greater than ')
    .trim();
}

export function buildFullMarkdownReport(report: MacroReport): string {
  if (
    report.rawMarkdown &&
    report.rawMarkdown.includes('## 7.') &&
    report.rawMarkdown.includes('## 5.')
  ) {
    return cleanPlainOutput(report.rawMarkdown);
  }

  const s1 = report.section1;
  const s2 = report.section2;
  const s3 = report.section3;
  const s4 = report.section4;
  const s5 = report.section5;
  const s6 = report.section6;
  const s7 = report.section7;

  const lines: string[] = [];

  if (s1.weekInBrief) {
    lines.push('### The week in brief');
    lines.push(s1.weekInBrief);
    lines.push('');
  }

  if (Array.isArray(s1.bigMoves) && s1.bigMoves.length > 0) {
    lines.push('### Big moves');
    for (const bm of s1.bigMoves) {
      const volSuffix = bm.volatilityTag ? ` — *${bm.volatilityTag}*` : '';
      const srcSuffix = bm.sourceDate ? ` (${bm.sourceDate})` : '';
      lines.push(
        `* **${bm.asset}** (${bm.moveLabel}, ${bm.dateLabel}): ${bm.detail}${volSuffix}${srcSuffix}`
      );
    }
    lines.push('');
  }

  if (s1.weekInBrief || (Array.isArray(s1.bigMoves) && s1.bigMoves.length > 0)) {
    lines.push('---');
    lines.push('');
  }

  lines.push('## 1. Live Macro, Fear & Market Breadth Baseline');
  lines.push('');
  lines.push(`**Verification Timestamp:** ${s1.verificationTimestamp}`);
  lines.push('');
  lines.push('### Data Table');
  lines.push('| Asset / Metric | Ticker / Series | Latest Close / Yield | 1-Week Change | 1-Month Change | Plain-English Signal |');
  lines.push('|:---|:---|:---|:---|:---|:---|');
  for (const m of s1.baselineMetrics) {
    lines.push(`| **${m.asset}** | ${m.ticker} | ${m.latestClose} | ${m.change1W} | ${m.change1M} | ${m.signal} |`);
  }
  lines.push('');
  if (s1.creditSpreadGate) {
    const verdictIcon =
      s1.creditSpreadGate.verdict === 'go'
        ? '🟢'
        : s1.creditSpreadGate.verdict === 'caution'
          ? '⏸️'
          : '🔴';
    lines.push('### SPX Credit-Spread Gate (3-Check Go / Wait Filter for Selling Bull Put Spreads)');
    s1.creditSpreadGate.checks.forEach((chk, idx) => {
      lines.push(`${idx + 1}. **${chk.name}:** **${chk.status.toUpperCase()}** — ${chk.detail}`);
    });
    lines.push(
      `* **Gate Verdict:** ${verdictIcon} **${s1.creditSpreadGate.verdictLabel}** — ${s1.creditSpreadGate.summary}`
    );
    lines.push('');
  }
  lines.push('### 7-Day News & Upcoming Calendar');
  for (const c of s1.catalysts) {
    lines.push(`* **${c.title} (${c.sourceDate}):** ${c.detail}`);
  }
  lines.push(`* **Upcoming Calendar (Next 2–4 Weeks):** ${s1.upcomingCalendar}`);
  lines.push('');
  lines.push('### Market Regime in Plain English');
  lines.push(`**Regime:** **${s1.regimeName}**`);
  lines.push(`* **Cause-and-Effect Chain:** \`${s1.causalChain.join(' -> ')}\``);
  lines.push('');
  lines.push('### 3 Active Fracture Points');
  s1.stressPoints.forEach((sp, idx) => {
    lines.push(`${idx + 1}. **${sp.title}:** ${sp.detail}`);
  });
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 2. Commodity Complex Outlook (Oil, Gold, Copper & Key Cross-Commodities)');
  lines.push('');
  lines.push('| Commodity & Ticker | Last Price (1W / 1M %) | Chart Posture (vs 50/200 DMA & RSI) | 2–3M View & Conviction | Main Driver (Plain English) |');
  lines.push('|:---|:---|:---|:---|:---|');
  for (const cm of s2.commodities) {
    lines.push(
      `| **${cm.name} (\`${cm.ticker}\`)** | ${cm.lastPrice} (${cm.change1W} / ${cm.change1M}) | ${cm.technicalPosture} | ${statusEmoji(cm.viewBias)} **${cm.viewLabel} (${cm.conviction})** | ${cm.driver} |`
    );
  }
  lines.push('');
  lines.push('### Short Rationales & Stock Impact');
  for (const r of s2.rationales) {
    lines.push(`* **${r.title}:** ${r.body} *Stock Impact:* ${r.equityTransmission}`);
  }
  lines.push(`* **Copper/Gold Ratio Signal:** ${s2.copperGoldSignal}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 3. 8-Cluster Scoreboard, Trends & Watchlist Focus');
  lines.push('');
  lines.push('| Rank & Cluster | Primary ETF | Score (-8 to +8) & Bias | Momentum & Lifecycle Stage | 2–3M Trading Stance |');
  lines.push('|:---|:---|:---|:---|:---|');
  for (const cl of s3.clusters) {
    const scoreStr = cl.score > 0 ? `+${cl.score}` : `${cl.score}`;
    const cleanName = cl.name.replace(new RegExp(`^${cl.id}\\s*:\\s*`, 'i'), '');
    lines.push(
      `| **${cl.rank}. ${cl.id}: ${cleanName}** | \`${cl.primaryEtf}\` | **${scoreStr}** (${statusEmoji(cl.bias)} ${cl.biasLabel}) | ${momentumEmoji(cl.momentumDirection)} ${cl.momentumLabel} / \`${cl.lifecycleStage}\` | ${cl.tradingView} |`
    );
  }
  lines.push('');
  for (const cl of s3.clusters) {
    const scoreStr = cl.score > 0 ? `+${cl.score}` : `${cl.score}`;
    const fb = cl.factorBreakdown;
    const cleanName = cl.name.replace(new RegExp(`^${cl.id}\\s*:\\s*`, 'i'), '');
    lines.push(`#### ${cl.rank}. ${cl.id}: ${cleanName} (\`${cl.primaryEtf}\`) — Score: ${scoreStr} (${statusEmoji(cl.bias)} ${cl.biasLabel})`);
    lines.push(`* **Scores:** \`A: ${fb.a > 0 ? `+${fb.a}` : fb.a} | B: ${fb.b > 0 ? `+${fb.b}` : fb.b} | C: ${fb.c > 0 ? `+${fb.c}` : fb.c} | D: ${fb.d > 0 ? `+${fb.d}` : fb.d}\``);
    lines.push(`* **Chart Snapshot:** ${cl.technicalContext}`);
    lines.push(`* **Latest Catalyst (Past 7 Days):** ${cl.verifiedCatalyst}`);
    lines.push(
      `* **Sub-Groups:** ${cl.subClusters
        .map((sc) => `${statusEmoji(sc.status)} ${sc.name} (${sc.note})`)
        .join(', ')}`
    );
    lines.push(
      `* **Trading Focus & Watchlist Names:** ${cl.tradingView}. ${cl.clusterRationale} Favor: ${cl.favoredTickers.join(', ')}; Avoid: ${cl.avoidTickers.join(', ')}.`
    );
    lines.push('');
  }
  lines.push('### Quick Ticker-Picking Summary Table');
  lines.push('| Cluster | 2–3M Stance & Conviction | Plain-English Reason (1-Line) | Watchlist Names to Favor | Watchlist Names to Avoid / Short |');
  lines.push('|:---|:---|:---|:---|:---|');
  for (const cl of s3.clusters) {
    lines.push(
      `| **${cl.id} (\`${cl.primaryEtf}\`)** | ${statusEmoji(cl.bias)} ${cl.stanceSummary} (${cl.conviction}) | ${cl.clusterRationale} | ${cl.favoredTickers.join(', ')} | ${cl.avoidTickers.join(', ')} |`
    );
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 4. Smart Pairs, Portfolio Posture & Rate Sensitivity');
  lines.push('');
  lines.push('### 2–3 Month Portfolio Mix');
  lines.push(`* **Stock Exposure:** ${s4.portfolioPosture.netEquityTilt}`);
  lines.push(`* **Style Tilt:** ${s4.portfolioPosture.factorTilt}`);
  lines.push(`* **Commodity Tilt:** ${s4.portfolioPosture.commodityTilt}`);
  lines.push(`* **Cash & Hedge Level:** ${s4.portfolioPosture.hedgeCashPosture}`);
  lines.push('');
  lines.push('### Top 3 Long/Short Pairs');
  s4.topPairs.forEach((p, idx) => {
    lines.push(`${idx + 1}. **${p.title}** — *Score Gap: ${p.scoreSpread} | ETF Ratio: \`${p.ratioProxy}\`*`);
    lines.push(`   * **Thesis:** ${p.causalThesis}`);
    lines.push(`   * **What Proves It Wrong:** ${p.invalidation}`);
  });
  lines.push('');
  lines.push('### Top 2 Portfolio Hedges');
  s4.macroHedges.forEach((h, idx) => {
    lines.push(`${idx + 1}. **${h.title}:** ${h.detail}`);
  });
  lines.push('');
  lines.push('### Real Yield (`DFII10`) Impact Table');
  lines.push('| Cluster | Proxy | Impact When Real Yields Rise | 1-Line Plain-English Reason |');
  lines.push('|:---|:---|:---|:---|');
  for (const row of s4.realYieldSensitivity) {
    lines.push(`| **${row.cluster}** | \`${row.proxy}\` | **${row.sensitivityLabel}** | ${row.channel} |`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 5. The 5-5-5 Macro Rotation Master Matrix');
  lines.push('');
  lines.push('| Category | Sub-Industry & Cluster | ETF / Leaders | Main Macro Trigger (Plain English) | Conviction (H/M/L) |');
  lines.push('|:---|:---|:---|:---|:---|');
  for (const m of s5.matrixPicks) {
    const catLabel =
      m.category === 'bullish'
        ? `🟢 **Bullish ${m.index}**`
        : m.category === 'bearish'
          ? `🔴 **Bearish ${m.index}**`
          : `🔄 **Reversing ${m.index}**`;
    const revPrefix =
      m.category === 'reversing' && m.reversalTag
        ? `\`[Reversing ${m.reversalTag === 'Peaking' ? 'Bearish: Peaking' : 'Bullish: Troughing'}]\` `
        : '';
    lines.push(
      `| ${catLabel} | ${revPrefix}${m.subIndustry} (\`${m.clusterCode}\`) | ${m.proxies} | ${m.macroTrigger} | **${m.conviction}** |`
    );
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 6. The 15 Sub-Industry Quick Cards');
  lines.push('');
  for (const cap of s6.capsules) {
    const prefix = cap.reversalTag ? `\`[${cap.reversalTag}]\` ` : '';
    lines.push(`${cap.number}. ${prefix}**${cap.title} (\`${cap.clusterCode}\`):**`);
    lines.push(`   * *Why Money Is Moving:* ${cap.thesis}`);
    lines.push(`   * *2 Signals to Watch:* ${cap.leadingIndicators}`);
    lines.push(`   * *Pair Offset & Exit Tripwire:* ${cap.pairOffsetInvalidation}`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 7. 4 Systemic Kill-Switches (What Breaks This Entire Playbook)');
  lines.push('');
  for (const ks of s7.killSwitches) {
    lines.push(`${ks.number}. ⚠️ **${ks.category}:** ${ks.triggerCondition} *Action:* ${ks.prescribedAction}`);
  }

  return cleanPlainOutput(lines.join('\n'));
}

export function summarizeReportForChat(report: MacroReport): string {
  const clusterSummary = report.section3.clusters
    .map((c) => `${c.id} (${c.primaryEtf}): ${c.score > 0 ? `+${c.score}` : c.score} [${c.stanceSummary}]`)
    .join('; ');
  return [
    `Timestamp: ${report.section1.verificationTimestamp}`,
    report.section1.weekInBrief ? `Week in Brief: ${report.section1.weekInBrief}` : '',
    `Regime: ${report.section1.regimeName}`,
    `Clusters: ${clusterSummary}`,
    `Stock Exposure: ${report.section4.portfolioPosture.netEquityTilt}`,
  ]
    .filter(Boolean)
    .join('\n');
}
