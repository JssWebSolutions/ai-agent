// Browser-compatible encryption using Web Crypto API
const SALT = new Uint8Array([
  0x63, 0x72, 0x79, 0x70, 0x74, 0x6f, 0x67, 0x72,
  0x61, 0x70, 0x68, 0x69, 0x63, 0x73, 0x61, 0x6c
]);

async function getKey(password: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: SALT,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  if (!base64) return new ArrayBuffer(0);

  try {
    // Add padding if needed
    const paddedBase64 = base64.length % 4 === 0 ? base64 
      : base64 + '='.repeat(4 - (base64.length % 4));

    // Replace URL-safe characters
    const standardBase64 = paddedBase64
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    // Validate base64 string
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(standardBase64)) {
      throw new Error('Invalid base64 string');
    }

    const binary = atob(standardBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (error) {
    console.error('Invalid base64 string:', error);
    return new ArrayBuffer(0);
  }
}

export async function encrypt(text: string): Promise<string> {
  if (!text) return '';

  try {
    const key = await getKey('your-secret-password-2024');
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(text);

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return arrayBufferToBase64(combined.buffer);
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
}

export async function decrypt(encryptedData: string): Promise<string> {
  if (!encryptedData) return '';

  try {
    const key = await getKey('your-secret-password-2024');
    const data = base64ToArrayBuffer(encryptedData);
    
    // Handle empty data
    if (data.byteLength === 0) return '';

    const combined = new Uint8Array(data);
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}