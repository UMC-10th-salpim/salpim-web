export type FacilityMainCategory = '건강·의료' | '생활지원' | '문화' | '배움·일자리';

export interface FacilityCategoryGroup {
  main: FacilityMainCategory;
  options: string[];
}

export const FACILITY_CATEGORY_GROUPS: FacilityCategoryGroup[] = [
  { main: '건강·의료', options: ['보건소', '병원', '약국', '치매센터'] },
  {
    main: '생활지원',
    options: ['복지관', '주민센터', '무료급식', '생활지원센터', '요양시설', '돌봄시설'],
  },
  { main: '문화', options: ['도서관', '문화센터', '체육관'] },
  {
    main: '배움·일자리',
    options: ['평생교육원', '노인 일자리기관', '디지털 배움터', '시니어클럽'],
  },
];

export const FACILITY_MAIN_CATEGORIES: FacilityMainCategory[] = FACILITY_CATEGORY_GROUPS.map(
  (group) => group.main
);

export interface Facility {
  id: string;
  name: string;
  mainCategory: FacilityMainCategory;
  subCategory: string;
  address: string;
  detailAddress?: string;
  lat: number;
  lng: number;
  distanceFromHome: string;
  phone?: string;
  // 카카오 로컬 API는 운영시간 정보를 제공하지 않아 실데이터 사용 시 값이 없을 수 있음
  operatingHours?: string;
}

export interface MapCenter {
  lat: number;
  lng: number;
}

export interface MapRestoreState {
  selectedFacilityId: string;
  selectedSubCategories: string[];
  currentLocationCenter: MapCenter | null;
}
