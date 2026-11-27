import express from "express";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";


function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in server environment.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const MACRO_REPORT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    section1: {
      type: Type.OBJECT,
      properties: {
        weekInBrief: { type: Type.STRING, nullable: true },
        bigMoves: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              asset: { type: Type.STRING },
              direction: { type: Type.STRING },
              moveLabel: { type: Type.STRING },
              dateLabel: { type: Type.STRING },
              volatilityTag: { type: Type.STRING },
              detail: { type: Type.STRING },
              sourceDate: { type: Type.STRING },
            },
            required: ["asset", "direction", "moveLabel", "dateLabel", "volatilityTag", "detail", "sourceDate"],
          },
        },
        verificationTimestamp: { type: Type.STRING },
        baselineMetrics: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              asset: { type: Type.STRING },
              ticker: { type: Type.STRING },
              category: { type: Type.STRING },
              latestClose: { type: Type.STRING },
              change1W: { type: Type.STRING },
              change1M: { type: Type.STRING },
              signal: { type: Type.STRING },
              tone: { type: Type.STRING },
            },
            required: ["asset", "ticker", "category", "latestClose", "change1W", "change1M", "signal", "tone"],
          },
        },
        catalysts: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              detail: { type: Type.STRING },
              sourceDate: { type: Type.STRING },
            },
            required: ["title", "detail", "sourceDate"],
          },
        },
        upcomingCalendar: { type: Type.STRING },
        regimeName: { type: Type.STRING },
        causalChain: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        stressPoints: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              detail: { type: Type.STRING },
            },
            required: ["title", "detail"],
          },
        },
        creditSpreadGate: {
          type: Type.OBJECT,
          nullable: true,
          properties: {
            verdict: { type: Type.STRING },
            verdictLabel: { type: Type.STRING },
            summary: { type: Type.STRING },
            checks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  status: { type: Type.STRING },
                  detail: { type: Type.STRING },
                },
                required: ["name", "status", "detail"],
              },
            },
          },
          required: ["verdict", "verdictLabel", "summary", "checks"],
        },
      },
      required: [
        "verificationTimestamp",
        "baselineMetrics",
        "catalysts",
        "upcomingCalendar",
        "regimeName",
        "causalChain",
        "stressPoints",
      ],
    },
    section2: {
      type: Type.OBJECT,
      properties: {
        commodities: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              ticker: { type: Type.STRING },
              lastPrice: { type: Type.STRING },
              change1W: { type: Type.STRING },
              change1M: { type: Type.STRING },
              technicalPosture: { type: Type.STRING },
              rsiValue: { type: Type.NUMBER, nullable: true },
              viewBias: { type: Type.STRING },
              viewLabel: { type: Type.STRING },
              conviction: { type: Type.STRING },
              driver: { type: Type.STRING },
            },
            required: [
              "name",
              "ticker",
              "lastPrice",
              "change1W",
              "change1M",
              "technicalPosture",
              "viewBias",
              "viewLabel",
              "conviction",
              "driver",
            ],
          },
        },
        rationales: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              bias: { type: Type.STRING },
              body: { type: Type.STRING },
              equityTransmission: { type: Type.STRING },
            },
            required: ["title", "bias", "body", "equityTransmission"],
          },
        },
        copperGoldSignal: { type: Type.STRING },
      },
      required: ["commodities", "rationales", "copperGoldSignal"],
    },
    section3: {
      type: Type.OBJECT,
      properties: {
        clusters: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              rank: { type: Type.INTEGER },
              name: { type: Type.STRING },
              primaryEtf: { type: Type.STRING },
              score: { type: Type.INTEGER },
              bias: { type: Type.STRING },
              biasLabel: { type: Type.STRING },
              momentumDirection: { type: Type.STRING },
              momentumLabel: { type: Type.STRING },
              lifecycleStage: { type: Type.STRING },
              tradingView: { type: Type.STRING },
              factorBreakdown: {
                type: Type.OBJECT,
                properties: {
                  a: { type: Type.INTEGER },
                  b: { type: Type.INTEGER },
                  c: { type: Type.INTEGER },
                  d: { type: Type.INTEGER },
                },
                required: ["a", "b", "c", "d"],
              },
              technicalContext: { type: Type.STRING },
              rsiValue: { type: Type.NUMBER, nullable: true },
              rating1D: { type: Type.STRING },
              verifiedCatalyst: { type: Type.STRING },
              subClusters: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    status: { type: Type.STRING },
                    note: { type: Type.STRING },
                  },
                  required: ["name", "status", "note"],
                },
              },
              clusterRationale: { type: Type.STRING },
              favoredTickers: { type: Type.ARRAY, items: { type: Type.STRING } },
              avoidTickers: { type: Type.ARRAY, items: { type: Type.STRING } },
              stanceSummary: { type: Type.STRING },
              conviction: { type: Type.STRING },
            },
            required: [
              "id",
              "rank",
              "name",
              "primaryEtf",
              "score",
              "bias",
              "biasLabel",
              "momentumDirection",
              "momentumLabel",
              "lifecycleStage",
              "tradingView",
              "factorBreakdown",
              "technicalContext",
              "rating1D",
              "verifiedCatalyst",
              "subClusters",
              "clusterRationale",
              "favoredTickers",
              "avoidTickers",
              "stanceSummary",
              "conviction",
            ],
          },
        },
      },
      required: ["clusters"],
    },
    section4: {
      type: Type.OBJECT,
      properties: {
        portfolioPosture: {
          type: Type.OBJECT,
          properties: {
            netEquityTilt: { type: Type.STRING },
            factorTilt: { type: Type.STRING },
            commodityTilt: { type: Type.STRING },
            hedgeCashPosture: { type: Type.STRING },
          },
          required: ["netEquityTilt", "factorTilt", "commodityTilt", "hedgeCashPosture"],
        },
        topPairs: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              longLeg: { type: Type.STRING },
              shortLeg: { type: Type.STRING },
              scoreSpread: { type: Type.STRING },
              ratioProxy: { type: Type.STRING },
              causalThesis: { type: Type.STRING },
              invalidation: { type: Type.STRING },
            },
            required: ["title", "longLeg", "shortLeg", "scoreSpread", "ratioProxy", "causalThesis", "invalidation"],
          },
        },
        macroHedges: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              detail: { type: Type.STRING },
            },
            required: ["title", "detail"],
          },
        },
        realYieldSensitivity: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              cluster: { type: Type.STRING },
              proxy: { type: Type.STRING },
              sensitivityTier: { type: Type.STRING },
              sensitivityLabel: { type: Type.STRING },
              channel: { type: Type.STRING },
            },
            required: ["cluster", "proxy", "sensitivityTier", "sensitivityLabel", "channel"],
          },
        },
      },
      required: ["portfolioPosture", "topPairs", "macroHedges", "realYieldSensitivity"],
    },
    section5: {
      type: Type.OBJECT,
      properties: {
        matrixPicks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              category: { type: Type.STRING },
              index: { type: Type.INTEGER },
              reversalTag: { type: Type.STRING, nullable: true },
              subIndustry: { type: Type.STRING },
              clusterCode: { type: Type.STRING },
              proxies: { type: Type.STRING },
              macroTrigger: { type: Type.STRING },
              conviction: { type: Type.STRING },
            },
            required: ["id", "category", "index", "subIndustry", "clusterCode", "proxies", "macroTrigger", "conviction"],
          },
        },
      },
      required: ["matrixPicks"],
    },
    section6: {
      type: Type.OBJECT,
      properties: {
        capsules: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              category: { type: Type.STRING },
              number: { type: Type.INTEGER },
              title: { type: Type.STRING },
              clusterCode: { type: Type.STRING },
              reversalTag: { type: Type.STRING, nullable: true },
              thesis: { type: Type.STRING },
              leadingIndicators: { type: Type.STRING },
              pairOffsetInvalidation: { type: Type.STRING },
            },
            required: ["id", "category", "number", "title", "clusterCode", "thesis", "leadingIndicators", "pairOffsetInvalidation"],
          },
        },
      },
      required: ["capsules"],
    },
    section7: {
      type: Type.OBJECT,
      properties: {
        killSwitches: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              number: { type: Type.INTEGER },
              category: { type: Type.STRING },
              triggerCondition: { type: Type.STRING },
              prescribedAction: { type: Type.STRING },
            },
            required: ["number", "category", "triggerCondition", "prescribedAction"],
          },
        },
      },
      required: ["killSwitches"],
    },
  },
  required: ["section1", "section2", "section3", "section4", "section5", "section6", "section7"],
};

function isPreGeneratedReport(text: string): boolean {
  const sectionMatches = [
    /#{2,3}\s*1\.\s*(?:Verified Macro|Live Macro)/i,
    /#{2,3}\s*2\.\s*Commodity Complex/i,
    /#{2,3}\s*3\.\s*8-Cluster/i,
    /#{2,3}\s*4\.\s*(?:Cross-Cluster|Smart Pairs)/i,
    /#{2,3}\s*5\.\s*The 5-5-5/i,
    /#{2,3}\s*6\.\s*The 15 Sub-Industry/i,
    /#{2,3}\s*7\.\s*(?:Systemic Invalidation|4 Systemic Kill-Switches)/i,
  ].filter((re) => re.test(text)).length;
  return sectionMatches >= 3;
}

function isFullScanPrompt(text: string): boolean {
  const lower = text.toLowerCase();
  const signals = [
    "5-5-5",
    "8-cluster",
    "8 broad stock clusters",
    "global macro",
    "rotation scanner",
    "data & catalyst checklist",
    "required output structure",
    "15 sub-industry quick cards",
    "4 systemic kill-switches",
    "systemic invalidation triggers",
  ];
  const hitCount = signals.filter((s) => lower.includes(s)).length;
  return hitCount >= 2 || text.trim().length > 450;
}

