import { parseTextInput } from "@/features/import/utils/parse-text-input";
import type { CodingFieldValue } from "@/types/coding";
import type { SampleRecord } from "@/types/sample";
import type { PersistedWorkspaceState, WorkspaceState } from "@/types/workspace";

type WorkspaceAction =
  | { type: "SET_IMPORT_TEXT"; payload: string }
  | { type: "RESET_IMPORT_TEXT" }
  | { type: "LOAD_SAMPLES_FROM_IMPORT" }
  | { type: "LOAD_SAMPLES"; payload: SampleRecord[] }
  | { type: "SELECT_TEMPLATE"; payload: string }
  | { type: "SELECT_SAMPLE"; payload: string }
  | {
      type: "UPDATE_CODING_VALUE";
      payload: {
        sampleId: string;
        templateId: string;
        fieldId: string;
        value: CodingFieldValue;
      };
    }
  | {
      type: "APPLY_SUGGESTIONS";
      payload: {
        sampleId: string;
        templateId: string;
        values: Record<string, CodingFieldValue>;
      };
    }
  | {
      type: "RESTORE_WORKSPACE";
      payload: PersistedWorkspaceState;
    }
  | {
      type: "LOAD_PROJECT";
      payload: Pick<WorkspaceState, "samples" | "selectedTemplateId" | "selectedSampleId" | "codingRows">;
    }
  | { type: "RESET_WORKSPACE" };

function isEmptyCodingValue(value: CodingFieldValue | undefined) {
  return value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
}

function filterNonEmptyValues(values: Record<string, CodingFieldValue>) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => !isEmptyCodingValue(value))
  ) as Record<string, CodingFieldValue>;
}

function upsertCodingRow(
  codingRows: WorkspaceState["codingRows"],
  sampleId: string,
  templateId: string,
  fieldId: string,
  value: CodingFieldValue
) {
  const existingRowIndex = codingRows.findIndex(
    (row) => row.sampleId === sampleId && row.templateId === templateId
  );

  if (existingRowIndex === -1) {
    return [
      ...codingRows,
      {
        sampleId,
        templateId,
        values: {
          [fieldId]: value
        }
      }
    ];
  }

  return codingRows.map((row, index) => {
    if (index !== existingRowIndex) {
      return row;
    }

    return {
      ...row,
      values: {
        ...row.values,
        [fieldId]: value
      }
    };
  });
}

function applySuggestionsToCodingRows(
  codingRows: WorkspaceState["codingRows"],
  sampleId: string,
  templateId: string,
  suggestedValues: Record<string, CodingFieldValue>
) {
  const existingRowIndex = codingRows.findIndex(
    (row) => row.sampleId === sampleId && row.templateId === templateId
  );

  if (existingRowIndex === -1) {
    const nonEmptyValues = filterNonEmptyValues(suggestedValues);

    if (!Object.keys(nonEmptyValues).length) {
      return codingRows;
    }

    return [
      ...codingRows,
      {
        sampleId,
        templateId,
        values: nonEmptyValues
      }
    ];
  }

  return codingRows.map((row, index) => {
    if (index !== existingRowIndex) {
      return row;
    }

    const nextValues = { ...row.values };

    for (const [fieldId, suggestedValue] of Object.entries(suggestedValues)) {
      if (isEmptyCodingValue(nextValues[fieldId]) && !isEmptyCodingValue(suggestedValue)) {
        nextValues[fieldId] = suggestedValue;
      }
    }

    return {
      ...row,
      values: nextValues
    };
  });
}

export const initialWorkspaceState: WorkspaceState = {
  importText: "",
  samples: [],
  selectedTemplateId: null,
  selectedSampleId: null,
  codingRows: [],
  exportFormats: ["csv", "json", "markdown"]
};

function restoreWorkspaceState(payload: PersistedWorkspaceState): WorkspaceState {
  return {
    ...initialWorkspaceState,
    importText: payload.importText,
    samples: payload.samples,
    selectedTemplateId: payload.selectedTemplateId,
    selectedSampleId: payload.selectedSampleId,
    codingRows: payload.codingRows
  };
}

export function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case "SET_IMPORT_TEXT":
      return {
        ...state,
        importText: action.payload
      };

    case "RESET_IMPORT_TEXT":
      return {
        ...state,
        importText: ""
      };

    case "LOAD_SAMPLES_FROM_IMPORT": {
      const samples = parseTextInput(state.importText);

      return {
        ...state,
        samples,
        selectedSampleId: samples[0]?.id ?? null,
        codingRows: []
      };
    }

    case "LOAD_SAMPLES":
      return {
        ...state,
        samples: action.payload,
        selectedSampleId: action.payload[0]?.id ?? null,
        codingRows: []
      };

    case "SELECT_TEMPLATE":
      return {
        ...state,
        selectedTemplateId: action.payload,
        selectedSampleId: state.selectedSampleId ?? state.samples[0]?.id ?? null
      };

    case "SELECT_SAMPLE":
      return {
        ...state,
        selectedSampleId: action.payload
      };

    case "UPDATE_CODING_VALUE":
      return {
        ...state,
        codingRows: upsertCodingRow(
          state.codingRows,
          action.payload.sampleId,
          action.payload.templateId,
          action.payload.fieldId,
          action.payload.value
        )
      };

    case "APPLY_SUGGESTIONS":
      return {
        ...state,
        codingRows: applySuggestionsToCodingRows(
          state.codingRows,
          action.payload.sampleId,
          action.payload.templateId,
          action.payload.values
        )
      };

    case "RESTORE_WORKSPACE":
      return restoreWorkspaceState(action.payload);

    case "LOAD_PROJECT":
      return restoreWorkspaceState({
        importText: "",
        samples: action.payload.samples,
        selectedTemplateId: action.payload.selectedTemplateId,
        selectedSampleId: action.payload.selectedSampleId,
        codingRows: action.payload.codingRows
      });

    case "RESET_WORKSPACE":
      return initialWorkspaceState;

    default:
      return state;
  }
}

export type { WorkspaceAction };
