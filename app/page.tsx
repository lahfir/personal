"use client";

import { useEffect, useState } from "react";

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

export default function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex h-dvh w-full items-center justify-center">
      <Corner position="tl" />
      <Corner position="tr" />
      <Corner position="bl" />
      <Corner position="br" />

      <main
        className="flex flex-col items-center gap-6 px-8 transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
        }}
      >
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

        <p
          className="mt-4 text-xs tracking-[0.25em] uppercase"
          style={{ color: "var(--fg-dim)" }}
        >
          website underway
        </p>
      </main>
    </div>
  );
}
