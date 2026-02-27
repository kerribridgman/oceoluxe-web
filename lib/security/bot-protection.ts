import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/auth/rate-limit';

/**
 * Shared bot protection utilities for public form endpoints.
 * Mirrors the pattern established in /api/email-list/subscribe.
 */

/** Validate the proof token sent by the client */
export function isValidProofToken(timestamp: number | undefined, proof: string | undefined): boolean {
  if (!timestamp || !proof) return false;
  try {
    const expected = Buffer.from(String(timestamp).split('').reverse().join('') + 'oceo').toString('base64');
    return proof === expected;
  } catch {
    return false;
  }
}

/** Detect gibberish names commonly used by spam bots */
export function isLikelyBotName(name: string): boolean {
  if (!name || name.trim().length === 0) return false;

  const trimmed = name.trim();

  if (trimmed.length > 20 && !trimmed.includes(' ')) return true;

  let caseTransitions = 0;
  for (let i = 1; i < trimmed.length; i++) {
    const prevLower = /[a-z]/.test(trimmed[i - 1]);
    const prevUpper = /[A-Z]/.test(trimmed[i - 1]);
    const currLower = /[a-z]/.test(trimmed[i]);
    const currUpper = /[A-Z]/.test(trimmed[i]);
    if ((prevLower && currUpper) || (prevUpper && currLower)) caseTransitions++;
  }
  if (caseTransitions > 4) return true;

  if (/[^aeiouAEIOU\s\-']{5,}/.test(trimmed)) return true;

  const letters = trimmed.replace(/[^a-zA-Z]/g, '');
  if (letters.length > 6) {
    const vowelCount = (letters.match(/[aeiouAEIOU]/g) || []).length;
    if (vowelCount / letters.length < 0.15) return true;
  }

  return false;
}

/** Validate email format */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  if (email.length > 254) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  const localPart = email.split('@')[0];
  if (/\.{3,}/.test(localPart)) return false;
  return true;
}

/** HTML escape for safe email template rendering */
export function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

/**
 * Run standard bot protection checks on a public form submission.
 * Returns null if the request passes all checks, or a Response to send back.
 * Uses "silent reject" pattern — returns fake success to avoid tipping off bots.
 */
export function checkBotProtection(body: {
  _honeypot?: string;
  _t?: number;
  _proof?: string;
  name?: string;
}): NextResponse | null {
  const silentReject = () =>
    NextResponse.json({ success: true, message: 'Request received.' });

  // Honeypot: if the hidden field has a value, a bot filled it in
  if (body._honeypot) return silentReject();

  // Proof token: client must compute a token from the timestamp
  if (!isValidProofToken(body._t, body._proof)) return silentReject();

  // Timing: reject if form was submitted in under 3 seconds
  if (body._t) {
    const elapsed = Date.now() - body._t;
    if (elapsed < 3000) return silentReject();
  }

  // Gibberish name detection
  if (body.name && isLikelyBotName(body.name)) return silentReject();

  return null;
}

/**
 * Run rate limiting by IP address for a public endpoint.
 * Returns null if allowed, or a 429 Response if rate limited.
 */
export function checkPublicRateLimit(
  request: NextRequest,
  prefix: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): NextResponse | null {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rateLimit = checkRateLimit(`${prefix}:${ip}`, { maxAttempts, windowMs });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  return null;
}
