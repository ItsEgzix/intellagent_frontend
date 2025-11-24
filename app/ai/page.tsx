"use client";

export default function AIPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16 text-center">
      <div className="max-w-2xl space-y-6">
        <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
          Intelligent Copilot
        </p>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
          Chat with IntellAgent anywhere on the site
        </h1>
        <p className="text-lg text-muted-foreground">
          The floating chat widget in the lower-right corner is always
          available. Ask for help, request new copy, generate code snippets, or
          brainstorm ideas&mdash;it follows you across every page so you can
          stay in flow.
        </p>
        <div className="rounded-3xl border border-foreground/10 bg-background/50 p-6 text-left shadow-xl backdrop-blur">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            How to use it
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base text-foreground/90">
            <li>Click “Ask AI” on the floating dock to expand the panel.</li>
            <li>Submit a prompt or choose a starter card to begin.</li>
            <li>Use ⌘ + Enter (or Ctrl + Enter) to send messages quickly.</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Pro tip: the widget stays open while you navigate, so you can keep
            the same context as you explore other sections of the site.
          </p>
        </div>
      </div>
    </main>
  );
}
