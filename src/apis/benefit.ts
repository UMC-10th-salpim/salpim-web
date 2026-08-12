import client from "./client";

// 공통 응답 타임
interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result : T;
}

// 혜택 목록 조회
export interface BenefitListItem {
  benefitId : number;
  benefitTitle: string;
  benefitCategory: string;
}

export interface BenefitListResult {
  data : BenefitListItem[];
  hasNext: boolean;
  nextCursor: string;
  pageSize: number;
  totalCount: number;
}

export interface DeadlineSoonBenefit {
  benefitId: number;
  title: string;
  applicationEndDate: string | null;
  dDay: number | null;
}

export interface FavoriteBenefit {
  benefitId: number;
  title: string;
  applicationEndDate: string | null;
  minAge: number | null;
}

export interface FavoriteBenefitPage {
  data: FavoriteBenefit[];
  hasNext: boolean;
  nextCursor: string | null;
  pageSize: number;
  totalCount: number;
}

export const benefitApi = {
  //살피미 추천
  getRecommendationResult : async (params: {
    optionId: number;
    cursor?: string;
    pageSize?: number;
  }) => {
    const { data } = await client.get<ApiResponse<BenefitListResult>>('/recommendations/result', {
      params: {
        ...params,
        cursor: params.cursor ?? '-1',
      },
    });
    return data.result;
  },

  // 직접 찾기 (검색/조건)
  searchBenefits: async (params: {
    searchKey?: string;
    regionIds: number[];
    categoryIds?: number[];
    cursor?: string;
    pageSize?: number;
    sort?: 'popular' | 'deadline';
  }) => {
    const {data} = await client.get<ApiResponse<BenefitListResult>>('/benefits/search', {
      params : {
        ...params,
        cursor: params.cursor ?? '-1',
      },
    });
    return data.result;
  },

  getFavoriteDeadlineSoon: async () => {
    const { data } = await client.get<ApiResponse<DeadlineSoonBenefit[]>>(
      '/benefits/favorites/deadline-soon'
    );
    return data.result ?? [];
  },

  getFavoriteBenefits: async (params: { pageNumber?: number; pageSize?: number } = {}) => {
    const { data } = await client.get<ApiResponse<FavoriteBenefitPage>>('/benefits/favorites', {
      params: {
        pageNumber: params.pageNumber ?? 0,
        pageSize: params.pageSize ?? 10,
      },
    });
    return data.result;
  },

  isFavoriteBenefit: async (benefitId: number) => {
    let pageNumber = 0;

    while (pageNumber < 100) {
      const { data } = await client.get<ApiResponse<FavoriteBenefitPage>>('/benefits/favorites', {
        params: { pageNumber, pageSize: 100 },
      });
      const page = data.result;
      if (page.data.some((benefit) => benefit.benefitId === benefitId)) return true;
      if (!page.hasNext) return false;
      pageNumber += 1;
    }

    return false;
  },
};

export interface Benefit {
  id: number;
  category: string;
  icon: string;
  title: string;
  isOnline: boolean;
  deadline: string;
  ageLimit: string;
  eligibility: string; // 신청자격
  benefitContent: string; // 혜택 내용
  targetPerson: string; // 어떤 사람이 받으면 좋을까?
  url?: string;
  // 오프라인만
  facilityName?: string; // OO 주민센터
  facilityDistance?: string; // 주민센터 거리
  facilityHours?: string; // 운영시간
}

export const CATEGORY_ICONS : {keyword: string; icon: string}[] = [
  { keyword: '의료', icon: '/icons/benefit/hospital.png' },
  { keyword: '생활비', icon: '/icons/benefit/money.png' },
  { keyword: '요금', icon: '/icons/benefit/money.png' },
  { keyword: '돌봄', icon: '/icons/benefit/handshake.png' },
  { keyword: '주거', icon: '/icons/benefit/house.png' },
  { keyword: '일자리', icon: '/icons/benefit/work.png' },
  { keyword: '문화', icon: '/icons/benefit/mask.png' },
  { keyword: '배움', icon: '/icons/benefit/mask.png' },
]

const DEFAULT_BENEFIT_ICON = '';

export const getBenefitIcon = (category: string): string => {
  const matched = CATEGORY_ICONS.find((item) => category.includes(item.keyword));
  return matched?.icon ?? DEFAULT_BENEFIT_ICON;
};

export type AgeConditionStatus = 'NO_RESTRICTION' | 'RESTRICTED' | 'UNKNOWN';

export interface BenefitDetailResult {
  title: string;
  easySummary: string;
  whoCanReceive: string;
  whatYouReceive: string;
  recommendedFor: string;
  applicationStartDate : string | null;
  applicationEndDate : string | null;
  applicationUrl : string | null;
  welfareCategoryName : string;
  minAge : number | null;
  maxAge : number | null;
  ageConditionStatus : AgeConditionStatus;
  isOnlineApplicationAvailable: boolean;
  isFavorite?: boolean;
}

export const getBenefitDetail = async (benefitId : number) : Promise<BenefitDetailResult> => {
  const {data} = await client.get<ApiResponse<BenefitDetailResult>>(`/benefits/${benefitId}`);
  return data.result;
}

export interface FavoriteResult {
  benefitId: number;
  isFavorite: boolean;
}

export const updateFavorite = async (
  benefitId : number,
  isFavorite: boolean,
): Promise <FavoriteResult> => {
  const {data} = await client.put<ApiResponse<FavoriteResult>> (
    `/benefits/${benefitId}/favorite`,
    {isFavorite}
  );
    return data.result;
}

export interface BenefitShareResult {
  title: string;
  summary: string;
}

export const getBenefitShareInfo = async (benefitId: number): Promise<BenefitShareResult> => {
  const { data } = await client.get<ApiResponse<BenefitShareResult>>(`/benefits/${benefitId}/share`);
  return data.result;
};

export interface WelfareCenterResult {
  welfareCenter : string;
}

export const getMyWelfareCenter = async () : Promise<WelfareCenterResult> => {
  const {data} = await client.get<ApiResponse<WelfareCenterResult>>('/users/me/welfare-center');
  return data.result;
}