"use client";

import { useEffect, useRef, useState } from "react";

interface Item {
  name: string;
  desc: string;
  tech: string;
  url?: string;
}

interface Section {
  title: string;
  items: Item[];
}

const SECTIONS: Section[] = [
  {
    title: "ventures",
    items: [
      {
        name: "Algominds",
        desc: "Multi-agent AI system for autonomous signal discovery and trade execution",
        tech: "CTO",
        url: "https://algominds.ai",
      },
      {
        name: "Gainz.ai",
        desc: "AI workout platform where users train alongside athletes like Jimmy Butler and Beneil Dariush",
        tech: "Co-Founder & CTO",
        url: "https://gainz.ai",
      },
    ],
  },
  {
    title: "clients",
    items: [
      {
        name: "Alo Yoga",
        desc: "AI-powered virtual try-on and size-matching prototype targeting $180M/yr in return reduction",
        tech: "Computer Vision",
      },
      {
        name: "Juventus FC",
        desc: "AI try-on agent and image-to-3D kit visualization for internal design workflows",
        tech: "Generative AI",
      },
      {
        name: "BigFace",
        desc: "Suite of AI prototypes for Jimmy Butler's premium coffee brand",
        tech: "Applied AI",
      },
      {
        name: "Noro Securities",
        desc: "AI infrastructure and solutions for Noro and their Fortune 100 clients",
        tech: "Ongoing",
      },
    ],
  },
  {
    title: "experience",
    items: [
      {
        name: "IBM Research",
        desc: "Built a CNN-based wildfire prediction and triage system achieving 94% accuracy with production-ready data pipelines",
        tech: "Research Intern",
      },
      {
        name: "Dept. of Science & Technology, Govt. of India",
        desc: "Developed a novel animal intrusion detection system using YOLOv5 and Siamese neural networks for edge deployment",
        tech: "Research Intern",
      },
    ],
  },
  {
    title: "projects",
    items: [
      {
        name: "agent-desktop",
        desc: "Desktop automation CLI for AI agents via OS accessibility trees",
        tech: "Rust",
        url: "https://github.com/lahfir/agent-desktop",
      },
      {
        name: "soham",
        desc: "Real-time desktop activity tracker with live analytics",
        tech: "Tauri / React / Rust",
        url: "https://github.com/lahfir/soham",
      },
      {
        name: "snowden",
        desc: "Export conversations from Claude, ChatGPT and Grok",
        tech: "JavaScript",
        url: "https://github.com/lahfir/snowden",
      },
      {
        name: "cracked-agent",
        desc: "Autonomous browser automation powered by LLMs",
        tech: "TypeScript",
        url: "https://github.com/lahfir/cracked-agent",
      },
      {
        name: "commit-blog",
        desc: "Generate blog posts from git commits using LLMs",
        tech: "TypeScript",
        url: "https://github.com/lahfir/commit-blog",
      },
      {
        name: "twilio-realtime-translation",
        desc: "Bidirectional real-time translated phone calls",
        tech: "Python / FastAPI",
        url: "https://github.com/lahfir/twilio-bidirectional-realtime-translation",
      },
      {
        name: "d-id-nextjs",
        desc: "Live AI avatar streaming with voice and GPT-4o",
        tech: "Next.js / TypeScript",
        url: "https://github.com/lahfir/d-id-nextjs",
      },
    ],
  },
];

function Row({ item, delay }: { item: Item; delay: number }) {
  const ref = useRef<HTMLElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setShow(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const Tag = item.url ? "a" : "div";
  const linkProps = item.url
    ? { href: item.url, target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <Tag
      ref={ref as React.Ref<HTMLAnchorElement & HTMLDivElement>}
      {...linkProps}
      className="group"
      style={{
        display: "block",
        padding: "14px 0",
        borderBottom: "1px solid var(--fg-dim)",
        opacity: show ? 1 : 0,
        transition: `opacity 0.4s ease ${delay}ms`,
        textDecoration: "none",
        cursor: item.url ? "pointer" : "default",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: "16px",
        }}
      >
        <span
          className={
            item.url
              ? "transition-colors duration-200 group-hover:text-white"
              : ""
          }
          style={{
            color: "var(--fg-bright)",
            fontSize: "13px",
            letterSpacing: "0.04em",
          }}
        >
          {item.name}
        </span>
        <span
          style={{
            color: "var(--fg-dim)",
            fontSize: "10px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            flexShrink: 0,
          }}
        >
          {item.tech}
        </span>
      </div>
      <p
        style={{
          color: "var(--fg)",
          fontSize: "12px",
          marginTop: "4px",
          lineHeight: 1.5,
        }}
      >
        {item.desc}
      </p>
    </Tag>
  );
}

export default function Projects() {
  let globalIndex = 0;

  return (
    <div style={{ paddingBottom: "120px" }}>
      {SECTIONS.map((section, si) => (
        <section key={section.title} style={{ marginTop: si > 0 ? "48px" : 0 }}>
          <h2
            style={{
              color: "var(--fg-dim)",
              fontSize: "11px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            {section.title}
          </h2>

          <div>
            {section.items.map((item) => {
              const delay = globalIndex * 40;
              globalIndex++;
              return <Row key={item.name} item={item} delay={delay} />;
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
