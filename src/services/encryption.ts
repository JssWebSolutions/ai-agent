// Browser-compatible encryption using Web Crypto API
export async function encrypt(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  const key = await window.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt']
  );

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  const encryptedArray = new Uint8Array(encrypted);
  return `${btoa(String.fromCharCode(...iv))}:${btoa(String.fromCharCode(...encryptedArray))}`;
}

export async function decrypt(encryptedData: string): Promise<string> {
  const [ivString, dataString] = encryptedData.split(':');
  const iv = new Uint8Array([...atob(ivString)].map(char => char.charCodeAt(0)));
  const data = new Uint8Array([...atob(dataString)].map(char => char.charCodeAt(0)));

  const key = await window.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['decrypt']
  );

  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  return new TextDecoder().decode(decrypted);
}