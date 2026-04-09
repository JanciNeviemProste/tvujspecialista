import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

/**
 * POST /api/edit-text
 * Headers: Authorization: Bearer <JWT>
 * Body: {
 *   locale: "sk",
 *   changes: { "home.v2.hero.title": "Nový text", ... }
 * }
 *
 * Flow:
 * 1. Overí JWT z Authorization hlavičky (issued by /api/edit-auth)
 * 2. Rate-limit per IP (10 req / 60s, in-memory Map)
 * 3. GET aktuálny messages/{locale}.json cez GitHub Contents API → získa sha + obsah
 * 4. Validuje že všetky kľúče v `changes` existujú v aktuálnom JSON (no new keys)
 * 5. Hlboký merge dot-notation kľúčov do JSON objektu
 * 6. PUT naspäť cez Contents API s optimistic locking (sha)
 * 7. Vráti { ok: true, commitUrl }
 *
 * Bezpečnosť:
 * - Žiadne keys mimo existujúcich — Štěpán nemôže zmeniť schemu
 * - Rate limit per IP (in-memory, OK pre single editor)
 * - CORS: žiadny — only same-origin fetch z našej frontend aplikácie
 * - Dispatch cez Vercel serverless — auto-deploy z git push trigeruje rebuild
 */

export const runtime = 'nodejs';

// ─── Rate limit (in-memory, per IP) ────────────────────────────────────────
// POZN: In-memory Map sa resetuje pri cold start a nie je distribuovaná
// naprieč Vercel instanciami. Pre 1 editora (Štěpán) úplne stačí.
// Ak by bolo viac editorov paralelne, migrácia na @upstash/ratelimit.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) return false;
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return true;
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown';
  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}

// ─── JWT verification ──────────────────────────────────────────────────────
function getSecret(): Uint8Array {
  const secret = process.env.EDIT_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('EDIT_JWT_SECRET is not configured');
  }
  return new TextEncoder().encode(secret);
}

async function verifyAuthHeader(request: Request): Promise<boolean> {
  const header = request.headers.get('authorization') ?? '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return false;
  try {
    const { payload } = await jwtVerify(match[1], getSecret(), {
      issuer: 'tvujspecialista-editor',
    });
    return payload.role === 'editor';
  } catch {
    return false;
  }
}

// ─── Dot-notation merge ────────────────────────────────────────────────────
/** Hlboký merge: `setDotPath(obj, "a.b.c", "x")` → `obj.a.b.c = "x"` */
function setDotPath(obj: Record<string, unknown>, path: string, value: string): void {
  const parts = path.split('.');
  let cursor: Record<string, unknown> = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (typeof cursor[key] !== 'object' || cursor[key] === null) {
      throw new Error(`Invalid path: "${path}" — "${parts.slice(0, i + 1).join('.')}" is not an object`);
    }
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[parts[parts.length - 1]] = value;
}

/** Overenie: existuje táto cesta v pôvodnom JSON? (anti-schema-drift guard) */
function hasDotPath(obj: Record<string, unknown>, path: string): boolean {
  const parts = path.split('.');
  let cursor: unknown = obj;
  for (const key of parts) {
    if (typeof cursor !== 'object' || cursor === null) return false;
    cursor = (cursor as Record<string, unknown>)[key];
  }
  return typeof cursor === 'string';
}

// ─── GitHub Contents API ───────────────────────────────────────────────────
interface GithubContentsResponse {
  sha: string;
  content: string; // base64
  encoding: 'base64';
}

interface GithubPutResponse {
  commit: { html_url: string };
  content: { html_url: string };
}

const SUPPORTED_LOCALES = ['sk', 'cs', 'en', 'pl'] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

function isSupportedLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(v);
}

