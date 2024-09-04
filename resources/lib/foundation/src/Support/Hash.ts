export function hash(length: number = 16): string {
  return Array.from(window.crypto.getRandomValues(new Uint8Array(Math.ceil(length / 2))), (b) => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');
}
