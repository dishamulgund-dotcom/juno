/**
 * Brute-force Login Rate Limiter
 * Tracks failed authentication attempts within a sliding time window.
 */

interface RateLimitRecord {
  failedAttempts: number;
  firstAttemptTime: number;
  lastAttemptTime: number;
  lockedUntil?: number;
}

const loginAttempts = new Map<string, RateLimitRecord>();

const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes window
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout

// Clean up stale records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of loginAttempts.entries()) {
    if (now - record.lastAttemptTime > WINDOW_MS * 2 && (!record.lockedUntil || now > record.lockedUntil)) {
      loginAttempts.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function checkLoginRateLimit(identifier: string): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
  message?: string;
} {
  const cleanId = (identifier || 'unknown').trim();
  const record = loginAttempts.get(cleanId);
  const now = Date.now();

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  // Check if actively locked out
  if (record.lockedUntil && now < record.lockedUntil) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds,
      message: `Too many failed login attempts. Account temporarily locked for security. Please try again in ${retryAfterSeconds} seconds.`
    };
  }

  // If previous window expired and not locked, reset
  if (now - record.firstAttemptTime > WINDOW_MS) {
    loginAttempts.delete(cleanId);
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - record.failedAttempts);
  return {
    allowed: remaining > 0,
    remainingAttempts: remaining
  };
}

export function recordFailedLoginAttempt(identifier: string): {
  isLocked: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
} {
  const cleanId = (identifier || 'unknown').trim();
  const now = Date.now();
  let record = loginAttempts.get(cleanId);

  if (!record || (now - record.firstAttemptTime > WINDOW_MS && !record.lockedUntil)) {
    record = {
      failedAttempts: 1,
      firstAttemptTime: now,
      lastAttemptTime: now
    };
  } else {
    record.failedAttempts += 1;
    record.lastAttemptTime = now;
  }

  if (record.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
    loginAttempts.set(cleanId, record);
    return {
      isLocked: true,
      remainingAttempts: 0,
      retryAfterSeconds: Math.ceil(LOCKOUT_MS / 1000)
    };
  }

  loginAttempts.set(cleanId, record);
  return {
    isLocked: false,
    remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - record.failedAttempts)
  };
}

export function resetLoginRateLimit(identifier: string): void {
  const cleanId = (identifier || 'unknown').trim();
  loginAttempts.delete(cleanId);
}