function sanitizeMacroOutput(raw: string): string {
  return raw
    // Convert markdown links [label](url) -> label
    .replace(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/gi, "$1")
    // Strip bracketed citation markers like [1], [1, 2], [[9]], [Source 1] while keeping [Reversing ...]
    .replace(/\[\[?\d+(?:\s*,\s*\d+)*\]?\]/g, "")
    // Strip bare URLs
    .replace(/https?:\/\/[^\s)>\]]+/gi, "")
    // Replace bare $ signs with USD
    .replace(/\$\s*(\d)/g, "USD $1")
    .replace(/\$/g, "USD ")
    // Replace bare angle brackets (multi-char operators first)
    .replace(/>=/g, "greater than or equal to ")
    .replace(/<=/g, "less than or equal to ")
    .replace(/</g, "less than ")
    // Avoid breaking -> arrows when replacing >
    .replace(/(?<!-)>/g, "greater than ")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function normalizeClusterId(cluster: { id?: unknown; name?: unknown }): string {
  const rawId = String(cluster.id ?? "").trim().toUpperCase();
  const nameMatch = String(cluster.name ?? "").match(/\b(C[1-8])\b/i);
  if (nameMatch) {
    const codeFromName = nameMatch[1].toUpperCase();
    if (!/^C[1-8]$/.test(rawId) || rawId !== codeFromName) {
      return codeFromName;
    }
  }
  const idMatch = rawId.match(/C[1-8]/);
  return idMatch ? idMatch[0] : rawId;
}

function dedupeByKey<T>(items: T[], getKey: (item: T, idx: number) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  items.forEach((item, idx) => {
    const k = getKey(item, idx);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(item);
    }
  });
  return out;
}

function isValidSpxGate(gate: unknown): boolean {
  if (!gate || typeof gate !== "object") return false;
  const g = gate as { checks?: Array<{ name?: unknown; detail?: unknown }> };
  if (!Array.isArray(g.checks) || g.checks.length === 0) return false;
  const text = g.checks
    .map((c) => `${String(c?.name ?? "")} ${String(c?.detail ?? "")}`)
    .join(" ")
    .toLowerCase();
  return /\b(vix|vix3m|vvix|spx|200\s*dma|20\s*dma|term\s*structure)\b/.test(text);
}

function normalizeStructuredReport(parsed: Record<string, unknown>): Record<string, unknown> {
  const s1 = (parsed.section1 ?? {}) as {
    baselineMetrics?: Array<Record<string, unknown>>;
    creditSpreadGate?: unknown;
  };
  if (Array.isArray(s1.baselineMetrics)) {
    s1.baselineMetrics = dedupeByKey(
      s1.baselineMetrics,
      (m, idx) => String(m.ticker ?? m.asset ?? idx).trim().toUpperCase() || `metric-${idx}`
    );
  }
  if (s1.creditSpreadGate && !isValidSpxGate(s1.creditSpreadGate)) {
    s1.creditSpreadGate = null;
  }

  const s2 = (parsed.section2 ?? {}) as { commodities?: Array<Record<string, unknown>> };
  if (Array.isArray(s2.commodities)) {
    s2.commodities = dedupeByKey(
      s2.commodities,
      (c, idx) => String(c.ticker ?? c.name ?? idx).trim().toUpperCase() || `comm-${idx}`
    );
  }

  const s3 = (parsed.section3 ?? {}) as { clusters?: Array<Record<string, unknown>> };
  if (Array.isArray(s3.clusters)) {
    const normalized = s3.clusters.map((c, idx) => {
      const id = normalizeClusterId(c) || `C${idx + 1}`;
      return { ...c, id };
    });
    s3.clusters = dedupeByKey(normalized, (c) => String(c.id));
  }

  const s4 = (parsed.section4 ?? {}) as { realYieldSensitivity?: Array<Record<string, unknown>> };
  if (Array.isArray(s4.realYieldSensitivity)) {
    s4.realYieldSensitivity = dedupeByKey(
      s4.realYieldSensitivity,
      (r, idx) => `${String(r.cluster ?? "").trim()}-${String(r.proxy ?? idx).trim().toUpperCase()}`
    );
  }

  const s5 = (parsed.section5 ?? {}) as { matrixPicks?: Array<Record<string, unknown>> };
  if (Array.isArray(s5.matrixPicks)) {
    s5.matrixPicks = dedupeByKey(
      s5.matrixPicks,
      (p, idx) => String(p.id ?? `pick-${idx}`).trim().toLowerCase()
    );
  }

  const s6 = (parsed.section6 ?? {}) as { capsules?: Array<Record<string, unknown>> };
  if (Array.isArray(s6.capsules)) {
    s6.capsules = dedupeByKey(
      s6.capsules,
      (c, idx) => String(c.id ?? `cap-${idx}`).trim().toLowerCase()
    );
  }

  const s7 = (parsed.section7 ?? {}) as { killSwitches?: Array<Record<string, unknown>> };
  if (Array.isArray(s7.killSwitches)) {
    s7.killSwitches = dedupeByKey(
      s7.killSwitches,
      (ks, idx) => String(ks.number ?? idx + 1)
    );
  }

  return parsed;
}

function countMissingReportParts(parsed: Record<string, unknown>, sourceMarkdown = ""): string[] {
  const missing: string[] = [];
  const s1 = (parsed.section1 ?? {}) as {
    weekInBrief?: string;
    bigMoves?: unknown[];
    baselineMetrics?: unknown[];
  };
  const s2 = (parsed.section2 ?? {}) as { commodities?: unknown[]; rationales?: unknown[] };
  const s3 = (parsed.section3 ?? {}) as { clusters?: Array<{ id?: unknown; name?: unknown }> };
  const s4 = (parsed.section4 ?? {}) as { topPairs?: unknown[]; realYieldSensitivity?: unknown[] };
  const s5 = (parsed.section5 ?? {}) as { matrixPicks?: Array<{ id?: unknown }> };
  const s6 = (parsed.section6 ?? {}) as { capsules?: Array<{ id?: unknown }> };
  const s7 = (parsed.section7 ?? {}) as { killSwitches?: unknown[] };

  if (/the week in brief/i.test(sourceMarkdown) && (!s1.weekInBrief || !String(s1.weekInBrief).trim())) {
    missing.push("section1.weekInBrief (present in source report under 'The week in brief')");
  }
  if (/big moves/i.test(sourceMarkdown) && (!Array.isArray(s1.bigMoves) || s1.bigMoves.length === 0)) {
    missing.push("section1.bigMoves (present in source report under 'Big moves', extract every bullet)");
  }
  if (!Array.isArray(s1.baselineMetrics) || s1.baselineMetrics.length < 8) {
    missing.push(`baselineMetrics (got ${Array.isArray(s1.baselineMetrics) ? s1.baselineMetrics.length : 0}, need all table rows)`);
  }
  if (!Array.isArray(s2.commodities) || s2.commodities.length < 3) {
    missing.push(`commodities (got ${Array.isArray(s2.commodities) ? s2.commodities.length : 0}, need all rows in Section 2)`);
  }
  if (!Array.isArray(s2.rationales) || s2.rationales.length < 3) {
    missing.push(`rationales (got ${Array.isArray(s2.rationales) ? s2.rationales.length : 0}, need separate rationales for Oil, Gold, Copper/Cross)`);
  }
  const uniqueClusterIds = new Set(
    Array.isArray(s3.clusters) ? s3.clusters.map((c) => normalizeClusterId(c)).filter(Boolean) : []
  );
  if (!Array.isArray(s3.clusters) || s3.clusters.length < 8 || uniqueClusterIds.size < 8) {
    missing.push(
      `clusters (got ${uniqueClusterIds.size} unique of ${Array.isArray(s3.clusters) ? s3.clusters.length : 0}, MUST output all 8 distinct clusters C1..C8 with no duplicate IDs)`
    );
  }
  if (!Array.isArray(s4.topPairs) || s4.topPairs.length < 3) {
    missing.push(`topPairs (got ${Array.isArray(s4.topPairs) ? s4.topPairs.length : 0}, need 3)`);
  }
  if (!Array.isArray(s4.realYieldSensitivity) || s4.realYieldSensitivity.length < 8) {
    missing.push(`realYieldSensitivity (got ${Array.isArray(s4.realYieldSensitivity) ? s4.realYieldSensitivity.length : 0}, need 8)`);
  }
  const uniquePickIds = new Set(
    Array.isArray(s5.matrixPicks) ? s5.matrixPicks.map((p) => String(p.id ?? "").trim()).filter(Boolean) : []
  );
  if (!Array.isArray(s5.matrixPicks) || s5.matrixPicks.length < 15 || uniquePickIds.size < 15) {
    missing.push(`matrixPicks (got ${uniquePickIds.size} unique, MUST output all 15 distinct picks)`);
  }
  const uniqueCapsuleIds = new Set(
    Array.isArray(s6.capsules) ? s6.capsules.map((c) => String(c.id ?? "").trim()).filter(Boolean) : []
  );
  if (!Array.isArray(s6.capsules) || s6.capsules.length < 15 || uniqueCapsuleIds.size < 15) {
    missing.push(`capsules (got ${uniqueCapsuleIds.size} unique, MUST output all 15 distinct capsules)`);
  }
  if (!Array.isArray(s7.killSwitches) || s7.killSwitches.length < 4) {
    missing.push(`killSwitches (got ${Array.isArray(s7.killSwitches) ? s7.killSwitches.length : 0}, need 4)`);
  }
  return missing;
}

async function generateWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: string;
    systemInstruction?: string;
    tools?: Array<Record<string, unknown>>;
    thinkingLevel: ThinkingLevel;
    maxOutputTokens?: number;
    responseMimeType?: string;
    responseSchema?: unknown;
  },
  preferredModels: string[] = ["gemini-4-hydrogen", "gemini-3.1-flash-lite"]
) {
  let lastErr: unknown;
  const maxAttemptsPerModel = 3;

  for (let i = 0; i < preferredModels.length; i++) {
    const model = preferredModels[i];
    for (let attempt = 1; attempt <= maxAttemptsPerModel; attempt++) {
      try {
        const config: Record<string, unknown> = {
          thinkingConfig: { thinkingLevel: params.thinkingLevel },
        };
        if (params.systemInstruction) config.systemInstruction = params.systemInstruction;
        if (params.tools) config.tools = params.tools;
        if (params.maxOutputTokens) config.maxOutputTokens = params.maxOutputTokens;
        if (params.responseMimeType) config.responseMimeType = params.responseMimeType;
        if (params.responseSchema) config.responseSchema = params.responseSchema;

        return await ai.models.generateContent({
          model,
          contents: params.contents,
          config,
        });
      } catch (err) {
        lastErr = err;
        const msg = err instanceof Error ? err.message : String(err);
        const isTransient =
          msg.includes("503") ||
          msg.includes("UNAVAILABLE") ||
          msg.includes("high demand") ||
          msg.includes("429") ||
          msg.includes("RESOURCE_EXHAUSTED") ||
          msg.includes("ETIMEDOUT") ||
          msg.includes("ECONNRESET");

        if (!isTransient) {
          throw err;
        }

        if (attempt < maxAttemptsPerModel) {
          const delayMs = 900 * attempt + Math.floor(Math.random() * 350);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          continue;
        }

        if (i === preferredModels.length - 1) {
          throw err;
        }
      }
    }
  }
  throw lastErr;
}

