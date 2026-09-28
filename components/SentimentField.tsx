"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Phrase from "./Phrase";
import { DOTS, MARKS, PHRASES } from "@/lib/phrases";

/** Vertical spacing once a cluster aligns, and in the final stack. */
const CLUSTER_GAP_VH = 4.8;
const FINAL_GAP_VH = 6;

function useMedia(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const on = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return matches;
}

/**
 * The pinned stage: chaos resolving into one idea.
 *
 * Scroll drives a single progress value. Every phrase derives its own
 * position, rotation and opacity from it through motion values, which write
 * straight to the DOM — no React render happens while scrolling, which is the
 * difference between this holding 60fps and collapsing under 25 elements.
 */
export default function SentimentField() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = !!useReducedMotion();
  const isSmall = useMedia("(max-width: 767px)");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // The whole chaos-to-clarity arc now runs in the first 78% of the pinned
  // range. The remaining 22% is dead air by design: the resolution holds,
  // still and complete, before the stage unpins. Without this the headline
  // arrived at the very last frame and scrolled straight off.
  const arc = useTransform(scrollYProgress, [0, 0.78], [0, 1], { clamp: true });

  const phrases = useMemo(
    () => (isSmall ? PHRASES.filter((p) => p.mobile) : PHRASES),
    [isSmall],
  );

  // Slot offsets: where each phrase sits once its cluster aligns, and where
  // the three survivors settle before the headline takes their place.
  const { slots, finals } = useMemo(() => {
    const slots = new Map<string, number>();
    const finals = new Map<string, number>();
    for (const c of [0, 1, 2] as const) {
      const members = phrases
        .filter((p) => p.cluster === c)
        .sort((a, b) => a.order - b.order);
      members.forEach((p, i) => {
        slots.set(p.text, (i - (members.length - 1) / 2) * CLUSTER_GAP_VH);
      });
    }
    const survivors = phrases.filter((p) => p.survivor);
    survivors.forEach((p, i) => {
      finals.set(p.text, (i - (survivors.length - 1) / 2) * FINAL_GAP_VH);
    });
    return { slots, finals };
  }, [phrases]);

  // Drift amplitude: full at rest, gone by the time clusters form.
  const amp = useTransform(arc, [0.12, 0.5], [1, 0]);
  // The unfinished diagram fades before the clusters do.
  const marks = useTransform(arc, [0.08, 0.34], [1, 0]);
  // The resolution rises into the space the last three words vacate.
  const heroOpacity = useTransform(arc, [0.86, 0.99], [0, 1]);
  const heroY = useTransform(arc, [0.86, 1], reduced ? [0, 0] : [18, 0]);

  const stageVh = isSmall ? 280 : 360;

  return (
    <section
      ref={ref}
      style={{ height: `${stageVh}vh` }}
      aria-labelledby="clarity-heading"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Understated information-design marks: a diagram drawn before
            anyone knew what it was of. */}
        <motion.svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ opacity: marks }}
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          {MARKS.map((m, i) => (
            <line
              key={i}
              x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2}
              stroke="var(--hair)"
              strokeWidth={0.08}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {DOTS.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={0.18} fill="var(--hair-strong)" />
          ))}
        </motion.svg>

        {phrases.map((p, i) => (
          <Phrase
            key={p.text}
            data={p}
            index={i}
            progress={arc}
            slotVh={slots.get(p.text) ?? 0}
            finalVh={finals.get(p.text) ?? 0}
            amp={amp}
            reduced={reduced}
          />
        ))}

        {/* The resolution. Lives inside the stage so it occupies exactly the
            space the noise cleared, then scrolls away with it. */}
        <motion.div
          className="absolute inset-0 flex items-center"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <div className="mx-auto w-full max-w-[1100px] px-6 md:px-12">
            <h1
              id="clarity-heading"
              className="max-w-[16ch] text-[clamp(2.75rem,8.5vw,7.5rem)] font-extralight leading-[0.95] tracking-[-0.035em]"
            >
              Clarity from complexity.
            </h1>
            <p className="mt-8 max-w-[46ch] text-[color:var(--ink-soft)] md:mt-10 md:text-lg">
              We listen at scale, then tell you what it means — sentiment,
              culture and custom research for life science organisations.
            </p>
            <a
              href="#contact"
              className="mt-10 inline-block border-b border-[color:var(--ink)] pb-1 text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-60 md:mt-12"
            >
              Start a conversation
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
