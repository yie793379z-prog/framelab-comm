"use client";

import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { useWorkspace } from "@/features/coding/state/workspace-context";
import { buildSampleListView, type SampleFilter, type SampleSort } from "@/features/import/utils/build-sample-list-view";
import { getProjectTemplateById } from "@/features/templates/utils/project-codebooks";
import { useLanguage } from "@/i18n/context";
import { formatMessage } from "@/i18n/utils";

export function SampleList() {
  const { state, dispatch } = useWorkspace();
  const { locale, messages } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<SampleFilter>("all");
  const [sort, setSort] = useState<SampleSort>("import-order");

  const activeTemplate =
    getProjectTemplateById(state.selectedTemplateId, state.customProjectCodebooks) ?? null;

  useEffect(() => {
    if (!activeTemplate && (filter === "coded" || filter === "uncoded" || filter === "partial")) {
      setFilter("all");
    }

    if (!activeTemplate && sort === "coded-status") {
      setSort("import-order");
    }
  }, [activeTemplate, filter, sort]);

  const { allItems, visibleItems } = useMemo(
    () =>
      buildSampleListView({
        samples: state.samples,
        codingRows: state.codingRows,
        activeTemplate,
        searchQuery,
        filter,
        sort,
        locale
      }),
    [activeTemplate, filter, locale, searchQuery, sort, state.codingRows, state.samples]
  );

  const selectedSampleHidden =
    Boolean(state.selectedSampleId) && !visibleItems.some((item) => item.sample.id === state.selectedSampleId);

  if (!state.samples.length) {
    return (
      <EmptyState
        title={messages.sampleList.emptyTitle}
        description={messages.sampleList.emptyDescription}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="helper-note">{messages.sampleList.helper}</div>

      <div className="surface-panel space-y-4 p-5">
        <div className="grid gap-4 lg:grid-cols-[1.3fr_0.8fr_0.8fr]">
          <div>
            <label htmlFor="sample-search" className="block text-sm font-semibold text-ink">
              {messages.sampleList.searchSamples}
            </label>
            <input
              id="sample-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={messages.sampleList.searchPlaceholder}
              className="field-control mt-3"
            />
          </div>

          <div>
            <label htmlFor="sample-filter" className="block text-sm font-semibold text-ink">
              {messages.sampleList.filterLabel}
            </label>
            <select
              id="sample-filter"
              value={filter}
              onChange={(event) => setFilter(event.target.value as SampleFilter)}
              className="field-control mt-3"
            >
              <option value="all">{messages.sampleList.filterAll}</option>
              <option value="coded" disabled={!activeTemplate}>
                {messages.sampleList.filterCoded}
              </option>
              <option value="uncoded" disabled={!activeTemplate}>
                {messages.sampleList.filterUncoded}
              </option>
              <option value="partial" disabled={!activeTemplate}>
                {messages.sampleList.filterPartiallyCoded}
              </option>
              <option value="with-metadata">{messages.sampleList.filterWithMetadata}</option>
            </select>
          </div>

          <div>
            <label htmlFor="sample-sort" className="block text-sm font-semibold text-ink">
              {messages.sampleList.sortLabel}
            </label>
            <select
              id="sample-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as SampleSort)}
              className="field-control mt-3"
            >
              <option value="import-order">{messages.sampleList.sortImportOrder}</option>
              <option value="title-asc">{messages.sampleList.sortTitleAsc}</option>
              <option value="title-desc">{messages.sampleList.sortTitleDesc}</option>
              <option value="coded-status" disabled={!activeTemplate}>
                {messages.sampleList.sortCodedStatus}
              </option>
              <option value="metadata-date">{messages.sampleList.sortMetadataDate}</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm leading-7 text-muted">
          <p>
            {formatMessage(messages.sampleList.showingCount, {
              visibleCount: visibleItems.length,
              totalCount: allItems.length
            })}
          </p>
          {selectedSampleHidden && <p>{messages.sampleList.selectedSampleHiddenNotice}</p>}
        </div>
      </div>

      {!visibleItems.length ? (
        <EmptyState
          title={messages.sampleList.noMatchesTitle}
          description={messages.sampleList.noMatchesDescription}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visibleItems.map((item) => {
            const { sample, importIndex, codingStatus, metadataPreview } = item;
            const isSelected = state.selectedSampleId === sample.id;
            const previewText = sample.text.length > 180 ? `${sample.text.slice(0, 177)}...` : sample.text;
            const statusLabel =
              codingStatus === "coded"
                ? messages.sampleList.filterCoded
                : codingStatus === "partial"
                  ? messages.sampleList.filterPartiallyCoded
                  : messages.sampleList.filterUncoded;

            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => dispatch({ type: "SELECT_SAMPLE", payload: sample.id })}
                aria-pressed={isSelected}
                aria-label={formatMessage(messages.sampleList.selectAction, {
                  index: importIndex + 1,
                  title: sample.title
                })}
                className={`rounded-[1.5rem] border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/15 ${
                  isSelected
                    ? "border-ink bg-ink text-white shadow-soft"
                    : "border-line bg-white hover:border-ink/40 hover:bg-[#fffdf8]"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold tracking-tight">{sample.title}</h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        isSelected ? "bg-white/15 text-white" : "bg-paper text-muted"
                      }`}
                    >
                      {formatMessage(messages.sampleList.sampleBadge, { index: importIndex + 1 })}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {activeTemplate && (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          isSelected ? "bg-white/15 text-white" : "bg-paper text-muted"
                        }`}
                      >
                        {statusLabel}
                      </span>
                    )}
                    {sample.source?.trim() && (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          isSelected ? "bg-white/15 text-white" : "bg-paper text-muted"
                        }`}
                      >
                        {sample.source.trim()}
                      </span>
                    )}
                  </div>

                  {metadataPreview && (
                    <p className={`text-xs leading-6 ${isSelected ? "text-white/75" : "text-muted"}`}>
                      {metadataPreview}
                    </p>
                  )}

                  <p className={`text-sm leading-7 ${isSelected ? "text-white/80" : "text-muted"}`}>{previewText}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
