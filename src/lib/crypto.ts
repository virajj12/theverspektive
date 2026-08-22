export const runtime = 'edge';

// We use 600,000 iterations for PBKDF2-HMAC-SHA256 (OWASP recommended). 
// Web Crypto is hardware-accelerated and won't consume the JS CPU budget.
const ITERATIONS = 600000;
const KEY_LEN = 32;
const HASH_ALGO = 'SHA-256';

/**
 * Hashes a password using PBKDF2.
 * Generates a random 16-byte salt for each user.
 * Returns a string in the format: pbkdf2$sha256$iterations$salt(hex)$hash(hex)
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: HASH_ALGO,
    },
    keyMaterial,
    KEY_LEN * 8
  );

  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const hashHex = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');

  return `pbkdf2$sha256$${ITERATIONS}$${saltHex}$${hashHex}`;
}

/**
 * Verifies a password against a stored PBKDF2 hash.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split('$');
  if (parts.length !== 5 || parts[0] !== 'pbkdf2') {
    return false;
  }

  const [, algo, iterationsStr, saltHex, hashHex] = parts;
  const iterations = parseInt(iterationsStr, 10);
  
  const salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: iterations,
      hash: algo === 'sha256' ? 'SHA-256' : HASH_ALGO,
    },
    keyMaterial,
    KEY_LEN * 8
  );

  const computedHash = new Uint8Array(derivedBits);
  const expectedHash = new Uint8Array(hashHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  
  // Constant-time comparison using XOR accumulator on raw bytes.
  // Never short-circuits — always iterates all bytes regardless of match.
  if (computedHash.length !== expectedHash.length) return false;
  let result = 0;
  for (let i = 0; i < computedHash.length; i++) {
    result |= computedHash[i] ^ expectedHash[i];
  }
  
  return result === 0;
}

/**
 * Generates a random secure token (e.g. for email verification or password reset)
 * Returns a tuple: [rawTokenForEmail, hashedTokenForDB]
 */
export async function generateSecureToken(): Promise<{ raw: string; hash: string }> {
  const rawBytes = crypto.getRandomValues(new Uint8Array(32));
  const raw = Array.from(rawBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Hash the token using SHA-256 for DB storage
  const enc = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', enc.encode(raw));
  const hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  
  return { raw, hash };
}

/**
 * Hashes a raw token (to check against the DB)
 */
export async function hashToken(rawToken: string): Promise<string> {
  const enc = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', enc.encode(rawToken));
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}
