import cryptoJs from 'crypto-js';

// Encrypts text using AES-256 and the 32-character room code as the passphrase
export const encryptMessage = (text: string, roomCode: string): string => {
  if (!text || !roomCode) return text; // Fallback entirely if missing setup
  return cryptoJs.AES.encrypt(text, roomCode).toString();
};

export const decryptMessage = (encryptedText: string, roomCode: string): string => {
  if (!encryptedText || !roomCode) return encryptedText;
  try {
    const bytes = cryptoJs.AES.decrypt(encryptedText, roomCode);
    const decrypted = bytes.toString(cryptoJs.enc.Utf8);
    // If decryption fails, it may be empty string
    return decrypted || '[Decryption Failed]';
  } catch (error) {
    return '[Encrypted Message]';
  }
};

// Generate a random 32-character alphanumeric code
export const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  // Cryptographically strong random if possible, otherwise Math.random
  const array = new Uint32Array(32);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < 32; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
};
