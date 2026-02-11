import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Jméno musí mít alespoň 2 znaky'),
  email: z.string().email('Zadejte platný email'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Předmět musí mít alespoň 3 znaky'),
  message: z.string().min(10, 'Zpráva musí mít alespoň 10 znaků'),
});

// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }

  if (entry.count >= 3) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Příliš mnoho požadavků. Zkuste to prosím za minutu.',
        },
        { status: 429 }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || 'Neplatná data';
      return NextResponse.json(
        {
          success: false,
          message: firstError,
        },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = result.data;

    // Log the contact submission (backend handles actual email sending)
    console.log('[Contact Form Submission]', {
      name,
      email,
      phone: phone || '(not provided)',
      subject,
      message,
      timestamp: new Date().toISOString(),
      ip,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Správa bola odoslaná',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Contact Form Error]', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Chyba při zpracování požadavku',
      },
      { status: 500 }
    );
  }
}
