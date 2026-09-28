import SentimentField from "@/components/SentimentField";
import Reveal from "@/components/Reveal";

/**
 * One page: the field resolves, then the page stays quiet.
 *
 * Everything below the stage uses the same editorial language — hairlines,
 * tracked capitals, wide measure, no cards — so the calm half reads as the
 * same document rather than a different template bolted on.
 */

const PRACTICE = [
  {
    name: "Audience sentiment analysis",
    body: "Reporting on how a defined audience regards an organisation, a product or a message — and what is moving that view.",
  },
  {
    name: "Culture surveys",
    body: "Measuring how an organisation works from the inside, and where day-to-day experience diverges from what leadership believes is true.",
  },
  {
    name: "Custom data gathering",
    body: "Primary research built around the question at hand, quantitative and qualitative, for the cases where no existing dataset answers it.",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-14 border-b border-[color:var(--hair)] pb-5 text-xs uppercase tracking-[0.2em] text-[color:var(--ink-soft)] md:mb-20">
      {children}
    </p>
  );
}

export default function Home() {
  return (
    <>
      <header className="fixed left-0 top-0 z-20 p-6 text-xs uppercase tracking-[0.18em] md:p-12">
        <a href="#top">SentimentPoint</a>
      </header>

      <main id="top">
        <SentimentField />

        {/* ---- practice ---- */}
        <section className="mx-auto max-w-[1100px] px-6 py-32 md:px-12 md:py-48">
          <SectionLabel>Practice</SectionLabel>
          <div className="grid gap-16 md:grid-cols-3 md:gap-12">
            {PRACTICE.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <h2 className="mb-4 text-xl font-light tracking-tight md:text-2xl">
                  {p.name}
                </h2>
                <p className="text-[color:var(--ink-soft)]">{p.body}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.24}>
            <p className="tbd mt-16 max-w-[52ch] text-sm text-[color:var(--ink-soft)]">
              [These three descriptions are drafts — correct or replace them.]
            </p>
          </Reveal>
        </section>

        {/* ---- selected work ---- */}
        <section className="mx-auto max-w-[1100px] px-6 py-32 md:px-12 md:py-48">
          <SectionLabel>Selected work</SectionLabel>
          <ul className="border-t border-[color:var(--hair)]">
            {[0, 1, 2].map((i) => (
              <li key={i} className="border-b border-[color:var(--hair)]">
                <Reveal delay={i * 0.06}>
                  <div className="grid gap-2 py-8 md:grid-cols-[1fr_2fr] md:gap-12 md:py-10">
                    <p className="tbd font-mono text-xs uppercase tracking-[0.15em] text-[color:var(--ink-soft)]">
                      [Sector / year]
                    </p>
                    <div>
                      <h3 className="tbd text-lg font-light tracking-tight md:text-xl">
                        [Engagement — one line on the question you were asked]
                      </h3>
                      <p className="tbd mt-2 text-[color:var(--ink-soft)]">
                        [One sentence on what the work found, or what changed as
                        a result. Anonymised is fine.]
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        {/* ---- contact ---- */}
        <section
          id="contact"
          className="mx-auto max-w-[1100px] px-6 py-32 md:px-12 md:py-48"
        >
          <SectionLabel>Contact</SectionLabel>
          <Reveal>
            <a
              href="mailto:hello@sentimentpoint.com"
              className="tbd inline-block text-[clamp(1.5rem,5vw,3.25rem)] font-extralight tracking-[-0.03em] transition-opacity hover:opacity-60"
            >
              hello@sentimentpoint.com
            </a>
            <p className="tbd mt-8 max-w-[46ch] text-sm text-[color:var(--ink-soft)]">
              [Confirm this address — it is a guess. Your domain already
              forwards mail through Namecheap.]
            </p>
          </Reveal>
        </section>

        <footer className="mx-auto max-w-[1100px] px-6 pb-16 md:px-12">
          <div className="flex flex-wrap justify-between gap-4 border-t border-[color:var(--hair)] pt-8 text-xs uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">
            <p>&copy; 2026 SentimentPoint</p>
            <p>Clarity from complexity</p>
          </div>
        </footer>
      </main>
    </>
  );
}
