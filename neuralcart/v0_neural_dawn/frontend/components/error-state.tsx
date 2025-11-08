type ErrorStateProps = {
  title?: string;
  description?: string;
  debugMessage?: string;
};

export const ErrorState = ({
  title = 'Oops, something got broke. We’re fixing it.',
  description = 'Please refresh once the backend is available.',
  debugMessage
}: ErrorStateProps) => {
  return (
    <div className="rounded-2xl border border-rose-700/40 bg-rose-500/10 p-6 text-center text-sm text-rose-200">
      <p className="text-lg font-semibold text-rose-100">{title}</p>
      <p className="mt-2 text-xs uppercase tracking-widest text-rose-200/80">
        {description}
      </p>
      {process.env.NODE_ENV === 'development' && debugMessage && (
        <pre className="mt-4 overflow-x-auto rounded bg-rose-950/60 p-3 text-left text-[11px] leading-relaxed text-rose-200/80">
          {debugMessage}
        </pre>
      )}
    </div>
  );
};

