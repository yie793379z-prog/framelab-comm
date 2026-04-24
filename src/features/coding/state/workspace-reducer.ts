import { parseTextInput } from "@/features/import/utils/parse-text-input";
import type { WorkspaceState } from "@/types/workspace";

type WorkspaceAction =
  | { type: "SET_IMPORT_TEXT"; payload: string }
  | { type: "RESET_IMPORT_TEXT" }
  | { type: "LOAD_SAMPLES_FROM_IMPORT" }
  | { type: "SELECT_TEMPLATE"; payload: string }
  | { type: "RESET_WORKSPACE" };

export const initialWorkspaceState: WorkspaceState = {
  importText: "",
  samples: [],
  selectedTemplateId: null,
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
        codingRows: samples.map((sample) => ({
          sampleId: sample.id,
          values: {}
        }))
      };
    }

    case "SELECT_TEMPLATE":
      return {
        ...state,
        selectedTemplateId: action.payload
      };

    case "RESET_WORKSPACE":
      return initialWorkspaceState;

    default:
      return state;
  }
}

export type { WorkspaceAction };
