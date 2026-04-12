/**
 * TOTP (Time-based One-Time Password) — RFC 6238
 * تنفيذ نقي بدون مكتبات خارجية، يعتمد على crypto المدمج في Node.js
 */

import crypto from 'crypto';

const TOTP_STEP = 30;       // ثانية لكل كود
const TOTP_DIGITS = 6;      // طول الكود
const TOTP_WINDOW = 1;      // نطاق التسامح (±1 خطوة زمنية)
const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/** توليد سر عشوائي بترميز Base32 (160 بت = 20 بايت) */
export function generateTOTPSecret(): string {
  const bytes = crypto.randomBytes(20);
  let result = '';
  let bits = 0;
  let value = 0;
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      result += BASE32_CHARS[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    result += BASE32_CHARS[(value << (5 - bits)) & 31];
  }
  return result;
}

/** فك ترميز Base32 إلى Buffer */
function base32Decode(encoded: string): Buffer {
  const clean = encoded.toUpperCase().replace(/=+$/, '').replace(/\s/g, '');
  const bytes: number[] = [];
  let bits = 0;
  let value = 0;
  for (const char of clean) {
    const idx = BASE32_CHARS.indexOf(char);
    if (idx === -1) throw new Error(`Invalid base32 character: ${char}`);
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

/** حساب HOTP لعداد معين */
function hotp(secret: string, counter: number): string {
  const key = base32Decode(secret);
  const buf = Buffer.alloc(8);
  // كتابة الـ counter كـ big-endian 64-bit
  const hi = Math.floor(counter / 0x100000000);
  const lo = counter >>> 0;
  buf.writeUInt32BE(hi, 0);
  buf.writeUInt32BE(lo, 4);

  const hmac = crypto.createHmac('sha1', key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return String(code % Math.pow(10, TOTP_DIGITS)).padStart(TOTP_DIGITS, '0');
}

/** توليد كود TOTP الحالي */
export function generateTOTP(secret: string, timestamp?: number): string {
  const time = timestamp ?? Date.now();
  const counter = Math.floor(time / 1000 / TOTP_STEP);
  return hotp(secret, counter);
}

/** التحقق من صحة كود TOTP مع نطاق تسامح */
export function verifyTOTP(secret: string, token: string, timestamp?: number): boolean {
  const clean = token.replace(/\s/g, '');
  if (!/^\d{6}$/.test(clean)) return false;
  const time = timestamp ?? Date.now();
  const counter = Math.floor(time / 1000 / TOTP_STEP);
  for (let delta = -TOTP_WINDOW; delta <= TOTP_WINDOW; delta++) {
    if (crypto.timingSafeEqual(
      Buffer.from(hotp(secret, counter + delta)),
      Buffer.from(clean)
    )) {
      return true;
    }
  }
  return false;
}

/** توليد رابط QR Code (otpauth URI) لتطبيقات المصادقة مثل Google Authenticator */
export function generateOTPAuthURI(secret: string, email: string, issuer = 'متين'): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedEmail = encodeURIComponent(email);
  return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=${TOTP_DIGITS}&period=${TOTP_STEP}`;
}
