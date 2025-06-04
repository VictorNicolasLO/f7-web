export function getIatFromJWT(token: string): number {
  // JWTs have three parts separated by dots
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT');
  }

  // Decode the payload (second part of the JWT)
  const payload = parts[1];

  // Convert from base64url to base64
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

  // Decode base64 to JSON string
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );

  // Parse JSON
  const parsed = JSON.parse(jsonPayload);

  // Return the iat
  return parsed.iat;
}