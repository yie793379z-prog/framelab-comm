import type { AnalysisTemplate } from "@/types/template";

type TemplateSummaryCardProps = {
  template: AnalysisTemplate;
};

export function TemplateSummaryCard({ template }: TemplateSummaryCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-line bg-white p-6 shadow-soft">
      <div className="space-y-3">
        <h3 className="text-xl font-semibold tracking-tight text-ink">{template.name}</h3>
        <p className="text-sm leading-7 text-muted">{template.shortDescription}</p>
        <p className="text-sm text-ink">
          <span className="font-medium">Use case:</span> {template.researchUseCase}
        </p>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {template.fields.map((field) => (
          <span key={field.id} className="rounded-full border border-line bg-[#fffdf8] px-3 py-1 text-xs text-muted">
            {field.label}
          </span>
        ))}
      </div>
    </article>
  );
}
