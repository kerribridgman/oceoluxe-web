/**
 * Simple in-memory rate limiter for authentication endpoints.
 * Tracks attempts by key (e.g., IP address or email) and blocks
 * after exceeding the limit within the window.
 *
 * Note: For production at scale, consider using Redis or a dedicated
 * rate limiting service for distributed rate limiting across instances.
 */

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
}

// Store rate limit entries in memory
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup interval (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;

// Clean up expired entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      // Remove entries older than 1 hour
      if (now - entry.firstAttempt > 60 * 60 * 1000) {
        rateLimitStore.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);
}

export interface RateLimitConfig {
  /** Maximum number of attempts allowed within the window */
  maxAttempts: number;
  /** Time window in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Number of remaining attempts */
  remaining: number;
  /** Time in ms until the rate limit resets */
  resetIn: number;
}

/**
 * Check and update rate limit for a given key.
 *
 * @param key - Unique identifier (e.g., IP address, email, or combination)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig = { maxAttempts: 5, windowMs: 15 * 60 * 1000 }
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // No previous attempts
  if (!entry) {
    rateLimitStore.set(key, { count: 1, firstAttempt: now });
    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      resetIn: config.windowMs,
    };
  }

  // Check if window has expired
  const timeSinceFirst = now - entry.firstAttempt;
  if (timeSinceFirst > config.windowMs) {
    // Reset the window
    rateLimitStore.set(key, { count: 1, firstAttempt: now });
    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      resetIn: config.windowMs,
    };
  }

  // Within window - increment count
  entry.count++;
  const remaining = Math.max(0, config.maxAttempts - entry.count);
  const resetIn = config.windowMs - timeSinceFirst;

  if (entry.count > config.maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetIn,
    };
  }

  return {
    allowed: true,
    remaining,
    resetIn,
  };
}

/**
 * Reset rate limit for a key (e.g., after successful login)
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * Generate a rate limit key for authentication.
 * Combines IP and email to prevent both IP-based and email-based attacks.
 */
export function getAuthRateLimitKey(ip: string | null, email?: string): string {
  const sanitizedIp = ip || 'unknown';
  if (email) {
    return `auth:${sanitizedIp}:${email.toLowerCase()}`;
  }
  return `auth:${sanitizedIp}`;
}

// Pre-configured rate limits
export const AUTH_RATE_LIMITS = {
  // Login: 5 attempts per 15 minutes per IP+email
  login: { maxAttempts: 5, windowMs: 15 * 60 * 1000 },
  // Signup: 3 attempts per hour per IP
  signup: { maxAttempts: 3, windowMs: 60 * 60 * 1000 },
  // Password reset: 3 attempts per hour per email
  passwordReset: { maxAttempts: 3, windowMs: 60 * 60 * 1000 },
} as const;
