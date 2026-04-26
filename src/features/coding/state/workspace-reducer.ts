import { parseTextInput } from "@/features/import/utils/parse-text-input";
import { emptyProjectMetadata } from "@/features/project/utils/project-metadata";
import {
  createCustomProjectCodebook,
  emptyProjectCodebooks,
  resetProjectCodebookToBuiltIn,
  upsertGeneratedFieldIntoProjectCodebook,
  updateLocalizedTextValue
} from "@/features/templates/utils/project-codebooks";
import type { CodingFieldValue } from "@/types/coding";
import type { ProjectMetadata } from "@/types/project";
import type { SampleRecord } from "@/types/sample";
import type { Locale } from "@/i18n/types";
import type { TemplateField } from "@/types/template";
import type { PersistedWorkspaceState, WorkspaceState } from "@/types/workspace";

type WorkspaceAction =
  | { type: "SET_IMPORT_TEXT"; payload: string }
  | { type: "RESET_IMPORT_TEXT" }
  | { type: "LOAD_SAMPLES_FROM_IMPORT" }
  | { type: "LOAD_SAMPLES"; payload: SampleRecord[] }
  | {
      type: "UPDATE_PROJECT_METADATA";
      payload: {
        field: keyof ProjectMetadata;
        value: string;
      };
    }
  | {
      type: "CREATE_CUSTOM_CODEBOOK";
      payload: {
        templateId: string;
      };
    }
  | {
      type: "RESET_CUSTOM_CODEBOOK";
      payload: {
        templateId: string;
      };
    }
  | {
      type: "UPDATE_CUSTOM_CODEBOOK_TEMPLATE_TEXT";
      payload: {
        templateId: string;
        locale: Locale;
        field: "name" | "shortDescription" | "researchUseCase";
        value: string;
      };
    }
  | {
      type: "UPDATE_CUSTOM_CODEBOOK_FIELD_TEXT";
      payload: {
        templateId: string;
        fieldId: string;
        locale: Locale;
        field: "label" | "description" | "placeholder";
        value: string;
      };
    }
  | {
      type: "UPDATE_CUSTOM_CODEBOOK_OPTION_LABEL";
      payload: {
        templateId: string;
        fieldId: string;
        optionValue: string;
        locale: Locale;
        value: string;
      };
    }
  | {
      type: "APPLY_GENERATED_CODEBOOK_FIELD";
      payload: {
        templateId: string;
        field: TemplateField;
      };
    }
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
      payload: Pick<
        WorkspaceState,
        | "samples"
        | "selectedTemplateId"
        | "selectedSampleId"
        | "codingRows"
        | "projectMetadata"
        | "customProjectCodebooks"
      >;
    }
  | { type: "RESET_WORKSPACE" };

function updateCustomCodebookTemplateText(
  state: WorkspaceState,
  payload: Extract<WorkspaceAction, { type: "UPDATE_CUSTOM_CODEBOOK_TEMPLATE_TEXT" }>["payload"]
) {
  const currentTemplate = state.customProjectCodebooks[payload.templateId];

  if (!currentTemplate) {
    return state;
  }

  return {
    ...state,
    customProjectCodebooks: {
      ...state.customProjectCodebooks,
      [payload.templateId]: {
        ...currentTemplate,
        [payload.field]: updateLocalizedTextValue(currentTemplate[payload.field], payload.locale, payload.value)
      }
    }
  };
}

function updateCustomCodebookFieldText(
  state: WorkspaceState,
  payload: Extract<WorkspaceAction, { type: "UPDATE_CUSTOM_CODEBOOK_FIELD_TEXT" }>["payload"]
) {
  const currentTemplate = state.customProjectCodebooks[payload.templateId];

  if (!currentTemplate) {
    return state;
  }

  return {
    ...state,
    customProjectCodebooks: {
      ...state.customProjectCodebooks,
      [payload.templateId]: {
        ...currentTemplate,
        fields: currentTemplate.fields.map((field) => {
          if (field.id !== payload.fieldId) {
            return field;
          }

          if (payload.field === "placeholder") {
            return {
              ...field,
              placeholder: updateLocalizedTextValue(
                field.placeholder ?? { en: "", "zh-CN": "" },
                payload.locale,
                payload.value
              )
            };
          }

          return {
            ...field,
            [payload.field]: updateLocalizedTextValue(field[payload.field], payload.locale, payload.value)
          };
        })
      }
    }
  };
}

