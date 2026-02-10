"use client";

import { useEffect, useMemo, useState } from "react";

function Corner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const base = "absolute w-5 h-5 pointer-events-none";
  const border = "border-[var(--fg-dim)]";
  const styles: Record<string, string> = {
    tl: `${base} top-6 left-6 border-t border-l ${border}`,
    tr: `${base} top-6 right-6 border-t border-r ${border}`,
    bl: `${base} bottom-6 left-6 border-b border-l ${border}`,
    br: `${base} bottom-6 right-6 border-b border-r ${border}`,
  };
  return <div className={styles[position]} />;
}

interface Pred {
  word: string;
  prob: number;
  fill: number;
}

interface Example {
  prompt: string;
  tokens: string[];
  preds: Pred[];
}

const EMPTY_EXAMPLE: Example = { prompt: "", tokens: [], preds: [] };

const EXAMPLES: Example[] = [
  {
    prompt: "Built GTM signal product to",
    tokens: ["Built", "GTM", "signal", "product", "to"],
    preds: [
      { word: "$1M+ ARR", prob: 0.81, fill: 15 },
      { word: "scale", prob: 0.10, fill: 2 },
      { word: "fast", prob: 0.06, fill: 1 },
      { word: "wins", prob: 0.02, fill: 1 },
    ],
  },
  {
    prompt: "Scaled platform to 10K users",
    tokens: ["Scaled", "platform", "to", "10K", "users"],
    preds: [
      { word: "300ms", prob: 0.67, fill: 12 },
      { word: "50RPS", prob: 0.18, fill: 3 },
      { word: "cache", prob: 0.10, fill: 2 },
      { word: "queue", prob: 0.04, fill: 1 },
    ],
  },
  {
    prompt: "Maintained uptime on Docker ECS",
    tokens: ["Maintained", "uptime", "on", "Docker", "ECS"],
    preds: [
      { word: "99.9%", prob: 0.74, fill: 14 },
      { word: "alert", prob: 0.14, fill: 3 },
      { word: "logs", prob: 0.08, fill: 2 },
      { word: "sleep", prob: 0.03, fill: 1 },
    ],
  },
  {
    prompt: "Shipped React Native app to",
    tokens: ["Shipped", "React", "Native", "app", "to"],
    preds: [
      { word: "2Kuse", prob: 0.68, fill: 12 },
      { word: "4.5*", prob: 0.19, fill: 3 },
      { word: "stripe", prob: 0.09, fill: 2 },
      { word: "push", prob: 0.03, fill: 1 },
    ],
  },
  {
    prompt: "Built wildfire prediction model at",
    tokens: ["Built", "wildfire", "prediction", "model", "at"],
    preds: [
      { word: "94acc", prob: 0.70, fill: 13 },
      { word: "ibm", prob: 0.16, fill: 3 },
      { word: "cnn", prob: 0.10, fill: 2 },
      { word: "pipes", prob: 0.03, fill: 1 },
    ],
  },
  {
    prompt: "Built AI agents that click through",
    tokens: ["Built", "AI", "agents", "that", "click"],
    preds: [
      { word: "pilot", prob: 0.73, fill: 14 },
      { word: "99%+", prob: 0.13, fill: 3 },
      { word: "safe", prob: 0.10, fill: 2 },
      { word: "ship", prob: 0.03, fill: 1 },
    ],
  },
];

const W = 44;
const BAR = 18;
const PRED_WORD_WIDTH = 5;
const TRANSITION_STEPS = 14;
const TRANSITION_MS = 45;
const HOLD_MS = 2300;
const SCRAMBLE_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function normalizeIndex(i: number, count: number): number {
  if (count === 0) return 0;
  return ((i % count) + count) % count;
}

function easeOutCubic(t: number): number {
  const x = clamp01(t);
  return 1 - (1 - x) ** 3;
}

function pseudo(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453123;
  return x - Math.floor(x);
}

function scrambleAt(seed: number): string {
  const i = Math.floor(pseudo(seed) * SCRAMBLE_CHARS.length);
  return SCRAMBLE_CHARS[i] ?? "x";
}

function morphWord(from: string, to: string, t: number, seed: number): string {
  const eased = easeOutCubic(t);
  const max = Math.max(from.length, to.length);
  const a = from.padEnd(max, " ");
  const b = to.padEnd(max, " ");
  const keep = Math.floor(max * eased);
  const scramblePhase = eased < 0.9;

  let out = "";
  for (let i = 0; i < max; i++) {
    if (i < keep) {
      out += b[i];
      continue;
    }
    if (scramblePhase && b[i] !== " ") {
      out += scrambleAt(seed + i + Math.floor(eased * 100));
      continue;
    }
    out += a[i];
  }

  return out.trimEnd();
}