async function structureMarkdownIntoReport(
  ai: GoogleGenAI,
  markdown: string
): Promise<Record<string, unknown>> {
  const extractionPrompt = `Convert the following 7-section Global Macro Regime Diagnosis markdown report into the exact structured JSON schema.

CRITICAL COMPLETENESS MANDATE (NEVER ABBREVIATE OR STOP EARLY):
- Output section1.weekInBrief (the 1-2 sentence opening summary under "The week in brief") if present in the report (null if absent).
- Output EVERY SINGLE BULLET under "Big moves" into section1.bigMoves (empty array if absent), including asset, direction ("up" | "down" | "volatile"), moveLabel (concise move like "+32.27% (to USD 166.08)" or "-10.60% -> +15.03% -> -7.26%"), dateLabel (e.g. "Mon, Nov 23"), volatilityTag (ATR multiple or historical context like "~6.3x usual 5.12% swing"), detail, and plain-text sourceDate.
- Output EVERY SINGLE ROW of baselineMetrics from Section 1.
- Output creditSpreadGate (verdict, verdictLabel, summary, and all 3 checks: VIX Term Structure, Fear Stability / VVIX, and SPX Trend Support 200/20 DMA) ONLY IF Section 1 explicitly includes the "SPX Credit-Spread Gate" section. Otherwise set creditSpreadGate to null (NEVER invent it from HY OAS or HYG vs LQD bond spreads).
- Output EVERY SINGLE COMMODITY row from Section 2 (Crude Oil, Gold, Copper, Natural Gas, Silver, etc.) and separate rationales for Oil, Gold, and Copper/Gas.
- Output ALL 8 UNIQUE CLUSTERS (rank 1 through 8 covering distinct C1 through C8, never duplicate an id) from Section 3. NEVER emit only 1 cluster!
- Output ALL 3 topPairs, ALL 2 macroHedges, and ALL 8 realYieldSensitivity rows from Section 4.
- Output ALL 15 matrixPicks (5 bullish b1..b5, 5 bearish s1..s5, 5 reversing r1..r5) from Section 5.
- Output ALL 15 capsules (numbered 1 through 15) from Section 6.
- Output ALL 4 killSwitches (numbered 1 through 4) from Section 7.
Keep all plain-English explanations and plain-text source attributions (no URLs, no bracketed citations like [1] or [[9]], no $, no < or >).

Rules for enum-like string fields:
- section1.bigMoves[].direction: one of "up", "down", "volatile" ("volatile" for multi-day whipsaws)
- baselineMetrics[].category: one of "rates", "volatility", "fx", "commodities"
- baselineMetrics[].tone: one of "bullish", "bearish", "reversing", "neutral", "warning"
- creditSpreadGate.verdict: one of "go", "caution", "wait" (null if no gate section exists in report)
- creditSpreadGate.checks[].status: one of "pass", "caution", "fail"
- commodities[].viewBias: one of "bullish", "bearish", "reversing", "neutral"
- rationales[].bias: one of "bullish", "bearish", "reversing", "neutral"
- clusters[].bias: one of "strong-bullish", "bullish", "neutral", "bearish", "strong-bearish"
- clusters[].momentumDirection: one of "improving", "stable", "deteriorating"
- clusters[].subClusters[].status: one of "bullish", "neutral", "bearish", "reversing"
- realYieldSensitivity[].sensitivityTier: one of "high-negative", "moderate-negative", "neutral", "positive", "bifurcated"
- matrixPicks[].category & capsules[].category: one of "bullish", "bearish", "reversing"
- matrixPicks[].reversalTag: "Troughing" or "Peaking" (or null if not reversing)
- clusters[].id: short cluster code only like "C1", "C5", "C8"
- clusters[].name: clean cluster name WITHOUT repeating the code prefix (e.g., "Healthcare & MedTech", not "C5: Healthcare & MedTech")
- matrixPicks[].id & capsules[].id: matching IDs like "b1".."b5", "s1".."s5", "r1".."r5"

SOURCE MARKDOWN REPORT:
${markdown}`;

  const firstResp = await generateWithFallback(ai, {
    contents: extractionPrompt,
    thinkingLevel: ThinkingLevel.LOW,
    maxOutputTokens: 32768,
    responseMimeType: "application/json",
    responseSchema: MACRO_REPORT_SCHEMA,
  });

  const firstParsed = JSON.parse((firstResp.text ?? "{}").trim()) as Record<string, unknown>;
  const missing = countMissingReportParts(firstParsed, markdown);
  if (missing.length === 0) {
    return normalizeStructuredReport(firstParsed);
  }

  console.info("Initial structured report extraction incomplete, retrying:", missing.length, "items");
  const retryPrompt = `${extractionPrompt}

PREVIOUS ATTEMPT WAS TRUNCATED OR INCOMPLETE. YOU MUST FIX THESE MISSING ITEMS AND OUTPUT THE COMPLETE REPORT:
- ${missing.join("\n- ")}`;

  const retryResp = await generateWithFallback(ai, {
    contents: retryPrompt,
    thinkingLevel: ThinkingLevel.MEDIUM,
    maxOutputTokens: 32768,
    responseMimeType: "application/json",
    responseSchema: MACRO_REPORT_SCHEMA,
  });

  const retryParsed = JSON.parse((retryResp.text ?? "{}").trim()) as Record<string, unknown>;
  const retryMissing = countMissingReportParts(retryParsed, markdown);
  const chosen = retryMissing.length <= missing.length ? retryParsed : firstParsed;
  return normalizeStructuredReport(chosen);
}

function formatGeminiError(err: unknown): { status: number; message: string } {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("403") || msg.includes("PERMISSION_DENIED") || msg.includes("API_KEY_INVALID")) {
    return {
      status: 403,
      message: "Gemini API key is invalid or missing permissions. Check your API key in Settings > Secrets.",
    };
  }
  if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
    return {
      status: 429,
      message: "Gemini API quota exceeded. Retry shortly or upgrade your key in Settings > Secrets.",
    };
  }
  if (msg.includes("503") || msg.includes("UNAVAILABLE")) {
    return {
      status: 503,
      message: "Gemini model is temporarily busy. Please retry in a few seconds.",
    };
  }
  if (msg.includes("404") || msg.includes("NOT_FOUND")) {
    return {
      status: 404,
      message: "Requested Gemini model was not found or is unavailable for this key.",
    };
  }
  return { status: 500, message: msg || "Failed to execute macro analysis." };
}

