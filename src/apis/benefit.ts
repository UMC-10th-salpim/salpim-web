// TODO: 혜택 관련 API 함수 구현
export const benefitApi = {};

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
  // 오프라인만
  facilityName?: string; // OO 주민센터
  facilityDistane?: string; // 주민센터 거리
  facilityHours?: string; // 운영시간
}

export const MOCK_BENEFITS: Benefit[] = [
  { 
    id: 1, 
    category: '지원금', 
    icon: '/icons/housing.png', 
    title: 'OO광역시 노인 의료비 지원 사업', 
    isOnline: true,
    deadline: '2026년 7월 25일 마감',
    ageLimit: '만 65세 이상',
    eligibility: '기초 생활 수급자 또는 차상위계층 어르신',
    benefitContent: '병원 진료비의 50% 지원',
    targetPerson: '병원비가 부담스러운 어르신'
},
  { 
    id: 2, 
    category: '지원금', 
    icon: '/icons/housing.png', 
    title: 'XX광역시 노인 의료비 지원 사업', 
    isOnline: false,
    deadline: '2026년 7월 15일 마감',
    ageLimit: '만 70세 이상',
    eligibility: '해당 지역 거주 어르신',
    benefitContent: '의료비 실비 지원',
    targetPerson: '의료비 지원이 부족한 어르신',
    facilityName: 'OO 주민센터',
    facilityDistane: '0.6km',
    facilityHours: '09:00~18:00',
},
  { 
    id: 3, 
    category: '지원금', 
    icon: '/icons/housing.png', 
    title: '**광역시 노인 의료비 지원 사업', 
    isOnline: true,
    deadline: '2026년 7월 5일',
    ageLimit: '만 60세 이상',
    eligibility: '저소득 어르신',
    benefitContent: '의료비 바우처 지금',
    targetPerson: '의료 혜택이 필요한 어르신',
},
];