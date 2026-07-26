interface AccessTokenPayload {
  sub?: string;
  exp?: number;
}

const decodeAccessToken = (accessToken: string | null): AccessTokenPayload | null => {
  if (!accessToken) return null;

  try {
    const parts = accessToken.split('.');
    if (parts.length !== 3 || parts.some((part) => !part)) return null;
    const [, payloadPart] = parts;

    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return JSON.parse(atob(padded)) as AccessTokenPayload;
  } catch {
    return null;
  }
};

export const getAccessTokenExpiresAt = (accessToken: string | null): number | null => {
  const payload = decodeAccessToken(accessToken);
  const expiresAt = Number(payload?.exp);

  return Number.isFinite(expiresAt) && expiresAt > 0 ? expiresAt * 1000 : null;
};

export const isAccessTokenValid = (accessToken: string | null): boolean => {
  const payload = decodeAccessToken(accessToken);
  if (!payload) return false;

  const memberId = Number(payload.sub);
  const expiresAt = getAccessTokenExpiresAt(accessToken);

  return (
    Number.isSafeInteger(memberId) &&
    memberId > 0 &&
    expiresAt !== null &&
    expiresAt > Date.now()
  );
};

export const getMemberIdFromAccessToken = (accessToken: string | null): number | null => {
  const payload = decodeAccessToken(accessToken);
  const memberId = Number(payload?.sub);

  return Number.isSafeInteger(memberId) && memberId > 0 ? memberId : null;
};
