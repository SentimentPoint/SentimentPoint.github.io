"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { CLUSTERS, PLANES, type Phrase as PhraseData } from "@/lib/phrases";

/**
 * One voice in the field.
 *
 * Three nested elements, each owning exactly one job, so nothing fights over
 * the same CSS property:
 *
 *   outer  motion.div  scroll-driven position, rotation, opacity  (transform/opacity only)
 *   middle div         continuous drift, a CSS keyframe animation (its own transform)
 *   inner  span        type: size, tone, and a static blur on the far planes
 *
 * The blur is never animated. Every blurred phrase lives on a far plane and
 * has faded out well before the page resolves, so the field reads as coming
 * into focus without a single frame of filter animation.
 */

interface Props {
  data: PhraseData;
  /** 0 → 1 across the pinned stage. */
  progress: MotionValue<number>;
  /** Vertical offset within its cluster, in vh. */
  slotVh: number;
  /** Vertical offset in the final three-word stack, in vh. Survivors only. */
  finalVh: number;
  /** Drives the drift amplitude, 1 → 0 as structure emerges. */
  amp: MotionValue<number>;
  index: number;
  reduced: boolean;
}

export default function Phrase({
  data, progress, slotVh, finalVh, amp, index, reduced,
}: Props) {
  const plane = PLANES[data.plane];
  const cluster = CLUSTERS[data.cluster];

  // Offsets are measured from the centre of the stage, which is where the
  // element is anchored, so every journey is expressed in one coordinate space.
  const fromX = data.x - 50;
  const fromY = data.y - 50;
  const toX = cluster.x - 50;
  const toY = cluster.y - 50 + slotVh;
  const endX = 0;
  const endY = finalVh;

  // A touch of depth on the first scroll: nearer planes lift further.
  const lift = 3 * plane.parallax;

  const x = useTransform(
    progress,
    [0, 0.18, 0.48, 0.62, 0.88],
    reduced
      ? [fromX, fromX, fromX, fromX, fromX]
      : [fromX, fromX, toX, toX, endX],
  );

  const y = useTransform(
    progress,
    [0, 0.18, 0.48, 0.62, 0.88],
    reduced
      ? [fromY, fromY, fromY, fromY, fromY]
      : [fromY, fromY - lift, toY, toY, endY],
  );

  const rotate = useTransform(
    progress,
    [0.18, 0.45],
    reduced ? [0, 0] : [data.rot, 0],
  );

  // Phrases brighten slightly as they become legible, then leave. Survivors
  // come all the way up to full strength before dissolving into the headline.
  const peak = data.survivor ? 1 : Math.min(1, plane.opacity + 0.18);
  // The fade must start after the phrases have become legible (0.45) and
  // before they leave. Clamping keeps the range monotonic: Framer Motion
  // interpolates to NaN on a range that goes backwards, and the earliest
  // exits (0.50) would otherwise put the fade start at 0.40.
  const fadeStart = Math.max(0.46, Math.min(data.exitAt - 0.02, data.exitAt - 0.1));
  const opacity = useTransform(
    progress,
    [0, 0.06, 0.45, fadeStart, data.exitAt],
    [plane.opacity, plane.opacity, peak, peak, 0],
  );

  const xv = useTransform(x, (v) => `${v}vw`);
  const yv = useTransform(y, (v) => `${v}vh`);

  return (
    <motion.div
      aria-hidden="true"
      className="absolute left-1/2 top-1/2"
      style={{
        // `translate` is a separate CSS property from `transform`, so the
        // centring never collides with Framer Motion's x/y.
        translate: "-50% -50%",
        x: xv,
        y: yv,
        rotate,
        opacity,
        ["--amp" as string]: amp,
      }}
    >
      <div
        className={reduced ? undefined : "sp-drift"}
        style={
          reduced
            ? undefined
            : {
                animationDuration: `${14 + (index % 7) * 2.5}s`,
                animationDelay: `-${(index % 11) * 1.3}s`,
                animationDirection: index % 2 ? "alternate-reverse" : "alternate",
              }
        }
      >
        <span
          className={data.mono ? "font-mono tracking-tight" : "tracking-tight"}
          style={{
            fontSize: `${plane.size}px`,
            fontWeight: data.plane >= 3 ? 300 : 400,
            color: "var(--ink)",
            filter: plane.blur ? `blur(${plane.blur}px)` : undefined,
            whiteSpace: "nowrap",
            display: "block",
          }}
        >
          {data.text}
        </span>
      </div>
    </motion.div>
  );
}
