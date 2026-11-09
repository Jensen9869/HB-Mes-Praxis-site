import { sign, verify } from "hono/jwt";

export function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function createSession(secret: string, userId: string) {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  return sign({ sub: userId, exp }, secret, "HS256");
}

export async function readSession(secret: string, token: string | undefined) {
    if (!token){
        return null;
    }
    try{
        const payload = await verify(token, secret, "HS256");
        return typeof payload.sub === 'string' ? payload.sub: null;
    }catch {
        return null;
    }
}
