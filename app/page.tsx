"use client";

import { useEffect, useState } from "react";
import Projects from "./components/projects";

export default function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "540px",
        margin: "0 auto",
        padding: "120px 24px 0",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      <header>
        <h1
          style={{
            color: "var(--fg-bright)",
            fontSize: "24px",
            letterSpacing: "0.03em",
          }}
        >
          lahfir
          <span
            style={{
              display: "inline-block",
              width: "2px",
              height: "1.1em",
              backgroundColor: "var(--accent)",
              marginLeft: "2px",
              verticalAlign: "text-bottom",
              animation: "blink 1s step-end infinite",
            }}
          />
        </h1>

        <p
          style={{
            color: "var(--fg-dim)",
            fontSize: "11px",
            marginTop: "6px",
            letterSpacing: "0.15em",
          }}
        >
          M.S. Software Engineering
        </p>

        <p
          style={{
            color: "var(--fg)",
            fontSize: "14px",
            marginTop: "16px",
            lineHeight: 1.6,
            letterSpacing: "0.02em",
          }}
        >
          Computer use, applied AI, multi-agent systems, and the harnesses that
          make them reliable. Currently CTO at Algominds.
        </p>

        <nav
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {[
            { label: "github", href: "https://github.com/lahfir" },
            { label: "x", href: "https://x.com/Laughfir" },
            { label: "linkedin", href: "https://linkedin.com/in/lahfir" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200 hover:text-white"
              style={{
                color: "var(--fg-dim)",
                fontSize: "11px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <div
        style={{
          height: "1px",
          backgroundColor: "var(--fg-dim)",
          margin: "48px 0",
        }}
      />

      <Projects />
    </div>
  );
}
