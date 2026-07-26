interface AccessTokenPayload {
  sub?: string;
  exp?: number;
}

const decodeAccessToken = (accessToken: string | null): AccessTokenPayload | null => {
  if (!accessToken) return null;

  try {
    const payloadPart = accessToken.split('.')[1];
    if (!payloadPart) return null;

    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return JSON.parse(atob(padded)) as AccessTokenPayload;
  } catch {
    return null;
  }
};

export const isAccessTokenValid = (accessToken: string | null): boolean => {
  const payload = decodeAccessToken(accessToken);
  if (!payload) return false;

  const memberId = Number(payload.sub);
  const expiresAt = Number(payload.exp);

  return (
    Number.isSafeInteger(memberId) &&
    memberId > 0 &&
    Number.isFinite(expiresAt) &&
    expiresAt * 1000 > Date.now()
  );
};

export const getMemberIdFromAccessToken = (accessToken: string | null): number | null => {
  const payload = decodeAccessToken(accessToken);
  const memberId = Number(payload?.sub);

  return Number.isSafeInteger(memberId) && memberId > 0 ? memberId : null;
};
