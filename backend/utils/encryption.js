import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.ENCRYPTION_KEY
  ? crypto.scryptSync(process.env.ENCRYPTION_KEY, 'taskpilot_salt', 32)
  : crypto.scryptSync('taskpilot_default_secret_key_32_bytes', 'taskpilot_salt', 32);

/**
 * Encrypts a plain string.
 * @param {string} text 
 * @returns {string} Encrypted string (iv:ciphertext)
 */
export const encrypt = (text) => {
  if (!text) return '';
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (err) {
    console.warn('[Encryption] Failed to encrypt text:', err.message);
    return text;
  }
};

/**
 * Decrypts an encrypted string.
 * @param {string} encryptedText 
 * @returns {string} Decrypted original text
 */
export const decrypt = (encryptedText) => {
  if (!encryptedText || !encryptedText.includes(':')) return encryptedText || '';
  try {
    const [ivHex, ciphertext] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.warn('[Encryption] Failed to decrypt text:', err.message);
    return encryptedText;
  }
};

export default {
  encrypt,
  decrypt
};
