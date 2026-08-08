import client from '@/apis/client';

// 신청 방법 : 방문 | 온라인 | 전화
export type ApplicationType = 'VISIT' | 'ONLINE' | 'PHONE';
// 연령 조건 상태 : 제한 없음 | 제한 있음 | 확인 불가
export type AgeConditionStatus = 'NO_RESTRICTION' | 'RESTRICTED' | 'UNKNOWN';

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface BenefitApplicationHelperResult {
  benefitId: number;
  title: string;
  applicationUrl: string | null;
  contact: string | null;
  organization: string; // 담당 기관
  isOnlineApplicationAvailable: boolean; //온라인 신청 가능 여부
  applicationTypeList: ApplicationType[];
  applicationEndDate: string | null; // "2026-08-03"
  isRegionSatisfied: boolean;
  ageConditionStatus: AgeConditionStatus;
  minAge: number | null;
  maxAge: number | null;
  isAgeSatisfied: boolean | null;
}

export const getBenefitApplicationHelper = async (
  benefitId: number
): Promise<BenefitApplicationHelperResult> => {
  const { data } = await client.get<ApiResponse<BenefitApplicationHelperResult>>(
    `/benefits/${benefitId}/application-helper`
  );
  return data.result;
};