"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { useWorkspace } from "@/features/coding/state/workspace-context";

export function ExportPanel() {
  const { state } = useWorkspace();

  if (!state.samples.length) {
    return (
      <EmptyState
        title="Export actions will appear here"
        description="Once samples are loaded and coding results exist, CSV, JSON, and Markdown export actions can be added without changing the overall architecture."
      />
    );
  }

  return (
    <section className="rounded-[1.5rem] border border-line bg-white p-6 shadow-soft">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight text-ink">Export placeholder</h3>
        <p className="text-sm leading-7 text-muted">
          The current scaffold keeps export local. The next batch can add client-side CSV, JSON, and Markdown downloads.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {["CSV", "JSON", "Markdown"].map((format) => (
          <div key={format} className="rounded-[1.25rem] border border-dashed border-line bg-[#fffdf8] p-4">
            <p className="text-base font-semibold text-ink">{format}</p>
            <p className="mt-2 text-sm leading-7 text-muted">Download action not wired yet.</p>
          </div>
        ))}
      </div>
    </section>
  );
}
