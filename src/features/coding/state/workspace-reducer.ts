import { parseTextInput } from "@/features/import/utils/parse-text-input";
import type { CodingFieldValue } from "@/types/coding";
import type { WorkspaceState } from "@/types/workspace";

type WorkspaceAction =
  | { type: "SET_IMPORT_TEXT"; payload: string }
  | { type: "RESET_IMPORT_TEXT" }
  | { type: "LOAD_SAMPLES_FROM_IMPORT" }
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
  | { type: "RESET_WORKSPACE" };

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

export const initialWorkspaceState: WorkspaceState = {
  importText: "",
  samples: [],
  selectedTemplateId: null,
  selectedSampleId: null,
  codingRows: [],
  exportFormats: ["csv", "json", "markdown"]
};

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

    case "RESET_WORKSPACE":
      return initialWorkspaceState;

    default:
      return state;
  }
}

export type { WorkspaceAction };
