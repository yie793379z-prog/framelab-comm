type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">{eyebrow}</p>
      <h2 className="text-2xl font-semibold tracking-tight text-ink">{title}</h2>
      <p className="max-w-3xl text-sm leading-7 text-muted">{description}</p>
    </div>
  );
}
