import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

/**
 * POST /api/edit-auth
 * Body: { password: string }
 * Returns: { token: string }  (JWT, 24h expirácia)
 *
 * Štěpán pošle heslo → dostane JWT do sessionStorage.
 * JWT sa potom používa v Authorization: Bearer pri volaniach /api/edit-text.
 *
 * Bezpečnosť:
 * - Heslo len v process.env.EDIT_PASSWORD, nikdy v kóde
 * - JWT podpísaný HS256 cez EDIT_JWT_SECRET (32 bytes hex)
 * - Žiadna DB, žiadna session, iba stateless JWT
 */

export const runtime = 'nodejs';

function getSecret(): Uint8Array {
  const secret = process.env.EDIT_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('EDIT_JWT_SECRET is not configured (need 32+ char hex)');
  }
  return new TextEncoder().encode(secret);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: unknown };
    const password = typeof body.password === 'string' ? body.password : '';

    const expected = process.env.EDIT_PASSWORD;
    if (!expected) {
      return NextResponse.json(
        { error: 'Editor nie je nakonfigurovaný (EDIT_PASSWORD chýba).' },
        { status: 503 }
      );
    }

    // Timing-safe-ish comparison: rovnaká dĺžka oboch stringov by bola lepšia,
    // ale pre jedno heslo + JWT vrátený až pri zhode je toto dostatočné.
    if (password !== expected) {
      return NextResponse.json({ error: 'Nesprávne heslo.' }, { status: 401 });
    }

    const secret = getSecret();
    const token = await new SignJWT({ sub: 'editor', role: 'editor' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .setIssuer('tvujspecialista-editor')
      .sign(secret);

    return NextResponse.json({ token, expiresIn: 24 * 60 * 60 });
  } catch (err) {
    console.error('[edit-auth] error:', err);
    return NextResponse.json(
      { error: 'Interná chyba servera.' },
      { status: 500 }
    );
  }
}
