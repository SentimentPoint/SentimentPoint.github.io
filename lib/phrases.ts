/**
 * The sentiment field.
 *
 * Every position here is chosen, not generated. The field is denser at the
 * left and right thirds and deliberately thinner through the horizontal band
 * where the headline eventually arrives, so the resolution lands in space that
 * was quietly reserved for it from the first frame.
 *
 * `plane` is depth: 0 is furthest (small, pale, softly blurred, moves least),
 * 3 is nearest (large, dark, sharp, moves most). Size/opacity/blur/parallax
 * all derive from it, so depth reads as one coherent property.
 *
 * `cluster` is where a phrase migrates to as structure emerges — the three
 * latent groups in the noise. Each cluster keeps one single-word survivor,
 * which is the idea the others were circling.
 */

export type Plane = 0 | 1 | 2 | 3;
export type Cluster = 0 | 1 | 2;

export interface Phrase {
  /** The words themselves. */
  text: string;
  /** Starting position, viewport percentages. */
  x: number;
  y: number;
  /** Depth plane. */
  plane: Plane;
  /** Resting rotation in degrees; eases to 0 as structure emerges. */
  rot: number;
  /** Which latent group this phrase belongs to. */
  cluster: Cluster;
  /** Vertical order once the cluster aligns. */
  order: number;
  /** Scroll progress (0-1) at which this phrase finishes fading out. */
  exitAt: number;
  /** Set on the fragments that read as instrument readings rather than speech. */
  mono?: boolean;
  /** The one idea each cluster resolves into. Last to leave. */
  survivor?: boolean;
  /** Kept on small screens, where the field thins to 14 phrases. */
  mobile?: boolean;
}

export const PLANES = {
  0: { size: 13, opacity: 0.3, blur: 2.4, parallax: 0.22 },
  1: { size: 17, opacity: 0.46, blur: 1.1, parallax: 0.5 },
  2: { size: 22, opacity: 0.68, blur: 0, parallax: 0.78 },
  3: { size: 31, opacity: 0.92, blur: 0, parallax: 1.06 },
} as const;

/** Where each cluster gathers, in viewport percentages. */
export const CLUSTERS: Record<Cluster, { x: number; y: number }> = {
  0: { x: 22, y: 46 },
  1: { x: 50, y: 50 },
  2: { x: 78, y: 46 },
};

export const PHRASES: Phrase[] = [
  // ---- far plane: barely there, cropped at the edges -----------------------
  { text: "too many inputs",                  x: 5,  y: 18, plane: 0, rot: -2, cluster: 1, order: 0, exitAt: 0.50, mono: true },
  { text: "reduce complexity",                x: 87, y: 26, plane: 0, rot: 3,  cluster: 1, order: 1, exitAt: 0.52, mono: true },
  { text: "this feels fragmented",            x: 11, y: 73, plane: 0, rot: 2,  cluster: 1, order: 2, exitAt: 0.54 },
  { text: "what are people actually saying?", x: 69, y: 87, plane: 0, rot: -1, cluster: 0, order: 0, exitAt: 0.56, mobile: true },
  { text: "signal vs noise",                  x: 47, y: 11, plane: 0, rot: 1,  cluster: 2, order: 0, exitAt: 0.58, mono: true, mobile: true },
  { text: "make sense of this",               x: 92, y: 63, plane: 0, rot: -3, cluster: 0, order: 1, exitAt: 0.55 },
  { text: "not aligned",                      x: 29, y: 93, plane: 0, rot: 2,  cluster: 1, order: 3, exitAt: 0.57 },

  // ---- mid plane ----------------------------------------------------------
  { text: "where do we start?",               x: 17, y: 34, plane: 1, rot: -3, cluster: 0, order: 2, exitAt: 0.62, mobile: true },
  { text: "something feels off",              x: 76, y: 44, plane: 1, rot: 2,  cluster: 1, order: 4, exitAt: 0.64, mobile: true },
  { text: "too many moving parts",            x: 57, y: 23, plane: 1, rot: -1, cluster: 1, order: 5, exitAt: 0.66, mobile: true },
  { text: "what's the real problem?",         x: 35, y: 81, plane: 1, rot: 3,  cluster: 2, order: 1, exitAt: 0.63, mobile: true },
  { text: "find the pattern",                 x: 84, y: 75, plane: 1, rot: -2, cluster: 2, order: 2, exitAt: 0.65, mono: true },
  { text: "overwhelmed",                      x: 7,  y: 55, plane: 1, rot: 1,  cluster: 0, order: 3, exitAt: 0.61, mobile: true },
  { text: "what are we missing?",             x: 64, y: 67, plane: 1, rot: -2, cluster: 0, order: 4, exitAt: 0.67, mobile: true },

  // ---- near-mid plane -----------------------------------------------------
  { text: "not clear",                        x: 28, y: 20, plane: 2, rot: 2,  cluster: 0, order: 5, exitAt: 0.72, mobile: true },
  { text: "this doesn't connect",             x: 52, y: 79, plane: 2, rot: -2, cluster: 1, order: 6, exitAt: 0.74, mobile: true },
  { text: "what should we focus on?",         x: 72, y: 32, plane: 2, rot: 1,  cluster: 2, order: 3, exitAt: 0.76, mobile: true },
  { text: "make it simpler",                  x: 15, y: 62, plane: 2, rot: -1, cluster: 2, order: 4, exitAt: 0.73 },
  { text: "too much",                         x: 43, y: 45, plane: 2, rot: 3,  cluster: 1, order: 7, exitAt: 0.75, mobile: true },
  { text: "we need direction",                x: 80, y: 57, plane: 2, rot: -3, cluster: 2, order: 5, exitAt: 0.78, mobile: true },

  // ---- near plane: the loudest voices, and the three quiet ones ----------
  { text: "I need clarity",                   x: 23, y: 49, plane: 3, rot: -2, cluster: 2, order: 6, exitAt: 0.80 },
  { text: "what matters?",                    x: 61, y: 53, plane: 3, rot: 2,  cluster: 2, order: 7, exitAt: 0.82, mobile: true },

  { text: "understanding",                    x: 66, y: 40, plane: 3, rot: 0,  cluster: 0, order: 6, exitAt: 0.96, survivor: true, mobile: true },
  { text: "alignment",                        x: 34, y: 38, plane: 3, rot: 0,  cluster: 1, order: 8, exitAt: 0.96, survivor: true, mobile: true },
  { text: "clarity",                          x: 46, y: 63, plane: 3, rot: 0,  cluster: 2, order: 8, exitAt: 0.96, survivor: true, mobile: true },
];

/** Hairlines and dots: an unfinished diagram, drawn before anyone found the pattern. */
export const MARKS = [
  { x1: 8,  y1: 30, x2: 26, y2: 30 },
  { x1: 74, y1: 68, x2: 91, y2: 68 },
  { x1: 40, y1: 16, x2: 40, y2: 29 },
  { x1: 58, y1: 72, x2: 58, y2: 84 },
];

export const DOTS = [
  { x: 26, y: 30 }, { x: 74, y: 68 }, { x: 40, y: 29 },
  { x: 58, y: 72 }, { x: 13, y: 84 }, { x: 88, y: 15 },
];