function updateCustomCodebookOptionLabel(
  state: WorkspaceState,
  payload: Extract<WorkspaceAction, { type: "UPDATE_CUSTOM_CODEBOOK_OPTION_LABEL" }>["payload"]
) {
  const currentTemplate = state.customProjectCodebooks[payload.templateId];

  if (!currentTemplate) {
    return state;
  }

  return {
    ...state,
    customProjectCodebooks: {
      ...state.customProjectCodebooks,
      [payload.templateId]: {
        ...currentTemplate,
        fields: currentTemplate.fields.map((field) => {
          if (field.id !== payload.fieldId) {
            return field;
          }

          return {
            ...field,
            options: field.options?.map((option) => {
              if (option.value !== payload.optionValue) {
                return option;
              }

              return {
                ...option,
                label: updateLocalizedTextValue(option.label, payload.locale, payload.value)
              };
            })
          };
        })
      }
    }
  };
}

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
  projectMetadata: emptyProjectMetadata,
  customProjectCodebooks: emptyProjectCodebooks,
  exportFormats: ["csv", "json", "markdown"]
};

function restoreWorkspaceState(payload: PersistedWorkspaceState): WorkspaceState {
  return {
    ...initialWorkspaceState,
    importText: payload.importText,
    samples: payload.samples,
    selectedTemplateId: payload.selectedTemplateId,
    selectedSampleId: payload.selectedSampleId,
    codingRows: payload.codingRows,
    projectMetadata: payload.projectMetadata,
    customProjectCodebooks: payload.customProjectCodebooks
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

    case "UPDATE_PROJECT_METADATA":
      return {
        ...state,
        projectMetadata: {
          ...state.projectMetadata,
          [action.payload.field]: action.payload.value
        }
      };

    case "CREATE_CUSTOM_CODEBOOK": {
      if (state.customProjectCodebooks[action.payload.templateId]) {
        return state;
      }

      const customCodebook = createCustomProjectCodebook(action.payload.templateId);

      if (!customCodebook) {
        return state;
      }

      return {
        ...state,
        customProjectCodebooks: {
          ...state.customProjectCodebooks,
          [action.payload.templateId]: customCodebook
        },
        selectedTemplateId: action.payload.templateId
      };
    }

    case "RESET_CUSTOM_CODEBOOK": {
      const currentCustomCodebook = state.customProjectCodebooks[action.payload.templateId];

      if (!currentCustomCodebook) {
        return state;
      }

      const hasGeneratedFields = currentCustomCodebook.fields.some(
        (field) => field.generated?.source === "ai-codebook-builder"
      );

      if (!hasGeneratedFields) {
        const nextCodebooks = { ...state.customProjectCodebooks };
        delete nextCodebooks[action.payload.templateId];

        return {
          ...state,
          customProjectCodebooks: nextCodebooks
        };
      }

      const resetCodebook = resetProjectCodebookToBuiltIn(
        action.payload.templateId,
        state.customProjectCodebooks
      );

      if (!resetCodebook) {
        return state;
      }

      return {
        ...state,
        customProjectCodebooks: {
          ...state.customProjectCodebooks,
          [action.payload.templateId]: resetCodebook
        }
      };
    }

    case "UPDATE_CUSTOM_CODEBOOK_TEMPLATE_TEXT":
      return updateCustomCodebookTemplateText(state, action.payload);

    case "UPDATE_CUSTOM_CODEBOOK_FIELD_TEXT":
      return updateCustomCodebookFieldText(state, action.payload);

    case "UPDATE_CUSTOM_CODEBOOK_OPTION_LABEL":
      return updateCustomCodebookOptionLabel(state, action.payload);

    case "APPLY_GENERATED_CODEBOOK_FIELD": {
      const existingTemplate =
        state.customProjectCodebooks[action.payload.templateId] ??
        createCustomProjectCodebook(action.payload.templateId);

      if (!existingTemplate) {
        return state;
      }

      return {
        ...state,
        customProjectCodebooks: {
          ...state.customProjectCodebooks,
          [action.payload.templateId]: upsertGeneratedFieldIntoProjectCodebook(
            existingTemplate,
            action.payload.field
          )
        },
        selectedTemplateId: action.payload.templateId
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
        codingRows: action.payload.codingRows,
        projectMetadata: action.payload.projectMetadata,
        customProjectCodebooks: action.payload.customProjectCodebooks
      });

    case "RESET_WORKSPACE":
      return initialWorkspaceState;

    default:
      return state;
  }
}

export type { WorkspaceAction };
