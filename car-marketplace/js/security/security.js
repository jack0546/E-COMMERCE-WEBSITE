/* ============================================
   Security Module - Encryption & Hashing
   ============================================ */
const SecurityUtil = (() => {
  const SALT_LENGTH = 16;
  const ITERATIONS = 100000;
  const KEY_LENGTH = 256;

  function generateSalt() {
    const array = new Uint8Array(SALT_LENGTH);
    crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  }

  function generateToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  }

  async function deriveKey(password, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt: enc.encode(salt), iterations: ITERATIONS, hash: 'SHA-256' },
      keyMaterial,
      KEY_LENGTH
    );
    return Array.from(new Uint8Array(bits), b => b.toString(16).padStart(2, '0')).join('');
  }

  async function hashPassword(password) {
    const salt = generateSalt();
    const hash = await deriveKey(password, salt);
    return salt + ':' + hash;
  }

  async function verifyPassword(password, storedHash) {
    const [salt, hash] = storedHash.split(':');
    const derivedHash = await deriveKey(password, salt);
    return derivedHash === hash;
  }

  function encryptData(data) {
    const json = JSON.stringify(data);
    return btoa(encodeURIComponent(json));
  }

  function decryptData(encrypted) {
    try {
      return JSON.parse(decodeURIComponent(atob(encrypted)));
    } catch {
      return null;
    }
  }

  return { generateSalt, generateToken, hashPassword, verifyPassword, encryptData, decryptData };
})();

window.SecurityUtil = SecurityUtil;
