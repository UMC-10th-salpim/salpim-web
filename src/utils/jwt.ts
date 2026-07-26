interface AccessTokenPayload {
  sub?: string;
}

export const getMemberIdFromAccessToken = (accessToken: string | null): number | null => {
  if (!accessToken) return null;

  try {
    const payloadPart = accessToken.split('.')[1];
    if (!payloadPart) return null;

    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const payload = JSON.parse(atob(padded)) as AccessTokenPayload;
    const memberId = Number(payload.sub);

    return Number.isSafeInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
};
