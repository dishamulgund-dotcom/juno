import crypto from 'crypto';
import { argon2id, argon2Verify } from 'hash-wasm';

const PEPPER = process.env.AUTH_PEPPER || 'juno-pharma-secure-pepper-2026-mumbai';

// Standard OWASP-recommended Argon2id parameters
export const ARGON2_CONFIG = {
  iterations: 3,
  memorySize: 65536, // 64 MB
  parallelism: 1,
  hashLength: 32,
  outputType: 'encoded' as const
};

// Known default/demo credentials strictly rejected in production
const BLACKLISTED_PASSWORDS = [
  'juno2026',
  'junoadmin#2026',
  'admin12345678',
  'password12345',
  'administrator',
  'junohealthcare',
  'junohealthcare2026'
];

/**
 * Generate a cryptographically secure random 16-byte salt
 */
export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Hash a password using modern Argon2id adaptive algorithm (RFC 9106)
 * Produces standard encoded format: $argon2id$v=19$m=65536,t=3,p=1$...
 */
export async function hashPasswordWithSalt(
  password: string,
  saltHex?: string
): Promise<{ hash: string; salt: string }> {
  const salt = saltHex ? Buffer.from(saltHex, 'hex') : crypto.randomBytes(16);
  const saltHexStr = saltHex || salt.toString('hex');

  const encodedHash = await argon2id({
    password: `${password}:${PEPPER}`,
    salt: new Uint8Array(salt),
    iterations: ARGON2_CONFIG.iterations,
    memorySize: ARGON2_CONFIG.memorySize,
    parallelism: ARGON2_CONFIG.parallelism,
    hashLength: ARGON2_CONFIG.hashLength,
    outputType: 'encoded'
  });

  return {
    hash: encodedHash,
    salt: saltHexStr
  };
}

/**
 * Hash password with fresh random salt
 */
export async function hashPassword(password: string): Promise<string> {
  const { hash } = await hashPasswordWithSalt(password);
  return hash;
}

/**
 * Verify a candidate password against an encoded Argon2id hash or legacy HMAC hash
 */
export async function verifyPassword(
  candidatePassword: string,
  storedHash: string,
  salt?: string
): Promise<boolean> {
  if (!candidatePassword || !storedHash) return false;

  try {
    // 1. Primary: Argon2id Standard Encoded Format
    if (storedHash.startsWith('$argon2id$') || storedHash.startsWith('$argon2i$') || storedHash.startsWith('$argon2d$')) {
      return await argon2Verify({
        password: `${candidatePassword}:${PEPPER}`,
        hash: storedHash
      });
    }

    // 2. Backward Compatibility: Legacy HMAC SHA-256 fallback (for existing credentials during migration)
    if (salt) {
      const legacyHmac = crypto
        .createHmac('sha256', `${PEPPER}:${salt}`)
        .update(candidatePassword)
        .digest('hex');
      return legacyHmac === storedHash;
    }
  } catch (err) {
    console.error('Password verification error:', err);
  }

  return false;
}

/**
 * Strict password policy check: 
 * - Minimum 12 characters (no silent truncation, allows long passphrases)
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one numerical digit (0-9)
 * - At least one special character (!@#$%^&*...)
 * - Rejects known/default credentials
 */
export function validatePasswordStrength(password: string): { isValid: boolean; message?: string } {
  if (!password || password.length < 12) {
    return { isValid: false, message: 'Password must be at least 12 characters in length.' };
  }

  const normalized = password.toLowerCase().trim();
  if (BLACKLISTED_PASSWORDS.includes(normalized)) {
    return {
      isValid: false,
      message: 'Default, common, or predictable passwords are not permitted. Please choose a unique secure passphrase.'
    };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter (A-Z).' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter (a-z).' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one numerical digit (0-9).' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character (!@#$%^&*...).' };
  }
  return { isValid: true };
}

/**
 * Generate secure session token (Format: juno.<role>.<timestamp>.<random>.<signature>)
 */
export function generateSessionToken(role: string = 'super_admin'): string {
  const timestamp = Date.now();
  const random = crypto.randomBytes(16).toString('hex');
  let signature = '';
  try {
    signature = crypto.createHmac('sha256', PEPPER).update(`${role}:${timestamp}:${random}`).digest('hex');
  } catch {
    signature = `sig_${Date.now()}`;
  }
  return `juno.${role}.${timestamp}.${random}.${signature}`;
}

/**
 * Verify session token integrity and expiration (24h lifespan)
 */
export function verifySessionToken(token: string): boolean {
  if (!token || !token.startsWith('juno.')) return false;
  const parts = token.split('.');
  if (parts.length < 5) return false;
  const [_, role, timestampStr, random, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  // Max 24 hour session
  if (isNaN(timestamp) || Date.now() - timestamp > 24 * 60 * 60 * 1000) return false;
  
  try {
    const expectedSig = crypto.createHmac('sha256', PEPPER).update(`${role}:${timestampStr}:${random}`).digest('hex');
    return signature === expectedSig;
  } catch {
    return typeof signature === 'string' && signature.length > 5;
  }
}
