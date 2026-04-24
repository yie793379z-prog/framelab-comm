"use client";

import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { initialWorkspaceState, workspaceReducer, type WorkspaceAction } from "@/features/coding/state/workspace-reducer";
import {
  WORKSPACE_AUTOSAVE_STORAGE_KEY,
  createWorkspaceAutosaveSnapshot,
  hasMeaningfulWorkspaceData,
  parseWorkspaceAutosave,
  type WorkspaceAutosaveSnapshot
} from "@/features/project/utils/local-autosave";
import type { WorkspaceState } from "@/types/workspace";

type PendingWorkspaceRestore = {
  savedAt: string;
};

type WorkspaceAutosaveContextValue = {
  pendingRestore: PendingWorkspaceRestore | null;
  lastSavedAt: string | null;
  restorePreviousWorkspace: () => void;
  startFresh: () => void;
  clearLocalAutosave: () => void;
};

type WorkspaceContextValue = {
  state: WorkspaceState;
  dispatch: React.Dispatch<WorkspaceAction>;
  autosave: WorkspaceAutosaveContextValue;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

type WorkspaceProviderProps = {
  children: React.ReactNode;
};

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [state, dispatch] = useReducer(workspaceReducer, initialWorkspaceState);
  const [hasCheckedAutosave, setHasCheckedAutosave] = useState(false);
  const [pendingRestoreSnapshot, setPendingRestoreSnapshot] = useState<WorkspaceAutosaveSnapshot | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  useEffect(() => {
    const rawSnapshot = window.localStorage.getItem(WORKSPACE_AUTOSAVE_STORAGE_KEY);

    if (!rawSnapshot) {
      setHasCheckedAutosave(true);
      return;
    }

    const parsedSnapshot = parseWorkspaceAutosave(rawSnapshot);

    if (!parsedSnapshot.success) {
      window.localStorage.removeItem(WORKSPACE_AUTOSAVE_STORAGE_KEY);
      setHasCheckedAutosave(true);
      return;
    }

    setPendingRestoreSnapshot(parsedSnapshot.snapshot);
    setLastSavedAt(parsedSnapshot.snapshot.savedAt);
    setHasCheckedAutosave(true);
  }, []);

  useEffect(() => {
    if (!hasCheckedAutosave) {
      return;
    }

    if (pendingRestoreSnapshot && hasMeaningfulWorkspaceData(state)) {
      setPendingRestoreSnapshot(null);
      return;
    }

    if (pendingRestoreSnapshot) {
      return;
    }

    if (!hasMeaningfulWorkspaceData(state)) {
      window.localStorage.removeItem(WORKSPACE_AUTOSAVE_STORAGE_KEY);
      setLastSavedAt(null);
      return;
    }

    const snapshot = createWorkspaceAutosaveSnapshot(state);
    window.localStorage.setItem(WORKSPACE_AUTOSAVE_STORAGE_KEY, JSON.stringify(snapshot));
    setLastSavedAt(snapshot.savedAt);
  }, [hasCheckedAutosave, pendingRestoreSnapshot, state]);

  function restorePreviousWorkspace() {
    if (!pendingRestoreSnapshot) {
      return;
    }

    dispatch({
      type: "RESTORE_WORKSPACE",
      payload: pendingRestoreSnapshot.workspace
    });

    setPendingRestoreSnapshot(null);
  }

  function startFresh() {
    window.localStorage.removeItem(WORKSPACE_AUTOSAVE_STORAGE_KEY);
    setPendingRestoreSnapshot(null);
    setLastSavedAt(null);
  }

  function clearLocalAutosave() {
    window.localStorage.removeItem(WORKSPACE_AUTOSAVE_STORAGE_KEY);
    setPendingRestoreSnapshot(null);
    setLastSavedAt(null);
  }

  return (
    <WorkspaceContext.Provider
      value={{
        state,
        dispatch,
        autosave: {
          pendingRestore: pendingRestoreSnapshot
            ? {
                savedAt: pendingRestoreSnapshot.savedAt
              }
            : null,
          lastSavedAt,
          restorePreviousWorkspace,
          startFresh,
          clearLocalAutosave
        }
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }

  return context;
}
