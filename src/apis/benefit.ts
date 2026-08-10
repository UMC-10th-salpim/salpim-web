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
}

export const getBenefitDetail = async (benefitId : number) : Promise<BenefitDetailResult> => {
  const {data} = await client.get<ApiResponse<BenefitDetailResult>>(`/benefits/${benefitId}`);
  return data.result;
}

export const MOCK_BENEFITS: Benefit[] = [
  { 
    id: 1, 
    category: '지원금', 
    icon: '/icons/benefit/house.png', 
    title: 'OO광역시 노인 의료비 지원 사업', 
    isOnline: true,
    deadline: '2026년 7월 25일 마감',
    ageLimit: '만 65세 이상',
    eligibility: '기초 생활 수급자 또는 차상위계층 어르신',
    benefitContent: '병원 진료비의 50% 지원',
    targetPerson: '병원비가 부담스러운 어르신',
    url: 'https://www.bokjiro.go.kr/ssis-tbu/index.do',
},
  { 
    id: 2, 
    category: '지원금', 
    icon: '/icons/benefit/house.png', 
    title: 'XX광역시 노인 의료비 지원 사업', 
    isOnline: false,
    deadline: '2026년 7월 15일 마감',
    ageLimit: '만 70세 이상',
    eligibility: '해당 지역 거주 어르신',
    benefitContent: '의료비 실비 지원',
    targetPerson: '의료비 지원이 부족한 어르신',
    facilityName: 'OO 주민센터',
    facilityDistance: '0.6km',
    facilityHours: '09:00~18:00',
},
  {
    id: 4,
    category: '돌봄',
    icon: '/icons/benefit/handshake.png', 
    title: 'OO시 노인 돌봄 지원 사업',
    isOnline: false,
    deadline: '2026년 8월 1일 마감',
    ageLimit: '만 65세 이상',
    eligibility: '독거노인 또는 돌봄이 필요한 어르신',
    benefitContent: '주 2회 방문 돌봄 서비스 지원',
    targetPerson: '혼자 생활하며 돌봄이 필요한 어르신',
    facilityName: 'OO 주민센터',
    facilityDistance: '0.6km',
    facilityHours: '09:00~18:00',
},
  {
    id: 3,
    category: '지원금', 
    icon: '/icons/benefit/house.png', 
    title: '**광역시 노인 의료비 지원 사업', 
    isOnline: true,
    deadline: '2026년 7월 5일',
    ageLimit: '만 60세 이상',
    eligibility: '저소득 어르신',
    benefitContent: '의료비 바우처 지금',
    targetPerson: '의료 혜택이 필요한 어르신',
    url: 'https://www.bokjiro.go.kr/ssis-tbu/index.do',
},
];