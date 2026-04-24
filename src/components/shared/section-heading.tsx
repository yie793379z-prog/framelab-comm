type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">{eyebrow}</p>
      <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-[1.8rem]">{title}</h2>
      <p className="max-w-3xl text-sm leading-7 text-muted md:text-[0.95rem]">{description}</p>
    </div>
  );
}
