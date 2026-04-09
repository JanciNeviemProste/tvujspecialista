'use client';

/**
 * EditModePanel — plávajúci panel v pravom dolnom rohu.
 *
 * Zobrazený iba v edit móde (URL ?edit=1). Má 3 stavy:
 *   1. Neprihlásený → prompt na heslo
 *   2. Prihlásený + žiadne pending → minimálne info „Edit mód zapnutý"
 *   3. Prihlásený + pending → "X neuložených zmien [Uložiť a publikovať]"
 *
 * Po uložení mení farbu badge podľa deployStatus.
 */

import { useState } from 'react';
import { useEditMode } from './EditModeProvider';

export function EditModePanel() {
  const {
    isEditMode,
    isAuthenticated,
    pendingChanges,
    deployStatus,
    deployError,
    login,
    logout,
    saveAll,
    reset,
  } = useEditMode();

  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showConfirmDiscard, setShowConfirmDiscard] = useState(false);

  if (!isEditMode) return null;

  const count = pendingChanges.size;

  // ── Unauthenticated: login form ──────────────────────────────────────
  if (!isAuthenticated) {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError(null);
      const ok = await login(password);
      if (!ok) {
        setLoginError('Nesprávne heslo.');
      } else {
        setPassword('');
      }
    };

    return (
      <div
        className="fixed bottom-6 right-6 z-[200] w-80 rounded-2xl border border-neutral-800 bg-neutral-900 p-5 text-white shadow-2xl"
        style={{ fontFamily: 'Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif' }}
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-amber-400" />
          <div className="text-sm font-bold">Editačný režim</div>
        </div>
        <form onSubmit={handleLogin}>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Zadaj heslo
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            className="mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
          />
          {loginError && (
            <p className="mt-2 text-xs text-red-400" role="alert">
              {loginError}
            </p>
          )}
          <button
            type="submit"
            className="mt-3 w-full rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-400"
          >
            Prihlásiť
          </button>
        </form>
      </div>
    );
  }

  // ── Authenticated ───────────────────────────────────────────────────────
  const handleSave = async () => {
    await saveAll();
  };

  const handleDiscard = () => {
    if (count > 0 && !showConfirmDiscard) {
      setShowConfirmDiscard(true);
      return;
    }
    reset();
    setShowConfirmDiscard(false);
  };

  const handleLogout = () => {
    if (count > 0) {
      const ok = window.confirm(
        `Máš ${count} neuložených zmien. Naozaj sa chceš odhlásiť a zahodiť ich?`
      );
      if (!ok) return;
    }
    logout();
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-[200] w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl border border-neutral-800 bg-neutral-900 p-5 text-white shadow-2xl"
      style={{ fontFamily: 'Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif' }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              deployStatus === 'deploying'
                ? 'animate-pulse bg-amber-400'
                : deployStatus === 'live'
                  ? 'bg-emerald-400'
                  : deployStatus === 'error'
                    ? 'bg-red-400'
                    : 'bg-indigo-400'
            }`}
          />
          <div className="text-sm font-bold">
            {deployStatus === 'deploying'
              ? 'Nasadzujem…'
              : deployStatus === 'live'
                ? 'Publikované ✓'
                : deployStatus === 'error'
                  ? 'Chyba'
                  : 'Editačný režim'}
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="text-xs text-neutral-400 hover:text-white"
          title="Odhlásiť sa"
        >
          Odhlásiť
        </button>
      </div>

      {/* Deploy error */}
      {deployStatus === 'error' && deployError && (
        <div
          className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300"
          role="alert"
        >
          {deployError}
        </div>
      )}

      {/* Deploy in progress info */}
      {deployStatus === 'deploying' && (
        <div className="mb-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-200">
          Vercel práve nasadzuje zmeny. Bude to trvať ~1–2 minúty.
        </div>
      )}

      {/* Deploy success */}
      {deployStatus === 'live' && (
        <div className="mb-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-200">
          Zmeny sú live na <strong>tvujspecialista.vercel.app</strong>.
        </div>
      )}

      {/* Pending changes count + actions */}
      <div className="mb-3 text-xs text-neutral-400">
        {count === 0 ? (
          <>Klikni na ľubovoľný text na stránke a začni editovať.</>
        ) : (
          <>
            <span className="font-bold text-white">{count}</span> neuložen{count === 1 ? 'á zmena' : count < 5 ? 'é zmeny' : 'ých zmien'}
          </>
        )}
      </div>

      {count > 0 && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={deployStatus === 'saving' || deployStatus === 'deploying'}
            className="flex-1 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deployStatus === 'saving' ? 'Ukladám…' : 'Uložiť a publikovať'}
          </button>
          <button
            type="button"
            onClick={handleDiscard}
            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-xs font-semibold text-neutral-300 transition-colors hover:border-red-500 hover:text-red-300"
            title="Zahodiť všetky neuložené zmeny"
          >
            {showConfirmDiscard ? 'Naozaj?' : 'Zahodiť'}
          </button>
        </div>
      )}

      {/* Changed keys preview (compact) */}
      {count > 0 && count <= 5 && (
        <div className="mt-3 space-y-1 border-t border-neutral-800 pt-3">
          {[...pendingChanges.values()].map((change) => (
            <div key={change.key} className="truncate text-[10px] text-neutral-500">
              <span className="font-mono text-indigo-400">{change.key}</span>
            </div>
          ))}
        </div>
      )}

      {/* Help text bottom */}
      <div className="mt-3 border-t border-neutral-800 pt-3 text-[10px] text-neutral-500">
        Tip: klikni na text → prepíš → klikni vedľa → Uložiť
      </div>
    </div>
  );
}
