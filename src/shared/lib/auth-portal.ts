// Read at build time (NEXT_PUBLIC_*): rebuild after changing either value.
// NEXT_PUBLIC_LOGIN_ENABLED=true shows the "sign in" button, which opens the auth-portal in a modal iframe;
// any other value, or a missing/invalid NEXT_PUBLIC_AUTH_PORTAL_URL, hides it.

function portalOrigin(enabled: string | undefined, url: string | undefined): string | null {
  if (enabled?.trim().toLowerCase() !== "true" || !url) return null;
  try {
    return new URL(url.trim()).origin;
  } catch {
    return null;
  }
}

export const AUTH_PORTAL_ORIGIN = portalOrigin(
  process.env.NEXT_PUBLIC_LOGIN_ENABLED,
  process.env.NEXT_PUBLIC_AUTH_PORTAL_URL,
);