async function fetchCurrentMessages(locale: Locale): Promise<{
  sha: string;
  json: Record<string, unknown>;
}> {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;
  if (!owner || !repo || !token) {
    throw new Error('GitHub config missing (GITHUB_OWNER / GITHUB_REPO / GITHUB_TOKEN)');
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/messages/${locale}.json`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'tvujspecialista-editor',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub GET failed: ${res.status} ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as GithubContentsResponse;
  const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
  return {
    sha: data.sha,
    json: JSON.parse(decoded) as Record<string, unknown>,
  };
}

async function commitMessages(
  locale: Locale,
  newJson: Record<string, unknown>,
  sha: string,
  changeCount: number
): Promise<string> {
  const owner = process.env.GITHUB_OWNER!;
  const repo = process.env.GITHUB_REPO!;
  const token = process.env.GITHUB_TOKEN!;

  const content = Buffer.from(JSON.stringify(newJson, null, 2) + '\n', 'utf-8').toString('base64');
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/messages/${locale}.json`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'tvujspecialista-editor',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `chore(cms): update ${locale} texts (${changeCount} change${changeCount === 1 ? '' : 's'}) [editor]`,
      content,
      sha,
      branch: 'main',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub PUT failed: ${res.status} ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as GithubPutResponse;
  return data.commit.html_url;
}

// ─── Parse bracket-marker syntax back to <serif>...</serif> ───────────────
/**
 * Štěpán edituje rich texty v "bracket" forme: `Najlepší [špecialisti], ktorým...`
 * My ukladáme do JSON pôvodnú `<serif>` syntax ktorú t.rich očakáva.
 * Konverzia: `[foo]` → `<serif>foo</serif>`
 *
 * Ochrana: ak pôvodný text obsahuje `<serif>...</serif>`, rešpektujeme bracket roundtrip.
 * Ak nemá (plain text), brackets sa zachovajú ako obyčajné znaky.
 */
function bracketToSerif(text: string, originalHadRichMarker: boolean): string {
  if (!originalHadRichMarker) return text; // plain texts: brackets stay as-is
  // iba prvý výskyt — pre našu aktuálnu hero štruktúru stačí jedna
  return text.replace(/\[([^\]]+)\]/, '<serif>$1</serif>');
}

function hasSerifMarker(v: unknown): boolean {
  return typeof v === 'string' && /<serif>.*<\/serif>/.test(v);
}

function getOriginalValue(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.');
  let cursor: unknown = obj;
  for (const key of parts) {
    if (typeof cursor !== 'object' || cursor === null) return undefined;
    cursor = (cursor as Record<string, unknown>)[key];
  }
  return typeof cursor === 'string' ? cursor : undefined;
}

// ─── Main handler ──────────────────────────────────────────────────────────
interface EditPayload {
  locale: unknown;
  changes: unknown;
}

export async function POST(request: Request) {
  try {
    // 1. Auth
    const authOk = await verifyAuthHeader(request);
    if (!authOk) {
      return NextResponse.json({ error: 'Neautorizovaný prístup.' }, { status: 401 });
    }

    // 2. Rate limit
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Príliš veľa pokusov. Skús to za chvíľu.' },
        { status: 429 }
      );
    }

    // 3. Parse + validate payload
    const body = (await request.json()) as EditPayload;
    if (!isSupportedLocale(body.locale)) {
      return NextResponse.json({ error: 'Nepodporovaný jazyk.' }, { status: 400 });
    }
    const locale = body.locale;

    if (!body.changes || typeof body.changes !== 'object' || Array.isArray(body.changes)) {
      return NextResponse.json({ error: 'changes musí byť objekt.' }, { status: 400 });
    }
    const changes = body.changes as Record<string, unknown>;
    const keys = Object.keys(changes);
    if (keys.length === 0) {
      return NextResponse.json({ error: 'Žiadne zmeny.' }, { status: 400 });
    }
    if (keys.length > 100) {
      return NextResponse.json({ error: 'Max 100 zmien naraz.' }, { status: 400 });
    }
    for (const k of keys) {
      const v = changes[k];
      if (typeof v !== 'string') {
        return NextResponse.json(
          { error: `Hodnota pre "${k}" musí byť text.` },
          { status: 400 }
        );
      }
      if (v.length > 5000) {
        return NextResponse.json(
          { error: `Hodnota pre "${k}" je príliš dlhá (max 5000 znakov).` },
          { status: 400 }
        );
      }
    }

    // 4. Fetch current messages + validate keys exist
    const { sha, json: currentJson } = await fetchCurrentMessages(locale);

    for (const k of keys) {
      if (!hasDotPath(currentJson, k)) {
        return NextResponse.json(
          { error: `Kľúč "${k}" neexistuje v ${locale}.json — nové kľúče sa pridávajú iba cez kód.` },
          { status: 400 }
        );
      }
    }

    // 5. Apply changes (convert bracket syntax to <serif> for rich texts)
    for (const k of keys) {
      const original = getOriginalValue(currentJson, k);
      const newRaw = changes[k] as string;
      const newValue = bracketToSerif(newRaw, hasSerifMarker(original));
      setDotPath(currentJson, k, newValue);
    }

    // 6. Commit
    const commitUrl = await commitMessages(locale, currentJson, sha, keys.length);

    return NextResponse.json({
      ok: true,
      commitUrl,
      changesApplied: keys.length,
    });
  } catch (err) {
    console.error('[edit-text] error:', err);
    const message = err instanceof Error ? err.message : 'Neznáma chyba.';
    return NextResponse.json(
      { error: `Chyba pri ukladaní: ${message}` },
      { status: 500 }
    );
  }
}
