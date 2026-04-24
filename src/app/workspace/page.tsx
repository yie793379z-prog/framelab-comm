"use client";

import { PageShell } from "@/components/layout/page-shell";
import { WorkspaceFlow } from "@/features/coding/components/workspace-flow";
import { WorkspaceProvider } from "@/features/coding/state/workspace-context";

export default function WorkspacePage() {
  return (
    <WorkspaceProvider>
      <PageShell className="py-12 md:py-14">
        <WorkspaceFlow />
      </PageShell>
    </WorkspaceProvider>
  );
}
