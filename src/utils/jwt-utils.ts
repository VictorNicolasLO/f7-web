export function getExpFromJWT(token: string): number | undefined {
    try {
        const parts = token.split('.')
        if (parts.length !== 3) return undefined;
        const payload = parts[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        const parsed = JSON.parse(jsonPayload);
        return parsed.exp;
    } catch {
        return undefined;
    }
}