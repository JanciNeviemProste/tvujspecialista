'use client';

/**
 * EditModeProvider — Kontext pre inline editor textov.
 *
 * Aktivácia:
 *   /sk?edit=1  → prompt na heslo → JWT do sessionStorage → edit mód zapnutý
 *
 * Bez ?edit=1 je kontext prítomný ale všetky edit funkcie sú no-op.
 * <EditableText> mimo edit módu vracia children bez akéhokoľvek wrappera
 * (zero runtime overhead pre bežných návštevníkov).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'tvujspecialista-edit-jwt';

type DeployStatus = 'idle' | 'saving' | 'deploying' | 'live' | 'error';

interface PendingChange {
  key: string;
  originalValue: string;
  newValue: string;
}

interface EditModeContextValue {
  // State flags
  isEditMode: boolean;
  isAuthenticated: boolean;
  deployStatus: DeployStatus;
  deployError: string | null;

  // Pending changes (dot-notation key → new value)
  pendingChanges: Map<string, PendingChange>;

  // Actions
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  recordChange: (key: string, originalValue: string, newValue: string) => void;
  discardChange: (key: string) => void;
  saveAll: () => Promise<void>;
  reset: () => void;
}

const EditModeContext = createContext<EditModeContextValue | null>(null);

export function useEditMode(): EditModeContextValue {
  const ctx = useContext(EditModeContext);
  if (!ctx) {
    throw new Error('useEditMode must be used inside <EditModeProvider>');
  }
  return ctx;
}

interface EditModeProviderProps {
  locale: string;
  children: ReactNode;
}

export function EditModeProvider({ locale, children }: EditModeProviderProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [jwt, setJwt] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Map<string, PendingChange>>(new Map());
  const [deployStatus, setDeployStatus] = useState<DeployStatus>('idle');
  const [deployError, setDeployError] = useState<string | null>(null);

  // Track deploy timer for auto-clear of 'live' badge
  const deployTimer = useRef<number | null>(null);

  // 1. Detect ?edit=1 in URL on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('edit') === '1') {
      setIsEditMode(true);
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) setJwt(stored);
    }
  }, []);

  // 2. Login — call /api/edit-auth with password
  const login = useCallback(async (password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/edit-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) return false;
      const data = (await res.json()) as { token?: string };
      if (!data.token) return false;
      sessionStorage.setItem(STORAGE_KEY, data.token);
      setJwt(data.token);
      return true;
    } catch (err) {
      console.error('[EditMode] login failed:', err);
      return false;
    }
  }, []);

  // 3. Logout
  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setJwt(null);
    setPendingChanges(new Map());
  }, []);

  // 4. Record a pending change
  const recordChange = useCallback((key: string, originalValue: string, newValue: string) => {
    setPendingChanges((prev) => {
      const next = new Map(prev);
      if (newValue === originalValue) {
        // Back to original → drop from pending
        next.delete(key);
      } else {
        next.set(key, { key, originalValue, newValue });
      }
      return next;
    });
  }, []);

  const discardChange = useCallback((key: string) => {
    setPendingChanges((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  }, []);

  // 5. Save all pending changes
  const saveAll = useCallback(async (): Promise<void> => {
    if (!jwt) {
      setDeployError('Nie si prihlásený.');
      setDeployStatus('error');
      return;
    }
    if (pendingChanges.size === 0) return;

    setDeployStatus('saving');
    setDeployError(null);

    const changes: Record<string, string> = {};
    for (const [key, change] of pendingChanges) {
      changes[key] = change.newValue;
    }

    try {
      const res = await fetch('/api/edit-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ locale, changes }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({ error: 'Neznáma chyba.' }))) as {
          error?: string;
        };
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      // Saved successfully → optimistic state: changes are live in UI, badge = deploying
      setDeployStatus('deploying');

      // Simulate deploy completion after ~90s (Vercel typical build time)
      // POZN: Reálny polling Vercel Deployments API by bol presnejší, ale
      // pre MVP stačí časovač. Fáza 3 pridá live polling.
      if (deployTimer.current) window.clearTimeout(deployTimer.current);
      deployTimer.current = window.setTimeout(() => {
        setDeployStatus('live');
        // Clear pending changes — they are now canonical in sk.json
        setPendingChanges(new Map());
        // Auto-clear 'live' badge after 10s
        deployTimer.current = window.setTimeout(() => {
          setDeployStatus('idle');
        }, 10_000);
      }, 90_000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Neznáma chyba.';
      setDeployError(message);
      setDeployStatus('error');
    }
  }, [jwt, pendingChanges, locale]);

  const reset = useCallback(() => {
    setPendingChanges(new Map());
    setDeployStatus('idle');
    setDeployError(null);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (deployTimer.current) window.clearTimeout(deployTimer.current);
    };
  }, []);

  const value = useMemo<EditModeContextValue>(
    () => ({
      isEditMode,
      isAuthenticated: jwt !== null,
      deployStatus,
      deployError,
      pendingChanges,
      login,
      logout,
      recordChange,
      discardChange,
      saveAll,
      reset,
    }),
    [
      isEditMode,
      jwt,
      deployStatus,
      deployError,
      pendingChanges,
      login,
      logout,
      recordChange,
      discardChange,
      saveAll,
      reset,
    ]
  );

  return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>;
}
