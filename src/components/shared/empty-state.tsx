type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="surface-muted p-6 md:p-7">
      <div className="flex items-start gap-4">
        <div className="mt-1 h-3 w-3 rounded-full bg-accent/70" aria-hidden="true" />
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-ink">{title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">{description}</p>
        </div>
      </div>
    </div>
  );
}
