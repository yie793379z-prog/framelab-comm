type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-line bg-[#fffdf8] p-6">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">{description}</p>
    </div>
  );
}
