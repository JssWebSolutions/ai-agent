// Browser-compatible base64 encoding/decoding with URL-safe characters
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  // Use URL-safe base64 encoding
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  try {
    // Restore base64 padding and standard characters
    const standardBase64 = base64
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Add padding if needed
    const pad = standardBase64.length % 4;
    const paddedBase64 = pad 
      ? standardBase64 + '='.repeat(4 - pad)
      : standardBase64;

    const binary = atob(paddedBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (error) {
    throw new Error('Invalid base64 string');
  }
}

// Use a consistent encryption key length
const ALGORITHM = 'AES-GCM';
const IV_LENGTH = 12;
const SALT = new Uint8Array([
  0x63, 0x72, 0x79, 0x70, 0x74, 0x6f, 0x73, 0x61, 0x6c, 0x74, 0x32, 0x33
]); // Fixed salt for consistent key derivation

// Get encryption key from a string
async function getKey(text: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(text),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: SALT,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: ALGORITHM, length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function encrypt(text: string): Promise<string> {
  if (!text) return '';
  
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    // Generate a consistent key
    const key = await getKey('fixed-key');
    
    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    
    // Encrypt
    const encrypted = await crypto.subtle.encrypt(
      { name: ALGORITHM, iv },
      key,
      data
    );

    // Combine IV and encrypted data
    const encryptedArray = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);

    // Convert to URL-safe base64
    return arrayBufferToBase64(combined);
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

export async function decrypt(encryptedData: string): Promise<string> {
  if (!encryptedData) return '';
  
  try {
    // Convert from base64
    const combined = new Uint8Array(base64ToArrayBuffer(encryptedData));
    
    if (combined.length < IV_LENGTH) {
      throw new Error('Invalid encrypted data length');
    }
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, IV_LENGTH);
    const encrypted = combined.slice(IV_LENGTH);
    
    // Get the same key used for encryption
    const key = await getKey('fixed-key');
    
    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      encrypted
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data. The data may be corrupted or invalid.');
  }
}