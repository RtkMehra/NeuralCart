export const SiteFooter = () => (
  <footer className="border-t border-slate-800 bg-slate-950/70">
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
      <p>&copy; {new Date().getFullYear()} NeuralCart. Built for self-hosted commerce.</p>
      <div className="flex gap-4">
        <a
          className="hover:text-primary"
          href="https://grafana.com"
          target="_blank"
          rel="noreferrer"
        >
          Observability
        </a>
        <a className="hover:text-primary" href="https://github.com" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
    </div>
  </footer>
);
