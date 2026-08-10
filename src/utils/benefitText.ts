export const getAgeLimitText = (
  status: 'NO_RESTRICTION' | 'RESTRICTED' | 'UNKNOWN',
  minAge: number | null,
  maxAge: number | null
): string => {
  if (status === 'NO_RESTRICTION') return '나이 조건 없음';
  if (status === 'UNKNOWN') return '나이 조건 확인 필요';

  if (minAge !== null && maxAge !== null) return `만 ${minAge}세 이상 ${maxAge}세 미만`;
  if (minAge !== null) return `만 ${minAge}세 이상`;
  if (maxAge !== null) return `만 ${maxAge}세 미만`;
  return '나이 조건 확인 필요';
};

export const getDeadlineText = (
  endDate: string | null
): string => {
  if (!endDate) return '언제나 신청 가능';

  const [y, m, d] = endDate.split('-').map(Number);
  return `${y}년 ${m}월 ${d}일 마감`;
};