function morphNumber(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

function morphExample(from: Example, to: Example, t: number): Example {
  const baseT = clamp01(t);
  const tokenCount = Math.max(from.tokens.length, to.tokens.length);
  const predCount = Math.max(from.preds.length, to.preds.length);

  return {
    prompt: morphWord(from.prompt, to.prompt, baseT, 11),
    tokens: Array.from({ length: tokenCount }, (_, i) =>
      morphWord(
        from.tokens[i] ?? "",
        to.tokens[i] ?? "",
        clamp01((baseT - i * 0.08) / 0.76),
        101 + i * 31,
      ),
    ).filter(Boolean),
    preds: Array.from({ length: predCount }, (_, i) => {
      const a = from.preds[i] ?? { word: "", prob: 0, fill: 0 };
      const b = to.preds[i] ?? { word: "", prob: 0, fill: 0 };
      const predT = clamp01((baseT - (0.2 + i * 0.08)) / 0.72);
      return {
        word: morphWord(a.word, b.word, predT, 1001 + i * 53),
        prob: morphNumber(a.prob, b.prob, easeOutCubic(predT)),
        fill: Math.round(morphNumber(a.fill, b.fill, easeOutCubic(predT))),
      };
    }),
  };
}

function build(ex: Example): string[] {
  const centerLine = (line: string) =>
    `${" ".repeat(Math.max(0, Math.floor((W - line.length) / 2)))}${line}`;

  const pStr = `"${ex.prompt} ___"`;
  const pPad = Math.max(0, Math.floor((W - pStr.length) / 2));

  const tStr = ex.tokens.map((t) => `[${t}]`).join(" ");
  const tPad = Math.max(0, Math.floor((W - tStr.length) / 2));

  const centers: number[] = [];
  let cur = tPad;
  for (const t of ex.tokens) {
    const len = t.length + 2;
    centers.push(cur + Math.floor(len / 2));
    cur += len + 1;
  }

  const markers = (ch: string) => {
    const a = Array(W).fill(" ");
    centers.forEach((c) => {
      if (c < W) a[c] = ch;
    });
    return a.join("");
  };

  const inner = "self-attention  × 96";
  const ip = Math.floor((W - 2 - inner.length) / 2);

  const preds = ex.preds.map((p, i) => {
    const pre = i === 0 ? "▸" : " ";
    const w = p.word.slice(0, PRED_WORD_WIDTH).padEnd(PRED_WORD_WIDTH);
    const b = "█".repeat(p.fill) + "░".repeat(BAR - p.fill);
    const pr = p.prob.toFixed(2).slice(1);
    return centerLine(` ${pre} ${w} ${b} ${pr}`);
  });

  return [
    " ".repeat(pPad) + pStr,
    " ",
    " ".repeat(tPad) + tStr,
    markers("│"),
    markers("▼"),
    "╔" + "═".repeat(W - 2) + "╗",
    "║" + " ".repeat(ip) + inner + " ".repeat(W - 2 - ip - inner.length) + "║",
    "╚" + "═".repeat(W - 2) + "╝",
    " ".repeat(Math.floor(W / 2)) + "│",
    ...preds,
  ].map((l) => l.padEnd(W));
}

export default function Home() {
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(0);
  const [step, setStep] = useState(TRANSITION_STEPS);
  const [visible, setVisible] = useState(false);
  const count = EXAMPLES.length;

  const t = step / TRANSITION_STEPS;
  const fromExample = EXAMPLES[normalizeIndex(fromIdx, count)] ?? EMPTY_EXAMPLE;
  const toExample = EXAMPLES[normalizeIndex(toIdx, count)] ?? EMPTY_EXAMPLE;
  const current = useMemo(
    () => morphExample(fromExample, toExample, t),
    [fromExample, toExample, t],
  );
  const lines = useMemo(() => build(current), [current]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (count === 0) return;

    const timer = setTimeout(() => {
      if (step < TRANSITION_STEPS) {
        setStep((s) => Math.min(s + 1, TRANSITION_STEPS));
        return;
      }

      const normalizedTo = normalizeIndex(toIdx, count);
      const next = (normalizedTo + 1) % count;
      setFromIdx(normalizedTo);
      setToIdx(next);
      setStep(0);
    }, step < TRANSITION_STEPS ? TRANSITION_MS : HOLD_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [count, step, toIdx]);

  return (
    <div className="relative flex h-dvh w-full items-center justify-center">
      <Corner position="tl" />
      <Corner position="tr" />
      <Corner position="bl" />
      <Corner position="br" />

      <main
        className="flex flex-col items-center gap-8 px-4 transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
        }}
      >
        <pre
          className="text-[10px] leading-relaxed sm:text-xs select-none"
          style={{ color: "var(--fg-dim)" }}
        >
          {lines.join("\n")}
        </pre>

        <div className="flex flex-col items-center gap-3 text-center">
          <h1
            className="text-2xl tracking-wide sm:text-3xl"
            style={{ color: "var(--fg-bright)" }}
          >
            Hey, I&apos;m lahfir
            <span
              className="ml-0.5 inline-block w-[2px] h-[1.1em] align-text-bottom"
              style={{
                backgroundColor: "var(--accent)",
                animation: "blink 1s step-end infinite",
              }}
            />
          </h1>

          <div
            className="h-px w-16"
            style={{ backgroundColor: "var(--fg-dim)" }}
          />

          <p
            className="text-sm tracking-wider sm:text-base"
            style={{ color: "var(--fg)" }}
          >
            Research in AI, Computer Use and SWE
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <a
            href="https://www.github.com/lahfir"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-[0.25em] uppercase transition-colors duration-300 hover:text-white"
            style={{ color: "var(--fg-dim)" }}
          >
            github
          </a>

          <p
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: "var(--fg-dim)" }}
          >
            website underway
          </p>
        </div>
      </main>
    </div>
  );
}
