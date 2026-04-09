#!/usr/bin/env node
/**
 * Codemod: wrap {t('key')} in JSX with <EditableText tKey="ns.key">{t('key')}</EditableText>
 *
 * Strategy (intentionally simple, regex-based):
 * 1. Find the FIRST `const X = useTranslations('NS')` → maps X → NS
 *    - Supports multiple t-variables per file (tHero, tCommon, etc.)
 * 2. For each {X('key')} in JSX, replace with wrapped EditableText
 * 3. Skip:
 *    - X.rich(...)  (rich text — manual handling required)
 *    - X('key') when NOT wrapped in { } (i.e. prop values like placeholder={t(...)})
 *    - Files already containing EditableText import
 * 4. Insert EditableText import after last existing import
 *
 * Limitations accepted:
 * - Does not handle t() without useTranslations namespace lookup
 * - Does not handle conditional rendering like {cond ? t('a') : t('b')}
 * - Does not handle template literals `${t('x')}`
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';

// Crawl all .tsx files under app/ and components/, skip excluded dirs
const ROOTS = ['app', 'components'];
const EXCLUDE_DIRS = new Set([
  'node_modules',
  '.next',
  'dist',
  'editor', // our own EditableText/Provider/Panel — don't self-wrap
  'design-variants', // showcase only
]);
const EXCLUDE_FILE_PATTERNS = [
  /error\.tsx$/, // error boundaries
  /not-found\.tsx$/,
  /layout\.tsx$/, // layout files use metadata t() in non-JSX context
];

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry)) continue;
      walk(full, acc);
    } else if (entry.endsWith('.tsx')) {
      if (EXCLUDE_FILE_PATTERNS.some((rx) => rx.test(entry))) continue;
      acc.push(relative(process.cwd(), full).replace(/\\/g, '/'));
    }
  }
  return acc;
}

const FILES = ROOTS.flatMap((r) => walk(resolve(process.cwd(), r)));

const IMPORT_LINE = `import { EditableText } from '@/components/editor/EditableText';`;

function processFile(relPath) {
  const abs = resolve(process.cwd(), relPath);
  let src;
  try {
    src = readFileSync(abs, 'utf8');
  } catch {
    return { file: relPath, skipped: 'not found' };
  }

  if (src.includes('EditableText')) {
    return { file: relPath, skipped: 'already wrapped' };
  }

  // 1. Find all: const <var> = useTranslations('<ns>')
  const tVars = new Map(); // var → namespace
  const nsRegex = /const\s+(\w+)\s*=\s*useTranslations\(\s*['"]([^'"]+)['"]\s*\)/g;
  let m;
  while ((m = nsRegex.exec(src)) !== null) {
    tVars.set(m[1], m[2]);
  }

  if (tVars.size === 0) {
    return { file: relPath, skipped: 'no useTranslations namespace found' };
  }

  // 2. For each t-variable, replace {tvar('key')} with EditableText wrapper
  let count = 0;
  let newSrc = src;

  for (const [tVar, ns] of tVars) {
    // Match: {tVar('some.dotted.key')} — must be inside JSX curly braces
    // Lookbehind: { (at start of JSX expression)
    // Lookahead: } (at end)
    // Does NOT match tVar.rich( — that has a dot.
    // Negative lookbehind `(?<!=)` ensures we skip attribute values like
    // aria-label={t('x')} / alt={t('x')} / placeholder={t('x')}.
    // Only matches {t('x')} in JSX children position.
    const pattern = new RegExp(
      `(?<!=)\\{${tVar}\\(\\s*['"]([\\w.-]+)['"]\\s*\\)\\}`,
      'g'
    );
    newSrc = newSrc.replace(pattern, (_, key) => {
      count++;
      return `<EditableText tKey="${ns}.${key}">{${tVar}('${key}')}</EditableText>`;
    });
  }

  if (count === 0) {
    return { file: relPath, skipped: 'no inline {t(...)} patterns' };
  }

  // 3. Insert import after last existing import line
  const importLines = newSrc.match(/^import .+;$/gm) ?? [];
  if (importLines.length > 0) {
    const lastImport = importLines[importLines.length - 1];
    const idx = newSrc.lastIndexOf(lastImport) + lastImport.length;
    newSrc = newSrc.slice(0, idx) + '\n' + IMPORT_LINE + newSrc.slice(idx);
  } else {
    newSrc = IMPORT_LINE + '\n' + newSrc;
  }

  writeFileSync(abs, newSrc, 'utf8');
  return { file: relPath, wrapped: count };
}

console.log('🔧 Wrapping t() calls with <EditableText>...\n');
const results = FILES.map(processFile);
for (const r of results) {
  if (r.wrapped) {
    console.log(`✅ ${r.file} — wrapped ${r.wrapped} text(s)`);
  }
}
const total = results.reduce((s, r) => s + (r.wrapped ?? 0), 0);
console.log(`\n✨ Total: ${total} texts wrapped.`);
