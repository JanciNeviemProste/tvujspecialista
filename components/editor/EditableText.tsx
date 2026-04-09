'use client';

/**
 * EditableText — wrapper pre inline editovateľné texty.
 *
 * Použitie:
 *   <EditableText tKey="home.v2.hero.subtitle">
 *     {t('home.v2.hero.subtitle')}
 *   </EditableText>
 *
 * Pre rich texty (s <serif>...</serif> markupom v sk.json) je potrebné
 * pre edit mód pretransformovať do bracket-syntax:
 *   <EditableText tKey="home.v2.hero.title" rawValue={rawTitle}>
 *     {renderedRichJSX}
 *   </EditableText>
 *
 * Kde `rawValue` je surový string z sk.json (s <serif> tagmi), ktorý sa
 * v edit móde zobrazí Štěpánovi ako `Najlepší [špecialisti], ktorým...`.
 *
 * Mimo edit módu (väčšina používateľov) komponent VRACIA IBA children bez
 * wrapper <span>/<div> — žiadny runtime overhead, žiadne edit artefakty v DOM.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useEditMode } from './EditModeProvider';

interface EditableTextProps {
  /** Dot-notation kľúč v messages/<locale>.json (napr. "home.v2.hero.title") */
  tKey: string;
  /** Vyrenderovaný text alebo rich JSX (v normálnom móde sa vracia ako-je) */
  children: ReactNode;
  /**
   * Surový string z sk.json (volitelne — pre rich texty s <serif> markerom).
   * Ak je poskytnutý, edit mód ukáže bracket-syntax reprezentáciu na editáciu.
   * Bez neho sa v edit móde použije textContent z children (len plain texty).
   */
  rawValue?: string;
  /** Render as block alebo inline. Default: inline (span) */
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3';
  /** Extra className (aplikovaný v oboch módoch) */
  className?: string;
}

/** Konvertuje sk.json surový text `<serif>X</serif>` → edit-forma `[X]` */
function serifToBracket(raw: string): string {
  return raw.replace(/<serif>([^<]+)<\/serif>/g, '[$1]');
}

export function EditableText({
  tKey,
  children,
  rawValue,
  as = 'span',
  className,
}: EditableTextProps) {
  const ctx = useEditMode();

  // ── EARLY RETURN: not in edit mode → zero overhead ────────────────────
  if (!ctx.isEditMode) {
    // Ak máme className, stále ho treba aplikovať (styling)
    if (!className) return <>{children}</>;
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <EditableTextInner
      tKey={tKey}
      rawValue={rawValue}
      as={as}
      className={className}
    >
      {children}
    </EditableTextInner>
  );
}

// ── Inner: edit mode only, has hooks ────────────────────────────────────
interface EditableTextInnerProps extends Required<Pick<EditableTextProps, 'tKey' | 'as'>> {
  rawValue?: string;
  className?: string;
  children: ReactNode;
}

function EditableTextInner({
  tKey,
  rawValue,
  as: Tag,
  className,
  children,
}: EditableTextInnerProps) {
  const { isAuthenticated, pendingChanges, recordChange } = useEditMode();
  const ref = useRef<HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Initial display: if there's a pending change, show its new value; otherwise show bracket-syntax (for rich) or children.
  const pending = pendingChanges.get(tKey);

  // The "original" value for bracket-syntax edit — prefer rawValue (rich), fallback to textContent of children
  const getOriginalEditValue = (): string => {
    if (rawValue !== undefined) return serifToBracket(rawValue);
    // Plain text children → extract textContent
    if (typeof children === 'string') return children;
    if (typeof children === 'number') return String(children);
    // Fallback: use DOM
    return ref.current?.textContent ?? '';
  };

  const displayValue: ReactNode = (() => {
    if (pending) {
      // Show pending (bracket form if rich, plain if not)
      return pending.newValue;
    }
    if (isEditing) {
      return getOriginalEditValue();
    }
    // Normal display — show rendered children
    return children;
  })();

  // When entering edit mode, sync DOM textContent to bracket form
  useEffect(() => {
    if (isEditing && ref.current) {
      ref.current.textContent = pending?.newValue ?? getOriginalEditValue();
      // Focus at end of text
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  const handleClick = () => {
    if (!isAuthenticated) return;
    setIsEditing(true);
  };

  const handleBlur = () => {
    if (!ref.current) return;
    const newText = (ref.current.textContent ?? '').trim();
    const original = getOriginalEditValue();
    recordChange(tKey, original, newText);
    setIsEditing(false);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    // Strip HTML from paste — only plain text
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
    }
  };

  const isDirty = pending !== undefined;

  const editStyles = isAuthenticated
    ? `cursor-text outline-dashed outline-1 outline-offset-4 hover:outline-2 hover:outline-indigo-400 transition-all ${
        isEditing ? 'outline-2 outline-indigo-500 outline-offset-4 bg-indigo-50/50 dark:bg-indigo-950/30' : 'outline-transparent hover:outline-indigo-300'
      } ${isDirty ? 'bg-amber-50/50 outline-amber-400 dark:bg-amber-950/30' : ''}`
    : '';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ElementTag = Tag as any;

  return (
    <ElementTag
      ref={ref}
      contentEditable={isAuthenticated && isEditing}
      suppressContentEditableWarning
      onClick={handleClick}
      onBlur={handleBlur}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      data-edit-key={tKey}
      data-edit-dirty={isDirty ? 'true' : undefined}
      className={`${className ?? ''} ${editStyles}`.trim()}
    >
      {displayValue}
    </ElementTag>
  );
}
