import type { Locale } from "@/i18n/types";
import type { CodingFieldValue, CodingRow } from "@/types/coding";
import type { SampleRecord } from "@/types/sample";
import type { AnalysisTemplate } from "@/types/template";

export type SampleFilter = "all" | "coded" | "uncoded" | "partial" | "with-metadata";
export type SampleSort = "import-order" | "title-asc" | "title-desc" | "coded-status" | "metadata-date";
export type SampleCodingStatus = "coded" | "partial" | "uncoded";

export type SampleListViewItem = {
  sample: SampleRecord;
  importIndex: number;
  codingStatus: SampleCodingStatus;
  filledFieldCount: number;
  totalFieldCount: number;
  hasMetadata: boolean;
  metadataDate: Date | null;
  metadataPreview: string;
  searchText: string;
};

type BuildSampleListViewInput = {
  samples: SampleRecord[];
  codingRows: CodingRow[];
  activeTemplate: AnalysisTemplate | null;
  searchQuery: string;
  filter: SampleFilter;
  sort: SampleSort;
  locale: Locale;
};

function isEmptyCodingValue(value: CodingFieldValue | undefined) {
  return value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
}

function hasSampleMetadata(sample: SampleRecord) {
  return Boolean(
    sample.source?.trim() ||
      sample.metadata?.platform?.trim() ||
      sample.metadata?.author?.trim() ||
      sample.metadata?.date?.trim() ||
      sample.metadata?.url?.trim()
  );
}

function buildMetadataPreview(sample: SampleRecord) {
  return [
    sample.source?.trim(),
    sample.metadata?.platform?.trim(),
    sample.metadata?.author?.trim(),
    sample.metadata?.date?.trim()
  ]
    .filter((value): value is string => Boolean(value))
    .join(" · ");
}

function buildSearchText(sample: SampleRecord) {
  return [
    sample.title,
    sample.text,
    sample.source,
    sample.metadata?.platform,
    sample.metadata?.author,
    sample.metadata?.date,
    sample.metadata?.url
  ]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .join(" ")
    .toLowerCase();
}

function parseMetadataDate(dateValue: string | undefined) {
  if (!dateValue?.trim()) {
    return null;
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

function getCodingStatus(
  sampleId: string,
  codingRows: CodingRow[],
  activeTemplate: AnalysisTemplate | null
): Pick<SampleListViewItem, "codingStatus" | "filledFieldCount" | "totalFieldCount"> {
  if (!activeTemplate) {
    return {
      codingStatus: "uncoded",
      filledFieldCount: 0,
      totalFieldCount: 0
    };
  }

  const totalFieldCount = activeTemplate.fields.length;
  const codingRow = codingRows.find(
    (row) => row.sampleId === sampleId && row.templateId === activeTemplate.id
  );

  if (!codingRow) {
    return {
      codingStatus: "uncoded",
      filledFieldCount: 0,
      totalFieldCount
    };
  }

  const filledFieldCount = activeTemplate.fields.filter(
    (field) => !isEmptyCodingValue(codingRow.values[field.id])
  ).length;

  if (filledFieldCount === 0) {
    return {
      codingStatus: "uncoded",
      filledFieldCount,
      totalFieldCount
    };
  }

  if (filledFieldCount >= totalFieldCount) {
    return {
      codingStatus: "coded",
      filledFieldCount,
      totalFieldCount
    };
  }

  return {
    codingStatus: "partial",
    filledFieldCount,
    totalFieldCount
  };
}

function matchesFilter(item: SampleListViewItem, filter: SampleFilter) {
  if (filter === "all") {
    return true;
  }

  if (filter === "with-metadata") {
    return item.hasMetadata;
  }

  if (filter === "coded") {
    return item.codingStatus !== "uncoded";
  }

  if (filter === "uncoded") {
    return item.codingStatus === "uncoded";
  }

  return item.codingStatus === "partial";
}

function sortItems(items: SampleListViewItem[], sort: SampleSort, locale: Locale) {
  const collator = new Intl.Collator(locale === "zh-CN" ? "zh-CN" : "en", {
    sensitivity: "base",
    numeric: true
  });

  const codingStatusOrder: Record<SampleCodingStatus, number> = {
    coded: 0,
    partial: 1,
    uncoded: 2
  };

  return [...items].sort((left, right) => {
    if (sort === "title-asc") {
      return collator.compare(left.sample.title, right.sample.title) || left.importIndex - right.importIndex;
    }

    if (sort === "title-desc") {
      return collator.compare(right.sample.title, left.sample.title) || left.importIndex - right.importIndex;
    }

    if (sort === "coded-status") {
      return (
        codingStatusOrder[left.codingStatus] - codingStatusOrder[right.codingStatus] ||
        left.importIndex - right.importIndex
      );
    }

    if (sort === "metadata-date") {
      if (left.metadataDate && right.metadataDate) {
        return right.metadataDate.getTime() - left.metadataDate.getTime() || left.importIndex - right.importIndex;
      }

      if (left.metadataDate) {
        return -1;
      }

      if (right.metadataDate) {
        return 1;
      }

      return left.importIndex - right.importIndex;
    }

    return left.importIndex - right.importIndex;
  });
}

export function buildSampleListView({
  samples,
  codingRows,
  activeTemplate,
  searchQuery,
  filter,
  sort,
  locale
}: BuildSampleListViewInput) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const allItems = samples.map((sample, importIndex) => ({
    sample,
    importIndex,
    hasMetadata: hasSampleMetadata(sample),
    metadataDate: parseMetadataDate(sample.metadata?.date),
    metadataPreview: buildMetadataPreview(sample),
    searchText: buildSearchText(sample),
    ...getCodingStatus(sample.id, codingRows, activeTemplate)
  }));

  const filteredItems = allItems.filter((item) => {
    const matchesSearch = normalizedQuery.length === 0 || item.searchText.includes(normalizedQuery);
    return matchesSearch && matchesFilter(item, filter);
  });

  return {
    allItems,
    visibleItems: sortItems(filteredItems, sort, locale)
  };
}
