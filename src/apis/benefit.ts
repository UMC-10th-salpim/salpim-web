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
  url?: string;
  // 오프라인만
  facilityName?: string; // OO 주민센터
  facilityDistance?: string; // 주민센터 거리
  facilityHours?: string; // 운영시간
}
export const CATEGORY_ICONS : Record<string, string> = {
  medical: '/icons/benefit/hospital.png', // 의료 지원
  living: '/icons/benefit/money.png', // 생활비
  housing: '/icons/benefit/house.png', // 주거 지원
  care: '/icons/benefit/handshake.png', // 돌봄
  culture: '/icons/benefit/mask.png', // 문화 활동
  job: '/icons/benefit/work.png', // 일자리
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