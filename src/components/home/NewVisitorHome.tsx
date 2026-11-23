const GENRES = [
  "Sci-fi epics",
  "Cosy mysteries",
  "Doorstop classics",
  "That poetry book you pretend to understand",
  "Booker longlists",
  "Comfort rereads",
];

export function HeroArt() {
  return (
    <div aria-hidden="true" className="relative hidden h-96 md:block">
      <div className="absolute inset-x-4 top-6 bottom-4 rounded-t-full rounded-b-3xl border-2 border-ink bg-highlight" />
      <FakeCover
        title="Piranesi"
        className="top-28 left-[6%] h-52 w-36 -rotate-12 bg-[#2e5a6b] text-lg"
      />
      <FakeCover
        title="Dune"
        className="top-14 left-[32%] z-10 h-60 w-40 rotate-3 bg-accent text-4xl"
      />
      <FakeCover
        title="The Left Hand of Darkness"
        className="top-32 left-[60%] h-52 w-34 rotate-[14deg] bg-[#3f5d4a] text-base"
      />
      <div className="absolute top-0 right-0 z-20 grid size-28 rotate-12 place-items-center rounded-full border-2 border-ink bg-page text-center font-display leading-tight font-extrabold">
        No sign-up.
        <br />
        Zero drama.
      </div>
    </div>
  );
}

function FakeCover({ title, className }: { title: string; className: string }) {
  return (
    <div
      className={`absolute flex items-end rounded-md border-2 border-ink p-3 font-display leading-none font-extrabold text-white shadow-pop ${className}`}
    >
      {title}
    </div>
  );
}

export function NewVisitorSections() {
  return (
    <div className="space-y-20">
      <div aria-hidden="true" className="overflow-hidden py-4">
        <p className="-mx-8 -rotate-[1.5deg] overflow-hidden bg-ink py-3 font-display text-xl font-bold whitespace-nowrap text-page">
          {GENRES.map((genre) => (
            <span key={genre}>
              {genre} <span className="px-2 text-highlight">●</span>
            </span>
          ))}
        </p>
      </div>

      <section className="space-y-7">
        <h2 className="font-display text-4xl leading-none font-extrabold tracking-tight sm:text-5xl">
          Three steps. <span className="text-accent">No homework.</span>
        </h2>
        <ol className="grid gap-6 md:grid-cols-3">
          <li className="-rotate-1 space-y-3 rounded-2xl border-2 border-ink bg-surface p-6 shadow-pop">
            <StepNumber className="text-accent">1</StepNumber>
            <h3 className="font-display text-2xl font-bold">Hunt it down</h3>
            <p className="text-muted">
              Search millions of books from Open Library. Covers, blurbs, the
              lot.
            </p>
          </li>
          <li className="rotate-1 space-y-3 rounded-2xl border-2 border-ink bg-calm p-6 shadow-pop">
            <StepNumber>2</StepNumber>
            <h3 className="font-display text-2xl font-bold">Shelve it</h3>
            <p>
              Want to read, Reading, Read. Move it along, then give it the stars
              it deserves.
            </p>
          </li>
          <li className="-rotate-[0.6deg] space-y-3 rounded-2xl border-2 border-ink bg-ink p-6 text-page shadow-pop-accent">
            <StepNumber className="text-highlight">3</StepNumber>
            <h3 className="font-display text-2xl font-bold">
              Admire your stats
            </h3>
            <p className="text-line">
              Books per month, pages turned, your most-read author. Bragging
              rights, fully calculated.
            </p>
          </li>
        </ol>
      </section>

      <section className="flex flex-wrap items-center gap-5 rounded-3xl border-2 border-ink bg-highlight p-7 shadow-pop">
        <LockIcon />
        <div className="min-w-0 flex-1 basis-80 space-y-1">
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            What happens on your shelf, stays on your shelf.
          </h2>
          <p>
            Everything lives in your browser. No account, no server, nobody
            judging your guilty-pleasure romance phase.
          </p>
        </div>
      </section>
    </div>
  );
}

function StepNumber({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`block font-display text-6xl leading-none font-extrabold ${className}`}
    >
      {children}
    </span>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
