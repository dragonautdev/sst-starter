import { createClient } from "@openauthjs/openauth/client";

export const client = createClient({
  clientID: "web",
  issuer: import.meta.env.VITE_AUTH_URL,
});

let token: string | undefined = undefined;

export async function refreshTokens(): Promise<string | undefined> {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return;
  const next = await client.refresh(refresh, {
    access: token,
  });
  if (next.err) return;
  if (!next.tokens) return token;

  localStorage.setItem("refresh", next.tokens.refresh);
  token = next.tokens.access;

  return next.tokens.access;
}

export async function getToken() {
  token = await refreshTokens();

  if (!token) {
    await login();
    return;
  }

  return token;
}

export async function login(): Promise<string> {
  const { challenge, url } = await client.authorize(location.origin, "code", {
    pkce: true,
  });
  sessionStorage.setItem("challenge", JSON.stringify(challenge));
  return window.location.href = url;
}

export function logout() {
  localStorage.removeItem("refresh");
  token = undefined;
  return token;
}

export async function callback(code: string, state: string): Promise<string | undefined> {
  const challenge = JSON.parse(sessionStorage.getItem("challenge")!);
  if (code) {
    if (state === challenge.state && challenge.verifier) {
      const exchanged = await client.exchange(
        code!,
        location.origin,
        challenge.verifier
      );
      if (!exchanged.err) {
        token = exchanged.tokens?.access;
        localStorage.setItem("refresh", exchanged.tokens.refresh);
      }
    }
  }

  return token;
}