export function createApiApp(): express.Express {
  const app = express();
  app.use(express.json({ limit: "2mb" }));
  app.use((req, _res, next) => {
    const rawPath = req.query.__path;
    const pathSegment = Array.isArray(rawPath) ? rawPath[0] : rawPath;
    if (typeof pathSegment === "string" && pathSegment.length > 0 && !req.url.startsWith("/api/")) {
      const restQuery = new URLSearchParams();
      for (const [k, v] of Object.entries(req.query)) {
        if (k === "__path") continue;
        if (typeof v === "string") {
          restQuery.append(k, v);
        } else if (Array.isArray(v)) {
          for (const item of v) {
            if (typeof item === "string") restQuery.append(k, item);
          }
        }
      }
      const qs = restQuery.toString();
      const cleanedPath = pathSegment.replace(/^\/+/, "");
      req.url = `/api/${cleanedPath}${qs ? `?${qs}` : ""}`;
    }
    next();
  });

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
  });

  app.post("/api/macro/analyze", async (req, res) => {
    try {
      const { prompt, mode, activeReportSummary } = req.body as {
        prompt?: string;
        mode?: "auto" | "force-scan" | "follow-up";
        activeReportSummary?: string;
      };

      if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
        res.status(400).json({ error: "Please enter a prompt or paste a macro report." });
        return;
      }

      const trimmedPrompt = prompt.trim();
      const ai = getGeminiClient();

      // Case 1: User pasted a completed 7-section markdown report directly into the chat
      if (isPreGeneratedReport(trimmedPrompt)) {
        const cleanedMarkdown = sanitizeMacroOutput(trimmedPrompt);
        const structured = await structureMarkdownIntoReport(ai, cleanedMarkdown);
        const report = {
          id: `report-${Date.now()}`,
          createdAt: new Date().toISOString(),
          sourceLabel: "Parsed Report",
          promptSnippet: "Direct report visualization",
          rawMarkdown: cleanedMarkdown,
          sources: [],
          ...structured,
        };
        res.json({
          type: "report",
          mode: "parsed-report",
          report,
          assistantMessage: `Parsed pasted report into the 7-section dashboard. Regime: ${
            (structured as { section1?: { regimeName?: string } }).section1?.regimeName ?? "Loaded"
          }.`,
        });
        return;
      }

      // Case 2: Full Global Macro Scan (live Google Search grounded + optional Parallel Search depth)
      if (mode === "force-scan" || (mode !== "follow-up" && isFullScanPrompt(trimmedPrompt))) {
        const todayIso = new Date().toISOString().slice(0, 10);
        const parallelMacroContext = await fetchParallelSearch(
          `Global macro rates US10Y US02Y VIX VIX3M VVIX SPX 20 DMA 200 DMA DXY oil gold copper equity sector flows ${todayIso}`,
          [
            `US 10 year 2 year Treasury yield VIX VIX3M VVIX SPX 200 DMA DXY today`,
            `WTI Brent oil gold copper price technicals today`,
            `US equity sector ETF flows SMH XLF XLV XLE XLI this week`,
          ],
          5
        );

        const systemInstruction = `You are a Chief Global Macro Strategist running a tactical long/short fund (2 to 3 month horizon).
Today's real date is ${todayIso}. Use Google Search to retrieve live and latest-close verified market data across FRED, TradingEconomics, Investing.com, TradingView, Barchart, Cboe, Reuters, Bloomberg, CNBC, EIA/OPEC, and Lipper/ETF flows from the rolling past 7 calendar days.

STRICT OUTPUT & STYLE RULES:
1. NO BRACKETED CITATIONS OR LINKS: NEVER output URLs, web links, markdown hyperlinks, footnotes, or bracketed citation numbers like [1], [2], [9], or [[9]] anywhere. Use plain-text sources only, e.g. (Source: Reuters, Nov 12) or per FRED.
2. LAYMAN TERMS & PLAIN ENGLISH: Briefly explain technical terms and acronyms in plain words right next to them (e.g., 2s10s spread, DFII10 real yield, HY OAS, Copper/Gold ratio, 50/200 DMA, 14-day RSI, bear-flattening, orthogonal, ATR) so an everyday investor can follow easily.
3. CONCISE & SCANNABLE: Open with "### The week in brief" (1-2 punchy sentences summarizing the dominant story + defining market-wide move) and "### Big moves" (1-4 bullets with asset, %/bps move, exact date, ATR/volatility context, and plain-text source), followed by all 7 numbered sections (### 1. through ### 7.). Include VIX, VIX3M, VIX/VIX3M Ratio, VVIX, SPX vs 20/200 DMA, and the 3-Check SPX Credit-Spread Gate (Go / Caution / Wait) in Section 1. Never invent volatility multiples. Keep cluster blocks max 110 words each and the 15 Quick Cards under 60 words each.
4. ZERO ANGLE BRACKETS OR DOLLAR SIGNS: Never use bare "<", ">", or "$" anywhere. Write "greater than", "less than", "above", "below", "USD", and "->".
5. Never fabricate unindexed data; write "N/A (not publicly indexed)" if unavailable.
6. Use mandatory status icons (🟢, 🔴, 🔄, 📈, ⏸️, 📉, ⚠️) and tag Reversing picks as [Reversing Bullish: Troughing] or [Reversing Bearish: Peaking].`;

        const augmentedMacroPrompt = parallelMacroContext
          ? `${trimmedPrompt}\n\nSUPPLEMENTAL LIVE WEB CONTEXT (Parallel Search):\n${parallelMacroContext}`
          : trimmedPrompt;

        const groundedResponse = await generateWithFallback(ai, {
          contents: augmentedMacroPrompt,
          systemInstruction,
          tools: [{ googleSearch: {} }],
          thinkingLevel: ThinkingLevel.MEDIUM,
          maxOutputTokens: 16384,
        });

        const rawText = (groundedResponse.text ?? "").trim();
        if (!rawText) {
          res.status(502).json({ error: "Model returned an empty macro report. Please retry." });
          return;
        }

        const rawMarkdown = sanitizeMacroOutput(rawText);

        const chunks = groundedResponse.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        const seenTitles = new Set<string>();
        const sources: { title: string; uri: string }[] = [];
        for (const chunk of chunks) {
          const web = (chunk as { web?: { uri?: string; title?: string } }).web;
          if (web?.title && !seenTitles.has(web.title)) {
            seenTitles.add(web.title);
            sources.push({
              title: web.title,
              uri: web.uri || "",
            });
          }
        }

        const structured = await structureMarkdownIntoReport(ai, rawMarkdown);
        const report = {
          id: `report-${Date.now()}`,
          createdAt: new Date().toISOString(),
          sourceLabel: "Live Web-Grounded Scan",
          promptSnippet: trimmedPrompt.split("\n")[0].slice(0, 96),
          rawMarkdown,
          sources,
          ...structured,
        };

        const regimeName =
          (structured as { section1?: { regimeName?: string } }).section1?.regimeName ?? "Live Macro Scan";

        res.json({
          type: "report",
          mode: "live-search",
          report,
          assistantMessage: `Completed concise live web-grounded macro scan (${sources.length} plain-text sources checked). Regime: ${regimeName}. Dashboard updated across all 7 sections.`,
        });
        return;
      }

      // Case 3: Tactical follow-up question in the app chat
      const followUpResponse = await generateWithFallback(ai, {
        contents: `Active Macro Dashboard Context:\n${activeReportSummary || "No active context."}\n\nUser Question:\n${trimmedPrompt}`,
        systemInstruction:
          "You are a Chief Global Macro Strategist. Answer clearly in plain English (briefly explaining any financial jargon) using the active macro report context and live Google Search where needed. NEVER output URLs, markdown links, bracketed citations like [1], or bare '<', '>', or '$' symbols (use 'USD' and plain-text sources like '(Source: Reuters, Nov 12)').",
        tools: [{ googleSearch: {} }],
        thinkingLevel: ThinkingLevel.LOW,
      });

      const assistantText = sanitizeMacroOutput((followUpResponse.text ?? "No response generated.").trim());

      res.json({
        type: "message",
        mode: "follow-up",
        assistantMessage: assistantText,
        sources: [],
      });
    } catch (err) {
      console.error("Error in /api/macro/analyze:", err);
      const { status, message } = formatGeminiError(err);
      res.status(status).json({ error: message });
    }
  });

  async function fetchParallelSearch(
    objective: string,
    searchQueries: string[],
    maxResults = 4
  ): Promise<string> {
    const apiKey = process.env.PARALLEL_API_KEY;
    if (!apiKey) return "";

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);
    try {
      const resp = await fetch("https://api.parallel.ai/v1/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          objective,
          search_queries: searchQueries.slice(0, 4),
          mode: "fast",
          advanced_settings: { max_results: maxResults },
        }),
        signal: controller.signal,
      });
      if (!resp.ok) return "";
      const data = (await resp.json()) as {
        results?: Array<{ title?: string; excerpts?: string[]; publish_date?: string }>;
      };
      const lines: string[] = [];
      for (const item of (data.results ?? []).slice(0, maxResults)) {
        const excerpt = Array.isArray(item.excerpts) ? item.excerpts.join(" ").slice(0, 320) : "";
        const title = sanitizeMacroOutput(String(item.title || ""));
        const cleanExcerpt = sanitizeMacroOutput(excerpt);
        if (title || cleanExcerpt) {
          lines.push(`- ${title}${item.publish_date ? ` (${item.publish_date})` : ""}: ${cleanExcerpt}`);
        }
      }
      return lines.join("\n");
    } catch {
      return "";
    } finally {
      clearTimeout(timer);
    }
  }

  const STOCK_SENTIMENT_BATCH_SCHEMA = {
    type: Type.OBJECT,
    properties: {
      stocks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            symbol: { type: Type.STRING },
            mappedClusterId: { type: Type.STRING },
            newsScore: { type: Type.INTEGER },
            newsBias: { type: Type.STRING },
            oneLineTakeaway: { type: Type.STRING },
            plainTextSource: { type: Type.STRING },
            catalystWarning: { type: Type.STRING },
            plainEnglishReason: { type: Type.STRING },
            epsRevisionDir: { type: Type.STRING },
            epsRevisionNote: { type: Type.STRING },
            headlineScores: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  index: { type: Type.INTEGER },
                  sentimentScore: { type: Type.NUMBER },
                  impact: { type: Type.STRING },
                },
                required: ["index", "sentimentScore", "impact"],
              },
            },
          },
          required: [
            "symbol",
            "mappedClusterId",
            "newsScore",
            "newsBias",
            "oneLineTakeaway",
            "plainTextSource",
            "catalystWarning",
            "plainEnglishReason",
            "epsRevisionDir",
            "epsRevisionNote",
            "headlineScores",
          ],
        },
      },
    },
    required: ["stocks"],
  };

  interface TradingViewStockMeta {
    symbol: string;
    tvFullSymbol: string;
    companyName: string;
    currentPrice: number | null;
    premarketPrice: number | null;
    premarketChangePct: number | null;
    premarketVolume: number | null;
    currency: string;
    analystIntrinsicValue: number | null;
    valuationSource: string;
    forwardPe: number | null;
    trailingPe: number | null;
    pegRatio: number | null;
    evToEbitda: number | null;
    priceToSales: number | null;
    fcfYieldPct: number | null;
    evToSales: number | null;
    evToGrossProfit: number | null;
    priceToBook: number | null;
    grossMarginPct: number | null;
    rsi14: number | null;
    sma50: number | null;
    sma200: number | null;
    perf1W: number | null;
    perf1M: number | null;
    beta1Y: number | null;
    earningsDate: string;
    earningsWithinDays: number | null;
    sector: string;
    industry: string;
    assetType: string;
  }

  interface TradingViewNewsEntry {
    id: string;
    title: string;
    publisher: string;
    publishedTs: number;
    ageLabel: string;
    dateLabel: string;
    storySummary: string;
    url: string;
  }

  function formatShortDate(dateInput: string | number): string {
    const d = new Date(dateInput);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function formatRelativeAge(unixSec: number): string {
    if (!Number.isFinite(unixSec) || unixSec <= 0) return "Recent";
    const diffSec = Math.max(60, Math.floor(Date.now() / 1000 - unixSec));
    const hours = Math.floor(diffSec / 3600);
    if (hours < 1) return `${Math.max(1, Math.floor(diffSec / 60))}m ago`;
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
  }

  function mapSectorToCluster(
    symbol: string,
    sector: string,
    industry: string,
    assetType: string
  ): string {
    const upper = symbol.toUpperCase();
    if (["SPY", "VOO", "IVV", "DIA", "IWM", "RSP"].includes(upper)) return "BROAD";
    if (["QQQ", "AAPL", "TSM", "NVDA", "AVGO", "AMD", "SMH", "SOXX", "CDNS", "ASML", "MRVL", "NBIS", "IONQ", "IREN"].includes(upper)) return "C1";
    if (["MSFT", "CRWD", "PANW", "NOW", "CRM", "PLTR", "IGV", "ORCL", "FTNT"].includes(upper)) return "C2";
    if (["AMZN", "GOOGL", "GOOG", "META", "TSLA", "NFLX", "XLY", "XLC"].includes(upper)) return "C3";
    if (["COST", "WMT", "PG", "KO", "PEP", "XLP"].includes(upper)) return "C4";
    if (["JNJ", "ISRG", "UNH", "LLY", "MRK", "VRTX", "XLV"].includes(upper)) return "C5";
    if (["ETN", "VRT", "CEG", "MTZ", "RKLB", "RTX", "LMT", "PWR", "XLI"].includes(upper)) return "C6";
    if (["XOM", "GLD", "MP", "FCX", "LIN", "MPC", "XLE", "XLB"].includes(upper)) return "C7";
    if (["NU", "MA", "V", "JPM", "GS", "HOOD", "IBIT", "XLF"].includes(upper)) return "C8";

    const text = `${sector} ${industry}`.toLowerCase();
    if (/semiconductor|electronic equipment|computer hardware|telecommunications equipment/.test(text)) return "C1";
    if (/software|cloud|cyber|it services|data processing/.test(text)) return "C2";
    if (/retail|media|internet|consumer cyclical|auto|hotel|restaurant|entertainment|apparel/.test(text)) return "C3";
    if (/consumer non-durables|food|beverage|household|tobacco|staples|personal products/.test(text)) return "C4";
    if (/health|pharma|biotech|medical|hospital|managed care/.test(text)) return "C5";
    if (/industrial|aerospace|defense|machinery|railroad|trucking|utility|utilities|electric|construction/.test(text)) return "C6";
    if (/energy|oil|gas|coal|metal|mining|chemical|material|steel/.test(text)) return "C7";
    if (/finance|bank|insurance|capital markets|asset management|credit|payment/.test(text)) return "C8";
    if (assetType === "fund") return "BROAD";
    return "C1";
  }

  async function fetchTradingViewBatch(
    tickers: string[],
    exchangeOverrides?: Map<string, string>
  ): Promise<Map<string, TradingViewStockMeta>> {
    const result = new Map<string, TradingViewStockMeta>();
    const EXCHANGE_PRIORITY: Record<string, number> = {
      NASDAQ: 1,
      NYSE: 2,
      ARCA: 3,
      AMEX: 4,
      BATS: 5,
    };

    try {
      const response = await fetch("https://scanner.tradingview.com/america/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filter: [
            { left: "name", operation: "in_range", right: tickers },
            {
              left: "exchange",
              operation: "in_range",
              right: ["NASDAQ", "NYSE", "ARCA", "AMEX", "BATS"],
            },
          ],
          options: { lang: "en" },
            columns: [
              "name",
              "exchange",
              "description",
              "close",
              "currency",
              "price_target_median",
              "price_target_average",
              "earnings_release_next_date",
              "sector",
              "industry",
              "type",
              "earnings_per_share_forecast_next_fy",
              "price_earnings_ttm",
              "price_earnings_growth_ttm",
              "enterprise_value_ebitda_ttm",
              "price_sales_current",
              "RSI",
              "SMA50",
              "SMA200",
              "Perf.W",
              "Perf.1M",
              "beta_1_year",
              "market_cap_basic",
              "enterprise_value_current",
              "free_cash_flow_ttm",
              "price_book_fq",
              "gross_margin_ttm",
              "premarket_close",
              "premarket_change",
              "premarket_volume",
            ],
            range: [0, 80],
          }),
        });

      const roundOrNull = (val: unknown, digits = 2, positiveOnly = false): number | null => {
        if (typeof val !== "number" || !Number.isFinite(val)) return null;
        if (positiveOnly && val <= 0) return null;
        return Number(val.toFixed(digits));
      };

      if (response.ok) {
        const data = (await response.json()) as {
          data?: Array<{ s: string; d: unknown[] }>;
        };
        const bestRank = new Map<string, number>();

        for (const row of data.data ?? []) {
          const d = row.d ?? [];
          const sym = String(d[0] || "").toUpperCase();
          if (!sym) continue;
          const exchange = String(d[1] || "").toUpperCase();
          const forcedExchange = exchangeOverrides?.get(sym);
          const rank =
            forcedExchange && exchange === forcedExchange
              ? 0
              : EXCHANGE_PRIORITY[exchange] ?? 99;
          if ((bestRank.get(sym) ?? 999) <= rank) continue;
          bestRank.set(sym, rank);

          const closeNum = roundOrNull(d[3], 2);
          const medianTarget = roundOrNull(d[5], 2, true);
          const avgTarget = roundOrNull(d[6], 2, true);
          const analystTarget = medianTarget ?? avgTarget;

          const epsNextFy = roundOrNull(d[11], 4, true);
          const forwardPe =
            closeNum !== null && epsNextFy !== null
              ? Number((closeNum / epsNextFy).toFixed(1))
              : null;
          const trailingPe = roundOrNull(d[12], 1, true);
          const pegRatio = roundOrNull(d[13], 2, true);
          const evToEbitda = roundOrNull(d[14], 1, true);
          const priceToSales = roundOrNull(d[15], 1, true);
          const rsi14 = roundOrNull(d[16], 1);
          const sma50 = roundOrNull(d[17], 2, true);
          const sma200 = roundOrNull(d[18], 2, true);
          const perf1W = roundOrNull(d[19], 2);
          const perf1M = roundOrNull(d[20], 2);
          const beta1Y = roundOrNull(d[21], 2);

          const mcap = typeof d[22] === "number" && Number.isFinite(d[22]) && d[22] > 0 ? d[22] : null;
          const evVal = typeof d[23] === "number" && Number.isFinite(d[23]) && d[23] > 0 ? d[23] : null;
          const fcfTtm = typeof d[24] === "number" && Number.isFinite(d[24]) ? d[24] : null;
          const priceToBook = roundOrNull(d[25], 1, true);
          const grossMarginPct = roundOrNull(d[26], 1);
          const premarketPrice = roundOrNull(d[27], 2, true);
          const premarketChangePct = roundOrNull(d[28], 2);
          const premarketVolume =
            typeof d[29] === "number" && Number.isFinite(d[29]) && d[29] > 0
              ? Math.round(d[29])
              : null;

          const fcfYieldPct =
            mcap !== null && fcfTtm !== null
              ? Number(((fcfTtm / mcap) * 100).toFixed(1))
              : null;
          const evToSales =
            priceToSales !== null && evVal !== null && mcap !== null
              ? Number((priceToSales * (evVal / mcap)).toFixed(1))
              : priceToSales;
          const evToGrossProfit =
            evToSales !== null && grossMarginPct !== null && grossMarginPct > 5
              ? Number((evToSales / (grossMarginPct / 100)).toFixed(1))
              : null;

          let earningsDate = "N/A (not scheduled)";
          let earningsWithinDays: number | null = null;
          if (typeof d[7] === "number" && Number.isFinite(d[7]) && d[7] > 0) {
            const ms = d[7] * 1000;
            const days = Math.ceil((ms - Date.now()) / 86_400_000);
            if (days >= -1 && days <= 365) {
              earningsDate = formatShortDate(ms) || "Scheduled";
              earningsWithinDays = Math.max(0, days);
            }
          }

          const assetType = String(d[10] || "");
          const etfIndustryMap: Record<string, string> = {
            SPY: "Broad US Equity Index ETF",
            VOO: "Broad US Equity Index ETF",
            IVV: "Broad US Equity Index ETF",
            QQQ: "Large-Cap Growth ETF",
            IWM: "US Small-Cap Index ETF",
            SMH: "Semiconductor ETF",
            IGV: "Enterprise Software ETF",
            XLE: "Energy Sector ETF",
            XLF: "Financials Sector ETF",
            XLV: "Healthcare Sector ETF",
            XLP: "Consumer Staples ETF",
            XLY: "Consumer Discretionary ETF",
            XLI: "Industrials Sector ETF",
            GLD: "Physical Gold ETF",
            IBIT: "Spot Bitcoin ETF",
          };
          const rawIndustry = sanitizeMacroOutput(String(d[9] || ""));
          const industry =
            etfIndustryMap[sym] ||
            (assetType === "fund" && (!rawIndustry || rawIndustry.includes("Investment Trusts"))
              ? "Exchange Traded Fund"
              : rawIndustry);

          result.set(sym, {
            symbol: sym,
            tvFullSymbol: row.s || `${exchange}:${sym}`,
            companyName: sanitizeMacroOutput(String(d[2] || sym)),
            currentPrice: closeNum,
            premarketPrice,
            premarketChangePct,
            premarketVolume,
            currency: String(d[4] || "USD"),
            analystIntrinsicValue: analystTarget,
            valuationSource:
              medianTarget !== null
                ? `TradingView Analyst Median (${formatShortDate(Date.now())})`
                : avgTarget !== null
                  ? `TradingView Analyst Average (${formatShortDate(Date.now())})`
                  : assetType === "fund"
                    ? "ETF (no analyst target)"
                    : "Not indexed on TradingView",
            forwardPe,
            trailingPe,
            pegRatio,
            evToEbitda,
            priceToSales,
            fcfYieldPct,
            evToSales,
            evToGrossProfit,
            priceToBook,
            grossMarginPct,
            rsi14,
            sma50,
            sma200,
            perf1W,
            perf1M,
            beta1Y,
            earningsDate,
            earningsWithinDays,
            sector: sanitizeMacroOutput(String(d[8] || "")),
            industry,
            assetType,
          });
        }
      }
    } catch (err) {
      console.warn("TradingView scanner fetch warning:", err);
    }

    return result;
  }

  async function fetchTradingViewStoryText(storyId: string): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    try {
      const resp = await fetch(
        `https://news-headlines.tradingview.com/v2/story?id=${encodeURIComponent(storyId)}&lang=en`,
        {
          headers: { "User-Agent": "Mozilla/5.0" },
          signal: controller.signal,
        }
      );
      if (!resp.ok) return "";
      const data = (await resp.json()) as {
        shortDescription?: string;
        astDescription?: { children?: Array<{ children?: unknown[] }> };
      };
      if (data.shortDescription) {
        return sanitizeMacroOutput(data.shortDescription).slice(0, 420);
      }
      return "";
    } catch {
      return "";
    } finally {
      clearTimeout(timer);
    }
  }

  const TV_ETF_NEWS_PROXY_MAP: Record<string, { tvProxy: string; yahooTickers: string[] }> = {
    SPY: { tvProxy: "SP:SPX", yahooTickers: ["SPY", "^GSPC"] },
    VOO: { tvProxy: "SP:SPX", yahooTickers: ["VOO", "SPY", "^GSPC"] },
    IVV: { tvProxy: "SP:SPX", yahooTickers: ["IVV", "SPY", "^GSPC"] },
    RSP: { tvProxy: "SP:SPX", yahooTickers: ["RSP", "SPY", "^GSPC"] },
    QQQ: { tvProxy: "NASDAQ:NDX", yahooTickers: ["QQQ", "^IXIC", "^NDX"] },
    DIA: { tvProxy: "TVC:DJI", yahooTickers: ["DIA", "^DJI"] },
    IWM: { tvProxy: "TVC:RUT", yahooTickers: ["IWM", "^RUT"] },
    GLD: { tvProxy: "TVC:GOLD", yahooTickers: ["GLD", "GC=F"] },
    IBIT: { tvProxy: "BITSTAMP:BTCUSD", yahooTickers: ["IBIT", "BTC-USD"] },
    XLE: { tvProxy: "NYMEX:CL1!", yahooTickers: ["XLE", "CL=F"] },
  };

  async function fetchTradingViewSymbolNewsRaw(tvSym: string): Promise<
    Array<{
      id?: string;
      title?: string;
      source?: string;
      provider?: string;
      published?: number;
      link?: string;
      storyPath?: string;
      matchedTvSym: string;
    }>
  > {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      const resp = await fetch(
        `https://news-headlines.tradingview.com/v2/view/headlines/symbol?client=web&lang=en&section=&streaming=&symbol=${encodeURIComponent(tvSym)}`,
        {
          headers: { "User-Agent": "Mozilla/5.0" },
          signal: controller.signal,
        }
      );
      if (!resp.ok) return [];
      const json = (await resp.json()) as {
        items?: Array<{
          id?: string;
          title?: string;
          source?: string;
          provider?: string;
          published?: number;
          link?: string;
          storyPath?: string;
        }>;
      };
      if (!Array.isArray(json.items)) return [];
      return json.items.map((item) => ({ ...item, matchedTvSym: tvSym }));
    } catch {
      return [];
    } finally {
      clearTimeout(timer);
    }
  }

  async function fetchYahooFinanceNewsForTicker(
    symbol: string,
    allowedTickers: string[]
  ): Promise<TradingViewNewsEntry[]> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      const resp = await fetch(
        `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(symbol)}&newsCount=12&quotesCount=0`,
        {
          headers: { "User-Agent": "Mozilla/5.0" },
          signal: controller.signal,
        }
      );
      if (!resp.ok) return [];
      const json = (await resp.json()) as {
        news?: Array<{
          title?: string;
          publisher?: string;
          link?: string;
          providerPublishTime?: number;
          relatedTickers?: string[];
        }>;
      };
      const allowedSet = new Set(allowedTickers.map((t) => t.toUpperCase()));
      const entries: TradingViewNewsEntry[] = [];
      for (const item of json.news ?? []) {
        const title = sanitizeMacroOutput(String(item.title || "")).trim();
        if (!title) continue;
        const related = Array.isArray(item.relatedTickers)
          ? item.relatedTickers.map((t) => String(t).toUpperCase())
          : [];
        if (related.length > 0 && !related.some((t) => allowedSet.has(t))) {
          continue;
        }
        const pubTs =
          typeof item.providerPublishTime === "number" && item.providerPublishTime > 0
            ? item.providerPublishTime
            : Math.floor(Date.now() / 1000);
        const publisher = sanitizeMacroOutput(String(item.publisher || "Market Wire"));
        const rawLink = typeof item.link === "string" ? item.link.trim() : "";
        entries.push({
          id: "",
          title,
          publisher,
          publishedTs: pubTs,
          ageLabel: formatRelativeAge(pubTs),
          dateLabel: formatShortDate(pubTs * 1000) || "Recent",
          storySummary: "",
          url: /^https?:\/\//i.test(rawLink) ? rawLink : "",
        });
      }
      return entries;
    } catch {
      return [];
    } finally {
      clearTimeout(timer);
    }
  }

  async function fetchTradingViewNewsForTicker(
    symbol: string,
    tvFullSymbol?: string,
    assetType?: string
  ): Promise<TradingViewNewsEntry[]> {
    const upperSym = symbol.toUpperCase();
    const proxyCfg = TV_ETF_NEWS_PROXY_MAP[upperSym];
    const isEtf = assetType === "fund" || Boolean(proxyCfg);

    const candidates = tvFullSymbol
      ? [tvFullSymbol]
      : [`NASDAQ:${upperSym}`, `NYSE:${upperSym}`, `AMEX:${upperSym}`];

    let rawTvItems: Awaited<ReturnType<typeof fetchTradingViewSymbolNewsRaw>> = [];
    for (const tvSym of candidates) {
      const items = await fetchTradingViewSymbolNewsRaw(tvSym);
      if (items.length > 0) {
        rawTvItems = items;
        break;
      }
    }

    const nowSec = Math.floor(Date.now() / 1000);
    const newestTvTs = rawTvItems.reduce(
      (maxTs, item) => (typeof item.published === "number" && item.published > maxTs ? item.published : maxTs),
      0
    );
    const recentTvCount7d = rawTvItems.filter(
      (item) => typeof item.published === "number" && nowSec - item.published <= 7 * 86_400
    ).length;

    const needsFreshSupplement =
      isEtf ||
      rawTvItems.length === 0 ||
      nowSec - newestTvTs > 36 * 3600 ||
      recentTvCount7d < 6;

    const [proxyTvItems, yahooItems] = needsFreshSupplement
      ? await Promise.all([
          proxyCfg?.tvProxy ? fetchTradingViewSymbolNewsRaw(proxyCfg.tvProxy) : Promise.resolve([]),
          fetchYahooFinanceNewsForTicker(upperSym, proxyCfg?.yahooTickers ?? [upperSym]),
        ])
      : [[], []];

    const combinedEntries: TradingViewNewsEntry[] = [];

    for (const item of [...rawTvItems, ...proxyTvItems]) {
      const title = sanitizeMacroOutput(String(item.title || "")).trim();
      if (!title) continue;
      const pubTs = typeof item.published === "number" ? item.published : nowSec;
      const publisher = sanitizeMacroOutput(String(item.source || item.provider || "TradingView"));
      const rawLink = typeof item.link === "string" ? item.link.trim() : "";
      const rawStoryPath = typeof item.storyPath === "string" ? item.storyPath.trim() : "";
      const articleUrl = /^https?:\/\//i.test(rawLink)
        ? rawLink
        : rawStoryPath.startsWith("/")
          ? `https://www.tradingview.com${rawStoryPath}`
          : `https://www.tradingview.com/symbols/${encodeURIComponent(item.matchedTvSym)}/news/`;

      combinedEntries.push({
        id: String(item.id || ""),
        title,
        publisher,
        publishedTs: pubTs,
        ageLabel: formatRelativeAge(pubTs),
        dateLabel: formatShortDate(pubTs * 1000) || "Recent",
        storySummary: "",
        url: articleUrl,
      });
    }

    combinedEntries.push(...yahooItems);

    // Sort strictly newest-first and deduplicate across TradingView, Proxy Index, and Yahoo Finance wires
    combinedEntries.sort((a, b) => b.publishedTs - a.publishedTs);

    const seenTitles = new Set<string>();
    const deduped: TradingViewNewsEntry[] = [];
    for (const entry of combinedEntries) {
      const dedupeKey = entry.title.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 48);
      if (!dedupeKey || seenTitles.has(dedupeKey)) continue;
      seenTitles.add(dedupeKey);
      deduped.push(entry);
    }

    // Prefer stories from the past 14 days whenever enough fresh coverage exists
    const fresh14d = deduped.filter((e) => nowSec - e.publishedTs <= 14 * 86_400);
    const entries = (fresh14d.length >= 6 ? fresh14d : deduped).slice(0, 12);

    // Fetch TradingView full story descriptions for up to top 3 TradingView items (after newest-first sort)
    const tvSummaryTargets = entries.filter((e) => Boolean(e.id)).slice(0, 3);
    if (tvSummaryTargets.length > 0) {
      const storySummaries = await Promise.all(
        tvSummaryTargets.map((e) => fetchTradingViewStoryText(e.id))
      );
      for (let i = 0; i < tvSummaryTargets.length; i++) {
        if (storySummaries[i]) {
          tvSummaryTargets[i].storySummary = storySummaries[i];
        }
      }
    }

    return entries;
  }

  function scoreSingleHeadlineFallback(title: string): {
    sentimentScore: number;
    impact: "bullish" | "bearish" | "neutral";
  } {
    const posMatches = title.match(
      /\b(beat|beats|surge|surges|rally|rallies|upgrade|upgrades|record|growth|raises|strong|bullish|outperform|buy|buys|gain|gains|soar|soars|jump|jumps|boom|prevail|adds|bought|launch|innovation|rebound|rebounds|boost|boosts|relief|inflows|hiked)\b/gi
    );
    const negMatches = title.match(
      /\b(miss|misses|plunge|plunges|drop|drops|fall|falls|downgrade|downgrades|cut|cuts|loss|slump|slumps|lawsuit|fine|probe|outage|leak|selloff|warning|warns|weak|bearish|dive|dives|layoff|pain|killing|hurdle|risk|inflation|hike|hikes|slide|slides|tumble|tumbles|sink|sinks|sanctions|damps|hit|blacklisted|sell|sells|outflow|outflows)\b/gi
    );
    const raw = ((posMatches?.length ?? 0) * 0.25) - ((negMatches?.length ?? 0) * 0.25);
    const clamped = Number(Math.max(-0.8, Math.min(0.8, raw)).toFixed(2));
    const impact = clamped >= 0.15 ? "bullish" : clamped <= -0.15 ? "bearish" : "neutral";
    return { sentimentScore: clamped, impact };
  }

  function scoreHeadlinesFallback(headlines: TradingViewNewsEntry[]): {
    score: number;
    bias: "bullish" | "neutral" | "bearish";
  } {
    if (headlines.length === 0) return { score: 0, bias: "neutral" };
    let total = 0;
    for (const h of headlines) {
      total += scoreSingleHeadlineFallback(`${h.title} ${h.storySummary}`).sentimentScore;
    }
    const scaled = Math.max(-10, Math.min(10, Math.round((total / Math.max(1, headlines.length * 0.35)) * 10)));
    const bias = scaled >= 2 ? "bullish" : scaled <= -2 ? "bearish" : "neutral";
    return { score: scaled, bias };
  }

  async function callWithRateLimitRetry<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
        await new Promise((resolve) => setTimeout(resolve, 1800));
        return await fn();
      }
      throw err;
    }
  }

  app.post("/api/stocks/sentiment", async (req, res) => {
    try {
      const { tickers, activeClusters } = req.body as {
        tickers?: string[];
        activeClusters?: { id: string; name: string; score: number; biasLabel: string }[];
      };

      if (!Array.isArray(tickers) || tickers.length === 0) {
        res.status(400).json({ error: "Please provide at least one stock ticker." });
        return;
      }

      const exchangeOverrides = new Map<string, string>();
      const cleanTickersList: string[] = [];
      for (const rawEntry of tickers) {
        const cleaned = String(rawEntry).toUpperCase().replace(/^\$/, "").trim();
        const colonIdx = cleaned.indexOf(":");
        if (colonIdx > 0) {
          const ex = cleaned.slice(0, colonIdx).trim();
          const sym = cleaned.slice(colonIdx + 1).trim();
          if (/^[A-Z]{2,12}$/.test(ex) && /^[A-Z0-9]{1,6}(?:[.-][A-Z0-9]{1,3})?$/.test(sym)) {
            exchangeOverrides.set(sym, ex);
            cleanTickersList.push(sym);
          }
        } else if (/^[A-Z0-9]{1,6}(?:[.-][A-Z0-9]{1,3})?$/.test(cleaned)) {
          cleanTickersList.push(cleaned);
        }
      }

      const cleanTickers = Array.from(new Set(cleanTickersList)).slice(0, 20);

      if (cleanTickers.length === 0) {
        res.status(400).json({ error: "No valid stock ticker symbols provided." });
        return;
      }

      // Step 1: Fetch TradingView Scanner metadata first so we have exact EXCHANGE:SYMBOL prefixes
      const tvMap = await fetchTradingViewBatch(cleanTickers, exchangeOverrides);

      // Step 2: Fetch TradingView News Headlines & Story depth (ZERO RSS) + optional batch Parallel Search context
      const [tvNewsEntries, parallelBatchContext] = await Promise.all([
        Promise.all(
          cleanTickers.map(async (sym) => {
            const forcedEx = exchangeOverrides.get(sym);
            const tvMeta = tvMap.get(sym);
            const tvSym = forcedEx ? `${forcedEx}:${sym}` : tvMeta?.tvFullSymbol;
            return {
              symbol: sym,
              headlines: await fetchTradingViewNewsForTicker(sym, tvSym, tvMeta?.assetType),
            };
          })
        ),
        fetchParallelSearch(
          `Latest 3-month analyst EPS estimate revisions, upgrades/cuts, and institutional catalysts for ${cleanTickers.slice(0, 10).join(", ")}`,
          [
            `${cleanTickers.slice(0, 5).join(" ")} EPS estimate revisions analyst upgrade`,
            cleanTickers.length > 5
              ? `${cleanTickers.slice(5, 10).join(" ")} EPS estimate revisions analyst upgrade`
              : `${cleanTickers.slice(0, 5).join(" ")} earnings guidance outlook`,
          ],
          5
        ),
      ]);

      const newsMap = new Map<string, TradingViewNewsEntry[]>();
      for (const entry of tvNewsEntries) {
        newsMap.set(entry.symbol, entry.headlines);
      }

      const clusterSummary =
        Array.isArray(activeClusters) && activeClusters.length > 0
          ? activeClusters
              .map((c) => `${c.id} (${c.name}): score ${c.score}, bias ${c.biasLabel}`)
              .join("\n")
          : "C1: Tech Hardware/Semis, C2: Enterprise Software/Cloud, C3: Cyclical Discretionary/Media, C4: Consumer Staples, C5: Healthcare/MedTech, C6: Industrials/Grid, C7: Commodities/Energy/Materials, C8: Financials/Banks";

      const batchInputText = cleanTickers
        .map((sym) => {
          const tv = tvMap.get(sym);
          const headlines = newsMap.get(sym) ?? [];
          const hlText =
            headlines.length > 0
              ? headlines
                  .map((h, i) => {
                    const summaryPart = h.storySummary ? ` | Summary: ${h.storySummary}` : "";
                    return `  [${i}] ${h.title} (${h.publisher}, ${h.ageLabel})${summaryPart}`;
                  })
                  .join("\n")
              : "  No recent TradingView headlines returned.";
          const pmPart =
            tv?.premarketPrice !== null && tv?.premarketPrice !== undefined && tv?.premarketChangePct !== null && tv?.premarketChangePct !== undefined
              ? ` | Premarket: ${tv.premarketPrice} (${tv.premarketChangePct > 0 ? "+" : ""}${tv.premarketChangePct}%${
                  tv.premarketVolume ? `, Vol ${tv.premarketVolume.toLocaleString("en-US")}` : ""
                })`
              : "";
          return `${sym} | ${tv?.companyName || sym} | Industry: ${tv?.industry || "Unknown"} | Price: ${tv?.currentPrice ?? "N/A"}${pmPart} | TV Target: ${tv?.analystIntrinsicValue ?? "N/A"} | Next Earnings: ${tv?.earningsDate || "N/A"}\n${hlText}`;
        })
        .join("\n\n");

      // Step 3: Single lightweight gemini-3.1-flash-lite call scoring all TradingView headlines + writing in-depth rationales
      const aiBySymbol = new Map<
        string,
        {
          mappedClusterId?: string;
          newsScore?: number;
          newsBias?: string;
          oneLineTakeaway?: string;
          plainTextSource?: string;
          catalystWarning?: string;
          plainEnglishReason?: string;
          epsRevisionDir?: string;
          epsRevisionNote?: string;
          headlineScores?: Array<{ index?: number; sentimentScore?: number; impact?: string }>;
        }
      >();

      try {
        const ai = getGeminiClient();
        const scoringPrompt = `You are a Chief Global Macro & Equity Strategist.
Evaluate recent TradingView news sentiment, 60-90 day EPS revision momentum, and macro alignment for these ${cleanTickers.length} tickers using the verified TradingView headlines and article summaries below${
          parallelBatchContext ? " alongside supplemental Parallel Search institutional context" : ""
        }.

MacroRegime 8-Cluster Context:
${clusterSummary}
- Use "BROAD" only for broad US index ETFs like SPY, VOO, DIA, IVV, IWM. Otherwise map each stock to C1..C8.

TRADINGVIEW DATA & MATERIAL HEADLINES:
${batchInputText}${
          parallelBatchContext
            ? `\n\nSUPPLEMENTAL INSTITUTIONAL WEB CONTEXT (Parallel Search):\n${parallelBatchContext}`
            : ""
        }

RULES:
- newsScore: integer from -10 (very bearish) to +10 (very bullish), balanced across positive and negative TradingView stories.
- headlineScores: return one entry for EVERY indexed headline [0..N-1] provided for that ticker, with sentimentScore between -1.00 and +1.00 (2 decimal places, e.g. 0.40, -0.35, 0.00) and impact ("bullish" | "bearish" | "neutral").
- epsRevisionDir: classify recent 60-90d consensus EPS / guidance revision momentum strictly from the supplied headlines/context: "up" (estimates/guidance raised, Zacks/analyst upgrades), "down" (estimates/guidance cut), "flat" (unchanged/mixed), or "unknown" (no estimate signal in supplied stories or ETF). Never guess.
- epsRevisionNote: concise 5-10 word plain-English note explaining the EPS revision signal (e.g. "Consensus raised after beat and guidance hike" or "No explicit EPS revision catalyst indexed").
- plainEnglishReason (Rationale): write a clear, in-depth 2-to-3 sentence synthesis in plain English citing specific numbers, catalysts, bull vs bear offsets, and macro impact from the TradingView stories.
- oneLineTakeaway: punchy 1-sentence headline takeaway.
- plainTextSource: plain-text TradingView publisher attribution (e.g. "TradingView · Reuters, GuruFocus").
- NEVER output URLs, links, [1], "$", "<", or ">".`;

        const geminiResp = await callWithRateLimitRetry(() =>
          generateWithFallback(
            ai,
            {
              contents: scoringPrompt,
              thinkingLevel: ThinkingLevel.MINIMAL,
              responseMimeType: "application/json",
              responseSchema: STOCK_SENTIMENT_BATCH_SCHEMA,
            },
            ["gemini-3.1-flash-lite", "gemini-4-hydrogen"]
          )
        );

        const parsed = JSON.parse((geminiResp.text ?? '{"stocks":[]}').trim()) as {
          stocks?: Array<{
            symbol?: string;
            mappedClusterId?: string;
            newsScore?: number;
            newsBias?: string;
            oneLineTakeaway?: string;
            plainTextSource?: string;
            catalystWarning?: string;
            plainEnglishReason?: string;
            epsRevisionDir?: string;
            epsRevisionNote?: string;
            headlineScores?: Array<{ index?: number; sentimentScore?: number; impact?: string }>;
          }>;
        };

        for (const item of parsed.stocks ?? []) {
          if (item.symbol) {
            aiBySymbol.set(String(item.symbol).toUpperCase().trim(), item);
          }
        }
      } catch (aiErr) {
        console.warn("Gemini scoring fallback engaged:", aiErr);
      }

      const sanitizedStocks = cleanTickers.map((sym) => {
        const tv = tvMap.get(sym);
        const tvHeadlines = newsMap.get(sym) ?? [];
        const aiItem = aiBySymbol.get(sym);
        const fallback = scoreHeadlinesFallback(tvHeadlines);

        const rawBias = String(aiItem?.newsBias || fallback.bias).toLowerCase();
        const newsBias: "bullish" | "neutral" | "bearish" =
          rawBias === "bullish" || rawBias === "bearish" ? rawBias : "neutral";
        const clampedScore =
          typeof aiItem?.newsScore === "number"
            ? Math.max(-10, Math.min(10, Math.round(aiItem.newsScore)))
            : fallback.score;

        const rawCluster = String(aiItem?.mappedClusterId || "").toUpperCase().trim();
        const mappedClusterId =
          rawCluster === "BROAD" || /^C[1-8]$/.test(rawCluster)
            ? rawCluster
            : mapSectorToCluster(sym, tv?.sector || "", tv?.industry || "", tv?.assetType || "");

        const defaultTakeaway = tvHeadlines[0]?.title || "No recent TradingView headlines indexed.";
        const topPublishers = Array.from(new Set(tvHeadlines.slice(0, 4).map((h) => h.publisher))).join(", ");
        const defaultSource = tvHeadlines[0]
          ? `TradingView (${topPublishers})`
          : "TradingView";

        const earningsWithinDays = tv?.earningsWithinDays ?? null;
        const defaultCatalyst =
          earningsWithinDays !== null && earningsWithinDays <= 14
            ? `Imminent earnings in ${earningsWithinDays} days (${tv?.earningsDate}); expect higher volatility.`
            : earningsWithinDays !== null && earningsWithinDays <= 30
              ? `Upcoming earnings on ${tv?.earningsDate} (${earningsWithinDays} days away).`
              : "No imminent earnings binary event inside 14 days.";

        const scoreByIdx = new Map<number, { sentimentScore: number; impact: "bullish" | "bearish" | "neutral" }>();
        for (const hs of aiItem?.headlineScores ?? []) {
          if (typeof hs.index === "number" && typeof hs.sentimentScore === "number") {
            const clampedH = Number(Math.max(-1, Math.min(1, hs.sentimentScore)).toFixed(2));
            const imp = String(hs.impact || "").toLowerCase();
            scoreByIdx.set(hs.index, {
              sentimentScore: clampedH,
              impact:
                imp === "bullish" || imp === "bearish"
                  ? imp
                  : clampedH >= 0.15
                    ? "bullish"
                    : clampedH <= -0.15
                      ? "bearish"
                      : "neutral",
            });
          }
        }

        const recentHeadlines = tvHeadlines.map((h, idx) => {
          const scored = scoreByIdx.get(idx) ?? scoreSingleHeadlineFallback(`${h.title} ${h.storySummary}`);
          return {
            headline: h.title,
            sourceDate: `${h.publisher} · ${h.ageLabel}`,
            publisher: h.publisher,
            ageLabel: h.ageLabel,
            impact: scored.impact,
            sentimentScore: scored.sentimentScore,
            url: h.url,
          };
        });

        const fallbackReason =
          tvHeadlines.find((h) => h.storySummary)?.storySummary ||
          (tvHeadlines.length > 0
            ? `Scored ${clampedScore} across ${tvHeadlines.length} recent TradingView stories from ${topPublishers}. Top catalyst: ${tvHeadlines[0].title}.`
            : "Live TradingView quote loaded; no recent TradingView stories indexed.");

          const rawRevDir = String(aiItem?.epsRevisionDir || "").toLowerCase().trim();
          const epsRevisionDir: "up" | "flat" | "down" | "unknown" =
            rawRevDir === "up" || rawRevDir === "down" || rawRevDir === "flat"
              ? rawRevDir
              : "unknown";
          const epsRevisionNote = sanitizeMacroOutput(
            String(aiItem?.epsRevisionNote || "No explicit EPS revision signal indexed.")
          );

          return {
            symbol: sym,
            companyName: tv?.companyName || sym,
            industry: tv?.industry || tv?.sector || "",
            mappedClusterId,
            currentPrice: tv?.currentPrice ?? null,
            premarketPrice: tv?.premarketPrice ?? null,
            premarketChangePct: tv?.premarketChangePct ?? null,
            premarketVolume: tv?.premarketVolume ?? null,
            priceCurrency: tv?.currency || "USD",
            analystIntrinsicValue: tv?.analystIntrinsicValue ?? null,
            valuationSource: tv?.valuationSource || "TradingView Scanner",
            forwardPe: tv?.forwardPe ?? null,
            trailingPe: tv?.trailingPe ?? null,
            pegRatio: tv?.pegRatio ?? null,
            evToEbitda: tv?.evToEbitda ?? null,
            priceToSales: tv?.priceToSales ?? null,
            fcfYieldPct: tv?.fcfYieldPct ?? null,
            evToSales: tv?.evToSales ?? null,
            evToGrossProfit: tv?.evToGrossProfit ?? null,
            priceToBook: tv?.priceToBook ?? null,
            grossMarginPct: tv?.grossMarginPct ?? null,
            rsi14: tv?.rsi14 ?? null,
            sma50: tv?.sma50 ?? null,
            sma200: tv?.sma200 ?? null,
            perf1W: tv?.perf1W ?? null,
            perf1M: tv?.perf1M ?? null,
            beta1Y: tv?.beta1Y ?? null,
            epsRevisionDir,
            epsRevisionNote,
            newsScore: clampedScore,
          newsBias,
          headlineCount: tvHeadlines.length,
          oneLineTakeaway: sanitizeMacroOutput(String(aiItem?.oneLineTakeaway || defaultTakeaway)),
          plainTextSource: sanitizeMacroOutput(String(aiItem?.plainTextSource || defaultSource)),
          earningsDate: tv?.earningsDate || "N/A (not scheduled)",
          earningsWithinDays,
          catalystWarning: sanitizeMacroOutput(String(aiItem?.catalystWarning || defaultCatalyst)),
          plainEnglishReason: sanitizeMacroOutput(String(aiItem?.plainEnglishReason || fallbackReason)),
          recentHeadlines,
        };
      });

      res.json({
        fetchedAt: new Date().toISOString(),
        stocks: sanitizedStocks,
      });
    } catch (err) {
      console.error("Error in /api/stocks/sentiment:", err);
      const { status, message } = formatGeminiError(err);
      res.status(status).json({ error: message });
    }
  });

  app.get("/api/market/tape", async (_req, res) => {
    try {
      const round2 = (v: unknown): number | null =>
        typeof v === "number" && Number.isFinite(v) ? Number(v.toFixed(2)) : null;

      const [globalResp, usResp] = await Promise.all([
        fetch("https://scanner.tradingview.com/global/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            symbols: { tickers: ["CBOE:VIX", "TVC:VIX", "TVC:US10Y", "TVC:DXY"] },
            columns: ["name", "close", "change", "Perf.W", "Perf.1M"],
          }),
        }),
        fetch("https://scanner.tradingview.com/america/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            symbols: { tickers: ["AMEX:SPY", "AMEX:RSP"] },
            columns: ["name", "close", "change", "Perf.W", "Perf.1M"],
          }),
        }),
      ]);

      const rows = new Map<
        string,
        { last: number | null; changePct: number | null; perf1W: number | null; perf1M: number | null }
      >();

      for (const resp of [globalResp, usResp]) {
        if (!resp.ok) continue;
        const json = (await resp.json()) as { data?: Array<{ s: string; d: unknown[] }> };
        for (const r of json.data ?? []) {
          const d = r.d ?? [];
          rows.set(r.s.toUpperCase(), {
            last: round2(d[1]),
            changePct: round2(d[2]),
            perf1W: round2(d[3]),
            perf1M: round2(d[4]),
          });
        }
      }

      const vixData = rows.get("CBOE:VIX") ?? rows.get("TVC:VIX") ?? { last: null, changePct: null, perf1W: null, perf1M: null };
      const us10yData = rows.get("TVC:US10Y") ?? { last: null, changePct: null, perf1W: null, perf1M: null };
      const dxyData = rows.get("TVC:DXY") ?? { last: null, changePct: null, perf1W: null, perf1M: null };
      const spyData = rows.get("AMEX:SPY") ?? { last: null, changePct: null, perf1W: null, perf1M: null };
      const rspData = rows.get("AMEX:RSP") ?? { last: null, changePct: null, perf1W: null, perf1M: null };

      const breadth1W =
        rspData.perf1W !== null && spyData.perf1W !== null
          ? Number((rspData.perf1W - spyData.perf1W).toFixed(2))
          : null;
      const breadth1M =
        rspData.perf1M !== null && spyData.perf1M !== null
          ? Number((rspData.perf1M - spyData.perf1M).toFixed(2))
          : null;

      let vixRegime: "calm" | "normal" | "elevated" | "stress" | "unknown" = "unknown";
      let vixLabel = "Unavailable";
      if (vixData.last !== null) {
        if (vixData.last < 16) {
          vixRegime = "calm";
          vixLabel = "Calm / Low Vol";
        } else if (vixData.last < 22) {
          vixRegime = "normal";
          vixLabel = "Normal / Balanced";
        } else if (vixData.last < 28) {
          vixRegime = "elevated";
          vixLabel = "Elevated Fear";
        } else {
          vixRegime = "stress";
          vixLabel = "High Stress";
        }
      }

      let breadthLabel = "Neutral";
      if (breadth1W !== null) {
        if (breadth1W >= 0.4) breadthLabel = "Broad Participation";
        else if (breadth1W <= -0.4) breadthLabel = "Narrow / Mega-Cap Led";
        else breadthLabel = "Balanced Breadth";
      }

      res.json({
        fetchedAt: new Date().toISOString(),
        vix: { symbol: "VIX", label: "VIX Fear", ...vixData },
        us10y: { symbol: "US10Y", label: "US 10Y", ...us10yData },
        dxy: { symbol: "DXY", label: "US Dollar", ...dxyData },
        spy: { symbol: "SPY", label: "S&P 500", ...spyData },
        rsp: { symbol: "RSP", label: "Equal-Wt", ...rspData },
        breadth1W,
        breadth1M,
        vixRegime,
        vixLabel,
        breadthLabel,
      });
    } catch (err) {
      console.error("Error in /api/market/tape:", err);
      res.status(502).json({ error: "Unable to fetch live TradingView macro tape." });
    }
  });

  return app;
}

export const app = createApiApp();
export default app;

